<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CampusSetting extends Model
{
    protected $fillable = [
        'rector_name',
        'rector_title',
        'rector_image_path',
        'rector_quote',
        'rector_speech',
        'rector_video_url',
        'hero_slides',
        'hero_stats',
        'about_background',
        'about_image_path',
        'about_vision',
        'about_missions',
        'about_goals',
        'about_development_models',
        'about_development_strategies',
        'about_accreditation',
        'home_sections',
    ];

    protected $casts = [
        'hero_slides' => 'array',
        'hero_stats' => 'array',
        'about_missions' => 'array',
        'about_goals' => 'array',
        'about_development_models' => 'array',
        'about_development_strategies' => 'array',
        'about_accreditation' => 'array',
        'home_sections' => 'array',
    ];

    protected $appends = [
        'rector_image_url',
        'about_image_url',
    ];

    public function getRectorImageUrlAttribute(): ?string
    {
        if (blank($this->rector_image_path)) {
            return null;
        }
        if (str_starts_with($this->rector_image_path, 'http://') || str_starts_with($this->rector_image_path, 'https://') || str_starts_with($this->rector_image_path, '/')) {
            return $this->rector_image_path;
        }
        return Storage::url($this->rector_image_path);
    }

    public function getAboutImageUrlAttribute(): ?string
    {
        if (blank($this->about_image_path)) {
            return null;
        }
        if (str_starts_with($this->about_image_path, 'http://') || str_starts_with($this->about_image_path, 'https://') || str_starts_with($this->about_image_path, '/')) {
            return $this->about_image_path;
        }
        return Storage::url($this->about_image_path);
    }

    /**
     * Dapatkan setting aktif atau buat dengan preset default sesuai template kampus
     */
    public static function getActive(): self
    {
        $setting = static::query()->first();

        if (!$setting) {
            $setting = static::query()->create(static::defaultValues());
        }

        return $setting;
    }

    /**
     * Preset nilai bawaan yang kaya mengacu pada Template Kampus Vue
     */
    public static function defaultValues(): array
    {
        return [
            // Sambutan Rektor
            'rector_name' => 'Prof. Dr. Ahmad Wijaya, M.Sc.',
            'rector_title' => 'Rektor Institut Teknologi & Bisnis',
            'rector_image_path' => '/images/rektor.png',
            'rector_quote' => 'Puji syukur ke hadirat Tuhan YME, atas segala rahmat dan karunia-Nya. Selamat datang di portal resmi kampus kami. Kami berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi yang mempersiapkan generasi muda menghadapi revolusi industri global.',
            'rector_speech' => "<p><strong>Assalamu’alaikum Warahmatullahi Wabarakatuh,</strong><br>Salam sejahtera bagi kita semua.</p><p>Puji syukur ke hadirat Tuhan Yang Maha Esa, atas segala rahmat dan karunia-Nya. Selamat datang di portal resmi sivitas akademika.</p><p>Di era Revolusi Industri 4.0 dan Society 5.0, perguruan tinggi dituntut untuk tidak hanya menjadi menara gading yang melahirkan kaum intelektual, namun juga harus mampu menjadi motor penggerak inovasi yang memberikan solusi nyata bagi permasalahan bangsa. Oleh karena itu, kami terus berkomitmen untuk memberikan pendidikan berkualitas tinggi yang adaptif, inovatif, dan relevan dengan tantangan industri global.</p><p>Melalui website ini, kami berharap seluruh informasi mengenai kegiatan akademik, penelitian, pengabdian masyarakat, serta inovasi yang lahir dari sivitas akademika dapat tersampaikan secara transparan, cepat, dan akurat kepada publik.</p><p>Mari bersama-sama kita membangun generasi emas Indonesia yang unggul dalam IPTEK dan kokoh dalam integritas moral.</p><p><strong>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</strong></p>",
            'rector_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',

            // Hero Slides
            'hero_slides' => [
                [
                    'id' => 'slide-1',
                    'badge' => 'KAMPUS UNGGULAN',
                    'title' => 'Membangun <span class="text-secondary-400">Generasi Emas</span> Masa Depan',
                    'desc' => 'Lingkungan belajar modern dengan tenaga pendidik profesional dan program terarah untuk membentuk karakter, kompetensi, dan kesiapan karier mahasiswa di era kecerdasan artifisial.',
                    'media_type' => 'image', // 'image' | 'youtube'
                    'image_url' => '/images/campus-hero.png',
                    'youtube_url' => '',
                    'primary_btn_text' => 'Daftar Sekarang',
                    'primary_btn_url' => '/pendaftaran',
                    'secondary_btn_text' => 'Profil Kampus',
                    'secondary_btn_url' => '/tentang',
                ],
                [
                    'id' => 'slide-2',
                    'badge' => 'MERDEKA BELAJAR',
                    'title' => 'Berinovasi Tanpa <span class="text-secondary-400">Batas Ruang</span> & Waktu',
                    'desc' => 'Hadir untuk mencetak generasi unggul yang siap bersaing di kancah global dengan kurikulum berbasis proyek riil dan kolaborasi industri terkemuka.',
                    'media_type' => 'image',
                    'image_url' => '/images/students-activity.png',
                    'youtube_url' => '',
                    'primary_btn_text' => 'Program Studi',
                    'primary_btn_url' => '/program-studi',
                    'secondary_btn_text' => 'Kehidupan Kampus',
                    'secondary_btn_url' => '/ekstrakurikuler',
                ],
                [
                    'id' => 'slide-3',
                    'badge' => 'RISET & TEKNOLOGI',
                    'title' => 'Fasilitas Riset <span class="text-secondary-400">Berstandar Industri</span>',
                    'desc' => 'Dilengkapi dengan laboratorium modern terakreditasi untuk mendukung riset teknologi, rekayasa perangkat lunak, dan inkubasi bisnis digital.',
                    'media_type' => 'image',
                    'image_url' => '/images/lab.png',
                    'youtube_url' => '',
                    'primary_btn_text' => 'Jelajahi Fasilitas',
                    'primary_btn_url' => '/fasilitas',
                    'secondary_btn_text' => 'Baca Warta',
                    'secondary_btn_url' => '/berita',
                ],
            ],

            // Hero Stats Bar
            'hero_stats' => [
                ['value' => 'UNGGUL', 'label' => 'Akreditasi BAN-PT', 'accent' => false],
                ['value' => '8.500+', 'label' => 'Mahasiswa Aktif', 'accent' => true],
                ['value' => '320+', 'label' => 'Dosen & Praktisi', 'accent' => true],
                ['value' => '25+', 'label' => 'Program Studi Unggulan', 'accent' => true],
            ],

            // Profil Lengkap Kampus
            'about_background' => "Institut didirikan dengan visi luhur menjadi pusat keunggulan pendidikan sains terapan, teknologi digital, dan manajemen bisnis masa depan. Berawal dari tekad para pendiri untuk memperluas akses pendidikan bermutu di kawasan regional, kampus telah bertransformasi menjadi salah satu institusi pendidikan terkemuka dengan reputasi riset dan keterhubungan industri yang kuat.\n\nDengan komitmen Tri Dharma Perguruan Tinggi, kampus kami memadukan kurikulum berstandar internasional dengan penanaman nilai budi pekerti luhur, kepemimpinan etis, dan kepedulian sosial bagi kemajuan peradaban bangsa.",
            'about_image_path' => '/images/campus-hero.png',
            'about_vision' => 'Menjadi institusi pendidikan tinggi unggulan bertaraf internasional yang menghasilkan lulusan berkarakter mulia, adaptif terhadap kemajuan teknologi, berjiwa kewirausahaan, dan berkontribusi nyata dalam pembangunan bangsa.',
            'about_missions' => [
                'Menyelenggarakan pendidikan berkualitas tinggi berbasis riset mutakhir dan teknologi terapan.',
                'Mengembangkan penelitian inovatif dan aplikatif yang berkontribusi pada pemecahan permasalahan masyarakat dan industri.',
                'Melaksanakan pengabdian masyarakat berkelanjutan yang berdampak langsung pada kesejahteraan sosial.',
                'Membangun kemitraan strategis dengan perguruan tinggi dunia, dunia usaha, dan instansi pemerintah.',
                'Menanamkan nilai-nilai integritas, etika profesi, kepemimpinan transformasional, dan kesadaran lingkungan.',
            ],
            'about_goals' => [
                [
                    'title' => 'Lulusan Kompeten & Siap Kerja',
                    'desc' => 'Menghasilkan lulusan yang menguasai keahlian teknis dan soft skills, siap berkarier serta bersaing secara global.',
                    'icon' => 'GraduationCap',
                    'bg' => 'bg-indigo-600',
                ],
                [
                    'title' => 'Riset & Hilirisasi Produk',
                    'desc' => 'Mendorong publikasi ilmiah bereputasi internasional dan hilirisasi produk inovasi yang bermanfaat bagi masyarakat.',
                    'icon' => 'FlaskConical',
                    'bg' => 'bg-emerald-600',
                ],
                [
                    'title' => 'Pengabdian Berkelanjutan',
                    'desc' => 'Mengaplikasikan teknologi tepat guna dan program pemberdayaan masyarakat di berbagai wilayah desa dan perkotaan.',
                    'icon' => 'HeartHandshake',
                    'bg' => 'bg-amber-600',
                ],
                [
                    'title' => 'Kolaborasi Internasional',
                    'desc' => 'Menjalin jejaring akademik, pertukaran mahasiswa, dan joint research dengan universitas terkemuka dunia.',
                    'icon' => 'Globe',
                    'bg' => 'bg-blue-600',
                ],
                [
                    'title' => 'Transformasi Digital Terpadu',
                    'desc' => 'Mengintegrasikan ekosistem smart campus dengan infrastruktur cloud computing, e-learning AI, dan otomasi layanan.',
                    'icon' => 'Cpu',
                    'bg' => 'bg-purple-600',
                ],
                [
                    'title' => 'Kepemimpinan & Karakter',
                    'desc' => 'Membentuk generasi pemimpin yang menjunjung tinggi moral, integritas etika, dan wawasan kebangsaan kebhinekaan.',
                    'icon' => 'Award',
                    'bg' => 'bg-rose-600',
                ],
            ],
            'about_development_models' => [
                [
                    'title' => 'Teaching Factory & Industry Immersion',
                    'desc' => 'Model pembelajaran berbasis proyek industri nyata di mana mahasiswa bekerja pada studi kasus riil bersama mitra industri terkemuka.',
                    'icon' => 'Factory',
                    'tag' => 'Pilar Vokasi & Terapan',
                ],
                [
                    'title' => 'Technopreneurship & Startup Hatchery',
                    'desc' => 'Inkubasi bisnis rintisan berbasis teknologi untuk membimbing mahasiswa từ ide prototipe hingga validasi pasar dan permodalan seed.',
                    'icon' => 'Rocket',
                    'tag' => 'Inkubator Bisnis',
                ],
                [
                    'title' => 'Smart Green Campus Ecosystem',
                    'desc' => 'Penerapan kampus pintar ramah lingkungan dengan energi terbarukan, efisiensi sumber daya digital, dan ruang hijau terpadu.',
                    'icon' => 'Leaf',
                    'tag' => 'Keberlanjutan Lingkungan',
                ],
                [
                    'title' => 'Agile Curriculum & Global Certification',
                    'desc' => 'Pembaruan kurikulum tahunan yang adaptif terhadap dinamika AI dan industri dengan sertifikasi keahlian berstandar internasional.',
                    'icon' => 'Sparkles',
                    'tag' => 'Standar Mutu Global',
                ],
            ],
            'about_development_strategies' => [
                [
                    'phase' => 'Fase I (2024 - 2026)',
                    'title' => 'Penguatan Fondasi Digital & Standarisasi Mutu',
                    'desc' => 'Transformasi infrastruktur smart classroom, digitalisasi layanan akademik, dan peningkatan akreditasi seluruh program studi menjadi Unggul.',
                    'target_year' => '2026',
                ],
                [
                    'phase' => 'Fase II (2026 - 2028)',
                    'title' => 'Ekspansi Riset Terapan & Kemitraan Industri',
                    'desc' => 'Peningkatan jumlah publikasi Scopus Q1/Q2, pembangunan living laboratory industri, dan komersialisasi paten sivitas akademika.',
                    'target_year' => '2028',
                ],
                [
                    'phase' => 'Fase III (2028 - 2030)',
                    'title' => 'Rekognisi Internasional & World Class Institute',
                    'desc' => 'Akreditasi internasional (ABET/ASIIN), pertukaran mahasiswa global 500+ per tahun, dan reputasi peringkat global terkemuka.',
                    'target_year' => '2030',
                ],
            ],
            'about_accreditation' => [
                'grade' => 'UNGGUL (A)',
                'institution' => 'Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT)',
                'sk_number' => 'SK BAN-PT No. 1284/SK/BAN-PT/Ak-PPJ/PT/V/2024',
                'valid_until' => '2029-05-20',
                'desc' => 'Institusi telah memenuhi 9 kriteria standar mutu BAN-PT dengan capaian predikat UNGGUL, menjamin mutu penyelenggaraan akademik yang diakui secara nasional dan internasional.',
            ],

            // Home Sections Page Builder (Urutan & Tampilan Section di Halaman Depan)
            'home_sections' => [
                ['id' => 'hero', 'label' => 'Hero Slider & Stats Bar', 'enabled' => true, 'order' => 1],
                ['id' => 'welcome', 'label' => 'Sambutan Rektor (Welcome Section)', 'enabled' => true, 'order' => 2],
                ['id' => 'features', 'label' => 'Keunggulan & Model Pengembangan Kampus', 'enabled' => true, 'order' => 3],
                ['id' => 'programs', 'label' => 'Fakultas & Program Studi Unggulan', 'enabled' => true, 'order' => 4],
                ['id' => 'staff', 'label' => 'Dosen & Tenaga Pengajar', 'enabled' => true, 'order' => 5],
                ['id' => 'facilities', 'label' => 'Fasilitas Kampus Modern', 'enabled' => true, 'order' => 6],
                ['id' => 'extracurriculars', 'label' => 'Ormawa & Ekstrakurikuler (Ekskul)', 'enabled' => true, 'order' => 7],
                ['id' => 'galleries', 'label' => 'Galeri Foto & Video Kampus', 'enabled' => true, 'order' => 8],
                ['id' => 'info', 'label' => 'Informasi Terkini (Berita, Agenda & Pengumuman)', 'enabled' => true, 'order' => 9],
                ['id' => 'cta', 'label' => 'Call to Action (Pendaftaran Mahasiswa)', 'enabled' => true, 'order' => 10],
            ],
        ];
    }
}
