# Copy v5

Revisi 25 Oktober 2026. Scope perubahan: copy slide dan speaker notes, dengan aset, komposisi, kurva SVG, ikon, kredit proyek, serta animasi v4 dipertahankan.

## Arah bahasa

Penjelasan dominan bahasa Indonesia, dengan nada profesional yang bisa disampaikan dalam percakapan. Istilah Inggris dipakai ketika lebih lazim dalam pekerjaan yang dibahas: website, landing page, dashboard, UI/UX, user flow, wireframe, interface, prototype, deployment, maintenance, monitoring, backup, scope, staging, source code, lead tracker, follow-up, dan approval.

Kalimat yang sudah jelas tetap dipakai. Judul cover, cerita asal Katalhys bersama Ghufron dan Elroy, serta konteks pengalaman pendiri tetap ada. Bahasa Inggris tidak dipaksakan menjadi satu kalimat penuh jika penjelasan Indonesia lebih mudah diikuti. Tidak ada em dash atau en dash pada copy editable maupun speaker notes. Tanda hubung dalam istilah follow-up dan garis miring pada UI/UX tetap digunakan.

## Contoh perubahan

| Sebelumnya | Revisi |
| --- | --- |
| Pesanan berpindah bagian / Konteksnya tetap tersambung | Pesanan berpindah tim / Statusnya tetap jelas |
| Produk terpilih menjadi bahan inquiry | Inquiry disertai detail produk dan proyek |
| Website terhubung ke tindak lanjut sales | Lead dari website siap ditindaklanjuti |
| Antarmuka mengikuti pekerjaan penggunanya | Desain mengikuti cara pengguna bekerja |
| Catatan aktivitas menjadi bahan tinjauan | Aktivitas kerja lebih mudah ditinjau |
| Pilih satu prioritas untuk kita bahas | Bagian mana yang ingin Anda perbaiki lebih dulu? |

Speaker notes pada 28 slide utama ditulis ulang sebagai bahan berbicara: menjelaskan alur, mengaitkannya dengan kebutuhan klien, dan memberi ruang untuk pertanyaan. Kredit pekerjaan sebelum Katalhys, penggunaan data simulasi, sifat opsional AI, serta batas akses tetap dijelaskan. Lampiran tetap tersedia untuk pembahasan scope, kepemilikan dan biaya.

## Regenerasi dan pemeriksaan

story.mjs menyimpan copy, notes, aset dan sumber. build.mjs memuat beberapa label khusus layout serta guard tanpa dash panjang. Label website, UI/UX dan lead tracker sekarang membaca rows dari story.mjs agar revisinya konsisten. check.py memeriksa teks slide dan notes pada PPTX final untuk em dash serta en dash.

Default output skrip sekarang v5. V4 tetap menjadi arsip. Total tetap 37 slide: 28 utama dan 9 lampiran, dengan sasaran durasi 17 menit 50 detik. Durasi ini sasaran presenter, bukan hasil rehearsal. Isi screenshot adalah bukti aplikasi asli dan tidak ditulis ulang. Guard tanda baca memeriksa copy editable dan notes, bukan teks dalam pixel screenshot.

Skill yang diterapkan: anti-slop-writing-id dan antislop-copywriting. Prinsip yang digunakan adalah kalimat langsung, makna konkret, istilah yang wajar bagi pembaca, dan pemeliharaan fakta sumber. Tidak ada klaim bahwa tulisan telah lolos detektor AI.
