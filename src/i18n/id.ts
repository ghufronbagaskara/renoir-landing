// Indonesian copy — transcreated from ./en.ts (same intent and hook, written natively). Source:
// docs/copy/copy-deck.md. The Dictionary type makes a missing or extra key a type error.
import type { Dictionary } from "./en";

const id: Dictionary = {
  site: {
    name: "Renoir",
    pronunciation: "ren-WAHR",
    tagline: "Tampil meyakinkan. Bekerja lebih rapi",
    description:
      "Renoir merancang identitas dan pengalaman digital, membangun website serta sistem bisnis, lalu menjaga produk yang kami bangun tetap berjalan.",
  },

  nav: {
    services: "Layanan",
    process: "Proses",
    work: "Karya",
    about: "Tentang",
    aboutRenoir: "Tentang Renoir",
    team: "Tim",
    notes: "Catatan",
    cta: "Mulai proyek",
    floatingCta: "Ceritakan yang bermasalah",
    floatingCtaShort: "Apa masalahnya?",
    language: "Bahasa",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    home: "Beranda",
  },

  search: {
    button: "Cari",
    label: "Cari di situs ini",
    placeholder: "Cari di situs ini",
    close: "Tutup pencarian",
    loading: "Mencari halaman dan catatan…",
    noResults: "Tidak ada hasil untuk “{term}”.",
    unavailable: "Pencarian membutuhkan build produksi lokal. Sementara itu, buka Layanan atau Catatan.",
    explore: "Mulai dari kebutuhan Anda",
    recent: "Catatan terbaru",
    hint: "Ketik untuk mencari layanan, catatan, karya, dan halaman",
    groups: { service: "Layanan", note: "Catatan", work: "Karya", page: "Halaman" },
  },

  offcanvas: {
    about:
      "Renoir adalah studio digital untuk identitas visual, antarmuka, website, dan sistem bisnis. Anda bisa memesan desain saja, atau mengajak kami membangun dan menjalankan hasilnya.",
    contactTitle: "Hubungi kami",
    followTitle: "Ikuti kami",
  },

  footer: {
    headline: "Ceritakan",
    headlineEm: "apa yang perlu berubah",
    body: "Ceritakan hal yang ingin Anda perbaiki. Kami akan bertanya seperlunya untuk menyusun pekerjaan dan memberi tahu jika kami bukan tim yang tepat.",
    circle: "MULAI PROYEK · MULAI PROYEK · MULAI PROYEK · ",
    tagline: "Identitas visual, antarmuka, website, aplikasi, dan sistem. Satu studio untuk pekerjaan yang harus tampil baik dan berjalan baik.",
    studio: "Studio",
    more: "Lainnya",
    contact: "Kontak",
    location: "Berbasis di Indonesia, bekerja secara remote",
    rights: "Hak cipta dilindungi.",
  },

  notFound: {
    metaTitle: "Halaman tidak ditemukan — Renoir",
    metaDescription: "Halaman ini tidak ada. Tautannya mungkin sudah lama, atau halamannya sudah dipindah. Kembali ke beranda Renoir.",
    breadcrumb: "Halaman tidak ditemukan",
    title: "Halaman ini tidak ada.",
    body: "Tautannya mungkin sudah lama, atau halamannya sudah dipindah.",
    button: "Kembali ke beranda",
  },

  form: {
    name: "Nama Anda",
    company: "Perusahaan",
    email: "Email kantor",
    buildType: "Apa yang ingin Anda bangun?",
    buildTypes: { marketing: "Situs marketing", internal: "Sistem atau aplikasi", design: "UI/UX atau identitas visual", both: "Desain dan pembangunan", unsure: "Belum yakin" },
    problem: "Masalah apa yang ingin Anda selesaikan?",
    timeline: "Timeline",
    timelines: { month: "Dalam sebulan", quarter: "1–3 bulan", later: "Lebih dari 3 bulan", exploring: "Masih menjajaki" },
    budget: "Kisaran budget",
    budgets: { lt10: "Di bawah Rp10 juta", "10-25": "Rp10–25 juta", "25-50": "Rp25–50 juta", gt50: "Di atas Rp50 juta", discuss: "Ingin didiskusikan" },
    submit: "Kirim detail proyek",
    reply: "Kami akan menghubungi Anda lewat email yang diberikan.",
    honeypot: "Biarkan kolom ini kosong",
    messages: {
      sent: "Terima kasih. Detail proyek Anda sudah kami terima. Kami akan menghubungi Anda lewat email.",
      invalid: "Mohon periksa kembali kolom yang ditandai.",
      captcha: "Kami tidak bisa memverifikasi permintaan ini. Silakan coba lagi.",
      rate_limited: "Terlalu banyak pesan dari koneksi ini. Mohon tunggu satu menit.",
      error: "Detail proyek belum terkirim. Silakan coba lagi nanti.",
    },
  },

  home: {
    metaTitle: "Renoir | Desain, website, aplikasi, dan sistem bisnis",
    metaDescription:
      "Renoir merancang identitas dan pengalaman digital, membangun website serta sistem bisnis, lalu menjaga produk yang kami bangun tetap berjalan.",
    hero: {
      title: ["Tampil meyakinkan", "Bekerja lebih rapi"],
      body: "Renoir membantu bisnis tampil lebih jelas dan bekerja lebih tertata. Kami mengerjakan identitas, antarmuka, website, hingga sistem operasional. Mulai dari desain saja atau lanjut bersama kami sampai peluncuran.",
    },
    problem: {
      label: "Masalahnya",
      title: "Desain yang baik harus enak dipakai",
      side: "Desain sampai server",
      stat: "Satu studio",
      cardTitle: "Satu tim untuk seluruh pekerjaan",
      cardBody:
        "Kesan pertama itu penting. Sistem di belakangnya juga. Kami menyatukan desain dan engineering, lalu tetap bertanggung jawab ketika hasilnya digunakan.",
    },
    strip: [
      "Situs marketing",
      "Landing page",
      "Sistem internal",
      "Dashboard operasional",
      "Pelacakan order & dokumen",
      "Deployment & perawatan",
    ],
    services: {
      label: "Layanan kami",
      title: "Dari wajah bisnis sampai sistem di baliknya",
      body: "Empat cara bekerja bersama kami. Mulai dari desain, website publik, sistem bisnis, atau infrastruktur yang menjaganya tetap berjalan.",
      button: "Lihat semua layanan",
    },
    work: {
      label: "Karya",
      title: "Pekerjaan yang boleh kami ceritakan",
      body: "Website, sistem bisnis, dan infrastruktur di belakangnya. Lihat pekerjaan serta keputusan yang membentuknya.",
      button: "Bahas proyek Anda",
      previous: "Proyek sebelumnya",
      next: "Proyek berikutnya",
      pause: "Jeda pergantian proyek",
      resume: "Lanjutkan pergantian proyek",
    },
    process: {
      label: "Cara kami bekerja",
      title: "Empat tahap, progresnya bisa Anda lihat",
      steps: [
        { title: "Scope", body: "Kami mulai dari masalah bisnis, bukan teknologinya. Anda menerima scope tertulis dan harga tetap untuk scope itu." },
        { title: "Desain", body: "Struktur dulu, tampilan kemudian. Anda menyetujui desain sebelum kode produksi ditulis." },
        { title: "Build", body: "Ditulis dari nol sesuai desain yang disetujui, di URL staging yang bisa Anda cek kapan saja." },
        { title: "Deploy & perawatan", body: "Infrastruktur dikonfigurasi, monitoring aktif, dokumentasi diserahkan. Kami yang menjaganya, atau Anda ambil alih." },
      ],
    },
    engagements: {
      label: "Cara kerja sama",
      title: "Scope jelas, harga disepakati di awal",
      cards: [
        {
          build: "marketing",
          title: "Situs marketing",
          audience: "Untuk perusahaan yang pertama kali dinilai calon klien lewat website-nya.",
          items: [
            "Ditulis dari nol",
            "Target performa disepakati di awal",
            "SEO teknis, terbaca oleh AI search",
            "Structured data dan sitemap",
            "Diserahkan dalam keadaan berjalan",
          ],
          priceLine: "Harga tetap",
          note: "setelah lingkup disepakati",
          cta: "Diskusikan website saya",
          badge: "Situs",
        },
        {
          build: "internal",
          title: "Sistem internal",
          audience: "Untuk operasional yang masih berjalan di spreadsheet, grup chat, dan kertas.",
          items: [
            "Dibangun sesuai cara kerja Anda",
            "Pelacakan order dan dokumen",
            "Dashboard dan monitoring",
            "Alur persetujuan",
            "Integrasi antar sistem yang Anda pakai",
          ],
          priceLine: "Harga tetap",
          note: "setelah lingkup disepakati",
          cta: "Diskusikan sistem saya",
          badge: "Sistem",
        },
        {
          build: "design",
          title: "UI/UX & identitas",
          audience: "Untuk bisnis dan produk yang membutuhkan pengalaman lebih jelas serta identitas visual sendiri.",
          items: ["Alur pengguna dan wireframe", "Antarmuka website dan aplikasi", "Prototipe interaktif", "Identitas visual", "File desain dan serah terima"],
          priceLine: "Harga tetap",
          note: "setelah lingkup disepakati",
          cta: "Diskusikan desain saya",
          badge: "Desain",
        },
        {
          build: "unsure",
          title: "Deployment & perawatan",
          audience: "Untuk setiap klien, tanpa perlu diminta.",
          items: [
            "Server dan pipeline deployment",
            "Monitoring dan backup",
            "Domain dan SSL",
            "Dokumentasi dan walkthrough",
            "Retainer perawatan bulanan (opsional)",
          ],
          priceLine: "Termasuk",
          note: "",
          cta: "Tanya soal perawatan",
          badge: "Servis",
        },
      ],
    },
    oneStudio: {
      circle: "DIBANGUN UNTUK BEKERJA · DIRANCANG UNTUK DILIHAT · ",
      slides: [
        {
          label: "01 · Dibeli, bukan dibangun",
          quote:
            "Tema dengan logo Anda terlihat sama dengan ratusan situs lain, lambat di HP pelanggan Anda, dan sulit dibaca mesin pencari. Kami menulis setiap situs dari nol.",
        },
        {
          label: "02 · Diserahkan sebagai file",
          quote:
            "Vendor mengirim file zip lalu pergi. Anda tertinggal dengan software yang tidak bisa di-deploy, di server yang tidak pernah dikonfigurasi. Kami menyerahkan URL yang tetap hidup.",
        },
        {
          label: "03 · Terpecah di banyak vendor",
          quote:
            "Desainer, developer, penyedia hosting. Tiga timeline, tiga tafsiran, dan tidak ada yang bertanggung jawab atas hasilnya. Kami menyatukan desain, engineering, dan infrastruktur dalam satu tim.",
        },
      ],
    },
    why: {
      label: "Kenapa Renoir",
      title: "Yang Anda dapat dari Renoir",
      rows: [
        { title: "Ditulis dari nol", body: "Tanpa tema, tanpa page builder. Setiap baris ada karena proyek Anda membutuhkannya.", tag: "Kode" },
        { title: "Kecepatan adalah spesifikasi", body: "Target performa dan indexing disepakati sebelum mulai dan dicek sebelum serah terima.", tag: "Kecepatan" },
        { title: "Satu tim, satu hasil", body: "Desain dan engineering bekerja bersama. Tidak ada yang hilang di tengah jalan.", tag: "Tim" },
        { title: "Diserahkan dalam keadaan berjalan", body: "Bukan file zip. URL yang berfungsi, di infrastruktur yang kami konfigurasi.", tag: "Serah terima" },
        { title: "Bicara langsung dengan yang membangun", body: "Tim kecil, jalur singkat. Tanpa account manager di tengah.", tag: "Kontak" },
      ],
    },
    faq: {
      label: "Pertanyaan",
      title: "Sebelum kita mulai",
      items: [
        {
          question: "Kenapa harga tidak dicantumkan?",
          answer:
            "Halaman yang terlihat sama bisa jadi pekerjaan dua minggu atau dua bulan, tergantung apa yang ada di baliknya. Kami susun scope dulu, lalu memberi harga tetap untuk scope itu. Tagihan Anda tidak akan pernah melebihi angka yang sudah disepakati.",
        },
        {
          question: "Apakah kode jadi milik saya?",
          answer:
            "Ya. Seluruh source code dan file desain menjadi milik Anda setelah pelunasan. Tanpa lisensi, tanpa lock-in, tanpa hosting yang menyandera.",
        },
        {
          question: "Bagaimana kalau saya ingin berhenti?",
          answer:
            "Repository, akses infrastruktur, dan dokumentasi tetap Anda pegang. Kalau Anda terus bekerja dengan kami, biarlah karena hasilnya memang membantu, bukan karena sulit pindah.",
        },
        {
          question: "Berapa lama sebuah proyek?",
          answer:
            "Situs marketing umumnya dua sampai empat minggu. Sistem internal tergantung scope; timeline tertulis Anda terima bersama scope, sebelum Anda memutuskan.",
        },
        {
          question: "Apakah kalian merawat yang kalian bangun?",
          answer:
            "Ya, lewat retainer bulanan yang mencakup hosting, monitoring, backup, update, dan jatah perubahan tertentu. Sifatnya opsional.",
        },
        {
          question: "Apakah kalian menerima klien di luar Indonesia?",
          answer: "Ya. Kami bekerja remote dan terbiasa lintas zona waktu.",
        },
      ],
    },
    notes: {
      label: "Catatan",
      title: "Catatan dari studio",
      body: "Catatan singkat tentang kecepatan, serah terima, dan apa yang membuat website tetap bekerja setelah diluncurkan.",
      button: "Baca catatan",
    },
  },

  about: {
    metaTitle: "Tentang Renoir — Studio kecil yang membangun & menjalankan web",
    metaDescription:
      "Renoir, dibaca ren-WAHR, adalah studio digital kecil yang menyatukan desain, engineering, dan infrastruktur dalam satu tim.",
    breadcrumb: "Tentang Renoir",
    name: {
      label: "Tentang nama",
      title: "Nama ini punya cerita kerja",
      pronunciationLabel: "Cara membacanya",
      cardTitle: "Kerja yang baik perlu latihan",
      cardBody:
        "Pierre-Auguste Renoir menghabiskan tahun-tahun awalnya melukis dekorasi di porselen, di sebuah pabrik — pekerjaan komersial, dibayar per buah, dengan standar yang dijaga. Karena itulah kami memakai namanya. Pekerjaan klien tetap harus dibuat dengan benar.",
    },
    band: "MULAI PROYEK · ",
    facts: [
      { value: 1, suffix: "", label: "tim yang bertanggung jawab" },
      { value: 4, suffix: "", label: "tahap, dari scope sampai perawatan" },
      { value: 4, suffix: "", label: "cara bekerja bersama kami" },
      { value: 100, suffix: "%", label: "kepemilikan kode saat serah terima" },
    ],
    beliefs: {
      circle: "DIBANGUN UNTUK BEKERJA · DIRANCANG UNTUK DILIHAT · ",
      slides: [
        { label: "Yang kami yakini · 01", quote: "Software yang bekerja dan software yang enak dilihat adalah satu kebutuhan, bukan dua." },
        { label: "Yang kami yakini · 02", quote: "Situs yang butuh empat detik untuk terbuka belum selesai. Kecepatan dan visibilitas di pencarian adalah bagian dari spesifikasi." },
        { label: "Yang kami yakini · 03", quote: "Tidak ada yang selesai sebelum berjalan. Repository bukan hasil akhir. URL yang tetap hidup, itu hasil akhir." },
        { label: "Yang kami yakini · 04", quote: "Ditulis dari nol lebih baik daripada dirakit dari potongan. Tema cepat di awal, tapi lambat selamanya." },
        { label: "Yang kami yakini · 05", quote: "Orang yang membangunnya seharusnya orang yang Anda ajak bicara." },
      ],
    },
    fit: {
      label: "Kecocokan",
      title: "Kerja sama yang paling cocok",
        intro: "Lihat apakah masalah yang ingin Anda bereskan cocok dengan cara kami bekerja. Jika cocok, ceritakan kebutuhan Anda.",
        cta: "Diskusikan proyek Anda",
      rows: [
        { text: "Bisnis yang sudah berjalan dan operasionalnya melampaui tools siap pakai", good: true },
        { text: "Perusahaan yang website-nya tidak mencerminkan kualitas bisnisnya", good: true },
        { text: "Tim yang ingin satu pihak yang bertanggung jawab", good: true },
        { text: "Yang mencari situs semurah mungkin", good: false },
        { text: "Pekerjaan tema atau page builder", good: false },
        { text: "Proyek tanpa pengambil keputusan yang jelas", good: false },
      ],
      goodTag: "Cocok",
      badTag: "Tidak cocok",
    },
  },

  services: {
    metaTitle: "Layanan: Desain, Website, Sistem dan Perawatan | Renoir",
    metaDescription:
      "Empat layanan Renoir: UI/UX dan identitas visual, situs marketing, sistem bisnis custom, serta deployment dan perawatan.",
    breadcrumb: "Layanan",
    label: "Layanan",
    title: "Empat layanan, satu studio yang bertanggung jawab",
    button: "Mulai proyek",
    includedTitle: "Yang termasuk",
    faqTitle: "Pertanyaan seputar layanan ini",
  },

  process: {
    metaTitle: "Cara Kerja — Scope, Desain, Build, Deploy & Perawatan | Renoir",
    metaDescription:
      "Empat tahap, scope tertulis, harga tetap, dan URL staging yang bisa dipantau sepanjang proses. Lihat bagaimana proyek bersama Renoir berjalan.",
    breadcrumb: "Proses",
    label: "Proses",
    title: "Dari obrolan awal sampai serah terima",
    steps: [
      {
        title: "Scope",
        body: "Obrolan tentang masalah bisnis sebelum bicara teknologi: apa yang bermasalah hari ini, berapa biayanya, siapa yang memutuskan, dan seperti apa hasil akhirnya. Diakhiri dengan scope tertulis dan harga tetap untuk scope itu.",
      },
      {
        title: "Desain",
        body: "Struktur dulu, tampilan kemudian. Arsitektur informasi, alur, lalu antarmuka. Anda melihat dan menyetujui desain sebelum satu baris kode produksi ditulis.",
      },
      {
        title: "Build",
        body: "Dibangun mengikuti desain yang sudah disetujui. Progresnya bisa Anda lihat di URL staging sepanjang proyek.",
      },
      {
        title: "Deploy & perawatan",
        body: "Infrastruktur dikonfigurasi, pipeline disiapkan, monitoring dan backup aktif, domain dan SSL berjalan. Serah terima mencakup dokumentasi dan walkthrough. Perawatan berlanjut lewat retainer, atau Anda ambil alih — dengan akses penuh di kedua pilihan.",
      },
    ],
  },

  notes: {
    metaTitle: "Catatan — Membangun website yang tetap bekerja | Renoir",
    metaDescription:
      "Catatan dari Renoir tentang kecepatan website, visibilitas di pencarian, serah terima, dan apa yang membuat sistem web tetap bekerja setelah diluncurkan.",
    breadcrumb: "Catatan",
    articleBreadcrumb: "Catatan",
    readMore: "Baca catatan",
    by: "oleh",
    recent: "Catatan terbaru",
    categories: "Topik",
    searchLabel: "Cari catatan",
    searchPlaceholder: "Cari catatan",
    share: "Bagikan",
    results: "{count} catatan",
    emptyTitle: "Tidak ada catatan yang cocok",
    emptyBody: "Hapus pencarian atau pilih topik lain untuk melihat catatan.",
    clear: "Hapus filter",
  },

  contact: {
    metaTitle: "Mulai Proyek — Ceritakan apa yang bermasalah | Renoir",
    metaDescription:
      "Ceritakan kebutuhan desain atau pembangunan Anda kepada Renoir. Kirim detail proyek, lalu kami akan menghubungi Anda untuk memahami pekerjaannya.",
    breadcrumb: "Mulai proyek",
    title: "Ceritakan yang ingin Anda ubah",
    body: "Jelaskan kebutuhan Anda, baik identitas baru, antarmuka, website, maupun sistem. Kami akan menghubungi Anda untuk memahami pekerjaannya sebelum menyusun scope.",
    emailLabel: "Email",
    locationLabel: "Lokasi",
    location: "Indonesia — remote ke seluruh dunia",
    formTitle: "Mulai proyek",
  },

  work: {
    metaTitle: "Karya Website, Sistem Bisnis & UI/UX | Renoir",
    metaDescription: "Lihat delapan proyek karya pendiri Renoir: situs marketing, sistem bisnis, UI/UX, serta pekerjaan deployment yang menopangnya.",
    breadcrumb: "Karya",
    label: "Karya",
    title: "Pekerjaan yang membuat langkah berikutnya jelas",
    intro: "Delapan proyek karya pendiri Renoir, dari website publik sampai sistem dan infrastruktur untuk operasi sehari-hari.",
    featuredLabel: "Karya pilihan",
    featuredTitle: "Mulai dari tiga proyek ini",
    allLabel: "Semua karya",
    allTitle: "Jelajahi delapan proyek",
    searchLabel: "Cari karya",
    searchPlaceholder: "Cari berdasarkan judul, layanan, atau topik",
    filtersLabel: "Filter karya berdasarkan layanan",
    allServices: "Semua layanan",
    services: {
      marketing: "Situs marketing",
      internal: "Sistem internal",
      design: "UI/UX & identitas",
      care: "Deployment & perawatan",
    },
    results: "{count} proyek",
    emptyTitle: "Tidak ada karya yang cocok",
    emptyBody: "Hapus pencarian atau pilih layanan lain untuk melihat karya lain.",
    clear: "Hapus filter",
    view: "Lihat proyek",
    details: {
      breadcrumb: "Jejak navigasi proyek",
      mainScreen: "Layar asli proyek; versi ponsel memakai komposisi tersendiri.",
      demoScreen: "Layar aplikasi asli yang diambil dengan data simulasi.",
      challenge: "Kebutuhan",
      approach: "Yang dibangun",
      role: "Peran kami",
      screens: "Layar proyek lainnya",
      openDesktop: "Buka gambar desktop",
      openMobile: "Buka gambar ponsel",
      openImage: "Buka gambar penuh",
      websiteCta: "Diskusikan website Anda",
      systemCta: "Diskusikan sistem serupa",
      information: "Informasi proyek",
      services: "Layanan",
      year: "Tahun",
      previous: "Karya sebelumnya",
      next: "Karya berikutnya",
      navigation: "Karya lainnya",
      relatedLabel: "Karya terkait",
      relatedTitle: "Pekerjaan lain di bidang serupa",
    },
  },
  team: { breadcrumb: "Tim" },
};

export default id;
