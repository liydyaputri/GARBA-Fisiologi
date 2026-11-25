/* GARBA — logika halaman utama */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const AI = window.SakaAI, D = window.GARBA, esc = AI.esc, N = D.meta.namaAI;
  $$(".nama-ai").forEach(e => e.textContent = N); $("#nama-ai-hero").textContent = N;
  const LSP = "garba_progres";
  const prog = (() => { try { return JSON.parse(localStorage.getItem(LSP)) || {}; } catch (e) { return {}; } })();
  const simpanProg = () => { try { localStorage.setItem(LSP, JSON.stringify(prog)); } catch (e) {} renderGrid(); };
  const selesai = id => prog[id] && prog[id].coba && prog[id].refleksi;
  const TOT = D.topik.length;
  const tautan3D = t => t.ar ? [`ar.html?m=${t.ar}`, "📱 Lihat model 3D di AR"] : [`index.html?t=${t.id}`, "🥽 Lihat di Taman VR"];

  $("#subcpmk").textContent = D.meta.subcpmk;

  /* ---------- Grid topik ---------- */
  function renderGrid() {
    $("#grid").innerHTML = D.topik.map(t => `
      <button class="kartu ${selesai(t.id) ? "selesai" : ""}" data-id="${t.id}" style="--k:${["#0ea5e9","#6366f1","#14b8a6","#a855f7","#ec4899","#f97316","#06b6d4"][t.id - 1]}">
        <span class="no">${t.id}</span><div class="ik">${t.ikon}</div>
        <h3>${t.judul}</h3><p>${t.ringkas.replace(/<[^>]+>/g, "").slice(0, 118)}…</p>
        <div class="lok">🌸 ${t.lokal.nama}</div>
      </button>`).join("");
    const n = D.topik.filter(t => selesai(t.id)).length;
    $("#bar").style.width = (n / TOT * 100) + "%"; $("#persen").textContent = n + "/" + TOT;
    $$("#grid .kartu").forEach(k => k.onclick = () => buka(+k.dataset.id));
  }
  renderGrid();

  /* ---------- Modal ---------- */
  let T = null;
  function buka(id, tab = "pahami") {
    T = D.topik.find(t => t.id === id);
    $("#m-saka").textContent = `Topik ${T.id} dari ${TOT} · ${T.lokal.nama}`;
    $("#m-judul").textContent = `${T.ikon} ${T.judul}`;
    const t3 = tautan3D(T), p = prog[T.id] || {};
    $("#m-body").innerHTML = `
      <div class="tab" data-isi="pahami">
        <div class="kotak"><p style="margin-top:0">${T.ringkas}</p>
          <div class="aksi"><button class="btn btn-kecil btn-putih" data-dengar>🔊 Dengarkan</button><a class="btn btn-kecil btn-primer" href="${t3[0]}">${t3[1]}</a><button class="btn btn-kecil btn-putih" data-tanya>🧕🏻 Tanya ${N}</button></div></div>
        <div class="kotak"><h4>Poin kunci</h4><ul>${T.poin.map(x => `<li>${x}</li>`).join("")}</ul></div>
        <div class="kotak sumber"><h4>Rujukan</h4><ul>${T.sumber.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>
      <div class="tab" data-isi="hayati">
        <div class="kotak lokal"><div class="lambang">🌸</div><div><h4>Budaya: ${T.lokal.nama} <span class="chip">${T.lokal.asal}</span></h4><p style="margin:0">${T.lokal.isi}</p></div></div>
        <div class="kotak"><h4>💭 Renungkan</h4><p style="margin:0">Bagaimana seorang bidan menghormati tradisi <b>${T.lokal.nama}</b> sambil tetap memberi edukasi yang berbasis mekanisme fisiologis?</p></div>
      </div>
      <div class="tab" data-isi="contoh">
        <div class="jenjang">${T.contoh.map(c => `<div class="kotak"><span class="lbl">${c.konteks}</span><p style="margin:0">${c.teks}</p></div>`).join("")}</div>
        <div class="kotak" style="margin-top:14px"><h4>Pertanyaan diskusi (HOTS)</h4><ol>${T.diskusi.map(d => `<li>${d}</li>`).join("")}</ol></div>
      </div>
      <div class="tab" data-isi="coba"><div class="kotak" id="akt"></div></div>
      <div class="tab" data-isi="analisis">
        <div class="kotak">
          <div class="baris" style="justify-content:space-between"><h4 style="margin:0">🧠 Laboratorium Kasus AI</h4><span class="chip ${AI.online() ? "on" : "off"}">${AI.online() ? "Gemini daring" : "Mode offline"}</span></div>
          <p style="margin:8px 0 12px;color:#335f7d">Langkah: (1) bangkitkan kasus klinik simulasi, (2) tulis analisis mekanisme fisiologis & rencana edukasi, (3) dapatkan umpan balik rubrik dari ${N}.</p>
          <div class="baris"><select class="input" id="jenjang" style="max-width:260px"><option>Kelas ibu hamil</option><option>Praktik Mandiri Bidan (PMB)</option><option>Puskesmas</option><option>Posyandu</option><option>Kunjungan rumah</option></select>
            <button class="btn btn-primer btn-kecil" id="b-kasus">✨ Bangkitkan Kasus</button>
            ${AI.online() ? "" : '<button class="btn btn-hantu btn-kecil" data-setel>⚙️ Aktifkan Gemini</button>'}</div>
          <div class="ai-out" id="o-kasus"></div>
          <label style="display:block;font-weight:700;margin:16px 0 6px">Analisis & rencana edukasi Anda</label>
          <textarea id="jawab" rows="6" placeholder="Jelaskan mekanisme fisiologis di balik data klien, apakah masih fisiologis, rencana edukasi, dan kapan perlu dirujuk…">${esc(p.jawab || "")}</textarea>
          <div class="aksi"><button class="btn btn-primer btn-kecil" id="b-nilai">📋 Nilai Analisis Saya</button><button class="btn btn-putih btn-kecil" id="b-dengar-fb" style="display:none">🔊 Dengarkan umpan balik</button></div>
          <div class="ai-out" id="o-nilai"></div>
          <p class="disclaimer">Kasus bersifat simulasi pendidikan. Umpan balik AI perlu diverifikasi dengan buku ajar dan dosen.</p>
        </div>
      </div>
      <div class="tab" data-isi="refleksi">
        <div class="kotak"><h4>📝 Refleksi (3-2-1)</h4><p style="margin:0 0 10px;color:#335f7d">Tuliskan: <b>3</b> mekanisme yang saya pahami, <b>2</b> penerapan dalam asuhan kebidanan, <b>1</b> pertanyaan yang masih tersisa.</p>
          <textarea id="refleksi" rows="7">${esc(p.refleksiTeks || "")}</textarea>
          <div class="aksi"><button class="btn btn-primer btn-kecil" id="b-ref">💾 Simpan Refleksi</button>${T.id < TOT ? `<button class="btn btn-putih btn-kecil" id="b-lanjut">Topik berikutnya →</button>` : ""}</div></div>
      </div>`;
    renderAktivitas(); pasangTab(tab);
    $("#modal").classList.add("buka"); $("#modal").setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    $("[data-dengar]").onclick = () => AI.suara.bicara(T.judul + ". " + T.ringkas + ". " + T.poin.join(". "));
    $("[data-tanya]").onclick = () => AI.kirimKeChat(`Jelaskan mekanisme utama topik "${T.judul}" dengan contoh asuhan di PMB, lalu beri saya satu pertanyaan pemantik.`);
    const st = $("[data-setel]"); if (st) st.onclick = () => AI.bukaSetelan();
    $("#b-kasus").onclick = async () => {
      const o = $("#o-kasus"); o.classList.add("tampil"); o.innerHTML = `<span class="memuat"><i></i><i></i><i></i></span> ${N} sedang menyusun kasus…`;
      const r = await AI.kasus(T.id, $("#jenjang").value); o.innerHTML = AI.md(r.teks); o.dataset.kasus = r.teks;
    };
    $("#b-nilai").onclick = async () => {
      const j = $("#jawab").value.trim();
      if (j.split(/\s+/).length < 15) { AI.toast("Tulis analisis minimal ±15 kata dulu, nggih."); return; }
      const soal = $("#o-kasus").dataset.kasus || T.diskusi[0];
      const o = $("#o-nilai"); o.classList.add("tampil"); o.innerHTML = '<span class="memuat"><i></i><i></i><i></i></span> Menilai dengan rubrik…';
      const r = await AI.nilai(T.id, soal, j); o.innerHTML = AI.md(r.teks);
      prog[T.id] = { ...(prog[T.id] || {}), analisis: true, jawab: j }; simpanProg();
      const b = $("#b-dengar-fb"); b.style.display = ""; b.onclick = () => AI.suara.bicara(r.teks);
    };
    $("#b-ref").onclick = () => {
      const v = $("#refleksi").value.trim();
      if (v.length < 30) { AI.toast("Refleksi masih terlalu singkat."); return; }
      prog[T.id] = { ...(prog[T.id] || {}), refleksi: true, refleksiTeks: v }; simpanProg();
      AI.toast(selesai(T.id) ? `Topik ${T.id} tuntas! ✓` : "Refleksi tersimpan. Selesaikan juga tab 🧩 Coba."); tandaiTab();
    };
    const l = $("#b-lanjut"); if (l) l.onclick = () => buka(T.id + 1);
    tandaiTab();
  }
  function tandaiTab() {
    const p = prog[T.id] || {};
    $$("#m-tabs button").forEach(b => { const k = b.dataset.tab; b.textContent = b.textContent.replace(" ✓", ""); if ((k === "coba" && p.coba) || (k === "analisis" && p.analisis) || (k === "refleksi" && p.refleksi)) b.textContent += " ✓"; });
  }
  function pasangTab(nama) {
    $$("#m-tabs button").forEach(b => { b.classList.toggle("aktif", b.dataset.tab === nama); b.onclick = () => pasangTab(b.dataset.tab); });
    $$("#m-body .tab").forEach(t => t.classList.toggle("aktif", t.dataset.isi === nama));
  }
  function tutup() { $("#modal").classList.remove("buka"); $("#modal").setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; AI.suara.diam(); }
  $("#modal").addEventListener("click", e => { if (e.target.id === "modal" || e.target.closest("[data-tutup]")) tutup(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") tutup(); });

  /* ---------- Aktivitas ---------- */
  const acakUrut = a => { const b = a.map((x, i) => ({ x, i })); do { for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } } while (b.every((o, k) => o.i === k)); return b; };
  function lulus() { prog[T.id] = { ...(prog[T.id] || {}), coba: true }; simpanProg(); tandaiTab(); AI.toast("Aktivitas tuntas ✓"); }
  function renderAktivitas() {
    const A = T.aktivitas, el = $("#akt");
    let html = `<h4>🧩 ${A.judul}</h4><p style="margin:0 0 8px;color:#335f7d">${A.instruksi}</p>`;
    if (A.tipe === "pasang") {
      html += A.item.map((it, i) => `<div class="akt-item" data-i="${i}"><span>${it.t}</span><select aria-label="Jawaban ${i + 1}"><option value="">— pilih —</option>${A.opsi.map(o => `<option>${o}</option>`).join("")}</select></div>`).join("");
      el.innerHTML = html + `<div class="aksi"><button class="btn btn-primer btn-kecil" id="cek">Periksa</button></div><div class="umpan" id="umpan"></div>`;
      $("#cek").onclick = () => {
        let b = 0;
        $$(".akt-item", el).forEach(r => { const ok = $("select", r).value === A.item[r.dataset.i].k; b += ok; r.classList.toggle("benar", ok); r.classList.toggle("salah", !ok); });
        const u = $("#umpan"); u.classList.add("tampil");
        u.innerHTML = b === A.item.length ? `🎉 <b>Sempurna ${b}/${A.item.length}!</b>` : `<b>${b}/${A.item.length} benar.</b> Perhatikan item merah, baca kembali tab 👁️ Pahami, lalu coba lagi.`;
        if (b === A.item.length) lulus();
      };
    } else {
      let urut = acakUrut(A.item);
      const gambar = () => {
        $("#urut-list").innerHTML = urut.map((o, k) => `<div class="akt-item"><span><b>${k + 1}.</b> ${o.x}</span><span class="urut-btn"><button data-n="${k}" data-d="-1" aria-label="Naik">▲</button><button data-n="${k}" data-d="1" aria-label="Turun">▼</button></span></div>`).join("");
        $$("#urut-list button").forEach(b => b.onclick = () => { const n = +b.dataset.n, m = n + +b.dataset.d; if (m < 0 || m >= urut.length) return; [urut[n], urut[m]] = [urut[m], urut[n]]; gambar(); });
      };
      el.innerHTML = html + `<div id="urut-list"></div><div class="aksi"><button class="btn btn-primer btn-kecil" id="cek">Periksa urutan</button><button class="btn btn-putih btn-kecil" id="acak">↺ Acak ulang</button></div><div class="umpan" id="umpan"></div>`;
      gambar();
      $("#acak").onclick = () => { urut = acakUrut(A.item); gambar(); $("#umpan").classList.remove("tampil"); };
      $("#cek").onclick = () => {
        const rows = $$("#urut-list .akt-item"); let b = 0;
        urut.forEach((o, k) => { const ok = o.i === k; b += ok; rows[k].classList.toggle("benar", ok); rows[k].classList.toggle("salah", !ok); });
        const u = $("#umpan"); u.classList.add("tampil");
        u.innerHTML = b === urut.length ? "🎉 <b>Urutan tepat!</b> Anda memahami alur mekanismenya." : `<b>${b}/${urut.length} posisi tepat.</b> Gunakan ▲▼ untuk memperbaiki.`;
        if (b === urut.length) lulus();
      };
    }
  }

  /* ---------- Lab siklus (P7 digital) ---------- */
  const cv = $("#grafik"), cx = cv.getContext("2d");
  let hari = 1, L = 28, putar = null;
  function gambarGrafik() {
    const W = cv.width, H = cv.height, pl = 50, pr = 20, pt = 26, pb = 70, gw = W - pl - pr, gh = H - pt - pb;
    cx.clearRect(0, 0, W, H);
    const X = d => pl + (d - 1) / (L - 1) * gw;
    const ov = L - 14;
    // latar fase
    const fase = [[1, Math.min(5, ov), "#fee2e2", "Menstruasi"], [Math.min(5, ov), ov, "#e0f2fe", "Folikular"], [ov + 1, L, "#fef3c7", "Luteal"]];
    fase.forEach(([a, b, w, n]) => { cx.fillStyle = w; cx.fillRect(X(a), pt, X(b) - X(a), gh); cx.fillStyle = "#64748b"; cx.font = "600 15px Plus Jakarta Sans, sans-serif"; cx.fillText(n, X(a) + 6, pt + 18); });
    // garis ovulasi
    cx.strokeStyle = "#7c3aed"; cx.setLineDash([6, 5]); cx.beginPath(); cx.moveTo(X(ov), pt); cx.lineTo(X(ov), pt + gh); cx.stroke(); cx.setLineDash([]);
    cx.fillStyle = "#7c3aed"; cx.font = "700 14px Plus Jakarta Sans, sans-serif"; cx.fillText("Ovulasi", X(ov) + 4, pt + 38);
    // endometrium (batang bawah)
    for (let d = 1; d <= L; d++) { const v = Hormon.nilai(d, L), h = v.endo / 12 * 50; cx.fillStyle = d === hari ? "#db2777" : "#fda4af"; cx.fillRect(X(d) - gw / L / 2 + 1, H - 8 - h, gw / L - 2, h); }
    cx.fillStyle = "#64748b"; cx.font = "600 13px Plus Jakarta Sans, sans-serif"; cx.fillText("Endometrium", 4, H - 12);
    // kurva
    [["fsh", "#0ea5e9"], ["lh", "#7c3aed"], ["e2", "#ec4899"], ["p4", "#f59e0b"]].forEach(([k, w]) => {
      cx.strokeStyle = w; cx.lineWidth = 3.5; cx.beginPath();
      for (let s = 0; s <= 200; s++) { const d = 1 + (L - 1) * s / 200, v = Hormon.nilai(d, L)[k]; const x = X(d), y = pt + gh - v * gh * .92; s ? cx.lineTo(x, y) : cx.moveTo(x, y); }
      cx.stroke();
    });
    // penanda hari
    cx.strokeStyle = "#0c4a6e"; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(X(hari), pt); cx.lineTo(X(hari), pt + gh); cx.stroke();
    cx.fillStyle = "#0c4a6e"; cx.beginPath(); cx.arc(X(hari), pt + gh, 6, 0, 7); cx.fill();
    // sumbu
    cx.fillStyle = "#335f7d"; cx.font = "600 13px Plus Jakarta Sans, sans-serif";
    for (let d = 1; d <= L; d += (L > 30 ? 4 : 3)) cx.fillText(d, X(d) - 4, pt + gh + 16);
  }
  function perbarui() {
    hari = Math.min(+$("#r-hari").value, L); $("#r-hari").max = L; $("#r-hari").value = hari;
    const v = Hormon.nilai(hari, L);
    $("#v-hari").textContent = hari; $("#v-L").textContent = L;
    $("#fase").textContent = `${v.faseOv} · ${v.faseEn}`;
    $("#n-ov").textContent = "hari " + v.ov;
    $("#n-endo").textContent = v.endo.toFixed(1).replace(".", ",") + " mm";
    $("#n-fol").textContent = (v.x >= 27 ? "regresi" : Math.round(v.folikel) + " mm");
    const dom = [["FSH", v.fsh], ["LH", v.lh], ["Estrogen", v.e2], ["Progesteron", v.p4]].sort((a, b) => b[1] - a[1])[0][0];
    $("#n-dom").textContent = dom;
    $("#jelas").textContent = Hormon.jelaskan(v);
    gambarGrafik();
  }
  $("#r-hari").oninput = perbarui;
  $("#r-L").oninput = () => { L = +$("#r-L").value; perbarui(); };
  $("#putar").onclick = () => {
    if (putar) { clearInterval(putar); putar = null; $("#putar").textContent = "▶ Putar siklus"; return; }
    $("#putar").textContent = "⏸ Jeda";
    putar = setInterval(() => { let d = +$("#r-hari").value + 1; if (d > L) d = 1; $("#r-hari").value = d; perbarui(); }, 450);
  };
  $("#lab-ai").onclick = async () => {
    const v = Hormon.nilai(hari, L), o = $("#lab-out"); o.classList.add("tampil"); o.innerHTML = '<span class="memuat"><i></i><i></i><i></i></span>';
    const r = await AI.tanya(`Pada siklus ${L} hari, hari ke-${hari} (fase ovarium ${v.faseOv}, endometrium ${v.faseEn}). Jelaskan dalam ±120 kata hormon yang dominan, mekanisme umpan baliknya, perubahan endometrium dan lendir serviks/suhu basal, serta satu contoh edukasi bidan. Akhiri dengan satu pertanyaan.`, { fallback: () => `**Hari ke-${hari} — ${v.faseOv} / ${v.faseEn}**\n\n${Hormon.jelaskan(v)}\n\n_Pertanyaan:_ Jika siklus klien ${L + 4} hari, kapan ovulasinya?` });
    o.innerHTML = AI.md(r.teks);
  };
  perbarui();

  /* ---------- Mitos atau Fakta ---------- */
  const M = D.mitos; let mi = 0, ms = 0, terjawab = false;
  function kartu() {
    terjawab = false; $("#m-no").textContent = `Kartu ${mi + 1}/${M.length}`; $("#m-skor").textContent = `Skor ${ms}`;
    $("#m-teks").textContent = "“" + M[mi].s + "”"; $("#m-umpan").classList.remove("tampil"); $("#m-lanjut").style.display = "none";
  }
  $$(".tombol-mf button").forEach(b => b.onclick = () => {
    if (terjawab) return; terjawab = true;
    const benar = (+b.dataset.j === 1) === M[mi].fakta; if (benar) ms++;
    $("#m-skor").textContent = `Skor ${ms}`;
    const u = $("#m-umpan"); u.classList.add("tampil"); u.innerHTML = (benar ? "✅ <b>Tepat!</b> " : "❌ <b>Belum tepat.</b> ") + M[mi].p;
    $("#m-lanjut").style.display = ""; $("#m-lanjut").textContent = mi < M.length - 1 ? "Kartu berikutnya →" : `Selesai · skor ${ms}/${M.length} — ulangi`;
  });
  $("#m-lanjut").onclick = () => { if (mi < M.length - 1) mi++; else { mi = 0; ms = 0; } kartu(); };
  $("#m-ai").onclick = () => AI.kirimKeChat(`Bahas pernyataan masyarakat ini secara fisiologis: "${M[mi].s}". Bagaimana bidan meluruskannya dengan santun kepada keluarga di Jawa Timur?`);
  kartu();

  /* ---------- Kuis ---------- */
  let qi = 0, skor = 0, jw = [];
  function kuis() {
    const K = D.kuis, el = $("#kuis");
    if (qi >= K.length) {
      const n = Math.round(skor / K.length * 100);
      el.innerHTML = `<div style="text-align:center"><div class="skor">${n}</div><p>Benar ${skor} dari ${K.length} soal</p>
        ${n >= 75 ? `<div class="lencana"><span style="font-size:52px">🏅</span><b style="color:#0369a1">Bidan Paham Fisiologi</b><small>GARBA · Sub-CPMK 13–14</small></div>` : `<p>Belum mencapai 75. Pelajari kembali topik yang terlewat, lalu ulangi, nggih.</p>`}
        <div class="aksi" style="justify-content:center;margin-top:16px"><button class="btn btn-primer" id="ulang">↺ Ulangi</button></div>
        <details style="text-align:left;margin-top:18px"><summary style="cursor:pointer;font-weight:700">Lihat pembahasan</summary><ol>${K.map((q, i) => `<li style="margin:8px 0">${q.q}<br><b style="color:${jw[i] === q.a ? "#047857" : "#be123c"}">${jw[i] === q.a ? "✓" : "✗"} Kunci: ${q.o[q.a]}</b></li>`).join("")}</ol></details></div>`;
      $("#ulang").onclick = () => { qi = 0; skor = 0; jw = []; kuis(); };
      return;
    }
    const q = K[qi];
    el.innerHTML = `<div class="baris" style="justify-content:space-between"><span class="chip">Soal ${qi + 1} / ${K.length}</span><span class="chip">Skor: ${skor}</span></div>
      <div class="bar" style="width:100%;margin:12px 0"><i style="width:${qi / K.length * 100}%"></i></div>
      <p class="kuis-q">${q.q}</p>${q.o.map((o, i) => `<button class="pil" data-i="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}`;
    $$(".pil", el).forEach(b => b.onclick = () => {
      const i = +b.dataset.i; jw[qi] = i; $$(".pil", el).forEach(x => x.disabled = true);
      b.classList.add(i === q.a ? "benar" : "salah"); $$(".pil", el)[q.a].classList.add("benar");
      if (i === q.a) skor++; setTimeout(() => { qi++; kuis(); }, 900);
    });
  }
  kuis();

  /* ---------- AI ---------- */
  AI.pasangChat();
  $("#hero-ai").onclick = () => AI.bukaChat();
  $("#mode-ai").onclick = () => AI.bukaChat();
  $("#nav-ai").onclick = e => { e.preventDefault(); AI.bukaSetelan(); };
  const m = location.hash.match(/topik-(\d)/); if (m) buka(+m[1]);
})();
