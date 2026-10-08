<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaffProfile;
use App\Models\User;
use App\Services\ScholarSyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffProfileController extends Controller
{
    private array $faculties = [
        'Fakultas Ilmu Komputer & Teknologi Informasi',
        'Fakultas Teknik & Sains',
        'Fakultas Ekonomi & Bisnis',
        'Fakultas Kedokteran & Ilmu Kesehatan',
        'Fakultas Hukum & Humaniora',
        'Sekolah Pascasarjana',
    ];

    private array $studyPrograms = [
        'S1 Teknik Informatika',
        'S1 Sistem Informasi',
        'S1 Rekayasa Perangkat Lunak',
        'S1 Sains Data',
        'S1 Teknik Elektro',
        'S1 Teknik Industri',
        'S1 Manajemen Bisnis',
        'S1 Akuntansi',
        'S2 Magister Ilmu Komputer',
        'S3 Doktor Ilmu Komputer',
    ];

    private array $academicPositions = [
        'Tenaga Pengajar',
        'Asisten Ahli',
        'Lektor',
        'Lektor Kepala',
        'Guru Besar / Profesor',
    ];

    public function index(Request $request): Response
    {
        $query = StaffProfile::query()
            ->with('user:id,name,email')
            ->withCount('publications');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nidn', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('faculty', 'like', "%{$search}%")
                  ->orWhere('study_program', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($faculty = $request->input('faculty')) {
            $query->where('faculty', $faculty);
        }

        $staffList = $query->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Staff/Index', [
            'staffList' => $staffList,
            'filters' => $request->only(['search', 'type', 'faculty']),
            'faculties' => $this->faculties,
            'studyPrograms' => $this->studyPrograms,
        ]);
    }

    public function create(): Response
    {
        $availableUsers = User::query()
            ->whereDoesntHave('staffProfile')
            ->select('id', 'name', 'email', 'role')
            ->get();

        return Inertia::render('Staff/Edit', [
            'staff' => null,
            'availableUsers' => $availableUsers,
            'faculties' => $this->faculties,
            'studyPrograms' => $this->studyPrograms,
            'academicPositions' => $this->academicPositions,
        ]);
    }

    public function store(Request $request, ScholarSyncService $syncService): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id|unique:staff_profiles,user_id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:staff_profiles,slug',
            'type' => 'required|in:dosen,tendik',
            'front_title' => 'nullable|string|max:50',
            'back_title' => 'nullable|string|max:100',
            'nidn' => 'nullable|string|max:50',
            'nip' => 'nullable|string|max:50',
            'gender' => 'nullable|in:L,P',
            'faculty' => 'nullable|string|max:255',
            'study_program' => 'nullable|string|max:255',
            'academic_position' => 'nullable|string|max:255',
            'structural_position' => 'nullable|string|max:255',
            'employment_status' => 'nullable|string|max:255',
            'expertise' => 'nullable|array',
            'bio' => 'nullable|string',
            'education_history' => 'nullable|array',
            'office_address' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'avatar_path' => 'nullable|string',
            'google_scholar_url' => 'nullable|url|max:500',
            'scopus_id' => 'nullable|string|max:100',
            'scopus_url' => 'nullable|url|max:500',
            'sinta_id' => 'nullable|string|max:100',
            'sinta_url' => 'nullable|url|max:500',
            'orcid_id' => 'nullable|string|max:100',
            'orcid_url' => 'nullable|url|max:500',
            'research_gate_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
            'website_url' => 'nullable|url|max:500',
            'facebook_url' => 'nullable|url|max:500',
            'instagram_url' => 'nullable|url|max:500',
            'x_url' => 'nullable|url|max:500',
            'tiktok_url' => 'nullable|url|max:500',
            'rss_feed_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $baseSlug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (StaffProfile::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        if (!empty($validated['google_scholar_url'])) {
            $validated['google_scholar_id'] = $syncService->extractScholarId($validated['google_scholar_url']);
        }

        if (isset($validated['bio'])) {
            $validated['bio'] = \App\Services\HtmlSanitizer::clean($validated['bio']);
        }

        $staff = StaffProfile::create($validated);

        return redirect()
            ->route('staff.index')
            ->with('success', "Profil {$staff->full_name_with_titles} berhasil ditambahkan ke direktori.");
    }

    public function edit(StaffProfile $staff): Response
    {
        $staff->load(['user:id,name,email', 'publications']);

        $availableUsers = User::query()
            ->where(function ($q) use ($staff) {
                $q->whereDoesntHave('staffProfile')
                  ->orWhere('id', $staff->user_id);
            })
            ->select('id', 'name', 'email', 'role')
            ->get();

        return Inertia::render('Staff/Edit', [
            'staff' => $staff,
            'availableUsers' => $availableUsers,
            'faculties' => $this->faculties,
            'studyPrograms' => $this->studyPrograms,
            'academicPositions' => $this->academicPositions,
        ]);
    }

    public function update(Request $request, StaffProfile $staff, ScholarSyncService $syncService): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id|unique:staff_profiles,user_id,' . $staff->id,
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:staff_profiles,slug,' . $staff->id,
            'type' => 'required|in:dosen,tendik',
            'front_title' => 'nullable|string|max:50',
            'back_title' => 'nullable|string|max:100',
            'nidn' => 'nullable|string|max:50',
            'nip' => 'nullable|string|max:50',
            'gender' => 'nullable|in:L,P',
            'faculty' => 'nullable|string|max:255',
            'study_program' => 'nullable|string|max:255',
            'academic_position' => 'nullable|string|max:255',
            'structural_position' => 'nullable|string|max:255',
            'employment_status' => 'nullable|string|max:255',
            'expertise' => 'nullable|array',
            'bio' => 'nullable|string',
            'education_history' => 'nullable|array',
            'office_address' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'avatar_path' => 'nullable|string',
            'google_scholar_url' => 'nullable|url|max:500',
            'scopus_id' => 'nullable|string|max:100',
            'scopus_url' => 'nullable|url|max:500',
            'sinta_id' => 'nullable|string|max:100',
            'sinta_url' => 'nullable|url|max:500',
            'orcid_id' => 'nullable|string|max:100',
            'orcid_url' => 'nullable|url|max:500',
            'research_gate_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
            'website_url' => 'nullable|url|max:500',
            'facebook_url' => 'nullable|url|max:500',
            'instagram_url' => 'nullable|url|max:500',
            'x_url' => 'nullable|url|max:500',
            'tiktok_url' => 'nullable|url|max:500',
            'rss_feed_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if (!empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['slug']);
            $slug = $baseSlug;
            $counter = 1;
            while (StaffProfile::where('slug', $slug)->where('id', '!=', $staff->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        if (!empty($validated['google_scholar_url'])) {
            $validated['google_scholar_id'] = $syncService->extractScholarId($validated['google_scholar_url']);
        }

        if (isset($validated['bio'])) {
            $validated['bio'] = \App\Services\HtmlSanitizer::clean($validated['bio']);
        }

        $staff->update($validated);

        return redirect()
            ->route('staff.index')
            ->with('success', "Profil {$staff->full_name_with_titles} berhasil diperbarui.");
    }

    public function destroy(StaffProfile $staff): RedirectResponse
    {
        $name = $staff->full_name_with_titles;
        $staff->delete();

        return redirect()
            ->route('staff.index')
            ->with('success', "Profil {$name} berhasil dihapus dari direktori.");
    }

    public function sync(StaffProfile $staff, ScholarSyncService $syncService): RedirectResponse
    {
        $result = $syncService->syncProfile($staff);

        $total = $result['scholar_count'] + $result['rss_count'];
        return redirect()->back()->with('success', "Sinkronisasi berhasil! Berhasil memutakhirkan {$total} karya ilmiah untuk {$staff->full_name_with_titles}.");
    }
}
