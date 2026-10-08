<?php

namespace Database\Seeders;

use App\Models\StaffProfile;
use App\Models\StaffPublication;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffProfileSeeder extends Seeder
{
    public function run(): void
    {
        $dosenUser1 = User::firstOrCreate(
            ['email' => 'budi.santoso@univ.ac.id'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'dosen',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $dosenUser2 = User::firstOrCreate(
            ['email' => 'siti.aminah@univ.ac.id'],
            [
                'name' => 'Siti Aminah',
                'password' => Hash::make('password'),
                'role' => 'dosen',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $tendikUser = User::firstOrCreate(
            ['email' => 'rina.marlina@univ.ac.id'],
            [
                'name' => 'Rina Marlina',
                'password' => Hash::make('password'),
                'role' => 'tendik',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 1. Professor Budi Santoso
        $prof = StaffProfile::updateOrCreate(
            ['slug' => 'prof-budi-santoso'],
            [
                'user_id' => $dosenUser1->id,
                'type' => 'dosen',
                'name' => 'Budi Santoso',
                'front_title' => 'Prof. Dr. Ir.',
                'back_title' => 'M.Sc., Ph.D., IPU.',
                'nidn' => '0012057801',
                'nip' => '197805122002121001',
                'gender' => 'L',
                'faculty' => 'Fakultas Ilmu Komputer & Teknologi Informasi',
                'study_program' => 'S1 Teknik Informatika',
                'academic_position' => 'Guru Besar / Profesor',
                'structural_position' => 'Kepala Pusat Riset Artificial Intelligence',
                'employment_status' => 'Dosen Tetap ASN',
                'expertise' => ['Artificial Intelligence', 'Deep Learning', 'Computer Vision', 'Medical Image Computing'],
                'bio' => '<p><strong>Prof. Dr. Ir. Budi Santoso</strong> adalah Guru Besar dalam bidang Kecerdasan Buatan dan Pengolahan Citra Digital pada Fakultas Ilmu Komputer. Beliau aktif memimpin berbagai proyek riset nasional dan internasional yang didanai oleh Kemendikbudristek dan mitra industri teknologi.</p><p>Fokus penelitiannya mencakup penerapan arsitektur transformer untuk deteksi dini penyakit berbasis citra biomedis radiologi dan MRI.</p>',
                'education_history' => [
                    ['degree' => 'S1', 'institution' => 'Institut Teknologi Bandung (ITB)', 'major' => 'Teknik Elektro', 'graduation_year' => 2000],
                    ['degree' => 'S2', 'institution' => 'Nanyang Technological University (NTU)', 'major' => 'Computer Science', 'graduation_year' => 2004],
                    ['degree' => 'S3', 'institution' => 'The University of Tokyo', 'major' => 'Information Science & Technology', 'graduation_year' => 2008],
                ],
                'office_address' => 'Gedung Rektorat Lt. 4, Ruang Lab AI Nusantara',
                'email' => 'budi.santoso@univ.ac.id',
                'phone' => '+62 811-2345-6789',
                'avatar_path' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=budi_santoso_sample',
                'google_scholar_id' => 'budi_santoso_sample',
                'scopus_id' => '57201948200',
                'scopus_url' => 'https://www.scopus.com/authid/detail.uri?authorId=57201948200',
                'sinta_id' => '6019420',
                'sinta_url' => 'https://sinta.kemdikbud.go.id/authors/profile/6019420',
                'orcid_id' => '0000-0002-1825-0097',
                'orcid_url' => 'https://orcid.org/0000-0002-1825-0097',
                'facebook_url' => 'https://facebook.com/prof.budisantoso.ai',
                'instagram_url' => 'https://instagram.com/prof_budisantoso',
                'x_url' => 'https://x.com/profbudi_ai',
                'tiktok_url' => 'https://tiktok.com/@profbudi.edukasi',
                'total_citations' => 1840,
                'h_index' => 22,
                'i10_index' => 35,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 1,
                'last_synced_at' => now(),
            ]
        );

        // Publications for Prof. Budi
        StaffPublication::updateOrCreate(
            ['staff_profile_id' => $prof->id, 'title' => 'Deep Learning-Based Automated Detection of Pulmonary Nodules in Low-Dose CT Scans'],
            [
                'authors' => 'B. Santoso, H. Tanaka, A. Pratama',
                'publication_name' => 'IEEE Transactions on Medical Imaging, Vol. 42(3), pp. 780-792',
                'year' => 2024,
                'type' => 'journal',
                'source' => 'scholar',
                'doi' => '10.1109/TMI.2023.3289120',
                'url' => 'https://doi.org/10.1109/TMI.2023.3289120',
                'citations_count' => 142,
            ]
        );

        StaffPublication::updateOrCreate(
            ['staff_profile_id' => $prof->id, 'title' => 'Attention-Guided Convolutional Neural Networks for Histopathological Image Segmentation'],
            [
                'authors' => 'B. Santoso, S. Aminah, M. R. Wijaya',
                'publication_name' => 'Computers in Biology and Medicine (Elsevier), Vol. 158',
                'year' => 2023,
                'type' => 'journal',
                'source' => 'scholar',
                'doi' => '10.1016/j.compbiomed.2023.106820',
                'url' => 'https://doi.org/10.1016/j.compbiomed.2023.106820',
                'citations_count' => 88,
            ]
        );

        StaffPublication::updateOrCreate(
            ['staff_profile_id' => $prof->id, 'title' => 'Buku Referensi: Pengantar Pembelajaran Mendalam (Deep Learning) Teori dan Aplikasi'],
            [
                'authors' => 'Prof. Dr. Budi Santoso',
                'publication_name' => 'Penerbit Andi Offset Yogyakarta, ISBN: 978-623-01-2045-8',
                'year' => 2023,
                'type' => 'book',
                'source' => 'manual',
                'citations_count' => 35,
                'description' => 'Buku monograf komprehensif pembelajaran mesin modern untuk mahasiswa sarjana dan pascasarjana.',
            ]
        );

        StaffPublication::updateOrCreate(
            ['staff_profile_id' => $prof->id, 'title' => 'Paten Terdaftar: Sistem Cerdas Klasifikasi Retinopati Diabetik Menggunakan Edge AI'],
            [
                'authors' => 'Budi Santoso, Tim Peneliti Lab AI',
                'publication_name' => 'DJKI Kemenkumham RI, No. Paten: IDS000004521',
                'year' => 2022,
                'type' => 'patent',
                'source' => 'manual',
                'citations_count' => 12,
            ]
        );

        // 2. Dr. Siti Aminah
        $siti = StaffProfile::updateOrCreate(
            ['slug' => 'dr-siti-aminah'],
            [
                'user_id' => $dosenUser2->id,
                'type' => 'dosen',
                'name' => 'Siti Aminah',
                'front_title' => 'Dr.',
                'back_title' => 'S.Kom., M.Kom.',
                'nidn' => '0024088502',
                'nip' => '198508242010122002',
                'gender' => 'P',
                'faculty' => 'Fakultas Ilmu Komputer & Teknologi Informasi',
                'study_program' => 'S1 Sistem Informasi',
                'academic_position' => 'Lektor Kepala',
                'structural_position' => 'Ketua Program Studi S1 Sistem Informasi',
                'employment_status' => 'Dosen Tetap',
                'expertise' => ['Data Science', 'Big Data Analytics', 'Enterprise Information Systems', 'Business Intelligence'],
                'bio' => '<p><strong>Dr. Siti Aminah</strong> menjabat sebagai Ketua Program Studi Sistem Informasi. Beliau menyelesaikan studi doktoral di bidang Sistem Informasi dan Analitika Data. Menjadi konsultan transformasi digital di berbagai BUMN dan instansi pemerintah daerah.</p>',
                'education_history' => [
                    ['degree' => 'S1', 'institution' => 'Universitas Indonesia (UI)', 'major' => 'Sistem Informasi', 'graduation_year' => 2007],
                    ['degree' => 'S2', 'institution' => 'Institut Teknologi Sepuluh Nopember (ITS)', 'major' => 'Sistem Informasi', 'graduation_year' => 2011],
                    ['degree' => 'S3', 'institution' => 'Universitas Gadjah Mada (UGM)', 'major' => 'Ilmu Komputer & Sistem Informasi', 'graduation_year' => 2018],
                ],
                'office_address' => 'Gedung Fasilkom Lt. 2, Ruang Kaprodi SI',
                'email' => 'siti.aminah@univ.ac.id',
                'phone' => '+62 812-9876-5432',
                'avatar_path' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=siti_aminah_sample',
                'google_scholar_id' => 'siti_aminah_sample',
                'scopus_id' => '57192847111',
                'sinta_id' => '5928410',
                'orcid_id' => '0000-0003-4567-8910',
                'facebook_url' => 'https://facebook.com/drsitiaminah.ds',
                'instagram_url' => 'https://instagram.com/sitiaminah_analytics',
                'x_url' => 'https://x.com/siti_aminah_ds',
                'tiktok_url' => 'https://tiktok.com/@sitiaminah.data',
                'total_citations' => 740,
                'h_index' => 14,
                'i10_index' => 19,
                'is_active' => true,
                'is_featured' => true,
                'sort_order' => 2,
                'last_synced_at' => now(),
            ]
        );

        StaffPublication::updateOrCreate(
            ['staff_profile_id' => $siti->id, 'title' => 'Predictive Modeling for Customer Churn in Financial Technology Platforms Using Machine Learning'],
            [
                'authors' => 'S. Aminah, R. Setiawan',
                'publication_name' => 'Journal of Big Data Analytics, Vol. 11, Article 45',
                'year' => 2024,
                'type' => 'journal',
                'source' => 'scholar',
                'citations_count' => 45,
            ]
        );

        StaffPublication::updateOrCreate(
            ['staff_profile_id' => $siti->id, 'title' => 'Evaluasi Kesiapan Transformasi Digital Tata Kelola Smart City Berbasis Kerangka COBIT 2019'],
            [
                'authors' => 'Siti Aminah, Dwi Kurniawan',
                'publication_name' => 'Jurnal Nasional Sistem Informasi (Terakreditasi SINTA 2), Vol. 16(2)',
                'year' => 2023,
                'type' => 'journal',
                'source' => 'manual',
                'citations_count' => 28,
            ]
        );

        // 3. Tenaga Kependidikan: Rina Marlina
        StaffProfile::updateOrCreate(
            ['slug' => 'rina-marlina'],
            [
                'user_id' => $tendikUser->id,
                'type' => 'tendik',
                'name' => 'Rina Marlina',
                'front_title' => '',
                'back_title' => 'S.Kom., M.T.',
                'nidn' => '',
                'nip' => '199203152019032008',
                'gender' => 'P',
                'faculty' => 'Fakultas Ilmu Komputer & Teknologi Informasi',
                'study_program' => 'Unit Pelaksana Teknis Laboratorium Komputer',
                'academic_position' => '',
                'structural_position' => 'Kepala Laboratorium Komputer & Jaringan',
                'employment_status' => 'Tenaga Kependidikan Tetap',
                'expertise' => ['Cisco Networking', 'Linux Server Administration', 'Cloud Infrastructure', 'Cyber Defense'],
                'bio' => '<p><strong>Rina Marlina, S.Kom., M.T.</strong> adalah Pranata Laboratorium Pendidikan (PLP) Ahli Muda yang bertanggung jawab atas pengelolaan operasional server, infrastruktur jaringan praktikum, dan laboratorium komputasi awan di Fakultas Ilmu Komputer.</p>',
                'education_history' => [
                    ['degree' => 'S1', 'institution' => 'Universitas Diponegoro', 'major' => 'Teknik Komputer', 'graduation_year' => 2014],
                    ['degree' => 'S2', 'institution' => 'Institut Teknologi Bandung', 'major' => 'Teknik Elektro & Informatika', 'graduation_year' => 2018],
                ],
                'office_address' => 'Gedung Lab Cyber Lt. 3, Ruangan Teknisi Jaringan',
                'email' => 'rina.marlina@univ.ac.id',
                'phone' => '+62 821-3456-7890',
                'avatar_path' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
                'facebook_url' => 'https://facebook.com/rina.marlina.net',
                'instagram_url' => 'https://instagram.com/rina_marlina_lab',
                'x_url' => 'https://x.com/rinamarlina_ops',
                'tiktok_url' => 'https://tiktok.com/@rinamarlina.tech',
                'is_active' => true,
                'is_featured' => false,
                'sort_order' => 3,
            ]
        );
    }
}
