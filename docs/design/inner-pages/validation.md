# Validasi riset dan prototype

11 Oktober 2026. Hasil untuk paket review lokal, bukan sertifikasi situs produksi.

## Audit keadaan sekarang

`capture-audit.mjs` dijalankan pada source lokal melalui Astro dev di port 4390. 15 route x 3 viewport (390, 768, 1440): **45 diperiksa, 0 masalah teknis terdeteksi**. Semua status 200; tidak ditemukan horizontal overflow atau gambar rusak pada pemeriksaan tersebut. Dua screenshot full-page per route disimpan di `audit/`. Data lengkap: `audit/measurements.json`.

Route mencakup Services, empat detail layanan, About, Process, Work, satu Work detail, Notes, satu Notes detail, Contact, serta Services/Internal/Contact dalam ID. Seluruh varian Work/Notes dan seluruh pasangan EN/ID belum diaudit satu per satu. Pemeriksaan memakai reduced motion; bukan klaim motion seluruh situs sudah diuji.

## Referensi

Capture Design System dan Peter Tarka diperbarui dari gambar/poster publik pembuat setelah diperiksa melalui browser bawaan Codex. Ini gambar statis, bukan verifikasi video. URL media dicatat di `references/poster-sources.json`; screenshot loader sebelumnya tidak digunakan.

12 screenshot sumber disimpan, semuanya memiliki tautan, target komponen, observasi, adaptasi desktop/mobile, dan keputusan dalam `references.json`. Animated Tabs diklik ke Services; panel `Services tab` terverifikasi visible dan `06-tabs-selected.webp` disimpan. Continue Stepper diklik dan screenshot keadaan berikutnya disimpan. Hover gallery dicoba tetapi pengukurannya tidak cukup untuk memastikan ekspansi; ditandai belum terverifikasi. Referensi lain diperiksa sebagai tampilan statis dan dokumentasi, bukan klaim seluruh interaksi telah diuji. Situs Lesse langsung gagal dinavigasi, sehingga referensinya memakai artikel pembuat di Codrops dengan batas eksplisit.

## Prototype

**PASS: 8 dari 8 kelompok pemeriksaan**, pada run final setelah marker menggunakan transform. Pada tablet/desktop, posisi marker tahap terakhir juga diverifikasi sesudah transisi selesai sebelum screenshot disimpan.

Hasil executable review: `qa/results.json`. Script memeriksa EN/ID pada tiga lebar, pilihan semua tahap, play/pause/replay, penghentian ketika keluar viewport, playback finite, keyboard dan focus, reduced motion, tanpa JS, gambar gagal, serta link dan layout moodboard. Screenshot berada di `qa/`.

Handler tab tersembunyi diperiksa dari source (`visibilitychange` memanggil pause); belum diuji dengan perpindahan tab browser sungguhan. Storyboard menetapkan produksi harus mempertahankan perilaku tersebut.

## Performa dan validasi produksi

Belum ada perubahan kode produksi, sehingga type check Astro, tes contact, build situs, guard link/copy produksi, dan Lighthouse produksi tidak dijalankan sebagai validasi perubahan ini. Syntax check dijalankan pada script review. Tidak ada dependency/lockfile diubah. Ukuran asset terukur: desktop 57,588 byte, mobile 21,832 byte; empat focus crops total 57,668 byte; Inter 48,256 byte. Master PNG 1,851,261 byte hanya untuk review/arsip, tidak direferensikan oleh halaman prototype.

Target produksi tetap Performance >=95, CLS 0, TBT <100ms. Nilai Lighthouse situs belum diperbaiki atau dibuktikan oleh hasil riset ini. Setelah implementasi Astro disepakati, jalankan check, tes terkait, build, guard link/copy, visual QA dan Lighthouse pada built site. Jangan menganggap skor prototype setara dengan situs produksi.

## Delivery gate untuk paket review

**Hard Gate PASS / Purpose PASS / Liveliness PASS / Craftsmanship PASS** untuk ruang lingkup paket review. Kontras terhitung: teks muted pada paper 5.92:1, tautan cobalt pada paper 6.25:1, teks putih pada cobalt 6.70:1, ink pada paper 16.42:1. Semua melewati 4.5:1 untuk teks biasa. Nilai ini berlaku pada pasangan token prototype, bukan audit kontras seluruh situs.

- Hard Gate: bukti executable ada di `qa/results.json`; semua kontrol prototype memiliki perilaku, tanpa-JS menyembunyikan kontrol playback dan menonaktifkan pemilihan tahap. Tidak ada angka pelanggan/uptime, testimonial, UI pelanggan AI atau claim security rekaan.
- Purpose: alasan warna, type, layout, kedalaman, dan gerak dicatat di README; referensi dibedakan dari aset milik Renoir.
- Liveliness: ENERGY 3 / RHYTHM 3 / MOTION 3; focal point mekanisme order, satu cobalt signal, pola material/kamera berulang di brief empat layanan. Motion finite benar-benar disajikan pada pilot, bukan hanya disebutkan.
- Craftsmanship: breakpoint, keyboard, locale, reduced motion, no-JS dan image failure diuji pada prototype; source produksi dan homepage tidak diedit dalam perubahan ini. Batas dan pertanyaan review dinyatakan eksplisit.

Gate ini berlaku pada paket review. Persetujuan estetika pemilik dan pengujian produksi tetap diperlukan sebelum peluncuran.
