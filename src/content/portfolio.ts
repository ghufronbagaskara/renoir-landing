import { workFeatures, type WorkFeature } from "./portfolio-features";

export const workServiceIds = ["marketing", "internal", "design", "care"] as const;
export type WorkServiceId = (typeof workServiceIds)[number];

interface WorkCopy {
  title: string;
  subtitle: string;
  overview: string;
  challenge: string;
  approach: string;
  role: string;
  ai?: { title: string; body: string; points: string[] };
  tags: string[];
}

interface WorkProject {
  id: string;
  order: number;
  primaryService: WorkServiceId;
  serviceIds: WorkServiceId[];
  featuredRank?: number;
  homeRank?: number;
  desktopImage: string;
  mobileImage: string;
  pairImage: string;
  features: WorkFeature[];
  imageNote?: { en: string; id_: string };
  year?: string;
  en: WorkCopy;
  id_: WorkCopy;
}

const images = (id: string) => ({ desktopImage: `work/${id}/desktop.webp`, mobileImage: `work/${id}/mobile.webp`, pairImage: `work/${id}/pair.webp`, features: workFeatures[id] });

export const portfolio: WorkProject[] = [
  {
    id: "order-sales", order: 1, primaryService: "internal", serviceIds: ["internal", "design", "care"], featuredRank: 1, homeRank: 1, ...images("order-sales"),
    en: {
      title: "Order & Field Sales Workflow", subtitle: "Orders change hands. Their status should stay visible.",
      overview: "Orders change hands. Their status should stay visible. This system brings stages, ownership, deadlines, payments, and field sales activity into view.",
      challenge: "A manufacturing order passes through warehouse, delivery, administration, and finance. The team needs to see where each order stands and who owns the next step.",
      approach: "A ten-stage order trail, operational dashboard, overdue signals, and field sales views connect office and on-site work in one application.",
      role: "The Katalhys founder worked on the interface, application development, AI-assisted sales follow-up, and deployment.",
      ai: {
        title: "AI helps the team decide what to follow up",
        body: "Order tracking shows what happened. AI turns visit notes and operational records into suggestions the sales team and owner can review before acting.",
        points: ["Suggests the next visit's actions from a prospect's history and recorded obstacles.", "Reviews sales activity and highlights specific points to improve.", "Adds an AI-written narrative to the owner's daily operational and sales digest."],
      },
      tags: ["Order tracking", "Field sales", "UI/UX", "AI integration"],
    },
    id_: {
      title: "Alur Pesanan & Sales Lapangan", subtitle: "Pesanan berpindah tangan; informasinya tidak boleh ikut hilang.",
      overview: "Pesanan berpindah tangan; informasinya tidak boleh ikut hilang. Sistem ini menunjukkan tahap, penanggung jawab, tenggat, pembayaran, dan aktivitas sales lapangan.",
      challenge: "Pesanan manufaktur melewati gudang, pengiriman, administrasi, dan keuangan. Tim perlu tahu posisi setiap pesanan dan siapa yang menangani tahap berikutnya.",
      approach: "Jejak sepuluh tahap, dashboard operasional, penanda keterlambatan, dan layar sales lapangan menghubungkan pekerjaan kantor dan lapangan.",
      role: "Pendiri Katalhys mengerjakan antarmuka, pengembangan aplikasi, integrasi AI untuk tindak lanjut sales, dan deployment.",
      ai: {
        title: "AI membantu menentukan tindak lanjut",
        body: "Pelacakan pesanan menunjukkan apa yang terjadi. AI mengolah catatan kunjungan dan aktivitas operasional menjadi saran yang dapat diperiksa sales serta pemilik sebelum bertindak.",
        points: ["Menyarankan langkah kunjungan berikutnya dari riwayat prospek dan kendala yang dicatat.", "Meninjau aktivitas sales dan menunjukkan hal konkret yang perlu diperbaiki.", "Melengkapi rekap operasional dan sales harian pemilik dengan narasi dari AI."],
      },
      tags: ["Pelacakan pesanan", "Sales lapangan", "UI/UX", "Integrasi AI"],
    },
  },
  {
    id: "industrial-coatings", order: 2, primaryService: "marketing", serviceIds: ["marketing", "design", "care"], featuredRank: 2, homeRank: 3, ...images("industrial-coatings"),
    en: {
      title: "Industrial Coatings Catalogue", subtitle: "A product range buyers can actually navigate.",
      overview: "A large catalogue should still be easy to use. This site connects product search, project references, and buyer enquiries, with an editor for the team.",
      challenge: "Industrial buyers need to find the right coating and understand its use without sifting through an unstructured product list.",
      approach: "The public site pairs searchable products with applications and project references. An editor lets the team maintain the catalogue and content.",
      role: "The Katalhys founder handled UI/UX, website development, the catalogue assistant integration, and deployment.",
      ai: {
        title: "A product assistant connected to the catalogue",
        body: "Buyers can describe their needs to FanosBot, which reads the published catalogue and helps prepare an enquiry. The visitor stays in control of the product selection and quotation details.",
        points: ["Searches products and retrieves their published technical details.", "Suggests relevant coatings; adding one to the basket requires confirmation.", "Prefills an editable enquiry from the conversation, with pricing left to the sales team."],
      },
      tags: ["Product catalogue", "Search", "Content editor", "AI integration"],
    },
    id_: {
      title: "Katalog Coating Industri", subtitle: "Katalog panjang tetap harus mudah dijelajahi.",
      overview: "Katalog yang panjang tidak boleh membuat pembeli tersesat. Situs ini menghubungkan pencarian produk, referensi proyek, dan pertanyaan pembeli; timnya dapat memperbarui isi lewat admin.",
      challenge: "Pembeli industri perlu menemukan coating yang tepat dan memahami penggunaannya tanpa menyisir daftar produk yang tidak terstruktur.",
      approach: "Situs publik menghubungkan pencarian produk dengan aplikasi dan referensi proyek. Editor memungkinkan tim memperbarui katalog serta konten.",
      role: "Pendiri Katalhys menangani UI/UX, pengembangan situs, integrasi asisten katalog, dan deployment.",
      ai: {
        title: "Asisten produk yang terhubung ke katalog",
        body: "Pembeli dapat menjelaskan kebutuhannya kepada FanosBot. Asisten membaca katalog yang diterbitkan dan membantu menyiapkan pertanyaan, sementara pilihan produk serta keterangan penawaran tetap di tangan pengunjung.",
        points: ["Mencari produk dan mengambil detail teknis yang sudah diterbitkan.", "Mengusulkan coating yang sesuai; memasukkannya ke keranjang tetap perlu persetujuan.", "Mengisi awal formulir dari percakapan agar bisa diperiksa dan diedit; harga ditangani tim sales."],
      },
      tags: ["Katalog produk", "Pencarian", "Editor konten", "Integrasi AI"],
    },
  },
  {
    id: "field-projects", order: 3, primaryService: "internal", serviceIds: ["internal", "design", "care"], featuredRank: 3, homeRank: 4, ...images("field-projects"),
    en: {
      title: "Field Project Monitoring", subtitle: "A project record from survey to handover.",
      overview: "Field projects can lose context between survey and handover. This system keeps zone progress, daily reports, approvals, and costs in one record.",
      challenge: "Site progress, attendance, reports, approvals, and budgets are often reviewed by different people at different times.",
      approach: "The application brings zone progress, daily field reports, review queues, and cost tracking into the same project view.",
      role: "The Katalhys founder worked on UI/UX, application development, AI owner briefs and report triage, and deployment.",
      ai: {
        title: "Field reports become a brief the owner can act on",
        body: "AI helps the owner see which decisions and follow-ups need attention. The application supplies the project facts; the owner and controller keep responsibility for decisions and approvals.",
        points: ["Builds an owner brief with decision priorities, contacts and draft follow-up messages.", "Explains risk signals on daily reports so the controller can choose what to review first.", "Answers follow-up questions using the facts captured for that brief."],
      },
      tags: ["Project progress", "Field reports", "UI/UX", "AI integration"],
    },
    id_: {
      title: "Pemantauan Proyek Lapangan", subtitle: "Satu catatan proyek dari survei sampai serah terima.",
      overview: "Proyek lapangan mudah kehilangan konteks antara survei dan serah terima. Sistem ini menyatukan progres per zona, laporan harian, persetujuan, dan biaya.",
      challenge: "Progres lapangan, absensi, laporan, persetujuan, dan anggaran sering ditinjau orang berbeda pada waktu berbeda.",
      approach: "Aplikasi menyatukan progres per zona, laporan harian, antrean review, dan pemantauan biaya dalam satu tampilan proyek.",
      role: "Pendiri Katalhys mengerjakan UI/UX, pengembangan aplikasi, integrasi AI untuk brief pemilik dan triase laporan, serta deployment.",
      ai: {
        title: "Laporan lapangan menjadi bahan keputusan",
        body: "AI membantu pemilik melihat keputusan dan tindak lanjut yang perlu diperhatikan. Aplikasi memasok fakta proyek; keputusan serta persetujuan tetap ditangani pemilik dan pengendali.",
        points: ["Menyusun brief pemilik berisi prioritas keputusan, kontak, dan draf pesan tindak lanjut.", "Menjelaskan sinyal risiko pada laporan harian agar pengendali dapat memilih laporan yang perlu ditinjau lebih dulu.", "Menjawab pertanyaan lanjutan dari fakta yang tersimpan pada brief tersebut."],
      },
      tags: ["Progres proyek", "Laporan lapangan", "UI/UX", "Integrasi AI"],
    },
  },
  {
    id: "expert-profile", order: 4, primaryService: "marketing", serviceIds: ["marketing", "design"], ...images("expert-profile"),
    en: {
      title: "Expert Profile & Collaboration Paths", subtitle: "A clear way to learn, connect, and collaborate.",
      overview: "Prospective partners should not have to hunt for a way in. This expert’s site brings their work, services, free resources, and contact path together.",
      challenge: "A personal platform has to serve different visitors: potential partners, learners, and people looking for expertise.",
      approach: "The site structures the profile, services, writing, free resources, and contact routes around each visitor's next question.",
      role: "The Katalhys founder designed and developed this website independently.",
      tags: ["Personal site", "Resources", "UI/UX"],
    },
    id_: {
      title: "Profil Ahli & Jalur Kolaborasi", subtitle: "Jalan yang jelas untuk mengenal dan menghubungi seorang ahli.",
      overview: "Calon mitra tak perlu mencari-cari jalan masuk. Situs seorang ahli ini menyatukan profil, layanan, materi gratis, dan kontak dalam satu alur.",
      challenge: "Platform personal perlu melayani calon mitra, pembelajar, dan orang yang mencari keahlian dengan kebutuhan berbeda.",
      approach: "Situs menata profil, layanan, tulisan, materi gratis, dan jalur kontak mengikuti pertanyaan berikutnya dari setiap pengunjung.",
      role: "Pendiri Katalhys merancang dan mengembangkan situs ini secara mandiri.",
      tags: ["Situs personal", "Materi gratis", "UI/UX"],
    },
  },
  {
    id: "maxy-ai", order: 5, primaryService: "marketing", serviceIds: ["marketing", "design"], homeRank: 2, ...images("maxy-ai"),
    en: {
      title: "MAXY AI Website", subtitle: "Make the offer clear before the first call.",
      overview: "AI and software services need to make sense before the first call. MAXY AI’s site gives each offer a clear page and a direct route to a conversation.",
      challenge: "Several AI and software offers need distinct explanations while still reading as one company.",
      approach: "The site gives solutions their own routes, supports discovery through navigation, and makes contacting the team straightforward.",
      role: "The Katalhys founder designed and built the site independently during his work at MAXY.",
      tags: ["Corporate site", "Service pages", "UI/UX"],
    },
    id_: {
      title: "Situs MAXY AI", subtitle: "Layanan jelas sebelum panggilan pertama.",
      overview: "Layanan AI dan software perlu dipahami sebelum panggilan pertama. Situs MAXY AI memberi tiap layanan ruang yang jelas dan jalur langsung untuk membicarakan kebutuhan bisnis.",
      challenge: "Beberapa layanan AI dan software memerlukan penjelasan tersendiri, tetapi tetap harus terasa sebagai satu perusahaan.",
      approach: "Situs memberi halaman khusus pada tiap solusi, membantu eksplorasi lewat navigasi, dan memudahkan pengunjung menghubungi tim.",
      role: "Pendiri Katalhys merancang dan membangun situs ini secara mandiri saat bekerja di MAXY.",
      tags: ["Situs perusahaan", "Halaman layanan", "UI/UX"],
    },
  },
  {
    id: "ai-ceo-circle", order: 6, primaryService: "marketing", serviceIds: ["marketing", "design"], ...images("ai-ceo-circle"),
    en: {
      title: "AI CEO Circle", subtitle: "Understand the program before applying.",
      overview: "Leaders need to understand a program before they apply. AI CEO Circle brings its program, articles, and two-step application into one experience.",
      challenge: "Executives need the program's scope, format, and application path in a form they can assess quickly.",
      approach: "A focused landing page explains the program, connects supporting articles, and guides applicants through a two-step form.",
      role: "The Katalhys founder designed and developed the landing experience during his work at MAXY.",
      tags: ["Program site", "Application flow", "UI/UX"],
    },
    id_: {
      title: "AI CEO Circle", subtitle: "Pahami programnya sebelum mendaftar.",
      overview: "Program eksekutif harus mudah dinilai sebelum orang mendaftar. AI CEO Circle menyatukan isi program, bacaan, dan aplikasi dua tahap dalam satu pengalaman.",
      challenge: "Eksekutif perlu melihat cakupan, format, dan alur pendaftaran program secara cepat sebelum mengambil keputusan.",
      approach: "Landing page menjelaskan program, menghubungkan artikel pendukung, dan memandu pendaftar melalui formulir dua tahap.",
      role: "Pendiri Katalhys merancang dan mengembangkan pengalaman ini saat bekerja di MAXY.",
      tags: ["Situs program", "Alur pendaftaran", "UI/UX"],
    },
  },
  {
    id: "activity-review", order: 7, primaryService: "internal", serviceIds: ["internal", "design", "care"], ...images("activity-review"),
    en: {
      title: "Work Activity Review", subtitle: "Read activity with the context it needs.",
      overview: "Activity data needs context. A Windows agent and web dashboard present summaries, timelines, and anomalies for human review.",
      challenge: "Raw activity logs are hard to interpret and can hide useful patterns behind long lists of events.",
      approach: "A Windows collector records limited activity metadata; the dashboard groups it into summaries, timelines, and anomalies for review.",
      role: "The Katalhys founder worked on system architecture, dashboard UI/UX, optional AI analysis, development, and deployment.",
      ai: {
        title: "Activity records get an explanation people can review",
        body: "When AI analysis is enabled, the owner can inspect a selected computer and time range through a short explanation grounded in its activity records. Findings remain material for human review.",
        points: ["Summarizes the selected period from hourly activity and application context.", "Links each finding to an hour in the underlying records.", "Marks ambiguous results for review instead of making a disciplinary decision."],
      },
      tags: ["Windows agent", "Dashboard", "Human review", "AI integration"],
    },
    id_: {
      title: "Tinjauan Aktivitas Kerja", subtitle: "Data aktivitas perlu konteks agar berguna.",
      overview: "Data aktivitas baru berguna saat bisa dibaca dalam konteks. Agen Windows dan dashboard menampilkan ringkasan, linimasa, serta anomali untuk ditinjau manusia.",
      challenge: "Log aktivitas mentah sulit ditafsirkan dan pola penting mudah tenggelam dalam daftar kejadian panjang.",
      approach: "Agen Windows mencatat metadata aktivitas terbatas; dashboard menyusunnya menjadi ringkasan, linimasa, dan anomali untuk ditinjau.",
      role: "Pendiri Katalhys mengerjakan arsitektur sistem, UI/UX dashboard, analisis AI opsional, pengembangan, dan deployment.",
      ai: {
        title: "Catatan aktivitas mendapat penjelasan yang bisa ditinjau",
        body: "Saat analisis AI diaktifkan, pemilik dapat memeriksa komputer dan rentang waktu tertentu melalui penjelasan singkat dari catatan aktivitasnya. Hasilnya menjadi bahan tinjauan manusia.",
        points: ["Merangkum rentang yang dipilih dari aktivitas per jam dan konteks aplikasi.", "Menghubungkan setiap temuan dengan jam pada catatan sumber.", "Menandai hasil yang belum jelas untuk diperiksa, tanpa membuat keputusan disipliner."],
      },
      tags: ["Agen Windows", "Dashboard", "Tinjauan manusia", "Integrasi AI"],
    },
  },
  {
    id: "operations-control", order: 8, primaryService: "care", serviceIds: ["care"], homeRank: 5, ...images("operations-control"),
    imageNote: { en: "Sanitized architecture diagram based on the deployment repository. Komodo dashboard capture pending access.", id_: "Diagram arsitektur yang disamarkan berdasarkan repo deployment. Tangkapan dashboard Komodo menunggu akses." },
    en: {
      title: "Deployment & Operations Control", subtitle: "A release path the team can inspect.",
      overview: "Three applications need a release path the team can inspect. Shared infrastructure brings deployment, site routing, error monitoring, and backups together.",
      challenge: "Separate applications need a predictable way to release changes, route traffic, and recover from failures.",
      approach: "Shared deployment controls connect stack updates, site routing, error monitoring, and backup routines across three applications.",
      role: "The Katalhys founder designed and operated the deployment setup.",
      tags: ["Deployment", "Monitoring", "Backups"],
    },
    id_: {
      title: "Kendali Deploy & Operasional", subtitle: "Jalur rilis yang bisa diawasi tim.",
      overview: "Tiga aplikasi perlu jalur rilis yang bisa diawasi. Infrastruktur bersama ini mengatur deploy, lalu lintas situs, pemantauan galat, dan backup.",
      challenge: "Aplikasi terpisah memerlukan cara yang konsisten untuk merilis perubahan, mengarahkan trafik, dan pulih dari gangguan.",
      approach: "Kendali deploy bersama menghubungkan pembaruan stack, routing situs, pemantauan galat, dan rutinitas backup untuk tiga aplikasi.",
      role: "Pendiri Katalhys merancang dan mengoperasikan susunan deployment ini.",
      tags: ["Deployment", "Monitoring", "Backup"],
    },
  },
];
