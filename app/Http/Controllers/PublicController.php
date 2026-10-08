<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\CampusSetting;
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
use App\Models\WebSetting;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Homepage / Portal Utama Kampus (Didukung Data Komponen Page Builder)
     */
    public function home(): Response
    {
        return Inertia::render('Welcome', [
            'webSetting' => WebSetting::first(),
            'campusSetting' => CampusSetting::getActive(),
            'latestPosts' => $this->getHomeLatestPosts(),
            'upcomingEvents' => $this->getHomeUpcomingEvents(),
            'latestAnnouncements' => $this->getHomeAnnouncements(),
            'categories' => $this->getHomeCategories(),
            'studyPrograms' => $this->getHomeStudyPrograms(),
            'staffMembers' => $this->getHomeStaffMembers(),
            'facilities' => $this->getHomeFacilities(),
            'extracurriculars' => $this->getHomeExtracurriculars(),
            'galleries' => $this->getHomeGalleries(),
        ]);
    }

    /**
     * Halaman Profil Lengkap Kampus (Tentang, Akreditasi, Visi, Misi, Tujuan, Model & Strategi)
     */
    public function about(): Response
    {
        $setting = WebSetting::first();
        $campusSetting = CampusSetting::getActive();

        return Inertia::render('Public/About/Index', [
            'webSetting' => $setting,
            'campusSetting' => $campusSetting,
        ]);
    }

    /**
     * Halaman Struktur Organisasi Kampus Lengkap & Dinamis
     */
    public function organizationalStructure(): Response
    {
        $setting = WebSetting::first();
        $campusSetting = CampusSetting::getActive();

        return Inertia::render('Public/OrganizationalStructure/Index', [
            'webSetting' => $setting,
            'campusSetting' => $campusSetting,
            'structure' => $this->getDynamicOrganizationalStructure($campusSetting),
        ]);
    }

    /**
     * Halaman Kontak & Informasi Kampus Lengkap dengan Form Pesan & Lokasi Interaktif
     */
    public function contact(): Response
    {
        $setting = WebSetting::first();
        $campusSetting = CampusSetting::getActive();

        return Inertia::render('Public/Contact/Index', [
            'webSetting' => $setting,
            'campusSetting' => $campusSetting,
        ]);
    }

    /**
     * Mengambil struktur organisasi lengkap secara dinamis dari database institusi.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function getDynamicOrganizationalStructure(CampusSetting $campusSetting): array
    {
        return array_merge(
            $this->getRectorateStructure($campusSetting),
            $this->getSenatStructure(),
            $this->getFacultyStructure(),
            $this->getStudyProgramStructure(),
            $this->getOtherUnitsStructure()
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getRectorateStructure(CampusSetting $campusSetting): array
    {
        $rectorateMembers = [];

        // Rektor dari setting jika ada
        if (!empty($campusSetting->leader_name)) {
            $leaderStaff = StaffProfile::query()
                ->where('name', $campusSetting->leader_name)
                ->first();

            $rectorateMembers[] = [
                'name' => $campusSetting->leader_name,
                'position' => $campusSetting->leader_title ?: 'Rektor Institut',
                'nidn' => $leaderStaff?->nidn,
                'nip' => $leaderStaff?->nip,
                'photo' => $campusSetting->leader_avatar_url ?: $leaderStaff?->photo_url,
                'slug' => $leaderStaff?->slug,
            ];
        }

        // Pimpinan Rektorat dari StructuralAssignment dengan scope rectorate
        $rectorateAssignments = \App\Models\StructuralAssignment::query()
            ->where('is_current', true)
            ->whereHas('position', function ($query) {
                $query->where('scope', 'rectorate')
                    ->orWhere('name', 'like', '%Rektor%');
            })
            ->with(['position', 'staffProfile'])
            ->orderBy('sort_order', 'asc')
            ->get();

        foreach ($rectorateAssignments as $assignment) {
            $staff = $assignment->staffProfile;
            $pos = $assignment->position;
            if (!$staff || !$pos) {
                continue;
            }

            $alreadyAdded = collect($rectorateMembers)->contains(fn ($m) => $m['name'] === $staff->name);
            if ($alreadyAdded) {
                continue;
            }

            $rectorateMembers[] = [
                'name' => $staff->name,
                'position' => $assignment->custom_title ?: $pos->name,
                'nidn' => $staff->nidn,
                'nip' => $staff->nip,
                'photo' => $staff->photo_url,
                'slug' => $staff->slug,
            ];
        }

        // Unit Rektorat dari InstitutionalUnit
        $rectorateUnits = InstitutionalUnit::query()
            ->where('is_active', true)
            ->where('category', 'rektorat')
            ->with(['currentAssignments.staffProfile', 'currentAssignments.position'])
            ->orderBy('sort_order', 'asc')
            ->get();

        foreach ($rectorateUnits as $unit) {
            foreach ($unit->currentAssignments as $assignment) {
                $staff = $assignment->staffProfile;
                $pos = $assignment->position;
                if (!$staff || !$pos) {
                    continue;
                }
                $alreadyAdded = collect($rectorateMembers)->contains(fn ($m) => $m['name'] === $staff->name);
                if ($alreadyAdded) {
                    continue;
                }
                $rectorateMembers[] = [
                    'name' => $staff->name,
                    'position' => $assignment->custom_title ?: ($pos->name . ' - ' . $unit->name),
                    'nidn' => $staff->nidn,
                    'nip' => $staff->nip,
                    'photo' => $staff->photo_url,
                    'slug' => $staff->slug,
                ];
            }
        }

        if (empty($rectorateMembers)) {
            return [];
        }

        return [
            [
                'group' => 'Rektorat & Pimpinan Utama',
                'category' => 'rektorat',
                'icon' => 'Landmark',
                'description' => 'Pimpinan eksekutif tertinggi institusi, Rektor & jajaran Wakil Rektor',
                'members' => $rectorateMembers,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getSenatStructure(): array
    {
        $senatUnits = InstitutionalUnit::query()
            ->where('is_active', true)
            ->where('category', 'senat')
            ->with(['currentAssignments.staffProfile', 'currentAssignments.position'])
            ->orderBy('sort_order', 'asc')
            ->get();

        $groups = [];
        foreach ($senatUnits as $unit) {
            $senatMembers = [];
            foreach ($unit->currentAssignments as $assignment) {
                $staff = $assignment->staffProfile;
                $pos = $assignment->position;
                if (!$staff || !$pos) {
                    continue;
                }
                $senatMembers[] = [
                    'name' => $staff->name,
                    'position' => $assignment->custom_title ?: $pos->name,
                    'nidn' => $staff->nidn,
                    'nip' => $staff->nip,
                    'photo' => $staff->photo_url,
                    'slug' => $staff->slug,
                ];
            }

            if (!empty($senatMembers)) {
                $groups[] = [
                    'group' => $unit->name,
                    'category' => 'senat',
                    'icon' => 'Award',
                    'description' => $unit->description ?: 'Badan normatif dan perwakilan tertinggi di bidang akademik',
                    'members' => $senatMembers,
                ];
            }
        }

        return $groups;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getFacultyStructure(): array
    {
        $faculties = Faculty::query()
            ->where('is_active', true)
            ->with(['currentAssignments.staffProfile', 'currentAssignments.position'])
            ->orderBy('sort_order', 'asc')
            ->get();

        $groups = [];
        foreach ($faculties as $faculty) {
            $facultyMembers = [];
            foreach ($faculty->currentAssignments as $assignment) {
                $staff = $assignment->staffProfile;
                $pos = $assignment->position;
                if (!$staff || !$pos) {
                    continue;
                }
                $facultyMembers[] = [
                    'name' => $staff->name,
                    'position' => $assignment->custom_title ?: $pos->name,
                    'nidn' => $staff->nidn,
                    'nip' => $staff->nip,
                    'photo' => $staff->photo_url,
                    'slug' => $staff->slug,
                ];
            }

            if (!empty($facultyMembers)) {
                $groups[] = [
                    'group' => 'Fakultas: ' . $faculty->name,
                    'category' => 'fakultas',
                    'icon' => 'Building2',
                    'description' => 'Dekanat dan pimpinan pengelola Fakultas',
                    'members' => $facultyMembers,
                ];
            }
        }

        return $groups;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getStudyProgramStructure(): array
    {
        $studyPrograms = StudyProgram::query()
            ->where('is_active', true)
            ->with(['faculty', 'currentAssignments.staffProfile', 'currentAssignments.position'])
            ->orderBy('sort_order', 'asc')
            ->get();

        $prodiMembers = [];
        foreach ($studyPrograms as $sp) {
            foreach ($sp->currentAssignments as $assignment) {
                $staff = $assignment->staffProfile;
                $pos = $assignment->position;
                if (!$staff || !$pos) {
                    continue;
                }
                $prodiMembers[] = [
                    'name' => $staff->name,
                    'position' => $assignment->custom_title ?: ($pos->name . ' ' . $sp->name),
                    'nidn' => $staff->nidn,
                    'nip' => $staff->nip,
                    'photo' => $staff->photo_url,
                    'slug' => $staff->slug,
                ];
            }
        }

        if (empty($prodiMembers)) {
            return [];
        }

        return [
            [
                'group' => 'Ketua & Pengelola Program Studi',
                'category' => 'prodi',
                'icon' => 'GraduationCap',
                'description' => 'Pimpinan dan koordinator operasional program studi sarjana & vokasi',
                'members' => $prodiMembers,
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getOtherUnitsStructure(): array
    {
        $unitCategories = [
            'biro' => [
                'category' => 'biro',
                'icon' => 'Layers',
                'desc' => 'Unit pelaksana administrasi umum, keuangan, dan kemahasiswaan',
            ],
            'lembaga' => [
                'category' => 'lembaga',
                'icon' => 'BookOpen',
                'desc' => 'Lembaga penelitian, pengabdian masyarakat, dan penjaminan mutu',
            ],
            'badan_khusus' => [
                'category' => 'badan_khusus',
                'icon' => 'ShieldCheck',
                'desc' => 'Badan ad-hoc dan penjamin kelangsungan strategis institusi',
            ],
            'upt' => [
                'category' => 'upt',
                'icon' => 'Users',
                'desc' => 'Unit penunjang perpustakaan, teknologi informasi, laboratorium, dan karir',
            ],
            'organisasi' => [
                'category' => 'organisasi',
                'icon' => 'Users',
                'desc' => 'Unit kerja dan organisasi pendukung institusi',
            ],
        ];

        $groups = [];
        foreach ($unitCategories as $catKey => $meta) {
            $units = InstitutionalUnit::query()
                ->where('is_active', true)
                ->where('category', $catKey)
                ->with(['currentAssignments.staffProfile', 'currentAssignments.position'])
                ->orderBy('sort_order', 'asc')
                ->get();

            foreach ($units as $unit) {
                $uMembers = [];
                foreach ($unit->currentAssignments as $assignment) {
                    $staff = $assignment->staffProfile;
                    $pos = $assignment->position;
                    if (!$staff || !$pos) {
                        continue;
                    }
                    $uMembers[] = [
                        'name' => $staff->name,
                        'position' => $assignment->custom_title ?: ($pos->name . ' - ' . $unit->name),
                        'nidn' => $staff->nidn,
                        'nip' => $staff->nip,
                        'photo' => $staff->photo_url,
                        'slug' => $staff->slug,
                    ];
                }

                if (!empty($uMembers)) {
                    $groups[] = [
                        'group' => $unit->name,
                        'category' => $meta['category'],
                        'icon' => $meta['icon'],
                        'description' => $unit->description ?: $meta['desc'],
                        'members' => $uMembers,
                    ];
                }
            }
        }

        return $groups;
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
        $isPublished = $event->status === 'published' && (!$event->published_at || $event->published_at->isPast());
        $canPreview = Auth::check();

        if (!$isPublished && !$canPreview) {
            abort(404);
        }

        $event->load(['user:id,name', 'category:id,name', 'hashtags:id,name,slug']);

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
            'isPreview' => !$isPublished && $canPreview,
        ]);
    }

    /**
     * Arsip Berita / Post Kampus
     */
    public function posts(Request $request): Response
    {
        $query = Post::query()
            ->where(function ($q) {
                $q->where('status', 'published')
                    ->where(function ($sub) {
                        $sub->whereNull('published_at')->orWhere('published_at', '<=', now());
                    })
                    ->orWhere(function ($sub) {
                        $sub->where('status', 'scheduled')->where('published_at', '<=', now());
                    });
            })
            ->with(['category:id,name,slug', 'user:id,name', 'author:id,name', 'editor:id,name', 'hashtags:id,name,slug']);

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
        $isPublished = $post->status === 'published' && (!$post->published_at || $post->published_at->isPast());
        $canPreview = Auth::check();

        if (!$isPublished && !$canPreview) {
            abort(404);
        }

        if ($isPublished) {
            $post->increment('views_count');
        }

        $post->load(['category', 'user:id,name', 'author:id,name', 'editor:id,name', 'hashtags']);

        $relatedPosts = Post::query()
            ->where('status', 'published')
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($q) => $q->where('category_id', $post->category_id))
            ->latest('published_at')
            ->take(5)
            ->get();

        if ($relatedPosts->count() < 3) {
            $existingIds = $relatedPosts->pluck('id')->push($post->id)->all();
            $morePosts = Post::query()
                ->where('status', 'published')
                ->whereNotIn('id', $existingIds)
                ->latest('published_at')
                ->take(5 - $relatedPosts->count())
                ->get();
            $relatedPosts = $relatedPosts->concat($morePosts);
        }

        return Inertia::render('Public/Posts/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'isPreview' => !$isPublished && $canPreview,
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
        $isPublished = $page->status === 'published';
        $canPreview = Auth::check();

        if (!$isPublished && !$canPreview) {
            abort(404);
        }

        $page->load('user:id,name');

        return Inertia::render('Public/Pages/Show', [
            'page' => $page,
            'isPreview' => !$isPublished && $canPreview,
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

    /**
     * @return Collection<int, Post>
     */
    private function getHomeLatestPosts(): Collection
    {
        return Post::query()
            ->where('status', 'published')
            ->with(['category:id,name,slug', 'user:id,name'])
            ->latest('published_at')
            ->take(6)
            ->get();
    }

    /**
     * @return Collection<int, Event>
     */
    private function getHomeUpcomingEvents(): Collection
    {
        return Event::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('end_date')->where('start_date', '>=', now()->startOfDay())
                  ->orWhere('end_date', '>=', now()->startOfDay());
            })
            ->orderBy('start_date', 'asc')
            ->take(4)
            ->get();
    }

    /**
     * @return Collection<int, Announcement>
     */
    private function getHomeAnnouncements(): Collection
    {
        return Announcement::query()
            ->where('status', 'published')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(4)
            ->get();
    }

    /**
     * @return Collection<int, Category>
     */
    private function getHomeCategories(): Collection
    {
        return Category::query()
            ->where('is_active', true)
            ->withCount(['posts' => fn ($q) => $q->where('status', 'published')])
            ->take(8)
            ->get();
    }

    /**
     * @return Collection<int, StudyProgram>
     */
    private function getHomeStudyPrograms(): Collection
    {
        return StudyProgram::query()
            ->where('is_active', true)
            ->with('faculty:id,name,slug')
            ->orderBy('order')
            ->take(6)
            ->get();
    }

    /**
     * @return Collection<int, StaffProfile>
     */
    private function getHomeStaffMembers(): Collection
    {
        return StaffProfile::query()
            ->where('is_active', true)
            ->take(4)
            ->get();
    }

    /**
     * @return Collection<int, Facility>
     */
    private function getHomeFacilities(): Collection
    {
        return Facility::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->take(4)
            ->get();
    }

    /**
     * @return Collection<int, Extracurricular>
     */
    private function getHomeExtracurriculars(): Collection
    {
        return Extracurricular::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->take(4)
            ->get();
    }

    /**
     * @return Collection<int, Gallery>
     */
    private function getHomeGalleries(): Collection
    {
        return Gallery::query()
            ->where('is_published', true)
            ->latest('event_date')
            ->take(8)
            ->get();
    }
}
