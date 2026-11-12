# Revisi v4 — 25 Oktober 2026

Komposisi v3 dipertahankan kecuali slide 16, yang kini memperlihatkan lead tracker sesuai arahan pemilik. Total 37 slide: 28 utama, 9 lampiran. Sasaran 17 menit 50 detik.

## Perubahan utama

| Slide | Revisi |
| --- | --- |
| 1 | Dashboard superadmin Fanos terbaru dan sales mobile berdampingan; Ghufron Bagaskara & Elroy |
| 4 | Cerita asal Katalhys: pengalaman proyek, pembelajaran, dan tujuan membantu lebih banyak bisnis; gambar Proteksindo dipertahankan |
| 6 | Papan Proteksindo, seluruh tahap berisi proyek simulasi |
| 7 | Website MAXY AI terkini, menggantikan kategori produk lama |
| 8 | Sales mobile Fanos menggantikan pengulangan Proteksindo |
| 10 | Implementasi MCP sales Fanos, diagram hubungan dan batas akses |
| 11 | Pasangan desktop–mobile Fanos, Proteksindo, Coatings, MAXY diperbarui |
| 12–13 | Dashboard dan detail pesanan Fanos dari source terkini |
| 14–15 | Dashboard berisi aktivitas/grafik serta anggaran dengan rincian biaya; mobile pelaksana |
| 16 | Lead tracker admin asli dengan 12 lead simulasi; visual Our Products dikeluarkan |
| 17 | Detail produk dan penawaran terkini, satu produk terpilih; formulir tidak dikirim |
| 18, 24 | MAXY AI dan halaman Web & App terbaru |
| 23, 27, 30, 34, 36 | Bukti pendukung mengikuti aset baru |

## Data dan provenance

- Proteksindo memakai SQLite terisolasi di `.build/demo`, bukan database sumber. Enam belas proyek tambahan dilengkapi material, tenaga kerja, borongan, biaya, laporan dan absensi. Pemeriksaan relasi wajib: 16/16, tanpa relasi kosong. Contoh anggaran terpakai Rp13.131.550 berasal dari rincian bahan, tenaga harian, borongan dan biaya lain. Angka ini simulasi, bukan harga Katalhys atau hasil klien.
- Fanos memakai salinan demo SQLite di `.build/fanos-demo`. Frontend dibangun dari salinan sumber ke `.build/fanos-frontend`; dependency hanya dipasang pada salinan tersebut. Source, lockfile, database aplikasi dan layanan produksi tidak berubah. Dashboard memuat 622 pesanan demo. Waktu referensi September 2026 mengikuti dataset, bukan tanggal capture.
- Lead tracker memakai build asli Fanos Coatings dengan SQLite baru di `.build/coatings-demo`. Ada 12 lead: 5 baru, 5 dihubungi, 2 arsip. Kontak menggunakan `example.test`; tidak ada data pelanggan nyata. Gambar logo berasal dari file asli proyek yang sama.
- MAXY dan halaman Coatings publik direkam 25 Oktober 2026. URL ada di `assets/capture-v4-web.json` dan `assets/capture-v4-coatings.json`. Halaman kategori legacy mungkin masih tersedia di situs asal, tetapi tidak dipakai pada deck.
- Kredit pendiri saat bekerja di MAXY tetap berlaku untuk lingkup historis. Screenshot situs terkini dapat memuat pembaruan setelah periode itu; tidak seluruh perubahan terbaru diklaim sebagai karya Katalhys.
- Tidak ada token konektor baru, koneksi MCP, panggilan model berbayar, pengiriman formulir, pesan, email, deployment atau publikasi.
- Nama Elroy ditambahkan sesuai arahan pemilik. Jabatan, pembagian keahlian, foto, dan riwayat Elroy tidak ditebak. Cerita pribadi yang lebih luwes berada pada speaker notes slide 4.

## Riset SVG dan ikon

Dipertimbangkan: [Lucide static](https://lucide.dev/guide/static), [Tabler SVG](https://docs.tabler.io/icons/static-files/svg), dan [Hero Patterns](https://heropatterns.com/). Lucide menyediakan SVG tanpa framework; Tabler juga memiliki file SVG statis. Hero Patterns menawarkan pola berulang dengan pengaturan opacity.

Pilihan: delapan SVG Lucide resmi untuk layanan dan serah terima, disimpan lokal bersama lisensi di `assets/icons`. Tidak ada React atau paket situs baru. Lisensi sumber: [Lucide](https://lucide.dev/license). Tidak ada pola Hero Patterns yang disalin.

`ornaments.mjs` mendefinisikan kurva Bézier terbuka yang menggemakan dua bidang lengkung logo Katalhys. Definisi yang sama menghasilkan tiga SVG transparan di `assets/ornaments` dan shape native PowerPoint pada seluruh slide. Warna menyesuaikan permukaan putih, ink dan cobalt. Kurva berada di belakang konten, tidak bergerak, tanpa pola grid atau ornamen berulang yang memenuhi layar. Ikon tidak menggantikan screenshot sebagai bukti.

## Batas pemeriksaan

PowerPoint desktop digunakan untuk membuka ulang file, memeriksa efek dan merender setiap slide. Gerak dibuktikan melalui renderer video PowerPoint. Slide Show interaktif dan impor Canva belum diuji. Panel lama belum tersinkron karena Artifact Session gagal diinisialisasi; gunakan PPTX/PDF v4.
