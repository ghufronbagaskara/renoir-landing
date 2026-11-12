// Copy for the "Find your first step" questionnaire (EN/ID). Codes come from src/lib/quiz.ts.
import type { Branch, Recommendation } from "~/lib/quiz";
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
    goal: { title: string; hint: string; options: Options };
    current: { title: string; hint: string; options: Options };
    detail: Record<Branch, { title: string; hint: string; options: Options }>;
    timing: { title: string; hint: string; options: Options };
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
  };
  results: Record<Recommendation, QuizResult>;
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
  metaTitle: "Find your first step: a 4-question project check | Katalhys",
  metaDescription: "Answer four questions about your workflow, website or product and get a recommended first step, what to prepare and a related project. No sign-up needed.",
  breadcrumb: "Find your first step",
  label: "Four questions, about two minutes",
  title: "Not sure where to start?",
  intro: "Tell us what is getting in the way. You will see a recommended first step before you decide whether to send us anything.",
  points: ["No sign-up or contact details to see the result", "A first step you can act on, even without us", "Send the summary only if you want a reply"],
  start: "Start the questions",
  direct: "Already know what you need? Contact us directly",
  progress: "Question {n} of {total}",
  back: "Back",
  next: "Next",
  questions: {
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
        existing: "We already have a website, app or system",
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
    timing: {
      title: "When does this need to move?",
      hint: "We use this to suggest the size of the first step.",
      options: { now: "This month", quarter: "In 1–3 months", exploring: "Still exploring" },
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
};

const id: QuizCopy = {
  metaTitle: "Temukan langkah awal: cek proyek dalam 4 pertanyaan | Katalhys",
  metaDescription: "Jawab empat pertanyaan tentang alur kerja, situs, atau produk Anda dan dapatkan rekomendasi langkah awal, yang perlu disiapkan, serta contoh proyek. Tanpa daftar akun.",
  breadcrumb: "Temukan langkah awal",
  label: "Empat pertanyaan, sekitar dua menit",
  title: "Bingung mulai dari mana?",
  intro: "Ceritakan apa yang menghambat. Anda melihat rekomendasi langkah awal sebelum memutuskan mengirim apa pun kepada kami.",
  points: ["Tanpa daftar akun atau kontak untuk melihat hasil", "Langkah awal yang bisa dijalankan, bahkan tanpa kami", "Kirim ringkasan hanya jika Anda ingin dibalas"],
  start: "Mulai pertanyaan",
  direct: "Sudah tahu kebutuhannya? Hubungi kami langsung",
  progress: "Pertanyaan {n} dari {total}",
  back: "Kembali",
  next: "Lanjut",
  questions: {
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
        existing: "Sudah ada situs, aplikasi, atau sistem",
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
    timing: {
      title: "Kapan ini perlu berjalan?",
      hint: "Kami memakainya untuk menyarankan ukuran langkah awal.",
      options: { now: "Bulan ini", quarter: "Dalam 1–3 bulan", exploring: "Masih menjajaki" },
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
};

export const quizCopy: Record<Locale, QuizCopy> = { en, id };
