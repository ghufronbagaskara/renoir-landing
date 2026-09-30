export interface WorkFeatureCopy { title: string; body: string; caption: string }
export interface WorkFeature {
  image?: string;
  en: WorkFeatureCopy;
  id_: WorkFeatureCopy;
}

const image = (project: string, screen: string) => `work/${project}/${screen}.webp`;

export const workFeatures: Record<string, WorkFeature[]> = {
  "order-sales": [
    {
      image: image("order-sales", "order-detail"),
      en: { title: "One order, ten accountable steps", body: "A sales order moves from the warehouse through delivery and administration to finance. Its detail page keeps the active stage, assigned person, deadline, and transition history together, so the next handoff is visible to everyone with access.", caption: "Order detail and its stage history in the demo environment." },
      id_: { title: "Satu pesanan, sepuluh tahap yang jelas", body: "Pesanan bergerak dari gudang, pengiriman, dan administrasi hingga keuangan. Halaman detail menyatukan tahap aktif, penanggung jawab, tenggat, serta riwayat perpindahan sehingga tim yang berwenang tahu pekerjaan berikutnya.", caption: "Detail pesanan dan riwayat tahap pada lingkungan demo." },
    },
    {
      image: image("order-sales", "receivables"),
      en: { title: "Deadlines and payments stay in view", body: "The operational dashboard and reports surface overdue stages, due dates, outstanding balances, and partial payments. Finance can follow a payment through verification before the order advances to tax processing.", caption: "Operational report with deadlines and receivables from demo records." },
      id_: { title: "Tenggat dan pembayaran tetap terlihat", body: "Dashboard dan laporan menandai tahap yang terlambat, tanggal jatuh tempo, piutang, serta pembayaran sebagian. Keuangan dapat memeriksa pembayaran sampai terverifikasi sebelum pesanan berlanjut ke tahap pajak.", caption: "Laporan tenggat dan piutang dari data contoh." },
    },
    {
      image: image("order-sales", "sales-mobile"),
      en: { title: "Field sales has its own working view", body: "The sales area covers visits, prospects, quotations, and follow-up tasks. Its mobile view gives the team a practical way to check what needs attention while working outside the office.", caption: "Field sales activity viewed at phone width." },
      id_: { title: "Sales lapangan punya ruang kerjanya sendiri", body: "Modul sales memuat kunjungan, prospek, penawaran, dan tindak lanjut. Tampilan ponselnya membantu tim memeriksa pekerjaan yang perlu ditangani saat berada di luar kantor.", caption: "Aktivitas sales lapangan pada lebar layar ponsel." },
    },
  ],
  "industrial-coatings": [
    {
      image: image("industrial-coatings", "catalogue"),
      en: { title: "Start with the application, then inspect the product", body: "Buyers can browse coating categories, search by name or use, and open a product page for specifications and available documents. That gives a technical enquiry a more useful starting point than a flat list of names.", caption: "Product catalogue with category and search routes." },
      id_: { title: "Mulai dari kebutuhan, lalu periksa produknya", body: "Pembeli dapat menjelajahi kategori coating, mencari berdasarkan nama atau kegunaan, lalu membuka detail spesifikasi dan dokumen produk yang tersedia. Pertanyaan teknis pun dimulai dari informasi yang lebih jelas daripada daftar nama semata.", caption: "Katalog produk dengan jalur kategori dan pencarian." },
    },
    {
      image: image("industrial-coatings", "product"),
      en: { title: "A product page connects research to an enquiry", body: "Each page gives the coating its own description and technical context, with a route into the quotation basket. Visitors can collect the products they want to discuss instead of losing the selection while moving through the catalogue.", caption: "A real product page and its quotation action." },
      id_: { title: "Detail produk tersambung ke permintaan penawaran", body: "Setiap produk memiliki penjelasan dan konteks teknis sendiri, serta jalur menuju keranjang penawaran. Pengunjung dapat mengumpulkan produk yang ingin ditanyakan tanpa kehilangan pilihannya saat menjelajahi katalog.", caption: "Halaman produk asli dan tindakan menuju penawaran." },
    },
    {
      image: image("industrial-coatings", "chat"),
      en: { title: "The assistant works from the catalogue", body: "FanosBot can search published products, read their details, and suggest relevant items. A suggested product enters the basket only after the visitor confirms it. Details the visitor has already given can prefill an editable quotation form; the assistant does not set prices.", caption: "Product assistant panel; any product suggestion requires visitor confirmation." },
      id_: { title: "Asisten membaca katalog yang diterbitkan", body: "FanosBot dapat mencari produk, membaca detailnya, dan menawarkan pilihan yang sesuai. Produk baru masuk keranjang setelah pengunjung menyetujuinya. Keterangan proyek yang sudah diberikan dapat mengisi formulir penawaran yang tetap bisa diedit; asisten tidak menentukan harga.", caption: "Panel asisten produk; usulan produk tetap perlu persetujuan pengunjung." },
    },
    {
      image: image("industrial-coatings", "quote"),
      en: { title: "The basket asks about the project", body: "The visitor's product selection stays in the basket while the form collects contact details, location, area, building type, and floor conditions. These details help sales start from a specific need.", caption: "Selected coating and project qualification fields in the quotation basket." },
      id_: { title: "Keranjang menampung kebutuhan proyek", body: "Pilihan produk tetap tersimpan saat formulir meminta kontak, lokasi, luas, jenis bangunan, dan kondisi lantai. Keterangan ini membantu sales memulai percakapan dari kebutuhan yang spesifik.", caption: "Coating yang dipilih dan kolom kebutuhan proyek pada keranjang penawaran." },
    },
    {
      image: image("industrial-coatings", "quote-submit"),
      en: { title: "The enquiry arrives with its context", body: "The send action opens WhatsApp with the chosen products and entered answers already written. A lead record keeps a follow-up trail, and the team can maintain the catalogue and leads from its editor.", caption: "WhatsApp handoff from the quotation form; fields are empty in this screen." },
      id_: { title: "Pertanyaan diteruskan bersama konteksnya", body: "Tombol kirim membuka WhatsApp dengan produk pilihan dan jawaban formulir yang sudah tertulis. Catatan lead membantu tindak lanjut, sementara tim dapat mengelola katalog serta lead melalui editor.", caption: "Jalur WhatsApp dari formulir penawaran; kolom pada layar ini masih kosong." },
    },
  ],
  "field-projects": [
    {
      image: image("field-projects", "project-detail"),
      en: { title: "Progress has a place and a stage", body: "After a survey, the controller sets project zones, stage targets, and the team. The detail view shows progress against those targets, so a status update refers to a specific area and part of the work rather than an unsupported percentage.", caption: "Project detail with stage and zone progress from demo data." },
      id_: { title: "Progres punya lokasi dan tahap", body: "Sesudah survei, pengendali menetapkan zona, target tiap tahap, dan tim. Detail proyek menunjukkan kemajuan terhadap target itu sehingga pembaruan status merujuk pada area dan pekerjaan tertentu, bukan persentase tanpa konteks.", caption: "Detail proyek dengan progres tahap dan zona dari data contoh." },
    },
    {
      image: image("field-projects", "daily-mobile"),
      en: { title: "Field reports record the day as it happened", body: "The field team can submit daily progress, material use, work logs, and photos from a phone. Those records connect the site to the project history that controllers review later.", caption: "Daily reporting interface at phone width." },
      id_: { title: "Laporan harian mencatat pekerjaan di lapangan", body: "Tim pelaksana dapat mengisi progres, penggunaan material, catatan kerja, dan foto melalui ponsel. Catatan tersebut masuk ke riwayat proyek untuk ditinjau pengendali.", caption: "Antarmuka laporan harian pada lebar layar ponsel." },
    },
    {
      image: image("field-projects", "review"),
      en: { title: "Reviews connect evidence to decisions", body: "Controllers review submitted reports and approvals before using them in project summaries and cost checks. The same record follows the job from site work toward handover.", caption: "Review queue for submitted field records." },
      id_: { title: "Review menghubungkan bukti dan keputusan", body: "Pengendali meninjau laporan dan persetujuan sebelum memakainya dalam rekap proyek serta pemeriksaan biaya. Riwayat yang sama mengikuti pekerjaan hingga serah terima.", caption: "Antrean review untuk catatan lapangan yang dikirim." },
    },
  ],
  "expert-profile": [
    {
      image: image("expert-profile", "resources"),
      en: { title: "Visitors can find a useful next step", body: "Services and writing establish the areas Isaac works in. The free resources offer a more immediate entry point for people who want to learn before starting a collaboration conversation.", caption: "Resource section on the public site." },
      id_: { title: "Pengunjung menemukan langkah berikutnya", body: "Layanan dan tulisan menjelaskan bidang kerja Isaac. Materi gratis memberi jalan masuk bagi pembaca yang ingin belajar sebelum memulai percakapan kerja sama.", caption: "Bagian materi gratis pada situs publik." },
    },
    {
      image: image("expert-profile", "resource-modal"),
      en: { title: "A resource request has a clear exchange", body: "The resource form asks for a name, email, and WhatsApp contact, then starts the download after a successful request. The contact route remains available for visitors who are ready to discuss work directly.", caption: "Real resource request dialog, shown with empty fields." },
      id_: { title: "Permintaan materi punya alur yang jelas", body: "Formulir materi meminta nama, email, dan kontak WhatsApp, lalu memulai unduhan setelah permintaan berhasil. Jalur kontak tetap tersedia bagi pengunjung yang sudah siap membicarakan pekerjaan.", caption: "Dialog permintaan materi asli dengan kolom kosong." },
    },
  ],
  "maxy-ai": [
    {
      image: image("maxy-ai", "agentic"),
      en: { title: "AI services get their own explanation", body: "The agentic AI page sets out the offer, process, and common questions in one place. Visitors can assess whether that service fits their situation before booking a conversation.", caption: "Dedicated agentic AI service page." },
      id_: { title: "Layanan AI mendapat penjelasan tersendiri", body: "Halaman agentic AI menjabarkan penawaran, proses, dan pertanyaan umum dalam satu tempat. Pengunjung dapat menilai kecocokannya sebelum menghubungi tim.", caption: "Halaman khusus layanan agentic AI." },
    },
    {
      image: image("maxy-ai", "web-app"),
      en: { title: "Software work has a separate route", body: "Web and app development has its own page while sharing navigation and visual language with the AI and growth offers. The structure keeps distinct services connected to one company and one contact path.", caption: "Web and app development service page." },
      id_: { title: "Pekerjaan software punya jalur sendiri", body: "Pengembangan web dan aplikasi memiliki halaman tersendiri, tetapi tetap berbagi navigasi dan bahasa visual dengan layanan AI serta growth. Struktur ini menghubungkan penawaran yang berbeda ke satu perusahaan dan jalur kontak.", caption: "Halaman layanan pengembangan web dan aplikasi." },
    },
  ],
  "ai-ceo-circle": [
    {
      image: image("ai-ceo-circle", "program"),
      en: { title: "The program can be assessed before applying", body: "The page explains the program's format and intended audience before asking for contact details. Supporting articles give readers another way to understand its point of view.", caption: "Program section and route toward application." },
      id_: { title: "Program dapat dinilai sebelum mendaftar", body: "Halaman menjelaskan format program dan siapa yang dituju sebelum meminta data kontak. Artikel pendukung memberi pembaca cara lain untuk memahami sudut pandangnya.", caption: "Bagian program dan jalur menuju pendaftaran." },
    },
    {
      image: image("ai-ceo-circle", "application"),
      en: { title: "The application is split into two steps", body: "Applicants first provide basic contact and company details. A second step asks about leadership context and commitment, with a route to submit early when they cannot complete the longer questions at once.", caption: "Application form with empty fields; no applicant data is shown." },
      id_: { title: "Pendaftaran dibagi menjadi dua langkah", body: "Pendaftar mengisi kontak dan perusahaan lebih dulu. Langkah kedua menanyakan konteks kepemimpinan dan komitmen, dengan pilihan mengirim lebih awal saat belum dapat menjawab pertanyaan panjang.", caption: "Formulir kosong tanpa data pendaftar." },
    },
  ],
  "activity-review": [
    {
      image: image("activity-review", "timeline"),
      en: { title: "A timeline makes raw events readable", body: "The Windows agent sends active app and idle-time metadata, without employee screenshots. The dashboard groups those events by hour and application, giving a reviewer context around a working day.", caption: "Employee timeline using isolated demo records." },
      id_: { title: "Linimasa membuat data mentah terbaca", body: "Agen Windows mengirim metadata aplikasi aktif dan waktu idle, tanpa screenshot layar karyawan. Dashboard mengelompokkan kejadian menurut jam dan aplikasi agar peninjau dapat membaca konteks satu hari kerja.", caption: "Linimasa karyawan dari data demo terpisah." },
    },
    {
      image: image("activity-review", "anomalies"),
      en: { title: "A flag starts a review, not a verdict", body: "Rules and optional analysis can surface unusual periods. The anomalies queue lets an owner inspect the underlying activity, mark the finding, and record a review note rather than treating a signal as a final judgment.", caption: "Anomaly review queue with demo data." },
      id_: { title: "Penanda memulai pemeriksaan, bukan vonis", body: "Aturan dan analisis opsional dapat menandai periode yang tidak biasa. Antrean anomali memungkinkan pemilik memeriksa aktivitasnya, menetapkan hasil tinjauan, dan menulis catatan sebelum mengambil kesimpulan.", caption: "Antrean tinjauan anomali dengan data demo." },
    },
  ],
  "operations-control": [
    {
      en: { title: "One controlled route into three applications", body: "A shared edge routes traffic to Fanos, Proteksindo, and Fanos Monitor. Komodo manages stack releases, while error monitoring and scheduled backups provide operational records. The public diagram omits hostnames and access details.", caption: "Simplified architecture; live Komodo capture awaits access." },
      id_: { title: "Satu jalur terkendali untuk tiga aplikasi", body: "Lapisan routing bersama mengarahkan trafik ke Fanos, Proteksindo, dan Fanos Monitor. Komodo mengelola rilis stack, sedangkan pemantauan galat dan backup terjadwal memberi catatan operasional. Diagram publik tidak memuat hostname dan detail akses.", caption: "Arsitektur ringkas; tangkapan Komodo menunggu akses." },
    },
  ],
};
