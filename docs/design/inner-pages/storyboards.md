# Storyboard empat layanan

Semua adegan berstatus konsep review. Waktu dinyatakan dari awal replay, bukan posisi scroll. Kamera tetap elevated three-quarter, cahaya kiri atas, ink/porcelain/cobalt. Satu focal point per tahap. Tidak ada nama pelanggan, hasil bisnis, atau metrik fiktif. Label berikut adalah draft EN/ID untuk review, tidak mengganti approved copy.

## Perilaku bersama

Desktop: heading dan intro singkat mendahului panggung 3:2/3:1 sesuai ruang; empat kontrol tahap selalu terlihat. Tableau lengkap adalah keadaan awal tanpa JS. Mobile: empat kontrol 2 x 2 dan satu fokus objek besar dengan caption; fallback tanpa JS menampilkan tableau lengkap dan daftar penjelasan. Tablet memakai tableau lengkap dan kontrol yang wrap.

Choreography: empat tahap masing-masing 2 detik, total 8 detik sekali. Play/pause, replay, dan pilihan tahap tersedia; klik tahap menghentikan autoplay. Mulai hanya setelah asset berhasil dimuat dan panggung masuk viewport. Keluar viewport atau tab tersembunyi menghentikan pemutaran; pengguna dapat melanjutkan melalui Play. Reduced motion menampilkan tableau + semua deskripsi, tidak autoplay dan tidak ada perpindahan animated. Pergantian locale mempertahankan tahap dan fokus, serta menghentikan playback. Gambar gagal: urutan teks tetap terbaca, status kegagalan terlihat dan play dinonaktifkan.

## 1. Internal Systems: satu pesanan, satu alur

Pilot nyata: `pilot.html`, render datar + penanda HTML; label dan status tidak berasal dari AI.

| Waktu | Benda / focus | Draft ID / EN | Makna gerak |
| --- | --- | --- | --- |
| 0–2s | Order card masuk intake | Sales / Sales: Pesanan dicatat satu kali / Record the order once | Penanda pesanan berhenti di input, tidak ada pergeseran seluruh halaman |
| 2–4s | Approval press | Persetujuan / Approval: Tanggung jawab dan status terlihat / Ownership and status are visible | Penanda bergerak ke persetujuan; label status berubah |
| 4–6s | Parcel shelf | Gudang / Warehouse: Gudang menerima pesanan yang disetujui / Warehouse receives the approved order | Fokus berpindah ke shelf, bukan parcel menyiratkan kapasitas baru |
| 6–8s | Delivery gate | Pengiriman / Delivery: Pengiriman terhubung dengan riwayat pesanan / Delivery stays connected to the order history | Penanda sampai di gate; tableau berhenti pada akhir |

Desktop: gambar penuh, marker bergerak di jalur semantik bawah gambar; jangan pura-pura marker mengikuti perspektif belt AI secara fisik. Mobile enhanced: crop station aktif, semua tombol tahap tetap terlihat; tanpa JS seluruh scene terlihat. Bukti setelah panggung: Order & Field Sales pair, kemudian order-detail dengan caption existing. CTA draft: Bahas sistem Anda / Discuss your system, menuju contact resmi, tidak mengirim lead dari prototype.

## 2. Marketing sites: halaman menuju inquiry

Komposisi: bidang halaman website sebagai objek graphite/porcelain, bukan jendela browser palsu. Komponen headline, navigasi layanan, dan inquiry menjadi layer HTML yang disusun presisi; ilustrasi hanya menyuplai frame dan material.

| Waktu | Frame storyboard | Draft ID / EN | Makna gerak |
| --- | --- | --- | --- |
| 0–2s | Struktur halaman tersusun | Struktur / Structure | Perlihatkan hierarki informasi, tanpa skeleton diklaim sebagai produk |
| 2–4s | Offer panel mendapat fokus | Penawaran / Offer | Sorot satu layanan yang jelas |
| 4–6s | Jalur dari offer ke inquiry | Inquiry / Inquiry | Penanda menelusuri jalur menuju form |
| 6–8s | Inquiry card di keluaran | Percakapan / Conversation | Akhir berupa next step, bukan angka conversion rekaan |

Mobile: komponen halaman tersusun vertikal; teks HTML tetap tegak, tidak ikut perspektif. Keadaan statis menampilkan keempat bagian dan satu jalur. Bukti: MAXY AI service route + Industrial Coatings discovery. Jangan menyatakan inquiry diterima, performa atau indexing berhasil sebagai telemetry nyata.

## 3. UI/UX & identity: bagian menjadi pengalaman

Komposisi: meja kerja visual, satu color chip cobalt, shape asli The Joint hanya ditempel secara deterministic, keping type dan layout, dua frame desktop/mobile. Hasilnya menjelaskan keluaran desain tanpa menjiplak design system referensi.

| Waktu | Frame storyboard | Draft ID / EN | Makna gerak |
| --- | --- | --- | --- |
| 0–2s | Elemen identitas | Identitas / Identity | Material framing mendukung identitas yang telah disepakati |
| 2–4s | Komponen interface | Komponen / Components | Warna, type, kontrol terhubung secara konsisten |
| 4–6s | Halaman desktop tersusun | Desktop / Desktop | Susunan berubah menjadi hierarchy interface |
| 6–8s | Susunan mobile muncul | Mobile / Mobile | Komposisi menyesuaikan viewport, bukan hanya shrink |

Mobile: satu frame aktif besar; pilihan Desktop/Mobile tetap bisa diakses tanpa hover. Static tableau menunjukkan keduanya. Bukti: Expert Profile jalur mitra/pembelajar, application AI CEO Circle dua tahap. Komponen konsep tidak disajikan sebagai hasil final pelanggan.

## 4. Deployment & care: dibangun sampai berjalan

Komposisi: application slab dari build masuk live dock; dua cabang menuju observation lens dan backup tray. Hindari server rack generik menjadi satu-satunya pesan. Backup berarti alur konseptual, bukan klaim semua proyek sudah memiliki kebijakan yang sama.

| Waktu | Frame storyboard | Draft ID / EN | Makna gerak |
| --- | --- | --- | --- |
| 0–2s | Application slab di build | Build / Build | Titik awal aplikasi siap dirilis |
| 2–4s | Live dock terhubung | Deploy / Deploy | Penanda berjalan ke akses aplikasi |
| 4–6s | Monitoring branch | Pantau / Monitor | Hubungan pemantauan diperlihatkan, tanpa grafik live palsu |
| 6–8s | Backup/recovery branch | Pemulihan / Recovery | Cabang kembali menghubungkan penyimpanan dan aplikasi |

Mobile: jalur vertikal dengan label kiri/kanan di luar artwork. Static state memperlihatkan hubungan lengkap. Bukti: diagram arsitektur sanitasi existing dengan caption keterbatasannya; dashboard Komodo tetap menunggu akses. Jangan menghasilkan dashboard palsu untuk menutupi kekurangan bukti.

## Asset brief dan ukuran target

Pilot memakai satu master 1536×1024 dan WebP 1440/768; mobile focus crops memakai empat area raster. Crop merupakan proof-of-composition, bukan layer terpisah untuk rig animasi. Produksi: minta render per objek, rail/plinth, dan shadow; kualitas/siluet diperiksa pada 390px sebelum export. Ukuran file adalah budget rancangan, bukan hasil yang diklaim: hero ≤180KB, seluruh layer per adegan ≤250KB, JS khusus panggung ≤8KB gzip. Jika asset melampaui budget, kurangi detail/resolusi sebelum menambah runtime.
