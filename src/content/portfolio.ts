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
      role: "The Renoir founder worked on the interface, application development, and deployment.",
      tags: ["Order tracking", "Field sales", "UI/UX"],
    },
    id_: {
      title: "Alur Pesanan & Sales Lapangan", subtitle: "Pesanan berpindah tangan; informasinya tidak boleh ikut hilang.",
      overview: "Pesanan berpindah tangan; informasinya tidak boleh ikut hilang. Sistem ini menunjukkan tahap, penanggung jawab, tenggat, pembayaran, dan aktivitas sales lapangan.",
      challenge: "Pesanan manufaktur melewati gudang, pengiriman, administrasi, dan keuangan. Tim perlu tahu posisi setiap pesanan dan siapa yang menangani tahap berikutnya.",
      approach: "Jejak sepuluh tahap, dashboard operasional, penanda keterlambatan, dan layar sales lapangan menghubungkan pekerjaan kantor dan lapangan.",
      role: "Pendiri Renoir mengerjakan antarmuka, pengembangan aplikasi, dan deployment.",
      tags: ["Pelacakan pesanan", "Sales lapangan", "UI/UX"],
    },
  },
  {
    id: "industrial-coatings", order: 2, primaryService: "marketing", serviceIds: ["marketing", "design", "care"], featuredRank: 2, homeRank: 3, ...images("industrial-coatings"),
    en: {
      title: "Industrial Coatings Catalogue", subtitle: "A product range buyers can actually navigate.",
      overview: "A large catalogue should still be easy to use. This site connects product search, project references, and buyer enquiries, with an editor for the team.",
      challenge: "Industrial buyers need to find the right coating and understand its use without sifting through an unstructured product list.",
      approach: "The public site pairs searchable products with applications and project references. An editor lets the team maintain the catalogue and content.",
      role: "The Renoir founder handled UI/UX, website development, and deployment.",
      tags: ["Product catalogue", "Search", "Content editor"],
    },
    id_: {
      title: "Katalog Coating Industri", subtitle: "Katalog panjang tetap harus mudah dijelajahi.",
      overview: "Katalog yang panjang tidak boleh membuat pembeli tersesat. Situs ini menghubungkan pencarian produk, referensi proyek, dan pertanyaan pembeli; timnya dapat memperbarui isi lewat admin.",
      challenge: "Pembeli industri perlu menemukan coating yang tepat dan memahami penggunaannya tanpa menyisir daftar produk yang tidak terstruktur.",
      approach: "Situs publik menghubungkan pencarian produk dengan aplikasi dan referensi proyek. Editor memungkinkan tim memperbarui katalog serta konten.",
      role: "Pendiri Renoir menangani UI/UX, pengembangan situs, dan deployment.",
      tags: ["Katalog produk", "Pencarian", "Editor konten"],
    },
  },
  {
    id: "field-projects", order: 3, primaryService: "internal", serviceIds: ["internal", "design", "care"], featuredRank: 3, ...images("field-projects"),
    en: {
      title: "Field Project Monitoring", subtitle: "A project record from survey to handover.",
      overview: "Field projects can lose context between survey and handover. This system keeps zone progress, daily reports, approvals, and costs in one record.",
      challenge: "Site progress, attendance, reports, approvals, and budgets are often reviewed by different people at different times.",
      approach: "The application brings zone progress, daily field reports, review queues, and cost tracking into the same project view.",
      role: "The Renoir founder worked on UI/UX, application development, and deployment.",
      tags: ["Project progress", "Field reports", "UI/UX"],
    },
    id_: {
      title: "Pemantauan Proyek Lapangan", subtitle: "Satu catatan proyek dari survei sampai serah terima.",
      overview: "Proyek lapangan mudah kehilangan konteks antara survei dan serah terima. Sistem ini menyatukan progres per zona, laporan harian, persetujuan, dan biaya.",
      challenge: "Progres lapangan, absensi, laporan, persetujuan, dan anggaran sering ditinjau orang berbeda pada waktu berbeda.",
      approach: "Aplikasi menyatukan progres per zona, laporan harian, antrean review, dan pemantauan biaya dalam satu tampilan proyek.",
      role: "Pendiri Renoir mengerjakan UI/UX, pengembangan aplikasi, dan deployment.",
      tags: ["Progres proyek", "Laporan lapangan", "UI/UX"],
    },
  },
  {
    id: "expert-profile", order: 4, primaryService: "marketing", serviceIds: ["marketing", "design"], ...images("expert-profile"),
    en: {
      title: "Expert Profile & Collaboration Paths", subtitle: "A clear way to learn, connect, and collaborate.",
      overview: "Prospective partners should not have to hunt for a way in. Isaac Munandar’s site brings his work, services, free resources, and contact path together.",
      challenge: "A personal platform has to serve different visitors: potential partners, learners, and people looking for expertise.",
      approach: "The site structures the profile, services, writing, free resources, and contact routes around each visitor's next question.",
      role: "The Renoir founder designed and developed this website independently.",
      tags: ["Personal site", "Resources", "UI/UX"],
    },
    id_: {
      title: "Profil Ahli & Jalur Kolaborasi", subtitle: "Jalan yang jelas untuk mengenal dan menghubungi seorang ahli.",
      overview: "Calon mitra tak perlu mencari-cari jalan masuk. Situs Isaac Munandar menyatukan profil, layanan, materi gratis, dan kontak dalam satu alur.",
      challenge: "Platform personal perlu melayani calon mitra, pembelajar, dan orang yang mencari keahlian dengan kebutuhan berbeda.",
      approach: "Situs menata profil, layanan, tulisan, materi gratis, dan jalur kontak mengikuti pertanyaan berikutnya dari setiap pengunjung.",
      role: "Pendiri Renoir merancang dan mengembangkan situs ini secara mandiri.",
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
      role: "The Renoir founder designed and built the site independently during his work at MAXY.",
      tags: ["Corporate site", "Service pages", "UI/UX"],
    },
    id_: {
      title: "Situs MAXY AI", subtitle: "Layanan jelas sebelum panggilan pertama.",
      overview: "Layanan AI dan software perlu dipahami sebelum panggilan pertama. Situs MAXY AI memberi tiap layanan ruang yang jelas dan jalur langsung untuk membicarakan kebutuhan bisnis.",
      challenge: "Beberapa layanan AI dan software memerlukan penjelasan tersendiri, tetapi tetap harus terasa sebagai satu perusahaan.",
      approach: "Situs memberi halaman khusus pada tiap solusi, membantu eksplorasi lewat navigasi, dan memudahkan pengunjung menghubungi tim.",
      role: "Pendiri Renoir merancang dan membangun situs ini secara mandiri saat bekerja di MAXY.",
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
      role: "The Renoir founder designed and developed the landing experience during his work at MAXY.",
      tags: ["Program site", "Application flow", "UI/UX"],
    },
    id_: {
      title: "AI CEO Circle", subtitle: "Pahami programnya sebelum mendaftar.",
      overview: "Program eksekutif harus mudah dinilai sebelum orang mendaftar. AI CEO Circle menyatukan isi program, bacaan, dan aplikasi dua tahap dalam satu pengalaman.",
      challenge: "Eksekutif perlu melihat cakupan, format, dan alur pendaftaran program secara cepat sebelum mengambil keputusan.",
      approach: "Landing page menjelaskan program, menghubungkan artikel pendukung, dan memandu pendaftar melalui formulir dua tahap.",
      role: "Pendiri Renoir merancang dan mengembangkan pengalaman ini saat bekerja di MAXY.",
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
      role: "The Renoir founder worked on system architecture, dashboard UI/UX, development, and deployment.",
      tags: ["Windows agent", "Dashboard", "Human review"],
    },
    id_: {
      title: "Tinjauan Aktivitas Kerja", subtitle: "Data aktivitas perlu konteks agar berguna.",
      overview: "Data aktivitas baru berguna saat bisa dibaca dalam konteks. Agen Windows dan dashboard menampilkan ringkasan, linimasa, serta anomali untuk ditinjau manusia.",
      challenge: "Log aktivitas mentah sulit ditafsirkan dan pola penting mudah tenggelam dalam daftar kejadian panjang.",
      approach: "Agen Windows mencatat metadata aktivitas terbatas; dashboard menyusunnya menjadi ringkasan, linimasa, dan anomali untuk ditinjau.",
      role: "Pendiri Renoir mengerjakan arsitektur sistem, UI/UX dashboard, pengembangan, dan deployment.",
      tags: ["Agen Windows", "Dashboard", "Tinjauan manusia"],
    },
  },
  {
    id: "operations-control", order: 8, primaryService: "care", serviceIds: ["care"], homeRank: 4, ...images("operations-control"),
    imageNote: { en: "Sanitized architecture diagram based on the deployment repository. Komodo dashboard capture pending access.", id_: "Diagram arsitektur yang disamarkan berdasarkan repo deployment. Tangkapan dashboard Komodo menunggu akses." },
    en: {
      title: "Deployment & Operations Control", subtitle: "A release path the team can inspect.",
      overview: "Three applications need a release path the team can inspect. Shared infrastructure brings deployment, site routing, error monitoring, and backups together.",
      challenge: "Separate applications need a predictable way to release changes, route traffic, and recover from failures.",
      approach: "Shared deployment controls connect stack updates, site routing, error monitoring, and backup routines across three applications.",
      role: "The Renoir founder designed and operated the deployment setup.",
      tags: ["Deployment", "Monitoring", "Backups"],
    },
    id_: {
      title: "Kendali Deploy & Operasional", subtitle: "Jalur rilis yang bisa diawasi tim.",
      overview: "Tiga aplikasi perlu jalur rilis yang bisa diawasi. Infrastruktur bersama ini mengatur deploy, lalu lintas situs, pemantauan galat, dan backup.",
      challenge: "Aplikasi terpisah memerlukan cara yang konsisten untuk merilis perubahan, mengarahkan trafik, dan pulih dari gangguan.",
      approach: "Kendali deploy bersama menghubungkan pembaruan stack, routing situs, pemantauan galat, dan rutinitas backup untuk tiga aplikasi.",
      role: "Pendiri Renoir merancang dan mengoperasikan susunan deployment ini.",
      tags: ["Deployment", "Monitoring", "Backup"],
    },
  },
];
