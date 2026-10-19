# Deploy Katalhys dengan Alchemy

GitHub Actions menjalankan Alchemy. IaC tetap berada di `alchemy.run.ts`; tidak ada jalur deploy Wrangler atau upload manual yang terpisah.

## Mengapa tiga run muncul

Repository memiliki satu workflow: `.github/workflows/deploy.yml`. Satu PR yang dibuka lalu di-merge dapat menghasilkan tiga run berikut.

| Event | Nama run baru | Tindakan Alchemy |
| --- | --- | --- |
| PR dibuka, diperbarui, atau dibuka kembali | Check and preview PR #N | Pemeriksaan, lalu deploy stage `pr-N` |
| PR ditutup, termasuk setelah merge | Clean up preview PR #N | Hapus stage `pr-N` saja |
| Commit masuk ke `main`, termasuk merge PR | Check and deploy production | Pemeriksaan, lalu perbarui stage `prod` |
| Run workflow secara manual pada `main` | Check and deploy production | Pemeriksaan, lalu perbarui stage `prod` |

Ini bukan tiga konfigurasi CI/CD yang saling menggantikan. Preview dan cleanup PR yang sama memakai antrean `alchemy-pr-N`; production memakai `alchemy-prod`. Deploy yang sedang berjalan tidak dibatalkan di tengah penulisan state. PR dari fork dan Dependabot tetap mendapat pemeriksaan kode, tetapi tidak deploy atau cleanup memakai kredensial Cloudflare.

## Temuan pada 17 Oktober 2026

- [Run production #6](https://github.com/ghufronbagaskara/renoir-landing/actions/runs/39037775569): test, type check, build, dan guard 45 halaman lolos. Deploy gagal saat membaca `WORKERS_DEV_SUBDOMAIN`.
- [Run preview #4](https://github.com/ghufronbagaskara/renoir-landing/actions/runs/39037742697) dan [cleanup #5](https://github.com/ghufronbagaskara/renoir-landing/actions/runs/39037762098) gagal karena `CLOUDFLARE_ACCOUNT_ID` tidak tersedia.
- Environment pada langkah deploy menunjukkan token, account ID, subdomain dan secret contact kosong. Ini membuktikan nilainya tidak tersedia pada run tersebut; belum membuktikan apakah belum dibuat, tersimpan pada environment lain, atau tidak diberi akses.
- Cleanup lama belum meneruskan `GITHUB_TOKEN`, padahal stack PR mengaktifkan provider GitHub untuk komentar preview. Workflow baru meneruskannya pada deploy maupun cleanup, dengan permission PR yang sama. Token ini disediakan otomatis oleh GitHub; tidak perlu membuat repository secret bernama `GITHUB_TOKEN`.
- Login Alchemy lokal memakai profil Cloudflare OAuth. Profil dan `.env` laptop tidak disalin ke runner GitHub. GitHub CLI serta profil GitHub Alchemy belum terautentikasi pada laptop yang diperiksa.

Pemberitahuan versi Alchemy baru dan compatibility flag bukan penyebab kegagalan ini. Pertahankan versi Alchemy/Effect yang dipasangkan di lockfile; tidak perlu upgrade untuk memperbaiki konfigurasi CI ini.

## Jika OAuth gagal atau Cloudflare menolak login

Gunakan `bun alchemy ...` dari folder repository karena CLI terpasang sebagai dependency lokal. Salin isi blok perintah saja; tanda backtick Markdown bukan bagian dari perintah PowerShell.

`profile refresh` mempertahankan metode, account dan scope yang tersimpan. Jika refresh dan login browser sama-sama gagal, hentikan proses yang masih menunggu dengan Esc, lalu konfigurasi ulang provider:

```powershell
bun alchemy profile edit --profile default --reconfigure Cloudflare
```

Pilih **API Token or API Key**, kemudian **API Token**, lalu masukkan token pada prompt password dan Account ID pada prompt berikutnya. Gunakan account yang sama dengan deployment sebelumnya. Ini tetap autentikasi melalui profil Alchemy; tidak memerlukan ekspor kredensial ke environment atau perpindahan ke Wrangler.

Jika belum mempunyai token, buat custom API token melalui [Cloudflare My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens), batasi ke account website, dan berikan permission yang dipakai stack aplikasi/state:

| Permission Cloudflare | Akses |
| --- | --- |
| Workers Scripts | Edit |
| Workers KV Storage | Edit |
| Workers R2 Storage | Edit |
| Account Settings | Edit |
| Secrets Store | Edit |
| Turnstile Sites | Edit |
| Workers Tail | Read |

Nama di UI dapat memakai label produk yang lebih pendek; deklarasi permission berada di `stacks/github.ts`. Permission Zone/DNS/Workers Routes juga diperlukan bila menambahkan custom-domain resource; stack aplikasi saat ini belum mengelolanya. Token deploy harian tidak perlu permission membuat API token. Untuk menjalankan stack setup CI, pakai profil admin terpisah seperti bagian berikutnya.

Jika tetap ingin mencoba OAuth, perintah reconfigure yang sama membuka pemilihan metode dan scope baru; **Basic Scopes** dapat dipakai sebagai percobaan login dengan scope lebih sedikit. Keberhasilan login itu belum membuktikan seluruh permission deployment tersedia. Pesan callback `Cloudflare did not authorize the request` saja belum membedakan penolakan pengguna, scope yang tidak diterima, maupun masalah client/session. Jangan menyimpulkan penyebab tertentu tanpa `error`/`error_description` yang sebenarnya; jangan membagikan authorization code, token atau URL OAuth lengkap.

Setelah profil disimpan, periksa metode dan account dengan:

```powershell
bun alchemy profile show --profile default
```

Perintah show menampilkan informasi profil dengan kredensial disamarkan; keberadaan profil bukan bukti deploy cloud sudah berhasil. Sebelum mengulang deploy production, lengkapi `.env` contact lokal karena nilai kosong akan ikut menjadi konfigurasi deployment.

## Setup satu kali melalui Alchemy

Jalankan bagian ini setelah pemilik menyetujui setup cloud. Perintah deploy setup membuat token CI dan konfigurasi repository; bukan memperbarui website production.

1. Pada `.env` lokal yang diabaikan Git, pastikan nilai berikut tersedia:

   ```dotenv
   WORKERS_DEV_SUBDOMAIN=yourname.workers.dev
   GITHUB_OWNER=ghufronbagaskara
   GITHUB_REPO=renoir-landing
   ```

   Gunakan hostname account Workers, tanpa `https://`, garis miring, atau nama Worker. Contoh alamat website `https://renoir.yourname.workers.dev` memakai nilai `yourname.workers.dev`.

2. Buat profil admin bila belum ada, lalu hubungkan Cloudflare dan GitHub lewat prompt Alchemy:

   ```powershell
   bun alchemy profile create admin
   bun alchemy profile edit --profile admin --add Cloudflare
   bun alchemy profile edit --profile admin --add GitHub
   ```

   Untuk Cloudflare pada profil admin, pilih **API Token or API Key**, kemudian **API Token**. Token setup harus dapat membuat account API token (`Account > Account API Tokens > Edit`) serta mengakses resource yang dikelola stack. OAuth tidak menyediakan permission pengelolaan API token yang dibutuhkan stack setup ini. Kredensial GitHub harus dapat menulis repository Actions secrets dan variables. Masukkan kredensial lewat prompt, bukan commit, chat, atau argumen command line.

3. Terapkan stack setup dengan account dan stage yang sama setiap kali mengulangnya:

   ```powershell
   bun alchemy deploy --config stacks/github.ts --profile admin
   ```

   Stack `renoir-landing-github` mengelola:

   | GitHub setting | Lokasi | Sumber |
   | --- | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | Repository secret | Scoped account token yang dibuat Alchemy |
   | `CLOUDFLARE_ACCOUNT_ID` | Repository secret | Account pada profil Cloudflare admin |
   | `WORKERS_DEV_SUBDOMAIN` | Repository variable | `.env` lokal |

   Token mencakup Workers, KV, R2, Turnstile dan akses Secrets Store yang dipakai state Alchemy. Permission Zone/DNS/Workers Routes yang sudah dideklarasikan dipisah ke policy zone dalam account yang sama, mengikuti format resource Cloudflare. Jangan menyalin profil OAuth laptop menjadi token CI. Untuk deploy lokal sehari-hari, tetap gunakan profil Alchemy; tidak perlu mengekspor token/account ID sebagai environment variable lokal.

4. Buka [Actions secrets](https://github.com/ghufronbagaskara/renoir-landing/settings/secrets/actions) dan [Actions variables](https://github.com/ghufronbagaskara/renoir-landing/settings/variables/actions), lalu pastikan nama-nama di atas ada. Workflow mendukung variable atau secret untuk account ID/subdomain; variable didahulukan. Jika ada keduanya, samakan nilainya atau hapus salinan yang sudah usang setelah diperiksa.

   Pakai **repository** secrets/variables. Workflow ini tidak menetapkan GitHub Environment bernama `prod` atau `production`, sehingga secret yang hanya ada pada Environment tersebut tidak otomatis dipakai.

5. Konfigurasikan setidaknya satu jalur contact yang lengkap sebagai repository secrets:

   - Telegram: `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID`.
   - Sheet/email: `LEADS_WEBHOOK_URL` dan `LEADS_WEBHOOK_SECRET`.

   Nilai contact tidak dicetak atau disalin otomatis dari profil. Semua nilai contact juga kosong pada run yang diperiksa. Tanpa satu sink yang lengkap, website dapat ter-deploy tetapi form akan gagal mengirim lead. Secret kosong pada deploy dapat mengganti konfigurasi contact lama; isi sebelum memperbarui production. Pemeriksaan `check-deploy-env.ts` memvalidasi konfigurasi deploy, bukan pengiriman contact atau hak akses token di API Cloudflare.

## Memperbarui website

Setelah setup selesai dan perubahan workflow ini telah masuk repository:

1. Commit perubahan website ke branch kerja dan push branch tersebut.
2. Buka PR menuju `main`. Workflow memeriksa test, tipe, build, link dan copy, lalu membuat preview `pr-N` untuk PR dalam repository ini.
3. Review preview dan merge PR. Commit pada `main` memicu deploy `prod`; run penutupan PR menghapus preview `pr-N` secara terpisah.
4. Tunggu run **Check and deploy production** berstatus sukses. Push yang berhasil hanya membuktikan kode masuk GitHub; website baru berubah setelah langkah deploy sukses.
5. Periksa URL yang dilaporkan Alchemy, halaman EN/ID, dan `GET /api/contact`. Untuk tes submit nyata, pastikan notifikasi Telegram/Sheet/email diterima.

Tidak perlu menjalankan deploy lokal setiap kali melakukan perubahan. Bila hanya konfigurasi secret yang diperbaiki, gunakan **Re-run failed jobs** pada run yang sudah memakai workflow baru. Run lama tetap memakai revisi workflow lamanya; khususnya workflow lama belum membaca repository variable `WORKERS_DEV_SUBDOMAIN`.

Untuk deploy ulang production tanpa perubahan kode, buka [workflow Deploy](https://github.com/ghufronbagaskara/renoir-landing/actions/workflows/deploy.yml), pilih **Run workflow**, lalu pilih branch **main**. Dispatch pada branch lain tidak menjalankan job production. Tombol tersedia setelah versi workflow dengan `workflow_dispatch` masuk `main`.

## Deploy manual dari laptop

Ini jalur cadangan yang tetap memakai stack, state dan account yang sama. Jalankan setelah pemilik menyetujui deploy; jangan bersamaan dengan deploy GitHub Actions.

```powershell
bun test
bun run check
bun run build
bun run check:links
bun run check:copy
bun alchemy deploy --stage prod
```

Gunakan profil Cloudflare dengan account yang sama seperti CI dan `.env` contact yang lengkap. Stack menyimpan state bersama melalui `Cloudflare.state()`, sehingga deploy berikutnya memperbarui resource yang sama selama **account + nama stack + stage + ID resource** tetap sama. Nama stack tetap `renoir-landing` dan nama Worker production tetap `renoir`; rebrand tidak mengubah identitas infrastrukturnya.

`bun alchemy deploy` tanpa `--stage prod` memakai stage personal bawaan, sehingga belum tentu memperbarui production yang dilayani CI. Jika deployment sebelumnya ada pada stage personal, jangan menghapus atau mengadopsinya secara otomatis; pastikan dulu URL mana yang sedang digunakan. Status deployment manual sebelumnya dilaporkan pemilik, tetapi belum diaudit langsung ke Cloudflare dalam perbaikan ini.

## Troubleshooting

| Pesan | Tindakan |
| --- | --- |
| `Alchemy CI configuration` menyebut nama yang hilang | Periksa nama dan scope repository secret/variable; `.env` lokal tidak cukup |
| `Expected string ... WORKERS_DEV_SUBDOMAIN` pada run lama | Masukkan workflow baru atau sediakan secret yang dibaca revisi lama; gunakan hostname account |
| `Missing required env: CLOUDFLARE_ACCOUNT_ID` | Jalankan setup credential CI atau perbaiki scope secret/variable account ID |
| Cloudflare `401`/`403` setelah konfigurasi ada | Periksa account, status token dan permission; keberadaan string bukan bukti autentikasi berhasil |
| State store perlu bootstrap/upgrade | Gunakan versi Alchemy yang dikunci; `--yes` pada workflow dapat mengizinkan bootstrap/upgrade state store. Token setup mencakup permission state yang diperlukan |
| Semua build sukses tetapi website lama masih terlihat | Pastikan langkah deploy sukses, stage `prod`, account dan URL yang diperiksa benar |

Cleanup hanya menerima format `pr-<angka positif>` dan menolak `prod`, stage personal, maupun input lain sebelum menjalankan destroy.

## Validasi dan referensi

`bun test scripts/check-deploy-env.test.ts` memeriksa konfigurasi kosong/invalid, perbedaan production/preview, token GitHub untuk provider PR, dan penolakan cleanup production. Tujuh tes konfigurasi dan 10 tes aplikasi lolos (17 total). Astro check pada 161 file: 0 error/0 warning, 5 hint lama. Production build dan guard link/copy pada 45 halaman lolos. Workflow YAML berhasil di-parse, kedua langkah cloud dipastikan memanggil guard terlebih dahulu, dan tiga kasus CLI terisolasi lolos tanpa API cloud. Belum menjalankan actionlint atau runner GitHub untuk patch baru. Pengujian lokal tidak membuktikan kredensial CI sudah dipasang atau deploy cloud berhasil.

- [Alchemy: CI/CD dengan scoped token dan shared state](https://alchemy.run/cloudflare/tutorial/part-5/)
- [Alchemy: refresh dan konfigurasi ulang profil](https://alchemy.run/environments/profiles/)
- [Cloudflare: pembuatan custom API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [GitHub: secrets, nilai kosong dan scope](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [GitHub: event pemicu workflow](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Cloudflare: pembuatan token dan scope account/zone](https://developers.cloudflare.com/fundamentals/api/how-to/create-via-api/)

Belum ada deploy, commit, push, rerun workflow, atau penghapusan resource yang dilakukan selama perbaikan ini.
