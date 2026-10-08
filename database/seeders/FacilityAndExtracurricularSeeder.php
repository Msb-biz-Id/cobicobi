<?php

namespace Database\Seeders;

use App\Models\Extracurricular;
use App\Models\Facility;
use App\Models\StaffProfile;
use App\Models\StructuralAssignment;
use App\Models\StructuralPosition;
use Illuminate\Database\Seeder;

class FacilityAndExtracurricularSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tambah Master Jabatan Khusus Pembina Ekstrakurikuler / UKM
        $positions = [
            [
                'name' => 'Pembina UKM',
                'slug' => 'pembina-ukm',
                'level' => 3,
                'target_scope' => 'extracurricular',
                'description' => 'Dosen atau staf pembina pembimbing kegiatan kemahasiswaan dan UKM',
                'sort_order' => 9,
            ],
            [
                'name' => 'Pembina Utama',
                'slug' => 'pembina-utama',
                'level' => 3,
                'target_scope' => 'extracurricular',
                'description' => 'Pembina utama penanggung jawab arah pembinaan UKM',
                'sort_order' => 10,
            ],
            [
                'name' => 'Pembina Pendamping Teknis',
                'slug' => 'pembina-pendamping-teknis',
                'level' => 4,
                'target_scope' => 'extracurricular',
                'description' => 'Pendamping teknis operasional dan perlombaan UKM',
                'sort_order' => 11,
            ],
        ];

        foreach ($positions as $pos) {
            StructuralPosition::updateOrCreate(['slug' => $pos['slug']], $pos);
        }

        // 2. Seed Data Fasilitas Kampus (Terpisah)
        $facilities = [
            [
                'name' => 'Perpustakaan Pusat & Smart Digital Library',
                'slug' => 'perpustakaan-pusat-dan-smart-digital-library',
                'category' => 'akademik',
                'short_description' => 'Gedung perpustakaan 4 lantai berkonsep smart learning environment dengan akses e-journal global, RFID self-checkout, dan collaborative space.',
                'description' => '<p>Perpustakaan Pusat menyediakan lebih dari 150.000 judul buku fisik, jutaan repositori digital, ruang hening penelitian, serta 20 bilik multimedia pods untuk diskusi riset kelompok.</p>',
                'features' => [
                    'Kapasitas 1.500 Pengunjung',
                    'Akses Full IEEE, Springer & Scopus',
                    'RFID Self-Checkout & Book Return 24 Jam',
                    '20 Pods Diskusi Collaborative',
                    'Full AC & Akses Wi-Fi 6 Dedicated',
                    'Aksesibilitas Ramah Disabilitas & Lift',
                ],
                'location' => 'Gedung Perpustakaan Pusat, Sayap Barat Kampus Terpadu',
                'operational_hours' => 'Senin - Jumat: 08.00 - 21.00 WIB, Sabtu: 08.00 - 16.00 WIB',
                'contact_person' => 'Dra. Hj. Nurhayati, M.Hum.',
                'contact_phone' => '+62 812-3456-7890',
                'booking_info' => 'Mahasiswa dan dosen dapat melakukan reservasi ruang diskusi kolaboratif melalui aplikasi kampus H-1.',
                'booking_url' => 'https://library.campus.ac.id/booking-room',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Gelanggang Olahraga & Sport Complex Terpadu',
                'slug' => 'gelanggang-olahraga-dan-sport-complex-terpadu',
                'category' => 'olahraga',
                'short_description' => 'Fasilitas olahraga multifungsi berstandar internasional untuk futsal, basket, bulu tangkis, voli, serta jogging track terbuka.',
                'description' => '<p>Sport Complex terpadu dirancang untuk mendukung kebugaran mahasiswa dan atlet kampus dengan lantai interlock berstandar FIBA/BWF serta pencahayaan turnamen malam hari.</p>',
                'features' => [
                    'Tribun Penonton Kapasitas 2.500 Orang',
                    'Lapangan Futsal & Basket Indoor Interlock',
                    '3 Lapangan Bulu Tangkis Karpet Vinyl',
                    'Pencahayaan LED Stadium 1.200 Lux',
                    'Kamar Ganti & Ruang Shower Air Panas',
                    'Papan Skor Digital Terintegrasi',
                ],
                'location' => 'Zona Sport Center Kampus Timur',
                'operational_hours' => 'Setiap Hari: 06.00 - 22.00 WIB',
                'contact_person' => 'Hendra Setiawan, S.Pd.',
                'contact_phone' => '+62 813-9876-5432',
                'booking_info' => 'Peminjaman lapangan untuk kompetisi fakultas atau latihan UKM wajib mengajukan surat izin resmi ke Biro Kemahasiswaan.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Laboratorium Terpadu AI & Rekayasa Robotika',
                'slug' => 'laboratorium-terpadu-ai-dan-rekayasa-robotika',
                'category' => 'laboratorium',
                'short_description' => 'Pusat riset komputasi mutakhir, stasiun kerja GPU deep learning, arena uji tanding robotik, dan fasilitas fabrikasi PCB modern.',
                'description' => '<p>Fasilitas laboratorium riset kolaboratif antara dosen dan mahasiswa untuk pengembangan autonomous vehicles, robot humanoid, dan sistem IoT industri terapan.</p>',
                'features' => [
                    'Supercomputing Server GPU NVIDIA RTX 4090',
                    'Arena Uji Tanding Robot Lapangan Sintetis',
                    '3D Printer High-Precision & CNC Laser Cutter',
                    'Oscilloscope Digital & Spectrum Analyzer',
                    'Jaringan Internet Dedicated 1 Gbps',
                ],
                'location' => 'Gedung Riset dan Komputasi Lantai 2',
                'operational_hours' => 'Senin - Jumat: 08.00 - 18.00 WIB (Mahasiswa Riset 24 Jam)',
                'contact_person' => 'Dr. Ir. Wahyu Hidayat, M.T.',
                'contact_phone' => '+62 811-2233-4455',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Auditorium Utama Graha Nusantara',
                'slug' => 'auditorium-utama-graha-nusantara',
                'category' => 'layanan_umum',
                'short_description' => 'Gedung pertemuan akbar dan auditorium megah untuk upacara wisuda, seminar internasional, konser musik, dan perhelatan akbar kampus.',
                'description' => '<p>Auditorium modern berkapasitas 3.500 kursi teater dengan akustik ruang berstandar konser simfoni serta layar videotron LED panggung 16x6 meter.</p>',
                'features' => [
                    'Kapasitas Kursi Teater 3.500 Orang',
                    'Layar Videotron LED Panggung P2.5 16x6 Meter',
                    'Line Array Sound System 25.000 Watt',
                    'Ruang VIP Transit & Ruang Rias Backstage',
                    'Genset Otomatis Cadangan 500 kVA',
                ],
                'location' => 'Gedung Pusat Graha Nusantara Lantai 1-3',
                'operational_hours' => 'Sesuai Jadwal Agenda & Reservasi',
                'contact_person' => 'Biro Sarana & Prasarana Kampus',
                'contact_phone' => '+62 21 8899 1700',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($facilities as $fac) {
            Facility::updateOrCreate(['slug' => $fac['slug']], $fac);
        }

        // 3. Seed Data Ekstrakurikuler / UKM (Terpisah)
        $ukms = [
            [
                'name' => 'UKM Robotika & Kecerdasan Buatan',
                'slug' => 'ukm-robotika-dan-kecerdasan-buatan',
                'abbreviation' => 'ROBOTIK',
                'category' => 'penalaran_keilmuan',
                'description' => '<p>UKM Robotika merupakan wadah mahasiswa dalam berkreasi, merancang robot berkaki, robot terbang (drone), dan sistem kecerdasan buatan untuk perlombaan tingkat nasional maupun internasional.</p>',
                'vision' => '<p>Menjadi UKM pelopor inovasi robotika mahasiswa bereputasi internasional yang konsisten menyumbangkan prestasi juara di tingkat global.</p>',
                'mission' => '<ul><li>Mengembangkan riset hardware dan software robotika secara mandiri dan berkelanjutan.</li><li>Menyelenggarakan workshop dan regenerasi talenta teknologi baru setiap semester.</li><li>Berpartisipasi aktif dalam Kontes Robot Indonesia (KRI) dan Robofest Dunia.</li></ul>',
                'achievements' => [
                    'Juara 1 Kontes Robot Indonesia (KRI) Divisi Robot SAR Nasional 2025',
                    'Best Engineering & Algorithm Award World Robofest Tokyo 2024',
                    'Medali Emas Kontes Robot Terbang Indonesia (KRTI) 2024',
                    'Penerima Hibah Program Kreativitas Mahasiswa (PKM-KC) Nasional',
                ],
                'activities_overview' => 'Latihan dan riset rutin setiap Selasa dan Jumat pukul 16.00 WIB di Lab Robotika, serta bootcamp intensif menjelang kejuaraan nasional.',
                'registration_info' => 'Open Recruitment anggota baru dibuka setiap awal semester ganjil untuk seluruh mahasiswa dari semua fakultas dan jurusan.',
                'registration_url' => 'https://bit.ly/oprec-ukm-robotika',
                'facebook_url' => 'https://facebook.com/ukmrobotika.campus',
                'instagram_url' => 'https://instagram.com/robotika_campus',
                'x_url' => 'https://x.com/robotika_campus',
                'tiktok_url' => 'https://tiktok.com/@robotikacampus_life',
                'youtube_url' => 'https://youtube.com/@robotikacampusofficial',
                'website_url' => 'https://robotika.campus.ac.id',
                'email' => 'robotika@campus.ac.id',
                'phone' => '+62 821-1234-5678',
                'office_location' => 'Gedung Student Center / PKM Lantai 2 Ruang 204',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Paduan Suara Mahasiswa (PSM) Gita Nusantara',
                'slug' => 'paduan-suara-mahasiswa-gita-nusantara',
                'abbreviation' => 'PSM',
                'category' => 'seni_budaya',
                'description' => '<p>Paduan Suara Mahasiswa Gita Nusantara mengembangkan bakat olah vokal, musik paduan suara klasik, lagu daerah nusantara, dan folklore di panggung festival bergengsi internasional.</p>',
                'vision' => '<p>Mengharumkan nama almamater dan bangsa di panggung musik paduan suara dunia melalui karya musikal berkualitas tinggi.</p>',
                'mission' => '<ul><li>Menjaga tradisi musikalitas paduan suara dengan kedisiplinan dan keharmonisan.</li><li>Menjadi duta budaya bangsa dalam festival folklore internasional.</li></ul>',
                'achievements' => [
                    'Grand Prix Winner Bali International Choir Festival 2025',
                    'Gold Medal Category Folklore di Tokyo International Choir Competition 2024',
                    'Paduan Suara Resmi Upacara Wisuda & Dies Natalis Universitas',
                ],
                'activities_overview' => 'Latihan olah vokal setiap Senin dan Kamis pukul 18.30 WIB di Ruang Akustik Gedung PKM Lantai 3.',
                'registration_info' => 'Audisi vokal (sopran, alto, tenor, bass) dibuka untuk mahasiswa baru setiap September.',
                'registration_url' => 'https://bit.ly/audisi-psm-campus',
                'instagram_url' => 'https://instagram.com/psm_gitanusantara',
                'tiktok_url' => 'https://tiktok.com/@psm_gitanusantara',
                'email' => 'psm@campus.ac.id',
                'phone' => '+62 856-7890-1234',
                'office_location' => 'Gedung Student Center Lantai 3 Ruang Musik',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'UKM Sepak Bola & Futsal Mahasiswa',
                'slug' => 'ukm-sepak-bola-dan-futsal-mahasiswa',
                'abbreviation' => 'FUTSAL',
                'category' => 'olahraga',
                'description' => '<p>Wadah pembinaan bakat olahraga sepak bola dan futsal mahasiswa dengan pelatih berlisensi nasional serta partisipasi rutin di Liga Mahasiswa (LIMA).</p>',
                'vision' => '<p>Melahirkan atlet mahasiswa berprestasi, berjiwa sportivitas tinggi, dan solid dalam kerjasama tim.</p>',
                'mission' => '<ul><li>Menjalankan program latihan fisik, taktik, dan mental secara berkala.</li><li>Menjuarai turnamen antar perguruan tinggi di tingkat regional dan nasional.</li></ul>',
                'achievements' => [
                    'Juara 1 Turnamen Futsal Piala Rektor Nasional 2025',
                    'Runner Up Liga Mahasiswa (LIMA) Futsal 2024',
                ],
                'activities_overview' => 'Latihan fisik dan game internal setiap Rabu sore dan Sabtu pagi di Sport Complex Kampus.',
                'registration_info' => 'Seleksi pemain tim universitas diselenggarakan setiap awal semester.',
                'instagram_url' => 'https://instagram.com/futsal_campus_official',
                'tiktok_url' => 'https://tiktok.com/@futsal_campustv',
                'email' => 'futsal@campus.ac.id',
                'phone' => '+62 817-6543-2109',
                'office_location' => 'Gedung Student Center Lantai 1 Ruang 102',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        $posPembina = StructuralPosition::where('slug', 'pembina-ukm')->first();
        $posPembinaUtama = StructuralPosition::where('slug', 'pembina-utama')->first();
        $staffProfiles = StaffProfile::where('is_active', true)->get();

        foreach ($ukms as $idx => $ukmData) {
            $ukm = Extracurricular::updateOrCreate(['slug' => $ukmData['slug']], $ukmData);

            // 4. Hubungkan Dosen / Tendik sebagai PEMBINA UKM dari Master Data Jabatan
            if ($staffProfiles->isNotEmpty()) {
                $staff = $staffProfiles->get($idx % $staffProfiles->count());
                $position = $idx === 0 ? ($posPembinaUtama ?? $posPembina) : $posPembina;

                if ($staff && $position) {
                    StructuralAssignment::updateOrCreate(
                        [
                            'assignable_type' => Extracurricular::class,
                            'assignable_id' => $ukm->id,
                            'structural_position_id' => $position->id,
                        ],
                        [
                            'staff_profile_id' => $staff->id,
                            'custom_title' => null,
                            'period_start' => '2024-01-01',
                            'period_end' => '2026-01-01',
                            'decree_number' => 'SK-REK/PEMBINA-UKM/00' . ($idx + 1) . '/2024',
                            'is_current' => true,
                            'sort_order' => 1,
                        ]
                    );
                }
            }
        }
    }
}
