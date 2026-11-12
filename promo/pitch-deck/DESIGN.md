# Arah revisi Katalhys

Arahan pemilik: **AI Powered Software House**, deck penjualan berbahasa Indonesia untuk presentasi langsung 15–20 menit. Logo 09 dan warna Katalhys tetap menjadi identitas; visual harus lebih menarik daripada susunan teks dan screenshot yang berulang.

## Sistem visual

- **Permukaan:** ink `#17191C` menjadi dasar utama untuk pembuka, cerita, dan bukti tertentu; putih/paper untuk layar yang perlu ruang baca; cobalt `#1D4ED8` menandai pergantian bagian dan jalur layanan. Cyan tetap milik simbol asli.
- **Tipografi:** General Sans untuk display 45–89 px dan label utama; Inter untuk penjelasan 18–25 px. Headline singkat tanpa titik penutup. Keterbacaan mengalahkan kepadatan.
- **Aksen:** cobalt membawa navigasi cerita dari konteks ke kemampuan, lalu bukti dan langkah berikutnya. Hindari memberi warna pada setiap kata atau menambah warna baru untuk ornamen.
- **Motif:** jalur terbuka dari simbol asli Katalhys, diekspresikan melalui pembagian bidang dan ruang antara konten. Simbol tidak digambar ulang; ukuran dan posisinya bervariasi sesuai jenis slide.
- **Bukti:** gambar asli proyek; beberapa showcase website memakai potongan bagian atas layar untuk membuat antarmuka dominan. File gambar asli tetap tertanam dan studi lain mempertahankan pasangan desktop/mobile. Tidak ada chart ROI, testimoni, atau angka hasil yang direka.
- **Batas:** hindari slide putih seragam, tiga layout berulang berurutan, bullet panjang, teks berukuran kecil, gradien dekoratif, dan efek gerak pada semua kalimat.

## Komposisi

Pembuka menampilkan Fanos superadmin dan sales mobile berdampingan. Slide 4 menjelaskan asal Katalhys dan mengenalkan Ghufron bersama Elroy. Slide 6 memakai papan Proteksindo dengan seluruh tahap berisi proyek simulasi yang sudah dilengkapi relasi material, pekerja, biaya, laporan dan absensi. Layanan memakai komposisi berbeda: papan proyek, MAXY AI, ponsel, diagram deployment dan konektor MCP sales. Slide 16 memakai lead tracker admin asli dengan lead sintetis, menggantikan Our Products/kategori legacy. Tujuh studi memakai fokus visual sesuai alurnya. Portofolio situs ahli tidak digunakan. Rincian revisi dan sumber: REVISI-V4.md; audit historis: AUDIT-2026-10-25.md.

Atas arahan pemilik, background mendapat tiga kurva terbuka yang menggemakan bidang lengkung logo, dengan warna samar sesuai permukaan. ornaments.mjs menghasilkan SVG transparan serta shape native dari koordinat yang sama. Ikon Lucide dipilih untuk layanan dan berkas serah terima, dengan lisensi lokal; tidak ada React atau paket situs baru. Kurva dan teks tetap diam, di belakang screenshot serta judul.

Ilustrasi konseptual tidak menggantikan screenshot sebagai bukti. Foto atau UI tidak pernah dianggap hasil baru dari Katalhys hanya karena digunakan pada deck.

## Motion

Push Left 0,85 detik pada seluruh perpindahan, fade gambar 0,75 detik. Header dan teks bacaan tetap stabil. ShowWithAnimation diaktifkan dan diperiksa sesudah file dibuka ulang. Presenter mengendalikan pergantian dengan klik. PDF dan panel gambar statis. Contoh gerakan tersedia sebagai video hasil renderer PowerPoint.

## Skill yang diterapkan

Terpasang 24 Oktober 2026 di `C:/Users/ghufr/.codex/skills/`:

- `sales-enablement`: konteks masalah pembeli, cerita alur, bukti yang dapat dipertanggungjawabkan, dan langkah lanjut
- `frontend-slides`: eksplorasi komposisi, ritme dan motion; panduan visual diadaptasi ke PPTX, bukan mengganti deliverable menjadi HTML
- `presentation-design`: hierarki, motif, asymmetric balance, satu titik perhatian, dan variasi komposisi

Kebutuhan pemilik mendahului contoh atau default dalam skill. Tidak ada angka contoh dari skill yang dipakai sebagai klaim hasil. General Sans/Inter dan format PPTX dipertahankan meskipun beberapa default skill menyarankan font atau format lain.
