<?php

namespace Database\Seeders;

use App\Models\CampusSetting;
use Illuminate\Database\Seeder;

class CampusSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $setting = CampusSetting::query()->first() ?? new CampusSetting();

        $setting->fill([
            'rector_name' => 'Prof. Dr. Ir. H. Budi Santoso, M.Sc., Ph.D., IPU.',
            'rector_title' => 'Rektor Institut Teknologi dan Bisnis',
            'rector_image_path' => '/images/dosen/4.jpg',
            'rector_quote' => 'Puji syukur ke hadirat Tuhan YME, atas segala rahmat dan karunia-Nya. Selamat datang di portal resmi kampus kami. Kami berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi yang mempersiapkan generasi muda menghadapi revolusi industri global.',
            'rector_speech' => '<p><strong>Assalamu’alaikum Warahmatullahi Wabarakatuh,</strong><br>Salam sejahtera bagi kita semua, Om Swastiastu, Namo Buddhaya, Salam Kebajikan.</p><p>Puji dan syukur senantiasa kita panjatkan ke hadirat Tuhan Yang Maha Esa, atas limpahan rahmat, taufik, serta hidayah-Nya sehingga kita dapat terus berkarya dan mengabdi untuk kemajuan bangsa melalui dunia pendidikan.</p><p>Selamat datang di portal resmi Institut Teknologi dan Bisnis. Di tengah akselerasi transformasi kecerdasan artifisial, komputasi awan, dan disrupsi ekonomi digital global, perguruan tinggi memegang mandat moral dan keilmuan yang sangat besar. Kami tidak hanya berkomitmen mencetak lulusan yang cerdas secara akademik dan menguasai teknologi masa depan, namun juga membentuk insan yang berintegritas moral tinggi, memiliki jiwa kepemimpinan visioner, dan berempati sosial.</p><p>Melalui kurikulum adaptif berbasis proyek industri riil (project-based learning), kemitraan strategis dengan korporasi multinasional, serta ekosistem riset terapan yang berorientasi solusi, kami berikhtiar mendampingi para mahasiswa agar dapat mengeksplorasi potensi terbaiknya dan meraih prestasi di panggung internasional.</p><p>Kepada para orang tua, alumni, dan mitra pemangku kepentingan, kami menghaturkan terima kasih yang mendalam atas sinergi dan kepercayaan yang terjalin erat. Mari kita rawat semangat gotong-royong demi mencerdaskan kehidupan bangsa dan menyongsong Indonesia Emas 2045.</p><p><strong>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</strong></p>',
            'rector_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'hero_slides' => [
                [
                    'title' => 'Menyiapkan Pemimpin Digital & Technopreneur Masa Depan',
                    'subtitle' => 'Institut Teknologi dan Bisnis berkomitmen mencetak generasi unggul yang adaptif, menguasai kecerdasan buatan, dan berkarakter kepemimpinan luhur.',
                    'badge' => 'PENERIMAAN MAHASISWA BARU 2026/2027',
                    'type' => 'image',
                    'image_url' => '/images/campus-hero.png',
                    'video_url' => '',
                    'cta_primary_label' => 'Daftar Sekarang',
                    'cta_primary_url' => '/pendaftaran',
                    'cta_secondary_label' => 'Jelajahi Program Studi',
                    'cta_secondary_url' => '/program-studi',
                ],
                [
                    'title' => 'Riset Terapan & Inovasi Berdampak bagi Industri Global',
                    'subtitle' => 'Kolaborasi strategis dengan laboratorium riset internasional untuk menghasilkan solusi nyata berbasis teknologi berkelanjutan.',
                    'badge' => 'EKOSISTEM RISET & INOVASI',
                    'type' => 'image',
                    'image_url' => '/images/students-activity.png',
                    'video_url' => '',
                    'cta_primary_label' => 'Publikasi Ilmiah',
                    'cta_primary_url' => '/dosen',
                    'cta_secondary_label' => 'Agenda Kampus',
                    'cta_secondary_url' => '/agenda',
                ],
                [
                    'title' => 'Fasilitas Laboratorium Modern Berstandar Industri',
                    'subtitle' => 'Didukung laboratorium komputasi awan, robotic testing center, dan inkubator bisnis untuk mendukung akselerasi karier.',
                    'badge' => 'SMART CAMPUS & RISET',
                    'type' => 'image',
                    'image_url' => '/images/lab.png',
                    'video_url' => '',
                    'cta_primary_label' => 'Fasilitas Kampus',
                    'cta_primary_url' => '/fasilitas',
                    'cta_secondary_label' => 'Profil Kampus',
                    'cta_secondary_url' => '/tentang',
                ],
            ],
            'about_background' => 'Institut Teknologi dan Bisnis didirikan sebagai respon strategis atas kebutuhan sumber daya manusia unggul yang mampu memadukan kecakapan teknologi informasi mutakhir dengan pemahaman bisnis strategis. Berawal dari komitmen para akademisi dan praktisi industri terkemuka, institusi ini berkembang pesat menjadi pusat unggulan (center of excellence) dalam pendidikan tridharma di kawasan Jawa Timur.',
            'about_image_path' => '/images/building.png',
            'about_vision' => 'Menjadi perguruan tinggi unggulan bereputasi internasional dalam pengembangan sains, teknologi rekayasa, dan manajemen bisnis berkelanjutan yang berlandaskan integritas moral pada tahun 2035.',
            'about_missions' => [
                'Menyelenggarakan pendidikan vokasi dan sarjana berkualitas tinggi dengan standar kurikulum internasional yang relevan dengan kebutuhan industri digital.',
                'Melaksanakan penelitian terapan dan hilirisasi inovasi teknologi yang memberikan kontribusi nyata bagi masyarakat, pemerintah, dan dunia usaha.',
                'Melaksanakan pengabdian kepada masyarakat berbasis pemberdayaan komunitas untuk mendorong kemandirian ekonomi daerah.',
                'Membangun tata kelola perguruan tinggi yang transparan, akuntabel, dan berbasis smart digital campus yang inklusif.',
            ],
            'about_goals' => [
                ['title' => 'Lulusan Unggul & Berkarakter', 'icon' => 'GraduationCap', 'bg' => 'bg-primary-600', 'desc' => 'Menghasilkan sarjana yang memiliki kompetensi profesional, berdaya saing global, dan berintegritas tinggi.'],
                ['title' => 'Riset Terapan Berdampak', 'icon' => 'FlaskConical', 'bg' => 'bg-emerald-600', 'desc' => 'Menghasilkan inovasi dan publikasi ilmiah berbobot yang mampu dihilirisasi ke dunia industri.'],
                ['title' => 'Pemberdayaan Masyarakat', 'icon' => 'HeartHandshake', 'bg' => 'bg-secondary-600', 'desc' => 'Mentransformasikan ilmu pengetahuan dan teknologi demi kemaslahatan dan kesejahteraan masyarakat.'],
                ['title' => 'Kemitraan Multinasional', 'icon' => 'Globe', 'bg' => 'bg-sky-600', 'desc' => 'Menjalin kolaborasi akademik, pertukaran mahasiswa, dan riset bersama dengan institusi global.'],
                ['title' => 'Smart Campus Terpadu', 'icon' => 'Cpu', 'bg' => 'bg-indigo-600', 'desc' => 'Mengimplementasikan teknologi informasi digital di seluruh layanan akademik dan manajerial.'],
                ['title' => 'Kemandirian Finansial & Tata Kelola', 'icon' => 'Award', 'bg' => 'bg-rose-600', 'desc' => 'Mewujudkan tata pamong yang akuntabel, transparan, dan berkelanjutan.'],
            ],
            'about_development_models' => [
                ['title' => 'Tahap Fondasi & Kelembagaan (2020–2023)', 'icon' => 'Landmark', 'desc' => 'Penguatan infrastruktur fisik, laboratorium modern, rekrutmen dosen bergelar doktor, dan akreditasi prodi perdana.'],
                ['title' => 'Tahap Penguatan Riset & Kolaborasi Industri (2024–2027)', 'icon' => 'Rocket', 'desc' => 'Integrasi program magang kerja industri, hibah penelitian terapan, dan kemitraan strategis multinasional.'],
                ['title' => 'Tahap Reputasi Regional & Smart Campus (2028–2031)', 'icon' => 'Globe', 'desc' => 'Peningkatan publikasi terindeks Scopus, hilirisasi paten, serta perluasan program pertukaran pelajar internasional.'],
                ['title' => 'Tahap World Class University (2032–2035)', 'icon' => 'Award', 'desc' => 'Pengakuan rekognisi internasional, akreditasi lembaga global, dan kemandirian institusi secara menyeluruh.'],
            ],
            'about_development_strategies' => [
                ['title' => 'Kurikulum Berbasis Outcome-Based Education (OBE)', 'desc' => 'Memastikan setiap capaian pembelajaran mahasiswa terukur secara presisi dan sesuai standar sertifikasi industri.'],
                ['title' => 'Pusat Inkubasi Bisnis & Technopreneurship', 'desc' => 'Mendampingi mahasiswa melahirkan startup teknologi dan kewirausahaan mandiri dengan mentoring praktisi.'],
                ['title' => 'Digital Twin & Smart Laboratory Network', 'desc' => 'Menyediakan fasilitas praktikum berbasis virtual reality dan komputasi awan yang dapat diakses dari mana saja.'],
                ['title' => 'Beasiswa Inklusif untuk Generasi Muda Berprestasi', 'desc' => 'Memberikan kesempatan pendidikan tinggi yang merata bagi talenta terbaik dari seluruh penjuru nusantara.'],
            ],
            'about_accreditation' => [
                'grade' => 'UNGGUL',
                'institution' => 'BAN-PT',
                'sk_number' => 'SK BAN-PT No. 1284/SK/BAN-PT/Ak/PT/2024',
                'valid_until' => '2029',
                'certificate_url' => '',
            ],
        ]);

        $setting->save();
    }
}
