// How-we-work/guarantee and legal pages (EN/ID). One source for the pages, their FAQ/JSON-LD and llms.txt.
// Legal text is a working draft that must match actual practice; the owner approves it before launch.
import { site } from "~/data/site";
import type { Locale } from "~/i18n";

export interface DocSection {
  id: string;
  title: string;
  body?: string[];
  list?: string[];
}
export interface DocPage {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  label: string;
  title: string;
  intro: string;
  /** ISO date of the last substantive change. */
  updated: string;
  /** Short promises shown as cards above the sections. */
  highlights?: { title: string; body: string }[];
  sections: DocSection[];
}
export type DocKey = "howWeWork" | "privacy" | "terms" | "cookies";

const days = site.bugFixDays;
const months = site.leadRetentionMonths;

const en: Record<DocKey, DocPage> = {
  howWeWork: {
    metaTitle: "How we work, revisions and bug fixing | Katalhys",
    metaDescription: `What Katalhys agrees in writing, what you provide, how revisions and handover work, and the ${days}-day bug fixing period after launch.`,
    breadcrumb: "How we work",
    label: "Before you sign",
    title: "What you can expect from us, in writing",
    intro: "Every project starts with a written scope. These are the rules we keep on every engagement, so you can judge the offer before the first call.",
    updated: "2026-11-13",
    highlights: [
      { title: "Written scope and acceptance criteria", body: "Before work starts you approve what the first release covers and how we will both check that it works." },
      { title: `${days} days of bug fixing`, body: `After launch we fix defects against the agreed acceptance criteria for ${days} days at no extra cost.` },
      { title: "You own the result", body: "Source code, design files, domains and accounts are handed over to you, with documentation to run them." },
    ],
    sections: [
      { id: "stages", title: "Four stages, each with an approval", list: [
        "Scope: we map the current workflow, agree the first release and set acceptance criteria. You receive a written scope and a fixed quote.",
        "Design: you review the structure and key screens, then approve the visual direction before production code is written.",
        "Build: you test the working product on a staging URL while features land, and we fix findings before launch.",
        "Launch and handover: we configure hosting and monitoring, transfer source and access, and document how to run the site or system.",
      ] },
      { id: "inputs", title: "What we need from you", list: [
        "One decision maker who can approve scope, design and launch.",
        "Content, brand assets, sample data or access to existing systems by the dates in the plan.",
        "Feedback within the review window agreed for each stage.",
      ], body: ["When inputs arrive late, the schedule moves by the same amount. We tell you as soon as a delay affects the launch date."] },
      { id: "revisions", title: "Revisions", body: [
        "Each stage includes the review rounds stated in the scope. Changes that stay within the agreed scope are part of the work.",
        "New features, new pages or a change of direction after approval are quoted separately before we start them, so the original timeline and price stay clear.",
      ] },
      { id: "bug-fixing", title: `${days}-day bug fixing`, body: [
        `For ${days} days after launch, we fix defects at no extra cost. A defect is behaviour that does not meet the acceptance criteria approved in the scope.`,
      ], list: [
        "Not covered: new features, content changes, changes made by other parties, and outages or policy changes of third-party services.",
        "Report a defect with the page or screen, what you expected and what happened. We confirm receipt and agree a fix date with you.",
        "After the period, support and further development continue under a separate agreement if you want them.",
      ] },
      { id: "handover", title: "Handover and ownership", list: [
        "Source code in a repository you control.",
        "Design files and brand assets created for the project.",
        "Domains, hosting and third-party accounts registered to you, or transferred to you at handover.",
        "A short document on how to run, update and deploy the site or system.",
      ] },
      { id: "no-promises", title: "What we do not promise", body: [
        "We do not promise search rankings, traffic, leads or revenue. We build the foundations that make measurement possible and tell you which results depend on factors outside the project.",
      ] },
    ],
  },
  privacy: {
    metaTitle: "Privacy policy for the Katalhys website | Katalhys",
    metaDescription: "Which personal data the Katalhys website collects through its forms, why, who processes it, how long it is kept and how to ask for access or deletion.",
    breadcrumb: "Privacy",
    label: "Legal",
    title: "Privacy policy",
    intro: "This policy explains how Katalhys handles personal data submitted through this website, under Indonesia's Personal Data Protection Law (Law No. 27 of 2022).",
    updated: "2026-11-13",
    sections: [
      { id: "controller", title: "Who is responsible", body: [
        `${site.legal.entity ?? site.name} decides how the data below is used and is responsible for it.${site.legal.address ? ` Address: ${site.legal.address}.` : ""}`,
      ] },
      { id: "data", title: "Data we collect", list: [
        "Contact and project forms: name, email or WhatsApp number, company, website and the message you write.",
        "The “Find your first step” questionnaire: your answers and the recommendation shown to you, only when you choose to send them.",
        "Technical data needed for security: your IP address and browser details are used for spam protection and rate limiting and are not stored with your enquiry.",
      ] },
      { id: "purpose", title: "Why we use it", list: [
        "To reply to your enquiry and prepare a proposal you asked for.",
        "To keep a record of our conversation while you are a prospect or client.",
        "To protect the website from spam and abuse.",
      ], body: ["We do not sell your data and we do not use it for advertising."] },
      { id: "processors", title: "Who processes it for us", list: [
        "Cloudflare: hosting, spam protection (Turnstile), the database that stores enquiries, and server logs.",
        "Telegram: a short notification to the team when an enquiry arrives.",
        "Google: a private spreadsheet and email notification used for follow-up.",
      ], body: ["These providers may process data outside Indonesia. We only share what each one needs to do its job."] },
      { id: "retention", title: "How long we keep it", body: [
        `Enquiries are kept for up to ${months} months after our last contact, unless a contract with you requires a longer period. After that we delete them.`,
      ] },
      { id: "rights", title: "Your rights", body: [
        "You can ask to see, correct or delete your data, withdraw consent, or object to how it is used. Send the request through the contact page and mention “privacy”. We reply within 3 × 24 hours of verifying the request, as the law requires.",
      ] },
      { id: "changes", title: "Changes to this policy", body: ["We update this page when our practice changes and show the date of the last update at the top."] },
    ],
  },
  terms: {
    metaTitle: "Website terms of use and project agreements | Katalhys",
    metaDescription: "Terms for using the Katalhys website: content ownership, information accuracy, external links, and how project work is agreed in a separate written contract.",
    breadcrumb: "Terms",
    label: "Legal",
    title: "Website terms of use",
    intro: "These terms apply to your use of this website. Project work is always governed by a separate written proposal and agreement.",
    updated: "2026-11-13",
    sections: [
      { id: "content", title: "Content and ownership", body: [
        "Text, design, illustrations and the Katalhys name and logo on this website belong to Katalhys unless stated otherwise. Project screenshots are shown with permission of the work's owner and may not be reused.",
      ] },
      { id: "information", title: "Information on this site", body: [
        "We keep the information accurate, but it is general and may change. Recommendations from the questionnaire and notes are a starting point for a conversation, not a quote or a professional opinion about your situation.",
      ] },
      { id: "projects", title: "Project work", body: [
        "A project starts only after you approve a written proposal. The proposal and agreement set the scope, price, schedule, payment terms, ownership and support. If they differ from this website, the signed documents apply.",
      ] },
      { id: "links", title: "External links", body: ["Links to other websites are provided for convenience. We are not responsible for their content or privacy practices."] },
      { id: "liability", title: "Liability", body: [
        "To the extent permitted by law, Katalhys is not liable for losses arising from use of this website or reliance on its general information.",
      ] },
      { id: "law", title: "Governing law", body: ["These terms are governed by the laws of the Republic of Indonesia."] },
    ],
  },
  cookies: {
    metaTitle: "Cookie and local storage policy for this website | Katalhys",
    metaDescription: "Which cookies and browser storage the Katalhys website uses, why they are needed, which optional categories exist and how to change your choice at any time.",
    breadcrumb: "Cookies",
    label: "Legal",
    title: "Cookie policy",
    intro: "This website uses only what it needs to work. Optional analytics or marketing tools are off until you allow them.",
    updated: "2026-11-13",
    sections: [
      { id: "essential", title: "Always active", list: [
        "Your cookie choice: stored in your browser so we do not ask again on every page.",
        "Spam protection: Cloudflare Turnstile may set security cookies when you use a form.",
        "Questionnaire progress: your answers stay in your browser tab until you send or close them.",
        "Admin sign-in: a session cookie used only by the Katalhys team on the private admin pages.",
      ] },
      { id: "optional", title: "Optional categories", list: [
        "Analytics: measures visits and page performance in aggregate.",
        "Marketing: measures the results of advertising campaigns.",
      ], body: ["No optional tools are active today. If we add one, it will only load after you allow its category, and this page will name the provider."] },
      { id: "choice", title: "Changing your choice", body: ["Use “Cookie settings” in the footer to review or change your choice at any time. Clearing your browser storage also resets it."] },
    ],
  },
};

const id: Record<DocKey, DocPage> = {
  howWeWork: {
    metaTitle: "Cara kerja, revisi, dan perbaikan bug | Katalhys",
    metaDescription: `Yang Katalhys sepakati secara tertulis, yang perlu Anda siapkan, cara revisi dan serah terima, serta masa perbaikan bug ${days} hari setelah rilis.`,
    breadcrumb: "Cara kerja",
    label: "Sebelum Anda setuju",
    title: "Yang bisa Anda harapkan dari kami, secara tertulis",
    intro: "Setiap proyek dimulai dengan scope tertulis. Aturan berikut berlaku di setiap kerja sama, sehingga Anda bisa menilai penawaran sebelum panggilan pertama.",
    updated: "2026-11-13",
    highlights: [
      { title: "Scope dan kriteria penerimaan tertulis", body: "Sebelum pekerjaan dimulai, Anda menyetujui cakupan rilis pertama dan cara kita bersama memeriksa bahwa hasilnya berjalan." },
      { title: `Perbaikan bug ${days} hari`, body: `Setelah rilis, kami memperbaiki cacat terhadap kriteria penerimaan yang disepakati selama ${days} hari tanpa biaya tambahan.` },
      { title: "Hasilnya milik Anda", body: "Kode sumber, file desain, domain, dan akun diserahkan kepada Anda, lengkap dengan dokumentasi cara menjalankannya." },
    ],
    sections: [
      { id: "tahapan", title: "Empat tahap, masing-masing dengan persetujuan", list: [
        "Scope: kami memetakan alur kerja saat ini, menyepakati rilis pertama, dan menetapkan kriteria penerimaan. Anda menerima scope tertulis dan penawaran harga tetap.",
        "Desain: Anda meninjau struktur dan layar utama, lalu menyetujui arah visual sebelum kode produksi ditulis.",
        "Build: Anda menguji produk yang berjalan di URL staging seiring fitur selesai, dan kami memperbaiki temuan sebelum rilis.",
        "Rilis dan serah terima: kami mengatur hosting dan monitoring, menyerahkan kode serta akses, dan mendokumentasikan cara menjalankan situs atau sistem.",
      ] },
      { id: "masukan", title: "Yang kami perlukan dari Anda", list: [
        "Satu pengambil keputusan yang dapat menyetujui scope, desain, dan rilis.",
        "Konten, aset merek, contoh data, atau akses ke sistem yang ada sesuai tanggal di rencana.",
        "Masukan dalam jangka waktu review yang disepakati untuk setiap tahap.",
      ], body: ["Jika masukan terlambat, jadwal bergeser sebanyak keterlambatannya. Kami memberi tahu Anda segera ketika keterlambatan memengaruhi tanggal rilis."] },
      { id: "revisi", title: "Revisi", body: [
        "Setiap tahap mencakup putaran review yang tertulis di scope. Perubahan yang masih dalam scope yang disepakati termasuk dalam pekerjaan.",
        "Fitur baru, halaman baru, atau perubahan arah setelah disetujui dihitung terpisah sebelum kami mengerjakannya, sehingga jadwal dan harga awal tetap jelas.",
      ] },
      { id: "perbaikan-bug", title: `Perbaikan bug ${days} hari`, body: [
        `Selama ${days} hari setelah rilis, kami memperbaiki cacat tanpa biaya tambahan. Cacat adalah perilaku yang tidak memenuhi kriteria penerimaan yang disetujui dalam scope.`,
      ], list: [
        "Tidak termasuk: fitur baru, perubahan konten, perubahan oleh pihak lain, serta gangguan atau perubahan kebijakan layanan pihak ketiga.",
        "Laporkan cacat dengan menyebut halaman atau layar, hasil yang Anda harapkan, dan yang terjadi. Kami mengonfirmasi laporan dan menyepakati tanggal perbaikan bersama Anda.",
        "Setelah masa ini, dukungan dan pengembangan lanjutan berjalan dengan perjanjian terpisah jika Anda membutuhkannya.",
      ] },
      { id: "serah-terima", title: "Serah terima dan kepemilikan", list: [
        "Kode sumber di repository yang Anda kendalikan.",
        "File desain dan aset merek yang dibuat untuk proyek.",
        "Domain, hosting, dan akun pihak ketiga atas nama Anda, atau dipindahkan kepada Anda saat serah terima.",
        "Dokumen singkat cara menjalankan, memperbarui, dan men-deploy situs atau sistem.",
      ] },
      { id: "bukan-janji", title: "Yang tidak kami janjikan", body: [
        "Kami tidak menjanjikan peringkat pencarian, traffic, lead, atau omzet. Kami membangun fondasi yang memungkinkan pengukuran dan menjelaskan hasil mana yang bergantung pada faktor di luar proyek.",
      ] },
    ],
  },
  privacy: {
    metaTitle: "Kebijakan privasi situs Katalhys | Katalhys",
    metaDescription: "Data pribadi yang dikumpulkan situs Katalhys melalui formulir, tujuannya, pihak yang memprosesnya, lama penyimpanan, dan cara meminta akses atau penghapusan.",
    breadcrumb: "Privasi",
    label: "Legal",
    title: "Kebijakan privasi",
    intro: "Kebijakan ini menjelaskan cara Katalhys menangani data pribadi yang dikirim melalui situs ini, berdasarkan Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022).",
    updated: "2026-11-13",
    sections: [
      { id: "pengendali", title: "Pihak yang bertanggung jawab", body: [
        `${site.legal.entity ?? site.name} menentukan penggunaan data di bawah ini dan bertanggung jawab atasnya.${site.legal.address ? ` Alamat: ${site.legal.address}.` : ""}`,
      ] },
      { id: "data", title: "Data yang kami kumpulkan", list: [
        "Formulir kontak dan proyek: nama, email atau nomor WhatsApp, perusahaan, situs web, dan pesan yang Anda tulis.",
        "Kuesioner “Temukan langkah awal”: jawaban Anda dan rekomendasi yang ditampilkan, hanya jika Anda memilih mengirimnya.",
        "Data teknis untuk keamanan: alamat IP dan detail browser dipakai untuk perlindungan spam dan pembatasan permintaan, dan tidak disimpan bersama pesan Anda.",
      ] },
      { id: "tujuan", title: "Tujuan penggunaan", list: [
        "Membalas pertanyaan Anda dan menyiapkan penawaran yang Anda minta.",
        "Menyimpan catatan percakapan selama Anda menjadi calon klien atau klien.",
        "Melindungi situs dari spam dan penyalahgunaan.",
      ], body: ["Kami tidak menjual data Anda dan tidak memakainya untuk iklan."] },
      { id: "pemroses", title: "Pihak yang memproses untuk kami", list: [
        "Cloudflare: hosting, perlindungan spam (Turnstile), database penyimpan pesan, dan log server.",
        "Telegram: notifikasi singkat kepada tim saat pesan masuk.",
        "Google: spreadsheet privat dan notifikasi email untuk tindak lanjut.",
      ], body: ["Penyedia ini dapat memproses data di luar Indonesia. Kami hanya membagikan data yang diperlukan masing-masing untuk menjalankan tugasnya."] },
      { id: "penyimpanan", title: "Lama penyimpanan", body: [
        `Pesan disimpan paling lama ${months} bulan setelah kontak terakhir kita, kecuali kontrak dengan Anda memerlukan waktu lebih lama. Setelah itu kami menghapusnya.`,
      ] },
      { id: "hak", title: "Hak Anda", body: [
        "Anda dapat meminta melihat, memperbaiki, atau menghapus data, menarik persetujuan, atau keberatan atas penggunaannya. Kirim permintaan melalui halaman kontak dan sebutkan “privasi”. Kami membalas paling lambat 3 × 24 jam setelah permintaan terverifikasi, sesuai ketentuan undang-undang.",
      ] },
      { id: "perubahan", title: "Perubahan kebijakan", body: ["Kami memperbarui halaman ini ketika praktik kami berubah dan mencantumkan tanggal pembaruan terakhir di bagian atas."] },
    ],
  },
  terms: {
    metaTitle: "Syarat penggunaan situs dan perjanjian proyek | Katalhys",
    metaDescription: "Syarat penggunaan situs Katalhys: kepemilikan konten, ketepatan informasi, tautan eksternal, dan cara pekerjaan proyek disepakati dalam kontrak tertulis terpisah.",
    breadcrumb: "Syarat",
    label: "Legal",
    title: "Syarat penggunaan situs",
    intro: "Syarat ini berlaku untuk penggunaan situs ini. Pekerjaan proyek selalu diatur oleh proposal dan perjanjian tertulis yang terpisah.",
    updated: "2026-11-13",
    sections: [
      { id: "konten", title: "Konten dan kepemilikan", body: [
        "Teks, desain, ilustrasi, serta nama dan logo Katalhys di situs ini milik Katalhys kecuali disebutkan lain. Tangkapan layar proyek ditampilkan dengan izin pemilik karya dan tidak boleh digunakan ulang.",
      ] },
      { id: "informasi", title: "Informasi di situs ini", body: [
        "Kami menjaga informasi tetap akurat, tetapi sifatnya umum dan dapat berubah. Rekomendasi dari kuesioner dan catatan adalah titik awal percakapan, bukan penawaran harga atau pendapat profesional atas kondisi Anda.",
      ] },
      { id: "proyek", title: "Pekerjaan proyek", body: [
        "Proyek dimulai setelah Anda menyetujui proposal tertulis. Proposal dan perjanjian menetapkan scope, harga, jadwal, termin pembayaran, kepemilikan, dan dukungan. Jika berbeda dari situs ini, dokumen yang ditandatangani yang berlaku.",
      ] },
      { id: "tautan", title: "Tautan eksternal", body: ["Tautan ke situs lain disediakan untuk kemudahan. Kami tidak bertanggung jawab atas isi atau praktik privasinya."] },
      { id: "tanggung-jawab", title: "Batas tanggung jawab", body: [
        "Sejauh diizinkan hukum, Katalhys tidak bertanggung jawab atas kerugian yang timbul dari penggunaan situs ini atau dari mengandalkan informasi umumnya.",
      ] },
      { id: "hukum", title: "Hukum yang berlaku", body: ["Syarat ini tunduk pada hukum Republik Indonesia."] },
    ],
  },
  cookies: {
    metaTitle: "Kebijakan cookie dan penyimpanan browser | Katalhys",
    metaDescription: "Cookie dan penyimpanan browser yang dipakai situs Katalhys, alasan dibutuhkan, kategori opsional yang tersedia, dan cara mengubah pilihan Anda kapan saja.",
    breadcrumb: "Cookie",
    label: "Legal",
    title: "Kebijakan cookie",
    intro: "Situs ini hanya memakai yang diperlukan agar berfungsi. Alat analitik atau pemasaran opsional tetap nonaktif sampai Anda mengizinkannya.",
    updated: "2026-11-13",
    sections: [
      { id: "esensial", title: "Selalu aktif", list: [
        "Pilihan cookie Anda: disimpan di browser agar kami tidak bertanya di setiap halaman.",
        "Perlindungan spam: Cloudflare Turnstile dapat memasang cookie keamanan saat Anda memakai formulir.",
        "Progres kuesioner: jawaban tetap di tab browser Anda sampai dikirim atau ditutup.",
        "Login admin: cookie sesi yang hanya dipakai tim Katalhys di halaman admin privat.",
      ] },
      { id: "opsional", title: "Kategori opsional", list: [
        "Analitik: mengukur kunjungan dan performa halaman secara agregat.",
        "Pemasaran: mengukur hasil kampanye iklan.",
      ], body: ["Saat ini belum ada alat opsional yang aktif. Jika kami menambahkannya, alat itu baru dimuat setelah Anda mengizinkan kategorinya, dan halaman ini akan menyebut penyedianya."] },
      { id: "pilihan", title: "Mengubah pilihan", body: ["Gunakan “Pengaturan cookie” di footer untuk meninjau atau mengubah pilihan kapan saja. Menghapus penyimpanan browser juga mengatur ulang pilihan."] },
    ],
  },
};

export const docs: Record<Locale, Record<DocKey, DocPage>> = { en, id };
