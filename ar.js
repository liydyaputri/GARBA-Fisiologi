/* GARBA — Meja AR */
(function () {
  const AI = window.SakaAI, D = window.GARBA, M = window.GModels, $ = s => document.querySelector(s);
  const N = D.meta.namaAI, scene = $("#scene"), info = $("#info"), aksi = $("#aksi");
  const ctl = {
    siklus: M.siklus($("#m-siklus")),
    persalinan: M.persalinan($("#m-persalinan")),
    involusi: M.involusi($("#m-involusi")),
    laktasi: M.laktasi($("#m-laktasi"))
  };
  // area sentuh transparan untuk tiap model
  Object.keys(ctl).forEach(k => M.el("a-box", { width: 1.1, height: 1.3, depth: .5, class: "klik", material: "opacity: 0; transparent: true; depthWrite: false" }, $("#m-" + k)));
  let aktif = "siklus", inf = null;

  function tampil(x) {
    inf = x; const t = D.topik.find(t => t.id === x.topik);
    info.innerHTML = `<button class="x" aria-label="Tutup">✕</button><span class="eyebrow">${t.ikon} Topik ${t.id} · ${t.judul}</span><h3>${x.judul}</h3>
      <p style="margin:0 0 8px;font-size:14px">${x.isi}</p>
      <div class="aksi"><button class="btn btn-kecil btn-putih" data-a="dengar">🔊 Dengarkan</button><button class="btn btn-kecil btn-primer" data-a="ai">🧕🏻 Analisis ${N}</button><a class="btn btn-kecil btn-putih" href="materi.html#topik-${t.id}">📖 Modul & soal</a></div>
      <div class="ai-out" id="ar-ai"></div>`;
    info.classList.add("tampil");
  }
  info.addEventListener("click", async e => {
    if (e.target.closest(".x")) { info.classList.remove("tampil"); AI.suara.diam(); return; }
    const a = e.target.closest("[data-a]")?.dataset.a; if (!a || !inf) return;
    if (a === "dengar") AI.suara.bicara(inf.judul + ". " + inf.isi);
    if (a === "ai") {
      const o = $("#ar-ai"); o.classList.add("tampil"); o.innerHTML = '<span class="memuat"><i></i><i></i><i></i></span>';
      const r = await AI.jelaskan(inf.topik, inf.judul, ["kelas ibu hamil", "Praktik Mandiri Bidan", "kunjungan rumah nifas"][Math.floor(Math.random() * 3)]);
      o.innerHTML = AI.md(r.teks); AI.suara.bicara(r.teks);
    }
  });

  /* klik model = tahap berikutnya */
  Object.keys(ctl).forEach(k => $("#m-" + k).addEventListener("click", () => {
    if (k !== aktif) return;
    if (k === "siklus") { const d = ctl.siklus.hari + 1 > 28 ? 1 : ctl.siklus.hari + 1; ctl.siklus.set(d); const r = $("#r-hari"); if (r) r.value = d; tampil(ctl.siklus.info()); }
    else tampil(ctl[k].lanjut());
  }));

  let jalan = null;
  const AKSI = {
    siklus: () => {
      aksi.innerHTML = `<span class="pill">Hari <b id="v-hari">${ctl.siklus.hari}</b></span><input type="range" id="r-hari" min="1" max="28" value="${ctl.siklus.hari}" aria-label="Hari siklus"><button class="pill" id="b-play">▶ Putar</button><button class="pill" id="b-ai1">🧕🏻 Tanya</button>`;
      $("#r-hari").oninput = e => { ctl.siklus.set(+e.target.value); $("#v-hari").textContent = e.target.value; tampil(ctl.siklus.info()); };
      $("#b-play").onclick = () => {
        if (jalan) { clearInterval(jalan); jalan = null; $("#b-play").textContent = "▶ Putar"; return; }
        $("#b-play").textContent = "⏸ Jeda";
        jalan = setInterval(() => { let d = ctl.siklus.hari + 1; if (d > 28) d = 1; ctl.siklus.set(d); $("#r-hari").value = d; $("#v-hari").textContent = d; if ([1, 6, 12, 14, 21, 26].includes(d)) tampil(ctl.siklus.info()); }, 600);
      };
      $("#b-ai1").onclick = () => AI.kirimKeChat(`Saya sedang melihat model hormon pada hari ke-${ctl.siklus.hari} siklus 28 hari. Ajukan 3 pertanyaan bertahap untuk menguji pemahaman saya tentang umpan balik hormon pada hari tersebut.`);
    },
    persalinan: () => {
      aksi.innerHTML = `<button class="pill" id="b-prev">◀</button><button class="pill" id="b-next">Langkah ▶</button><button class="pill" id="b-auto">🎬 Putar semua</button><button class="pill" id="b-ai2">🧕🏻 Uji saya</button>`;
      $("#b-prev").onclick = () => tampil(ctl.persalinan.ke(ctl.persalinan.i - 1));
      $("#b-next").onclick = () => tampil(ctl.persalinan.lanjut());
      $("#b-auto").onclick = () => { let n = 0; tampil(ctl.persalinan.ke(0)); const t = setInterval(() => { n++; if (n >= ctl.persalinan.total) { clearInterval(t); return; } const x = ctl.persalinan.ke(n); tampil(x); AI.suara.bicara(x.judul.replace("Mekanisme persalinan — ", "") + ". " + x.isi); }, 4200); };
      $("#b-ai2").onclick = () => AI.kirimKeChat("Uji pemahaman saya tentang gerakan kardinal persalinan: tanyakan satu per satu apa yang terjadi pada setiap tahap dan mengapa, lalu beri umpan balik.");
    },
    involusi: () => {
      aksi.innerHTML = `<button class="pill" id="b-prev">◀</button><button class="pill" id="b-next">Hari berikutnya ▶</button><button class="pill" id="b-ai3">🧕🏻 Kasus nifas</button>`;
      $("#b-prev").onclick = () => tampil(ctl.involusi.ke(ctl.involusi.i - 1));
      $("#b-next").onclick = () => tampil(ctl.involusi.lanjut());
      $("#b-ai3").onclick = () => AI.kirimKeChat("Beri saya satu kasus kunjungan nifas dengan data TFU dan lokia. Biarkan saya menilai apakah involusinya normal, lalu beri umpan balik.");
    },
    laktasi: () => {
      aksi.innerHTML = `<button class="pill" id="b-isap">👶 Isapan bayi</button><button class="pill" id="b-ai4">🧕🏻 Konseling menyusui</button>`;
      $("#b-isap").onclick = () => tampil(ctl.laktasi.lanjut());
      $("#b-ai4").onclick = () => AI.kirimKeChat("Saya ingin berlatih menjelaskan refleks prolaktin dan oksitosin kepada ibu yang merasa ASI-nya kurang. Berperanlah sebagai ibu tersebut.");
    }
  };
  function ganti(m) {
    aktif = m; info.classList.remove("tampil"); if (jalan) { clearInterval(jalan); jalan = null; }
    Object.keys(ctl).forEach(k => $("#m-" + k).setAttribute("visible", k === m));
    scene.setAttribute("raycaster", `objects: #m-${m}.klik, #m-${m} .klik; far: 20`);
    document.querySelectorAll("#tab button").forEach(b => b.classList.toggle("aktif", b.dataset.m === m));
    AKSI[m]();
    if (innerWidth > 700) tampil(m === "siklus" ? ctl.siklus.info() : ctl[m].info());
  }
  $("#tab").addEventListener("click", e => { const b = e.target.closest("button"); if (b) ganti(b.dataset.m); });

  /* putar & skala */
  const putar = $("#putar"); let rotY = 0, skala = 1, seret = null, pinch = null;
  const terap = () => { putar.setAttribute("rotation", `0 ${rotY} 0`); putar.setAttribute("scale", `${skala} ${skala} ${skala}`); };
  $("#zin").onclick = () => { skala = Math.min(2.5, skala * 1.2); terap(); };
  $("#zout").onclick = () => { skala = Math.max(.4, skala / 1.2); terap(); };
  $("#rst").onclick = () => { skala = 1; rotY = 0; terap(); };
  scene.addEventListener("pointerdown", e => { seret = { x: e.clientX, r: rotY }; });
  window.addEventListener("pointermove", e => { if (!seret) return; rotY = seret.r + (e.clientX - seret.x) * .5; terap(); });
  window.addEventListener("pointerup", () => seret = null);
  scene.addEventListener("touchmove", e => { if (e.touches.length === 2) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinch) { skala = Math.max(.4, Math.min(2.5, skala * d / pinch)); terap(); } pinch = d; } }, { passive: true });
  scene.addEventListener("touchend", () => pinch = null);

  /* mulai */
  const POS = () => innerHeight > innerWidth ? "0 1.9 -2.4" : "0 1.35 -1.35";
  $("#akar").setAttribute("position", POS());
  const awal = () => { $("#mulai").style.display = "none"; const m = new URLSearchParams(location.search).get("m"); ganti(ctl[m] ? m : "siklus"); };
  $("#b-3d").onclick = awal;
  $("#b-cam").onclick = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      const v = $("#cam"); v.srcObject = s; v.style.display = "block"; await v.play().catch(() => {});
      document.body.style.background = "#000"; awal(); AI.toast("AR Kamera aktif — gerakkan ponsel perlahan");
    } catch (e) { AI.toast("Kamera tidak dapat diakses. Beralih ke mode 3D."); awal(); }
  };
  if (navigator.xr && navigator.xr.isSessionSupported) navigator.xr.isSessionSupported("immersive-ar").then(ok => { if (ok) $("#b-xr").style.display = ""; }).catch(() => {});
  $("#b-xr").onclick = () => { awal(); try { scene.enterAR(); AI.toast("Arahkan ke lantai/meja, ketuk untuk meletakkan model"); } catch (e) { AI.toast("WebXR AR gagal dimulai."); } };
  scene.addEventListener("enter-vr", () => { if (scene.is("ar-mode")) $("#akar").setAttribute("position", "0 .6 -1.2"); });
  scene.addEventListener("exit-vr", () => $("#akar").setAttribute("position", POS()));
  AI.pasangChat();
})();
