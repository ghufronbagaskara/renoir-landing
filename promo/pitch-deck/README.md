# Pitch deck Katalhys

## Versi terbaru: v7

40 slide: 30 utama dengan target narasi 17 menit 49 detik dan 10 lampiran opsional.
`output/katalhys-pitch-id-v7.pptx` adalah salinan lanjutan dari **v6 yang sudah
diedit manual pemilik**, bukan regenerasi dari v5. Seluruh 39 identitas slide dan
teks v6 saat dilanjutkan dipertahankan, termasuk cover tanpa nama pendiri.

Hasil:

- `output/katalhys-pitch-id-v7.pptx`: master editable, satu grup beranimasi otomatis
  per halaman; transisi Fade 0,65 detik dan entrance Fade 0,55 detik, tanpa stagger
  atau klik tambahan untuk mengungkap objek
- `output/katalhys-pitch-id-v7.pdf`: 40 halaman statis yang sesuai dengan v7
- `output/panduan-presentasi-v7.md`: notes aktual dan jalur presentasi
- `output/katalhys-pitch-v7-lengkap.zip`: PPTX, PDF, panduan, dan folder modul sales
- `output/sales-playbook/`: HTML interaktif, PDF modul, dan lisensi ikon; pertahankan
  folder ini di samping PPTX agar tautan pada slide 40 tetap tersedia

V6 menyelesaikan empat arah riset: bukti proyek diperbesar, review/handover
diperjelas, halaman inquiry serta persiapan penggunaan sistem ditambahkan, dan
closing diarahkan pada scope awal. V7 mempertahankan hasil itu dan menambahkan
modul sales sebagai lampiran 40 dengan label data simulasi. Tidak ada nomor,
email, domain aktif, hasil bisnis, atau testimoni yang direka. Kontak di slide 30
tetap placeholder sesuai arahan pemilik dan harus diisi sebelum dibagikan.

Regenerasi lokal dari repo root (memerlukan sumber v6 lokal yang sama, modul PDF,
PowerPoint desktop, dan Poppler yang sudah tersedia):

```powershell
$deckNode = "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
$deckPython = "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe"
& $deckNode promo/pitch-deck/v7/prepare.mjs
pwsh -NoProfile -File promo/pitch-deck/v7/continue.ps1
& $deckNode promo/pitch-deck/v7/finalize.mjs
& $deckPython promo/pitch-deck/v7/check.py
```

Skrip menolak perubahan baseline yang belum ditinjau dan menolak menimpa output
final. Untuk revisi berikutnya gunakan nomor versi/nama baru. Objek di dalam grup
tetap editable; ungroup dapat memutus hubungan animasinya. Tautan modul bersifat
lokal, belum tautan publik; Office dapat menampilkan konfirmasi saat membuka file.

Paket, geometri, font, impor Artifact Tool, kontinuitas 39 slide, 40 animasi,
tautan pendamping dan PDF diperiksa. Semua halaman diekspor melalui PowerPoint
16.0, lalu diperiksa sebagai galeri; halaman yang berubah dan halaman padat yang
relevan juga diperiksa pada ukuran penuh. Slide Show desktop dibuka dan navigasi
serta lampiran diperiksa melalui UI. Ini bukan rehearsal 18 menit atau pengujian
setiap transisi secara interaktif. Canva, PowerPoint web, komputer lain dan
proyektor belum diuji. Tidak ada perubahan situs, database, dependensi, commit,
push atau deployment untuk lanjutan PPT ini. Detail: `REVISI-V7.md`.

## Arsip v5

Versi 5: 28 slide utama dan 9 lampiran, berbahasa Indonesia. Sasaran presentasi utama 17 menit 50 detik. Lampiran dimulai setelah penutup di slide 28. Positioning: AI Powered Software House.

## Hasil terbaru

- output/katalhys-pitch-id-v5.pptx — master editable dengan transisi dan animasi PowerPoint
- output/katalhys-pitch-id-v5.pdf — 37 halaman statis
- output/contoh-animasi-v5.mp4 — empat slide melalui renderer PowerPoint
- output/panduan-presentasi.md — speaker notes dan durasi
- COPY-V5.md: arah copy dominan Indonesia, istilah Inggris, dan pemeriksaan tanpa dash panjang
- REVISI-V4.md — distribusi proyek, pengisian data demo, provenance dan riset SVG
- AUDIT-2026-10-25.md — audit v2 dan arah v3, disimpan sebagai catatan historis

Gunakan master PPTX untuk Slide Show beranimasi. Panel gambar dan PDF bersifat statis. Panel chat lama belum tersinkron karena Artifact Session gagal diinisialisasi; file v5 adalah hasil terkini. Impor Canva belum diuji dan dapat mengubah font, notes atau motion. Versi terdahulu tetap diarsipkan.

## Source dan regenerasi

story.mjs menyimpan copy, aset per slide, kredit, sumber, notes dan durasi. Copy dominan bahasa Indonesia dengan istilah Inggris yang lazim. Em dash dan en dash dilarang pada copy editable serta notes; tanda hubung follow-up dan UI/UX tetap dipakai. build.mjs menyimpan komposisi, crop native dan pemeriksaan story. prepare.mjs menyiapkan gambar/logo/font. ornaments.mjs memakai definisi kurva yang sama untuk SVG transparan dan shape native PowerPoint. assets/ memuat screenshot asli, pasangan desktop/mobile, SVG dan lisensi ikon. Tidak perlu mengulang desain dari awal saat mengubah copy atau aset.

animate.ps1 mengaktifkan ShowWithAnimation, Push Left 0,85 detik di semua slide dan fade gambar 0,75 detik, dengan maju manual. Kurva latar dan teks bacaan tetap diam. finalize.mjs memeriksa paket, geometri, font dan impor. check.py memeriksa isi, kurva native, halaman, notes, efek dan PDF. motion-proof.ps1 membuat contoh video lewat PowerPoint.

```powershell
& "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe" promo/pitch-deck/build.mjs
pwsh -File promo/pitch-deck/animate.ps1
& "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe" promo/pitch-deck/finalize.mjs
& "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe" promo/pitch-deck/check.py
pwsh -File promo/pitch-deck/motion-proof.ps1
```

Skrip menolak menimpa kandidat animasi, laporan validasi, PPTX final dan motion proof. Untuk versi berikutnya, selaraskan nama v5 dalam skrip atau arsipkan output itu ke nama baru. PDF, panduan dan preview diperbarui. .build/ dan output/ diabaikan Git. Edit manual pada PPTX tidak otomatis tersalin ke kode.

## Bukti dan data

Tujuh proyek berasal dari portofolio pendiri. Studi profil ahli yang dikeluarkan pemilik tidak digunakan di deck; website/katalog publik tidak berubah. Kredit pekerjaan sebelum Katalhys dan saat bekerja di MAXY tetap dipertahankan. Nama Elroy masuk berdasarkan arahan pemilik, tanpa menebak jabatan atau riwayatnya.

Aplikasi internal dijalankan dengan database simulasi terpisah. Enam belas proyek Proteksindo telah diisi relasi material, pekerja, biaya, laporan dan absensi sebelum screenshot ulang. Lead tracker memakai build admin asli dan 12 lead sintetis dengan alamat example.test. Detail dan batas SQLite demo ada di REVISI-V4.md. Source aplikasi, database asli, dan layanan produksi tidak diubah.

Halaman publik MAXY AI dan Fanos Coatings direkam 25 Oktober 2026. Halaman Our Products/kategori legacy tidak digunakan pada slide. Tampilan terkini dapat memuat pembaruan setelah periode kerja pendiri; perubahan tersebut tidak diklaim sebagai pekerjaan baru Katalhys. Screenshot UI tetap gambar terpisah; teks, garis, shape dan kurva background tetap native. SVG Lucide tersimpan bersama lisensinya. Tidak ada React atau dependensi situs baru.

Transkrip menjadi referensi cerita penjualan. Harga, tenggat, SLA, ROI dan testimoni tidak direka. Tidak ada formulir publik yang dikirim, koneksi/token MCP baru, panggilan AI berbayar atau deployment.

## Pemeriksaan v5

37 slide, 400 objek teks editable, 99 objek gambar, 37 transisi dan 42 animasi gambar. Setiap slide mempunyai tiga kurva native. Font General Sans/Inter tertanam. PowerPoint 16.0 membuka, merender, menyimpan dan membuka ulang dengan efek yang sama. Pemeriksaan paket, geometri, kebijakan font, impor, isi dan PDF lulus tanpa temuan.

Seluruh slide diperiksa dari render native PowerPoint. Video 1280×720 memperlihatkan gerak Push. Slide Show interaktif, Canva, PowerPoint web, proyektor dan komputer lain belum diuji. Tidak ada perubahan website yang memerlukan build atau tes situs.

Dokumentasi motion: [ShowWithAnimation](https://learn.microsoft.com/en-us/office/vba/api/powerpoint.slideshowsettings.showwithanimation), [SlideShowTransition](https://learn.microsoft.com/en-us/office/vba/api/powerpoint.slideshowtransition), [CreateVideo](https://learn.microsoft.com/en-us/office/vba/api/powerpoint.presentation.createvideo).
