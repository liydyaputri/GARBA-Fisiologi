/* GARBA — Taman Garba VR */
(function () {
  const AI = window.SakaAI, D = window.GARBA, M = window.GModels, $ = s => document.querySelector(s);
  const N = D.meta.namaAI, scene = $("#scene"), el = M.el, info = $("#info");
  const R = 6.3;
  document.querySelectorAll(".nama-ai").forEach(e => e.textContent = N);
  document.querySelector(".petunjuk").textContent = `Ketuk model 3D untuk menjalankan mekanisme tahap demi tahap · Ketuk ${N} di tengah taman untuk bertanya`;
  const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';

  /* langit */
  M.tekstur($("#langit"), M.kanvas(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#1d4ed8"); gr.addColorStop(.25, "#0ea5e9"); gr.addColorStop(.42, "#a5f3fc"); gr.addColorStop(.5, "#fbcfe8"); gr.addColorStop(1, "#d1fae5"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
  $("#langit").setAttribute("material", "side", "back");
  for (let i = 0; i < 12; i++) {
    const a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 60, y = 30 + Math.random() * 35;
    const aw = el("a-entity", { position: `${Math.cos(a) * r} ${y} ${Math.sin(a) * r}` }, scene);
    for (let j = 0; j < 4; j++) el("a-sphere", { radius: 5 + Math.random() * 4, position: `${j * 6 - 9} ${Math.random() * 2} ${Math.random() * 3}`, color: "#ffffff", material: "shader: flat; opacity: .92; transparent: true" }, aw);
  }
  /* pohon & bunga */
  const ph = $("#pohon");
  for (let i = 0; i < 44; i++) {
    let x, z; do { const a = Math.random() * Math.PI * 2, r = 12 + Math.random() * 38; x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.abs(x) < 3 && z > 0);
    const s = .8 + Math.random() * .9, t = el("a-entity", { position: `${x} 0 ${z}`, scale: `${s} ${s} ${s}` }, ph);
    el("a-cylinder", { radius: .22, height: 2.2, position: "0 1.1 0", color: "#92400e" }, t);
    el("a-sphere", { radius: 1.7, position: "0 3.1 0", color: ["#34d399", "#f472b6", "#a78bfa", "#fbbf24", "#22d3ee"][i % 5] }, t);
  }
  for (let i = 0; i < 60; i++) { const a = Math.random() * Math.PI * 2, r = 11 + Math.random() * 3; el("a-sphere", { radius: .09, position: `${Math.cos(a) * r} .12 ${Math.sin(a) * r}`, color: ["#f472b6", "#fde68a", "#c4b5fd", "#fda4af"][i % 4] }, ph); }

  /* gazebo tengah */
  const gz = $("#gazebo");
  el("a-cylinder", { radius: 2.3, height: .25, position: "0 .125 0", color: "#f1e6d2" }, gz);
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; el("a-cylinder", { radius: .1, height: 2.9, position: `${Math.cos(a) * 2} 1.7 ${Math.sin(a) * 2}`, color: "#ffffff" }, gz); }
  el("a-cone", { "radius-bottom": 2.8, "radius-top": .2, height: 1.4, "segments-radial": 6, position: "0 3.85 0", color: "#a855f7", material: "side: double" }, gz);
  el("a-sphere", { radius: .2, position: "0 4.6 0", color: "#f472b6" }, gz);

  /* avatar Bunda Lidia: jilbab biru langit, jas bidan putih */
  const av = $("#avatar");
  av.setAttribute("position", "0 .25 0");
  el("a-cone", { "radius-bottom": .42, "radius-top": .26, height: 1.05, position: "0 .52 0", color: "#ffffff", class: "klik" }, av);
  el("a-box", { width: .05, height: .7, depth: .02, position: "0 .6 .32", color: "#e0f2fe" }, av);
  el("a-sphere", { radius: .22, position: "0 1.3 0", color: "#e8b48f", class: "klik" }, av);
  el("a-sphere", { radius: .245, position: "0 1.32 -.05", color: "#38bdf8", class: "klik" }, av);
  el("a-cone", { "radius-bottom": .4, "radius-top": .19, height: .32, position: "0 1.08 -.01", color: "#38bdf8", class: "klik" }, av);
  el("a-sphere", { radius: .025, position: "-.08 1.32 .2", color: "#1f2937" }, av);
  el("a-sphere", { radius: .025, position: ".08 1.32 .2", color: "#1f2937" }, av);
  el("a-torus", { radius: .09, "radius-tubular": .012, position: "0 .92 .3", rotation: "0 0 0", color: "#475569" }, av); // stetoskop
  const lbl = M.label(av, N, "ketuk untuk bertanya", "0 1.95 0", .9, "#be185d");
  av.setAttribute("animation", "property: rotation; from: 0 -20 0; to: 0 20 0; dir: alternate; loop: true; dur: 5000; easing: easeInOutSine");

  /* tujuh stasiun */
  const BANGUN = { 1: "siklus", 2: "pria", 3: "fertilisasi", 4: "adaptasi", 5: "persalinan", 6: "involusi", 7: "laktasi" };
  const stasiun = [];
  D.topik.forEach((t, i) => {
    const th = i * 360 / D.topik.length, rad = th * Math.PI / 180;
    const g = el("a-entity", { position: `${Math.sin(rad) * R} 0 ${Math.cos(rad) * R}`, rotation: `0 ${th} 0` }, $("#stasiun"));
    const KW = ["#0ea5e9","#6366f1","#14b8a6","#a855f7","#ec4899","#f97316","#06b6d4"][i];
    el("a-cylinder", { radius: .75, height: .5, position: "0 .25 0", color: KW }, g);
    el("a-torus", { radius: .75, "radius-tubular": .04, rotation: "90 0 0", position: "0 .5 0", color: "#fde047" }, g);
    // papan nama
    const pn = el("a-plane", { width: 1.5, height: .62, position: "0 3.45 -.25" }, g);
    M.tekstur(pn, M.kanvas(768, 318, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, KW); gr.addColorStop(1, "#a855f7");
      c.fillStyle = gr; c.beginPath(); c.roundRect ? c.roundRect(4, 4, w - 8, h - 8, 36) : c.rect(4, 4, w - 8, h - 8); c.fill();
      c.fillStyle = "#fff"; c.font = `800 34px ${FONT}`; c.fillText(`STASIUN ${t.id}`, 36, 64);
      c.font = `64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; c.fillText(t.ikon, w - 120, 90);
      let fs = 50; do { c.font = `800 ${fs}px ${FONT}`; fs -= 2; } while (c.measureText(t.judul).width > w - 70 && fs > 26);
      c.fillText(t.judul, 36, 160);
      c.fillStyle = "#fde68a"; c.font = `700 30px ${FONT}`; c.fillText("🌸 " + t.lokal.nama, 36, 220);
      c.fillStyle = "#e0f2fe"; c.font = `600 26px ${FONT}`; c.fillText("Ketuk model untuk tahap berikutnya", 36, 276);
    }));
    el("a-cylinder", { radius: .04, height: 3.2, position: "-.7 1.6 -.27", color: "#94a3b8" }, g);
    el("a-cylinder", { radius: .04, height: 3.2, position: ".7 1.6 -.27", color: "#94a3b8" }, g);
    // model
    const wadah = el("a-entity", { position: "0 1.45 0", scale: "1.3 1.3 1.3", class: "klik" }, g);
    const tangkap = el("a-box", { width: 1.2, height: 1.4, depth: .6, position: "0 0 0", class: "klik", material: "opacity: 0; transparent: true; depthWrite: false" }, wadah);
    const ctl = M[BANGUN[t.id]](wadah);
    wadah.addEventListener("click", () => {
      const inf = t.id === 1 ? (ctl.set(ctl.hari + 3 > 28 ? 1 : ctl.hari + 3), ctl.info()) : ctl.lanjut();
      tampil(t, inf); nada();
    });
    stasiun.push({ t, ctl, th });
  });

  /* panel info */
  function tampil(t, inf) {
    document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("aktif", +b.dataset.id === t.id));
    info.innerHTML = `<button class="x" aria-label="Tutup">✕</button><span class="eyebrow">Stasiun ${t.id} · ${t.lokal.nama}</span>
      <h3>${t.ikon} ${inf ? inf.judul : t.judul}</h3>
      ${inf ? `<div class="kotak" style="padding:10px 12px;margin:6px 0;font-size:14px;border-left:5px solid #f472b6">${inf.isi}</div>` : ""}
      <p style="margin:6px 0;font-size:13.5px">${t.ringkas}</p>
      <div class="kotak lokal" style="padding:10px 12px;margin:10px 0;font-size:13.5px"><div>🌸 <b>${t.lokal.nama}:</b> ${t.lokal.isi}</div></div>
      <div class="aksi"><button class="btn btn-kecil btn-putih" data-a="dengar">🔊 Dengarkan</button><button class="btn btn-kecil btn-primer" data-a="ai">🧕🏻 ${N}, jelaskan!</button><a class="btn btn-kecil btn-putih" href="materi.html#topik-${t.id}">📖 Modul & soal</a></div>
      <div class="ai-out" id="vr-ai"></div>`;
    info.classList.add("tampil"); info._t = t; info._inf = inf;
  }
  info.addEventListener("click", async e => {
    if (e.target.closest(".x")) { info.classList.remove("tampil"); AI.suara.diam(); return; }
    const a = e.target.closest("[data-a]")?.dataset.a, t = info._t; if (!a || !t) return;
    if (a === "dengar") AI.suara.bicara((info._inf ? info._inf.judul + ". " + info._inf.isi + ". " : "") + t.ringkas);
    if (a === "ai") {
      const o = $("#vr-ai"); o.classList.add("tampil"); o.innerHTML = '<span class="memuat"><i></i><i></i><i></i></span>';
      const r = await AI.jelaskan(t.id, info._inf ? info._inf.judul : t.judul, ["kelas ibu hamil", "Praktik Mandiri Bidan", "kunjungan rumah"][Math.floor(Math.random() * 3)]);
      o.innerHTML = AI.md(r.teks); AI.suara.bicara(r.teks);
    }
  });

  /* avatar */
  let diVR = false;
  av.addEventListener("click", async () => {
    if (diVR) { const t = info._t || D.topik[0]; const r = await AI.jelaskan(t.id, t.judul); AI.suara.bicara(r.teks); }
    else AI.bukaChat();
  });

  /* navigasi */
  const rig = $("#rig"), kam = $("#kamera");
  function ke(i) {
    const s = stasiun[i], rad = s.th * Math.PI / 180, RR = R + 3.3;
    let cur = rig.getAttribute("rotation").y % 360, tuju = s.th;
    if (tuju - cur > 180) tuju -= 360; if (cur - tuju > 180) tuju += 360;
    rig.setAttribute("animation__p", `property: position; to: ${Math.sin(rad) * RR} 0 ${Math.cos(rad) * RR}; dur: 1100; easing: easeInOutQuad`);
    rig.setAttribute("animation__r", `property: rotation; from: 0 ${cur} 0; to: 0 ${tuju} 0; dur: 1100; easing: easeInOutQuad`);
    const lc = kam.components["look-controls"]; if (lc) { lc.pitchObject.rotation.x = -0.08; lc.yawObject.rotation.y = 0; }
    tampil(s.t, s.ctl.info ? s.ctl.info() : null);
  }
  const nav = $("#nav");
  nav.innerHTML = D.topik.map((t, i) => `<button data-id="${t.id}" data-i="${i}" title="${t.judul}">${t.id}</button>`).join("") + `<button data-av title="${N}">🧕🏻</button>`;
  nav.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-av")) { rig.setAttribute("animation__p", "property: position; to: 0 0 4; dur: 1000; easing: easeInOutQuad"); rig.setAttribute("animation__r", "property: rotation; to: 0 0 0; dur: 1000"); AI.bukaChat(); return; }
    ke(+b.dataset.i);
  });

  /* gaze cursor untuk headset */
  let gaze = null;
  scene.addEventListener("enter-vr", () => {
    diVR = true; info.classList.remove("tampil");
    if (!gaze) gaze = el("a-entity", { cursor: "fuse: true; fuseTimeout: 1500", raycaster: "objects: .klik; far: 30", position: "0 0 -0.9", geometry: "primitive: ring; radiusInner: 0.012; radiusOuter: 0.02", material: "color: #db2777; shader: flat", animation__fusing: "property: scale; startEvents: fusing; from: 1 1 1; to: 0.3 0.3 0.3; dur: 1500", animation__leave: "property: scale; startEvents: mouseleave; to: 1 1 1; dur: 100" }, kam);
    AI.suara.bicara("Selamat datang di Taman Garba. Tatap model untuk menjalankan mekanismenya.");
  });
  scene.addEventListener("exit-vr", () => { diVR = false; if (gaze) { gaze.remove(); gaze = null; } });

  /* suara: detak jantung & nada */
  let ctx; const audio = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; };
  function bunyi(f, t, d, v, tipe = "sine") { const c = audio(), o = c.createOscillator(), g = c.createGain(); o.type = tipe; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .6, t + d); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .05); }
  function nada() { try { const c = audio(), t = c.currentTime; bunyi(880, t, .35, .12); bunyi(1320, t + .08, .4, .08); } catch (e) {} }
  let detak = null;
  $("#b-detak").onclick = () => {
    if (detak) { clearInterval(detak); detak = null; $("#b-detak").textContent = "💓 Suara detak: mati"; return; }
    const beat = () => { const c = audio(), t = c.currentTime; bunyi(70, t, .14, .6); bunyi(60, t + .16, .14, .4); };
    beat(); detak = setInterval(beat, 430); // ± 140 kali/menit (rentang DJJ normal)
    $("#b-detak").textContent = "💓 DJJ ± 140×/menit: hidup";
  };

  /* putaran pelan di balik kotak sambutan */
  const putar = on => [$("#stasiun"), $("#avatar"), $("#pohon")].forEach(e => {
    if (on) e.setAttribute("animation__orbit", "property: rotation; from: 0 0 0; to: 0 360 0; dur: 90000; loop: true; easing: linear");
    else { e.removeAttribute("animation__orbit"); e.setAttribute("rotation", "0 0 0"); }
  });
  putar(true);
  function masuk(t) {
    $("#mulai").classList.add("tutup"); document.body.classList.remove("sambut-buka"); putar(false); nada();
    if (t) setTimeout(() => ke(t - 1), 300); else AI.toast("Selamat datang! Ketuk model atau tombol 1–7.");
  }
  $("#masuk").onclick = () => masuk(0);
  $("#b-chat").onclick = () => { $("#mulai").classList.add("tutup"); document.body.classList.remove("sambut-buka"); putar(false); AI.bukaChat(); };
  $("#b-menu").onclick = () => { $("#mulai").classList.remove("tutup"); document.body.classList.add("sambut-buka"); info.classList.remove("tampil"); };
  const q = new URLSearchParams(location.search);
  if (q.get("t")) masuk(+q.get("t")); else if (q.get("vr")) masuk(0);
  AI.pasangChat();
})();
