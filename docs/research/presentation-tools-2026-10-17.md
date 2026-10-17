# Riset tools presentasi bisnis kompleks
Tanggal: 17 Oktober 2026. Evaluasi dokumentasi resmi dan kemampuan lokal yang tersedia; belum menjalankan benchmark deck vendor, membeli paket, atau menghubungkan akun baru.

## Rekomendasi untuk Katalhys

**Gunakan authoring PPTX dengan objek native untuk hasil akhir yang sangat detail. Plus AI MCP adalah kandidat terkuat untuk flow generasi dan revisi melalui agent.** Jika business plan nanti memuat banyak grafik keuangan yang terhubung ke Excel, tambahkan PowerPoint + think-cell sebagai jalur penyuntingan akhir.

Ini rekomendasi berdasarkan kebutuhan Anda, bukan hasil pengujian komparatif kualitas deck. Kompleksitas harus dinilai dari struktur data dan kemudahan revisi, bukan jumlah ornamen atau slide.

## Perbandingan

| Tool / jalur | Kekuatan yang relevan | Batas yang perlu diuji | Peran yang disarankan |
| --- | --- | --- | --- |
| Authoring lokal dengan runtime presentasi yang tersedia | Kontrol ukuran/posisi, teks, tabel, grafik dan diagram editable; tidak perlu layanan generasi tambahan | Harus merancang tiap slide dan memeriksa hasil ekspor; workbook snapshot bukan formula atau tautan Excel hidup | Master deck Katalhys yang sangat spesifik |
| Plus AI MCP / Presentation Agent API | PPTX native, template sendiri, generasi dan revisi deck lewat agent; ada sesi lanjutan untuk menyunting hasil | Klaim vendor perlu dibuktikan pada diagram rumit dan tabel padat; MCP memerlukan akun/paket yang memenuhi syarat | Kandidat pertama untuk flow otomatis seperti flow gambar/video |
| PowerPoint + think-cell | Grafik waterfall, Mekko dan Gantt; tabel serta teks dapat terhubung ke Excel | Add-in berlisensi dan lingkungan Office desktop; bukan generator narasi business plan dari nol | Analisis keuangan, roadmap dan pembaruan angka |
| PowerPoint + Copilot | Membuat draft dari prompt/sumber dan memakai template yang dibuka | Fitur tergantung paket, akun dan rollout; draft masih harus diperiksa terhadap sumber | Draft struktur di lingkungan Microsoft |
| Gamma | Generasi cepat, API, ekspor PPTX; tabel kini dapat diekspor sebagai tabel editable | API belum menyunting gamma yang sudah ada; layout/chart dapat bervariasi dan sebagian efek memiliki fallback saat ekspor | Eksplorasi narasi dan draft visual |
| Beautiful.ai | Smart layout dan ekspor Editable PowerPoint | Ekspor editable membutuhkan Pro/Team/Enterprise; font perlu cocok; harus memilih mode ekspor yang benar | Draft konsisten dengan waktu desain lebih singkat |
| Canva | Penyuntingan visual dan kolaborasi, ekspor PPTX; konektor tersedia di sesi ini | Canva memperingatkan tampilan PPTX dapat berubah; native editability setiap jenis grafik/diagram perlu diuji | Moodboard dan penyuntingan visual bersama |

### Plus AI: paling dekat dengan kebutuhan flow agent

Dokumentasi MCP menyebut enam tool, termasuk membuat deck, mengunggah PPTX, menjalankan Presentation Agent, dan melanjutkan revisi pada sesi yang sama. Ini cocok untuk permintaan berulang seperti mengganti diagram slide tertentu sambil mempertahankan arah deck. Halaman API menyatakan hasilnya berupa PPTX native dan mendukung template sendiri serta slide kompleks. Itu **klaim kemampuan vendor**, bukan jaminan kualitas otomatis untuk semua business plan. [MCP resmi](https://plusai.com/features/mcp), [API resmi](https://plusai.com/features/powerpoint-api).

Pencarian direktori plugin pada sesi ini belum menemukan konektor Plus AI yang siap dipakai. Server MCP resminya ada, tetapi belum dikonfigurasi atau diuji di sesi ini. Tidak ada akun/paket yang dibeli atau dihubungkan.

### PowerPoint + think-cell: untuk angka yang harus terus konsisten

think-cell mendukung hubungan data Excel ke grafik, tabel, dan teks. Pembaruan dapat dikelola secara manual maupun otomatis. Dokumentasinya juga menjelaskan bahwa data terakhir tetap berada pada datasheet elemen, sehingga tidak semata bergantung pada workbook sumber yang sedang terbuka. Tipe grafik dan automasi ini relevan untuk bisnis yang perlu memperbarui forecast, arus kas dan milestone berulang. Saya menempatkannya sebagai pendamping penyuntingan keuangan, bukan pengganti perancangan isi. [Excel links](https://www.think-cell.com/en/resources/manual/exceldatalinks), [Pengelolaan links](https://www.think-cell.com/en/resources/manual/manage-data-links), [Grafik dan automasi](https://www.think-cell.com/en/product/dataautomation).

### Copilot, Gamma, Beautiful.ai dan Canva

Copilot dapat membuat draft menggunakan prompt atau file sumber serta template yang dipakai. Microsoft meminta hasilnya ditinjau; ketersediaan fitur perlu diperiksa pada akun yang nanti digunakan. [Dokumentasi Microsoft](https://support.microsoft.com/en-us/powerpoint/copilot/create-a-new-presentation-with-copilot-in-powerpoint).

Gamma mendukung PPTX dan sekarang menyediakan tabel editable secara default. Efek tertentu dan font masih memiliki perbedaan ekspor. Dokumentasi API menyatakan generasi menghasilkan gamma baru, bukan mengedit gamma lama; grafik/infografik dapat diminta lewat prompt, tetapi hasil bervariasi. Ini mengurangi kecocokannya untuk revisi presisi berulang pada satu deck. [Ekspor Gamma](https://help.gamma.app/en/articles/8022861-what-s-the-easiest-way-to-export-my-gamma), [Batas API](https://developers.gamma.app/reference/common-feature-requests).

Beautiful.ai menyediakan ekspor editable pada paket Pro, Team dan Enterprise, dengan perhatian pada font. Perlu menguji grafik dan diagram representatif setelah ekspor; label editable tidak membuktikan semua objek sesuai kebutuhan kita. [Ekspor editable](https://support.beautiful.ai/hc/en-us/articles/360035562031-How-do-I-export-as-an-editable-PowerPoint).

Canva memiliki ekspor PPTX melalui API, tetapi dokumentasi bantuan mengingatkan hasilnya bisa berbeda di PowerPoint. Konektor Canva terdeteksi sudah terpasang; akun dan kemampuan ekspor aktual belum diuji untuk riset ini. [Format unduhan](https://www.canva.com/help/download-file-types/), [API ekspor](https://www.canva.dev/docs/apps/rest-apis/reference/exports/create-design-export-job/).

## Kemampuan yang sudah tersedia di sesi ini

Runtime lokal `@oai/artifact-tool` terdeteksi terpasang. Panduan presentations mendokumentasikan authoring JavaScript dan ekspor PPTX, tabel native, chart beserta workbook data, dan diagram editable yang memang diminta. Ada tahap render/inspeksi serta pemeriksaan data. Tidak perlu memasang React, dependensi web, atau paket PPT ke repo landing.

Batasnya: workbook snapshot menyimpan nilai, bukan seluruh formula dan tautan ke spreadsheet sumber. Preview juga tidak membuktikan perilaku di PowerPoint/Google Slides. Saat membuat deck nanti, kita perlu mencoba edit, simpan, dan buka kembali objek representatif pada aplikasi tujuan.

Referensi lokal: skill `presentations/references/implementation.md` dan `presentations/references/native_evidence.md` pada runtime bawaan. Belum dibuat file PPTX pada tahap riset ini.

## Flow yang disarankan

1. Setelah Anda memberi isi, petakan audiens, keputusan yang ingin didorong, fakta, asumsi dan sumber.
2. Susun slide map dengan fungsi tiap slide; pisahkan presentasi utama dari lampiran detail.
3. Buat beberapa slide uji yang paling sulit menggunakan data yang Anda berikan: model pendapatan/biaya, diagram AI dalam operasi, matriks layanan dan studi proyek.
4. Bandingkan authoring lokal dan Plus AI jika konektornya sudah disiapkan. Nilai keterbacaan dan editability, bukan sekadar kecepatan membuat draft.
5. Bangun deck dengan identitas Katalhys, screenshot proyek asli dan ilustrasi yang diperlukan. Angka bisnis tidak boleh direka.
6. Render seluruh slide, periksa teks/tumpang tindih serta angka, lalu uji objek native pada PowerPoint. Hasil akhir: PPTX editable, PDF peninjauan, dan sumber authoring bila dibuat lokal.

## Kriteria lolos uji sebelum memilih vendor

- Angka satu sel tabel dapat diganti tanpa mengganti seluruh gambar
- Data series dan kategori chart dapat diedit; tanda negatif, satuan dan pembulatan benar
- Node dan konektor diagram penting dapat dipindah secara terpisah
- Judul panjang Bahasa Indonesia tetap muat dan terbaca
- Revisi satu slide tidak merombak slide lain yang sudah disetujui
- Font, screenshot dan master layout bertahan setelah simpan/buka ulang di PowerPoint
- Data bisnis, sumber dan asumsi tetap dapat ditelusuri

Harga sengaja belum dijadikan pembanding: belum ada kebutuhan jumlah deck, lisensi atau volume API. Validasi paket dan biaya dilakukan setelah memilih jalur dan sebelum pembelian.
