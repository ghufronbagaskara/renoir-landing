# Integrasi Internal Systems

11 Oktober 2026. Diterapkan ke source dan production build lokal; belum deploy.

Pemilik meminta timer tiga menit lalu penerapan. Timer dimulai 11:54:20 WIB; perubahan source dimulai setelah 11:57:20 WIB. Pembacaan repository dilakukan selama menunggu. Cakupan pertama yang dinyatakan sebelum integrasi: percontohan Internal Systems EN/ID. Tiga layanan lain dan halaman lain masih mengikuti rancangan riset, belum diimplementasikan.

## Perubahan

- `src/components/sections/services/InternalFlow.astro`: pembuka, adegan ilustratif, empat label HTML, CTA ke form existing dan kontrol native.
- `src/scripts/internal-flow.ts`: delapan detik sekali, tahap dapat dipilih, play/pause/replay, pause di luar viewport atau pada visibility event. Tidak menambah GSAP atau framework island.
- `src/styles/components/_internal-flow.scss`: layout 390/768/1440, focus keyboard eksplisit, mobile crop, reduced motion, serta kontras breadcrumb dan bobot judul khusus halaman Internal Systems. CTA mengambang disembunyikan pada halaman ini; CTA dalam halaman tetap menuju form.
- `src/assets/img/services/internal-flow/`: enam WebP milik Renoir dari konsep yang telah direview. Label, logo dan UI tidak berasal dari AI.
- `src/views/ServiceView.astro`: integrasi hanya untuk entry `internal-systems`, proof asli tetap ditampilkan sesudah ilustrasi. Screenshot proof kini lazy karena berada di bawah panggung. URL, metadata, schema, locale, FAQ, form source/build dan API dipertahankan.
- AGENTS dan paket riset diperbarui. Script prototype dijadikan module supaya tidak berbenturan dengan global TypeScript.

Gambar merupakan satu render datar dan empat focus crops. Marker alur bergerak dengan transform; crop mobile berganti opacity. Ini tidak menggerakkan mesin 3D atau paket fisik. Semua keterangan terlihat tanpa JavaScript. Gambar gagal menampilkan pesan dan menghentikan kontrol.

## Verifikasi aktual

| Pemeriksaan | Hasil |
| --- | --- |
| `bun run check` | PASS, 0 errors / 0 warnings, empat hint pada file existing di luar integrasi |
| `bun test` | PASS, 9 tes contact |
| `bun run build` | PASS, 45 halaman terindeks |
| `bun run check:links` / `bun run check:copy` | PASS, masing-masing 45 halaman |
| Prettier TS/SCSS/script QA + `git diff --check` | PASS |
| `validate-integration.mjs` pada built site | PASS, 11 kelompok: EN/ID pada tiga viewport, semua tahap, keyboard/focus, replay/pause, finite playback, viewport pause, fallback dan isolasi halaman lain |
| Source homepage / BaseLayout / global site SCSS | Hash sebelum/sesudah sama |

Handler visibility diuji dengan event sintetis karena headless tidak konsisten mengubah document visibility saat berpindah tab. Ini tidak diklaim sebagai verifikasi tab native pada semua browser. Server asset lokal tidak menjalankan API contact; pengiriman ke sink nyata belum diuji/deploy.

Screenshot final: `qa/integrated-final-{en,id}-{390,768,1440}.jpg`. Data QA: `qa/integration-results.json`. Runtime inline khusus halaman ini 2,217 byte raw / 964 byte gzip, tidak ada pada Home atau Marketing Sites (`qa/integration-assets.json`). Enam aset scene/crop total 137,088 byte; bukan semuanya harus dimuat pada setiap viewport.

## Lighthouse mobile

Lighthouse 13.5.0, default mobile simulated throttling, production build melalui server asset lokal. EN dan ID dijalankan berurutan sesudah QA selesai. Laporan lengkap dan ringkasan di `qa/lighthouse-shipped-*.json` / `qa/lighthouse-summary.json`.

| Locale | Performance | Accessibility | CLS | TBT | LCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| ID | 97 | 100 | 0 | 0 ms | 2.404 s |
| EN | 98 | 100 | 0 | 0 ms | 2.176 s |

Target lokal >=95 / CLS 0 / TBT <100ms terpenuhi pada kedua run final. Run awal integrasi ID 92 / 96 / CLS 0 / TBT 0 sebelum pembenahan font judul, prioritas proof dan kontras breadcrumb. Ini bukan baseline sebelum integrasi; regresi terhadap versi sebelumnya belum dapat dihitung. Skor bukan jaminan hasil hosting atau CWV pengguna nyata.

## Delivery gate

Hard Gate PASS: kontrol berfungsi, static/error states diuji, screenshot asli tetap proof, tidak ada klaim hasil pelanggan baru. Purpose PASS: material/cerita dan cobalt berasal dari brief; setiap tahap menjelaskan satu tanggung jawab. Liveliness PASS: ENERGY 3 / RHYTHM 3 / MOTION 3 tetap, gerak finite terfokus pada penjelasan order. Craftsmanship PASS: EN/ID, responsive, keyboard dan fallback diuji; Lighthouse accessibility 100 pada EN/ID. Penilaian estetika metafora conveyor dan izin proyek sebelum peluncuran tetap mengikuti catatan riset.
