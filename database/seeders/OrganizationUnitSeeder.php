<?php

namespace Database\Seeders;

use App\Models\OrganizationUnit;
use App\Models\StaffProfile;
use App\Models\StructuralPosition;
use App\Models\UnitPositionHolder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrganizationUnitSeeder extends Seeder
{
    public function run(): void
    {
        // 1. MASTER GLOBAL JABATAN BERTINGKAT
        $positions = [
            [
                'name' => 'Dekan',
                'slug' => 'dekan',
                'level' => 1,
                'applicable_types' => ['fakultas'],
                'description' => 'Pimpinan tertinggi fakultas yang mengoordinasikan tridharma perguruan tinggi di tingkat fakultas.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Wakil Dekan Bidang Akademik',
                'slug' => 'wakil-dekan-akademik',
                'level' => 2,
                'applicable_types' => ['fakultas'],
                'description' => 'Membantu Dekan dalam penyelenggaraan pendidikan, kurikulum, dan pengajaran.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Wakil Dekan Bidang Kemahasiswaan & Kerjasama',
                'slug' => 'wakil-dekan-kemahasiswaan',
                'level' => 2,
                'applicable_types' => ['fakultas'],
                'description' => 'Membantu Dekan dalam pembinaan kemahasiswaan, alumni, dan kemitraan strategis.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Ketua Program Studi',
                'slug' => 'ketua-program-studi',
                'level' => 3,
                'applicable_types' => ['prodi'],
                'description' => 'Pimpinan pengelola program studi yang bertanggung jawab atas kurikulum, pembelajaran, dan akreditasi.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Sekretaris Program Studi',
                'slug' => 'sekretaris-program-studi',
                'level' => 3,
                'applicable_types' => ['prodi'],
                'description' => 'Membantu Ketua Program Studi dalam administrasi akademik, penjadwalan, dan bimbingan.',
                'sort_order' => 5,
            ],
            [
                'name' => 'Kepala Unit Pelaksana Teknis (UPT)',
                'slug' => 'kepala-upt',
                'level' => 3,
                'applicable_types' => ['upt'],
                'description' => 'Pimpinan unit layanan teknis operasional penunjang tridharma perguruan tinggi.',
                'sort_order' => 6,
            ],
            [
                'name' => 'Kepala Laboratorium',
                'slug' => 'kepala-laboratorium',
                'level' => 4,
                'applicable_types' => ['prodi', 'upt', 'fakultas'],
                'description' => 'Koordinator operasional riset, praktikum, dan fasilitas komputasi/eksperimen.',
                'sort_order' => 7,
            ],
            [
                'name' => 'Ketua Lembaga / Biro',
                'slug' => 'ketua-lembaga',
                'level' => 2,
                'applicable_types' => ['lembaga'],
                'description' => 'Pimpinan lembaga fungsional seperti LPPM, LPM, atau Biro Administrasi.',
                'sort_order' => 8,
            ],
            [
                'name' => 'Ketua Organisasi / Senat',
                'slug' => 'ketua-organisasi',
                'level' => 3,
                'applicable_types' => ['organisasi'],
                'description' => 'Pimpinan badan normatif, senat akademik, atau dewan mahasiswa.',
                'sort_order' => 9,
            ],
        ];

        $posMap = [];
        foreach ($positions as $p) {
            $created = StructuralPosition::updateOrCreate(['slug' => $p['slug']], $p);
            $posMap[$p['slug']] = $created;
        }

        // Ambil staff profiles yang ada
        $profBudi = StaffProfile::where('slug', 'prof-budi-santoso')->first();
        $drSiti = StaffProfile::where('slug', 'dr-siti-aminah')->first();
        $rina = StaffProfile::where('slug', 'rina-marlina')->first();

        // 2. FAKULTAS: Fakultas Ilmu Komputer & Teknologi Informasi
        $fasilkom = OrganizationUnit::updateOrCreate(
            ['slug' => 'fakultas-ilmu-komputer'],
            [
                'parent_id' => null,
                'type' => 'fakultas',
                'name' => 'Fakultas Ilmu Komputer & Teknologi Informasi',
                'code' => 'FK-05',
                'abbreviation' => 'FASILKOM',
                'accreditation' => 'Unggul',
                'accreditation_number' => '120/SK/BAN-PT/Akred/F/II/2024',
                'decree_number' => 'SK Menristekdikti No. 421/KPT/I/2018',
                'description' => '<p><strong>Fakultas Ilmu Komputer & Teknologi Informasi (FASILKOM)</strong> merupakan kawah candradimuka inovasi digital dan kecerdasan buatan terkemuka. Berdiri dengan komitmen mencetak talenta komputasi unggul berwawasan global yang mampu merancang arsitektur perangkat lunak mutakhir, analitika data skala besar, dan sistem keamanan siber berintegritas tinggi.</p><p>FASILKOM mengedepankan riset kolaboratif antara akademisi, industri teknologi multinasional, serta lembaga riset global.</p>',
                'vision' => 'Menjadi pusat keunggulan pendidikan dan riset bidang ilmu komputer bertaraf internasional yang berakar pada nilai-nilai integritas dan berdampak bagi kemajuan peradaban digital pada tahun 2035.',
                'mission' => "1. Menyelenggarakan pendidikan tinggi ilmu komputer berbasis outcome-based education (OBE) dan standar internasional.\n2. Melaksanakan riset terdepan dalam bidang Artificial Intelligence, Cybersecurity, dan Smart Infrastructure.\n3. Mengimplementasikan hasil riset terapan untuk menjawab kebutuhan transformasi digital bangsa.\n4. Membangun kemitraan strategis dengan ekosistem industri teknologi terkemuka dunia.",
                'career_prospects' => [
                    'Chief Technology Officer (CTO)',
                    'Artificial Intelligence Specialist',
                    'Cloud Solutions Architect',
                    'Senior Cybersecurity Consultant',
                    'Research Scientist & Akademisi Digital',
                    'Technopreneur / Founder Startup',
                ],
                'facebook_url' => 'https://facebook.com/fasilkom.univ',
                'instagram_url' => 'https://instagram.com/fasilkom_official',
                'x_url' => 'https://x.com/fasilkom_univ',
                'tiktok_url' => 'https://tiktok.com/@fasilkom.kampus',
                'youtube_url' => 'https://youtube.com/@fasilkomtv',
                'website_url' => 'https://fasilkom.univ.ac.id',
                'email' => 'fasilkom@univ.ac.id',
                'phone' => '+62 21 8765-4321',
                'office_location' => 'Gedung Rektorat Lt. 3-4, Sayap Barat Kampus Utama',
                'cover_image_path' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        // 3. PROGRAM STUDI 1: S1 Teknik Informatika (Anak dari Fasilkom)
        $prodiTif = OrganizationUnit::updateOrCreate(
            ['slug' => 's1-teknik-informatika'],
            [
                'parent_id' => $fasilkom->id,
                'type' => 'prodi',
                'name' => 'S1 Teknik Informatika',
                'code' => '55201',
                'abbreviation' => 'TIF',
                'degree_level' => 'S1',
                'accreditation' => 'Unggul',
                'accreditation_number' => '045/SK/LAM-INFOKOM/Akred/S/VI/2024',
                'decree_number' => 'SK Pendirian No. 128/D/T/2010',
                'graduate_title' => 'Sarjana Komputer (S.Kom.)',
                'description' => '<p><strong>Program Studi S1 Teknik Informatika</strong> memfokuskan penguasaan fundamental algoritma, rekayasa perangkat lunak skala enterprise, kecerdasan buatan (Machine Learning, Deep Learning), dan komputasi awan. Mahasiswa dibekali kurikulum mutakhir berbasis project-based learning yang terintegrasi dengan sertifikasi industri internasional (AWS, Cisco, Google Cloud, RedHat).</p>',
                'vision' => 'Menjadi program studi sarjana teknik informatika berdaya saing global yang unggul dalam rekayasa perangkat lunak cerdas dan komputasi awan berkarakter unggul.',
                'mission' => "1. Menyelenggarakan proses pembelajaran berkualitas tinggi dengan standar kurikulum ACM/IEEE-CS.\n2. Mengembangkan penelitian inovatif di bidang AI, Computer Vision, dan Internet of Things.\n3. Mengembangkan solusi perangkat lunak yang berdaya guna bagi masyarakat dan industri.",
                'career_prospects' => [
                    'Full-Stack Software Engineer',
                    'Machine Learning & AI Engineer',
                    'DevOps & Cloud Engineer',
                    'Mobile Application Developer',
                    'Cyber Defense Engineer',
                    'Data Engineer',
                ],
                'facebook_url' => 'https://facebook.com/tif.fasilkom',
                'instagram_url' => 'https://instagram.com/tif_fasilkom',
                'x_url' => 'https://x.com/tif_fasilkom',
                'tiktok_url' => 'https://tiktok.com/@tif.informatika',
                'youtube_url' => 'https://youtube.com/@informatikachannel',
                'website_url' => 'https://tif.fasilkom.univ.ac.id',
                'email' => 'informatika@univ.ac.id',
                'phone' => '+62 21 8765-4322',
                'office_location' => 'Gedung Lab Cyber Lt. 2, Ruang Kaprodi TIF',
                'cover_image_path' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        // 4. PROGRAM STUDI 2: S1 Sistem Informasi (Anak dari Fasilkom)
        $prodiSi = OrganizationUnit::updateOrCreate(
            ['slug' => 's1-sistem-informasi'],
            [
                'parent_id' => $fasilkom->id,
                'type' => 'prodi',
                'name' => 'S1 Sistem Informasi',
                'code' => '57201',
                'abbreviation' => 'SI',
                'degree_level' => 'S1',
                'accreditation' => 'Unggul',
                'accreditation_number' => '082/SK/LAM-INFOKOM/Akred/S/VIII/2024',
                'decree_number' => 'SK Pendirian No. 204/D/T/2012',
                'graduate_title' => 'Sarjana Komputer (S.Kom.)',
                'description' => '<p><strong>Program Studi S1 Sistem Informasi</strong> menjembatani keselarasan antara teknologi informasi mutakhir dan strategi bisnis korporasi modern. Mahasiswa dilatih menjadi arsitek transformasi digital, ahli analitika bisnis dan big data, serta auditor tata kelola teknologi informasi berbasis kerangka COBIT dan ITIL.</p>',
                'vision' => 'Menjadi pusat unggulan pendidikan sistem informasi yang melahirkan pemimpin transformasi digital dan arsitek data terpercaya bagi ekosistem industri modern.',
                'mission' => "1. Melaksanakan pendidikan sarjana sistem informasi yang memadukan kecerdasan analitik dan strategi bisnis.\n2. Melaksanakan riset berorientasi pemecahan masalah tata kelola TI dan analitika data perusahaan.\n3. Menghasilkan lulusan yang adaptif, berintegritas, dan berkemampuan analitis tinggi.",
                'career_prospects' => [
                    'Enterprise Business Analyst',
                    'IT Governance & Risk Auditor',
                    'Data Scientist / Business Intelligence Specialist',
                    'Product Manager Tech',
                    'ERP & SAP Functional Consultant',
                    'Digital Transformation Strategist',
                ],
                'facebook_url' => 'https://facebook.com/si.fasilkom',
                'instagram_url' => 'https://instagram.com/sistem_informasi_univ',
                'x_url' => 'https://x.com/si_fasilkom',
                'tiktok_url' => 'https://tiktok.com/@si.datainsight',
                'youtube_url' => 'https://youtube.com/@siunivchannel',
                'website_url' => 'https://si.fasilkom.univ.ac.id',
                'email' => 'si@univ.ac.id',
                'phone' => '+62 21 8765-4323',
                'office_location' => 'Gedung Lab Cyber Lt. 2, Ruang Kaprodi SI',
                'cover_image_path' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        // 5. UPT: UPT Laboratorium Komputer & Komputasi Awan
        $uptLab = OrganizationUnit::updateOrCreate(
            ['slug' => 'upt-laboratorium-komputer'],
            [
                'parent_id' => null,
                'type' => 'upt',
                'name' => 'UPT Laboratorium Komputer & Infrastruktur Cloud',
                'code' => 'UPT-LAB',
                'abbreviation' => 'UPT-LAB',
                'description' => '<p><strong>UPT Laboratorium Komputer</strong> mengelola seluruh infrastruktur pusat data, server riset AI berkapasitas GPU tinggi, laboratorium jaringan terpadu Cisco, dan fasilitas komputasi berkinerja tinggi (HPC) untuk mendukung kegiatan praktikum serta riset sivitas akademika.</p>',
                'vision' => 'Menjadi unit pelaksana teknis laboratorium terpadu berstandar industri internasional yang andal dalam menopang tridharma perguruan tinggi.',
                'mission' => "1. Menyediakan layanan komputasi dan infrastruktur cloud yang tangguh, aman, dan berdaya guna.\n2. Memfasilitasi praktikum dan riset mutakhir bagi seluruh program studi.",
                'career_prospects' => [
                    'Network Operations Center Engineer',
                    'System Administrator',
                    'High Performance Computing Specialist',
                ],
                'facebook_url' => 'https://facebook.com/labkomputer.univ',
                'instagram_url' => 'https://instagram.com/labkomputer_univ',
                'x_url' => 'https://x.com/labkomputer_univ',
                'tiktok_url' => 'https://tiktok.com/@labkomputer.tech',
                'email' => 'upt.lab@univ.ac.id',
                'phone' => '+62 21 8765-4325',
                'office_location' => 'Gedung Lab Cyber Lt. 1, Ruang Helpdesk & Server Farm',
                'cover_image_path' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );

        // 6. PENETAPAN PEJABAT STRUKTURAL (unit_position_holders)
        if ($profBudi && isset($posMap['dekan'])) {
            UnitPositionHolder::updateOrCreate(
                [
                    'organization_unit_id' => $fasilkom->id,
                    'structural_position_id' => $posMap['dekan']->id,
                    'staff_profile_id' => $profBudi->id,
                ],
                [
                    'custom_title' => 'Dekan Fakultas Ilmu Komputer & TI',
                    'period_start' => '2024',
                    'period_end' => '2028',
                    'decree_number' => 'SK-R/012/KP/2024',
                    'is_current' => true,
                    'sort_order' => 1,
                ]
            );
        }

        if ($drSiti && isset($posMap['ketua-program-studi'])) {
            UnitPositionHolder::updateOrCreate(
                [
                    'organization_unit_id' => $prodiSi->id,
                    'structural_position_id' => $posMap['ketua-program-studi']->id,
                    'staff_profile_id' => $drSiti->id,
                ],
                [
                    'custom_title' => 'Ketua Program Studi S1 Sistem Informasi',
                    'period_start' => '2023',
                    'period_end' => '2027',
                    'decree_number' => 'SK-R/045/KP/2023',
                    'is_current' => true,
                    'sort_order' => 1,
                ]
            );
        }

        if ($rina && isset($posMap['kepala-laboratorium'])) {
            UnitPositionHolder::updateOrCreate(
                [
                    'organization_unit_id' => $uptLab->id,
                    'structural_position_id' => $posMap['kepala-laboratorium']->id,
                    'staff_profile_id' => $rina->id,
                ],
                [
                    'custom_title' => 'Kepala Laboratorium Komputer & Jaringan',
                    'period_start' => '2024',
                    'period_end' => '2028',
                    'decree_number' => 'SK-R/088/KP/2024',
                    'is_current' => true,
                    'sort_order' => 1,
                ]
            );
        }

        // 7. MULTI-SELECT DOSEN PENGAJAR PADA FAKULTAS & PRODI
        if ($profBudi) {
            $fasilkom->lecturers()->syncWithoutDetaching([
                $profBudi->id => ['role' => 'dosen_homebase', 'sort_order' => 1],
            ]);
            $prodiTif->lecturers()->syncWithoutDetaching([
                $profBudi->id => ['role' => 'dosen_homebase', 'sort_order' => 1],
            ]);
            $prodiSi->lecturers()->syncWithoutDetaching([
                $profBudi->id => ['role' => 'dosen_pengajar', 'sort_order' => 2],
            ]);
        }

        if ($drSiti) {
            $fasilkom->lecturers()->syncWithoutDetaching([
                $drSiti->id => ['role' => 'dosen_homebase', 'sort_order' => 2],
            ]);
            $prodiSi->lecturers()->syncWithoutDetaching([
                $drSiti->id => ['role' => 'dosen_homebase', 'sort_order' => 1],
            ]);
            $prodiTif->lecturers()->syncWithoutDetaching([
                $drSiti->id => ['role' => 'dosen_pengajar', 'sort_order' => 2],
            ]);
        }

        if ($rina) {
            $uptLab->lecturers()->syncWithoutDetaching([
                $rina->id => ['role' => 'tenaga_kependidikan', 'sort_order' => 1],
            ]);
        }
    }
}
