// Copy for the "Find your first step" questionnaire (EN/ID). Codes come from src/lib/quiz.ts.
import type { Branch, Industry, Recommendation, Scope } from "~/lib/quiz";
import type { Locale } from "~/i18n";

type Options = Record<string, string>;
export interface QuizResult {
  title: string;
  summary: string;
  firstStep: string;
  prepare: string[];
  /** services collection id; discovery has no single service. */
  service?: string;
}
export interface QuizCopy {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  label: string;
  title: string;
  intro: string;
  points: string[];
  start: string;
  direct: string;
  progress: string;
  back: string;
  next: string;
  questions: {
    industry: { title: string; hint: string; options: Options };
    goal: { title: string; hint: string; options: Options };
    current: { title: string; hint: string; options: Options };
    detail: Record<Branch, { title: string; hint: string; options: Options }>;
    size: { title: string; hint: string; options: Options };
    timing: { title: string; hint: string; options: Options };
    budget: { title: string; hint: string; options: Options };
  };
  result: {
    label: string;
    because: string;
    firstStep: string;
    prepare: string;
    proof: string;
    service: string;
    edit: string;
    restart: string;
    send: string;
    scope: string;
    example: string;
    agenda: string;
  };
  results: Record<Recommendation, QuizResult>;
  scopes: Record<Scope, { title: string; body: string }>;
  /** What the problem typically looks like in the visitor's sector. */
  examples: Record<Industry, string>;
  agenda: string[];
  form: {
    title: string;
    body: string;
    channel: string;
    channels: { email: string; whatsapp: string };
    whatsapp: string;
    whatsappHint: string;
    note: string;
    notePlaceholder: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    noJs: string;
  };
}

const en: QuizCopy = {
  metaTitle: "Find your first step: a 7-question project check | Katalhys",
  metaDescription: "Seven questions about your business, workflow, website or product. Get a recommended first step, its size, what to prepare and a related project. No sign-up.",
  breadcrumb: "Find your first step",
  label: "Seven questions, about two minutes",
  title: "Not sure where to start?",
  intro: "Tell us what is getting in the way. You will see a recommended first step before you decide whether to send us anything.",
  points: ["No sign-up or contact details to see the result", "A first step sized to your team, timing and budget", "Send the summary only if you want a reply"],
  start: "Start the questions",
  direct: "Already know what you need? Contact us directly",
  progress: "Question {n} of {total}",
  back: "Back",
  next: "Next",
  questions: {
    industry: {
      title: "What kind of business is this for?",
      hint: "We use it to show an example from a similar situation, not to filter you out.",
      options: {
        distribution: "Distribution, manufacturing or wholesale",
        services: "Professional services or consulting",
        projects: "Contractor or field projects",
        retail: "Retail, food and beverage or hospitality",
        education: "Education, training or a community",
        digital: "A startup or digital product",
        other: "Something else",
      },
    },
    goal: {
      title: "What would you most like to fix?",
      hint: "Pick the one that costs you the most time or opportunities today.",
      options: {
        workflow: "Work is scattered across chats and spreadsheets",
        repetitive: "The team repeats the same admin work every week",
        leads: "Prospects find it hard to understand or contact us",
        usability: "Our product or app is hard to use",
        brand: "We need a clear identity before we launch",
        infra: "Our site or app is slow, unstable or hard to update",
        unsure: "Not sure yet",
      },
    },
    current: {
      title: "How does it work today?",
      hint: "This tells us whether we start from what you have or from scratch.",
      options: {
        manual: "Mostly by hand: chat, paper or spreadsheets",
        offtheshelf: "Off-the-shelf software that does not quite fit",
        existing: "Our own website, app or system that needs work",
        none: "Nothing yet, we are starting from scratch",
      },
    },
    detail: {
      handoff: {
        title: "Who is involved in the work?",
        hint: "More handoffs usually mean more places where status gets lost.",
        options: { "one-team": "One team", "several-teams": "Several teams hand work to each other", external: "Customers or partners are involved too" },
      },
      channel: {
        title: "How do prospects find you now?",
        hint: "Your website should support the channel that already works.",
        options: { referrals: "Referrals and WhatsApp", social: "Social media or ads", search: "Google search", nothing: "No steady source yet" },
      },
      stage: {
        title: "Where is the product or brand now?",
        hint: "Design work looks different for an idea and for a live product.",
        options: { idea: "An idea or a brief", prototype: "Designs or a prototype exist", live: "Live, with real users" },
      },
      issue: {
        title: "What is the main problem?",
        hint: "Each problem has a different first fix.",
        options: { slow: "Pages load slowly", unstable: "It breaks or goes down", updates: "Updates and deploys are hard" },
      },
      priority: {
        title: "What would make the biggest difference this year?",
        hint: "Choose the outcome you would notice first.",
        options: { enquiries: "More enquiries from the right clients", admin: "Less time spent on admin", product: "A product people find easy to use", unknown: "I would like help working it out" },
      },
    },
    size: {
      title: "How many people will use it or feel the change?",
      hint: "Team size decides whether one focused release is enough or the work should be phased.",
      options: { solo: "1–5 people", small: "6–20 people", mid: "21–100 people", large: "More than 100 people" },
    },
    timing: {
      title: "When does this need to move?",
      hint: "A near deadline favours a smaller first release that can go live sooner.",
      options: { now: "This month", quarter: "In 1–3 months", exploring: "Still exploring" },
    },
    budget: {
      title: "What budget do you have in mind for the first stage?",
      hint: "Only used to size the recommendation. We do not show prices; the quote follows a written scope.",
      options: { lt10: "Under IDR 10 million", "10-25": "IDR 10–25 million", "25-50": "IDR 25–50 million", gt50: "Over IDR 50 million", discuss: "Not sure yet" },
    },
  },
  result: {
    label: "Your recommended first step",
    because: "Why this fits",
    firstStep: "Start with",
    prepare: "Bring to the first conversation",
    proof: "A related project",
    service: "Read about this service",
    edit: "Change my answers",
    restart: "Start again",
    send: "Send this summary to Katalhys",
    scope: "Size of the first step",
    example: "How this often looks in your sector",
    agenda: "What we go through in the first call",
  },
  results: {
    internal: {
      title: "A custom internal system",
      summary: "Your work depends on information that moves between people. One shared record with clear stages and owners usually saves more time than another spreadsheet.",
      firstStep: "Map one real order or request from start to finish: every stage, who owns it, and where the status is checked.",
      prepare: ["One example you can walk through", "The spreadsheets, forms or chats used today", "The roles that need access"],
      service: "internal-systems",
    },
    marketing: {
      title: "A marketing site built for enquiries",
      summary: "Prospects need to understand your offer quickly and reach you in the channel they already use. A focused site with clear pages and measurable contact points is the first lever.",
      firstStep: "List the three questions prospects ask before they buy, and the page or message that answers each one today.",
      prepare: ["Your current site or profile links", "Two or three sites you like and why", "Where enquiries arrive now"],
      service: "marketing-sites",
    },
    design: {
      title: "UI/UX and visual identity",
      summary: "The problem is how people understand and use what you offer. Fixing structure and the key flows first makes later development cheaper.",
      firstStep: "Choose the one task users struggle with most and record where they hesitate or give up.",
      prepare: ["Current screens, prototype or brand assets", "Who the main users are", "Feedback or complaints you have received"],
      service: "uiux-identity",
    },
    care: {
      title: "Deployment and care",
      summary: "The product exists but its foundations slow you down. Measuring, stabilising and automating the release process comes before new features.",
      firstStep: "Write down the last three incidents or slow releases: what happened, how long it took and who fixed it.",
      prepare: ["Hosting and domain access", "How you deploy today", "Any monitoring or error reports"],
      service: "deployment-care",
    },
    discovery: {
      title: "A short mapping session",
      summary: "The need is still open, which is a good moment to look before choosing a direction. A mapping session turns the situation into concrete options and their trade-offs.",
      firstStep: "Write down what takes the most time or causes the most frustration in a normal week.",
      prepare: ["What prompted you to look now", "Who else is involved in the decision", "Any constraints on timing or budget"],
    },
  },
  form: {
    title: "Want us to reply?",
    body: "We will read the summary and reply with questions or a suggested next step. Choose the channel you prefer.",
    channel: "Reply by",
    channels: { email: "Email", whatsapp: "WhatsApp" },
    whatsapp: "WhatsApp number",
    whatsappHint: "Include the country code, for example +62 812 3456 7890",
    note: "Anything else we should know (optional)",
    notePlaceholder: "Company website, current tools, deadlines…",
    privacy: "We use these details only to reply to you.",
    privacyLink: "Privacy policy",
    submit: "Send summary",
    noJs: "Answer each question, then add your contact details below.",
  },
  scopes: {
    mapping: { title: "Start with a short mapping", body: "Before building, map one real case end to end and agree what the first release must prove. It keeps the first spend small and the next decision clear." },
    focused: { title: "One focused first release", body: "One core flow, built and launched for the people who need it most. Further features come after it is used." },
    phased: { title: "A phased rollout", body: "With more people or a larger budget, start with one team or flow, then roll out in stages so training and data migration stay manageable." },
  },
  examples: {
    distribution: "Orders, stock and deliveries tracked in separate chats and spreadsheets, so nobody can say where an order is without asking.",
    services: "Enquiries arrive by WhatsApp, email and referrals, and proposals and follow-ups live in personal inboxes.",
    projects: "Daily site reports, photos and costs reach the office late, so problems surface after the budget is spent.",
    retail: "Promotions, bookings or orders change daily while the website and staff work from different information.",
    education: "Registrations, payments and class information are spread across forms, chats and spreadsheets.",
    digital: "The product grows feature by feature while the main user journey becomes harder to follow.",
    other: "The same information is copied between people and tools, and the latest version is hard to find.",
  },
  agenda: ["Walk through your example together", "Agree what the first release must do and how we will check it", "Decide the next step, including when we are not the right team"],
};

const id: QuizCopy = {
  metaTitle: "Temukan langkah awal: cek proyek dalam 7 pertanyaan | Katalhys",
  metaDescription: "Tujuh pertanyaan tentang bisnis, alur kerja, situs, atau produk Anda. Dapatkan langkah awal, ukurannya, yang perlu disiapkan, dan contoh proyek. Tanpa daftar akun.",
  breadcrumb: "Temukan langkah awal",
  label: "Tujuh pertanyaan, sekitar dua menit",
  title: "Bingung mulai dari mana?",
  intro: "Ceritakan apa yang menghambat. Anda melihat rekomendasi langkah awal sebelum memutuskan mengirim apa pun kepada kami.",
  points: ["Tanpa daftar akun atau kontak untuk melihat hasil", "Langkah awal yang disesuaikan dengan tim, waktu, dan anggaran", "Kirim ringkasan hanya jika Anda ingin dibalas"],
  start: "Mulai pertanyaan",
  direct: "Sudah tahu kebutuhannya? Hubungi kami langsung",
  progress: "Pertanyaan {n} dari {total}",
  back: "Kembali",
  next: "Lanjut",
  questions: {
    industry: {
      title: "Untuk jenis bisnis apa?",
      hint: "Kami memakainya untuk menunjukkan contoh dari situasi serupa, bukan untuk menyaring Anda.",
      options: {
        distribution: "Distribusi, manufaktur, atau grosir",
        services: "Jasa profesional atau konsultan",
        projects: "Kontraktor atau proyek lapangan",
        retail: "Retail, F&B, atau hospitality",
        education: "Pendidikan, pelatihan, atau komunitas",
        digital: "Startup atau produk digital",
        other: "Lainnya",
      },
    },
    goal: {
      title: "Apa yang paling ingin Anda benahi?",
      hint: "Pilih yang paling banyak menyita waktu atau peluang Anda saat ini.",
      options: {
        workflow: "Pekerjaan tersebar di chat dan spreadsheet",
        repetitive: "Tim mengulang pekerjaan administrasi yang sama setiap minggu",
        leads: "Calon pelanggan sulit memahami atau menghubungi kami",
        usability: "Produk atau aplikasi kami sulit dipakai",
        brand: "Kami perlu identitas yang jelas sebelum rilis",
        infra: "Situs atau aplikasi lambat, sering bermasalah, atau sulit diperbarui",
        unsure: "Belum yakin",
      },
    },
    current: {
      title: "Bagaimana pekerjaan itu berjalan sekarang?",
      hint: "Ini menentukan apakah kita mulai dari yang sudah ada atau dari awal.",
      options: {
        manual: "Sebagian besar manual: chat, kertas, atau spreadsheet",
        offtheshelf: "Software siap pakai yang kurang cocok",
        existing: "Situs, aplikasi, atau sistem sendiri yang perlu dibenahi",
        none: "Belum ada, kami mulai dari awal",
      },
    },
    detail: {
      handoff: {
        title: "Siapa saja yang terlibat?",
        hint: "Makin banyak serah terima, makin banyak tempat status bisa hilang.",
        options: { "one-team": "Satu tim", "several-teams": "Beberapa tim saling menyerahkan pekerjaan", external: "Pelanggan atau mitra juga terlibat" },
      },
      channel: {
        title: "Dari mana calon pelanggan menemukan Anda sekarang?",
        hint: "Situs sebaiknya mendukung kanal yang sudah berjalan.",
        options: { referrals: "Rekomendasi dan WhatsApp", social: "Media sosial atau iklan", search: "Pencarian Google", nothing: "Belum ada sumber yang stabil" },
      },
      stage: {
        title: "Di tahap mana produk atau merek Anda sekarang?",
        hint: "Pekerjaan desain untuk ide berbeda dengan produk yang sudah berjalan.",
        options: { idea: "Masih ide atau brief", prototype: "Sudah ada desain atau prototipe", live: "Sudah live dan dipakai pengguna" },
      },
      issue: {
        title: "Apa masalah utamanya?",
        hint: "Setiap masalah punya perbaikan awal yang berbeda.",
        options: { slow: "Halaman lambat dimuat", unstable: "Sering error atau down", updates: "Sulit diperbarui dan di-deploy" },
      },
      priority: {
        title: "Apa yang paling berdampak tahun ini?",
        hint: "Pilih hasil yang paling cepat Anda rasakan.",
        options: { enquiries: "Lebih banyak pertanyaan dari klien yang tepat", admin: "Waktu administrasi berkurang", product: "Produk yang mudah dipakai", unknown: "Saya ingin dibantu memetakannya" },
      },
    },
    size: {
      title: "Berapa orang yang akan memakai atau merasakan perubahannya?",
      hint: "Ukuran tim menentukan apakah cukup satu rilis fokus atau perlu bertahap.",
      options: { solo: "1–5 orang", small: "6–20 orang", mid: "21–100 orang", large: "Lebih dari 100 orang" },
    },
    timing: {
      title: "Kapan ini perlu berjalan?",
      hint: "Tenggat yang dekat lebih cocok dengan rilis pertama yang kecil agar bisa segera dipakai.",
      options: { now: "Bulan ini", quarter: "Dalam 1–3 bulan", exploring: "Masih menjajaki" },
    },
    budget: {
      title: "Berapa anggaran yang Anda bayangkan untuk tahap pertama?",
      hint: "Hanya untuk menyesuaikan saran. Kami tidak menampilkan harga; penawaran mengikuti scope tertulis.",
      options: { lt10: "Di bawah Rp10 juta", "10-25": "Rp10–25 juta", "25-50": "Rp25–50 juta", gt50: "Di atas Rp50 juta", discuss: "Belum tahu" },
    },
  },
  result: {
    label: "Rekomendasi langkah awal Anda",
    because: "Alasannya",
    firstStep: "Mulai dengan",
    prepare: "Bawa ke percakapan pertama",
    proof: "Proyek terkait",
    service: "Baca tentang layanan ini",
    edit: "Ubah jawaban",
    restart: "Mulai ulang",
    send: "Kirim ringkasan ini ke Katalhys",
    scope: "Ukuran langkah awal",
    example: "Biasanya terlihat seperti ini di bidang Anda",
    agenda: "Yang kita bahas di percakapan pertama",
  },
  results: {
    internal: {
      title: "Sistem internal custom",
      summary: "Pekerjaan Anda bergantung pada informasi yang berpindah antarorang. Satu catatan bersama dengan tahap dan penanggung jawab yang jelas biasanya menghemat lebih banyak waktu daripada spreadsheet baru.",
      firstStep: "Petakan satu pesanan atau permintaan nyata dari awal sampai selesai: setiap tahap, penanggung jawabnya, dan tempat status dicek.",
      prepare: ["Satu contoh yang bisa ditelusuri bersama", "Spreadsheet, formulir, atau chat yang dipakai sekarang", "Peran yang perlu akses"],
      service: "internal-systems",
    },
    marketing: {
      title: "Situs marketing untuk mendatangkan pertanyaan",
      summary: "Calon pelanggan perlu cepat memahami penawaran Anda dan bisa menghubungi lewat kanal yang sudah mereka pakai. Situs yang fokus dengan halaman jelas dan titik kontak terukur adalah langkah pertama.",
      firstStep: "Tulis tiga pertanyaan yang diajukan calon pelanggan sebelum membeli, serta halaman atau pesan yang menjawabnya saat ini.",
      prepare: ["Tautan situs atau profil saat ini", "Dua atau tiga situs yang Anda sukai dan alasannya", "Tempat pertanyaan masuk sekarang"],
      service: "marketing-sites",
    },
    design: {
      title: "UI/UX dan identitas visual",
      summary: "Masalahnya ada pada cara orang memahami dan memakai yang Anda tawarkan. Membenahi struktur dan alur utama lebih dulu membuat pengembangan berikutnya lebih hemat.",
      firstStep: "Pilih satu tugas yang paling menyulitkan pengguna dan catat di mana mereka ragu atau berhenti.",
      prepare: ["Layar, prototipe, atau aset merek saat ini", "Siapa pengguna utamanya", "Masukan atau keluhan yang pernah diterima"],
      service: "uiux-identity",
    },
    care: {
      title: "Deployment dan perawatan",
      summary: "Produknya sudah ada, tetapi fondasinya memperlambat Anda. Mengukur, menstabilkan, dan mengotomatiskan proses rilis didahulukan sebelum fitur baru.",
      firstStep: "Catat tiga insiden atau rilis lambat terakhir: apa yang terjadi, berapa lama, dan siapa yang memperbaikinya.",
      prepare: ["Akses hosting dan domain", "Cara deploy saat ini", "Monitoring atau laporan error yang ada"],
      service: "deployment-care",
    },
    discovery: {
      title: "Sesi pemetaan singkat",
      summary: "Kebutuhannya masih terbuka, saat yang tepat untuk melihat dulu sebelum memilih arah. Sesi pemetaan mengubah situasi menjadi pilihan konkret beserta konsekuensinya.",
      firstStep: "Tulis hal yang paling menyita waktu atau paling membuat frustrasi dalam satu minggu biasa.",
      prepare: ["Alasan Anda mulai mencari sekarang", "Siapa lagi yang ikut memutuskan", "Batasan waktu atau anggaran"],
    },
  },
  form: {
    title: "Ingin kami balas?",
    body: "Kami membaca ringkasan dan membalas dengan pertanyaan atau saran langkah berikutnya. Pilih kanal yang Anda sukai.",
    channel: "Balas lewat",
    channels: { email: "Email", whatsapp: "WhatsApp" },
    whatsapp: "Nomor WhatsApp",
    whatsappHint: "Sertakan kode negara, misalnya +62 812 3456 7890",
    note: "Hal lain yang perlu kami ketahui (opsional)",
    notePlaceholder: "Situs perusahaan, alat yang dipakai, tenggat…",
    privacy: "Kami memakai data ini hanya untuk membalas Anda.",
    privacyLink: "Kebijakan privasi",
    submit: "Kirim ringkasan",
    noJs: "Jawab setiap pertanyaan, lalu isi kontak Anda di bawah.",
  },
  scopes: {
    mapping: { title: "Mulai dengan pemetaan singkat", body: "Sebelum membangun, petakan satu kasus nyata dari awal sampai akhir dan sepakati apa yang harus dibuktikan rilis pertama. Biaya awal tetap kecil dan keputusan berikutnya jelas." },
    focused: { title: "Satu rilis pertama yang fokus", body: "Satu alur inti dibangun dan dirilis untuk orang yang paling membutuhkannya. Fitur lanjutan menyusul setelah alur itu dipakai." },
    phased: { title: "Peluncuran bertahap", body: "Dengan lebih banyak orang atau anggaran yang lebih besar, mulai dari satu tim atau alur, lalu diperluas bertahap agar pelatihan dan migrasi data tetap terkendali." },
  },
  examples: {
    distribution: "Pesanan, stok, dan pengiriman dicatat di chat dan spreadsheet terpisah, sehingga posisi pesanan baru diketahui setelah bertanya.",
    services: "Pertanyaan masuk lewat WhatsApp, email, dan rekomendasi, sementara penawaran dan tindak lanjut tersimpan di inbox pribadi.",
    projects: "Laporan harian, foto, dan biaya lapangan terlambat sampai ke kantor, sehingga masalah baru terlihat setelah anggaran terpakai.",
    retail: "Promo, reservasi, atau pesanan berubah setiap hari, sementara situs dan staf memakai informasi yang berbeda.",
    education: "Pendaftaran, pembayaran, dan informasi kelas tersebar di formulir, chat, dan spreadsheet.",
    digital: "Produk bertambah fitur demi fitur, sementara alur utama pengguna makin sulit diikuti.",
    other: "Informasi yang sama disalin antarorang dan alat, dan versi terbarunya sulit ditemukan.",
  },
  agenda: ["Menelusuri contoh Anda bersama", "Menyepakati apa yang harus dilakukan rilis pertama dan cara mengeceknya", "Menentukan langkah berikutnya, termasuk jika kami bukan tim yang tepat"],
};

export const quizCopy: Record<Locale, QuizCopy> = { en, id };
