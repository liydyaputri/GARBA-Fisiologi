/* =========================================================
   GARBA — Model fisiologis bersama (VR & AR & Lab 2D)
   ========================================================= */
(function () {
  /* ---------- 1. Model hormon siklus (nilai relatif, ilustrasi buku ajar) ---------- */
  const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
  const sig = (x, k = 1.6) => 1 / (1 + Math.exp(-k * x));
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const Hormon = {
    /* petakan hari d pada siklus sepanjang L ke "hari baku 28" (fase luteal tetap 14 hari) */
    baku(d, L = 28) { const ov = L - 14; return d <= ov ? 1 + (d - 1) * (13 / Math.max(1, ov - 1)) : 14 + (d - ov); },
    nilai(d, L = 28) {
      const x = this.baku(d, L);
      const lh = clamp(0.1 + 0.9 * g(x, 13.6, 0.75));
      const fsh = clamp(0.32 + 0.3 * g(x, 2.5, 2.4) - 0.14 * g(x, 9, 2.4) + 0.55 * g(x, 13.6, 0.8) + 0.28 * g(x, 28.6, 2.0) - 0.1 * g(x, 21, 4));
      const e2 = clamp(0.1 + 0.9 * g(x, 12.6, 1.9) + 0.42 * g(x, 21, 3.0) * sig(x - 15));
      const p4 = clamp(0.04 + 0.96 * g(x, 21, 3.3) * sig(x - 15, 1.4));
      let endo; // mm (perkiraan)
      if (x <= 5) endo = 5 - 3.5 * (x - 1) / 4;
      else if (x <= 14) endo = 1.5 + 8.5 * (x - 5) / 9;
      else if (x <= 26) endo = 10 + 1.5 * Math.sin(Math.PI * (x - 14) / 14);
      else endo = 10 - 5 * (x - 26) / 2;
      const folikel = x <= 14 ? 4 + 16 * ((x - 1) / 13) ** 1.3 : (x < 24 ? 15 : 15 - 10 * (x - 24) / 4); // mm
      const ov = L - 14;
      const faseOv = d < ov ? "Folikular" : (d === ov ? "Ovulasi" : "Luteal");
      const faseEn = x <= 5 ? "Menstruasi" : (x <= 14 ? "Proliferasi" : "Sekresi");
      return { lh, fsh, e2, p4, endo, folikel, faseOv, faseEn, ov, x };
    },
    jelaskan(v) {
      if (v.faseEn === "Menstruasi") return "Progesteron & estrogen rendah setelah korpus luteum regresi → lapisan fungsional endometrium luruh. FSH mulai naik merekrut folikel baru.";
      if (v.faseOv === "Ovulasi") return "Lonjakan LH (umpan balik positif estrogen) → folikel de Graaf pecah, oosit dilepaskan. Sisa folikel menjadi korpus luteum.";
      if (v.faseOv === "Folikular") return v.e2 > 0.6 ? "Estrogen folikel dominan tinggi dan bertahan → menyiapkan lonjakan LH. Endometrium menebal (proliferasi), lendir serviks jernih-elastis." : "FSH merangsang pertumbuhan folikel; folikel dominan mulai menghasilkan estrogen → endometrium berproliferasi.";
      return v.p4 > 0.5 ? "Korpus luteum menghasilkan progesteron tinggi → endometrium fase sekresi siap menerima implantasi; suhu basal naik; umpan balik negatif menekan FSH/LH." : "Tanpa hCG, korpus luteum mulai regresi → progesteron turun → menjelang menstruasi.";
    }
  };
  window.Hormon = Hormon;

  if (!window.AFRAME) return;

  /* ---------- 2. Utilitas A-Frame ---------- */
  const FONT = '"Plus Jakarta Sans", system-ui, sans-serif';
  let nKv = 0;
  const el = (tag, attrs, parent) => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
  function kanvas(w, h, f) { const c = document.createElement("canvas"); c.id = "kv-g-" + (nKv++); c.width = w; c.height = h; f(c.getContext("2d"), w, h); return c; }
  function tekstur(e, c) { e.setAttribute("material", { shader: "flat", side: "double", transparent: true, color: "#ffffff", src: c }); }
  function label(parent, teks, sub, pos, w = .5, warna = "#0c4a6e") {
    const p = el("a-plane", { width: w, height: w * .25, position: pos }, parent);
    const gambar = (t, s) => tekstur(p, kanvas(512, 128, (g, W, H) => {
      g.fillStyle = "rgba(255,255,255,.94)"; g.beginPath(); g.roundRect ? g.roundRect(3, 3, W - 6, H - 6, 28) : g.rect(3, 3, W - 6, H - 6); g.fill();
      g.strokeStyle = "#7dd3fc"; g.lineWidth = 4; g.stroke();
      g.fillStyle = warna; g.textAlign = "center"; let fs = s ? 40 : 46; do { g.font = `800 ${fs}px ${FONT}`; fs -= 2; } while (g.measureText(t).width > W - 40 && fs > 14); g.fillText(t, W / 2, s ? 58 : 78);
      if (s) { g.fillStyle = "#335f7d"; let f2 = 28; do { g.font = `600 ${f2}px ${FONT}`; f2 -= 2; } while (g.measureText(s).width > W - 30 && f2 > 12); g.fillText(s, W / 2, 100); }
    }));
    gambar(teks, sub); p.ubah = gambar; return p;
  }
  function papan(parent, pos, w = .9, h = .55) { // papan teks multi-baris yang bisa diperbarui
    const p = el("a-plane", { width: w, height: h, position: pos }, parent);
    p.tulis = (judul, isi, warna = "#0369a1") => tekstur(p, kanvas(1024, Math.round(1024 * h / w), (g, W, H) => {
      g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect ? g.roundRect(4, 4, W - 8, H - 8, 30) : g.rect(4, 4, W - 8, H - 8); g.fill();
      g.fillStyle = warna; g.fillRect(4, 4, W - 8, 80);
      g.fillStyle = "#fff"; g.font = `800 44px ${FONT}`; g.fillText(judul, 28, 60);
      g.fillStyle = "#0c4a6e"; g.font = `500 32px ${FONT}`;
      const kata = isi.split(" "); let b = "", y = 135;
      for (const k of kata) { const u = b ? b + " " + k : k; if (g.measureText(u).width > W - 56) { g.fillText(b, 28, y); b = k; y += 42; } else b = u; }
      if (b) g.fillText(b, 28, y);
    }));
    return p;
  }
  const Models = { label, papan, el, kanvas, tekstur };

  /* ---------- 3. Siklus ovarium–menstruasi ---------- */
  Models.siklus = function (root) {
    const g0 = el("a-entity", {}, root);
    // ovarium & folikel
    el("a-sphere", { radius: .11, scale: "1.35 .85 .9", position: "-.38 .16 0", color: "#fbcfe8" }, g0);
    const fol = el("a-sphere", { radius: .03, position: "-.3 .2 .06", color: "#fde68a", material: "opacity: .9; transparent: true" }, g0);
    label(g0, "Ovarium", "folikel / korpus luteum", "-.38 .38 0", .34);
    // uterus & endometrium
    el("a-box", { width: .3, height: .06, depth: .2, position: "-.38 -.18 0", color: "#be185d" }, g0);
    const endo = el("a-box", { width: .28, height: .02, depth: .19, position: "-.38 -.14 0", color: "#f9a8d4" }, g0);
    label(g0, "Endometrium", "ketebalan (mm)", "-.38 -.32 0", .34);
    // grafik batang 3D hormon
    const H = [["FSH", "#0ea5e9", "fsh"], ["LH", "#7c3aed", "lh"], ["Estrogen", "#ec4899", "e2"], ["Progesteron", "#f59e0b", "p4"]];
    const batang = H.map(([n, w], i) => {
      const x = -.05 + i * .14;
      el("a-box", { width: .1, height: .005, depth: .1, position: `${x} -.2 0`, color: "#e2e8f0" }, g0);
      const b = el("a-box", { width: .09, height: .1, depth: .09, position: `${x} -.15 0`, color: w, material: "roughness: .4" }, g0);
      label(g0, n, null, `${x} -.27 .06`, .14, w);
      return b;
    });
    const judul = label(g0, "Hari ke-1", "Fase folikular · Menstruasi", "0.16 .45 0", .55, "#be185d");
    const ctl = {
      hari: 1, L: 28,
      set(d) {
        this.hari = d; const v = Hormon.nilai(d, this.L);
        batang.forEach((b, i) => { const h = .02 + .42 * v[H[i][2]]; b.setAttribute("height", h); b.setAttribute("position", `${-.05 + i * .14} ${-.2 + h / 2} 0`); });
        const t = .006 + v.endo * .006; endo.setAttribute("height", t); endo.setAttribute("position", `-.38 ${-.15 + t / 2} 0`);
        const r = .008 + v.folikel * .0022; fol.setAttribute("radius", r);
        fol.setAttribute("color", v.x > 14.5 ? "#f59e0b" : "#fde68a");
        fol.setAttribute("visible", !(v.x >= 27));
        judul.ubah(`Hari ke-${d} dari ${this.L}`, `Ovarium: ${v.faseOv} · Endometrium: ${v.faseEn}`);
        this.v = v; return v;
      },
      info() { const v = this.v || this.set(1); return { judul: `Hari ke-${this.hari}: ${v.faseOv} / ${v.faseEn}`, isi: Hormon.jelaskan(v), topik: 1 }; }
    };
    ctl.set(1);
    return ctl;
  };

  /* ---------- 4. Mekanisme persalinan ---------- */
  const LANGKAH_PERSALINAN = [
    { n: "Posisi awal", isi: "Kepala janin di atas pintu atas panggul dengan sutura sagitalis melintang (ubun-ubun kecil di samping).", y: .62, pitch: 10, yaw: 90, z: 0 },
    { n: "1. Engagement", isi: "Diameter biparietal melewati pintu atas panggul. Pada primigravida sering terjadi beberapa minggu sebelum persalinan.", y: .3, pitch: 10, yaw: 90, z: 0 },
    { n: "2. Penurunan", isi: "Kepala turun karena tekanan kontraksi uterus dan (di Kala II) tenaga mengejan ibu.", y: .1, pitch: 12, yaw: 90, z: 0 },
    { n: "3. Fleksi", isi: "Dagu mendekat ke dada sehingga diameter terkecil (suboksipitobregmatika ± 9,5 cm) yang memasuki panggul.", y: .02, pitch: 35, yaw: 90, z: 0 },
    { n: "4. Putaran paksi dalam", isi: "Ubun-ubun kecil berputar ke depan menuju simfisis, menyesuaikan dengan bentuk dasar panggul.", y: -.12, pitch: 35, yaw: 0, z: 0 },
    { n: "5. Ekstensi", isi: "Suboksiput tertahan di bawah simfisis (hipomoklion); kepala berdefleksi sehingga dahi, muka, dan dagu lahir.", y: -.42, pitch: -40, yaw: 0, z: .1 },
    { n: "6. Putaran paksi luar", isi: "Restitusi: kepala berputar kembali sejajar dengan punggung janin, diikuti rotasi bahu ke diameter anteroposterior.", y: -.55, pitch: -10, yaw: 90, z: .12 },
    { n: "7. Ekspulsi", isi: "Bahu depan lahir di bawah simfisis, disusul bahu belakang dan seluruh tubuh bayi. Kala II selesai.", y: -.85, pitch: 0, yaw: 90, z: .15 }
  ];
  Models.persalinan = function (root) {
    const g0 = el("a-entity", {}, root);
    // panggul (jalan lahir)
    el("a-torus", { radius: .2, "radius-tubular": .03, rotation: "90 0 0", position: "0 .3 0", color: "#d6b98c", material: "roughness: .8" }, g0);
    el("a-torus", { radius: .17, "radius-tubular": .025, rotation: "90 0 0", position: "0 -.3 .03", color: "#c9a874" }, g0);
    el("a-cylinder", { radius: .2, height: .6, "open-ended": true, position: "0 0 0", color: "#f9a8d4", material: "opacity: .22; transparent: true; side: double; depthWrite: false" }, g0);
    el("a-box", { width: .1, height: .12, depth: .03, position: "0 -.22 .22", color: "#d6b98c", material: "opacity: .75; transparent: true" }, g0); // simfisis
    el("a-box", { width: .18, height: .5, depth: .05, position: "0 .02 -.23", rotation: "-12 0 0", color: "#c9a874" }, g0); // sakrum
    label(g0, "Simfisis", null, ".22 -.18 .24", .2);
    label(g0, "Pintu atas panggul", null, "-.36 .3 0", .3);
    label(g0, "Pintu bawah panggul", null, "-.36 -.3 0", .3);
    // kepala janin
    const kepala = el("a-entity", { position: "0 .62 0" }, g0);
    const rot = el("a-entity", {}, kepala);
    el("a-sphere", { radius: .095, scale: "1 1 1.22", color: "#f2b48c", material: "roughness: .7" }, rot);
    el("a-sphere", { radius: .02, position: "0 .055 -.1", color: "#7c3aed" }, rot); // ubun-ubun kecil (oksiput)
    el("a-sphere", { radius: .012, position: "-.03 -.01 .105", color: "#1f2937" }, rot);
    el("a-sphere", { radius: .012, position: ".03 -.01 .105", color: "#1f2937" }, rot);
    const badan = el("a-cylinder", { radius: .085, height: .3, position: "0 .25 0", color: "#fcd9bd", visible: false }, kepala);
    label(g0, "● ungu = ubun-ubun kecil", null, ".36 .55 0", .3, "#7c3aed");
    const judul = label(g0, LANGKAH_PERSALINAN[0].n, "ketuk untuk langkah berikutnya", "0 .9 0", .55, "#be185d");
    let i = 0;
    const ctl = {
      i: 0, total: LANGKAH_PERSALINAN.length,
      ke(n) {
        i = (n + LANGKAH_PERSALINAN.length) % LANGKAH_PERSALINAN.length; this.i = i;
        const L = LANGKAH_PERSALINAN[i];
        kepala.setAttribute("animation__p", `property: position; to: 0 ${L.y} ${L.z}; dur: 1100; easing: easeInOutQuad`);
        rot.setAttribute("animation__r", `property: rotation; to: ${-L.pitch} ${L.yaw} 0; dur: 1100; easing: easeInOutQuad`);
        badan.setAttribute("visible", i === 7);
        judul.ubah(L.n, `${i}/${LANGKAH_PERSALINAN.length - 1} · ketuk untuk lanjut`);
        return this.info();
      },
      lanjut() { return this.ke(i + 1); },
      info() { const L = LANGKAH_PERSALINAN[i]; return { judul: "Mekanisme persalinan — " + L.n, isi: L.isi, topik: 5 }; }
    };
    return ctl;
  };
  Models.LANGKAH_PERSALINAN = LANGKAH_PERSALINAN;

  /* ---------- 5. Involusi uterus ---------- */
  const TAHAP_INVOLUSI = [
    { n: "Bayi lahir", tfu: "Setinggi pusat", berat: "± 1000 g", lokia: "—", top: .3, r: .27 },
    { n: "Plasenta lahir", tfu: "± 2 jari di bawah pusat", berat: "± 750 g", lokia: "Rubra mulai", top: .22, r: .23 },
    { n: "Hari ke-7", tfu: "Pertengahan pusat–simfisis", berat: "± 500 g", lokia: "Sanguinolenta → serosa", top: .025, r: .16 },
    { n: "Hari ke-14", tfu: "Tidak teraba di atas simfisis", berat: "± 350 g", lokia: "Serosa → alba", top: -.24, r: .1 },
    { n: "6 minggu", tfu: "Bertambah kecil (mendekati normal)", berat: "± 50 g", lokia: "Alba berakhir", top: -.28, r: .06 }
  ];
  Models.involusi = function (root) {
    const g0 = el("a-entity", {}, root);
    el("a-cylinder", { radius: .34, height: 1.0, position: "0 0 0", color: "#fbcfe8", material: "opacity: .25; transparent: true; side: double; depthWrite: false" }, g0);
    // penanda pusat & simfisis
    el("a-torus", { radius: .025, "radius-tubular": .008, position: "0 .3 .34", color: "#b45309" }, g0);
    el("a-box", { width: .7, height: .004, depth: .004, position: "0 .3 .345", color: "#f59e0b" }, g0);
    label(g0, "Pusat", null, ".5 .3 .3", .2, "#b45309");
    el("a-box", { width: .16, height: .05, depth: .04, position: "0 -.25 .33", color: "#e7e5e4" }, g0);
    el("a-box", { width: .7, height: .004, depth: .004, position: "0 -.25 .345", color: "#94a3b8" }, g0);
    label(g0, "Simfisis", null, ".5 -.25 .3", .2, "#475569");
    const uterus = el("a-sphere", { radius: .27, scale: "1 1.15 .85", position: "0 .03 0", color: "#e11d48", material: "roughness: .55" }, g0);
    const fundus = el("a-box", { width: .5, height: .006, depth: .006, position: "0 .3 .3", color: "#be185d" }, g0);
    const judul = label(g0, "Bayi lahir", "TFU setinggi pusat · ± 1000 g", "0 .68 0", .6, "#be185d");
    let i = 0;
    const ctl = {
      i: 0, total: TAHAP_INVOLUSI.length,
      ke(n) {
        i = (n + TAHAP_INVOLUSI.length) % TAHAP_INVOLUSI.length; this.i = i; const T = TAHAP_INVOLUSI[i];
        const cy = T.top - T.r * 1.15;
        uterus.setAttribute("animation__r", `property: geometry.radius; to: ${T.r}; dur: 1200; easing: easeInOutQuad`);
        uterus.setAttribute("animation__p", `property: position; to: 0 ${cy} 0; dur: 1200; easing: easeInOutQuad`);
        fundus.setAttribute("animation__p", `property: position; to: 0 ${T.top} .3; dur: 1200; easing: easeInOutQuad`);
        judul.ubah(T.n, `TFU: ${T.tfu} · ${T.berat}`);
        return this.info();
      },
      lanjut() { return this.ke(i + 1); },
      info() { const T = TAHAP_INVOLUSI[i]; return { judul: "Involusi uterus — " + T.n, isi: `Tinggi fundus uteri: ${T.tfu}. Berat uterus ${T.berat}. Lokia: ${T.lokia}. Involusi terjadi melalui kontraksi–retraksi miometrium (oksitosin), iskemia, dan autolisis.`, topik: 6 }; }
    };
    return ctl;
  };
  Models.TAHAP_INVOLUSI = TAHAP_INVOLUSI;

  /* ---------- 6. Jalur umpan balik (laktasi, pria) ---------- */
  function jalur(root, simpul, sambung, judulTeks) {
    const g0 = el("a-entity", {}, root), pos = {};
    simpul.forEach(s => {
      pos[s.id] = s.p;
      el("a-sphere", { radius: s.r || .06, position: s.p.join(" "), color: s.w, material: "roughness: .5" }, g0);
      label(g0, s.n, s.sub || null, `${s.p[0]} ${s.p[1] + (s.r || .06) + .07} ${s.p[2]}`, .3, s.lw || "#0c4a6e");
    });
    sambung.forEach(([a, b, w]) => el("a-entity", { line: `start: ${pos[a].join(" ")}; end: ${pos[b].join(" ")}; color: ${w || "#94a3b8"}; opacity: .8` }, g0));
    const judul = label(g0, judulTeks, "ketuk untuk mengalirkan sinyal", "0 .78 0", .6, "#be185d");
    function denyut(rute, warna, mulai = 0) {
      rute.forEach((id, k) => {
        if (k === 0) return;
        setTimeout(() => {
          const a = pos[rute[k - 1]], b = pos[id];
          const p = el("a-sphere", { radius: .025, position: a.join(" "), color: warna, material: "shader: flat" }, g0);
          p.setAttribute("animation", `property: position; to: ${b.join(" ")}; dur: 650; easing: linear`);
          setTimeout(() => p.remove(), 700);
        }, mulai + (k - 1) * 650);
      });
    }
    return { g0, pos, denyut, judul };
  }

  Models.laktasi = function (root) {
    const J = jalur(root, [
      { id: "hip", n: "Hipotalamus", p: [0, .55, 0], w: "#a78bfa" },
      { id: "ant", n: "Hipofisis anterior", sub: "prolaktin", p: [-.32, .3, 0], w: "#f472b6", lw: "#db2777" },
      { id: "pos", n: "Hipofisis posterior", sub: "oksitosin", p: [.32, .3, 0], w: "#38bdf8", lw: "#0284c7" },
      { id: "alv", n: "Alveolus", sub: "produksi ASI", p: [-.25, -.2, 0], w: "#fbcfe8", r: .08 },
      { id: "mio", n: "Sel mioepitel", sub: "let-down", p: [.12, -.2, 0], w: "#bae6fd", r: .07 },
      { id: "put", n: "Puting", sub: "isapan bayi", p: [0, -.5, 0], w: "#fda4af", r: .05 },
      { id: "ute", n: "Uterus", sub: "kontraksi (involusi)", p: [.48, -.2, 0], w: "#e11d48", r: .06 }
    ], [["put", "hip"], ["hip", "ant", "#f472b6"], ["hip", "pos", "#38bdf8"], ["ant", "alv", "#f472b6"], ["pos", "mio", "#38bdf8"], ["pos", "ute", "#38bdf8"], ["alv", "put"], ["mio", "put"]], "Refleks menyusui");
    const tetes = [];
    return {
      lanjut() {
        J.denyut(["put", "hip", "ant", "alv"], "#db2777");
        J.denyut(["put", "hip", "pos", "mio"], "#0284c7", 120);
        J.denyut(["hip", "pos", "ute"], "#0284c7", 650);
        setTimeout(() => { for (let k = 0; k < 6; k++) { const d = el("a-sphere", { radius: .015, position: `${(Math.random() - .5) * .05} -.55 0`, color: "#ffffff" }, J.g0); d.setAttribute("animation", `property: position; to: ${(Math.random() - .5) * .3} -.8 ${Math.random() * .1}; dur: 900; delay: ${k * 90}`); setTimeout(() => d.remove(), 1200 + k * 90); } }, 2000);
        return this.info();
      },
      info() { return { judul: "Refleks prolaktin & oksitosin", isi: "Isapan bayi mengirim impuls saraf ke hipotalamus. Hipofisis anterior melepas prolaktin (merah muda) → alveolus memproduksi ASI. Hipofisis posterior melepas oksitosin (biru) → sel mioepitel berkontraksi sehingga ASI terpancar (let-down), sekaligus uterus berkontraksi membantu involusi.", topik: 7 }; }
    };
  };

  Models.pria = function (root) {
    const J = jalur(root, [
      { id: "hip", n: "Hipotalamus", sub: "GnRH", p: [0, .55, 0], w: "#a78bfa" },
      { id: "hfs", n: "Hipofisis anterior", sub: "LH & FSH", p: [0, .25, 0], w: "#38bdf8" },
      { id: "ley", n: "Sel Leydig", sub: "testosteron", p: [-.32, -.1, 0], w: "#f59e0b" },
      { id: "ser", n: "Sel Sertoli", sub: "inhibin, ABP", p: [.32, -.1, 0], w: "#34d399" },
      { id: "spm", n: "Spermatogenesis", sub: "± 64–74 hari", p: [0, -.45, 0], w: "#bae6fd", r: .07 }
    ], [["hip", "hfs"], ["hfs", "ley", "#f59e0b"], ["hfs", "ser", "#34d399"], ["ley", "spm"], ["ser", "spm"], ["ley", "ser"]], "Poros hipotalamus–hipofisis–testis");
    return {
      lanjut() {
        J.denyut(["hip", "hfs", "ley", "spm"], "#f59e0b");
        J.denyut(["hip", "hfs", "ser", "spm"], "#10b981", 150);
        J.denyut(["ley", "hfs", "hip"], "#ef4444", 2300);
        J.denyut(["ser", "hfs"], "#ef4444", 2450);
        return this.info();
      },
      info() { return { judul: "Regulasi hormonal reproduksi pria", isi: "GnRH → LH & FSH. LH merangsang sel Leydig menghasilkan testosteron; FSH + testosteron bekerja pada sel Sertoli mendukung spermatogenesis. Sinyal merah: umpan balik negatif — testosteron menekan GnRH/LH, inhibin menekan FSH.", topik: 2 }; }
    };
  };

  /* ---------- 7. Fertilisasi → implantasi ---------- */
  const TAHAP_FERT = [
    ["Ovulasi", "Oosit sekunder dilepaskan dari ovarium dan ditangkap fimbria tuba.", [-.45, .1, 0], .035, "#fde68a"],
    ["Fertilisasi (ampula)", "Sperma menembus zona pelusida; terbentuk zigot. Umumnya terjadi di ampula tuba.", [-.25, .25, 0], .035, "#fbbf24"],
    ["Morula", "Zigot membelah (pembelahan) sambil digerakkan silia & peristaltik tuba ke arah uterus.", [0, .28, 0], .04, "#f9a8d4"],
    ["Blastokista", "Terbentuk rongga (blastosel), massa sel dalam, dan trofoblas; tiba di rongga uterus.", [.22, .12, 0], .05, "#f472b6"],
    ["Implantasi (± hari 6–7)", "Trofoblas menembus endometrium; mulai menghasilkan hCG yang mempertahankan korpus luteum.", [.25, -.15, 0], .055, "#db2777"]
  ];
  Models.fertilisasi = function (root) {
    const g0 = el("a-entity", {}, root);
    el("a-sphere", { radius: .09, scale: "1.3 .8 .8", position: "-.55 .02 0", color: "#fbcfe8" }, g0);
    [[-.45, .1], [-.35, .2], [-.25, .25], [-.12, .28], [0, .28], [.12, .22], [.22, .12]].forEach(([x, y]) => el("a-sphere", { radius: .045, position: `${x} ${y} -.02`, color: "#fecdd3", material: "opacity: .55; transparent: true" }, g0));
    el("a-sphere", { radius: .3, scale: ".9 1 .6", position: ".25 -.2 -.05", color: "#fda4af", material: "opacity: .35; transparent: true" }, g0);
    label(g0, "Tuba falopi", null, "-.15 .45 0", .26); label(g0, "Uterus", null, ".25 -.58 0", .2);
    const sel = el("a-sphere", { radius: .035, position: "-.45 .1 .05", color: "#fde68a" }, g0);
    const judul = label(g0, "Ovulasi", "ketuk untuk tahap berikutnya", "0 .72 0", .6, "#be185d");
    let i = 0;
    return {
      lanjut() { i = (i + 1) % TAHAP_FERT.length; return this.ke(i); },
      ke(n) { i = n; const T = TAHAP_FERT[i]; sel.setAttribute("animation__p", `property: position; to: ${T[2][0]} ${T[2][1]} .05; dur: 1000; easing: easeInOutQuad`); sel.setAttribute("radius", T[3]); sel.setAttribute("color", T[4]); judul.ubah(T[0], `${i + 1}/${TAHAP_FERT.length} · ketuk untuk lanjut`); return this.info(); },
      info() { const T = TAHAP_FERT[i]; return { judul: "Fertilisasi & implantasi — " + T[0], isi: T[1], topik: 3 }; }
    };
  };

  /* ---------- 8. Adaptasi kehamilan ---------- */
  const TRIM = [
    { n: "Tidak hamil", v: [0, 0, 0, 0, 0] },
    { n: "Trimester I", v: [.15, .08, .15, .4, .2] },
    { n: "Trimester II", v: [.35, .18, .35, .5, .3] },
    { n: "Trimester III", v: [.45, .25, .4, .5, .35] }
  ];
  const PARAM = [["Volume plasma", "#38bdf8"], ["Massa eritrosit", "#e11d48"], ["Curah jantung", "#f472b6"], ["Laju filtrasi glomerulus", "#f59e0b"], ["Volume tidal", "#34d399"]];
  Models.adaptasi = function (root) {
    const g0 = el("a-entity", {}, root);
    const jantung = el("a-entity", { position: "-.42 .1 0" }, g0);
    el("a-sphere", { radius: .08, position: "-.05 .04 0", color: "#e11d48" }, jantung);
    el("a-sphere", { radius: .08, position: ".05 .04 0", color: "#e11d48" }, jantung);
    el("a-cone", { "radius-bottom": .115, "radius-top": .01, height: .16, rotation: "180 0 0", position: "0 -.06 0", color: "#e11d48" }, jantung);
    jantung.setAttribute("animation", "property: scale; from: 1 1 1; to: 1.12 1.12 1.12; dir: alternate; loop: true; dur: 420; easing: easeInOutSine");
    label(g0, "Jantung ibu", null, "-.42 -.18 0", .24);
    const bar = PARAM.map(([n, w], k) => {
      const x = -.15 + k * .14;
      el("a-box", { width: .1, height: .2, depth: .1, position: `${x} -.1 -.02`, color: "#e2e8f0", material: "opacity: .6; transparent: true" }, g0);
      const b = el("a-box", { width: .09, height: .2, depth: .09, position: `${x} -.1 0`, color: w }, g0);
      label(g0, n, null, `${x} -.28 .06`, .14, w);
      return b;
    });
    label(g0, "abu-abu = sebelum hamil (100%)", null, ".14 .32 0", .45, "#475569");
    const judul = label(g0, "Tidak hamil", "ketuk untuk trimester berikutnya", "0 .55 0", .6, "#be185d");
    let i = 0;
    return {
      lanjut() { return this.ke((i + 1) % TRIM.length); },
      ke(n) { i = n; const T = TRIM[i]; bar.forEach((b, k) => { const h = .2 * (1 + T.v[k]); b.setAttribute("animation__h", `property: geometry.height; to: ${h}; dur: 900`); b.setAttribute("animation__p", `property: position; to: ${-.15 + k * .14} ${-.2 + h / 2} 0; dur: 900`); }); jantung.setAttribute("animation", `property: scale; from: 1 1 1; to: ${1.1 + T.v[2] * .2} ${1.1 + T.v[2] * .2} ${1.1 + T.v[2] * .2}; dir: alternate; loop: true; dur: ${420 - i * 25}; easing: easeInOutSine`); judul.ubah(T.n, PARAM.map((p, k) => `${p[0].split(" ")[0]} +${Math.round(T.v[k] * 100)}%`).slice(0, 3).join(" · ")); return this.info(); },
      info() { const T = TRIM[i]; return { judul: "Adaptasi kehamilan — " + T.n, isi: i === 0 ? "Nilai dasar sebelum hamil (100%). Ketuk untuk melihat perubahan tiap trimester." : `Perkiraan peningkatan (ilustrasi dari kisaran buku ajar): volume plasma +${Math.round(T.v[0] * 100)}%, massa eritrosit +${Math.round(T.v[1] * 100)}%, curah jantung +${Math.round(T.v[2] * 100)}%, GFR +${Math.round(T.v[3] * 100)}%, volume tidal +${Math.round(T.v[4] * 100)}%. Perhatikan: plasma naik lebih banyak dari eritrosit → hemodilusi.`, topik: 4 }; }
    };
  };

  window.GModels = Models;
})();
