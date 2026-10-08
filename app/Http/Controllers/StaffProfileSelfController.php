<?php

namespace App\Http\Controllers;

use App\Models\StaffProfile;
use App\Models\StaffPublication;
use App\Services\ScholarSyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffProfileSelfController extends Controller
{
    /**
     * Show self-service edit profile page for logged-in lecturer or staff.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Get or create staff profile for this user
        $profile = StaffProfile::with(['publications' => function ($q) {
            $q->orderBy('year', 'desc')->orderBy('id', 'desc');
        }])->firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'slug' => Str::slug($user->name) . '-' . substr(uniqid(), -4),
                'email' => $user->email,
                'phone' => $user->phone_number,
                'avatar_path' => $user->profile_photo_path,
                'type' => $user->role === 'tendik' ? 'tendik' : 'dosen',
                'is_active' => true,
            ]
        );

        $faculties = [
            'Fakultas Ilmu Komputer & Teknologi Informasi',
            'Fakultas Teknik & Sains',
            'Fakultas Ekonomi & Bisnis',
            'Fakultas Kedokteran & Ilmu Kesehatan',
            'Fakultas Hukum & Humaniora',
            'Sekolah Pascasarjana',
        ];

        $studyPrograms = [
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

        $academicPositions = [
            'Tenaga Pengajar',
            'Asisten Ahli',
            'Lektor',
            'Lektor Kepala',
            'Guru Besar / Profesor',
        ];

        return Inertia::render('Profile/StaffBio', [
            'profile' => $profile,
            'faculties' => $faculties,
            'studyPrograms' => $studyPrograms,
            'academicPositions' => $academicPositions,
        ]);
    }

    /**
     * Update self staff profile.
     */
    public function update(Request $request, ScholarSyncService $syncService): RedirectResponse
    {
        $user = $request->user();
        $profile = StaffProfile::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
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
            'education_history.*.degree' => 'nullable|string',
            'education_history.*.institution' => 'nullable|string',
            'education_history.*.major' => 'nullable|string',
            'education_history.*.graduation_year' => 'nullable|numeric',
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
        ]);

        // Auto extract scholar ID if URL is provided
        if (!empty($validated['google_scholar_url'])) {
            $extractedId = $syncService->extractScholarId($validated['google_scholar_url']);
            if ($extractedId) {
                $validated['google_scholar_id'] = $extractedId;
            }
        }

        if (isset($validated['bio'])) {
            $validated['bio'] = \App\Services\HtmlSanitizer::clean($validated['bio']);
        }

        $profile->update($validated);

        return redirect()->back()->with('success', 'Biodata profil akademik Anda berhasil diperbarui.');
    }

    /**
     * Trigger auto-sync from Google Scholar and RSS feed.
     */
    public function syncScholar(Request $request, ScholarSyncService $service): RedirectResponse
    {
        $user = $request->user();
        $profile = StaffProfile::where('user_id', $user->id)->firstOrFail();

        if (empty($profile->google_scholar_url) && empty($profile->google_scholar_id) && empty($profile->rss_feed_url)) {
            return redirect()->back()->with('error', 'Silakan tempelkan tautan profil Google Scholar atau RSS Feed terlebih dahulu.');
        }

        $result = $service->syncProfile($profile);

        if (!empty($result['errors'])) {
            $errorMsg = implode(' ', $result['errors']);
            return redirect()->back()->with('warning', "Sinkronisasi selesai sebagian: {$errorMsg}");
        }

        $totalSynced = $result['scholar_count'] + $result['rss_count'];
        return redirect()->back()->with('success', "Sinkronisasi berhasil! Berhasil memperbarui {$totalSynced} karya ilmiah dan metrik sitasi.");
    }

    /**
     * Store manual academic publication.
     */
    public function storePublication(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = StaffProfile::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'authors' => 'nullable|string|max:500',
            'publication_name' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1950|max:2050',
            'type' => 'required|in:journal,conference,book,patent,community_service,other',
            'doi' => 'nullable|string|max:255',
            'url' => 'nullable|url|max:500',
            'citations_count' => 'nullable|integer|min:0',
            'description' => 'nullable|string|max:2000',
            'is_featured' => 'boolean',
        ]);

        $validated['staff_profile_id'] = $profile->id;
        $validated['source'] = 'manual';

        StaffPublication::create($validated);

        return redirect()->back()->with('success', 'Publikasi ilmiah manual berhasil ditambahkan.');
    }

    /**
     * Update manual publication.
     */
    public function updatePublication(Request $request, StaffPublication $publication): RedirectResponse
    {
        $user = $request->user();
        $profile = StaffProfile::where('user_id', $user->id)->firstOrFail();

        if ($publication->staff_profile_id !== $profile->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'authors' => 'nullable|string|max:500',
            'publication_name' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1950|max:2050',
            'type' => 'required|in:journal,conference,book,patent,community_service,other',
            'doi' => 'nullable|string|max:255',
            'url' => 'nullable|url|max:500',
            'citations_count' => 'nullable|integer|min:0',
            'description' => 'nullable|string|max:2000',
            'is_featured' => 'boolean',
        ]);

        $publication->update($validated);

        return redirect()->back()->with('success', 'Publikasi ilmiah berhasil diperbarui.');
    }

    /**
     * Delete publication.
     */
    public function destroyPublication(Request $request, StaffPublication $publication): RedirectResponse
    {
        $user = $request->user();
        $profile = StaffProfile::where('user_id', $user->id)->firstOrFail();

        if ($publication->staff_profile_id !== $profile->id) {
            abort(403);
        }

        $publication->delete();

        return redirect()->back()->with('success', 'Publikasi berhasil dihapus.');
    }
}
