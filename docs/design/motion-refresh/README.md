# Audit motion dan riset “What you get”
17 Oktober 2026 · Katalhys · EN/ID

## Temuan dari repo

Masalah utamanya berasal dari satu sistem entrance yang dipakai berulang. Desktop memecah judul menjadi karakter, menggesernya 80px dari bawah dan memberi stagger; mobile mengganti semua target dengan satu translateY 14px selama 480ms. Durasi yang terasa panjang berasal dari gabungan tween dan jumlah karakter. Efek tersebut tidak membedakan peran judul, isi, gambar atau CTA.

Ada tujuh pemilik judul yang terdampak, tiga lokasi fade tambahan, dan dua entrance CSS Home. Satu komponen bersama dapat muncul di banyak route; tabel ini memetakan pemiliknya, bukan menganggap semua heading di website bergerak.

| Pemilik / lokasi | Cakupan | Perilaku sebelumnya | Keputusan |
| --- | --- | --- | --- |
| home/Problem.astro | Home EN/ID | Karakter judul naik dari bawah | Judul statis; screenshot tetap menjadi bukti |
| shared/Process.astro | Home dan Process | Judul, empat langkah dan storyboard masuk dari bawah | Teks statis; garis diagram digambar sekali mengikuti urutan tahap |
| shared/Engagements.astro | Home, Services, Process | Judul naik per karakter | Judul statis; garis label/divider memberi orientasi, interaksi membuka scope |
| shared/Faq.astro | Semua view yang memakai FAQ | Entrance judul yang sama | Judul statis; gerak hanya saat membuka pertanyaan |
| home/Notes.astro | Home | Entrance judul yang sama | Teks statis; pengguna menggeser daftar artikel lewat kontrol yang sudah ada |
| services/ServiceList.astro | Indeks layanan | Entrance judul yang sama | Judul statis; hover/fokus row memberi feedback |
| layout/Footer.astro | Seluruh halaman | CTA besar naik per karakter | CTA langsung terbaca; feedback tautan tetap tersedia |
| work/WorkCatalog.astro | Katalog Work | Thumbnail masuk dengan fade/geser | Gambar langsung terlihat; parallax/hover yang sudah ada tetap terpisah |
| styles/_home-refresh.scss | Hero dan panel proyek | Seluruh blok bergeser dari bawah | Hero statis di atas video; proyek berganti dengan crossfade singkat |

Header halaman About dan artikel Notes sendiri tidak memakai hook character entrance. Footer bersama, FAQ dan komponen lain yang dibawanya menjelaskan mengapa efek serupa terasa hadir lintas halaman. Branch `si-char-animation` masih ada pada script lama tetapi tidak memiliki pemakai pada markup saat audit.

## Dasar riset

IBM membedakan gerak untuk membantu pekerjaan dari gerak ekspresif. Panduan lanjutnya menyarankan gerak lebih kecil pada komposisi yang padat dan perhatian yang tetap memiliki titik fokus. Penerapan saya: roda layanan dan video sudah menjadi elemen ekspresif; paragraf dan heading tidak perlu menambah kompetisi visual. Ini keputusan desain Katalhys berdasarkan prinsip tersebut, bukan template animasi yang diwajibkan IBM. [IBM overview](https://www.ibm.com/design/language/animation/overview/), [IBM attention dan visual clarity](https://www.ibm.com/design/language/animation/tips-and-techniques/).

W3C menjelaskan bahwa gerak non-esensial dari interaksi perlu dapat dinonaktifkan pada kriteria AAA 2.3.3, dengan dukungan preferensi reduce motion sebagai salah satu teknik. Saya mempertahankan fallback statis dan tidak membuat teks tersembunyi sebelum JavaScript. Ini bukan klaim audit kepatuhan seluruh situs. [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

### Pola yang dipertimbangkan

- Masked line reveal: lebih rapi dari stagger karakter, tetapi masih mengulang entrance dan menahan keterbacaan; tidak dipilih untuk semua judul
- Blur-to-sharp: menambah kesan lembut, tetapi berisiko mengaburkan teks saat pembaca tiba; tidak dipilih
- Typewriter/decrypted text: membawa asosiasi terminal/AI yang berlebihan pada judul marketing; tidak dipilih
- Scroll-driven text fill: cocok untuk satu manifesto pendek, tetapi membuat pembaca menunggu progres scroll; tidak dipilih sebagai aturan global
- Judul statis + gerak pada tindakan/diagram: dipilih karena hierarki jelas, teks segera terbaca dan fungsi tiap bagian mendapat motion yang berbeda

## Perubahan motion yang diterapkan

Hook entrance karakter/fade dibersihkan dari pemilik di atas. `anim.ts` kini hanya menangani parallax gambar native. GSAP/SplitText/ScrollTrigger tidak lagi diunduh untuk entrance halaman; paketnya tetap terpasang agar perubahan ini tidak meluas menjadi pemeliharaan dependensi.

Storyboard Process menggambar path SVG sekali, 650ms dengan jeda 110ms antar tahap. Kotak dan label tetap terlihat; pola ini menghubungkan urutan empat tahap yang sudah ada. Engagement mempertahankan hover/click/touch disclosure dan gerak garis kecil. Panel Work kini memakai crossfade opacity 500ms saat pilihan berubah, dengan tinggi stage tetap; interval otomatis empat detik dan Proteksindo pada urutan keempat. Hero mengandalkan video yang sudah ada, tanpa entrance teks tambahan. Reduced motion menonaktifkan gerak dekoratif baru.

## Riset komponen “What you get”

Komponen sebelum integrasi adalah `sections/shared/Rows.astro`, yang hanya dipakai Home. Kelima data manfaat sudah memiliki `body` EN/ID, tetapi komponen hanya merender `title`, nomor dan `tag`. Ini membuat manfaat terbaca sebagai daftar penghargaan pendek, bukan penjelasan konkret. Nomor 01–05 juga menyiratkan urutan, padahal isinya merupakan lima komitmen yang sejajar.

| Kandidat | Yang dibantu | Kekurangan pada susunan Home saat ini | Keputusan |
| --- | --- | --- | --- |
| Accordion dengan visual berganti | Memadatkan penjelasan; detail terbuka atas tindakan | Tepat di atasnya sudah ada accordion engagement; manfaat penting tersembunyi | Tidak dipilih |
| Vertical tabs + satu visual | Fokus pada satu manfaat; mudah diberi demonstrasi | Roda layanan dan Work sudah mempunyai selector; menambah pola yang sama | Tidak dipilih |
| Bento berukuran berbeda | Banyak topik dapat dilihat sekaligus | Mudah terasa seperti template; lima isi kita tidak memiliki bobot yang sangat berbeda | Alternatif jika kelak ada bukti visual yang kuat per manfaat |
| Sticky scroll story | Menjelaskan hubungan secara bertahap | Manfaat bukan rangkaian proses; menambah tinggi dan scroll yang sudah Anda keluhkan | Tidak dipilih |
| Komposisi dokumen serah terima | Identitas studio terasa melalui artefak kerja; lima manfaat dan penjelasan langsung terbaca | Membutuhkan ketelitian tipografi dan versi mobile yang tetap pendek | **Direkomendasikan** |

Tabs secara definisi menampilkan satu panel dalam satu waktu, sedangkan accordion membuka/menutup isi. Bentuk interaksinya valid, namun pemilihannya perlu melihat komponen di sekitarnya. [shadcn Tabs](https://ui.shadcn.com/docs/components/base/tabs), [shadcn Accordion](https://ui.shadcn.com/docs/components/base/accordion).

GOV.UK menyarankan disclosure untuk informasi yang hanya diperlukan sebagian pengguna. Kelima manfaat ini adalah alasan utama memilih Katalhys, sehingga saya memilih menampilkan penjelasannya langsung. [GOV.UK Details](https://design-system.service.gov.uk/components/details/).

Linear menunjukkan pengelompokan fitur berdasarkan pekerjaan yang dilakukan. Pelajaran yang saya ambil adalah menghubungkan visual dengan objek pekerjaan, bukan menyalin warna atau efeknya. [Linear Features](https://linear.app/features). Gerak pada halaman referensi tersebut tidak saya ukur frame per frame; rekomendasi timing di atas merupakan rancangan sendiri.

## Konsep yang direkomendasikan

Satu bidang ink dengan judul besar di kiri dan satu lembar putih di kanan, seperti dokumen yang ikut diserahkan saat proyek selesai. Di dalam lembar tersebut terdapat lima judul dan **body copy yang sudah disetujui**, dengan tag sebagai penanda kategori. Tidak ada nomor urut, metrik rekaan, status “verified”, atau screenshot software palsu.

Gerak pada implementasi final: latar ikon merespons hover pada kelompok yang dibaca selama 180ms. Teks tetap di tempat. Tidak ada autoplay, rotasi kartu, scroll pin atau konten yang harus dibuka terlebih dahulu. Pada mobile, judul dan lembar menyatu dalam satu kolom; semua manfaat tetap terlihat.

Preview terpisah: `preview.html` di folder ini. Jalankan `node docs/design/motion-refresh/serve.mjs` lalu buka http://localhost:4393. Preview mendukung EN/ID dan reduced motion. Konsep disetujui pemilik pada 2026-10-17 dan kini terintegrasi ke Home EN/ID sebagai `sections/home/Benefits.astro`. Preview terpisah tetap menyimpan rancangan awal untuk referensi.

## Verifikasi lokal

Production build berhasil. Astro check: 0 error, 0 warning, empat hint lama di file yang tidak diubah untuk tugas ini. Unit test: 10 lulus. Link/copy guards: 45 halaman. Chrome: 26 skenario motion, tiga skenario feedback EN/ID/reduced motion, serta 14 skenario Home responsive/fallback. Search memakai Pagefind di build normal dan catalog saat indeks diblokir; query URL juga membuka dialog dengan benar. Preview konsep: lima manfaat, EN/ID, tanpa overflow pada 320/412/1440px. Screenshot ada di folder ignored `.work-capture/home-refresh/qa/`.

Lighthouse belum diukur ulang setelah perubahan ini; tidak ada deployment, commit, pembelian layanan atau pengujian deck vendor.

## Integrasi konsep yang disetujui — 2026-10-17

Home EN/ID kini memakai bidang ink dan lembar manfaat putih. Kelima `title`, `tag`, dan `body` tetap berasal dari copy yang sudah ada. Ikon SVG untuk kode, performa, tim, serah terima, dan kontak membantu pembaca membedakan topik. Ilustrasi file desain, kode, dan checklist serah terima mengisi ruang di bawah judul; caption EN/ID menjelaskan file desain, kode sumber, akses, dan dokumentasi yang dibawa saat serah terima. Grafik ini konseptual, bukan tampilan produk atau bukti hasil klien.

Tidak ada unduhan gambar/font baru, dependency tambahan, atau JavaScript untuk section ini. Semua isi terlihat tanpa JavaScript. Judul dan paragraf tetap statis; reduced motion mematikan transisi hover ikon. Pada tablet, judul dan ilustrasi berdampingan di atas dokumen; pada ponsel keduanya tersusun vertikal. Rows lama sudah dihapus karena tidak memiliki pemakai lain.

### Hasil pemeriksaan integrasi

- `bun run check`: 0 error, 0 warning, 5 hint dari file lain yang sudah ada
- `bun test`: 10 test lulus
- `bun run build`, `check:links`, dan `check:copy`: lulus; guard memeriksa 45 halaman
- `check-home-refresh.mjs`: 14 skenario lulus, termasuk pemeriksaan komponen benefits pada 10 kombinasi Home locale/viewport
- Pemeriksaan khusus benefits: 16 skenario lulus pada EN/ID, 320/412/820/1240/1440/1992px, tanpa JavaScript, dan reduced motion. Semua body copy cocok dengan sumber locale; tidak ada clipping atau overflow horizontal. Ikon dekoratif tidak menambah fokus keyboard. Reset global reduced motion membatasi transisi ke 0,01ms
- Screenshot komponen hasil build: `.work-capture/benefits/*-built.png` (fixed controls disembunyikan hanya saat crop komponen)

Lighthouse belum diukur ulang pada integrasi ini; tidak ada deployment.
