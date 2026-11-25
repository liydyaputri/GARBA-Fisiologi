/* =========================================================
   GARBA — Modul Generative AI (asisten bidan virtual)
   - Mode Online : Google Gemini API (kunci API milik pengguna, disimpan di browser)
   - Mode Offline: bank kasus + umpan balik berbasis rubrik & kata kunci
   ========================================================= */
(function () {
  const LS = { key: "garba_gemini_key", model: "garba_gemini_model", suara: "garba_suara" };
  const N = (window.GARBA && GARBA.meta.namaAI) || "Bunda Lidia";
  const AV = (window.GARBA && GARBA.meta.avatarAI) || "🧕🏻";
  const DEFAULT_MODEL = "gemini-2.5-flash";
  const CADANGAN = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

  const PERSONA = `Anda adalah "${N}", bidan dan dosen virtual di aplikasi GARBA untuk mata kuliah Fisiologi (Prodi Sarjana Kebidanan dan Profesi Bidan, Universitas Sunan Gresik), topik Fisiologi Reproduksi & Maternal (Sub-CPMK 13–14).
Cakupan: (1) siklus ovarium–menstruasi & poros hipotalamus–hipofisis–ovarium, (2) reproduksi pria & spermatogenesis, (3) fertilisasi, implantasi, hCG & hormon plasenta, (4) adaptasi fisiologis kehamilan (kardiovaskular, respirasi, ginjal, GI, metabolik), (5) fisiologi persalinan, refleks Ferguson, kala I–IV, gerakan kardinal, (6) nifas, involusi uterus, TFU & lokia, (7) laktasi (prolaktin, oksitosin, kolostrum, laktogenesis).
Rujukan utama: Guyton & Hall (2025, ed. 15), Coad dkk. (2019) Anatomy and Physiology for Midwives, Silverthorn (2022), Tortora & Derrickson (2020), Williams Obstetrics (2022), pedoman WHO.
Gaya: bahasa Indonesia yang hangat, keibuan, dan jelas, sesekali sapaan Jawa Timur ("Nggih", "Monggo"). Berikan contoh asuhan di PMB, Puskesmas, Posyandu, kelas ibu hamil, atau kunjungan rumah di Gresik. Bila relevan, kaitkan dengan budaya Jawa (ngapati, mitoni, brokohan, sepasaran, selapanan, pijat oksitosin) secara kritis: hormati tradisi, luruskan mitos dengan bukti fisiologis. Jangan menyertakan ayat atau dalil keagamaan.
Prinsip: utamakan MEKANISME fisiologis (sebab–akibat, umpan balik). Jangan langsung memberi semua jawaban; ajukan pertanyaan pemantik. Jawaban ringkas (±200 kata) kecuali diminta. Gunakan angka fisiologis sebagai kisaran dari buku ajar dan sebutkan bahwa nilai dapat berbeda antarsumber.
Keamanan: ini simulasi pendidikan. Jangan memberi diagnosis, dosis obat, atau instruksi klinis individual. Bila ada tanda bahaya (perdarahan banyak, kejang, demam tinggi, nyeri hebat, gerak janin berkurang), tegaskan perlunya rujukan ke fasilitas kesehatan.`;

  const store = {
    get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const AI = {
    persona: PERSONA,
    key() { return (store.get(LS.key, "") || "").trim(); },
    model() { return store.get(LS.model, DEFAULT_MODEL) || DEFAULT_MODEL; },
    online() { return !!this.key(); },
    simpan(key, model) { store.set(LS.key, (key || "").trim()); store.set(LS.model, (model || DEFAULT_MODEL).trim()); document.dispatchEvent(new CustomEvent("saka-ai-ubah")); },

    async gemini(contents, system, opts = {}) {
      // Coba model pilihan; bila tidak tersedia (404/deprecated) otomatis beralih ke model cadangan
      const daftar = [this.model(), ...CADANGAN.filter(m => m !== this.model())];
      let galat;
      for (const model of daftar) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": this.key() },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system || PERSONA }] },
            contents,
            generationConfig: { temperature: opts.temperature ?? 0.8, maxOutputTokens: opts.max ?? 1400 }
          })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          const parts = data.candidates?.[0]?.content?.parts || [];
          const txt = parts.filter(p => !p.thought).map(p => p.text || "").join("").trim();
          if (!txt) throw new Error("Respons kosong dari model.");
          if (model !== this.model()) store.set(LS.model, model);
          return txt;
        }
        galat = new Error((data.error && data.error.message) || ("HTTP " + res.status));
        if (!(res.status === 404 || /not found|not supported|deprecated/i.test(galat.message))) throw galat;
      }
      throw galat;
    },

    /* Antarmuka umum: kembalikan {teks, sumber:'gemini'|'offline'} */
    async tanya(prompt, { history = [], system, temperature, fallback } = {}) {
      if (this.online()) {
        try {
          const contents = history.map(h => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] }));
          contents.push({ role: "user", parts: [{ text: prompt }] });
          return { teks: await this.gemini(contents, system, { temperature }), sumber: "gemini" };
        } catch (e) {
          console.warn("Gemini gagal:", e);
          const f = fallback ? fallback() : Offline.chat(prompt);
          return { teks: `> ⚠️ AI daring gagal (${e.message}). Beralih ke mode offline.\n\n` + f, sumber: "offline" };
        }
      }
      return { teks: fallback ? fallback() : Offline.chat(prompt), sumber: "offline" };
    },

    /* --- fitur pedagogis --- */
    kasus(topikId, jenjang) {
      const t = GARBA.topik.find(x => x.id == topikId);
      const p = `Buat SATU studi kasus fisiologi kebidanan orisinal dan realistis tentang topik "${t.judul}" dengan latar ${jenjang} (Indonesia, konteks Gresik/Jawa Timur). Format Markdown:
### Judul kasus
Narasi 120–170 kata: identitas klien (inisial), keluhan, dan DATA fisiologis (tanda vital, TFU, hari siklus/pascasalin, Hb, dsb.) yang masih dalam konteks fisiologis atau batas yang perlu dianalisis.
**Pertanyaan analisis:** 3 pertanyaan bertingkat (C4 menganalisis, C5 mengevaluasi, C6 mencipta solusi).
**Petunjuk konsep:** sebutkan 1–2 mekanisme fisiologis kunci tanpa memberi jawaban.
Kaitkan halus dengan budaya "${t.lokal.nama}" bila wajar. Tandai bahwa ini kasus simulasi pendidikan.`;
      return this.tanya(p, { temperature: 0.95, fallback: () => Offline.kasus(topikId, jenjang) });
    },
    nilai(topikId, soal, jawaban) {
      const t = GARBA.topik.find(x => x.id == topikId);
      const p = `Topik: ${t.judul}. Pertanyaan/kasus: """${soal}"""
Jawaban mahasiswa: """${jawaban}"""
Beri umpan balik formatif dengan rubrik (skor 1–4 tiap kriteria):
1) Ketepatan konsep & mekanisme fisiologis, 2) Analisis/interpretasi data kasus, 3) Penerapan sebagai dasar asuhan kebidanan (edukasi, pemantauan, kapan merujuk), 4) Komunikasi & sensitivitas budaya lokal (meluruskan mitos dengan santun).
Format Markdown: tabel ringkas skor, lalu **Kekuatan** (2 poin), **Perlu ditingkatkan** (2 poin), dan **Pertanyaan pemantik lanjutan** (1 pertanyaan). Gunakan bahasa yang menyemangati. Maks 230 kata.`;
      return this.tanya(p, { temperature: 0.4, fallback: () => Offline.nilai(topikId, jawaban) });
    },
    jelaskan(topikId, fokus, jenjang = "kelas ibu hamil") {
      const t = GARBA.topik.find(x => x.id == topikId);
      const p = `Jelaskan "${fokus}" (bagian dari topik ${t.judul}) dalam 90–130 kata, fokus pada mekanisme fisiologisnya, dengan SATU contoh konkret di ${jenjang} dan satu pertanyaan refleksi pendek di akhir. Bahasa lisan yang enak didengar (akan dibacakan suara).`;
      return this.tanya(p, { temperature: 0.7, fallback: () => Offline.jelaskan(topikId, fokus) });
    }
  };

  /* ---------------- MODE OFFLINE ---------------- */
  const acak = a => a[Math.floor(Math.random() * a.length)];
  const Offline = {
    kasus(id, jenjang) {
      const t = GARBA.topik.find(x => x.id == id);
      const contoh = t.contoh[Math.floor(Math.random() * t.contoh.length)];
      return `### Kasus ${t.judul}\n${acak(GARBA.kasusOffline[id])}\n\n_Tugas tambahan: rancang edukasi untuk latar **${jenjang}**._\n\n**Konteks pembanding (${contoh.konteks}):** ${contoh.teks.replace(/<[^>]+>/g, "")}\n\n**Pertanyaan analisis:**\n1. Identifikasi mekanisme fisiologis yang mendasari data klien (C4).\n2. Tentukan apakah temuan masih fisiologis atau perlu dirujuk, beserta alasannya (C5).\n3. Rancang edukasi/asuhan berbasis fisiologi yang menghormati budaya **${t.lokal.nama}** (C6).\n\n_Mode offline: kasus diambil dari bank kasus. Aktifkan Gemini untuk kasus baru yang selalu berbeda._`;
    },
    nilai(id, jawaban) {
      const t = GARBA.topik.find(x => x.id == id);
      const j = (jawaban || "").toLowerCase();
      const kata = j.split(/\s+/).filter(Boolean).length;
      const ketemu = GARBA.kunci[id].filter(k => j.includes(k));
      const islam = ["jelaskan", "santun", "empati", "keluarga", "suami", "bahasa"].filter(k => j.includes(k));
      const lokal = ["ngapati", "mitoni", "tingkeban", "brokohan", "sepasaran", "selapanan", "pantang", "mitos", "dukun", "pijat", "budaya", "tradisi", "gresik", "keluarga"].filter(k => j.includes(k));
      const solusi = ["edukasi", "pantau", "rujuk", "anjurkan", "rencana", "asuhan", "jelaskan", "pemeriksaan", "evaluasi"].filter(k => j.includes(k));
      const s1 = Math.min(4, 1 + Math.floor(ketemu.length / 1.5));
      const s2 = kata > 150 ? 4 : kata > 90 ? 3 : kata > 40 ? 2 : 1;
      const s3 = Math.min(4, 1 + solusi.length);
      const s4 = Math.min(4, 1 + islam.length + lokal.length);
      const tot = s1 + s2 + s3 + s4;
      const kurang = GARBA.kunci[id].filter(k => !ketemu.includes(k)).slice(0, 4);
      return `| Kriteria | Skor |\n|---|---|\n| Konsep & mekanisme | ${s1}/4 |\n| Analisis data | ${s2}/4 |\n| Dasar asuhan | ${s3}/4 |\n| Komunikasi & budaya | ${s4}/4 |\n| **Total** | **${tot}/16** |\n\n**Kekuatan**\n- ${ketemu.length ? "Anda sudah memakai konsep kunci: " + ketemu.join(", ") + "." : "Anda sudah berani menuliskan pendapat — langkah awal yang baik."}\n- ${kata > 60 ? "Uraian cukup panjang untuk menunjukkan proses berpikir." : "Jawaban ringkas dan langsung."}\n\n**Perlu ditingkatkan**\n- Perkuat dengan istilah/teori: ${kurang.join(", ") || "rujukan teori dan tahun"}.\n- ${islam.length + lokal.length ? "Perdalam kaitan nilai dengan tindakan konkret." : `Kaitkan dengan budaya ${t.lokal.nama} dan cara menyampaikannya kepada klien/keluarga.`}\n\n**Pertanyaan pemantik:** ${acak(t.diskusi)}\n\n_Mode offline: penilaian berbasis kata kunci & rubrik. Aktifkan Gemini untuk umpan balik yang lebih mendalam._`;
    },
    jelaskan(id, fokus) {
      const t = GARBA.topik.find(x => x.id == id);
      return `**${fokus}** — ${t.ringkas.replace(/<[^>]+>/g, "")}\n\nContoh: ${t.contoh[0].teks.replace(/<[^>]+>/g, "")}\n\n_Refleksi:_ ${t.diskusi[0]}`;
    },
    chat(msg) {
      const m = (msg || "").toLowerCase();
      let best = null, skor = 0;
      GARBA.topik.forEach(t => {
        const s = GARBA.kunci[t.id].filter(k => m.includes(k)).length + (m.includes(t.judul.toLowerCase().split(" ")[0]) ? 1 : 0);
        if (s > skor) { skor = s; best = t; }
      });
      if (!best) {
        return `Monggo, pertanyaan yang menarik. Dalam mode offline saya paling bisa membantu seputar 7 topik fisiologi reproduksi & maternal: ${GARBA.topik.map(t => t.judul).join(", ")}.\n\nCoba sebut kata kunci, misalnya *"lonjakan LH"*, *"hCG"*, *"involusi"*, atau *"oksitosin"*.\n\n_Untuk percakapan bebas, aktifkan Gemini lewat tombol ⚙️._`;
      }
      return `**${best.ikon} ${best.judul}**\n\n${best.ringkas.replace(/<[^>]+>/g, "")}\n\n**Budaya & kearifan lokal — ${best.lokal.nama}:** ${best.lokal.isi}\n\n**Pertanyaan untuk Anda:** ${acak(best.diskusi)}\n\n_Mode offline. Aktifkan Gemini (⚙️) untuk dialog Sokratik yang lebih hidup._`;
    }
  };
  AI.offline = Offline;

  /* ---------------- Utilitas: Markdown sederhana ---------------- */
  function esc(s) { return s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function md(src) {
    const lines = esc(src || "").split(/\r?\n/);
    let html = "", list = null, table = [];
    const inline = s => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<i>$2</i>").replace(/_(.+?)_/g, "<i>$1</i>").replace(/`(.+?)`/g, "<code>$1</code>");
    const tutupList = () => { if (list) { html += `</${list}>`; list = null; } };
    const tutupTabel = () => {
      if (!table.length) return;
      const rows = table.filter(r => !/^\|?\s*:?-{2,}/.test(r));
      html += '<table style="border-collapse:collapse;width:100%;font-size:13.5px;margin:6px 0">' + rows.map((r, i) => "<tr>" + r.replace(/^\||\|$/g, "").split("|").map(c => `<${i ? "td" : "th"} style="border:1px solid #bae6fd;padding:5px 8px;text-align:left">${inline(c.trim())}</${i ? "td" : "th"}>`).join("") + "</tr>").join("") + "</table>";
      table = [];
    };
    for (const raw of lines) {
      const l = raw.trimEnd();
      if (/^\s*\|.*\|\s*$/.test(l)) { tutupList(); table.push(l.trim()); continue; } else tutupTabel();
      let m;
      if ((m = l.match(/^#{1,4}\s+(.*)/))) { tutupList(); html += `<h3>${inline(m[1])}</h3>`; }
      else if ((m = l.match(/^\s*[-*•]\s+(.*)/))) { if (list !== "ul") { tutupList(); html += "<ul>"; list = "ul"; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== "ol") { tutupList(); html += "<ol>"; list = "ol"; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^&gt;\s?(.*)/))) { tutupList(); html += `<p style="background:#fef3c7;border-radius:8px;padding:6px 10px">${inline(m[1])}</p>`; }
      else if (!l.trim()) { tutupList(); }
      else { tutupList(); html += `<p>${inline(l)}</p>`; }
    }
    tutupList(); tutupTabel();
    return html;
  }
  AI.md = md;

  /* ---------------- Suara (TTS) & pengenalan suara ---------------- */
  const Suara = {
    aktif() { return store.get(LS.suara, "1") === "1"; },
    set(v) { store.set(LS.suara, v ? "1" : "0"); },
    bersih(t) { return (t || "").replace(/<[^>]+>/g, " ").replace(/[#*_>|`]/g, " ").replace(/[؀-ۿݐ-ݿ]+/g, " ").replace(/\s+/g, " ").trim(); },
    bicara(t) {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(this.bersih(t).slice(0, 1800));
      u.lang = "id-ID"; u.rate = 1; u.pitch = 1;
      const v = speechSynthesis.getVoices().find(v => /id(-|_)ID/i.test(v.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    },
    diam() { if ("speechSynthesis" in window) speechSynthesis.cancel(); },
    dengar(cb, selesai) {
      const R = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!R) { toast("Peramban ini belum mendukung input suara. Coba Chrome di Android."); selesai && selesai(); return null; }
      const r = new R(); r.lang = "id-ID"; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = e => cb(e.results[0][0].transcript);
      r.onerror = () => toast("Suara tidak tertangkap, coba lagi.");
      r.onend = () => selesai && selesai();
      r.start(); return r;
    }
  };
  AI.suara = Suara;

  function toast(t) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = t; el.classList.add("tampil");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("tampil"), 2600);
  }
  AI.toast = toast;

  /* ---------------- Widget Chat Asisten AI ---------------- */
  const MODE = {
    mentor: { label: "🧭 Mentor Sokratik", sys: PERSONA + "\nMode: MENTOR SOKRATIK. Bantu mahasiswa memahami mekanisme dengan bertanya balik dan memberi contoh." },
    ibuHamil: { label: "🎭 Klien: Bu Siti (hamil 34 mg, cemas)", sys: PERSONA + "\nMode: ROLEPLAY KONSELING. Anda memerankan Bu Siti, 24 tahun, G1 34 minggu dari Kecamatan Manyar, Gresik. Keluhan: sesak saat berbaring, sering BAK, kaki bengkak ringan sore hari, Hb 10,9 g/dL; ia cemas 'ada yang salah dengan bayinya' dan percaya mitos tidak boleh minum es. Mahasiswa berperan sebagai bidan. Tetap dalam karakter, bahasa awam dengan logat Jawa Timur ringan. Anda baru tenang bila mahasiswa menjelaskan adaptasi fisiologis dengan bahasa sederhana, empatik, dan menyebut tanda bahaya yang perlu diwaspadai. Setelah 6–8 giliran atau bila mahasiswa mengetik 'selesai', keluar dari karakter dan beri evaluasi (skor 1–4: ketepatan fisiologi, bahasa awam, empati, edukasi tanda bahaya)." },
    ibuNifas: { label: "🎭 Klien: Mbak Ayu (nifas hari ke-5)", sys: PERSONA + "\nMode: ROLEPLAY KONSELING. Anda memerankan Mbak Ayu, 22 tahun, P1 hari ke-5 pascasalin (sepasaran). Mertua melarang makan ikan & telur; Ayu merasa mules saat menyusui dan bingung apakah normal; lokia merah kecokelatan. Mahasiswa berperan sebagai bidan kunjungan rumah. Tetap dalam karakter, santun dan agak sungkan pada mertua. Setelah 6–8 giliran atau bila mahasiswa mengetik 'selesai', keluar dari karakter dan beri evaluasi (skor 1–4: fisiologi involusi & laktasi, meluruskan mitos dengan santun, komunikasi dengan keluarga, edukasi tanda bahaya nifas)." },
    ibuMenyusui: { label: "🎭 Klien: Bu Rina (merasa ASI kurang)", sys: PERSONA + "\nMode: ROLEPLAY KONSELING. Anda memerankan Bu Rina, 28 tahun, hari ke-2 setelah persalinan normal dengan luka jahitan perineum, merasa ASI belum keluar dan ingin memberi susu formula; ia lelah, nyeri, dan cemas. Mahasiswa berperan sebagai bidan. Tetap dalam karakter. Anda bersedia mencoba menyusui lagi bila mahasiswa menjelaskan laktogenesis II, refleks prolaktin & oksitosin, dan membantu Anda merasa tenang. Setelah 6–8 giliran atau bila mahasiswa mengetik 'selesai', keluar dari karakter dan beri evaluasi (skor 1–4: fisiologi laktasi, empati, dukungan praktis, melibatkan keluarga)." }
  };


  function pasangChat(opsi = {}) {
    if (document.querySelector(".chat")) return;
    const fab = document.createElement("button");
    fab.className = "fab"; fab.setAttribute("aria-label", "Buka " + N);
    fab.innerHTML = `<span class="av">${AV}</span><span>Tanya ${N}</span>`;
    const chat = document.createElement("div");
    chat.className = "chat"; chat.setAttribute("role", "dialog");
    chat.innerHTML = `
      <div class="chat-head">
        <div class="atas"><div class="av">${AV}</div><div><b>${N}</b><small class="status-ai"></small></div>
          <div class="ikon"><button data-a="suara" title="Suara">🔊</button><button data-a="setel" title="Pengaturan AI">⚙️</button><button data-a="tutup" title="Tutup">✕</button></div></div>
        <div class="chat-mode"><select aria-label="Mode percakapan">${Object.entries(MODE).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("")}</select><button class="btn btn-kecil btn-putih" data-a="baru" style="padding:6px 10px">↺ Baru</button></div>
      </div>
      <div class="chat-body" aria-live="polite"></div>
      <div class="saran"></div>
      <div class="chat-in"><button data-a="mic" title="Bicara">🎙️</button><textarea placeholder="Tulis pertanyaan…"></textarea><button class="kirim" data-a="kirim" title="Kirim">➤</button></div>`;
    document.body.append(fab, chat);
    pasangSetelan();

    const body = chat.querySelector(".chat-body"), ta = chat.querySelector("textarea"), sel = chat.querySelector("select"), saran = chat.querySelector(".saran");
    let riwayat = [];
    const status = () => {
      chat.querySelector(".status-ai").innerHTML = AI.online() ? `Gemini · ${AI.model()} · daring` : "Mode offline · aktifkan AI di ⚙️";
      chat.querySelector('[data-a="suara"]').textContent = Suara.aktif() ? "🔊" : "🔇";
    };
    status(); document.addEventListener("saka-ai-ubah", status);

    function tambah(role, teks) {
      const d = document.createElement("div");
      d.className = "msg " + (role === "user" ? "user" : "ai");
      d.innerHTML = role === "user" ? esc(teks) : md(teks);
      if (role !== "user") {
        const b = document.createElement("button"); b.className = "spk"; b.textContent = "🔊 Dengarkan";
        b.onclick = () => Suara.bicara(teks); d.appendChild(b);
      }
      body.appendChild(d); body.scrollTop = body.scrollHeight; return d;
    }
    function sapa() {
      body.innerHTML = ""; riwayat = [];
      const m = sel.value;
      const salam = m === "mentor"
        ? `Halo, adik-adik calon bidan. Saya **${N}**, teman belajar Anda untuk **Fisiologi Reproduksi & Maternal**.\n\nSilakan bertanya tentang 7 topik (siklus, reproduksi pria, kehamilan, persalinan, nifas, laktasi), minta contoh kasus, atau berlatih *konseling* dengan klien simulasi (pilih di menu atas).\n\n_Catatan: ini simulasi pendidikan, bukan pengganti pemeriksaan tenaga kesehatan._`
        : `**${MODE[m].label.replace("🎭 Roleplay: ", "")}** siap diajak bicara. Anda berperan sebagai **bidan**. Mulailah membuka percakapan. Ketik **selesai** untuk meminta evaluasi.`;
      tambah("ai", salam);
      const s = m === "mentor" ? ["Mengapa terjadi lonjakan LH?", "Jelaskan refleks Ferguson", "Kenapa Hb turun saat hamil?", "Bagaimana ASI keluar?"] : ["Selamat pagi, Bu. Saya bidan yang bertugas, bagaimana kabarnya hari ini?", "selesai"];
      saran.innerHTML = s.map(x => `<button>${esc(x)}</button>`).join("");
      saran.querySelectorAll("button").forEach(b => b.onclick = () => kirim(b.textContent));
    }
    async function kirim(teks) {
      teks = (teks ?? ta.value).trim(); if (!teks) return;
      ta.value = ""; tambah("user", teks); saran.innerHTML = "";
      const tunggu = tambah("ai", ""); tunggu.innerHTML = '<span class="memuat"><i></i><i></i><i></i></span>';
      let fallback;
      if (sel.value !== "mentor") fallback = () => "Mode roleplay memerlukan AI daring (Gemini). Buka ⚙️ untuk memasukkan kunci API gratis Anda. Sementara itu, gunakan **Mentor Sokratik** dalam mode offline.";
      const r = await AI.tanya(teks, { history: riwayat, system: MODE[sel.value].sys, fallback });
      tunggu.remove(); tambah("ai", r.teks);
      riwayat.push({ role: "user", text: teks }, { role: "model", text: r.teks });
      if (riwayat.length > 24) riwayat = riwayat.slice(-24);
      if (Suara.aktif()) Suara.bicara(r.teks);
    }
    AI.kirimKeChat = (t, buka = true) => { if (buka) bukaChat(); sel.value = "mentor"; setTimeout(() => kirim(t), 150); };

    function bukaChat() { chat.classList.add("buka"); fab.style.display = "none"; if (!body.children.length) sapa(); setTimeout(() => ta.focus(), 100); }
    fab.onclick = bukaChat; AI.bukaChat = bukaChat;
    sel.onchange = sapa;
    let rek = null;
    chat.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "tutup") { chat.classList.remove("buka"); fab.style.display = ""; Suara.diam(); }
      if (a === "kirim") kirim();
      if (a === "baru") sapa();
      if (a === "setel") bukaSetelan();
      if (a === "suara") { Suara.set(!Suara.aktif()); if (!Suara.aktif()) Suara.diam(); status(); toast(Suara.aktif() ? "Suara " + N + " aktif" : "Suara dimatikan"); }
      if (a === "mic") {
        const b = e.target.closest("button");
        if (rek) { rek.stop(); return; }
        b.classList.add("rekam");
        rek = Suara.dengar(t => kirim(t), () => { b.classList.remove("rekam"); rek = null; });
      }
    });
    ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); kirim(); } });
    if (opsi.buka) bukaChat();
  }

  /* ---------------- Modal Pengaturan ---------------- */
  function pasangSetelan() {
    if (document.querySelector(".setel")) return;
    const s = document.createElement("div"); s.className = "setel";
    s.innerHTML = `<div class="isi" role="dialog" aria-label="Pengaturan AI">
      <h3 style="margin:0 0 4px;color:#0c4a6e">⚙️ Pengaturan Generative AI</h3>
      <p style="margin:0;color:#335f7d;font-size:14px">${N} memakai <b>Google Gemini</b>. Tanpa kunci API, aplikasi tetap berjalan dalam <b>mode offline</b> (bank kasus + umpan balik berbasis rubrik).</p>
      <label for="kunci">Kunci API Gemini</label>
      <input id="kunci" type="password" placeholder="AIza…" autocomplete="off">
      <label for="model">Model</label>
      <input id="model" type="text" placeholder="${DEFAULT_MODEL}">
      <div class="catatan">Cara mendapat kunci gratis: buka <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> → <i>Create API key</i> → salin & tempel di sini.<br>🔒 Kunci hanya disimpan di peramban Anda (localStorage) dan dikirim langsung ke Google — tidak ke server lain.</div>
      <div class="baris" style="margin-top:14px;justify-content:flex-end">
        <button class="btn btn-kecil btn-hantu" data-s="hapus">Hapus kunci</button>
        <button class="btn btn-kecil btn-putih" data-s="uji">Uji koneksi</button>
        <button class="btn btn-kecil btn-primer" data-s="simpan">Simpan</button>
        <button class="btn btn-kecil btn-putih" data-s="tutup">Tutup</button>
      </div>
      <div class="hasil-uji catatan" style="display:none"></div></div>`;
    document.body.appendChild(s);
    s.addEventListener("click", async e => {
      if (e.target === s) s.classList.remove("buka");
      const a = e.target.dataset.s; if (!a) return;
      const k = s.querySelector("#kunci").value, m = s.querySelector("#model").value || DEFAULT_MODEL, h = s.querySelector(".hasil-uji");
      if (a === "tutup") s.classList.remove("buka");
      if (a === "hapus") { AI.simpan("", m); s.querySelector("#kunci").value = ""; toast("Kunci dihapus — mode offline"); }
      if (a === "simpan") { AI.simpan(k, m); s.classList.remove("buka"); toast(k ? "AI daring aktif ✓" : "Mode offline"); }
      if (a === "uji") {
        AI.simpan(k, m); h.style.display = "block"; h.textContent = "Menguji…";
        try { const t = await AI.gemini([{ role: "user", parts: [{ text: "Jawab satu kalimat: apa fungsi hormon oksitosin?" }] }], "Jawab singkat dalam bahasa Indonesia.", { max: 200 }); h.innerHTML = "✅ Berhasil: " + esc(t); }
        catch (err) { h.innerHTML = "❌ Gagal: " + esc(err.message) + "<br>Periksa kunci API atau ganti nama model (mis. gemini-2.5-flash, gemini-3.5-flash, atau gemini-flash-latest)."; }
      }
    });
  }
  function bukaSetelan() {
    pasangSetelan();
    const s = document.querySelector(".setel");
    s.querySelector("#kunci").value = AI.key(); s.querySelector("#model").value = AI.model();
    s.classList.add("buka");
  }
  AI.pasangChat = pasangChat; AI.bukaSetelan = bukaSetelan; AI.esc = esc;
  window.SakaAI = AI;
})();
