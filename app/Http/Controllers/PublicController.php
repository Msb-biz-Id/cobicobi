<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\Event;
use App\Models\Hashtag;
use App\Models\Page;
use App\Models\Post;
use App\Models\StaffProfile;
use App\Models\WebSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Homepage / Portal Utama Kampus
     */
    public function home(): Response
    {
        $setting = WebSetting::first();

        // Latest featured news/posts
        $latestPosts = Post::query()
            ->where('status', 'published')
            ->with(['category:id,name,slug', 'user:id,name'])
            ->latest('published_at')
            ->take(6)
            ->get();

        // Upcoming campus events
        $upcomingEvents = Event::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('end_date')->where('start_date', '>=', now()->startOfDay())
                  ->orWhere('end_date', '>=', now()->startOfDay());
            })
            ->orderBy('start_date', 'asc')
            ->take(4)
            ->get();

        // Latest announcements / notices
        $latestAnnouncements = Announcement::query()
            ->where('status', 'published')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get();

        // Featured categories
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['posts' => fn($q) => $q->where('status', 'published')])
            ->take(8)
            ->get();

        return Inertia::render('Welcome', [
            'webSetting' => $setting,
            'latestPosts' => $latestPosts,
            'upcomingEvents' => $upcomingEvents,
            'latestAnnouncements' => $latestAnnouncements,
            'categories' => $categories,
        ]);
    }

    /**
     * Arsip Event Kampus (Agenda)
     */
    public function events(Request $request): Response
    {
        $query = Event::query()->where('status', 'published');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhere('venue_name', 'like', "%{$search}%")
                  ->orWhere('organizer', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        $tab = $request->input('tab', 'upcoming'); // upcoming | past | all

        if ($tab === 'upcoming') {
            $query->where(function ($q) {
                $q->whereNull('end_date')->where('start_date', '>=', now()->startOfDay())
                  ->orWhere('end_date', '>=', now()->startOfDay());
            })->orderBy('start_date', 'asc');
        } elseif ($tab === 'past') {
            $query->where(function ($q) {
                $q->whereNotNull('end_date')->where('end_date', '<', now()->startOfDay())
                  ->orWhere(function ($sub) {
                      $sub->whereNull('end_date')->where('start_date', '<', now()->startOfDay());
                  });
            })->orderBy('start_date', 'desc');
        } else {
            $query->orderBy('start_date', 'desc');
        }

        $events = $query->paginate(9)->withQueryString();

        $categories = Event::query()
            ->where('status', 'published')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('Public/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['search', 'category', 'tab']),
            'categories' => $categories,
        ]);
    }

    /**
     * Detail Single Event (dengan Auto Embed Maps, Custom Registration Link, dan Sponsor Text/Gambar)
     */
    public function eventDetail(Event $event): Response
    {
        if ($event->status !== 'published') {
            abort(404);
        }

        $event->load('user:id,name');

        // Related / Other upcoming events
        $otherEvents = Event::query()
            ->where('status', 'published')
            ->where('id', '!=', $event->id)
            ->where('start_date', '>=', now()->startOfDay())
            ->orderBy('start_date', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('Public/Events/Show', [
            'event' => $event,
            'otherEvents' => $otherEvents,
        ]);
    }

    /**
     * Arsip Berita / Post Kampus
     */
    public function posts(Request $request): Response
    {
        $query = Post::query()
            ->where('status', 'published')
            ->with(['category:id,name,slug', 'user:id,name', 'hashtags:id,name,slug']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
        }

        $posts = $query->latest('published_at')->paginate(9)->withQueryString();

        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['posts' => fn($q) => $q->where('status', 'published')])
            ->get();

        $popularTags = Hashtag::query()
            ->where('is_active', true)
            ->withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(12)
            ->get();

        return Inertia::render('Public/Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'popularTags' => $popularTags,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Detail Single Post / Berita Kampus
     */
    public function postDetail(Post $post): Response
    {
        if ($post->status !== 'published') {
            abort(404);
        }

        $post->increment('views_count');
        $post->load(['category', 'user:id,name', 'hashtags']);

        $relatedPosts = Post::query()
            ->where('status', 'published')
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/Posts/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Arsip Post Berdasarkan Kategori
     */
    public function categoryArchive(Category $category): Response
    {
        $posts = Post::query()
            ->where('status', 'published')
            ->where('category_id', $category->id)
            ->with(['user:id,name', 'hashtags:id,name,slug'])
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Public/Categories/Show', [
            'category' => $category,
            'posts' => $posts,
        ]);
    }

    /**
     * Arsip Post Berdasarkan Tag / Hashtag
     */
    public function tagArchive(Hashtag $hashtag): Response
    {
        $posts = $hashtag->posts()
            ->where('status', 'published')
            ->with(['category:id,name,slug', 'user:id,name'])
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Public/Hashtags/Show', [
            'hashtag' => $hashtag,
            'posts' => $posts,
        ]);
    }

    /**
     * Detail Single Page / Laman Statis Kampus
     */
    public function pageDetail(Page $page): Response
    {
        if ($page->status !== 'published') {
            abort(404);
        }

        $page->load('user:id,name');

        return Inertia::render('Public/Pages/Show', [
            'page' => $page,
        ]);
    }

    /**
     * Arsip Pengumuman Resmi Kampus
     */
    public function announcements(Request $request): Response
    {
        $query = Announcement::query()->where('status', 'published');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%")
                  ->orWhere('issuer', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($audience = $request->input('target_audience')) {
            $query->where('target_audience', $audience);
        }

        $announcements = $query->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(9)
            ->withQueryString();

        $categories = [
            'Akademik',
            'Kemahasiswaan',
            'Beasiswa',
            'Karir & Rekrutmen',
            'Registrasi Ulang',
            'Wisuda & Yudisium',
            'Riset & Pengabdian',
            'Umum',
        ];

        $audiences = [
            'Semua Civitas',
            'Mahasiswa',
            'Dosen & Tendik',
            'Mahasiswa Baru',
            'Alumni',
            'Publik',
        ];

        return Inertia::render('Public/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'category', 'target_audience']),
            'categories' => $categories,
            'audiences' => $audiences,
        ]);
    }

    /**
     * Detail Single Pengumuman Kampus dengan Lampiran Download
     */
    public function announcementDetail(Announcement $announcement): Response
    {
        if ($announcement->status !== 'published') {
            abort(404);
        }

        $announcement->increment('views_count');
        $announcement->load('user:id,name');

        $latestAnnouncements = Announcement::query()
            ->where('status', 'published')
            ->where('id', '!=', $announcement->id)
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get();

        return Inertia::render('Public/Announcements/Show', [
            'announcement' => $announcement,
            'latestAnnouncements' => $latestAnnouncements,
        ]);
    }

    /**
     * Direktori Publik Dosen & Tendik
     */
    public function lecturers(Request $request): Response
    {
        $query = StaffProfile::query()
            ->where('is_active', true)
            ->withCount('publications');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nidn', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('faculty', 'like', "%{$search}%")
                  ->orWhere('study_program', 'like', "%{$search}%")
                  ->orWhere('expertise', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($faculty = $request->input('faculty')) {
            $query->where('faculty', $faculty);
        }

        if ($program = $request->input('study_program')) {
            $query->where('study_program', $program);
        }

        $staffList = $query->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(12)
            ->withQueryString();

        $faculties = StaffProfile::query()
            ->where('is_active', true)
            ->whereNotNull('faculty')
            ->distinct()
            ->pluck('faculty')
            ->filter()
            ->values();

        $studyPrograms = StaffProfile::query()
            ->where('is_active', true)
            ->whereNotNull('study_program')
            ->distinct()
            ->pluck('study_program')
            ->filter()
            ->values();

        return Inertia::render('Public/Lecturers/Index', [
            'staffList' => $staffList,
            'filters' => $request->only(['search', 'type', 'faculty', 'study_program']),
            'faculties' => $faculties,
            'studyPrograms' => $studyPrograms,
        ]);
    }

    /**
     * Detail Profil Dosen / Tendik & Portofolio Karya Ilmiah
     */
    public function lecturerDetail(StaffProfile $staffProfile): Response
    {
        if (!$staffProfile->is_active) {
            abort(404);
        }

        $staffProfile->load([
            'publications' => function ($q) {
                $q->orderBy('year', 'desc')->orderBy('id', 'desc');
            },
            'activeAssignments.position',
            'activeAssignments.assignable',
        ]);

        // Other faculty members from same study program / faculty
        $relatedStaff = StaffProfile::query()
            ->where('is_active', true)
            ->where('id', '!=', $staffProfile->id)
            ->where(function ($q) use ($staffProfile) {
                if ($staffProfile->study_program) {
                    $q->where('study_program', $staffProfile->study_program);
                } elseif ($staffProfile->faculty) {
                    $q->where('faculty', $staffProfile->faculty);
                }
            })
            ->take(3)
            ->get();

        return Inertia::render('Public/Lecturers/Show', [
            'staff' => $staffProfile,
            'relatedStaff' => $relatedStaff,
        ]);
    }
}
