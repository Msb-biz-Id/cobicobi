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
                'description' => 'Membantu pimpinan dalam pelaksanaan bidang akademik & kemahasiswaan',
                'sort_order' => 2,
            ],
            [
                'name' => 'Dekan',
                'slug' => 'dekan',
                'level' => 2,
                'target_scope' => 'faculty',
                'description' => 'Pimpinan dan penanggung jawab tertinggi di tingkat Fakultas',
                'sort_order' => 3,
            ],
            [
                'name' => 'Wakil Dekan I',
                'slug' => 'wakil-dekan-1',
                'level' => 2,
                'target_scope' => 'faculty',
                'description' => 'Wakil pimpinan bidang akademik di tingkat Fakultas',
                'sort_order' => 4,
            ],
            [
                'name' => 'Ketua Program Studi',
                'slug' => 'ketua-program-studi',
                'level' => 3,
                'target_scope' => 'study_program',
                'description' => 'Pimpinan operasional dan pengembangan akademik program studi',
                'sort_order' => 5,
            ],
            [
                'name' => 'Sekretaris Program Studi',
                'slug' => 'sekretaris-program-studi',
                'level' => 3,
                'target_scope' => 'study_program',
                'description' => 'Membantu kaprodi dalam administrasi dan koordinasi akademik',
                'sort_order' => 6,
            ],
            [
                'name' => 'Kepala UPT',
                'slug' => 'kepala-upt',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Pimpinan unit pelaksana teknis fungsional',
                'sort_order' => 7,
            ],
            [
                'name' => 'Kepala Lembaga / Biro',
                'slug' => 'kepala-lembaga-biro',
                'level' => 2,
                'target_scope' => 'unit',
                'description' => 'Pimpinan lembaga pengembangan atau biro layanan institusi',
                'sort_order' => 8,
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
                    'Quality Assurance (QA) Tester & Automation',
                    'Junior Database Administrator',
                    'Technical Support & IT Operations Specialist'
                ],
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

        // 4. Buat Unit / UPT / Lembaga (Terpisah)
        $uptPerpus = InstitutionalUnit::updateOrCreate(
            ['slug' => 'upt-perpustakaan-dan-literasi-digital'],
            [
                'category' => 'upt',
                'name' => 'UPT Perpustakaan dan Literasi Digital',
                'code' => 'UPT-LIB',
                'abbreviation' => 'UPT Perpus',
                'description' => '<p>UPT Perpustakaan menyediakan akses jutaan repositori ilmiah, jurnal internasional terindeks Scopus, ruang collaborative study modern, dan workshop literasi digital.</p>',
                'vision' => '<p>Menjadi pusat sumber belajar dan literasi ilmiah digital kelas dunia berbasis teknologi informasi ramah pengguna.</p>',
                'mission' => '<ul><li>Menyediakan koleksi referensi akademik mutakhir fisik dan digital.</li><li>Memfasilitasi ruang belajar kolaboratif yang inklusif dan nyaman.</li></ul>',
                'services_overview' => '<p>Peminjaman koleksi mandiri (RFID Self-checkout), Akses E-Journal (IEEE, Springer, ScienceDirect), Cek Turnitin Gratis, dan Co-working Space Mahasiswa.</p>',
                'instagram_url' => 'https://instagram.com/library_campus',
                'tiktok_url' => 'https://tiktok.com/@library_campus',
                'email' => 'library@campus.ac.id',
                'phone' => '+62 21 8899 1500',
                'office_location' => 'Gedung Perpustakaan Pusat 4 Lantai',
                'sort_order' => 1,
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
                'vision' => '<p>Mendukung riset komputasi mutakhir civitas akademika dengan fasilitas infrastruktur berstandar tier-3.</p>',
                'mission' => '<ul><li>Menyediakan klaster komputasi riset untuk pengolahan big data dan AI.</li><li>Menyelenggarakan pelatihan sertifikasi profesional industri.</li></ul>',
                'services_overview' => '<p>Cluster Supercomputer GPU Training, Laboratorium IoT & Robotika, Server Hosting Karya Mahasiswa, dan Cloud Lab Virtual.</p>',
                'instagram_url' => 'https://instagram.com/labkom_campus',
                'tiktok_url' => 'https://tiktok.com/@labkom_campus',
                'email' => 'lab@campus.ac.id',
                'phone' => '+62 21 8899 1555',
                'office_location' => 'Gedung Riset dan Komputasi Terpadu Lantai 2',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        $lpmpp = InstitutionalUnit::updateOrCreate(
            ['slug' => 'lembaga-penjaminan-mutu-dan-pengembangan-pendidikan'],
            [
                'category' => 'lembaga',
                'name' => 'Lembaga Penjaminan Mutu dan Pengembangan Pendidikan (LPMPP)',
                'code' => 'LPMPP',
                'abbreviation' => 'LPMPP',
                'description' => '<p>LPMPP bertugas merancang, mengawal, dan mengevaluasi Standar Penjaminan Mutu Internal (SPMI) serta memfasilitasi akreditasi internasional bagi seluruh program studi.</p>',
                'vision' => '<p>Menjamin terselenggaranya pendidikan tinggi bermutu unggul yang memenuhi standar akreditasi internasional secara konsisten.</p>',
                'mission' => '<ul><li>Mengembangkan sistem audit mutu akademik internal berbasis digital.</li><li>Mendampingi program studi menuju akreditasi internasional (ABET, ASIIN, FIBAA).</li></ul>',
                'services_overview' => '<p>Audit Mutu Internal (AMI), Workshop Pengembangan Kurikulum OBE, Pelatihan PEKERTI & AA untuk Dosen Baru.</p>',
                'email' => 'lpmpp@campus.ac.id',
                'phone' => '+62 21 8899 1600',
                'office_location' => 'Gedung Rektorat Lantai 2',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );

        // 5. Hubungkan Dosen Pengajar (Multi-Select Dosen) ke Fakultas dan Prodi
        if ($lecturers->isNotEmpty()) {
            // Assign dosen ke FIKRS
            $fikrsLecturerIds = $lecturers->take(8)->pluck('id')->toArray();
            $syncData = [];
            foreach ($fikrsLecturerIds as $idx => $id) {
                $syncData[$id] = ['role' => 'Dosen Tetap', 'sort_order' => $idx + 1];
            }
            $fikrs->lecturers()->sync($syncData);

            // Assign dosen ke Teknik Informatika
            $tiLecturerIds = $lecturers->take(5)->pluck('id')->toArray();
            $tiSync = [];
            foreach ($tiLecturerIds as $idx => $id) {
                $tiSync[$id] = ['role' => 'Dosen Homebase', 'sort_order' => $idx + 1];
            }
            $ti->lecturers()->sync($tiSync);

            // Assign dosen ke Sistem Informasi
            $siLecturerIds = $lecturers->skip(2)->take(4)->pluck('id')->toArray();
            $siSync = [];
            foreach ($siLecturerIds as $idx => $id) {
                $siSync[$id] = ['role' => 'Dosen Homebase', 'sort_order' => $idx + 1];
            }
            $si->lecturers()->sync($siSync);

            // Assign dosen ke Vokasi RPLA
            $rplaLecturerIds = $lecturers->skip(4)->take(4)->pluck('id')->toArray();
            $rplaSync = [];
            foreach ($rplaLecturerIds as $idx => $id) {
                $rplaSync[$id] = ['role' => 'Instruktur Vokasi', 'sort_order' => $idx + 1];
            }
            $rpla->lecturers()->sync($rplaSync);

            // 6. Penugasan Pejabat Struktural dari Master Data Jabatan
            $posDekan = StructuralPosition::where('slug', 'dekan')->first();
            $posWadek = StructuralPosition::where('slug', 'wakil-dekan-1')->first();
            $posKaprodi = StructuralPosition::where('slug', 'ketua-program-studi')->first();
            $posSekprodi = StructuralPosition::where('slug', 'sekretaris-program-studi')->first();
            $posKaUpt = StructuralPosition::where('slug', 'kepala-upt')->first();

            // Dekan FIKRS
            if ($posDekan && isset($lecturers[0])) {
                StructuralAssignment::updateOrCreate(
                    [
                        'assignable_type' => Faculty::class,
                        'assignable_id' => $fikrs->id,
                        'structural_position_id' => $posDekan->id,
                    ],
                    [
                        'staff_profile_id' => $lecturers[0]->id,
                        'custom_title' => null,
                        'period_start' => '2024-01-01',
                        'period_end' => '2028-01-01',
                        'decree_number' => 'SK-REK/001/I/2024',
                        'is_current' => true,
                        'sort_order' => 1,
                    ]
                );
            }

            // Wakil Dekan 1 FIKRS
            if ($posWadek && isset($lecturers[1])) {
                StructuralAssignment::updateOrCreate(
                    [
                        'assignable_type' => Faculty::class,
                        'assignable_id' => $fikrs->id,
                        'structural_position_id' => $posWadek->id,
                    ],
                    [
                        'staff_profile_id' => $lecturers[1]->id,
                        'custom_title' => null,
                        'period_start' => '2024-01-01',
                        'period_end' => '2028-01-01',
                        'decree_number' => 'SK-REK/002/I/2024',
                        'is_current' => true,
                        'sort_order' => 2,
                    ]
                );
            }

            // Kaprodi Teknik Informatika
            if ($posKaprodi && isset($lecturers[2])) {
                StructuralAssignment::updateOrCreate(
                    [
                        'assignable_type' => StudyProgram::class,
                        'assignable_id' => $ti->id,
                        'structural_position_id' => $posKaprodi->id,
                    ],
                    [
                        'staff_profile_id' => $lecturers[2]->id,
                        'custom_title' => null,
                        'period_start' => '2024-01-01',
                        'period_end' => '2028-01-01',
                        'decree_number' => 'SK-REK/010/I/2024',
                        'is_current' => true,
                        'sort_order' => 1,
                    ]
                );
            }

            // Sekprodi Teknik Informatika
            if ($posSekprodi && isset($lecturers[3])) {
                StructuralAssignment::updateOrCreate(
                    [
                        'assignable_type' => StudyProgram::class,
                        'assignable_id' => $ti->id,
                        'structural_position_id' => $posSekprodi->id,
                    ],
                    [
                        'staff_profile_id' => $lecturers[3]->id,
                        'custom_title' => null,
                        'period_start' => '2024-01-01',
                        'period_end' => '2028-01-01',
                        'decree_number' => 'SK-REK/011/I/2024',
                        'is_current' => true,
                        'sort_order' => 2,
                    ]
                );
            }

            // Kepala UPT Labkom
            if ($posKaUpt && isset($lecturers[4])) {
                StructuralAssignment::updateOrCreate(
                    [
                        'assignable_type' => InstitutionalUnit::class,
                        'assignable_id' => $uptLab->id,
                        'structural_position_id' => $posKaUpt->id,
                    ],
                    [
                        'staff_profile_id' => $lecturers[4]->id,
                        'custom_title' => null,
                        'period_start' => '2024-01-01',
                        'period_end' => '2026-01-01',
                        'decree_number' => 'SK-REK/035/I/2024',
                        'is_current' => true,
                        'sort_order' => 1,
                    ]
                );
            }
        }
    }
}
