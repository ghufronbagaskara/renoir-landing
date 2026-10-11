# Renoir: riset halaman dalam

11 Oktober 2026. Status: Internal Systems diterapkan ke source halaman layanan EN/ID setelah instruksi pemilik dan timer tiga menit. Moodboard, prototype terpisah, dan tiga storyboard lain tetap menjadi bahan review. Belum deploy.

## Buka hasilnya

- [Moodboard dan pemetaan komponen](index.html)
- [Percontohan Internal Systems, EN/ID](pilot.html)
- [Storyboard empat layanan](storyboards.md)
- [12 referensi dengan observasi, adaptasi dan screenshot](references.json)
- [Validasi aktual dan batas hasil](validation.md)

Preview melalui server statis dari root repo. Jangan membuka melalui file:// karena beberapa browser membatasi module scripts. Jalankan `node docs/design/inner-pages/serve.mjs`, lalu buka http://127.0.0.1:4391/docs/design/inner-pages/. Server ini tidak menjalankan API contact.

## Kesimpulan riset

Masalah utama adalah hubungan gambar dengan penawaran. Services tidak memiliki visual penjelas; detail layanan langsung membuka dengan bukti proyek sebelum pembaca mendapatkan model sederhana tentang layanan. Foto editorial About menjelaskan asal nama, tetapi bukan apa yang studio kerjakan. Diagram Notes justru sudah memiliki hubungan kuat dengan topik: tidak perlu mengganti seluruh gambar hanya untuk menyamakan efek 3D.

Rekomendasi: satu keluarga adegan 3D khusus empat layanan, dipasangkan dengan label HTML dan cerita gerak singkat. Screenshot Work tetap menjadi bukti yang terpisah. Riset visual bukan bukti bahwa konversi akan meningkat; pemahaman pengguna perlu diuji setelah review konsep.

Reading this as: halaman layanan untuk pemilik bisnis dan pengambil keputusan operasional, dalam bahasa creative studio berbasis mekanisme kerja. ENERGY 3 / RHYTHM 3 / MOTION 3. Gerak terkonsentrasi pada adegan penjelas, tanpa pinning dan scroll-jacking.

## Audit komponen dan prioritas

Audit menggabungkan pembacaan source dengan screenshot lokal. Pengukuran viewport adalah pemeriksaan teknis, bukan pengujian pengguna. Screenshot keadaan sekarang berada di `audit/`; hasil pemeriksaan di `audit/measurements.json`.

| Halaman / komponen | Fungsi dan keadaan sekarang | Masalah / peluang | Usulan dan prioritas | Mobile dan interaksi |
| --- | --- | --- | --- | --- |
| Services / ServiceList | Membantu memilih empat layanan; baris teks berselang dengan hover ink | Tidak ada gambar yang menjelaskan perbedaan penawaran; excerpt panjang menjadi pembeda utama | P0: empat penawaran berlabel jelas, masing-masing mempunyai adegan; satu preview aktif dengan link detail | Pilihan 2 x 2; tap dan keyboard setara; semua layanan tetap ada tanpa JS |
| Detail / pembuka | Breadcrumb besar lalu screenshot hero, baru heading dan intro | Bukti muncul sebelum konteks; preview desktop+phone menjadi kecil saat dipadatkan | P0: heading + intro pendek + adegan konsep, lalu bukti proyek | Headline sebelum gambar; adegan aktif diperbesar tanpa menghilangkan urutan |
| Marketing / media | MAXY AI dan Industrial Coatings | Screenshot menunjukkan hasil, tetapi jalur inquiry tidak dijelaskan | P0: website menuju inquiry; kaitkan satu bukti asli dengan fungsi navigasi/form yang memang ada | Jangan membuat teks UI menjadi bagian raster; caption tetap di luar gambar |
| Internal / media | Order & Field Sales dan Field Projects | Beberapa layar operasional memerlukan konteks lintas bagian | P0: satu pesanan melewati empat tanggung jawab, didampingi screenshot demo asli | Empat tahap dapat dipilih; layar asli bisa dibuka ukuran penuh |
| UI/UX / media | Expert Profile dan application AI CEO Circle | Dua situs belum menjelaskan keluaran layanan identitas dan desain | P0: elemen visual dan komponen menyusun interface; jelaskan UI/UX dapat dipesan terpisah | Susun hasil desktop/mobile secara berurutan; tidak pakai tilt untuk teks |
| Care / media | Diagram arsitektur sementara; capture Komodo menunggu akses | Diagram sendiri tidak menjelaskan deployment, monitoring dan pemulihan | P0: alur aplikasi live dengan cabang monitoring/backup; konsep diberi label | Urutan vertikal; jangan tampilkan uptime/health sebagai hasil pelanggan |
| Detail / included scope | Dua daftar panjang berdampingan dengan ContactForm | Semua poin mempunyai bobot serupa; penawaran dapat terasa seperti checklist template | P1: kelompokkan keluaran desain, build, handover; tautkan ke adegan yang sesuai | Satu kolom; form tetap memiliki field dan status yang ada |
| Engagements | Empat native details; satu terbuka; scope dan harga disepakati | Beberapa isi mengulang penawaran di ServiceList | P1: jadikan pemilih kebutuhan dan batas engagement; pertahankan native details | Disclosure dapat dibuka keyboard; semua scope mudah dibaca tanpa motion |
| FAQ + kontak layanan | Accordion produk dan form dengan source/build | Bukan area yang perlu efek showcase tambahan | P1: rapikan hierarki, lanjutkan pertanyaan spesifik layanan dan validasi yang ada | Tidak mengubah API, honeypot, Turnstile atau status submit |
| About / Name | Porselen, kampanye poster, pronunciation dan cerita nama | Tiga visual editorial bersaing, lebih kuat menceritakan nama daripada kerja studio | P2: kurangi repetisi; satu artefak craft dipasangkan dengan artefak hasil kerja | Cerita nama tetap konteks; jangan menganggap foto ilustrasi sebagai bukti historis |
| About / Facts + Fit | Counter fakta operasi dan dua kelompok fit | Counter bergaya metrik keberhasilan bisa salah dibaca tanpa konteks | P2: fakta operasi sebagai kalimat jelas; fit tetap decision aid | Tidak membuat statistik baru; daftar fit tetap visible |
| Process / storyboard | Empat diagram scope/design/code/delivery dan baris proses | Konsep relevan, tetapi gambar kecil dan tidak menyatakan keluaran tahap | P1: scope tertulis, desain disepakati, staging, URL+handover; setiap tahap punya keluaran | Urutan vertikal; varian khusus Process agar homepage tidak ikut berubah |
| Work / featured + catalog | Tiga featured, katalog delapan proyek, search/filter dan pair 9:5 | Full-page preview mengecilkan detail bermakna; pola berulang | P1: satu crop fitur bermakna sebagai pendamping pasangan utuh; anotasi tugas pengguna | Pertahankan filter URL, empty state, screen utuh dan link detail |
| Work detail / feature stories | Layar desktop/mobile ukuran penuh, konteks dan ordered feature screens | Kejujuran bukti sudah baik; hierarki visual bisa membedakan overview dan feature | P1: overview utuh, kemudian fitur dengan caption dan fokus tertentu | Link full-size dipertahankan; jangan menutup caption dengan floating CTA |
| Notes / index | Grid dua kolom, diagram lokal, filter dan sticky sidebar | Diagram menjelaskan topik tetapi label mungkin terlalu kecil pada thumbnail | P2: cover sederhana berfokus satu gagasan; label panjang pindah ke HTML | Satu kolom; filter, empty state dan sidebar menjadi flow biasa |
| Notes detail | Diagram pembuka, lead, artikel, share dan sidebar | Header/breadcrumb/diagram dapat menunda isi bacaan | P2: prioritaskan title dan lead; diagram menjadi penjelas di dekat pembahasan | Measure artikel tetap nyaman; diagram utuh dengan caption |
| Contact | Penjelasan + lokasi + satu form; WhatsApp bersyarat | Tidak memerlukan metafora 3D besar yang menunda pengisian | P2: jelaskan informasi yang perlu disiapkan dan apa langkah berikutnya, memakai fakta yang disetujui | Form satu kolom; jangan menambah multi-step dari referensi Stepper |
| Breadcrumb / footer / shared | Ink dan The Joint dipakai lintas halaman | Perubahan global berisiko mengganggu pekerjaan homepage | Varian inner-page saja jika perlu; scope tahap ini tidak menyentuh shared source | Pertahankan nav, locale switch, search dan aksesibilitas |

## Mengapa keputusan visual ini

- Cobalt menandai pesanan dan hubungan yang sedang dijelaskan, sesuai signal brand yang ada.
- Ink membentuk mekanisme, cool paper memberi ruang untuk membaca; shadow hanya membantu memahami kedalaman benda.
- GeneralSans dan Inter tetap dipakai karena sudah merupakan identitas Renoir dan tidak menambah font produksi.
- Adegan mempunyai satu alur, bukan koleksi simbol dekoratif; kamera tetap memudahkan membandingkan layanan.
- Komposisi halaman bervariasi menurut pekerjaan: penawaran, bukti layar, scope dan form tidak dibuat menjadi kartu identik.
- Gerak finite menunjukkan perpindahan tanggung jawab. Informasi tidak memerlukan autoplay untuk dimengerti.
- Referensi dipakai sebagai prinsip, bukan sumber artwork produksi. Screenshot pihak ketiga hanya untuk review lokal; hapus atau ganti sebelum menerbitkan paket ini secara publik.

## Handoff ke implementasi Astro

Tidak ada perubahan API publik pada tahap ini. Setelah konsep disepakati, gunakan komponen visual dengan input `serviceId`, `locale`, dan varian `catalog | detail`; data label/story berada di data lokal bilingual. Jangan menyimpan teks final di raster. Link detail dan contact berasal dari routing/i18n yang ada; source/build form tetap sama.

Default implementasi: WebP berlapis dan Web Animations API; IntersectionObserver mengatur lifecycle; tanpa React, WebGL atau dependency baru. Asset final harus diekspor per objek dengan kamera yang cocok: image percontohan sekarang adalah satu render datar, bukan layer 3D yang bisa memutar kamera/menekan lever secara nyata. Animasi prototype hanya memindahkan penanda pesanan dan mengganti fokus tahap. Jika diperlukan gerak mekanis, siapkan layer terpisah sebelum produksi.

Urutan produksi setelah review: Internal Systems, Marketing, UI/UX, Care; kemudian katalog Services. Scope halaman lain mengikuti prioritas audit. Tidak otomatis mengganti semua visual sebelum setiap fungsi mempunyai solusi yang lebih jelas.

## Hal yang perlu dinilai pemilik

Apakah metafora mekanisme pesanan menjelaskan software bisnis, atau terlalu menyerupai lini pabrik? Label dan status HTML membantu, tetapi jawaban ini harus diperiksa lewat review. Apakah keseimbangan ilustrasi dengan screenshot asli sudah cukup meyakinkan? Artwork dan motion saat ini adalah rancangan, bukan aset launch yang sudah disetujui.
