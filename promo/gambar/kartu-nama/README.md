# Kartu nama Katalhys

Kartu perkenalan calon klien untuk Ghufron Bagaskara (Co-founder & CTO) dan Elroy (Co-founder & CEO). Versi 2 memakai sisi depan personal dan sisi belakang bersama berisi pengenalan studio serta empat layanan. Duplikat pasangan halaman di Canva untuk anggota tim lain. Hasil versi pertama tetap tersimpan di root `renders/`.

| File | Kegunaan |
| --- | --- |
| [Preview](renders/v2/preview.jpg) | Bandingkan kedua sisi depan dan sisi belakang bersama |
| [PPTX editabel](renders/v2/katalhys-kartu-nama-canva.pptx) | Impor ke Canva, empat halaman dalam urutan depan/belakang CTO, lalu depan/belakang CEO |
| [PDF proof cetak](renders/v2/katalhys-kartu-nama-proof-cetak.pdf) | RGB, ukuran potong 90 × 55 mm, bleed 3 mm di setiap sisi, dengan TrimBox dan BleedBox |
| [PNG CTO](renders/v2/ghufron-cto.png), [CEO](renders/v2/elroy-ceo.png), [belakang](renders/v2/belakang-layanan.png) | Render dari PDF pada area potong, 1063 × 650 px pada 300 dpi |

Di Canva, unggah PPTX dari beranda. Nama, jabatan, kontak, pengenalan, dan layanan adalah kotak teks. Logo warna dan latar masing-masing merupakan aset gambar. Sumber latar dapat diedit terpisah di `art-depan.svg` dan `art-belakang.svg`. Sesudah impor, cek ukuran 90 × 55 mm dan posisi teks. Jika mencetak dari Canva, pilih **PDF Print** dan sesuaikan bleed dengan spesifikasi percetakan.

Isi WhatsApp bisnis dan tautan LinkedIn yang sudah dikonfirmasi sebelum membagikan atau mencetak. Pakai URL LinkedIn pendek yang masih mudah diketik, misalnya dengan menanggalkan awalan protokol pada teks tampilan. `katalhys.com` mengikuti domain rencana di repositori; verifikasi alamatnya sebelum cetak. PDF ini adalah proof tata letak; belum diuji sebagai hasil cetak fisik atau dikonversi ke profil warna CMYK percetakan.

## Riset dan keputusan desain

- [MOO: kartu nama untuk networking](https://www.moo.com/blog/inspiration/tips-for-networking-events) menyarankan nama, jabatan/perusahaan, dan jalur kontak yang jelas. WhatsApp menjadi jalur percakapan, LinkedIn memberi tempat mengecek profil profesional, dan website memberi konteks studio. Dua kanal ini cukup untuk perkenalan; tidak perlu memenuhi kartu dengan ikon sosial.
- [MOO: panduan artwork](https://www.moo.com/uk/business-cards/design-guidelines) merekomendasikan teks minimal 8 pt, area aman, dan bleed. Ukuran 90 × 55 mm adalah pilihan paket ini; cocokkan ukuran dan bleed dengan vendor.
- [Canva: impor PowerPoint](https://www.canva.com/help/powerpoint-import/) mendukung pengeditan PPTX dan menjelaskan bahwa font dapat diganti saat konversi. [Panduan Canva untuk bleed dan crop marks](https://www.canva.com/help/margins-bleed-crop-marks/) menjelaskan pengaturan ekspor cetak.
- Depan memasangkan nama berukuran besar dengan simbol 09 warna asli dari `public/brand/katalhys-symbol.svg`. Garis kontur dan panel diagonal mengambil arah gerak dari lengkung simbol. Bidang navy di bawah memisahkan kontak dari identitas; warna cobalt pada belakang mengarahkan mata ke website.
- Belakang menjelaskan studio dan merangkum empat kategori dari `src/content/services.ts`. Setiap kategori punya contoh singkat supaya calon klien langsung melihat kaitannya dengan kebutuhan mereka. Arial dipilih untuk mengurangi ketergantungan pada font khusus saat impor.

## Render ulang

Ubah `kontak.json`, lalu jalankan dari root repositori. Gunakan Python dan Node dari runtime workspace Codex, Poppler `pdftoppm` pada PATH, dan Sharp yang sudah terpasang di repositori.

```powershell
& $cardNode promo/gambar/kartu-nama/render-canva.mjs $cardPython $cardNodeModules
```

`$cardPython`, `$cardNode`, dan `$cardNodeModules` adalah path Python, Node, dan direktori node_modules yang dikembalikan oleh alat dependensi workspace. Perintah ini memperbarui PPTX, PDF, dan PNG dari data yang sama. Render memeriksa batas dan lebar teks, jumlah halaman, ukuran potong PDF, teks yang dapat diekstrak, dan dimensi PNG.
