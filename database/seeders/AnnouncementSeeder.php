<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();

        $announcements = [
            [
                'title' => 'Pengumuman Pembukaan Pendaftaran Program Beasiswa Prestasi Bank Indonesia Tahun Akademik 2026/2027',
                'slug' => 'pembukaan-pendaftaran-program-beasiswa-prestasi-bank-indonesia-2026',
                'reference_number' => 'B/1042/UN4.1/KM.01.00/2026',
                'category' => 'Beasiswa',
                'target_audience' => 'Mahasiswa',
                'issuer' => 'Direktorat Kemahasiswaan & Alumni',
                'status' => 'published',
                'is_pinned' => true,
                'cover_image_path' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Diberitahukan kepada seluruh mahasiswa program Sarjana (S1) bahwa pendaftaran seleksi berkas Beasiswa Bank Indonesia telah resmi dibuka hingga 28 Februari 2026.',
                'content' => '<p>Berdasarkan Perjanjian Kerjasama antara <strong>Universitas Sains &amp; Teknologi Nusantara</strong> dengan Kantor Perwakilan Bank Indonesia, dengan ini kami umumkan pembukaan seleksi Beasiswa Bank Indonesia Tahun 2026.</p><h3>Persyaratan Umum:</h3><ul><li>Mahasiswa aktif program Sarjana (S1) minimal semester 3 dan maksimal semester 6.</li><li>Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.25 skala 4.00.</li><li>Tidak sedang menerima beasiswa dari institusi lain atau ikatan dinas.</li><li>Bersedia aktif dalam wadah Komunitas Generasi Baru Indonesia (GenBI).</li></ul><h3>Dokumen yang Harus Dilampirkan:</h3><ol><li>Formulir Biodata Pendaftaran Beasiswa BI (A.1).</li><li>Transkrip Nilai Akademik Asli legalisir BAAK.</li><li>Surat Keterangan Tidak Mampu (khusus jalur reguler) atau Surat Rekomendasi Fakultas.</li><li>Resume / CV &amp; Motivation Letter dalam Bahasa Indonesia.</li></ol><p>Seluruh berkas persyaratan wajib diunggah secara online pada portal kemahasiswaan sebelum batas akhir pendaftaran.</p>',
                'attachments' => [
                    [
                        'name' => 'Panduan_Resmi_Beasiswa_Bank_Indonesia_2026.pdf',
                        'path' => 'announcements/attachments/Panduan_Beasiswa_Bank_Indonesia_2026.pdf',
                        'size' => 1845200,
                        'type' => 'pdf',
                        'download_count' => 142,
                    ],
                    [
                        'name' => 'Formulir_Biodata_A1_Pendaftaran.pdf',
                        'path' => 'announcements/attachments/Panduan_Beasiswa_Bank_Indonesia_2026.pdf',
                        'size' => 524288,
                        'type' => 'pdf',
                        'download_count' => 88,
                    ],
                ],
                'published_at' => Carbon::now()->subDays(2)->setTime(8, 0),
                'expires_at' => Carbon::now()->addDays(20)->setTime(23, 59),
                'views_count' => 1420,
            ],
            [
                'title' => 'Jadwal Pengisian Kartu Rencana Studi (KRS) & Registrasi Akademik Semester Genap TA 2025/2026',
                'slug' => 'jadwal-pengisian-krs-registrasi-akademik-semester-genap-2026',
                'reference_number' => 'B/0812/UN4.1/PK.02.01/2026',
                'category' => 'Akademik',
                'target_audience' => 'Mahasiswa',
                'issuer' => 'Biro Administrasi Akademik & Kemahasiswaan (BAAK)',
                'status' => 'published',
                'is_pinned' => true,
                'cover_image_path' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Jadwal resmi pengisian KRS online via SIAKAD, masa konsultasi Dosen Pembimbing Akademik (DPA), serta periode revisi kartu studi (KPRS).',
                'content' => '<p>Diberitahukan kepada seluruh mahasiswa Universitas bahwa tahapan administrasi akademik Semester Genap TA 2025/2026 diatur sebagai berikut:</p><h3>Timeline Akademik:</h3><ul><li><strong>10 - 15 Februari 2026:</strong> Pembayaran Uang Kuliah Tunggal (UKT) via Virtual Account Bank Mitra.</li><li><strong>16 - 20 Februari 2026:</strong> Pengisian KRS Online dan Konsultasi DPA via SIAKAD.</li><li><strong>23 Februari 2026:</strong> Hari Pertama Perkuliahan Efektif Semester Genap.</li><li><strong>02 - 06 Maret 2026:</strong> Masa Perubahan Rencana Studi (KPRS) / Drop Mata Kuliah.</li></ul><p>Mahasiswa yang tidak melakukan KRS pada jadwal di atas wajib mengajukan cuti akademik sesuai ketentuan yang berlaku.</p>',
                'attachments' => [
                    [
                        'name' => 'Kalender_Akademik_Semester_Genap_2025_2026.pdf',
                        'path' => 'announcements/attachments/Jadwal_KRS_Semester_Ganjil_2026.pdf',
                        'size' => 2411724,
                        'type' => 'pdf',
                        'download_count' => 520,
                    ],
                ],
                'published_at' => Carbon::now()->subDays(5)->setTime(10, 0),
                'expires_at' => Carbon::now()->addDays(12)->setTime(16, 0),
                'views_count' => 3810,
            ],
            [
                'title' => 'Surat Edaran Rektor: Pedoman Pelaksanaan Yudisium dan Pendaftaran Wisuda Periode II 2026',
                'slug' => 'pedoman-pelaksanaan-yudisium-pendaftaran-wisuda-periode-ii-2026',
                'reference_number' => 'SE/044/UN4.1/AK.04/2026',
                'category' => 'Wisuda & Yudisium',
                'target_audience' => 'Mahasiswa',
                'issuer' => 'Wakil Rektor I Bidang Akademik',
                'status' => 'published',
                'is_pinned' => false,
                'cover_image_path' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Persyaratan bebas tanggungan perpustakaan, unggah karya ilmiah mandiri ke Repositori Institusi, serta validasi berkas ijazah nasional.',
                'content' => '<p>Berdasarkan keputusan Rapat Pimpinan Universitas, calon wisudawan periode II diwajibkan memenuhi syarat kelulusan dan mengunggah dokumen digital sebelum tanggal 15 Maret 2026.</p><p>Panduan teknis pengunggahan skripsi/tesis ke repositori dapat diunduh pada tautan lampiran di bawah.</p>',
                'attachments' => [
                    [
                        'name' => 'Surat_Edaran_Rektor_Wisuda_Periode_II.pdf',
                        'path' => 'announcements/attachments/Panduan_Beasiswa_Bank_Indonesia_2026.pdf',
                        'size' => 945200,
                        'type' => 'pdf',
                        'download_count' => 290,
                    ],
                ],
                'published_at' => Carbon::now()->subDays(7)->setTime(9, 30),
                'expires_at' => Carbon::now()->addDays(30)->setTime(23, 59),
                'views_count' => 1980,
            ],
            [
                'title' => 'Panggilan Partisipasi Program Magang & Studi Independen Bersertifikat (MSIB) Batch 7',
                'slug' => 'panggilan-partisipasi-program-msib-batch-7-kampus-merdeka',
                'reference_number' => 'B/1205/UN4.1/KM.04/2026',
                'category' => 'Karir & Rekrutmen',
                'target_audience' => 'Mahasiswa',
                'issuer' => 'Pusat Karir & MBKM Universitas',
                'status' => 'published',
                'is_pinned' => false,
                'cover_image_path' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Kesempatan magang profesional di mitra BUMN dan industri teknologi global dengan konversi hingga 20 SKS mata kuliah.',
                'content' => '<p>Pusat Pengembangan Karir mengundang mahasiswa semester 5 dan 7 untuk mendaftarkan diri pada program MSIB Batch 7. Tersedia pendampingan pembuatan Surat Rekomendasi (SR) dan Surat Pernyataan Tanggung Jawab Mutlak (SPTJM).</p>',
                'attachments' => [
                    [
                        'name' => 'Template_SPTJM_dan_Surat_Rekomendasi_MSIB.pdf',
                        'path' => 'announcements/attachments/Jadwal_KRS_Semester_Ganjil_2026.pdf',
                        'size' => 450120,
                        'type' => 'pdf',
                        'download_count' => 610,
                    ],
                ],
                'published_at' => Carbon::now()->subDays(10)->setTime(13, 0),
                'expires_at' => Carbon::now()->addDays(15)->setTime(23, 59),
                'views_count' => 2450,
            ],
        ];

        foreach ($announcements as $item) {
            Announcement::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    ...$item,
                    'user_id' => $admin?->id,
                ]
            );
        }
    }
}
