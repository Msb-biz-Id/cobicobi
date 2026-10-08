# 🎓 Portal Akademik & CMS Kampus Terpadu

> **Sistem Informasi Manajemen Konten & Portal Universitas Modern**  
> Dibangun dengan arsitektur tangguh berbasis **Laravel 12/13**, **Inertia.js v2**, **React 19**, dan **Tailwind CSS**. Mengusung standar performa tinggi, desain antarmuka modern (*rich aesthetics*), keamanan tingkat lanjut anti *brute-force*, serta sindikasi SEO otomatis.

---

## 🌟 Ikhtisar Sistem

Sistem ini dirancang khusus untuk memenuhi seluruh kebutuhan ekosistem perguruan tinggi, institut, maupun politeknik modern. Menyediakan pemisahan modular yang rapi antara **Portal Publik** yang informatif dan estetik dengan **Admin Suite** yang intuitif, aman, dan berdaya guna tinggi.

---

## 🚀 Fitur Unggulan

### 1. 🏛️ Kelembagaan & Struktur Akademik Dinamis
- **Fakultas & Program Studi**:
  - Halaman profil mandiri untuk setiap fakultas dan program studi.
  - Dilengkapi visi, misi, tujuan, prospek karir lulusan, akreditasi (Unggul/Baik Sekali), dan tautan media sosial resmi (termasuk TikTok).
  - Slider/koleksi dosen pengajar yang otomatis tampil pada halaman detail fakultas dan prodi terkait.
- **Unit Kerja, Lembaga & UPT**:
  - Profil lembaga penjaminan mutu, biro administrasi, perpustakaan, laboratorium terpadu, dan unit pelaksana teknis.
- **Master Data Jabatan Struktural Terpadu**:
  - Pengelolaan jabatan bertingkat yang fleksibel untuk Fakultas, Prodi, Unit, dan Ekstrakurikuler.
  - Penugasan dosen/tendik ke jabatan tertentu otomatis tersinkronisasi dan tampil di bio publik dosen yang bersangkutan.

### 2. 🏸 Fasilitas & Ekstrakurikuler (UKM)
- **Fasilitas Kampus**:
  - Katalog sarana dan prasarana (laboratorium riset, asrama mahasiswa, gedung olahraga, gedung pertemuan).
  - Integrasi penanggung jawab fasilitas dari data dosen/tendik.
- **Ekstrakurikuler (UKM)**:
  - Wadah minat bakat mahasiswa (olahraga, seni budaya, penalaran, keagamaan).
  - Terintegrasi penunjukan dosen pembina UKM yang otomatis tercatat pada profil dosen.

### 3. 👨‍🏫 Direktori Civitas: Dosen & Tenaga Kependidikan
- Direktori publik pencarian dosen berdasarkan nama, program studi, atau kepakaran.
- Halaman bio profil lengkap dosen dengan tautan Google Scholar, Scopus, SINTA, LinkedIn, dan media sosial.
- Pengelolaan riwayat publikasi ilmiah manual serta sinkronisasi otomatis sitasi.
- Portal mandiri bagi dosen untuk memperbarui biodata dan publikasi pribadinya.

### 4. 🖼️ Galeri & Lensa Kampus (Arsip & Single Lightbox)
- **Halaman Arsip Galeri (`/galeri`)**:
  - Filter kategori instan (Wisuda, Dies Natalis, Riset, Prestasi Mahasiswa, Kegiatan Kampus).
  - Pencarian real-time dan kartu album foto dengan efek zoom hover.
- **Halaman Single Galeri (`/galeri/{slug}`)**:
  - Dokumentasi foto lengkap beresolusi tajam.
  - **Interactive Fullscreen Lightbox Viewer**: Navigasi slideshow foto (dukungan keyboard panah kiri/kanan & tombol Escape), caption tiap foto, tombol unduh berkas asli, dan tombol bagikan tautan album.
  - Rekomendasi album terkait.

### 5. 📢 Pengumuman, Agenda & Berita
- **Pengumuman Resmi (`/pengumuman`)**:
  - Dokumen edaran rektorat, beasiswa, dan panduan akademik dengan berkas unduhan resmi serta pencatat jumlah unduhan (*download counter*).
- **Agenda & Jadwal Kegiatan (`/agenda`)**:
  - Kalender kegiatan kampus, seminar, konferensi, dan wisuda lengkap dengan status registrasi.
- **Berita & Warta Kampus (`/berita`)**:
  - Editor visual TipTap/WordPress modern dengan fitur workflow konten (`draft -> review -> approved -> published`), revisi/versioning konten, dan rollback versi.

### 6. 🧭 Sistem Navigasi & Menu (Melampaui WordPress)
- **Tiga Mode Tampilan**:
  1. **Menu Standar**: Tautan langsung dengan/tanpa ikon.
  2. **Dropdown Sub-Menu**: Menu melayang (*floating*) dengan transisi halus, badge, dan keterangan singkat.
  3. **Mega Menu Portal Kampus**: Drawer lebar berkolom (2, 3, atau 4 kolom) dengan ikon bergradasi, judul tebal, deskripsi penjelas, badge penanda, dan kotak promosi *Featured CTA*.
- **1-Click Quick Add / Auto-Populate**:
  - Tambahkan menu dalam satu klik langsung dari database Fakultas, Prodi, Unit, Fasilitas, UKM, Laman Statis, Kategori, Galeri, atau Tautan Utama.
- **Live Dynamic Auto-Source Sync**:
  - Sub-menu otomatis terisi langsung dari database secara real-time tanpa perlu admin mengedit ulang menu setiap ada jurusan/fakultas baru.
- **Ikon Dinamis**:
  - Pilihan visual Lucide Icons atau opsi **Tanpa Ikon** yang tetap simetris dan rapi.
- **Mobile Navigation Drawer**:
  - Tampilan accordion responsive untuk kemudahan akses smartphone.

---

## 🛡️ Keamanan & Standar Teknis

| Aspek Keamanan | Implementasi |
| :--- | :--- |
| **Batas Unggah Berkas** | **Maksimal 500 KB (`max:500`)** di seluruh sistem (pengumuman, galeri, media library, cover fasilitas/unit/prodi, avatar profil). |
| **Cloudflare Turnstile** | Proteksi anti brute-force dan anti-bot spam otomatis pada **Login, Register, Lupa Password, Reset Password, dan Form Kontak**. |
| **Sanitasi HTML & XSS** | Sanitizer ketat di backend untuk mencegah celah script berbahaya pada deskripsi dan konten editor. |
| **Bebas ID pada URL** | Seluruh rute publik menggunakan semantic slug bahasa Indonesia baku (misal: `/fakultas/{slug}`, `/program-studi/{slug}`, `/galeri/{slug}`). |
| **Optimasi Kueri (N+1)** | Eager loading relasi model di seluruh controller backend. |
| **Sindikasi SEO Otomatis** | **XML Sitemap** komprehensif (`/sitemap.xml`) dan **RSS 2.0 Feeds** multi-saluran (`/feed`, `/rss`, `/feed/berita`, `/feed/pengumuman`, `/feed/agenda`). |

---

## 💻 Tech Stack

- **Backend**: PHP 8.2+, Laravel 12/13, MySQL / MariaDB
- **Frontend**: React 19, Inertia.js v2, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React Icons
- **Security**: Cloudflare Turnstile API, Laravel Sanctum, Role-based Access Control (Spatie Permission model)
- **Editor**: TipTap Rich Text Editor

---

## 🛠️ Panduan Instalasi Lokal

### 1. Prasyarat
- PHP >= 8.2 dengan ekstensi `pdo_mysql`, `mbstring`, `fileinfo`, `gd`/`imagick`
- Composer 2
- Node.js >= 18 & NPM

### 2. Langkah Pemasangan

```bash
# 1. Clone repositori
git clone https://github.com/Msb-biz-Id/cobicobi.git
cd cobicobi

# 2. Pasang dependensi backend & frontend
composer install
npm install

# 3. Konfigurasi file environment
cp .env.example .env
php artisan key:generate

# 4. Konfigurasi database di file .env
# Sesuaikan DB_DATABASE, DB_USERNAME, dan DB_PASSWORD

# 5. Konfigurasi Cloudflare Turnstile di .env (Opsional - default menggunakan testing keys)
# CLOUDFLARE_TURNSTILE_ENABLED=true
# CLOUDFLARE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
# CLOUDFLARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# 6. Jalankan migrasi dan seeder data kampus
php artisan migrate --seed
php artisan storage:link

# 7. Kompilasi aset frontend
npm run build
# atau untuk mode pengembangan: npm run dev

# 8. Jalankan server lokal
php artisan serve
```

---

## 👤 Akun Masuk Bawaan (Seeder)

Password default seluruh akun: `password`

| Peran (Role) | Email | Akses Utama |
| :--- | :--- | :--- |
| **Superadmin** | `superadmin@cmslara.test` | Seluruh modul sistem, hak akses, & pengaturan web |
| **Admin** | `admin@cmslara.test` | Kelola civitas, fakultas, prodi, galeri, agenda |
| **Editor** | `editor@cmslara.test` | Publikasi dan tinjauan konten artikel & pengumuman |
| **Dosen / Tendik** | `dosen@cmslara.test` | Pengelolaan biodata mandiri dan publikasi ilmiah |

---

## 🧪 Menjalankan Pengujian (Automated Tests)

Seluruh modul telah dilengkapi pengujian otomatis Feature & Unit Test (100% PASS):

```bash
php artisan test
```

Uji pengujian spesifik:
```bash
# Pengujian Galeri & Mega Menu
php artisan test tests/Feature/GalleryAndMegaMenuTest.php

# Pengujian Batas Upload 500 KB & Cloudflare Turnstile
php artisan test tests/Feature/TurnstileAndUploadLimitTest.php

# Pengujian Struktur Akademik & Jabatan
php artisan test tests/Feature/AcademicStructureTest.php

# Pengujian Sitemap XML & RSS 2.0 Feed
php artisan test tests/Feature/SitemapAndRssFeedTest.php
```

---

## 📄 Lisensi
Hak Cipta © 2026. Dikembangkan untuk pengelolaan portal universitas dan sistem akademik terpadu yang andal dan aman.
