<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Hashtag;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::query()->delete();

        $authorIds = User::query()->pluck('id')->all();
        $categoryIds = Category::query()->pluck('id')->all();
        $hashtagIds = Hashtag::query()->pluck('id')->all();

        $baseTitles = [
            'Panduan SEO On-Page untuk Pemula',
            'Meningkatkan Performa Website dengan Caching',
            'Strategi Konten Blog 30 Hari',
            'Optimasi Gambar untuk Kecepatan Halaman',
            'Checklist Audit Website untuk Bisnis',
            'Belajar Tailwind CSS dari Nol',
            'Tips Menulis Artikel yang Menarik',
            'Cara Memilih Hosting yang Tepat',
            'Membuat Landing Page yang Konversi Tinggi',
            'Teknik Internal Linking yang Efektif',
        ];

        $campusImages = [
            '/images/building.png',
            '/images/students-activity.png',
            '/images/campus-hero.png',
            '/images/library.png',
            '/images/lab.png',
            '/images/auditorium.png',
        ];

        foreach ($baseTitles as $index => $title) {
            $slug = Str::slug($title);
            $thumbnailPath = $campusImages[$index % count($campusImages)];

            $status = match ($index % 4) {
                0 => 'draft',
                1 => 'review',
                2 => 'approved',
                default => 'published',
            };

            $post = Post::query()->create([
                'user_id' => $this->pick($authorIds, $index),
                'category_id' => $this->pick($categoryIds, $index + 5),
                'title' => $title,
                'slug' => $slug,
                'excerpt' => fake()->sentence(20),
                'content' => $this->makeContent($title),
                'thumbnail_path' => $thumbnailPath,
                'meta_description' => "Artikel {$title} untuk panduan dan praktik terbaik.",
                'meta_keywords' => implode(', ', fake()->words(6)),
                'views_count' => fake()->numberBetween(800 + ($index * 200), 25000),
                'status' => $status,
                'submitted_for_review_at' => in_array($status, ['review', 'approved', 'published'], true)
                    ? now()->subDays($index + 3)
                    : null,
                'reviewed_at' => in_array($status, ['approved', 'published'], true)
                    ? now()->subDays($index + 2)
                    : null,
                'approved_at' => in_array($status, ['approved', 'published'], true)
                    ? now()->subDays($index + 1)
                    : null,
                'published_at' => $status === 'published' ? now()->subDays($index + 1) : null,
            ]);

            $post->hashtags()->sync($this->pickMany($hashtagIds, fake()->numberBetween(2, 5), $index));
        }

        for ($i = 1; $i <= 70; $i++) {
            $title = Str::title(fake()->words(fake()->numberBetween(4, 8), true));
            $slug = Str::slug($title)."-{$i}";
            $withThumbnail = fake()->boolean(70);
            $thumbnailPath = null;

            if ($withThumbnail) {
                $thumbnailPath = $campusImages[$i % count($campusImages)];
            }

            $status = fake()->randomElement([
                'draft',
                'draft',
                'draft',
                'review',
                'review',
                'approved',
                'approved',
                'published',
                'published',
                'published',
            ]);

            $post = Post::query()->create([
                'user_id' => $this->pick($authorIds, $i + 1),
                'category_id' => fake()->boolean(90) ? $this->pick($categoryIds, $i + 3) : null,
                'title' => $title,
                'slug' => $slug,
                'excerpt' => fake()->boolean(85) ? fake()->sentence(24) : null,
                'content' => $this->makeContent($title),
                'thumbnail_path' => $thumbnailPath,
                'meta_description' => fake()->boolean(80) ? fake()->sentence(18) : null,
                'meta_keywords' => fake()->boolean(75) ? implode(', ', fake()->words(7)) : null,
                'views_count' => fake()->numberBetween(0, 30000),
                'status' => $status,
                'submitted_for_review_at' => in_array($status, ['review', 'approved', 'published'], true)
                    ? now()->subDays(fake()->numberBetween(5, 365))
                    : null,
                'reviewed_at' => in_array($status, ['approved', 'published'], true)
                    ? now()->subDays(fake()->numberBetween(2, 180))
                    : null,
                'approved_at' => in_array($status, ['approved', 'published'], true)
                    ? now()->subDays(fake()->numberBetween(1, 120))
                    : null,
                'published_at' => $status === 'published'
                    ? now()->subDays(fake()->numberBetween(1, 365))
                    : null,
            ]);

            $tagCount = fake()->numberBetween(0, 7);
            if ($tagCount > 0) {
                $post->hashtags()->sync($this->pickMany($hashtagIds, $tagCount, $i + 100));
            }
        }
    }

    private function pick(array $ids, int $seed): ?int
    {
        if ($ids === []) {
            return null;
        }

        return $ids[$seed % count($ids)];
    }

    private function pickMany(array $ids, int $take, int $seed): array
    {
        if ($ids === [] || $take <= 0) {
            return [];
        }

        return collect($ids)
            ->shuffle($seed)
            ->take(min($take, count($ids)))
            ->values()
            ->all();
    }

    private function makeContent(string $title): string
    {
        return <<<HTML
<h2>Latar Belakang & Urgensi Program</h2>
<p>Dalam menyongsong transformasi pendidikan tinggi di era kecerdasan artifisial dan revolusi industri modern, perguruan tinggi terus memperkuat komitmen tridharma perguruan tinggi. Penyelenggaraan kegiatan akademik dan pengembangan riset strategis diarahkan untuk menjawab tantangan riil di masyarakat serta kebutuhan dunia usaha dan industri global.</p>
<p>Langkah ini diwujudkan melalui kurikulum berbasis kompetensi yang adaptif, penguatan ekosistem laboratorium, serta kolaborasi multidisiplin antara dosen, mahasiswa, dan mitra industri terkemuka baik di tingkat nasional maupun internasional.</p>

<h2>Strategi Pelaksanaan & Poin Kunci</h2>
<p>Guna mencapai standar mutu unggul, serangkaian inisiatif terintegrasi telah dirumuskan dan diimplementasikan secara berkesinambungan:</p>
<ul>
  <li>Penyelarasan kurikulum perkuliahan dengan standar sertifikasi kompetensi industri modern.</li>
  <li>Pemberian hibah penelitian terapan dan pendanaan prototipe inovasi sivitas akademika.</li>
  <li>Peningkatan keterlibatan praktisi industri melalui program dosen tamu dan kuliah pakar berkala.</li>
  <li>Penyediaan program beasiswa prestasi serta kemitraan riset bersama instansi pemerintah dan swasta.</li>
</ul>

<blockquote>"Pendidikan bermutu bukan sekadar transfer pengetahuan teknis semata, melainkan proses penempaan integritas moral, nalar kritis, dan empati sosial untuk membangun peradaban bangsa yang tangguh dan berdaulat."</blockquote>

<h2>Dampak Positif bagi Mahasiswa & Sivitas Akademika</h2>
<p>Melalui implementasi agenda ini, mahasiswa memperoleh pengalaman belajar kontekstual melalui pendekatan project-based learning dan magang kerja bersertifikat. Dengan demikian, setiap lulusan dipersiapkan memiliki portofolio karya nyata yang berdaya saing tinggi.</p>
<p>Pimpinan universitas menyampaikan apresiasi setinggi-tingginya kepada seluruh dosen, tenaga kependidikan, mahasiswa, dan mitra kerja sama yang senantiasa bergotong-royong memajukan reputasi almamater di kancah nasional maupun internasional.</p>
HTML;
    }

    private function makeSvg(string $title, int $seed): string
    {
        $hue = ($seed * 31) % 360;
        $label = Str::limit($title, 24, '');

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl({$hue}, 85%, 62%)"/>
      <stop offset="100%" stop-color="hsl({$hue}, 85%, 45%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1050" cy="100" r="120" fill="rgba(255,255,255,0.18)"/>
  <circle cx="130" cy="520" r="120" fill="rgba(255,255,255,0.12)"/>
  <text x="70" y="320" fill="white" font-size="56" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="700">
    {$label}
  </text>
</svg>
SVG;
    }
}
