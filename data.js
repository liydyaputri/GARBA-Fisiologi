/* =========================================================
   GARBA — Data materi Fisiologi Reproduksi & Maternal
   MK Fisiologi (SB1L33) · Prodi S1 Kebidanan & Profesi Bidan
   Universitas Sunan Gresik
   ========================================================= */
window.GARBA = {
  meta: {
    app: "GARBA",
    tagline: "Laboratorium Imersif Fisiologi Reproduksi & Maternal",
    namaAI: "Bunda Lidia",          // ← ganti nama asisten AI cukup di sini
    avatarAI: "🧕🏻",
    mk: "Fisiologi (SB1L33) · Semester 1",
    pekan: "Minggu 12–15 · Sub-CPMK 13 & 14",
    subcpmk: "Sub-CPMK 13: menjelaskan fisiologi reproduksi wanita dan pria serta adaptasi fisiologis pada kehamilan, persalinan, nifas, dan laktasi. Sub-CPMK 14: menganalisis model hormonal dan data simulasi perubahan fisiologis reproduksi dan maternal sebagai dasar asuhan kebidanan.",
    dosen: "Bdn. Lidia Aditama Putri, S.ST., M.K.M.",
    prodi: "Program Studi Sarjana Kebidanan dan Profesi Bidan — Universitas Sunan Gresik"
  },

  topik: [
    {
      id: 1, kode: "siklus", judul: "Siklus Ovarium–Menstruasi", ikon: "🌙", ar: "siklus",
      lokal: { nama: "Pranata Mangsa", asal: "Jawa",
        isi: "Petani Jawa membaca tanda alam lewat pranata mangsa untuk menentukan saat menanam. Perempuan pun dapat membaca 'tanda tubuh' — lendir serviks yang jernih-elastis dan kenaikan suhu basal — untuk mengenali fase siklusnya. Siklus bukan misteri, melainkan irama yang teratur." },
      ringkas: "Siklus reproduksi wanita diatur oleh <b>poros hipotalamus–hipofisis–ovarium</b>. GnRH yang disekresi secara pulsatil merangsang hipofisis anterior melepas <b>FSH</b> dan <b>LH</b>. Pada <b>fase folikular</b>, FSH menumbuhkan folikel; folikel dominan menghasilkan <b>estrogen</b> yang menebalkan endometrium (fase proliferasi). Estrogen yang tinggi dan bertahan memicu <b>umpan balik positif</b> sehingga terjadi <b>lonjakan LH</b> → <b>ovulasi</b>. Pada <b>fase luteal</b>, korpus luteum menghasilkan <b>progesteron</b> dan estrogen (fase sekresi endometrium) dengan umpan balik negatif. Tanpa kehamilan (tanpa hCG), korpus luteum regresi, progesteron turun, dan endometrium luruh → <b>menstruasi</b>.",
      poin: [
        "Panjang siklus normal dewasa umumnya 21–35 hari; contoh baku 28 hari dengan ovulasi sekitar hari ke-14.",
        "Fase luteal relatif konstan (± 14 hari); variasi panjang siklus terutama berasal dari fase folikular.",
        "Ovulasi terjadi sekitar 24–36 jam setelah lonjakan LH dimulai.",
        "Estrogen: umpan balik negatif pada kadar rendah–sedang, berubah menjadi <b>positif</b> pada kadar tinggi yang bertahan (pra-ovulasi).",
        "Progesteron menaikkan suhu basal ± 0,3–0,5 °C dan mengentalkan lendir serviks — tanda fase luteal.",
        "Fase endometrium: menstruasi (± hari 1–5) → proliferasi (estrogen) → sekresi (progesteron)."
      ],
      contoh: [
        { konteks: "Konseling remaja (Posyandu Remaja)", teks: "Siswi kelas X di Gresik cemas karena siklusnya 32 hari, berbeda dengan temannya (27 hari). Bidan menjelaskan bahwa 21–35 hari masih normal dan perbedaan terutama ada di fase folikular." },
        { konteks: "Konseling pranikah (KUA–Puskesmas)", teks: "Calon pengantin bertanya tentang masa subur. Bidan menggambar grafik LH dan menjelaskan bahwa ovulasi terjadi setelah lonjakan LH, sedangkan suhu basal naik setelah ovulasi karena progesteron." },
        { konteks: "Praktik Mandiri Bidan (PMB)", teks: "Klien mengalami haid tidak teratur. Bidan mencatat kalender haid 3 bulan untuk membedakan variasi fisiologis dengan kondisi yang perlu dirujuk." }
      ],
      aktivitas: { tipe: "urut", judul: "Urutkan Peristiwa Siklus 28 Hari", instruksi: "Susun peristiwa berikut sesuai urutan waktu dalam satu siklus.",
        item: [
          "Progesteron turun, endometrium luruh — menstruasi dimulai.",
          "FSH merangsang pertumbuhan beberapa folikel; terpilih satu folikel dominan.",
          "Estrogen dari folikel dominan meningkat tinggi dan bertahan.",
          "Lonjakan LH (umpan balik positif estrogen).",
          "Ovulasi: oosit dilepaskan dari folikel de Graaf.",
          "Korpus luteum menghasilkan progesteron; endometrium fase sekresi."
        ] },
      diskusi: [
        "Mengapa umpan balik estrogen bisa berubah dari negatif menjadi positif? Apa makna klinisnya bagi penentuan masa subur?",
        "Klien bersiklus 35 hari. Kira-kira hari ke berapa ovulasinya? Jelaskan alasannya berdasarkan fase luteal."
      ],
      sumber: ["Hall, J. E., & Hall, M. E. (2025). Guyton and Hall Textbook of Medical Physiology (15th ed.). Elsevier — bab fisiologi wanita sebelum kehamilan.", "Coad, J., Pedley, K., & Dunstall, M. (2019). Anatomy and Physiology for Midwives (4th ed.). Elsevier.", "Silverthorn, D. U. (2022). Human Physiology: An Integrated Approach (9th ed.). Pearson."]
    },
    {
      id: 2, kode: "pria", judul: "Reproduksi Pria & Spermatogenesis", ikon: "🔬", ar: null,
      lokal: { nama: "Pondok Pesantren", asal: "Gresik",
        isi: "Sel Sertoli ibarat pengasuh pondok: membina 'santri' (sel germinal) tahap demi tahap — dari spermatogonium hingga spermatozoa — memberi nutrisi, melindungi lewat 'pagar pondok' (sawar darah-testis), dan melapor ke 'kiai' (hipofisis) melalui inhibin." },
      ringkas: "Pada pria, GnRH merangsang hipofisis melepas <b>LH</b> dan <b>FSH</b>. LH bekerja pada <b>sel Leydig</b> untuk menghasilkan <b>testosteron</b>. FSH bersama testosteron bekerja pada <b>sel Sertoli</b> di tubulus seminiferus untuk mendukung <b>spermatogenesis</b>: spermatogonium → spermatosit primer → spermatosit sekunder (meiosis) → spermatid → spermatozoa (spermiogenesis). Umpan balik negatif dilakukan oleh testosteron (terutama terhadap GnRH/LH) dan <b>inhibin</b> dari sel Sertoli (terhadap FSH).",
      poin: [
        "Satu siklus spermatogenesis berlangsung sekitar 64–74 hari.",
        "Suhu testis ± 2–3 °C lebih rendah dari suhu inti tubuh — penting untuk spermatogenesis.",
        "Sel Sertoli: nutrisi sel germinal, sawar darah-testis, ABP (androgen-binding protein), inhibin.",
        "Testosteron: diferensiasi organ kelamin pria, ciri seks sekunder, anabolik protein, libido.",
        "Pematangan dan peningkatan motilitas sperma berlanjut di epididimis."
      ],
      contoh: [
        { konteks: "Konseling pasangan (PMB)", teks: "Pasangan menikah 1,5 tahun belum hamil. Bidan menjelaskan bahwa evaluasi kesuburan melibatkan kedua pasangan, termasuk faktor pria seperti paparan panas berlebih pada testis." },
        { konteks: "Penyuluhan remaja putra (sekolah)", teks: "Bidan menjelaskan perubahan pubertas pria akibat testosteron dan pentingnya pola hidup sehat (tidak merokok) bagi kualitas sperma." },
        { konteks: "Kelas calon pengantin", teks: "Bidan menggunakan diagram poros hipotalamus–hipofisis–testis untuk menjelaskan bahwa kesuburan pria juga diatur hormon." }
      ],
      aktivitas: { tipe: "pasang", judul: "Siapa Mengerjakan Apa?", instruksi: "Pasangkan setiap fungsi dengan sel/hormon yang tepat.",
        opsi: ["Sel Leydig", "Sel Sertoli", "FSH", "LH", "Inhibin"],
        item: [
          { t: "Menghasilkan testosteron.", k: "Sel Leydig" },
          { t: "Membentuk sawar darah-testis dan menutrisi sel germinal.", k: "Sel Sertoli" },
          { t: "Hormon hipofisis yang merangsang sel Leydig.", k: "LH" },
          { t: "Hormon hipofisis yang bekerja pada sel Sertoli mendukung spermatogenesis.", k: "FSH" },
          { t: "Umpan balik negatif spesifik terhadap sekresi FSH.", k: "Inhibin" }
        ] },
      diskusi: [
        "Mengapa pemberian testosteron dari luar (misalnya penyalahgunaan steroid anabolik) justru dapat menurunkan produksi sperma?",
        "Bandingkan pola sekresi hormon reproduksi pria (relatif stabil) dengan wanita (siklik). Apa penyebab perbedaannya?"
      ],
      sumber: ["Hall, J. E., & Hall, M. E. (2025). Guyton and Hall Textbook of Medical Physiology (15th ed.). Elsevier — bab fungsi reproduksi dan hormonal pria.", "Tortora, G. J., & Derrickson, B. H. (2020). Principles of Anatomy and Physiology (16th ed.). Wiley."]
    },
    {
      id: 3, kode: "fertilisasi", judul: "Fertilisasi, Implantasi & Hormon Kehamilan", ikon: "🌱", ar: null,
      lokal: { nama: "Ngapati", asal: "Jawa",
        isi: "Masyarakat Jawa mengadakan selamatan ngapati (ngupati) pada usia kehamilan empat bulan, berbarengan doa bagi janin. Momen ini dapat dimanfaatkan bidan untuk menjelaskan bahwa organ janin sudah terbentuk dan plasenta telah mengambil alih produksi hormon kehamilan." },
      ringkas: "<b>Fertilisasi</b> umumnya terjadi di <b>ampula tuba</b>. Zigot membelah sambil bergerak ke uterus dan menjadi <b>blastokista</b>, yang <b>berimplantasi</b> di endometrium sekitar hari ke-6–7 setelah fertilisasi. Trofoblas menghasilkan <b>hCG</b> yang mempertahankan korpus luteum agar progesteron dan estrogen tetap tinggi — sehingga menstruasi tidak terjadi. Seiring berkembangnya <b>plasenta</b>, produksi progesteron dan estrogen diambil alih plasenta (sekitar akhir trimester I). Plasenta juga menghasilkan hPL (human placental lactogen) yang memengaruhi metabolisme ibu.",
      poin: [
        "Oosit dapat dibuahi sekitar 24 jam setelah ovulasi; sperma dapat bertahan beberapa hari di saluran reproduksi wanita.",
        "hCG terdeteksi pada tes kehamilan; kadarnya memuncak pada trimester I (± minggu 8–10).",
        "Progesteron: mempertahankan endometrium (desidua), menenangkan miometrium.",
        "Estrogen kehamilan: pertumbuhan uterus, payudara (duktus), dan aliran darah uteroplasenta.",
        "hPL: meningkatkan ketersediaan glukosa bagi janin (efek anti-insulin pada ibu)."
      ],
      contoh: [
        { konteks: "Pemeriksaan kehamilan awal (PMB)", teks: "Klien terlambat haid 10 hari dan tes kehamilan positif. Bidan menjelaskan bahwa hCG berasal dari trofoblas dan berfungsi mempertahankan korpus luteum." },
        { konteks: "Kelas ibu hamil", teks: "Ibu bertanya mengapa mual paling berat di bulan-bulan awal. Bidan menjelaskan bahwa hCG memuncak pada trimester I, yang sering dikaitkan dengan mual-muntah kehamilan." },
        { konteks: "Kunjungan rumah", teks: "Menjelang ngapati, bidan menjelaskan kepada keluarga bahwa organ janin sudah terbentuk dan pentingnya ANC rutin." }
      ],
      aktivitas: { tipe: "urut", judul: "Perjalanan dari Ovulasi ke Implantasi", instruksi: "Urutkan dari peristiwa paling awal.",
        item: [
          "Ovulasi — oosit ditangkap fimbria tuba.",
          "Fertilisasi di ampula tuba membentuk zigot.",
          "Pembelahan menjadi morula sambil bergerak ke uterus.",
          "Terbentuk blastokista di rongga uterus.",
          "Implantasi blastokista ke endometrium.",
          "Trofoblas menghasilkan hCG yang mempertahankan korpus luteum."
        ] },
      diskusi: [
        "Apa yang terjadi pada endometrium bila hCG tidak dihasilkan? Kaitkan dengan siklus menstruasi.",
        "Mengapa korpus luteum penting di awal kehamilan, tetapi tidak lagi setelah trimester I?"
      ],
      sumber: ["Hall, J. E., & Hall, M. E. (2025). Guyton and Hall Textbook of Medical Physiology (15th ed.). Elsevier — bab kehamilan dan laktasi.", "Coad, J., Pedley, K., & Dunstall, M. (2019). Anatomy and Physiology for Midwives (4th ed.). Elsevier."]
    },
    {
      id: 4, kode: "adaptasi", judul: "Adaptasi Fisiologis Kehamilan", ikon: "🤰", ar: null,
      lokal: { nama: "Mitoni (Tingkeban)", asal: "Jawa",
        isi: "Mitoni diadakan saat kehamilan tujuh bulan — trimester III, saat adaptasi tubuh ibu mendekati puncaknya. Keluarga besar berkumpul; ini kesempatan emas bagi bidan untuk edukasi: tidur miring kiri, tanda bahaya, dan persiapan persalinan." },
      ringkas: "Kehamilan menuntut tubuh ibu beradaptasi di hampir semua sistem. <b>Kardiovaskular</b>: volume darah meningkat ± 30–50% (plasma naik lebih banyak daripada sel darah merah → <i>hemodilusi</i>/anemia fisiologis), curah jantung naik ± 30–50%, denyut nadi naik ± 10–15 kali/menit, tekanan darah cenderung turun pada trimester II. <b>Respirasi</b>: volume tidal naik (progesteron meningkatkan sensitivitas pusat napas terhadap CO₂). <b>Ginjal</b>: laju filtrasi glomerulus naik ± 50%. <b>Gastrointestinal</b>: progesteron melemaskan otot polos → motilitas menurun, konstipasi, dan refluks.",
      poin: [
        "Hemodilusi: kadar Hb turun walau massa sel darah merah meningkat — fisiologis, tetapi tetap dipantau.",
        "Kompresi aortokaval pada posisi telentang (akhir kehamilan) dapat menurunkan aliran balik vena → hipotensi; anjurkan miring kiri.",
        "Napas lebih dalam → PaCO₂ menurun ringan (alkalosis respiratorik terkompensasi), memudahkan pembuangan CO₂ janin.",
        "GFR meningkat → frekuensi berkemih bertambah; ditambah tekanan uterus pada kandung kemih.",
        "Metabolisme: kebutuhan energi meningkat; resistensi insulin relatif pada paruh kedua kehamilan (efek hPL)."
      ],
      contoh: [
        { konteks: "ANC di Puskesmas", teks: "Ibu G1 30 minggu, Hb 10,8 g/dL. Bidan menjelaskan hemodilusi sambil tetap memberikan edukasi tablet tambah darah dan pemantauan sesuai pedoman." },
        { konteks: "Kelas ibu hamil", teks: "Ibu merasa pusing saat berbaring telentang lama. Bidan memperagakan posisi miring kiri dan menjelaskan kompresi vena kava." },
        { konteks: "Kunjungan mitoni", teks: "Bidan memberi edukasi bahwa sering BAK dan sembelit umum terjadi akibat perubahan fisiologis, serta kapan keluhan perlu diperiksakan." }
      ],
      aktivitas: { tipe: "pasang", judul: "Sistem Mana yang Beradaptasi?", instruksi: "Pasangkan perubahan dengan sistem tubuh yang tepat.",
        opsi: ["Kardiovaskular", "Respirasi", "Ginjal", "Gastrointestinal"],
        item: [
          { t: "Volume plasma meningkat lebih banyak daripada massa sel darah merah.", k: "Kardiovaskular" },
          { t: "Volume tidal meningkat akibat pengaruh progesteron pada pusat napas.", k: "Respirasi" },
          { t: "Laju filtrasi glomerulus meningkat ± 50%.", k: "Ginjal" },
          { t: "Motilitas usus menurun sehingga ibu mudah konstipasi.", k: "Gastrointestinal" },
          { t: "Curah jantung meningkat dan nadi lebih cepat.", k: "Kardiovaskular" }
        ] },
      diskusi: [
        "Mengapa hemodilusi justru menguntungkan ibu dan janin? Kapan penurunan Hb tidak lagi dianggap fisiologis?",
        "Jelaskan mekanisme fisiologis di balik anjuran 'tidur miring kiri' yang sering disampaikan saat mitoni."
      ],
      sumber: ["Hall, J. E., & Hall, M. E. (2025). Guyton and Hall Textbook of Medical Physiology (15th ed.). Elsevier.", "Cunningham, F. G., et al. (2022). Williams Obstetrics (26th ed.). McGraw Hill — bab fisiologi maternal.", "Coad, J., Pedley, K., & Dunstall, M. (2019). Anatomy and Physiology for Midwives (4th ed.). Elsevier."]
    },
    {
      id: 5, kode: "persalinan", judul: "Fisiologi & Mekanisme Persalinan", ikon: "👶", ar: "persalinan",
      lokal: { nama: "Brokohan & Kemitraan Bidan–Dukun", asal: "Jawa Timur",
        isi: "Kelahiran disambut selamatan brokohan. Di banyak desa, dukun bayi kini bermitra dengan bidan: dukun mendampingi secara budaya, bidan menolong persalinan secara aman. Memahami mekanisme persalinan membuat bidan mampu menjelaskan proses ini dengan bahasa yang diterima keluarga." },
      ringkas: "Menjelang aterm, rasio estrogen terhadap progesteron meningkat, reseptor oksitosin miometrium bertambah, dan prostaglandin melunakkan serviks. Regangan serviks oleh bagian terendah janin memicu pelepasan <b>oksitosin</b> yang memperkuat kontraksi, kontraksi menambah regangan — inilah <b>umpan balik positif (refleks Ferguson)</b>. Persalinan dibagi menjadi <b>Kala I</b> (pembukaan serviks), <b>Kala II</b> (pengeluaran janin), <b>Kala III</b> (pengeluaran plasenta), dan <b>Kala IV</b> (pemantauan ± 2 jam pascasalin). Agar kepala dapat melewati panggul, janin melakukan <b>gerakan kardinal</b>: engagement, penurunan, fleksi, putaran paksi dalam, ekstensi, putaran paksi luar (restitusi), dan ekspulsi.",
      poin: [
        "Persalinan adalah contoh klasik <b>umpan balik positif</b> (Sub-CPMK 1) — berhenti setelah janin lahir.",
        "Fleksi membuat diameter terkecil kepala (suboksipitobregmatika ± 9,5 cm) yang memasuki panggul.",
        "Putaran paksi dalam: ubun-ubun kecil berputar ke depan (di bawah simfisis) mengikuti bentuk panggul.",
        "Ekstensi terjadi saat suboksiput tertahan di bawah simfisis sebagai hipomoklion.",
        "Batas fase aktif Kala I mengikuti pedoman yang dipakai (APN Indonesia: pembukaan 4 cm; WHO 2018: 5 cm).",
        "Kala III: kontraksi uterus melepaskan plasenta dan menjepit pembuluh darah (\"ligatur hidup\") untuk mencegah perdarahan."
      ],
      contoh: [
        { konteks: "Ruang bersalin PMB", teks: "Ibu G2 pembukaan 6 cm, kontraksi makin sering. Bidan menjelaskan kepada suami bahwa kontraksi yang menguat adalah bagian dari refleks Ferguson." },
        { konteks: "Praktikum laboratorium", teks: "Mahasiswa memperagakan gerakan kardinal dengan phantom panggul dan boneka janin, lalu mencocokkan dengan animasi 3D." },
        { konteks: "Kemitraan bidan–dukun", teks: "Dukun bayi mendampingi ibu dengan doa dan pijatan punggung yang menenangkan, sementara bidan memantau partograf dan menolong persalinan." }
      ],
      aktivitas: { tipe: "urut", judul: "Gerakan Kardinal Persalinan", instruksi: "Urutkan gerakan kepala janin (presentasi belakang kepala) dari awal hingga akhir.",
        item: [
          "Engagement — diameter biparietal melewati pintu atas panggul.",
          "Penurunan kepala.",
          "Fleksi — dagu mendekat ke dada.",
          "Putaran paksi dalam — ubun-ubun kecil berputar ke depan.",
          "Ekstensi — kepala lahir dengan suboksiput sebagai hipomoklion.",
          "Putaran paksi luar (restitusi) — kepala kembali sejajar punggung.",
          "Ekspulsi — bahu dan seluruh tubuh lahir."
        ] },
      diskusi: [
        "Mengapa persalinan disebut umpan balik positif, dan apa yang 'menghentikan' umpan balik tersebut?",
        "Apa akibat fisiologis bila kepala janin tidak fleksi dengan baik (defleksi)?"
      ],
      sumber: ["Hall, J. E., & Hall, M. E. (2025). Guyton and Hall Textbook of Medical Physiology (15th ed.). Elsevier — bab parturisi.", "Cunningham, F. G., et al. (2022). Williams Obstetrics (26th ed.). McGraw Hill.", "World Health Organization. (2018). WHO Recommendations: Intrapartum Care for a Positive Childbirth Experience. WHO."]
    },
    {
      id: 6, kode: "nifas", judul: "Fisiologi Nifas & Involusi Uterus", ikon: "🌷", ar: "involusi",
      lokal: { nama: "Sepasaran & Selapanan", asal: "Jawa",
        isi: "Sepasaran (hari ke-5) dan selapanan (hari ke-35) adalah tonggak budaya pascasalin yang hampir berimpit dengan tonggak fisiologis nifas. Namun ada pula pantangan, misalnya tidak boleh makan ikan atau telur. Bidan perlu meluruskan: protein justru dibutuhkan untuk penyembuhan luka dan produksi ASI." },
      ringkas: "Masa nifas berlangsung sekitar 6 minggu (± 42 hari). <b>Involusi uterus</b> terjadi melalui kontraksi dan retraksi miometrium (dipicu oksitosin), iskemia, dan autolisis sel otot yang membesar selama hamil. <b>Tinggi fundus uteri (TFU)</b> menurun bertahap: setelah bayi lahir setinggi pusat; setelah plasenta lahir ± 2 jari di bawah pusat; 1 minggu di pertengahan pusat–simfisis; 2 minggu tidak teraba di atas simfisis; 6 minggu bertambah kecil hingga mendekati ukuran sebelum hamil. Pengeluaran <b>lokia</b> berubah: rubra → sanguinolenta → serosa → alba.",
      poin: [
        "Kontraksi uterus pascasalin juga menjepit pembuluh darah bekas implantasi plasenta — kunci pencegahan perdarahan.",
        "Berat uterus menurun dari ± 1000 g (setelah lahir) menjadi ± 50 g (6 minggu).",
        "Lokia rubra (± hari 1–3), sanguinolenta (± hari 3–7), serosa (± hari 7–14), alba (> 14 hari).",
        "Menyusui memicu oksitosin → kontraksi uterus (afterpains) → mempercepat involusi.",
        "Volume darah dan curah jantung kembali menuju keadaan sebelum hamil secara bertahap dalam minggu-minggu pascasalin."
      ],
      contoh: [
        { konteks: "Kunjungan nifas (KF) di rumah", teks: "Hari ke-7, TFU teraba di pertengahan pusat–simfisis dan lokia berwarna kecokelatan. Bidan menyimpulkan involusi berjalan sesuai fisiologis." },
        { konteks: "Ruang nifas PMB", teks: "Ibu mengeluh mules saat menyusui. Bidan menjelaskan bahwa oksitosin dari isapan bayi menimbulkan kontraksi yang membantu rahim kembali kecil." },
        { konteks: "Sepasaran di desa", teks: "Keluarga melarang ibu makan ikan. Bidan menjelaskan kebutuhan protein dengan bahasa santun, sambil menghormati tradisi doa sepasaran." }
      ],
      aktivitas: { tipe: "pasang", judul: "Tinggi Fundus Uteri (TFU)", instruksi: "Pasangkan waktu pascasalin dengan TFU yang sesuai.",
        opsi: ["Setinggi pusat", "± 2 jari di bawah pusat", "Pertengahan pusat–simfisis", "Tidak teraba di atas simfisis"],
        item: [
          { t: "Segera setelah bayi lahir", k: "Setinggi pusat" },
          { t: "Setelah plasenta lahir", k: "± 2 jari di bawah pusat" },
          { t: "Hari ke-7 pascasalin", k: "Pertengahan pusat–simfisis" },
          { t: "Hari ke-14 pascasalin", k: "Tidak teraba di atas simfisis" }
        ] },
      diskusi: [
        "Hari ke-10, TFU masih setinggi pusat dan lokia masih merah segar. Apa interpretasi fisiologisnya dan apa langkah bidan?",
        "Bagaimana bidan menyikapi pantangan makan saat sepasaran tanpa menyinggung keluarga?"
      ],
      sumber: ["Coad, J., Pedley, K., & Dunstall, M. (2019). Anatomy and Physiology for Midwives (4th ed.). Elsevier — bab puerperium.", "Cunningham, F. G., et al. (2022). Williams Obstetrics (26th ed.). McGraw Hill — bab puerperium.", "World Health Organization. (2022). WHO Recommendations on Maternal and Newborn Care for a Positive Postnatal Experience. WHO."]
    },
    {
      id: 7, kode: "laktasi", judul: "Fisiologi Laktasi", ikon: "🍼", ar: "laktasi",
      lokal: { nama: "Pijat Oksitosin & Dukungan Keluarga", asal: "Indonesia",
        isi: "Di banyak keluarga, suami atau ibu mertua membantu memijat punggung ibu menyusui. Rasa nyaman, tenang, dan didukung keluarga membantu refleks oksitosin. Gotong royong keluarga ternyata punya dasar fisiologis!" },
      ringkas: "Selama kehamilan, <b>estrogen</b> menumbuhkan sistem duktus dan <b>progesteron</b> mengembangkan alveolus payudara. Prolaktin meningkat, tetapi produksi ASI dalam jumlah besar ditahan oleh tingginya estrogen dan progesteron. Setelah <b>plasenta lahir</b>, kadar keduanya turun drastis sehingga prolaktin dapat bekerja penuh — ASI keluar banyak sekitar hari ke-2–4 (laktogenesis II). Isapan bayi memicu dua refleks: <b>refleks prolaktin</b> (hipofisis anterior → produksi ASI) dan <b>refleks oksitosin/let-down</b> (hipofisis posterior → sel mioepitel berkontraksi → ASI terpancar).",
      poin: [
        "Kolostrum (hari-hari awal): kaya imunoglobulin (terutama IgA) dan protein.",
        "Semakin sering dan efektif bayi menyusu, semakin banyak prolaktin dan ASI (prinsip supply–demand).",
        "Oksitosin juga mengontraksikan uterus → membantu involusi (hubungan dengan topik nifas).",
        "Stres, nyeri, dan cemas dapat menghambat refleks oksitosin; rasa nyaman dan dukungan memperlancarnya.",
        "Prolaktin juga menekan GnRH sehingga menyusui eksklusif dapat menunda ovulasi (dasar metode amenore laktasi, dengan syarat tertentu)."
      ],
      contoh: [
        { konteks: "Hari ke-2 di ruang nifas", teks: "Ibu khawatir ASI belum banyak. Bidan menjelaskan bahwa laktogenesis II biasanya terjadi hari ke-2–4 dan kolostrum yang sedikit sudah sesuai kebutuhan bayi." },
        { konteks: "Kunjungan rumah", teks: "Bidan mengajari suami melakukan pijat punggung untuk membantu ibu rileks sebelum menyusui." },
        { konteks: "Kelompok pendukung ASI (Posyandu)", teks: "Bidan memfasilitasi ibu-ibu berbagi pengalaman; rasa didukung membantu refleks oksitosin." }
      ],
      aktivitas: { tipe: "pasang", judul: "Prolaktin atau Oksitosin?", instruksi: "Tentukan hormon yang paling berperan.",
        opsi: ["Prolaktin", "Oksitosin", "Estrogen & progesteron"],
        item: [
          { t: "Merangsang sel alveolus memproduksi ASI.", k: "Prolaktin" },
          { t: "Mengontraksikan sel mioepitel sehingga ASI terpancar (let-down).", k: "Oksitosin" },
          { t: "Selama hamil menahan produksi ASI dalam jumlah besar.", k: "Estrogen & progesteron" },
          { t: "Dilepas dari hipofisis posterior dan juga menimbulkan mules saat menyusui.", k: "Oksitosin" },
          { t: "Dilepas dari hipofisis anterior; kadarnya naik setiap kali bayi menyusu.", k: "Prolaktin" }
        ] },
      diskusi: [
        "Mengapa ASI baru keluar banyak setelah plasenta lahir, bukan saat hamil, padahal prolaktin sudah tinggi?",
        "Jelaskan dasar fisiologis mengapa ibu yang cemas sering merasa 'ASI tidak keluar' walau produksinya cukup."
      ],
      sumber: ["Hall, J. E., & Hall, M. E. (2025). Guyton and Hall Textbook of Medical Physiology (15th ed.). Elsevier — bab laktasi.", "Coad, J., Pedley, K., & Dunstall, M. (2019). Anatomy and Physiology for Midwives (4th ed.). Elsevier.", "Silverthorn, D. U. (2022). Human Physiology: An Integrated Approach (9th ed.). Pearson."]
    }
  ],

  /* Mitos atau Fakta — permainan kelas berbasis budaya lokal */
  mitos: [
    { s: "Ibu nifas sebaiknya tidak makan ikan dan telur supaya luka jahitan cepat kering.", fakta: false, p: "MITOS. Protein (ikan, telur) dibutuhkan untuk penyembuhan luka dan produksi ASI. Tidak ada dasar fisiologis pantangan ini." },
    { s: "Tidur miring kiri pada akhir kehamilan membantu aliran darah ke jantung ibu dan ke plasenta.", fakta: true, p: "FAKTA. Posisi telentang membuat uterus menekan vena kava inferior sehingga aliran balik vena dan curah jantung turun." },
    { s: "Kolostrum yang kekuningan adalah 'ASI basi' dan sebaiknya dibuang.", fakta: false, p: "MITOS. Kolostrum kaya imunoglobulin dan protein — 'imunisasi pertama' bagi bayi." },
    { s: "Mules saat menyusui di hari-hari awal nifas adalah tanda rahim sedang kembali ke ukuran semula.", fakta: true, p: "FAKTA. Oksitosin dari isapan bayi mengontraksikan uterus sehingga mempercepat involusi." },
    { s: "Kadar Hb ibu hamil sedikit turun di trimester II walaupun jumlah sel darah merahnya bertambah.", fakta: true, p: "FAKTA. Volume plasma meningkat lebih banyak daripada sel darah merah (hemodilusi). Tetap dipantau agar tidak terjadi anemia." },
    { s: "Ibu yang cemas tetap akan lancar ASI-nya karena produksi ASI hanya diatur prolaktin.", fakta: false, p: "MITOS. Pengeluaran ASI juga bergantung pada refleks oksitosin yang dapat dihambat oleh stres dan nyeri." },
    { s: "Ovulasi selalu terjadi tepat pada hari ke-14 pada semua perempuan.", fakta: false, p: "MITOS. Hari ke-14 adalah contoh siklus 28 hari. Fase luteal relatif tetap ± 14 hari, sehingga ovulasi bergantung pada panjang siklus." },
    { s: "Banyak minum air dingin saat hamil membuat bayi besar dan sulit lahir.", fakta: false, p: "MITOS. Berat janin dipengaruhi asupan energi, genetik, dan kondisi metabolik ibu, bukan suhu minuman." },
    { s: "Suhu testis yang terlalu panas (misalnya sering berendam air panas) dapat mengganggu spermatogenesis.", fakta: true, p: "FAKTA. Spermatogenesis optimal pada suhu ± 2–3 °C di bawah suhu inti tubuh." }
  ],

  kuis: [
    { q: "Lonjakan LH sebelum ovulasi dipicu oleh…", o: ["Umpan balik negatif progesteron", "Umpan balik positif estrogen yang tinggi dan bertahan", "Penurunan kadar FSH", "hCG dari trofoblas"], a: 1 },
    { q: "Fase endometrium yang terutama dipengaruhi progesteron adalah…", o: ["Menstruasi", "Proliferasi", "Sekresi", "Folikular"], a: 2 },
    { q: "Klien bersiklus 32 hari. Perkiraan ovulasinya sekitar hari ke-…", o: ["14", "16", "18", "22"], a: 2 },
    { q: "Hormon yang merangsang sel Leydig menghasilkan testosteron adalah…", o: ["FSH", "LH", "Inhibin", "Prolaktin"], a: 1 },
    { q: "Fungsi utama hCG pada awal kehamilan adalah…", o: ["Memicu ovulasi", "Mempertahankan korpus luteum", "Merangsang produksi ASI", "Menurunkan suhu basal"], a: 1 },
    { q: "Anemia fisiologis kehamilan terutama disebabkan oleh…", o: ["Penurunan produksi eritrosit", "Peningkatan volume plasma yang lebih besar dari massa eritrosit", "Perdarahan tersembunyi", "Kekurangan oksigen"], a: 1 },
    { q: "Anjuran tidur miring kiri pada trimester III bertujuan mencegah…", o: ["Refluks asam lambung", "Kompresi aortokaval", "Hiperventilasi", "Kontraksi palsu"], a: 1 },
    { q: "Refleks Ferguson pada persalinan merupakan contoh…", o: ["Umpan balik negatif", "Umpan balik positif", "Refleks spinal sederhana", "Homeostasis suhu"], a: 1 },
    { q: "Gerakan kardinal yang membuat diameter kepala terkecil memasuki panggul adalah…", o: ["Ekstensi", "Fleksi", "Restitusi", "Ekspulsi"], a: 1 },
    { q: "Pada hari ke-7 pascasalin, TFU normal teraba…", o: ["Setinggi pusat", "2 jari di atas pusat", "Pertengahan pusat–simfisis", "Tidak teraba"], a: 2 },
    { q: "ASI baru keluar banyak setelah persalinan karena…", o: ["Prolaktin baru mulai dibentuk", "Estrogen dan progesteron turun setelah plasenta lahir", "Oksitosin meningkat saat hamil", "Bayi mulai menghasilkan hormon"], a: 1 },
    { q: "Hormon yang menyebabkan let-down reflex dan mules saat menyusui adalah…", o: ["Prolaktin", "Oksitosin", "Estrogen", "hPL"], a: 1 }
  ],

  kasusOffline: {
    1: ["Nn. A, 19 tahun, mahasiswi di Gresik, mencatat panjang siklusnya: 30, 33, dan 31 hari. Ia khawatir 'tidak normal' dan bertanya kapan masa suburnya. Analisis fisiologi siklusnya dan susun penjelasan untuk klien."],
    2: ["Tn. B, 30 tahun, pekerja pabrik pengecoran logam di Gresik yang sering terpapar panas, belum memiliki anak setelah 2 tahun menikah. Analisis faktor fisiologis yang mungkin berpengaruh pada spermatogenesis dan rancang edukasi untuk pasangan."],
    3: ["Ny. C, 25 tahun, terlambat haid 2 minggu, tes kehamilan positif, mengeluh mual hebat pagi hari. Jelaskan peran hCG, korpus luteum, dan plasenta, serta kaitannya dengan keluhan klien."],
    4: ["Ny. D, G1 32 minggu, mengeluh pusing ketika berbaring telentang, sering BAK, dan sembelit. Hb 10,6 g/dL, nadi 92 kali/menit. Analisis adaptasi fisiologis yang mendasari setiap temuan."],
    5: ["Ny. E, G2P1, pembukaan 7 cm, kontraksi 4 kali dalam 10 menit. Suami bertanya mengapa kontraksi semakin kuat dan bagaimana bayi 'berputar' saat lahir. Susun penjelasan fisiologis dengan bahasa awam."],
    6: ["Ny. F, hari ke-10 pascasalin, TFU masih teraba 2 jari di bawah pusat dan lokia masih merah. Keluarga menerapkan pantangan makan ikan. Analisis kondisi involusinya dan susun rencana edukasi."],
    7: ["Ny. G, hari ke-2 pascasalin, merasa ASI belum keluar dan ingin memberi susu formula. Ia tampak cemas dan nyeri luka jahitan. Analisis fisiologi laktogenesis dan refleks oksitosin, lalu rancang dukungan menyusui."]
  },
  kunci: {
    1: ["fsh", "lh", "estrogen", "progesteron", "ovulasi", "folikular", "luteal", "umpan balik", "korpus luteum", "endometrium", "suhu basal"],
    2: ["lh", "fsh", "leydig", "sertoli", "testosteron", "inhibin", "spermatogenesis", "umpan balik", "suhu"],
    3: ["hcg", "korpus luteum", "progesteron", "plasenta", "implantasi", "blastokista", "fertilisasi", "trofoblas"],
    4: ["volume plasma", "hemodilusi", "curah jantung", "vena kava", "miring kiri", "progesteron", "gfr", "volume tidal", "motilitas"],
    5: ["oksitosin", "umpan balik positif", "ferguson", "fleksi", "putaran paksi", "ekstensi", "kontraksi", "serviks", "prostaglandin"],
    6: ["involusi", "tfu", "fundus", "oksitosin", "lokia", "kontraksi", "protein", "autolisis", "subinvolusi"],
    7: ["prolaktin", "oksitosin", "let-down", "kolostrum", "plasenta", "estrogen", "progesteron", "isapan", "stres", "laktogenesis"]
  }
};
