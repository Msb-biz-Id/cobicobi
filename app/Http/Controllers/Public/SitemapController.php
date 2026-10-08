<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Category;
use App\Models\Event;
use App\Models\Extracurricular;
use App\Models\Facility;
use App\Models\Faculty;
use App\Models\Gallery;
use App\Models\Hashtag;
use App\Models\InstitutionalUnit;
use App\Models\Page;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\StudyProgram;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    /**
     * Hasilkan sitemap.xml komprehensif mencakup seluruh entitas publik kampus.
     */
    public function index(): Response
    {
        // Cache sitemap selama 30 menit demi performa tinggi tanpa beban database berlebih
        $content = Cache::remember('campus_portal_sitemap_xml', 1800, function () {
            $urls = [];

            $nowStr = Carbon::now()->toW3cString();

            // 1. Rute Statis / Halaman Indeks Utama
            $staticRoutes = [
                ['route' => 'home', 'priority' => 1.0, 'changefreq' => 'daily'],
                ['route' => 'public.posts.index', 'priority' => 0.9, 'changefreq' => 'daily'],
                ['route' => 'public.announcements.index', 'priority' => 0.9, 'changefreq' => 'daily'],
                ['route' => 'public.events.index', 'priority' => 0.8, 'changefreq' => 'daily'],
                ['route' => 'public.faculties.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
                ['route' => 'public.study-programs.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
                ['route' => 'public.institutional-units.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
                ['route' => 'public.facilities.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
                ['route' => 'public.extracurriculars.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
                ['route' => 'public.lecturers.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
                ['route' => 'public.galleries.index', 'priority' => 0.8, 'changefreq' => 'weekly'],
            ];

            foreach ($staticRoutes as $item) {
                if (\Illuminate\Support\Facades\Route::has($item['route'])) {
                    $urls[] = [
                        'loc' => route($item['route']),
                        'lastmod' => $nowStr,
                        'changefreq' => $item['changefreq'],
                        'priority' => $item['priority'],
                    ];
                }
            }

            // 2. Berita & Warta Kampus
            Post::query()
                ->where('status', 'published')
                ->whereNotNull('published_at')
                ->select(['slug', 'updated_at', 'published_at'])
                ->orderBy('published_at', 'desc')
                ->get()
                ->each(function ($post) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.posts.show', $post->slug),
                        'lastmod' => ($post->updated_at ?? $post->published_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'weekly',
                        'priority' => 0.8,
                    ];
                });

            // 3. Pengumuman Resmi
            Announcement::query()
                ->where('status', 'published')
                ->select(['slug', 'updated_at', 'published_at'])
                ->orderBy('published_at', 'desc')
                ->get()
                ->each(function ($announcement) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.announcements.show', $announcement->slug),
                        'lastmod' => ($announcement->updated_at ?? $announcement->published_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'weekly',
                        'priority' => 0.8,
                    ];
                });

            // 4. Agenda & Event Kampus
            Event::query()
                ->where('status', 'published')
                ->select(['slug', 'updated_at', 'start_date'])
                ->orderBy('start_date', 'desc')
                ->get()
                ->each(function ($event) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.events.show', $event->slug),
                        'lastmod' => ($event->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'weekly',
                        'priority' => 0.8,
                    ];
                });

            // 5. Laman Statis
            Page::query()
                ->where('status', 'published')
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->get()
                ->each(function ($page) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.pages.show', $page->slug),
                        'lastmod' => ($page->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.7,
                    ];
                });

            // 6. Fakultas
            Faculty::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->each(function ($faculty) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.faculties.show', $faculty->slug),
                        'lastmod' => ($faculty->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.8,
                    ];
                });

            // 7. Program Studi
            StudyProgram::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->each(function ($prodi) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.study-programs.show', $prodi->slug),
                        'lastmod' => ($prodi->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.8,
                    ];
                });

            // 8. Unit Kerja / Lembaga / UPT
            InstitutionalUnit::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->each(function ($unit) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.institutional-units.show', $unit->slug),
                        'lastmod' => ($unit->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.7,
                    ];
                });

            // 9. Fasilitas Kampus
            Facility::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->each(function ($facility) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.facilities.show', $facility->slug),
                        'lastmod' => ($facility->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.7,
                    ];
                });

            // 10. Ekstrakurikuler / UKM
            Extracurricular::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->each(function ($ukm) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.extracurriculars.show', $ukm->slug),
                        'lastmod' => ($ukm->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.7,
                    ];
                });

            // 11. Direktori Dosen & Tendik
            StaffProfile::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->orderBy('name', 'asc')
                ->get()
                ->each(function ($staff) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.lecturers.show', $staff->slug),
                        'lastmod' => ($staff->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'monthly',
                        'priority' => 0.7,
                    ];
                });

            // 12. Galeri & Lensa Dokumentasi Kampus
            Gallery::query()
                ->where('is_published', true)
                ->select(['slug', 'updated_at'])
                ->latest('id')
                ->get()
                ->each(function ($gallery) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.galleries.show', $gallery->slug),
                        'lastmod' => ($gallery->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'weekly',
                        'priority' => 0.7,
                    ];
                });

            // 12. Kategori Berita
            Category::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->get()
                ->each(function ($cat) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.categories.show', $cat->slug),
                        'lastmod' => ($cat->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'weekly',
                        'priority' => 0.6,
                    ];
                });

            // 13. Topik / Hashtag
            Hashtag::query()
                ->where('is_active', true)
                ->select(['slug', 'updated_at'])
                ->get()
                ->each(function ($tag) use (&$urls) {
                    $urls[] = [
                        'loc' => route('public.tags.show', $tag->slug),
                        'lastmod' => ($tag->updated_at ?? Carbon::now())->toW3cString(),
                        'changefreq' => 'weekly',
                        'priority' => 0.5,
                    ];
                });

            return view('feeds.sitemap', ['urls' => $urls])->render();
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'X-Robots-Tag' => 'noindex', // Sitemap file itself does not need indexing
        ]);
    }
}
