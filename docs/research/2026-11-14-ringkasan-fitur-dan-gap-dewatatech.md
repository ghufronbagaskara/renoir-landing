# Ringkasan fitur Katalhys dan perbandingan dengan DewataTech

**14 November 2026** · Branch `v2-katalhys-seo-lead-funnel` (sudah di-push, belum di-merge, belum di-deploy).
Sumber pembanding: [audit DewataTech](2026-11-10-dewatatech-audit-dan-roadmap-katalhys.md) (360 URL, peta fitur, kuis, audit, legal, cookie, SEO/GEO) dan pengamatan langsung menu DewataTech pada 13 November.

## 1. Yang sudah dibuat

### Penjualan dan lead

| Fitur | Isi | Halaman / file |
| --- | --- | --- |
| Kuis "Temukan langkah awal" | 7 pertanyaan: jenis bisnis, tujuan, kondisi saat ini, pertanyaan cabang sesuai tujuan, ukuran tim, waktu, anggaran tahap awal. Hasil muncul sebelum minta kontak: rekomendasi layanan, alasan, langkah pertama, yang perlu disiapkan, ukuran langkah awal (pemetaan / satu rilis fokus / bertahap), contoh masalah sesuai industri, agenda percakapan pertama, dan proyek nyata yang paling mirip. Tanpa harga. Bisa ubah jawaban, mulai ulang, dan lanjut dari jawaban terakhir di tab yang sama | `/id/mulai/`, `/start/` |
| Kirim ringkasan | Nama, perusahaan, pilihan balasan lewat email atau WhatsApp, catatan. Lolos Turnstile (anti-spam) dan rate limit 5 kiriman per menit per IP | sama |
| Penyimpanan lead | Database Cloudflare D1 sebagai catatan utama, plus notifikasi Telegram dan baris Google Sheet + email. Kiriman ganda tersimpan sekali | `/api/contact/` |
| Admin | Login email + kata sandi. Daftar lead dengan tab status dan jumlahnya, filter sumber, pencarian, halaman. Detail lead menampilkan semua jawaban kuis, status (baru → dihubungi → layak → menang/kalah), catatan, tanggal tindak lanjut, riwayat perubahan, hapus permanen. Menu akun untuk menambah admin, menonaktifkan admin lain, dan mengganti kata sandi | `/admin/` |

### Kepercayaan dan legal

| Fitur | Isi |
| --- | --- |
| Cara kerja dan garansi | Empat tahap dengan persetujuan, yang perlu disiapkan klien, aturan revisi, perbaikan bug 30 hari (definisi dan pengecualian), serah terima kode dan akses, yang tidak dijanjikan | `/id/cara-kerja/` |
| Kebijakan privasi, syarat, cookie | Draf yang sesuai alur data sebenarnya (Cloudflare, Telegram, Google), hak pengguna menurut UU PDP | `/id/privasi/`, `/id/syarat/`, `/id/cookie/` |
| Banner cookie | Tolak / Pilih / Terima semua, kategori analitik dan pemasaran, tombol "Pengaturan cookie" di footer. Pilihan tersimpan dan siap dibaca alat analitik nanti | semua halaman |
| Identitas badan usaha | Kolom PT/CV, NIB, alamat, email. Tampil di footer, halaman legal, dan data terstruktur begitu diisi | `src/data/site.ts` |

### Navigasi dan Home

| Fitur | Isi |
| --- | --- |
| Mega menu | Pola DewataTech: pertanyaan pemandu, kartu berikon dengan kalimat manfaat, badge "+ AI", kartu biru "Bingung mulai dari mana?", tautan bawah. Klik "Layanan" langsung ke halaman layanan |
| Tombol "Langkah awal" | Pill di header, seperti "Audit Gratis" di DewataTech |
| "Mulai dari sini" di Home | Empat kartu layanan dan tombol ke kuis, karya, cara kerja, proses, catatan, kontak. Hero punya tautan ke kuis |

### SEO dan GEO

- Data terstruktur: katalog layanan tanpa harga (OfferCatalog), WebApplication untuk kuis, FAQPage untuk cara kerja, plus identitas badan usaha saat diisi.
- `llms.txt` dan `llms-full.txt` memuat cara kerja, garansi, kuis, dan kemungkinan rekomendasinya dari sumber yang sama dengan halaman.
- Sitemap memuat semua halaman baru. robots.txt menutup `/admin/` dan `/api/`.
- Guard `check:seo` di CI: sitemap, canonical, hreflang, JSON-LD, judul/deskripsi unik, tautan llms.txt.

### Validasi dan perbaikan

- 28 unit test, 14 skenario E2E Worker (database D1 lokal, admin, kirim lewat browser ponsel dan desktop), 10 rangkaian tes Chrome desktop dan ponsel. Semua lolos. Dijalankan lokal dengan `bun run build` lalu `bun run test:browser`. Tes tidak berjalan di GitHub Actions sesuai permintaan.
- Bug yang ditemukan dan diperbaiki: admin dan form tanpa JS akan muncul 404 di Cloudflare; form selalu kena redirect 308; kiriman cepat gagal captcha; empat section Home dan satu fitur Work terlalu tinggi di ponsel.

## 2. Fitur DewataTech yang belum ada di Katalhys

Status: **Belum** = layak dibuat, **Tunggu Anda** = butuh data atau keputusan Anda, **Tidak perlu** = tidak cocok dengan layanan Katalhys.

### Analitik dan iklan

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| Google Analytics 4 | Tunggu Anda | Butuh akun GA4 dan Measurement ID. Pemuatnya tinggal membaca pilihan cookie yang sudah ada |
| Microsoft Clarity (rekaman sesi, heatmap) | Tunggu Anda | Butuh Project ID. Termasuk kategori analitik |
| Google Consent Mode | Belum | Dibuat bersamaan dengan GA4 |
| Pixel Google Ads, Meta, TikTok (+ kirim dari server) | Tidak perlu sekarang | Baru relevan kalau Katalhys beriklan |
| Analitik tanpa cookie (Vercel Analytics) | Tunggu Anda | Padanannya Cloudflare Web Analytics: gratis, tanpa cookie, cukup diaktifkan di dashboard |
| Simpan UTM / kode referral di sessionStorage | Belum | Supaya sumber kampanye ikut tercatat di lead dan admin |
| Event funnel (mulai kuis, lihat hasil, lead masuk, klik WA) | Belum | Dibuat bersama analitik |
| Search Console dan Bing Webmaster | Tunggu Anda | Butuh domain dan verifikasi pemilik |

### Konversi dan kontak

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| Tombol WhatsApp berisi konteks halaman/paket, gelembung "Butuh bantuan? Chat dengan kami" | Tunggu Anda | Kode siap, butuh nomor WhatsApp resmi |
| Kirim hasil kuis langsung ke WhatsApp | Tunggu Anda | Sama, butuh nomor |
| Telepon, WeChat, jam layanan, alamat | Tunggu Anda | Butuh data resmi |
| "Bandingkan dengan AI" (ChatGPT, Claude, Gemini, Perplexity, salin prompt) | Belum | Fitur kecil, cocok di halaman layanan |
| Bagikan / salin tautan | Belum | Kecil |
| Konsultasi gratis 30 menit sebagai CTA tetap | Tunggu Anda | Perlu keputusan apakah konsultasi gratis dan berapa lama |

### Harga dan paket

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| Halaman harga per layanan, harga awal, biaya perpanjangan | Tunggu Anda | Anda memilih tanpa harga. Bisa dibuka lagi kapan saja |
| Pembanding paket dengan tambah/hapus kolom | Tunggu Anda | Butuh paket resmi |
| Konfigurator paket (website, Meta Ads) | Tunggu Anda | Butuh paket dan harga |
| Care Plan / langganan perawatan | Belum | Layanan Deployment & care sudah ada; paket bulanan perlu keputusan kapasitas tim |
| Katalog resmi Markdown/JSON untuk mesin AI | Belum | Mudah dibuat dari data layanan yang sudah ada |

### Alat gratis

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| Audit website gratis (15 cek + skor PageSpeed) | Belum | Butuh kunci PageSpeed API dan perlindungan fetch URL. Disarankan setelah kuis terbukti menghasilkan lead |
| Kalkulator kebocoran komisi OTA / laba bulanan | Tidak perlu | Khusus villa |
| Padanan untuk Katalhys: kalkulator waktu kerja manual (pesanan × menit input ulang) | Belum | Disarankan di riset; cocok dengan layanan sistem internal |
| Audit listing OTA | Tidak perlu | Khusus villa |
| Template balasan WA, kit balas chat | Belum | Bisa jadi Catatan |
| Kartu QR dengan ekspor PDF/PNG | Tidak perlu | Tidak terkait layanan |
| Checklist bahan website, panduan akun pembayaran | Belum | Cocok sebagai Catatan atau unduhan |

### Bukti dan profil perusahaan

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| Testimoni dan logo klien | Tunggu Anda | Butuh izin klien |
| Studi kasus dengan angka hasil | Tunggu Anda | Butuh angka yang dikonfirmasi klien |
| Halaman tim, misi, sejarah, roadmap, mitra | Belum / Tunggu Anda | Halaman Tentang sudah ada; tim butuh foto dan persetujuan |
| Program referral | Tunggu Anda | Butuh aturan komisi |
| Video founder (TikTok/Instagram) | Tunggu Anda | Butuh video; promo video yang sudah ada bisa dipakai |
| Halaman FAQ terpisah | Belum | FAQ sudah ada di Home dan Proses |

### Legal tambahan

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| DPA (perjanjian pemrosesan data klien) | Belum | Perlu kalau Katalhys mengelola data pelanggan klien |
| Halaman cara bayar, kebijakan revisi, ketentuan kerja terpisah | Sebagian | Revisi dan ketentuan sudah di Cara kerja; cara bayar butuh data rekening dan termin |
| Garansi per produk | Sebagian | Garansi umum 30 hari sudah ada |

### Navigasi dan tampilan

| Fitur DewataTech | Status | Catatan |
| --- | --- | --- |
| Kotak pencarian di dalam menu, mode Simpel/Detail | Belum | Situs sudah punya pencarian di header |
| Peta situs HTML dengan filter | Belum | Kecil |
| Mode gelap | Belum | Butuh token warna gelap untuk seluruh situs |
| Halaman lokasi (Canggu, Ubud, ...) | Tidak perlu | Riset menunjukkan DewataTech sendiri memberi noindex |
| Layanan iklan, SEO, GEO sebagai produk | Tidak perlu sekarang | Katalhys belum menjual layanan ini |

### Admin (bukan fitur publik DewataTech, tapi disarankan riset)

| Fitur | Status |
| --- | --- |
| Ekspor CSV lead | Belum |
| Pengingat tindak lanjut (email/Telegram saat tanggal tiba) | Belum |
| Pembagian lead ke anggota tim | Belum |

## 3. Yang perlu Anda kerjakan

1. **Cloudflare**: login ulang profil Alchemy (OAuth lama kedaluwarsa), lalu jalankan `bun alchemy deploy --config stacks/github.ts --profile admin` agar token CI mendapat izin D1 Write.
2. **Admin pertama**: buat secret GitHub `ADMIN_SETUP_TOKEN`, deploy, buka `/admin/setup/`, buat akun. Hapus secret itu dan deploy ulang.
3. **Data bisnis** di `src/data/site.ts`: nama PT/CV, NIB, alamat, email, nomor WhatsApp resmi.
4. **Teks legal**: setujui Privasi, Syarat, Cookie, dan masa simpan lead 24 bulan.
5. **Notifikasi lead**: isi secret `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET`, lalu deploy versi baru Apps Script dari `scripts/leads-apps-script.gs`.
6. **Git**: merge PR v1 ke `main`, lalu buka PR v2 dan merge setelah dicek.
7. **Domain**: pastikan `katalhys.com`, sambungkan ke Cloudflare, tambahkan ke Turnstile.
8. **Analitik** (terakhir): buat GA4 dan/atau Clarity dan kirim ID-nya, aktifkan Cloudflare Web Analytics, verifikasi Search Console dan Bing.
9. **Keputusan bisnis**: harga publik atau tidak, konsultasi gratis atau tidak, izin testimoni dan logo klien, paket perawatan bulanan.
