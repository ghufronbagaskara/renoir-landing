# Skills untuk revisi pitch deck Katalhys

Riset 24 Oktober 2026. Pemilik menilai deck awal terlalu plain dan meminta pencarian di skills.sh. Positioning deck kini **AI Powered Software House**. Bahasa Indonesia, satu deck umum untuk calon klien, PPTX editable, presentasi utama 15–20 menit. Sesudah riset, pemilik meminta instalasi dan penerapan langsung; tiga skill di bawah telah dipasang dan digunakan sebagai pedoman revisi.

## Kandidat yang diperiksa

| Skill | Temuan dari isi dan repo | Penilaian untuk pekerjaan ini |
| --- | --- | --- |
| [frontend-slides — zarazhangrui](https://www.skills.sh/zarazhangrui/frontend-slides/frontend-slides) | Sekitar 1,1 ribu instalasi pada halaman skills.sh; repo sekitar 31,2 ribu stars saat diperiksa. Menghasilkan HTML dengan animasi, eksplorasi gaya melalui preview, preset dan Bold Template Pack. [SKILL.md](https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/SKILL.md), [README](https://github.com/zarazhangrui/frontend-slides), [Bold Template Pack](https://github.com/zarazhangrui/frontend-slides/tree/main/bold-template-pack) | Kandidat pertama untuk eksplorasi visual dan ritme. Output utamanya HTML; tidak boleh menganggapnya menghasilkan PPTX native atau memindahkan animasi browser langsung ke PowerPoint |
| [sales-enablement — coreyhaines31](https://www.skills.sh/coreyhaines31/marketingskills/sales-enablement) | Sekitar 117,8 ribu instalasi; repo sekitar 56,3 ribu stars. Mencakup sales deck, alur demo, keberatan pembeli, studi kasus dan langkah berikutnya. [SKILL.md](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/sales-enablement/SKILL.md) | Kandidat pertama untuk struktur penjualan dan relevansi bisnis. Pedoman narasi, bukan mesin desain visual. Angka contoh di panduan tidak boleh menjadi klaim Katalhys tanpa bukti |
| [presentation-design — blisse-code](https://www.skills.sh/blisse-code/presentation-design-skill/presentation-design) | 45 instalasi; repo 0 stars/1 commit saat diperiksa. Pedoman editorial: hierarki warna, pasangan tipografi, motif khas, komposisi asimetris, variasi per jenis slide. [SKILL.md](https://raw.githubusercontent.com/blisse-code/presentation-design-skill/main/skill/SKILL.md), [repo](https://github.com/blisse-code/presentation-design-skill) | Isinya paling langsung membahas keluhan visual pemilik, tetapi adopsinya masih sangat terbatas. Gunakan sebagai kandidat panduan craft yang perlu dibuktikan dengan preview |
| [slide-design-skill — SlideSpeak](https://www.skills.sh/slidespeak/slide-design-skill/slide-design-skill) | 170 instalasi; repo 28 stars. Engine template HTML 1920×1080 dengan gaya dari brief/moodboard; gambar AI opsional memakai fal.ai. [README](https://github.com/SlideSpeak/slide-design-skill) | Kandidat pembanding untuk derivasi gaya dan layout. Belum membuktikan kebutuhan editable PPTX dan animasi native; tidak perlu mengganti pipeline yang sudah berhasil hanya untuk mencoba engine baru |
| [presentation-deck — owl-listener](https://www.skills.sh/owl-listener/designer-skills/presentation-deck) | Sekitar 3 ribu instalasi dan 3 ribu stars. Struktur hook, konteks, solusi, bukti dan ask; juga cakupan portfolio/case study | Berguna untuk susunan studi kasus; rincian art direction lebih terbatas daripada dua kandidat visual di atas |

Jumlah instalasi/stars merupakan snapshot, bukan ukuran mutu desain. Repo dan isi panduan diperiksa; kualitas output belum diuji secara komparatif.

## Kandidat yang tidak diprioritaskan

- [presentation-pitch-deck](https://www.skills.sh/aaronvanston/skills-presentations/presentation-pitch-deck) berfokus pada investor dan deck mandiri 10–15 slide. Repo lama diarahkan ke [creating-presentations](https://www.skills.sh/aaronvanston/agent-skills/creating-presentations). Kebutuhan Katalhys adalah perkenalan penjualan yang dipresentasikan langsung.
- [business-report-deck](https://www.skills.sh/jurgendn/agent-skills/business-report-deck) berfokus pada laporan keputusan/eksekutif; baru 4 instalasi dan repo 11 stars. Tidak menjadi pilihan pertama untuk portofolio software house yang membutuhkan visual lebih ekspresif.
- [ppt-generation — ByteDance](https://www.skills.sh/bytedance/deer-flow/ppt-generation) menyusun gambar hasil generasi per slide menjadi PPTX. Pendekatan gambar utuh tidak memenuhi kebutuhan teks dan objek deck tetap editable.

## Rekomendasi untuk revisi

1. `sales-enablement` membantu merapikan hubungan masalah pembeli, contoh alur, bukti proyek, proses kerja, dan langkah lanjut.
2. `frontend-slides` menjadi rujukan eksplorasi visual; `presentation-design` menjadi pembanding prinsip editorial. Palet/logo Katalhys dan General Sans/Inter tetap mengikuti identitas yang sudah ada kecuali pemilik meminta perubahan.
3. Rencana awal adalah membandingkan contoh cover, studi kasus, dan layanan. Pemilik kemudian meminta instalasi dan enhancement langsung, sehingga arah editorial diterapkan ke seluruh deck tanpa putaran persetujuan tambahan.
4. Setelah arah terpilih, terapkan pada source deck yang sama. Master tetap native PPTX melalui runtime presentasi + PowerPoint; HTML tidak dianggap setara dengan editable PPTX. Animasi PowerPoint tetap melalui `animate.ps1`.
5. Isi 38 slide, catatan pembicara dan aset asli tetap dapat digunakan; revisi tidak membutuhkan penyusunan ulang materi dari nol. Jangan mengartikan AI Powered Software House sebagai bukti semua proyek memiliki integrasi AI.

## Instalasi dan penerapan

```powershell
npx skills add https://github.com/coreyhaines31/marketingskills --skill sales-enablement
npx skills add https://github.com/zarazhangrui/frontend-slides --skill frontend-slides
npx skills add https://github.com/blisse-code/presentation-design-skill --skill presentation-design
```

Perintah `npx` di atas hanya referensi. Instalasi nyata memakai `skill-installer/scripts/install-skill-from-github.py` bawaan Codex, dengan repo/path: `coreyhaines31/marketingskills:skills/sales-enablement`, `zarazhangrui/frontend-slides:.`, dan `blisse-code/presentation-design-skill:skill`. Ketiganya berhasil dipasang pada `C:/Users/ghufr/.codex/skills/` dan SKILL.md dibaca sebelum revisi. Tidak ada paket atau lockfile situs yang berubah.

`sales-enablement` dipakai untuk hubungan kebutuhan, bukti, proses dan langkah lanjut; `frontend-slides` untuk ritme visual/motion; `presentation-design` untuk hierarki dan variasi komposisi. Output HTML bawaan skill tidak dipakai karena pemilik memilih PPTX editable. Tidak ada metrik contoh atau janji hasil yang disalin menjadi klaim bisnis.

Versi 2 berisi semua 38 slide dan telah diperiksa melalui render PowerPoint, pembukaan ulang, struktur PPTX, font, catatan dan PDF. Panel menampilkan 38 gambar pratinjau; file PPTX tetap native editable. Detail dan batas pemeriksaan berada di `promo/pitch-deck/README.md`. Pemilik tetap dapat meminta revisi desain dari source yang sama.

## Status deck ketika riset dimulai

Versi awal telah lulus pemeriksaan PPTX dan PowerPoint, tetapi arah visualnya belum diterima pemilik. Revisi visual di source `promo/pitch-deck/` dan kandidat lokal sudah dibuat sebelum permintaan riset ini, dengan positioning baru serta ilustrasi layanan yang sudah tersedia. Kandidat revisi belum melalui animasi/QA final dan belum menjadi deliverable yang disetujui. Laporan validasi pada README deck merujuk versi awal.
