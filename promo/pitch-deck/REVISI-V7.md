# Lanjutan deck, 29 Oktober 2026

Baseline yang digunakan adalah v6 tersimpan terakhir, SHA256
`fbb14d99787c0149073b5ffcff520071788fe008d01f3a00dc967350f2d19d95`.
File ini berbeda dari kandidat v6 lama: pemilik mengganti kalimat cover,
menghapus nama pada cover, dan menyimpan perubahan teks/format slide layanan.
V7 menyalin baseline aktual itu. V5 dan v6 tidak ditimpa.

## Empat arah riset yang dipertahankan

| Arah | Bukti pada master saat ini |
| --- | --- |
| Perbesar bukti dan jelaskan konteks | Crop papan proyek, dashboard, tahap/PIC, serta baris lead pada 6, 12, 13, 16 |
| Perlihatkan bentuk review dan handover | Tahap kerja 23, contoh alur review 25, file/akses/panduan 26 |
| Tambahkan alur dan penggunaan sistem | Inquiry/follow-up 18 dan persiapan penggunaan 27 |
| Perjelas langkah berikutnya | Scope awal dan kontak placeholder pada 30 |

Riset sumber tetap `docs/research/pitch-deck-enhancement-2026-10-28.md`.
V6 mempertahankan seluruh 37 slide v5, memperbarui 12 komposisi, menambahkan dua
halaman, dan memakai 18 master ornamen SVG. V7 tidak mengulang perubahan tersebut.

## Tambahan modul sales

Slide 40 adalah lampiran opsional. Cuplikan berasal dari halaman 6 PDF modul
sales yang sudah dibuat, bukan dashboard rekaan. `prepare.mjs` merender halaman
tersebut dengan Poppler lalu membuat crop yang mempertahankan tabel benchmark,
skenario awal dan batas estimator. Teks di luar screenshot tetap editable.

Label data simulasi terlihat pada slide. Dua tautan menuju file HTML dan PDF di
folder pendamping `sales-playbook`, bukan ke localhost atau domain yang belum
dipublikasikan. Kedua file dan lisensi disertakan dalam paket ZIP. Bagian utama
tetap 30 slide dengan anggaran narasi 1.069 detik; tambahan ini tidak menambah
target durasi utama. Notes menerangkan konteks serta batas data.

## Animasi dan penyuntingan

Seluruh 40 halaman memuat satu grup visual dan satu entrance Fade dengan
`With Previous`, delay nol, durasi 0,55 detik. Transisi Fade berdurasi 0,65 detik
dan maju manual. Tidak ada efek `On Click` atau `After Previous` per objek.
Nama, teks, ikon, gambar, dan ornamen tetap terpisah di dalam grup sehingga dapat
diedit. Grup baru hanya dibuat pada lampiran; objek 39 halaman lama dipertahankan.

Font General Sans dan Inter mengikuti baseline serta tertanam dalam PPTX.
SVG logo dan ornamen memakai aset yang sudah tersedia. Tidak ada dependensi baru.

## Pemeriksaan

- Hash v6 tidak berubah; 39 slide ID dan teks lama cocok dengan baseline aktual
- 40 halaman PDF, 40 PNG native PowerPoint, 456 objek teks editable
- 40 grup halaman, 40 entrance serentak, 40 transisi, tanpa advance otomatis
- Paket, geometri, kebijakan font dan impor first-party lulus tanpa temuan
- Tautan lokal HTML/PDF tercatat dalam paket dan file pendamping cocok byte demi byte
- Galeri 40 slide diperiksa; cover, layanan, bukti baru dan komposisi padat terkait
  ditinjau pada ukuran penuh dari render PowerPoint
- File final dibuka di PowerPoint desktop dan Slide Show, dengan navigasi awal
  serta lampiran modul diperiksa melalui UI. Screenshot bukti ada di `.build/v7/`

Laporan geometri teks native menyimpan BoundHeight sebagai diagnostik; beberapa
grup warisan melaporkan tinggi dengan koordinat lokal yang berbeda dari halaman.
Temuan tersebut ditinjau melalui render, tidak dipakai untuk mengecilkan teks
atau mengubah layout yang sudah disetujui.

## Batas pemeriksaan

Belum rehearsal penuh, uji proyektor, Canva, PowerPoint web atau komputer lain.
Tautan dicocokkan dengan file lokal; pembukaan target lewat dialog keamanan Office
tidak diuji. Kontak WhatsApp/email masih placeholder. Browser bawaan Codex sempat
tidak tersambung pada giliran ini; tidak dibuka browser pengganti.

PowerPoint memerlukan eksekusi di sesi Windows pemilik untuk COM; percobaan di
sandbox biasa gagal sebelum perubahan dokumen. Percobaan berikutnya di sesi
tersebut berhasil. Salinan gagal awal hanya berada di build privat. Website,
source aplikasi, database dan layanan produksi tidak diubah.
