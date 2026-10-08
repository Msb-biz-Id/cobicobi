<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();

        $events = [
            [
                'title' => 'International Conference on Artificial Intelligence & Smart Education (ICAISE 2026)',
                'slug' => 'international-conference-ai-smart-education-2026',
                'category' => 'Konferensi',
                'organizer' => 'Fakultas Ilmu Komputer & LPPM Universitas',
                'status' => 'published',
                'cover_image_path' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Konferensi internasional tahunan yang mempertemukan akademisi, peneliti dunia, dan praktisi industri untuk membedah akselerasi AI dalam pendidikan tinggi.',
                'description' => '<p>Konferensi Internasional bergengsi yang diselenggarakan oleh <strong>Universitas Sains &amp; Teknologi Nusantara</strong> berkolaborasi dengan IEEE Education Society.</p><h3>Topik Utama:</h3><ul><li>Generative AI &amp; Adaptive Learning in Higher Education</li><li>Ethics and Governance of Academic AI Systems</li><li>Robotics &amp; Cyber-Physical Laboratories</li><li>Natural Language Processing for Multi-Language Scientific Publishing</li></ul><p>Seluruh paper yang diterima akan dipublikasikan di IEEE Xplore dan terindeks Scopus.</p>',
                'start_date' => Carbon::now()->addDays(14)->setTime(8, 30),
                'end_date' => Carbon::now()->addDays(15)->setTime(17, 0),
                'event_type' => 'hybrid',
                'venue_name' => 'Auditorium Utama Gedung Rektorat Lt. 3',
                'address' => 'Jl. Kampus Merdeka No. 101, Kota Pendidikan, Indonesia',
                'maps_url' => 'https://maps.google.com/maps?q=Monas+Jakarta&output=embed',
                'registration_type' => 'paid',
                'price' => 'Rp 250.000 (Mahasiswa) / Rp 750.000 (Umum/Presenter)',
                'registration_url' => 'https://icaise2026.kampus.ac.id/register',
                'registration_button_label' => 'Daftar Konferensi & Call for Papers',
                'registration_deadline' => Carbon::now()->addDays(10)->setTime(23, 59),
                'quota' => 350,
                'sponsors' => [
                    [
                        'name' => 'Kementerian Pendidikan Tinggi, Sains, dan Teknologi',
                        'type' => 'Host & Patron',
                        'logo_url' => '', // Mode Text
                        'website_url' => 'https://kemdiktisaintek.go.id',
                    ],
                    [
                        'name' => 'IEEE Indonesia Section',
                        'type' => 'Technical Co-Sponsor',
                        'logo_url' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
                        'website_url' => 'https://ieee.id',
                    ],
                    [
                        'name' => 'Google Cloud Education',
                        'type' => 'Platinum Sponsor',
                        'logo_url' => 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
                        'website_url' => 'https://cloud.google.com/edu',
                    ],
                    [
                        'name' => 'Dewan Riset Informatika Nasional',
                        'type' => 'Media & Scientific Partner',
                        'logo_url' => '', // Mode Text
                        'website_url' => '',
                    ],
                ],
                'contact_name' => 'Dr. Ir. Hendra Gunawan, S.Kom., M.T.',
                'contact_phone' => '+62 812-3456-7890',
                'contact_email' => 'conference@kampus.ac.id',
            ],
            [
                'title' => 'Kuliah Umum Rektorat: Kepemimpinan Masa Depan Menuju Indonesia Emas 2045',
                'slug' => 'kuliah-umum-rektorat-kepemimpinan-masa-depan',
                'category' => 'Kuliah Umum',
                'organizer' => 'Direktorat Kemahasiswaan & Alumni',
                'status' => 'published',
                'cover_image_path' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Kuliah umum perdana semester ganjil menghadirkan tokoh nasional dan alumni inspiratif tentang kesiapan talenta muda menghadapi disrupsi geopolitik dan ekonomi digital.',
                'description' => '<p>Kuliah Umum wajib bagi mahasiswa tingkat sarjana dan magister. Acara ini mengeksplorasi strategi kepemimpinan adaptif dan etika profesional di era kecerdasan artifisial.</p><p><strong>Narasumber:</strong></p><ul><li>Prof. Dr. Aries Munandar (Rektor Universitas)</li><li>Najwa Shihab, S.H., LL.M. (Jurnalis &amp; Pendiri Narasi)</li></ul>',
                'start_date' => Carbon::now()->addDays(5)->setTime(9, 0),
                'end_date' => Carbon::now()->addDays(5)->setTime(12, 0),
                'event_type' => 'offline',
                'venue_name' => 'Convention Hall Kampus Barat',
                'address' => 'Jl. Boulevard Sains Kav. 5, Kompleks Kampus Terpadu',
                'maps_url' => 'https://maps.google.com/maps?q=Gelora+Bung+Karno+Jakarta&output=embed',
                'registration_type' => 'free',
                'price' => 'Gratis (Free E-Certificate)',
                'registration_url' => 'https://bit.ly/kuliah-umum-rektorat-2026',
                'registration_button_label' => 'Reservasi Kursi Mahasiswa',
                'registration_deadline' => Carbon::now()->addDays(4)->setTime(18, 0),
                'quota' => 1200,
                'sponsors' => [
                    [
                        'name' => 'Badan Eksekutif Mahasiswa (BEM) Universitas',
                        'type' => 'Organized by',
                        'logo_url' => '', // Text mode
                        'website_url' => '',
                    ],
                    [
                        'name' => 'Bank Mandiri (Persero) Tbk',
                        'type' => 'Official Financial Partner',
                        'logo_url' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&q=80',
                        'website_url' => 'https://bankmandiri.co.id',
                    ],
                ],
                'contact_name' => 'Sekretariat Humas Rektorat',
                'contact_phone' => '+62 821-9876-5432',
                'contact_email' => 'humas@kampus.ac.id',
            ],
            [
                'title' => 'Upacara Wisuda Sarjana, Magister & Doktor Periode II Tahun Akademik 2025/2026',
                'slug' => 'upacara-wisuda-sarjana-magister-doktor-periode-ii-2026',
                'category' => 'Wisuda',
                'organizer' => 'Biro Administrasi Akademik & Kemahasiswaan (BAAK)',
                'status' => 'published',
                'cover_image_path' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Pelaksanaan Rapat Terbuka Senat Akademik dalam rangka Wisuda Lulusan Program Sarjana (S1), Magister (S2), dan Doktor (S3).',
                'description' => '<p>Kepada seluruh calon wisudawan periode II diwajibkan telah menyelesaikan yudisium dan bebas tanggungan perpustakaan serta laboratorium.</p><p>Gladi resik diselenggarakan H-1 pada pukul 14:00 WIB di lokasi yang sama.</p>',
                'start_date' => Carbon::now()->addDays(28)->setTime(7, 30),
                'end_date' => Carbon::now()->addDays(28)->setTime(13, 0),
                'event_type' => 'offline',
                'venue_name' => 'Grand Auditorium Nusantara',
                'address' => 'Gedung Pusat Kegiatan Mahasiswa, Kampus Induk',
                'maps_url' => 'https://maps.google.com/maps?q=Universitas+Indonesia+Depok&output=embed',
                'registration_type' => 'invite_only',
                'price' => 'Sesuai Paket Wisuda BAAK',
                'registration_url' => 'https://wisuda.kampus.ac.id/portal-wisudawan',
                'registration_button_label' => 'Akses Portal Wisudawan',
                'registration_deadline' => Carbon::now()->addDays(15)->setTime(23, 59),
                'quota' => 850,
                'sponsors' => [
                    [
                        'name' => 'Ikatan Alumni Universitas (IKA-USTN)',
                        'type' => 'Supported by',
                        'logo_url' => '', // Text mode
                        'website_url' => 'https://alumni.kampus.ac.id',
                    ],
                ],
                'contact_name' => 'Panitia Wisuda BAAK',
                'contact_phone' => '+62 811-2233-4455',
                'contact_email' => 'wisuda@kampus.ac.id',
            ],
            [
                'title' => 'Nusantara Campus Career Expo & Startup Job Fair 2026',
                'slug' => 'nusantara-campus-career-expo-job-fair-2026',
                'category' => 'Job Fair & Expo',
                'organizer' => 'Career Development Center (CDC) Kampus',
                'status' => 'published',
                'cover_image_path' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
                'summary' => 'Pameran karir terbesar tahun ini menghadirkan lebih dari 65 perusahaan multinasional, BUMN, perbankan, dan unicorn teknologi.',
                'description' => '<p>Dapatkan kesempatan interview langsung on-the-spot, walk-in assessment, konsultasi CV, serta seminar persiapan karir profesional bersama HR leaders terkemuka.</p>',
                'start_date' => Carbon::now()->addDays(20)->setTime(9, 0),
                'end_date' => Carbon::now()->addDays(21)->setTime(16, 30),
                'event_type' => 'offline',
                'venue_name' => 'Gedung Olahraga & Sport Hall Terpadu Kampus',
                'address' => 'Zona Fasilitas Mahasiswa, Kampus Timur',
                'maps_url' => 'https://maps.google.com/maps?q=Istora+Senayan+Jakarta&output=embed',
                'registration_type' => 'free',
                'price' => 'Gratis Terbuka Untuk Umum & Mahasiswa',
                'registration_url' => 'https://cdc.kampus.ac.id/careerexpo',
                'registration_button_label' => 'Dapatkan E-Ticket Masuk',
                'registration_deadline' => Carbon::now()->addDays(19)->setTime(23, 59),
                'quota' => 2500,
                'sponsors' => [
                    [
                        'name' => 'Gojek Tokopedia (GoTo)',
                        'type' => 'Main Hiring Partner',
                        'logo_url' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=80',
                        'website_url' => 'https://goto.com',
                    ],
                    [
                        'name' => 'PT Telkom Indonesia (Persero) Tbk',
                        'type' => 'BUMN Talent Partner',
                        'logo_url' => 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
                        'website_url' => 'https://telkom.co.id',
                    ],
                    [
                        'name' => 'Kadin Indonesia Bidang Ketenagakerjaan',
                        'type' => 'Institutional Partner',
                        'logo_url' => '', // Mode Text
                        'website_url' => '',
                    ],
                ],
                'contact_name' => 'Helpdesk Career Center',
                'contact_phone' => '+62 813-7788-9900',
                'contact_email' => 'cdc@kampus.ac.id',
            ],
        ];

        foreach ($events as $item) {
            Event::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    ...$item,
                    'user_id' => $admin?->id,
                ]
            );
        }
    }
}
