// Renoir services (brief §4, copy deck §3). Each entry carries shared fields plus EN and ID copy.
// `id` is the stable key; localized URL slugs live in `slug`.
const media = {
  marketing: [
    {
      src: "work/maxy-ai/pair.webp",
      kind: "proof",
      alt: {
        en: "MAXY AI website on desktop and mobile",
        id: "Situs MAXY AI pada desktop dan ponsel",
      },
      caption: {
        en: "MAXY AI: a distinct route into each service.",
        id: "MAXY AI: jalur yang jelas menuju tiap layanan.",
      },
    },
    {
      src: "work/maxy-ai/agentic.webp",
      kind: "proof",
      alt: {
        en: "MAXY AI agentic AI service page",
        id: "Halaman layanan agentic AI MAXY AI",
      },
      caption: {
        en: "A dedicated page explains the AI offer before the first conversation.",
        id: "Halaman khusus menjelaskan layanan AI sebelum percakapan pertama.",
      },
    },
    {
      src: "work/industrial-coatings/pair.webp",
      kind: "proof",
      alt: {
        en: "Industrial coatings catalogue on desktop and mobile",
        id: "Katalog coating industri pada desktop dan ponsel",
      },
      caption: {
        en: "Industrial Coatings: product discovery on two screen sizes.",
        id: "Katalog Coating Industri: pencarian produk di dua ukuran layar.",
      },
    },
  ],
  internal: [
    {
      src: "work/order-sales/pair.webp",
      kind: "proof",
      alt: {
        en: "Operational orders dashboard beside the mobile Sales Dashboard",
        id: "Dashboard pesanan operasional dan Beranda Sales pada ponsel",
      },
      caption: {
        en: "Order and field sales: office and mobile views from the isolated demo.",
        id: "Pesanan dan sales lapangan: tampilan kantor dan ponsel dari demo terpisah.",
      },
    },
    {
      src: "work/order-sales/order-detail.webp",
      kind: "proof",
      alt: {
        en: "Order detail with ten stages and transition history",
        id: "Detail pesanan dengan sepuluh tahap dan riwayat perpindahan",
      },
      caption: {
        en: "Order detail connects warehouse, delivery, administration, and finance.",
        id: "Detail pesanan menghubungkan gudang, pengiriman, administrasi, dan keuangan.",
      },
    },
    {
      src: "work/field-projects/project-detail.webp",
      kind: "proof",
      alt: {
        en: "Project detail with progress by stage and zone",
        id: "Detail proyek dengan progres per tahap dan zona",
      },
      caption: {
        en: "Field Projects: progress is tied to a stage and a specific zone.",
        id: "Proyek Lapangan: progres mengacu pada tahap dan zona tertentu.",
      },
    },
  ],
  design: [
    {
      src: "work/expert-profile/pair.webp",
      kind: "proof",
      alt: {
        en: "Expert profile website on desktop and mobile",
        id: "Situs profil ahli pada desktop dan ponsel",
      },
      caption: {
        en: "Expert Profile: distinct paths for partners and learners.",
        id: "Profil Ahli: jalur berbeda bagi mitra dan pembelajar.",
      },
    },
    {
      src: "work/expert-profile/resource-modal.webp",
      kind: "proof",
      alt: {
        en: "Empty free-resource request form",
        id: "Formulir permintaan materi gratis dengan kolom kosong",
      },
      caption: {
        en: "A clear next step for readers who want to learn.",
        id: "Langkah berikutnya yang jelas bagi pembaca yang ingin belajar.",
      },
    },
    {
      src: "work/ai-ceo-circle/application.webp",
      kind: "proof",
      alt: {
        en: "AI CEO Circle two-step application form",
        id: "Formulir aplikasi dua tahap AI CEO Circle",
      },
      caption: {
        en: "AI CEO Circle: the application is split into two steps.",
        id: "AI CEO Circle: pendaftaran dibagi menjadi dua langkah.",
      },
    },
  ],
  care: [
    {
      src: "work/operations-control/desktop.webp",
      kind: "diagram",
      alt: {
        en: "Simplified architecture of three managed applications",
        id: "Diagram ringkas tiga aplikasi yang dikelola",
      },
      caption: {
        en: "Simplified architecture; a live Komodo capture awaits access.",
        id: "Arsitektur ringkas; tangkapan Komodo menunggu akses.",
      },
    },
  ],
} as const;

export const services = [
  {
    id: "marketing-sites",
    order: 1,
    build: "marketing",
    thumb: "editorial/service-marketing-thumb.webp",
    images: media.marketing,
    en: {
      slug: "marketing-sites",
      title: "Marketing & landing sites",
      metaTitle: "Marketing & Landing Sites Written From Scratch | Renoir",
      metaDescription:
        "Fast, search-ready marketing sites built from zero, with performance and indexing targets agreed before we start and checked before launch.",
      excerpt:
        "Written from scratch for companies that need to be found and taken seriously. Fast by construction, not by plugin. Technical SEO from the first commit: structure, structured data, clean indexing, readable to AI search as well as to Google.",
      tagline: "For companies judged by their website",
      heading: "A website that earns the first meeting",
      intro: [
        "Prospects check your website before they reply to your email. If it loads slowly, looks like a template, or doesn't show up in search, the decision is made before you're in the room.",
        "We write marketing sites from scratch, with performance and search visibility set as targets before the build starts and checked before handover.",
      ],
      summary:
        "Built on modern frameworks, rendered statically where possible, with optimised images and very little JavaScript. Readable by Google and by AI answer engines from day one.",
      lists: [
        [
          "Design approved before code",
          "Written from scratch",
          "Performance targets agreed up front",
          "Mobile-first layout",
          "Contact and lead forms",
        ],
        [
          "Semantic structure and clean metadata",
          "Structured data",
          "Sitemaps and correct indexing",
          "Readable to AI search",
          "Deployed, monitored, documented",
        ],
      ],
      formTitle: "Tell us about your website",
      faq: [
        {
          question: "How long does a marketing site take?",
          answer:
            "Usually two to four weeks from approved scope to launch. The timeline is in the written scope before you commit.",
        },
        {
          question: "Can my team edit the content ourselves?",
          answer:
            "Yes, when you need it. If your team will update pages regularly, we include a content editor in the scope. If changes are rare, the care retainer covers them.",
        },
        {
          question: "Do you redesign existing websites?",
          answer:
            "We rebuild them. We keep what works — your content, and the URLs that already rank — and write the site again from scratch. We don't patch templates.",
        },
        {
          question: "What happens after launch?",
          answer:
            "The site is handed over running, with documentation and full access. Keep us on a care retainer, or take it from there.",
        },
      ],
    },
    id_: {
      slug: "situs-marketing",
      title: "Situs marketing & landing page",
      metaTitle: "Situs Marketing & Landing Page dari Nol | Renoir",
      metaDescription:
        "Situs marketing yang cepat dan siap dicari, dibangun dari nol dengan target performa dan indexing yang disepakati sejak awal dan dicek sebelum live.",
      excerpt:
        "Ditulis dari nol untuk perusahaan yang perlu ditemukan dan dipercaya. Cepat karena dibangun dengan benar, bukan karena plugin. SEO teknis sejak awal: struktur, structured data, indexing yang bersih, dan terbaca oleh AI search maupun Google.",
      tagline: "Untuk perusahaan yang dinilai dari website-nya",
      heading: "Website yang membuka pintu pertemuan pertama",
      intro: [
        "Calon klien membuka website Anda sebelum membalas email Anda. Kalau lambat, terlihat seperti template, atau tidak muncul di pencarian, keputusannya sudah dibuat sebelum Anda sempat bicara.",
        "Kami menulis situs marketing dari nol, dengan target performa dan visibilitas pencarian yang ditetapkan sebelum build dimulai dan dicek sebelum serah terima.",
      ],
      summary:
        "Dibangun dengan framework modern, dirender statis bila memungkinkan, dengan gambar yang dioptimasi dan JavaScript seminimal mungkin. Terbaca oleh Google dan mesin jawaban AI sejak hari pertama.",
      lists: [
        [
          "Desain disetujui sebelum kode",
          "Ditulis dari nol",
          "Target performa disepakati di awal",
          "Tata letak mobile-first",
          "Form kontak dan lead",
        ],
        [
          "Struktur semantik dan metadata rapi",
          "Structured data",
          "Sitemap dan indexing yang benar",
          "Terbaca oleh AI search",
          "Di-deploy, dimonitor, didokumentasikan",
        ],
      ],
      formTitle: "Ceritakan website Anda",
      faq: [
        {
          question: "Berapa lama pembuatan situs marketing?",
          answer:
            "Umumnya dua sampai empat minggu dari scope disetujui sampai live. Timeline tertulis di scope sebelum Anda memutuskan.",
        },
        {
          question: "Bisakah tim kami mengedit konten sendiri?",
          answer:
            "Bisa, kalau memang dibutuhkan. Jika tim Anda rutin memperbarui halaman, editor konten kami masukkan ke dalam scope. Jika perubahan jarang, retainer perawatan sudah mencakupnya.",
        },
        {
          question: "Apakah kalian mendesain ulang website yang sudah ada?",
          answer:
            "Kami membangunnya ulang. Yang sudah bekerja kami pertahankan — konten Anda dan URL yang sudah punya peringkat — lalu situsnya kami tulis ulang dari nol. Kami tidak menambal template.",
        },
        {
          question: "Apa yang terjadi setelah live?",
          answer:
            "Situs diserahkan dalam keadaan berjalan, lengkap dengan dokumentasi dan akses penuh. Lanjutkan dengan retainer perawatan, atau kelola sendiri.",
        },
      ],
    },
  },
  {
    id: "internal-systems",
    order: 2,
    build: "internal",
    thumb: "editorial/service-internal-thumb.webp",
    images: media.internal,
    en: {
      slug: "internal-systems",
      title: "Custom internal systems",
      metaTitle: "Custom Internal Systems Built Around How You Work | Renoir",
      metaDescription:
        "Order tracking, dashboards, monitoring, approvals, and integrations — business software built around your process, delivered running with monitoring and backups.",
      excerpt:
        "Software built around how your business actually runs. Order and document tracking, operational dashboards, monitoring, approvals, internal tools, and integrations between systems that were never meant to talk to each other.",
      tagline: "For operations that outgrew spreadsheets",
      heading: "Software shaped around how you work",
      intro: [
        "When orders live in chat threads, approvals live in someone's inbox, and the real numbers live in a spreadsheet only one person understands, the business is running on memory.",
        "We build the system your team opens every morning: designed around your process, not a tool built for someone else's business.",
      ],
      summary:
        "Built from a written scope, shown on a staging URL while it's built, and deployed with monitoring and backups so it keeps running after handover.",
      lists: [
        [
          "Order and document tracking",
          "Operational dashboards",
          "Activity monitoring",
          "Approval workflows",
          "Internal tools",
        ],
        [
          "Integrations between existing systems",
          "Roles and access control",
          "Data you own",
          "Monitoring and backups",
          "Documentation and walkthrough",
        ],
      ],
      formTitle: "Tell us how you work today",
      faq: [
        {
          question: "How do you price an internal system?",
          answer:
            "After a scoping conversation, you get a written scope with a fixed price and timeline. The price doesn't move unless the scope does.",
        },
        {
          question: "Can it connect to the tools we already use?",
          answer:
            "Usually, yes. Integrations between existing systems are part of the work; we confirm what's possible during scoping.",
        },
        {
          question: "Who owns the data and the code?",
          answer:
            "You do. Code, data, and infrastructure access are yours at handover.",
        },
        {
          question: "Can we see progress during the build?",
          answer:
            "Yes. The system runs on a staging URL from early in the build, so you can check it at any time.",
        },
      ],
    },
    id_: {
      slug: "sistem-internal",
      title: "Sistem internal custom",
      metaTitle: "Sistem Internal Custom Sesuai Cara Kerja Anda | Renoir",
      metaDescription:
        "Pelacakan order, dashboard, monitoring, persetujuan, dan integrasi — software bisnis yang mengikuti proses Anda, diserahkan berjalan dengan monitoring dan backup.",
      excerpt:
        "Software yang dibangun mengikuti cara bisnis Anda berjalan. Pelacakan order dan dokumen, dashboard operasional, monitoring, persetujuan, tools internal, dan integrasi antar sistem yang tadinya tidak saling terhubung.",
      tagline: "Untuk operasional yang sudah melampaui spreadsheet",
      heading: "Software yang mengikuti cara kerja Anda",
      intro: [
        "Saat order tercatat di grup chat, persetujuan tersimpan di inbox seseorang, dan angka sebenarnya ada di spreadsheet yang hanya dipahami satu orang, bisnis Anda sedang berjalan di atas ingatan.",
        "Kami membangun sistem yang dibuka tim Anda setiap pagi: dirancang mengikuti proses Anda, bukan tools yang dibuat untuk bisnis orang lain.",
      ],
      summary:
        "Dikerjakan dari scope tertulis, bisa dilihat di URL staging selama proses, dan di-deploy dengan monitoring serta backup supaya tetap berjalan setelah serah terima.",
      lists: [
        [
          "Pelacakan order dan dokumen",
          "Dashboard operasional",
          "Monitoring aktivitas",
          "Alur persetujuan",
          "Tools internal",
        ],
        [
          "Integrasi antar sistem yang sudah ada",
          "Peran dan hak akses",
          "Data sepenuhnya milik Anda",
          "Monitoring dan backup",
          "Dokumentasi dan walkthrough",
        ],
      ],
      formTitle: "Ceritakan cara kerja Anda saat ini",
      faq: [
        {
          question: "Bagaimana harga sistem internal ditentukan?",
          answer:
            "Setelah diskusi scope, Anda menerima scope tertulis dengan harga tetap dan timeline. Harganya tidak berubah selama scope-nya tidak berubah.",
        },
        {
          question: "Bisakah terhubung dengan tools yang sudah kami pakai?",
          answer:
            "Umumnya bisa. Integrasi antar sistem adalah bagian dari pekerjaan; apa yang memungkinkan kami pastikan saat penyusunan scope.",
        },
        {
          question: "Siapa pemilik data dan kodenya?",
          answer:
            "Anda. Kode, data, dan akses infrastruktur menjadi milik Anda saat serah terima.",
        },
        {
          question: "Bisakah kami melihat progres selama build?",
          answer:
            "Bisa. Sistemnya berjalan di URL staging sejak awal build, jadi bisa Anda cek kapan saja.",
        },
      ],
    },
  },
  {
    id: "uiux-identity",
    order: 3,
    build: "design",
    thumb: "editorial/service-design-thumb.webp",
    images: media.design,
    en: {
      slug: "uiux-identity",
      title: "UI/UX & visual identity",
      metaTitle: "UI/UX and Visual Identity Design | Renoir",
      metaDescription:
        "Interface design and visual identity for digital products, websites, and businesses. Design can be scoped on its own or alongside a build.",
      excerpt:
        "Clear interfaces and a visual identity that belongs to your business. Available as a design project on its own or alongside development.",
      tagline: "For products and businesses ready to look like themselves",
      heading: "Make the experience feel like your business",
      intro: [
        "A usable product and a recognisable business both start with decisions about what people need to see and do.",
        "We shape the structure, interface, and visual identity together. You can commission the design alone or bring us into the build as well.",
      ],
      summary:
        "The scope can cover user flows, wireframes, interface design, prototypes, and a visual identity. We agree on the deliverables before work begins.",
      lists: [
        [
          "User flows",
          "Information architecture",
          "Wireframes",
          "Website and app interfaces",
          "Interactive prototypes",
        ],
        [
          "Visual direction",
          "Logo and identity design",
          "Typography and colour system",
          "Reusable interface patterns",
          "Design handover",
        ],
      ],
      formTitle: "Tell us what you need designed",
      faq: [
        {
          question: "Can we commission design without development?",
          answer:
            "Yes. Design can be its own project, with the deliverables defined in the written scope.",
        },
        {
          question: "Can you also build what you design?",
          answer:
            "Yes. Design and development can be scoped together, so the approved work carries through to the live product.",
        },
      ],
    },
    id_: {
      slug: "uiux-identitas",
      title: "UI/UX & identitas visual",
      metaTitle: "Desain UI/UX dan Identitas Visual | Renoir",
      metaDescription:
        "Desain antarmuka dan identitas visual untuk produk digital, website, dan bisnis. Bisa dikerjakan sebagai proyek tersendiri atau bersama pembangunan.",
      excerpt:
        "Antarmuka yang mudah dipakai dan identitas visual yang terasa milik bisnis Anda. Bisa dipesan sebagai proyek desain tersendiri atau bersama pembangunan.",
      tagline:
        "Untuk produk dan bisnis yang ingin tampil dengan karakter sendiri",
      heading: "Pengalaman yang terasa seperti bisnis Anda",
      intro: [
        "Produk yang mudah dipakai dan bisnis yang mudah dikenali berawal dari keputusan tentang apa yang perlu dilihat dan dilakukan orang.",
        "Kami menyusun alur, antarmuka, dan identitas visual sebagai satu pekerjaan. Anda bisa memesan desain saja atau melanjutkannya sampai produk berjalan.",
      ],
      summary:
        "Scope desain dapat mencakup alur pengguna, wireframe, antarmuka, prototipe, dan identitas visual. Hasil yang diserahkan disepakati sebelum pekerjaan dimulai.",
      lists: [
        [
          "Alur pengguna",
          "Arsitektur informasi",
          "Wireframe",
          "Antarmuka website dan aplikasi",
          "Prototipe interaktif",
        ],
        [
          "Arah visual",
          "Desain logo dan identitas",
          "Sistem tipografi dan warna",
          "Pola antarmuka yang dapat dipakai ulang",
          "Serah terima desain",
        ],
      ],
      formTitle: "Ceritakan kebutuhan desain Anda",
      faq: [
        {
          question: "Bisakah memesan desain tanpa pembangunan?",
          answer:
            "Bisa. Desain dapat menjadi proyek tersendiri, dengan hasil akhir yang ditetapkan dalam scope tertulis.",
        },
        {
          question: "Bisakah Renoir membangun desainnya juga?",
          answer:
            "Bisa. Desain dan pembangunan dapat disusun dalam satu scope agar rancangan yang disetujui berlanjut sampai produk live.",
        },
      ],
    },
  },
  {
    id: "deployment-care",
    order: 4,
    build: "unsure",
    thumb: "editorial/service-care-thumb.webp",
    images: media.care,
    en: {
      slug: "deployment-care",
      title: "Deployment & care",
      metaTitle: "Deployment, Monitoring & Website Care Retainers | Renoir",
      metaDescription:
        "Servers, pipelines, monitoring, backups, domains, and SSL — included in every Renoir build and available as a monthly care retainer afterwards.",
      excerpt:
        "Servers, pipelines, monitoring, backups, domains, certificates. Included in every build and available afterwards, so what we built keeps working.",
      tagline: "For every client, by default",
      heading: "Built is not the same as running",
      intro: [
        "Most projects fail after the build: software nobody can deploy, servers nobody configured, and no one to call when it stops.",
        "Deployment and care is included in everything we build, and available as a monthly retainer afterwards.",
      ],
      summary:
        "You get full access either way. Keep us on to run it, or take it in-house with the documentation.",
      lists: [
        [
          "Server and infrastructure setup",
          "Deployment pipeline",
          "Domain and SSL",
          "Monitoring and alerts",
          "Backups",
        ],
        [
          "Updates and security patches",
          "Defined monthly change work",
          "Documentation",
          "Handover walkthrough",
          "Full access, always",
        ],
      ],
      formTitle: "Tell us what you're running",
      faq: [
        {
          question: "Is care included or extra?",
          answer:
            "Deployment, monitoring, and backups are set up in every build. Ongoing care after handover is an optional monthly retainer.",
        },
        {
          question: "Can you take over a system someone else built?",
          answer:
            "We take over systems we've rebuilt or reviewed. We don't maintain someone else's template.",
        },
        {
          question: "What does the retainer cover?",
          answer:
            "Hosting, monitoring, backups, updates, and a set amount of change work each month.",
        },
        {
          question: "What if we want to move it in-house?",
          answer:
            "You get the repository, infrastructure access, and documentation, and take it from there.",
        },
      ],
    },
    id_: {
      slug: "deployment-perawatan",
      title: "Deployment & perawatan",
      metaTitle: "Deployment, Monitoring & Retainer Perawatan Website | Renoir",
      metaDescription:
        "Server, pipeline, monitoring, backup, domain, dan SSL — termasuk di setiap proyek Renoir dan tersedia sebagai retainer perawatan bulanan setelahnya.",
      excerpt:
        "Server, pipeline, monitoring, backup, domain, sertifikat. Termasuk di setiap proyek dan tersedia setelahnya, supaya yang kami bangun tetap bekerja.",
      tagline: "Untuk setiap klien, tanpa perlu diminta",
      heading: "Selesai dibangun belum tentu berjalan",
      intro: [
        "Banyak proyek gagal justru setelah build selesai: software yang tidak bisa di-deploy, server yang tidak dikonfigurasi, dan tidak ada yang bisa dihubungi saat berhenti.",
        "Deployment dan perawatan sudah termasuk di semua yang kami bangun, dan tersedia sebagai retainer bulanan setelahnya.",
      ],
      summary:
        "Anda tetap memegang akses penuh. Biarkan kami yang menjalankan, atau kelola sendiri dengan dokumentasi yang kami serahkan.",
      lists: [
        [
          "Setup server dan infrastruktur",
          "Pipeline deployment",
          "Domain dan SSL",
          "Monitoring dan notifikasi",
          "Backup",
        ],
        [
          "Update dan patch keamanan",
          "Jatah perubahan bulanan",
          "Dokumentasi",
          "Walkthrough serah terima",
          "Akses penuh, selalu",
        ],
      ],
      formTitle: "Ceritakan sistem yang Anda jalankan",
      faq: [
        {
          question: "Apakah perawatan sudah termasuk atau terpisah?",
          answer:
            "Deployment, monitoring, dan backup disiapkan di setiap proyek. Perawatan berkelanjutan setelah serah terima adalah retainer bulanan yang opsional.",
        },
        {
          question: "Bisakah kalian mengambil alih sistem buatan pihak lain?",
          answer:
            "Kami mengambil alih sistem yang sudah kami bangun ulang atau kami review. Kami tidak merawat template buatan pihak lain.",
        },
        {
          question: "Apa saja yang dicakup retainer?",
          answer:
            "Hosting, monitoring, backup, update, dan jatah perubahan tertentu setiap bulan.",
        },
        {
          question: "Bagaimana kalau kami ingin mengelolanya sendiri?",
          answer:
            "Anda menerima repository, akses infrastruktur, dan dokumentasi, lalu melanjutkannya sendiri.",
        },
      ],
    },
  },
];
