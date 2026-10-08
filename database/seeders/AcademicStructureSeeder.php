<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\InstitutionalUnit;
use App\Models\StaffProfile;
use App\Models\StructuralAssignment;
use App\Models\StructuralPosition;
use App\Models\StudyProgram;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AcademicStructureSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Master Jabatan Global Berjenjang
        $positions = [
            [
                'name' => 'Rektor',
                'slug' => 'rektor',
                'level' => 1,
                'target_scope' => 'all',
                'description' => 'Pimpinan tertinggi institusi universitas/perguruan tinggi',
                'sort_order' => 1,
            ],
            [
                'name' => 'Wakil Rektor I (Bidang Akademik)',
                'slug' => 'wakil-rektor-1',
                'level' => 1,
                'target_scope' => 'all',
                'description' => 'Membantu pimpinan dalam pelaksanaan bidang akademik & kurikulum',
                'sort_order' => 2,
            ],
            [
                'name' => 'Wakil Rektor II (Umum & Keuangan)',
                'slug' => 'wakil-rektor-2',
                'level' => 1,
                'target_scope' => 'all',
                'description' => 'Membantu pimpinan dalam tata kelola administrasi umum, aset, dan keuangan',
                'sort_order' => 3,
            ],
            [
                'name' => 'Wakil Rektor III (Kemahasiswaan & Kerjasama)',
                'slug' => 'wakil-rektor-3',
                'level' => 1,
                'target_scope' => 'all',
                'description' => 'Membantu pimpinan dalam pembinaan mahasiswa, alumni, dan kemitraan',
                'sort_order' => 4,
            ],
            [
                'name' => 'Ketua Senat Akademik',
                'slug' => 'ketua-senat',
                'level' => 1,
                'target_scope' => 'unit',
                'description' => 'Ketua badan normatif pertimbangan akademik tertinggi universitas',
                'sort_order' => 5,
            ],
            [
                'name' => 'Sekretaris Senat Akademik',
                'slug' => 'sekretaris-senat',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Sekretaris pelaksana persidangan senat akademik',
                'sort_order' => 6,
            ],
            [
                'name' => 'Dekan',
                'slug' => 'dekan',
                'level' => 2,
                'target_scope' => 'faculty',
                'description' => 'Pimpinan dan penanggung jawab tertinggi di tingkat Fakultas',
                'sort_order' => 7,
            ],
            [
                'name' => 'Wakil Dekan I',
                'slug' => 'wakil-dekan-1',
                'level' => 2,
                'target_scope' => 'faculty',
                'description' => 'Wakil pimpinan bidang akademik di tingkat Fakultas',
                'sort_order' => 8,
            ],
            [
                'name' => 'Ketua Program Studi',
                'slug' => 'ketua-program-studi',
                'level' => 3,
                'target_scope' => 'study_program',
                'description' => 'Pimpinan operasional dan pengembangan akademik program studi',
                'sort_order' => 9,
            ],
            [
                'name' => 'Sekretaris Program Studi',
                'slug' => 'sekretaris-program-studi',
                'level' => 3,
                'target_scope' => 'study_program',
                'description' => 'Membantu kaprodi dalam administrasi dan koordinasi akademik',
                'sort_order' => 10,
            ],
            [
                'name' => 'Kepala Biro',
                'slug' => 'kepala-biro',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Pimpinan biro administrasi dan layanan operasional universitas',
                'sort_order' => 11,
            ],
            [
                'name' => 'Ketua Lembaga (LPPM)',
                'slug' => 'ketua-lembaga',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Pimpinan lembaga penelitian dan pengabdian masyarakat',
                'sort_order' => 12,
            ],
            [
                'name' => 'Sekretaris Lembaga',
                'slug' => 'sekretaris-lembaga',
                'level' => 3,
                'target_scope' => 'unit',
                'description' => 'Sekretaris administrasi dan tata kelola program lembaga',
                'sort_order' => 13,
            ],
            [
                'name' => 'Kepala Badan Mutu (BPM)',
                'slug' => 'kepala-badan',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Pimpinan badan penjaminan mutu atau inkubator bisnis khusus',
                'sort_order' => 14,
            ],
            [
                'name' => 'Kepala UPT',
                'slug' => 'kepala-upt',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Pimpinan unit pelaksana teknis fungsional',
                'sort_order' => 15,
            ],
        ];

        foreach ($positions as $posData) {
            StructuralPosition::updateOrCreate(
                ['slug' => $posData['slug']],
                $posData
            );
        }

        // Ambil beberapa Dosen / Tendik untuk relasi
        $lecturers = StaffProfile::where('type', 'dosen')->where('is_active', true)->get();
        if ($lecturers->isEmpty()) {
            $lecturers = StaffProfile::take(10)->get();
        }

        // 2. Buat Fakultas (Terpisah)
        $fikrs = Faculty::updateOrCreate(
            ['slug' => 'fakultas-ilmu-komputer-dan-rekayasa-sistem'],
            [
                'name' => 'Fakultas Ilmu Komputer dan Rekayasa Sistem',
                'code' => 'FIKRS',
                'abbreviation' => 'FIKRS',
                'decree_number' => 'SK-MENDIKBUD/042/2020',
                'accreditation' => 'Unggul',
                'description' => '<p>Fakultas Ilmu Komputer dan Rekayasa Sistem (FIKRS) merupakan pusat keunggulan pendidikan, riset teknologi informasi, dan rekayasa kecerdasan buatan terkemuka dengan reputasi internasional.</p>',
                'vision' => '<p>Menjadi fakultas terdepan dan bereputasi internasional dalam pengembangan ilmu komputer, rekayasa perangkat lunak, dan kecerdasan buatan berbasis inovasi berkelanjutan pada tahun 2035.</p>',
                'mission' => '<ul><li>Menyelenggarakan pendidikan tinggi ilmu komputer yang adaptif terhadap disrupsi teknologi.</li><li>Menghasilkan penelitian bereputasi internasional dan hilirisasi produk inovasi digital.</li><li>Melaksanakan pengabdian kepada masyarakat berbasis transformasi digital.</li></ul>',
                'objectives' => 'Menghasilkan lulusan berkarakter unggul, berjiwa wirausaha digital, dan memiliki kompetensi global.',
                'facebook_url' => 'https://facebook.com/fikrs.campus',
                'instagram_url' => 'https://instagram.com/fikrs_official',
                'x_url' => 'https://x.com/fikrs_campus',
                'tiktok_url' => 'https://tiktok.com/@fikrs_life',
                'youtube_url' => 'https://youtube.com/@fikrsofficial',
                'website_url' => 'https://fikrs.campus.ac.id',
                'email' => 'fikrs@campus.ac.id',
                'phone' => '+62 21 8899 1100',
                'office_location' => 'Gedung Rektorat Sayap Timur Lantai 3-5, Kampus Terpadu',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        $febd = Faculty::updateOrCreate(
            ['slug' => 'fakultas-ekonomi-dan-bisnis-digital'],
            [
                'name' => 'Fakultas Ekonomi dan Bisnis Digital',
                'code' => 'FEBD',
                'abbreviation' => 'FEBD',
                'decree_number' => 'SK-MENDIKBUD/055/2021',
                'accreditation' => 'Baik Sekali',
                'description' => '<p>Fakultas Ekonomi dan Bisnis Digital (FEBD) mencetak pemimpin masa depan, ekonom digital, dan wirausahawan inovatif dengan kurikulum mutakhir berorientasi pasar modal dan ekosistem startup.</p>',
                'vision' => '<p>Menjadi pusat keunggulan pendidikan ekonomi digital dan bisnis berkelanjutan yang inovatif di kawasan Asia Tenggara.</p>',
                'mission' => '<ul><li>Menyelenggarakan pembelajaran terintegrasi teknologi finansial dan tata kelola bisnis.</li><li>Mengembangkan riset aplikatif ekonomi digital berdaya saing global.</li></ul>',
                'objectives' => 'Melahirkan inovator bisnis dan eksekutif dengan literasi finansial digital tingkat tinggi.',
                'facebook_url' => 'https://facebook.com/febd.campus',
                'instagram_url' => 'https://instagram.com/febd_campus',
                'tiktok_url' => 'https://tiktok.com/@febd_campus',
                'email' => 'febd@campus.ac.id',
                'phone' => '+62 21 8899 1200',
                'office_location' => 'Gedung Griya Bisnis Lantai 2, Kampus Terpadu',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        // 3. Buat Program Studi (Terpisah - Dengan field spesifik Prospek Karir, Gelar, Akreditasi, dll)
        $ti = StudyProgram::updateOrCreate(
            ['slug' => 's1-teknik-informatika'],
            [
                'faculty_id' => $fikrs->id,
                'name' => 'Teknik Informatika',
                'code' => 'TINF-S1',
                'abbreviation' => 'TI',
                'degree_level' => 'S1',
                'graduate_title' => 'S.Kom.',
                'accreditation' => 'Unggul',
                'accreditation_number' => '120/SK/LAM-INFOKOM/Ak/S/XII/2024',
                'decree_number' => 'SK-DIKTI-456/2018',
                'description' => '<p>Program Studi S1 Teknik Informatika membekali mahasiswa dengan fondasi sains komputasi yang kokoh, arsitektur perangkat lunak modern, kecerdasan buatan, komputasi awan, dan rekayasa keamanan siber.</p>',
                'vision' => '<p>Menjadi Program Studi Teknik Informatika berkelas dunia yang memimpin riset kecerdasan buatan dan rekayasa perangkat lunak berskala besar pada tahun 2035.</p>',
                'mission' => '<ul><li>Menyelenggarakan pendidikan komputasi berstandar internasional ACM/IEEE.</li><li>Mengembangkan penelitian kecerdasan buatan, distributed system, dan cybersecurity.</li><li>Memperkuat kolaborasi industri teknologi global untuk magang dan hilirisasi karya.</li></ul>',
                'career_prospects' => [
                    'Software Engineer & System Architect',
                    'AI & Machine Learning Specialist',
                    'Cloud Platform Engineer',
                    'Cybersecurity Analyst & Penetration Tester',
                    'DevOps & Site Reliability Engineer',
                    'Data Scientist & Big Data Engineer',
                    'Tech Startup Founder / CTO'
                ],
                'curriculum_overview' => '<p>Kurikulum 144 SKS berbasis Outcome-Based Education (OBE) dengan konsentrasi Software Architecture, Artificial Intelligence, dan Cyber Defense.</p>',
                'facebook_url' => 'https://facebook.com/ti.campus',
                'instagram_url' => 'https://instagram.com/ti_campus',
                'tiktok_url' => 'https://tiktok.com/@ti_campus_vlog',
                'youtube_url' => 'https://youtube.com/@ti_campus',
                'website_url' => 'https://ti.campus.ac.id',
                'email' => 'ti@campus.ac.id',
                'phone' => '+62 21 8899 1111',
                'office_location' => 'Gedung FIKRS Lantai 3 Ruang 302',
                'cover_image_path' => '/images/lab.png',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        $si = StudyProgram::updateOrCreate(
            ['slug' => 's1-sistem-informasi'],
            [
                'faculty_id' => $fikrs->id,
                'name' => 'Sistem Informasi',
                'code' => 'SI-S1',
                'abbreviation' => 'SI',
                'degree_level' => 'S1',
                'graduate_title' => 'S.Kom.',
                'accreditation' => 'Unggul',
                'accreditation_number' => '121/SK/LAM-INFOKOM/Ak/S/XII/2024',
                'decree_number' => 'SK-DIKTI-457/2018',
                'description' => '<p>Program Studi S1 Sistem Informasi menjembatani ranah bisnis enterprise dan arsitektur teknologi informasi, melahirkan para perancang solusi digital yang berorientasi nilai bisnis.</p>',
                'vision' => '<p>Menjadi rujukan unggul dalam transformasi digital korporat, arsitektur enterprise, dan analitika bisnis cerdas di Asia Tenggara.</p>',
                'mission' => '<ul><li>Mendidik profesional sistem informasi berwawasan tata kelola dan strategi bisnis digital.</li><li>Menghasilkan riset terapan enterprise systems dan business intelligence.</li></ul>',
                'career_prospects' => [
                    'Enterprise Architect',
                    'IT Business Analyst & Solution Consultant',
                    'Product Manager Tech',
                    'ERP & CRM Consultant (SAP, Oracle, Odoo)',
                    'Chief Information Officer (CIO) Track',
                    'Business Intelligence Analyst'
                ],
                'curriculum_overview' => '<p>144 SKS yang mengintegrasikan framework TOGAF, ITIL, COBIT, Scrum Agile, dan Advanced Business Analytics.</p>',
                'instagram_url' => 'https://instagram.com/si_campus',
                'tiktok_url' => 'https://tiktok.com/@si_life_daily',
                'email' => 'si@campus.ac.id',
                'phone' => '+62 21 8899 1112',
                'office_location' => 'Gedung FIKRS Lantai 4 Ruang 402',
                'cover_image_path' => '/images/building.png',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        // Kasus Dinamis: Program Studi Mandiri Tanpa Fakultas (Contoh: Kampus Vokasi / Politeknik / Sekolah Tinggi)
        $rpla = StudyProgram::updateOrCreate(
            ['slug' => 'd3-rekayasa-perangkat-lunak-aplikasi'],
            [
                'faculty_id' => null, // Kampus tanpa fakultas / vokasi mandiri
                'name' => 'Rekayasa Perangkat Lunak Aplikasi',
                'code' => 'RPLA-D3',
                'abbreviation' => 'RPLA',
                'degree_level' => 'D3',
                'graduate_title' => 'A.Md.Kom.',
                'accreditation' => 'Baik Sekali',
                'accreditation_number' => '88/SK/LAM-INFOKOM/Ak/Dip/X/2024',
                'decree_number' => 'SK-DIKTI-201/2022',
                'description' => '<p>Program Vokasi D3 Rekayasa Perangkat Lunak Aplikasi menekankan pada keterampilan praktis 70% praktikum dan 30% teori dengan sertifikasi industri internasional.</p>',
                'vision' => '<p>Menjadi pencetak talenta vokasi rekayasa aplikasi siap kerja terdepan di tingkat nasional.</p>',
                'mission' => '<ul><li>Menghasilkan lulusan terampil dengan portfolio industri nyata.</li><li>Membangun teaching factory bersama mitra industri teknologi nasional.</li></ul>',
                'career_prospects' => [
                    'Junior Fullstack Web Developer',
                    'Mobile Application Developer (Flutter/React Native)',
                    'QA Tester & Automation',
                    'Junior Database Administrator',
                ],
                'cover_image_path' => '/images/students-activity.png',
                'curriculum_overview' => '<p>Kurikulum vokasi 110 SKS terintegrasi program magang industri 1 tahun penuh (Dual System).</p>',
                'instagram_url' => 'https://instagram.com/rpla_vokasi',
                'tiktok_url' => 'https://tiktok.com/@rpla_ngoding',
                'email' => 'rpla@campus.ac.id',
                'phone' => '+62 21 8899 1199',
                'office_location' => 'Gedung Laboratorium Vokasi Terpadu Lantai 1',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );

        // 4. Buat Unit / UPT / Lembaga / Biro / Badan Khusus / Rektorat
        $rectorateUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'rektorat-dan-pimpinan-universitas'],
            [
                'category' => 'rektorat',
                'name' => 'Rektorat & Pimpinan Universitas',
                'code' => 'REK',
                'abbreviation' => 'Rektorat',
                'description' => '<p>Pimpinan tertinggi eksekutif penyelenggara tridharma perguruan tinggi dan tata kelola universitas.</p>',
                'vision' => '<p>Mewujudkan tata kelola perguruan tinggi yang transparan, akuntabel, dan bereputasi global.</p>',
                'mission' => '<ul><li>Memimpin penyelenggaraan pendidikan berkualitas tinggi.</li><li>Membangun jejaring kolaborasi nasional dan internasional.</li></ul>',
                'services_overview' => '<p>Layanan pimpinan institusi, sekretariat rektorat, dan hubungan masyarakat.</p>',
                'email' => 'rektorat@campus.ac.id',
                'phone' => '+62 21 8899 1000',
                'office_location' => 'Gedung Rektorat Sayap Utama Lantai 4',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        $senatUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'senat-akademik-universitas'],
            [
                'category' => 'senat',
                'name' => 'Senat Akademik Universitas',
                'code' => 'SENAT',
                'abbreviation' => 'Senat',
                'description' => '<p>Badan normatif dan perwakilan akademik tertinggi universitas yang merumuskan dan mengawasi kebijakan tridharma.</p>',
                'vision' => '<p>Menjaga integritas akademik dan kebebasan mimbar ilmiah sivitas akademika.</p>',
                'mission' => '<ul><li>Menetapkan norma dan ketentuan pelaksanaan akademik.</li><li>Memberikan pertimbangan pembukaan program studi dan kenaikan jabatan akademik.</li></ul>',
                'services_overview' => '<p>Sidang pleno akademik, pertimbangan kurikulum, dan pengawasan mutu keilmuan.</p>',
                'email' => 'senat@campus.ac.id',
                'phone' => '+62 21 8899 1050',
                'office_location' => 'Gedung Rektorat Sayap Barat Lantai 3',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        $baakUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'biro-administrasi-akademik-dan-kemahasiswaan-baak'],
            [
                'category' => 'biro',
                'name' => 'Biro Administrasi Akademik & Kemahasiswaan (BAAK)',
                'code' => 'BAAK',
                'abbreviation' => 'BAAK',
                'description' => '<p>Pusat layanan registrasi mahasiswa, penjadwalan kuliah, kartu rencana studi (KRS), transkrip nilai, ijazah, beasiswa, dan kegiatan ormawa.</p>',
                'services_overview' => '<p>Layanan KRS Online, Legalisir Digital, Surat Keterangan Mahasiswa Aktif, dan Pengelolaan Beasiswa.</p>',
                'email' => 'baak@campus.ac.id',
                'phone' => '+62 21 8899 1200',
                'office_location' => 'Gedung Pelayanan Terpadu Satu Pintu Lantai 1',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );

        $bauUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'biro-administrasi-umum-dan-keuangan-bau'],
            [
                'category' => 'biro',
                'name' => 'Biro Administrasi Umum & Keuangan (BAU)',
                'code' => 'BAU',
                'abbreviation' => 'BAU',
                'description' => '<p>Biro pelaksana administrasi tata usaha, kepegawaian, perlengkapan sarana prasarana, pengadaan aset, dan akuntansi keuangan kampus.</p>',
                'services_overview' => '<p>Layanan Pembayaran UKT/SPP, Pemeliharaan Fasilitas Kampus, dan Administrasi SDM/Pegawai.</p>',
                'email' => 'bau@campus.ac.id',
                'phone' => '+62 21 8899 1250',
                'office_location' => 'Gedung Rektorat Sayap Timur Lantai 1',
                'sort_order' => 4,
                'is_active' => true,
            ]
        );

        $lppmUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'lembaga-penelitian-dan-pengabdian-masyarakat-lppm'],
            [
                'category' => 'lembaga',
                'name' => 'Lembaga Penelitian & Pengabdian kepada Masyarakat (LPPM)',
                'code' => 'LPPM',
                'abbreviation' => 'LPPM',
                'description' => '<p>Mengkoordinasikan seluruh agenda riset kolaboratif, publikasi jurnal bereputasi, hilirisasi paten inovasi, dan program pengabdian masyarakat (KKN Tematik).</p>',
                'services_overview' => '<p>Pendanaan Hibah Riset Internal, Pengelolaan Sentra HKI/Paten, dan Jurnal Ilmiah Terindeks SINTA/Scopus.</p>',
                'email' => 'lppm@campus.ac.id',
                'phone' => '+62 21 8899 1300',
                'office_location' => 'Gedung Riset dan Inovasi Lantai 3',
                'sort_order' => 5,
                'is_active' => true,
            ]
        );

        $bpmUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'badan-penjaminan-mutu-bpm'],
            [
                'category' => 'badan_khusus',
                'name' => 'Badan Penjaminan Mutu (BPM)',
                'code' => 'BPM',
                'abbreviation' => 'BPM',
                'description' => '<p>BPM bertugas mengawal penerapan Standar Penjaminan Mutu Internal (SPMI), audit kepatuhan ISO 9001, dan akreditasi nasional/internasional seluruh prodi.</p>',
                'services_overview' => '<p>Audit Mutu Internal (AMI), Pengukuran Kepuasan Stakeholder, dan Pendampingan Akreditasi Unggul.</p>',
                'email' => 'bpm@campus.ac.id',
                'phone' => '+62 21 8899 1400',
                'office_location' => 'Gedung Rektorat Lantai 2',
                'sort_order' => 6,
                'is_active' => true,
            ]
        );

        $bibiUnit = InstitutionalUnit::updateOrCreate(
            ['slug' => 'badan-inkubator-bisnis-dan-inovasi-bibi'],
            [
                'category' => 'badan_khusus',
                'name' => 'Badan Inkubator Bisnis & Inovasi (BIBI)',
                'code' => 'BIBI',
                'abbreviation' => 'BIBI',
                'description' => '<p>Pusat akselerasi dan pendampingan startup mahasiswa, komersialisasi produk riset dosen, serta jejaring pendanaan ventura industri.</p>',
                'services_overview' => '<p>Program Pra-Inkubasi Startup, Co-Working Space Kreatif, dan Fasilitasi Hak Kekayaan Intelektual.</p>',
                'email' => 'inkubator@campus.ac.id',
                'phone' => '+62 21 8899 1450',
                'office_location' => 'Gedung Inovasi & Technopark Lantai 1',
                'sort_order' => 7,
                'is_active' => true,
            ]
        );

        $uptPerpus = InstitutionalUnit::updateOrCreate(
            ['slug' => 'upt-perpustakaan-dan-literasi-digital'],
            [
                'category' => 'upt',
                'name' => 'UPT Perpustakaan dan Literasi Digital',
                'code' => 'UPT-LIB',
                'abbreviation' => 'UPT Perpus',
                'description' => '<p>UPT Perpustakaan menyediakan akses jutaan repositori ilmiah, jurnal internasional terindeks Scopus, ruang collaborative study modern, dan workshop literasi digital.</p>',
                'services_overview' => '<p>Peminjaman koleksi mandiri (RFID Self-checkout), Akses E-Journal (IEEE, Springer, ScienceDirect), Cek Turnitin Gratis, dan Co-working Space Mahasiswa.</p>',
                'email' => 'library@campus.ac.id',
                'phone' => '+62 21 8899 1500',
                'office_location' => 'Gedung Perpustakaan Pusat 4 Lantai',
                'sort_order' => 8,
                'is_active' => true,
            ]
        );

        $uptLab = InstitutionalUnit::updateOrCreate(
            ['slug' => 'upt-laboratorium-riset-dan-komputasi-terpadu'],
            [
                'category' => 'upt',
                'name' => 'UPT Laboratorium Riset dan Komputasi Terpadu',
                'code' => 'UPT-LAB',
                'abbreviation' => 'UPT Labkom',
                'description' => '<p>Pusat komputasi berkinerja tinggi (High-Performance Computing - HPC), laboratorium GPU untuk pelatihan Deep Learning, dan fasilitas uji coba hardware IoT.</p>',
                'services_overview' => '<p>Cluster Supercomputer GPU Training, Laboratorium IoT & Robotika, Server Hosting Karya Mahasiswa, dan Cloud Lab Virtual.</p>',
                'email' => 'lab@campus.ac.id',
                'phone' => '+62 21 8899 1555',
                'office_location' => 'Gedung Riset dan Komputasi Terpadu Lantai 2',
                'sort_order' => 9,
                'is_active' => true,
            ]
        );

        // 5. Hubungkan Dosen Pengajar (Multi-Select Dosen) ke Fakultas dan Prodi
        if ($lecturers->isNotEmpty()) {
            $fikrsLecturerIds = $lecturers->take(8)->pluck('id')->toArray();
            $syncData = [];
            foreach ($fikrsLecturerIds as $idx => $id) {
                $syncData[$id] = ['role' => 'Dosen Tetap', 'sort_order' => $idx + 1];
            }
            $fikrs->lecturers()->sync($syncData);

            $tiLecturerIds = $lecturers->take(5)->pluck('id')->toArray();
            $tiSync = [];
            foreach ($tiLecturerIds as $idx => $id) {
                $tiSync[$id] = ['role' => 'Dosen Homebase', 'sort_order' => $idx + 1];
            }
            $ti->lecturers()->sync($tiSync);

            $siLecturerIds = $lecturers->skip(2)->take(4)->pluck('id')->toArray();
            $siSync = [];
            foreach ($siLecturerIds as $idx => $id) {
                $siSync[$id] = ['role' => 'Dosen Homebase', 'sort_order' => $idx + 1];
            }
            $si->lecturers()->sync($siSync);

            $rplaLecturerIds = $lecturers->skip(4)->take(4)->pluck('id')->toArray();
            $rplaSync = [];
            foreach ($rplaLecturerIds as $idx => $id) {
                $rplaSync[$id] = ['role' => 'Instruktur Vokasi', 'sort_order' => $idx + 1];
            }
            $rpla->lecturers()->sync($rplaSync);
        }

        // 6. Penugasan Pejabat Struktural dari Master Data Jabatan
        $posRektor = StructuralPosition::where('slug', 'rektor')->first();
        $posWarek1 = StructuralPosition::where('slug', 'wakil-rektor-1')->first();
        $posWarek2 = StructuralPosition::where('slug', 'wakil-rektor-2')->first();
        $posWarek3 = StructuralPosition::where('slug', 'wakil-rektor-3')->first();
        $posKetuaSenat = StructuralPosition::where('slug', 'ketua-senat')->first();
        $posSekretarisSenat = StructuralPosition::where('slug', 'sekretaris-senat')->first();
        $posDekan = StructuralPosition::where('slug', 'dekan')->first();
        $posWadek = StructuralPosition::where('slug', 'wakil-dekan-1')->first();
        $posKaprodi = StructuralPosition::where('slug', 'ketua-program-studi')->first();
        $posSekprodi = StructuralPosition::where('slug', 'sekretaris-program-studi')->first();
        $posKaBiro = StructuralPosition::where('slug', 'kepala-biro')->first();
        $posKetuaLembaga = StructuralPosition::where('slug', 'ketua-lembaga')->first();
        $posSekretarisLembaga = StructuralPosition::where('slug', 'sekretaris-lembaga')->first();
        $posKaBadan = StructuralPosition::where('slug', 'kepala-badan')->first();
        $posKaUpt = StructuralPosition::where('slug', 'kepala-upt')->first();

        // Cari profile pejabat
        $profAhmad = StaffProfile::where('slug', 'prof-ahmad-wijaya')->first() ?? $lecturers->first();
        $drRudi = StaffProfile::where('slug', 'dr-rudi-hartono')->first() ?? $lecturers->skip(1)->first();
        $draMaya = StaffProfile::where('slug', 'dra-maya-lestari')->first() ?? $lecturers->skip(2)->first();
        $irBudi = StaffProfile::where('slug', 'ir-budi-santoso-mt')->first() ?? $lecturers->skip(3)->first();
        $drSiti = StaffProfile::where('slug', 'dr-siti-aminah')->first() ?? $lecturers->skip(1)->first();
        $drHendra = StaffProfile::where('slug', 'dr-hendra-gunawan')->first() ?? $lecturers->skip(2)->first();
        $profBudi = StaffProfile::where('slug', 'prof-budi-santoso')->first() ?? $lecturers->first();
        $drWahyu = StaffProfile::where('slug', 'dr-wahyu-hidayat')->first() ?? $lecturers->skip(3)->first();
        $sariWijaya = StaffProfile::where('slug', 'sari-wijaya-msc')->first() ?? $lecturers->skip(4)->first();
        $andiPratama = StaffProfile::where('slug', 'andi-pratama-ak')->first() ?? $lecturers->skip(2)->first();
        $drRatna = StaffProfile::where('slug', 'dr-ratna-dumila')->first() ?? $lecturers->skip(3)->first();
        $draNurul = StaffProfile::where('slug', 'dra-nurul-hidayah')->first() ?? $lecturers->skip(4)->first();
        $rinaMarlina = StaffProfile::where('slug', 'rina-marlina')->first() ?? $lecturers->skip(2)->first();

        // Helper penetapan jabatan
        $assign = function ($assignable, $position, $staff, $order = 1, $customTitle = null) {
            if ($assignable && $position && $staff) {
                StructuralAssignment::updateOrCreate(
                    [
                        'assignable_type' => get_class($assignable),
                        'assignable_id' => $assignable->id,
                        'structural_position_id' => $position->id,
                    ],
                    [
                        'staff_profile_id' => $staff->id,
                        'custom_title' => $customTitle,
                        'period_start' => '2024-01-01',
                        'period_end' => '2028-01-01',
                        'decree_number' => 'SK-REK/' . str_pad((string)$order, 3, '0', STR_PAD_LEFT) . '/I/2024',
                        'is_current' => true,
                        'sort_order' => $order,
                    ]
                );
            }
        };

        // 1. REKTORAT
        $assign($rectorateUnit, $posRektor, $profAhmad, 1, 'Rektor');
        $assign($rectorateUnit, $posWarek1, $drRudi, 2, 'Wakil Rektor I (Bidang Akademik)');
        $assign($rectorateUnit, $posWarek2, $draMaya, 3, 'Wakil Rektor II (Umum & Keuangan)');
        $assign($rectorateUnit, $posWarek3, $irBudi, 4, 'Wakil Rektor III (Kemahasiswaan & Kerjasama)');

        // 2. SENAT AKADEMIK
        $assign($senatUnit, $posKetuaSenat, $drSiti, 1, 'Ketua Senat Akademik');
        $assign($senatUnit, $posSekretarisSenat, $drHendra, 2, 'Sekretaris Senat Akademik');

        // 3. FAKULTAS & DEKANAT
        $assign($fikrs, $posDekan, $profBudi, 1, 'Dekan FIKRS');
        $assign($fikrs, $posWadek, $drHendra, 2, 'Wakil Dekan I FIKRS');

        // 4. PROGRAM STUDI
        $assign($ti, $posKaprodi, $drWahyu, 1, 'Ketua Program Studi S1 Teknik Informatika');
        $assign($ti, $posSekprodi, $drHendra, 2, 'Sekretaris Program Studi S1 Teknik Informatika');
        $assign($si, $posKaprodi, $drSiti, 1, 'Ketua Program Studi S1 Sistem Informasi');
        $assign($rpla, $posKaprodi, $profBudi, 1, 'Ketua Program Studi D3 Rekayasa Perangkat Lunak Aplikasi');

        // 5. BIRO ADMINISTRASI
        $assign($baakUnit, $posKaBiro, $draMaya, 1, 'Kepala Biro Administrasi Akademik & Kemahasiswaan');
        $assign($bauUnit, $posKaBiro, $andiPratama, 1, 'Kepala Biro Administrasi Umum & Keuangan');

        // 6. LEMBAGA
        $assign($lppmUnit, $posKetuaLembaga, $drWahyu, 1, 'Ketua LPPM');
        $assign($lppmUnit, $posSekretarisLembaga, $sariWijaya, 2, 'Sekretaris LPPM');

        // 7. BADAN KHUSUS
        $assign($bpmUnit, $posKaBadan, $drRatna, 1, 'Ketua Badan Penjaminan Mutu (BPM)');
        $assign($bibiUnit, $posKaBadan, $drRudi, 1, 'Kepala Badan Inkubator Bisnis & Inovasi');

        // 8. UPT
        $assign($uptPerpus, $posKaUpt, $draNurul, 1, 'Kepala UPT Perpustakaan dan Literasi Digital');
        $assign($uptLab, $posKaUpt, $rinaMarlina, 1, 'Kepala UPT Laboratorium Riset dan Komputasi Terpadu');
    }
}
