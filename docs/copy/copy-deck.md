# Renoir — Website Copy Deck (EN + ID)

**Status:** archived draft v1. Current implemented copy is in `src/i18n/en.ts`, `src/i18n/id.ts`, and `src/content/services.ts`; this deck contains superseded hero, footer, Team, and Work proposals. See the 21 September update in `docs/renoir-run.md` before reusing any passage.
**How to review:** edit the text directly in this file (or leave notes as `> NOTE:`). Items marked **[CONFIRM]** need your answer. Once approved, this deck is wired into the site word for word.

### Rules applied
- Nothing invented: no clients, awards, numbers, testimonials, prices, team size (brief §0, §10).
- No exclamation marks, superlatives, hype verbs, banned vocabulary — in both languages.
- Indonesian is **transcreated**: same intent and hook as English, written to read natively, not translated word for word. Direct *Anda*, short sentences, business-natural tone.
- Every page ends in a call to action. Primary CTA: **Start a project / Mulai proyek**.
- Out of scope (unchanged copy): Work/Portfolio items, Team members, all images and the logo.

---

## 0. Global

| Element | EN | ID |
|---|---|---|
| Nav | Services · Process · Work · About ▾ (About Renoir, Team) · Notes | Layanan · Proses · Karya · Tentang ▾ (Tentang Renoir, Tim) · Catatan |
| Header CTA | Start a project | Mulai proyek |
| Language switch | EN / ID | EN / ID |
| Search placeholder | Search the site | Cari di situs ini |
| Search — no results | No results for “{term}”. | Tidak ada hasil untuk “{term}”. |
| Breadcrumb home | Home | Beranda |

**Offcanvas panel**
- Title: **Renoir** · *ren-WAHR*
- EN: Renoir is a digital studio. We design and build custom web systems and marketing sites from scratch, and configure and maintain the infrastructure they run on. One team handles design, engineering, and deployment — so you get a working result, not a handover.
- ID: Renoir adalah studio digital. Kami merancang dan membangun sistem web serta situs marketing dari nol, lalu mengonfigurasi dan merawat infrastrukturnya. Satu tim mengerjakan desain, engineering, dan deployment — jadi yang Anda terima adalah hasil yang berjalan, bukan sekadar serah terima file.
- Headings: Get in touch / Hubungi kami · Follow / Ikuti kami
- Contact (dummy, `src/data/site.ts`): hello@renoir.run · +62 800 0000 0000 · Indonesia — working remotely worldwide / Indonesia — bekerja remote ke seluruh dunia

**Closing CTA (footer, every page)**
- EN headline: **Tell us** *what's broken.*
- ID headline: **Ceritakan** *apa yang bermasalah.*
  - Alternatives EN: “What isn't working?” · “Start with the problem.”
  - Alternatives ID: “Apa yang tidak berjalan?” · “Mulai dari masalahnya.”
- EN body: Most projects start with a fifteen-minute conversation about what isn't working. No deck, no pitch. If we're not the right fit, we'll say so and point you somewhere better.
- ID body: Kebanyakan proyek dimulai dari obrolan lima belas menit tentang apa yang tidak berjalan. Tanpa presentasi, tanpa jualan. Kalau kami bukan pilihan yang tepat, kami akan bilang dan menunjukkan arah yang lebih cocok.
- Rotating circle: START A PROJECT · START A PROJECT · / MULAI PROYEK · MULAI PROYEK ·
- Footer tagline under logo — EN: Renoir designs, builds, and runs custom web systems and marketing sites. · ID: Renoir merancang, membangun, dan menjalankan sistem web serta situs marketing custom.
- Footer columns — EN: Studio (Services, Process, Work, About) · More (Notes, Team, Start a project) · Contact · ID: Studio (Layanan, Proses, Karya, Tentang) · Lainnya (Catatan, Tim, Mulai proyek) · Kontak
- Copyright: © 2026 Renoir. All rights reserved. / © 2026 Renoir. Hak cipta dilindungi.

**404**
- EN: **This page doesn't exist.** The link may be old, or the page moved. · Button: Back to home
- ID: **Halaman ini tidak ada.** Tautannya mungkin sudah lama, atau halamannya sudah dipindah. · Button: Kembali ke beranda

---

## 1. Home

**Meta**
- EN title: Renoir — Built to work. Made to be seen.
- EN description: Renoir is a digital studio that designs, builds, and runs custom web systems and marketing sites — written from scratch, delivered running.
- ID title: Renoir — Studio digital untuk website dan sistem web custom
- ID description: Renoir merancang, membangun, dan menjalankan sistem web dan situs marketing custom — ditulis dari nol, diserahkan dalam keadaan berjalan.

### 1.1 Hero
- Small line: **Renoir** · ren-WAHR
- **EN H1:** Built to work. Made to be seen.
  - Alt A: Websites and systems that keep working after launch. — more literal, stronger for search intent
  - Alt B: Your website should win clients, not just exist. — sharper pain hook
- **ID H1:** Dibangun untuk bekerja. Dirancang untuk dilihat.
  - Alt A: Website dan sistem yang tetap bekerja setelah diluncurkan.
  - Alt B: Website Anda harus mendatangkan klien, bukan sekadar ada.
  - *Why:* “Dirancang” (designed) keeps the craft meaning of “made”; the two halves keep the same rhythm as English.
- **EN sub:** Renoir is a digital studio. We design and build custom web systems and marketing sites from scratch — and run the infrastructure they live on, so what we hand over keeps working.
- **ID sub:** Renoir adalah studio digital. Kami merancang dan membangun sistem web serta situs marketing dari nol — dan menjalankan infrastrukturnya, supaya yang kami serahkan tetap bekerja.
- CTAs: **Start a project** · See our work → / **Mulai proyek** · Lihat karya kami →

### 1.2 The problem *(was: About company / 2008–Present / 300+ clients)*
- Label: The problem / Masalahnya
- **EN H2:** Most websites are bought, not built.
- **ID H2:** Kebanyakan website dibeli, bukan dibangun.
- Big side statement (was “2008 – Present”): EN: *Three ways it goes wrong.* · ID: *Tiga cara proyek web gagal.*
- Card (was 3.2M / 300+ Happy Clients):
  - EN title: One team. Design to server.
  - EN body: A theme with your logo on it. Files handed over, then silence. Three vendors and no one who owns the result. Renoir exists to fix all three.
  - ID title: Satu tim. Dari desain sampai server.
  - ID body: Tema dengan logo Anda. File diserahkan, lalu vendor menghilang. Tiga vendor, tapi tidak ada yang bertanggung jawab atas hasilnya. Renoir ada untuk menyelesaikan ketiganya.

### 1.3 What we build strip *(was: client logos)*
EN: Marketing sites · Landing pages · Internal systems · Operational dashboards · Order & document tracking · Deployment & care
ID: Situs marketing · Landing page · Sistem internal · Dashboard operasional · Pelacakan order & dokumen · Deployment & perawatan

### 1.4 What we do *(service hover list)*
- Label: What we do / Layanan kami
- **EN H2:** One studio, from design to server.
- **ID H2:** Satu studio, dari desain sampai server.
- EN body: Three services. Everything we take on fits one of them. If your project doesn't, we'll tell you early.
- ID body: Tiga layanan. Semua pekerjaan kami masuk ke salah satunya. Kalau proyek Anda tidak cocok, kami sampaikan sejak awal.
- Button: See all services / Lihat semua layanan
- Items: Marketing & landing sites · Custom internal systems · Deployment & care / Situs marketing & landing page · Sistem internal custom · Deployment & perawatan

### 1.5 Work *(slider — items unchanged)*
- Label: Selected work / Karya pilihan
- EN H2: Work, not mockups. · ID H2: Karya nyata, bukan mockup.
  - **[CONFIRM]** This headline only stays true once real projects replace the template items. Safer interim: “Recent work / Karya terbaru”.

### 1.6 How it goes *(was 3 steps → 4)*
- Label: How it goes / Cara kami bekerja
- **EN H2:** Four stages. No month of silence.
- **ID H2:** Empat tahap. Tanpa berbulan-bulan tanpa kabar.

| # | EN | ID |
|---|---|---|
| 01 | **Scope** — We start with the business problem, not the technology. You get a written scope and a fixed price for it. | **Scope** — Kami mulai dari masalah bisnis, bukan teknologinya. Anda menerima scope tertulis dan harga tetap untuk scope itu. |
| 02 | **Design** — Structure first, surface second. You approve the design before any production code exists. | **Desain** — Struktur dulu, tampilan kemudian. Anda menyetujui desain sebelum kode produksi ditulis. |
| 03 | **Build** — Written from scratch against the approved design, on a live staging URL you can check the whole way. | **Build** — Ditulis dari nol sesuai desain yang disetujui, di URL staging yang bisa Anda cek kapan saja. |
| 04 | **Deploy & care** — Infrastructure configured, monitoring on, documentation handed over. We keep it running, or you take it. | **Deploy & perawatan** — Infrastruktur dikonfigurasi, monitoring aktif, dokumentasi diserahkan. Kami yang menjaganya, atau Anda ambil alih. |

### 1.7 How engagements work *(was pricing $99/$119/$139)*
- Label: How engagements work / Cara kerja sama
- **EN H2:** Fixed price. Agreed before we start.
- **ID H2:** Harga tetap. Disepakati sebelum mulai.

**Card 1 — Marketing site / Situs marketing**
- EN: For companies whose website is the first thing a prospect judges them by.
- ID: Untuk perusahaan yang pertama kali dinilai calon klien lewat website-nya.
- EN list: Written from scratch · Performance targets agreed up front · Technical SEO, readable to AI search · Structured data and sitemaps · Handed over running
- ID list: Ditulis dari nol · Target performa disepakati di awal · SEO teknis, terbaca oleh AI search · Structured data dan sitemap · Diserahkan dalam keadaan berjalan
- Price line: Fixed price per scope · usually two to four weeks / Harga tetap per scope · umumnya dua sampai empat minggu
- CTA: Scope my website / Diskusikan website saya

**Card 2 — Internal system / Sistem internal**
- EN: For operations running on spreadsheets, chat threads, and paper.
- ID: Untuk operasional yang masih berjalan di spreadsheet, grup chat, dan kertas.
- EN list: Built around how you actually work · Order and document tracking · Dashboards and monitoring · Approval workflows · Integrations between your systems
- ID list: Dibangun sesuai cara kerja Anda · Pelacakan order dan dokumen · Dashboard dan monitoring · Alur persetujuan · Integrasi antar sistem yang Anda pakai
- Price line: Fixed price per scope · timeline in the written scope / Harga tetap per scope · timeline tertulis di scope
- CTA: Scope my system / Diskusikan sistem saya

**Card 3 — Deployment & care / Deployment & perawatan** · badge: Included in every build / Termasuk di setiap proyek
- EN: For every client, by default.
- ID: Untuk setiap klien, tanpa perlu diminta.
- EN list: Servers and deployment pipeline · Monitoring and backups · Domain and SSL · Documentation and walkthrough · Optional monthly care retainer
- ID list: Server dan pipeline deployment · Monitoring dan backup · Domain dan SSL · Dokumentasi dan walkthrough · Retainer perawatan bulanan (opsional)
- Price line: Included in every build · retainer optional / Termasuk di setiap proyek · retainer opsional
- CTA: Ask about care / Tanya soal perawatan

### 1.8 Why one studio *(was testimonial slider + “TRUSTED BY CLIENTS” circle)*
- Rotating circle: BUILT TO WORK · MADE TO BE SEEN · / DIBANGUN UNTUK BEKERJA · DIRANCANG UNTUK DILIHAT ·
- Slide 1 — label: 01 · Bought, not built / 01 · Dibeli, bukan dibangun
  - EN: “A theme with your logo on it looks like four hundred other sites, loads slowly on your customers' phones, and search engines struggle to read it. We write every site from zero.”
  - ID: “Tema dengan logo Anda terlihat sama dengan ratusan situs lain, lambat di HP pelanggan Anda, dan sulit dibaca mesin pencari. Kami menulis setiap situs dari nol.”
- Slide 2 — label: 02 · Handed over as files / 02 · Diserahkan sebagai file
  - EN: “The vendor sends a zip file and leaves. You're left with software you can't deploy, on a server nobody configured. We hand over a URL that stays up.”
  - ID: “Vendor mengirim file zip lalu pergi. Anda tertinggal dengan software yang tidak bisa di-deploy, di server yang tidak pernah dikonfigurasi. Kami menyerahkan URL yang tetap hidup.”
- Slide 3 — label: 03 · Split across vendors / 03 · Terpecah di banyak vendor
  - EN: “A designer, a developer, a host. Three timelines, three interpretations, and no one who owns the result. We keep design, engineering, and infrastructure on one team.”
  - ID: “Desainer, developer, penyedia hosting. Tiga timeline, tiga tafsiran, dan tidak ada yang bertanggung jawab atas hasilnya. Kami menyatukan desain, engineering, dan infrastruktur dalam satu tim.”

### 1.9 Why work with us *(was awards list)*
- Label: Why work with us / Kenapa Renoir
- **EN H2:** Five reasons clients stay. → **[CONFIRM]** implies existing clients staying; safer: **What you get with Renoir.**
- **ID H2:** Yang Anda dapat dari Renoir.

| # | EN | ID |
|---|---|---|
| 01 | **Written from zero** — No themes, no page builders. Every line exists because your project needed it. | **Ditulis dari nol** — Tanpa tema, tanpa page builder. Setiap baris ada karena proyek Anda membutuhkannya. |
| 02 | **Speed is a specification** — Performance and indexing targets are agreed before we start and checked before handover. | **Kecepatan adalah spesifikasi** — Target performa dan indexing disepakati sebelum mulai dan dicek sebelum serah terima. |
| 03 | **One team, one result** — Design and engineering sit together. Nothing gets lost between them. | **Satu tim, satu hasil** — Desain dan engineering bekerja bersama. Tidak ada yang hilang di tengah jalan. |
| 04 | **Delivered running** — Not a zip file. A working URL on infrastructure we configured. | **Diserahkan dalam keadaan berjalan** — Bukan file zip. URL yang berfungsi, di infrastruktur yang kami konfigurasi. |
| 05 | **Talk to the person building it** — Small team, short lines. No account manager in between. | **Bicara langsung dengan yang membangun** — Tim kecil, jalur singkat. Tanpa account manager di tengah. |

### 1.10 FAQ
- Label: Questions / Pertanyaan
- **EN H2:** Questions we hear before every project. · **ID H2:** Pertanyaan yang sering muncul sebelum proyek dimulai.

| Q EN | A EN | Q ID | A ID |
|---|---|---|---|
| Why aren't prices listed? | The same page can be a two-week job or a two-month one, depending on what sits behind it. We scope first, then quote a fixed price for that scope. You will never get an invoice larger than the number you agreed to. | Kenapa harga tidak dicantumkan? | Halaman yang terlihat sama bisa jadi pekerjaan dua minggu atau dua bulan, tergantung apa yang ada di baliknya. Kami susun scope dulu, lalu memberi harga tetap untuk scope itu. Tagihan Anda tidak akan pernah melebihi angka yang sudah disepakati. |
| Do I own the code? | Yes. Full ownership of all source code and design files transfers to you on final payment. No licensing, no lock-in, no hostage hosting. | Apakah kode jadi milik saya? | Ya. Seluruh source code dan file desain menjadi milik Anda setelah pelunasan. Tanpa lisensi, tanpa lock-in, tanpa hosting yang menyandera. |
| What if I want to leave? | You take everything — repository, infrastructure access, documentation — and go. We'd rather you stay because it works than because leaving is hard. | Bagaimana kalau saya ingin berhenti? | Anda bawa semuanya — repository, akses infrastruktur, dokumentasi — lalu pergi. Kami lebih suka Anda bertahan karena hasilnya bekerja, bukan karena sulit pindah. |
| How long does a project take? | A marketing site usually takes two to four weeks. Internal systems depend on scope; you get a timeline with the written scope, before you commit. | Berapa lama sebuah proyek? | Situs marketing umumnya dua sampai empat minggu. Sistem internal tergantung scope; timeline tertulis Anda terima bersama scope, sebelum Anda memutuskan. |
| Do you maintain what you build? | Yes, on a monthly retainer covering hosting, monitoring, backups, updates, and a set amount of change work. It's optional. | Apakah kalian merawat yang kalian bangun? | Ya, lewat retainer bulanan yang mencakup hosting, monitoring, backup, update, dan jatah perubahan tertentu. Sifatnya opsional. |
| Do you work with clients outside Indonesia? | Yes. We work remotely by default and across time zones. | Apakah kalian menerima klien di luar Indonesia? | Ya. Kami bekerja remote dan terbiasa lintas zona waktu. |

> Brief FAQ says “Optional, but most clients keep it.” — removed “most clients keep it” until it's a real observation. **[CONFIRM]**

### 1.11 Notes *(was blog)*
- Label: Notes / Catatan
- **EN H2:** How we think about building for the web.
- **ID H2:** Cara kami berpikir tentang membangun web.
- EN body: Short notes on speed, handovers, and what keeps a website working after launch.
- ID body: Catatan singkat tentang kecepatan, serah terima, dan apa yang membuat website tetap bekerja setelah diluncurkan.
- Button: Read the notes / Baca catatan

---

## 2. About (`/about/`, `/id/tentang/`)

**Meta** — EN title: About Renoir — A small studio that builds and runs the web · desc: Renoir, pronounced ren-WAHR, is a small digital studio that keeps design, engineering, and infrastructure on one team.
ID title: Tentang Renoir — Studio kecil yang membangun dan menjalankan web · desc: Renoir, dibaca ren-WAHR, adalah studio digital kecil yang menyatukan desain, engineering, dan infrastruktur dalam satu tim.

- Breadcrumb: About Renoir / Tentang Renoir

### 2.1 The name
- Label: The name / Tentang nama
- **EN H2:** Craft came before the art.
- **ID H2:** Keahlian lebih dulu, baru seni.
- Pronunciation badge (was “20+ Year of Experience”): **ren-WAHR** · How to say it / Cara membacanya
- Card title EN: Client work is commercial work. · ID: Pekerjaan klien adalah pekerjaan komersial.
- EN body: Pierre-Auguste Renoir spent his first years painting decoration onto porcelain in a factory — commercial work, paid by the piece, held to a standard. We took the name for that reason. Client work should still be made properly.
- ID body: Pierre-Auguste Renoir menghabiskan tahun-tahun awalnya melukis dekorasi di porselen, di sebuah pabrik — pekerjaan komersial, dibayar per buah, dengan standar yang dijaga. Karena itulah kami memakai namanya. Pekerjaan klien tetap harus dibuat dengan benar.

### 2.2 What we build strip — same as Home 1.3

### 2.3 Statement band *(was video + play button)*
- EN: The things that make software work and the things that make it worth looking at are usually handled by different people. We closed that gap.
- ID: Hal yang membuat software bekerja dan hal yang membuatnya layak dilihat biasanya dikerjakan orang yang berbeda. Kami menutup celah itu.

### 2.4 How we're set up *(was counters 28K / 9K+ / 18+ / 98)*
| Number | EN | ID |
|---|---|---|
| 1 | accountable team | tim yang bertanggung jawab |
| 4 | stages, scope to care | tahap, dari scope sampai perawatan |
| 3 | services, nothing else | layanan, tidak lebih |
| 100% | code ownership at handover | kepemilikan kode saat serah terima |

### 2.5 What we believe *(was testimonial slider)*
- Circle: BUILT TO WORK · MADE TO BE SEEN · (localised as Home)
| # | EN | ID |
|---|---|---|
| 01 | “Software that works and software worth looking at are one requirement, not two.” | “Software yang bekerja dan software yang enak dilihat adalah satu kebutuhan, bukan dua.” |
| 02 | “A site that loads in four seconds isn't finished. Speed and search visibility are part of the spec.” | “Situs yang butuh empat detik untuk terbuka belum selesai. Kecepatan dan visibilitas di pencarian adalah bagian dari spesifikasi.” |
| 03 | “Nothing is delivered until it's running. A repository isn't a deliverable. A URL that stays up is.” | “Tidak ada yang selesai sebelum berjalan. Repository bukan hasil akhir. URL yang tetap hidup, itu hasil akhir.” |
| 04 | “Written from scratch beats assembled from parts. Themes are faster to start and slower forever after.” | “Ditulis dari nol lebih baik daripada dirakit dari potongan. Tema cepat di awal, tapi lambat selamanya.” |
| 05 | “The person who builds it should be the person you talk to.” | “Orang yang membangunnya seharusnya orang yang Anda ajak bicara.” |

### 2.6 Who we work with *(was awards list)*
- Label: Fit / Kecocokan
- **EN H2:** Who we're for — and who we're not. · **ID H2:** Untuk siapa kami — dan untuk siapa tidak.
| EN | tag | ID | tag |
|---|---|---|---|
| Established businesses whose operations outgrew off-the-shelf tools | Good fit | Bisnis yang sudah berjalan dan operasionalnya melampaui tools siap pakai | Cocok |
| Companies whose website undersells them | Good fit | Perusahaan yang website-nya tidak mencerminkan kualitas bisnisnya | Cocok |
| Teams that want one accountable party | Good fit | Tim yang ingin satu pihak yang bertanggung jawab | Cocok |
| Anyone looking for the cheapest possible site | Not a fit | Yang mencari situs semurah mungkin | Tidak cocok |
| Template or page-builder work | Not a fit | Pekerjaan tema atau page builder | Tidak cocok |
| Projects with no decision-maker | Not a fit | Proyek tanpa pengambil keputusan yang jelas | Tidak cocok |

### 2.7 Team grid — unchanged (out of scope)

---

## 3. Services (`/services/`, `/id/layanan/`)

**Meta** — EN title: Services — Marketing sites, internal systems, deployment & care | Renoir · desc: Three services from one team: marketing sites written from scratch, custom internal systems, and the infrastructure that keeps them running.
ID title: Layanan — Situs marketing, sistem internal, deployment & perawatan | Renoir · desc: Tiga layanan dari satu tim: situs marketing yang ditulis dari nol, sistem internal custom, dan infrastruktur yang menjaganya tetap berjalan.

- Breadcrumb: Services / Layanan
- Label: Services / Layanan
- **EN H2:** Three services. One accountable team.
- **ID H2:** Tiga layanan. Satu tim yang bertanggung jawab.
- Button: Start a project / Mulai proyek

| # | EN title + body | ID title + body |
|---|---|---|
| 001 | **Marketing & landing sites** — Written from scratch for companies that need to be found and taken seriously. Fast by construction, not by plugin. Technical SEO from the first commit: structure, structured data, clean indexing, readable to AI search as well as to Google. | **Situs marketing & landing page** — Ditulis dari nol untuk perusahaan yang perlu ditemukan dan dipercaya. Cepat karena dibangun dengan benar, bukan karena plugin. SEO teknis sejak awal: struktur, structured data, indexing yang bersih, dan terbaca oleh AI search maupun Google. |
| 002 | **Custom internal systems** — Software built around how your business actually runs. Order and document tracking, operational dashboards, monitoring, approvals, internal tools, and integrations between systems that were never meant to talk to each other. | **Sistem internal custom** — Software yang dibangun mengikuti cara bisnis Anda berjalan. Pelacakan order dan dokumen, dashboard operasional, monitoring, persetujuan, tools internal, dan integrasi antar sistem yang tadinya tidak saling terhubung. |
| 003 | **Deployment & care** — Servers, pipelines, monitoring, backups, domains, certificates. Included in every build and available afterwards, so what we built keeps working. | **Deployment & perawatan** — Server, pipeline, monitoring, backup, domain, sertifikat. Termasuk di setiap proyek dan tersedia setelahnya, supaya yang kami bangun tetap bekerja. |

Then: How engagements work (Home 1.7) · closing CTA.

### 3.1 Service detail — Marketing & landing sites (`/services/marketing-sites/`, `/id/layanan/situs-marketing/`)
- Meta EN: Marketing & Landing Sites Written From Scratch | Renoir — Fast, search-ready marketing sites built from zero, with performance and indexing targets agreed before we start.
- Meta ID: Situs Marketing & Landing Page dari Nol | Renoir — Situs marketing yang cepat dan siap dicari, dibangun dari nol dengan target performa dan indexing yang disepakati sejak awal.
- Tagline: For companies judged by their website / Untuk perusahaan yang dinilai dari website-nya
- **EN H2:** A website that earns the first meeting.
- **ID H2:** Website yang membuka pintu pertemuan pertama.
- EN intro 1: Prospects check your website before they reply to your email. If it loads slowly, looks like a template, or doesn't show up in search, the decision is made before you're in the room.
- ID intro 1: Calon klien membuka website Anda sebelum membalas email Anda. Kalau lambat, terlihat seperti template, atau tidak muncul di pencarian, keputusannya sudah dibuat sebelum Anda sempat bicara.
- EN intro 2: We write marketing sites from scratch, with performance and search visibility set as targets before the build starts and checked before handover.
- ID intro 2: Kami menulis situs marketing dari nol, dengan target performa dan visibilitas pencarian yang ditetapkan sebelum build dimulai dan dicek sebelum serah terima.
- Summary EN: Built on modern frameworks, rendered statically where possible, with optimised images and very little JavaScript. Readable by Google and by AI answer engines from day one.
- Summary ID: Dibangun dengan framework modern, dirender statis bila memungkinkan, dengan gambar yang dioptimasi dan JavaScript seminimal mungkin. Terbaca oleh Google dan mesin jawaban AI sejak hari pertama.
- List title: What's included / Yang termasuk
- EN list A: Design approved before code · Written from scratch · Performance targets agreed up front · Mobile-first layout · Contact and lead forms
- EN list B: Semantic structure and clean metadata · Structured data · Sitemaps and correct indexing · Readable to AI search · Deployed, monitored, documented
- ID list A: Desain disetujui sebelum kode · Ditulis dari nol · Target performa disepakati di awal · Tata letak mobile-first · Form kontak dan lead
- ID list B: Struktur semantik dan metadata rapi · Structured data · Sitemap dan indexing yang benar · Terbaca oleh AI search · Di-deploy, dimonitor, didokumentasikan
- Form title: Tell us about your website / Ceritakan website Anda
- FAQ: How long does it take? · Can I edit the content myself? **[CONFIRM: is a CMS/editing offered?]** · Do you redesign existing sites? · What happens after launch? (+ ID) — answers drafted after your confirm.

### 3.2 Service detail — Custom internal systems (`/services/internal-systems/`, `/id/layanan/sistem-internal/`)
- Tagline: For operations that outgrew spreadsheets / Untuk operasional yang sudah melampaui spreadsheet
- **EN H2:** Software shaped around how you work.
- **ID H2:** Software yang mengikuti cara kerja Anda.
- EN intro 1: When orders live in chat threads, approvals live in someone's inbox, and the real numbers live in a spreadsheet only one person understands, the business is running on memory.
- ID intro 1: Saat order tercatat di grup chat, persetujuan tersimpan di inbox seseorang, dan angka sebenarnya ada di spreadsheet yang hanya dipahami satu orang, bisnis Anda sedang berjalan di atas ingatan.
- EN intro 2: We build the system your team opens every morning: designed around your process, not a tool built for someone else's business.
- ID intro 2: Kami membangun sistem yang dibuka tim Anda setiap pagi: dirancang mengikuti proses Anda, bukan tools yang dibuat untuk bisnis orang lain.
- Summary EN: Built from a written scope, shown on a staging URL while it's built, and deployed with monitoring and backups so it keeps running after handover.
- Summary ID: Dikerjakan dari scope tertulis, bisa dilihat di URL staging selama proses, dan di-deploy dengan monitoring serta backup supaya tetap berjalan setelah serah terima.
- EN list A: Order and document tracking · Operational dashboards · Activity monitoring · Approval workflows · Internal tools
- EN list B: Integrations between existing systems · Roles and access control · Data you own · Monitoring and backups · Documentation and walkthrough
- ID list A: Pelacakan order dan dokumen · Dashboard operasional · Monitoring aktivitas · Alur persetujuan · Tools internal
- ID list B: Integrasi antar sistem yang sudah ada · Peran dan hak akses · Data sepenuhnya milik Anda · Monitoring dan backup · Dokumentasi dan walkthrough
- Form title: Tell us how you work today / Ceritakan cara kerja Anda saat ini

### 3.3 Service detail — Deployment & care (`/services/deployment-care/`, `/id/layanan/deployment-perawatan/`)
- Tagline: For every client, by default / Untuk setiap klien, tanpa perlu diminta
- **EN H2:** Built is not the same as running.
- **ID H2:** Selesai dibangun belum tentu berjalan.
- EN intro 1: Most projects fail after the build: software nobody can deploy, servers nobody configured, and no one to call when it stops.
- ID intro 1: Banyak proyek gagal justru setelah build selesai: software yang tidak bisa di-deploy, server yang tidak dikonfigurasi, dan tidak ada yang bisa dihubungi saat berhenti.
- EN intro 2: Deployment and care is included in everything we build, and available as a monthly retainer afterwards.
- ID intro 2: Deployment dan perawatan sudah termasuk di semua yang kami bangun, dan tersedia sebagai retainer bulanan setelahnya.
- Summary EN: You get full access either way. Keep us on to run it, or take it in-house with the documentation.
- Summary ID: Anda tetap memegang akses penuh. Biarkan kami yang menjalankan, atau kelola sendiri dengan dokumentasi yang kami serahkan.
- EN list A: Server and infrastructure setup · Deployment pipeline · Domain and SSL · Monitoring and alerts · Backups
- EN list B: Updates and security patches · Defined monthly change work · Documentation · Handover walkthrough · Full access, always
- ID list A: Setup server dan infrastruktur · Pipeline deployment · Domain dan SSL · Monitoring dan notifikasi · Backup
- ID list B: Update dan patch keamanan · Jatah perubahan bulanan · Dokumentasi · Walkthrough serah terima · Akses penuh, selalu
- Form title: Tell us what you're running / Ceritakan sistem yang Anda jalankan

---

## 4. Process (`/process/`, `/id/proses/`) *(replaces /pricing/)*

**Meta** — EN title: How We Work — Scope, Design, Build, Deploy & Care | Renoir · desc: Four stages, a written scope, a fixed price, and a live staging URL the whole way. See how a project with Renoir runs.
ID title: Cara Kerja — Scope, Desain, Build, Deploy & Perawatan | Renoir · desc: Empat tahap, scope tertulis, harga tetap, dan URL staging yang bisa dipantau sepanjang proses. Lihat bagaimana proyek bersama Renoir berjalan.

- Breadcrumb: Process / Proses
- **EN H2:** Nothing ships unfinished.
- **ID H2:** Tidak ada yang dirilis setengah jadi.
- Long stages:
  - **01 Scope** — EN: A conversation about the business problem before anything about technology: what breaks today, what it costs, who decides, and what finished looks like. It ends with a written scope and a fixed price for that scope. · ID: Obrolan tentang masalah bisnis sebelum bicara teknologi: apa yang bermasalah hari ini, berapa biayanya, siapa yang memutuskan, dan seperti apa hasil akhirnya. Diakhiri dengan scope tertulis dan harga tetap untuk scope itu.
  - **02 Design** — EN: Structure first, surface second. Information architecture, flows, then interface. You see and approve the design before a line of production code is written. · ID: Struktur dulu, tampilan kemudian. Arsitektur informasi, alur, lalu antarmuka. Anda melihat dan menyetujui desain sebelum satu baris kode produksi ditulis.
  - **03 Build** — EN: Written from scratch against the approved design. Progress is visible on a live staging URL throughout — no month-long silences, no reveal at the end. · ID: Ditulis dari nol sesuai desain yang disetujui. Progresnya terlihat di URL staging sepanjang proses — tanpa hilang kabar berminggu-minggu, tanpa kejutan di akhir.
  - **04 Deploy & care** — EN: Infrastructure configured, pipeline set up, monitoring and backups in place, domain and SSL live. Handover includes documentation and a walkthrough. Care continues on a retainer, or you take it from there, with full access either way. · ID: Infrastruktur dikonfigurasi, pipeline disiapkan, monitoring dan backup aktif, domain dan SSL berjalan. Serah terima mencakup dokumentasi dan walkthrough. Perawatan berlanjut lewat retainer, atau Anda ambil alih — dengan akses penuh di kedua pilihan.
- Then: How engagements work · FAQ · closing CTA.

---

## 5. Notes (`/notes/`, `/id/catatan/`) *(replaces blog)*

**Meta** — EN title: Notes — Building websites that keep working | Renoir · ID title: Catatan — Membangun website yang tetap bekerja | Renoir

Articles (full text written after deck approval; ~600–900 words each, EN master + ID transcreation, author “Renoir”):

1. **Most websites are bought, not built** / **Kebanyakan website dibeli, bukan dibangun**
   Lead EN: A theme with your logo on it is quick to buy and expensive to live with. Here's what it costs, and what building from scratch changes.
   Lead ID: Tema dengan logo Anda cepat dibeli, tapi mahal untuk dijalani. Ini biaya sebenarnya, dan apa yang berubah saat website dibangun dari nol.
   Outline: the four-hundred-sites problem · speed on real phones · why search engines struggle with themes · who can change a word · when a theme is fine (honest limit) · what to ask a vendor.
2. **Nothing is delivered until it is running** / **Tidak ada yang selesai sebelum berjalan**
   Lead EN: The handover is where most projects quietly fail. A zip file is not a deliverable. A URL that stays up is.
   Lead ID: Serah terima adalah titik di mana banyak proyek gagal tanpa suara. File zip bukan hasil akhir. URL yang tetap hidup, itu hasil akhir.
   Outline: what “handover” usually means · the checklist of what should exist on day one (deploy, domain, SSL, monitoring, backups, docs) · ownership and access · questions to ask before signing.
3. **Speed is a specification, not an upgrade** / **Kecepatan adalah spesifikasi, bukan tambahan**
   Lead EN: A site that loads in four seconds isn't finished. Here's how to set performance and search targets before a build starts.
   Lead ID: Situs yang butuh empat detik untuk terbuka belum selesai. Begini cara menetapkan target performa dan pencarian sebelum build dimulai.
   Outline: why speed decides first impressions · what to measure (loading, stability, responsiveness) · indexing and structured data · AI answer engines · writing targets into the scope.

---

## 6. Contact (`/contact/`, `/id/kontak/`)

**Meta** — EN title: Start a Project | Renoir · desc: Tell us what isn't working. Most projects start with a fifteen-minute conversation — no deck, no pitch.
ID title: Mulai Proyek | Renoir · desc: Ceritakan apa yang tidak berjalan. Kebanyakan proyek dimulai dari obrolan lima belas menit — tanpa presentasi, tanpa jualan.

- Breadcrumb: Start a project / Mulai proyek
- **EN H2:** Tell us what's broken.
- **ID H2:** Ceritakan apa yang bermasalah.
- EN body: Share a little about the problem. We'll reply with a few questions or a time for a fifteen-minute call. If we're not the right fit, we'll say so.
- ID body: Ceritakan sedikit tentang masalahnya. Kami akan membalas dengan beberapa pertanyaan atau jadwal obrolan lima belas menit. Kalau kami bukan pilihan yang tepat, kami akan bilang.
- Info boxes: **Email** hello@renoir.run (dummy) · **Where we work** Indonesia — remote worldwide / **Lokasi** Indonesia — remote ke seluruh dunia
- Response line **[CONFIRM]**: EN “We reply within one working day.” / ID “Kami membalas dalam satu hari kerja.” — only if you can keep it.

**Intake form**
| Field | EN label / placeholder | ID label / placeholder |
|---|---|---|
| Name | Your name | Nama Anda |
| Company | Company | Perusahaan |
| Email | Work email | Email kantor |
| Build type | What are you looking to build? — Marketing site · Internal system · Both · Not sure yet | Apa yang ingin Anda bangun? — Situs marketing · Sistem internal · Keduanya · Belum yakin |
| Problem | What's the problem you're trying to solve? | Masalah apa yang ingin Anda selesaikan? |
| Timeline | Timeline — Within a month · 1–3 months · 3+ months · Just exploring | Timeline — Dalam sebulan · 1–3 bulan · Lebih dari 3 bulan · Masih menjajaki |
| Budget | Budget range — Under 10M IDR · 10–25M IDR · 25–50M IDR · 50M+ IDR · Prefer to discuss | Kisaran budget — Di bawah Rp10 juta · Rp10–25 juta · Rp25–50 juta · Di atas Rp50 juta · Ingin didiskusikan |
| Submit | Send project details | Kirim detail proyek |
| Success | Thanks. Your message is in. We'll reply soon. | Terima kasih. Pesan Anda sudah kami terima. Kami segera membalas. |
| Invalid | Please check the highlighted fields. | Mohon periksa kembali kolom yang ditandai. |
| Captcha | We couldn't verify the request. Please try again. | Kami tidak bisa memverifikasi permintaan ini. Silakan coba lagi. |
| Rate limited | Too many messages from this connection. Please wait a minute. | Terlalu banyak pesan dari koneksi ini. Mohon tunggu satu menit. |
| Error | Something went wrong. Please email us directly. | Terjadi kesalahan. Silakan kirim email langsung kepada kami. |

---

## Open questions for you **[CONFIRM]**
1. Hero headline: keep the brief's “Built to work. Made to be seen.” or pick an alternative (EN + ID)?
2. Home Work section: “Work, not mockups” (once real projects exist) or “Recent work” for now?
3. “Why work with us” H2: “What you get with Renoir” (safe) — OK?
4. FAQ “most clients keep the retainer” removed — agree?
5. Can clients edit their own site content after launch (CMS)? Affects the marketing-site FAQ.
6. Can you commit to “We reply within one working day”?
