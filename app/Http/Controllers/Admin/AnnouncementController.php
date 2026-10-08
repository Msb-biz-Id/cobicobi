<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AnnouncementController extends Controller
{
    private array $categories = [
        'Akademik',
        'Kemahasiswaan',
        'Beasiswa',
        'Karir & Rekrutmen',
        'Registrasi Ulang',
        'Wisuda & Yudisium',
        'Riset & Pengabdian',
        'Umum',
    ];

    private array $audiences = [
        'Semua Civitas',
        'Mahasiswa',
        'Dosen & Tendik',
        'Mahasiswa Baru',
        'Alumni',
        'Publik',
    ];

    public function index(Request $request): Response
    {
        $query = Announcement::query()->with('user:id,name');

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

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $announcements = $query->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search', 'category', 'target_audience', 'status']),
            'categories' => $this->categories,
            'audiences' => $this->audiences,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Announcements/Edit', [
            'announcement' => null,
            'categories' => $this->categories,
            'audiences' => $this->audiences,
        ]);
    }

    public function store(StoreAnnouncementRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $baseSlug = !empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (Announcement::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }
        $data['slug'] = $slug;
        $data['user_id'] = $request->user()?->id;

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if (isset($data['content'])) {
            $data['content'] = \App\Services\HtmlSanitizer::clean($data['content']);
        }

        // Process attachments
        $attachments = $data['attachments'] ?? [];

        if ($request->hasFile('new_files')) {
            foreach ($request->file('new_files') as $file) {
                $originalName = preg_replace('/[^a-zA-Z0-9_\-\. ]/', '', basename($file->getClientOriginalName()));
                $extension = strtolower($file->getClientOriginalExtension());
                $storedPath = $file->store('announcements/attachments', 'public');

                $attachments[] = [
                    'name' => $originalName ?: 'file.'.$extension,
                    'path' => $storedPath,
                    'size' => $file->getSize(),
                    'type' => $extension,
                    'download_count' => 0,
                ];
            }
        }

        unset($data['new_files']);
        $data['attachments'] = $attachments;

        $announcement = Announcement::create($data);

        return redirect()
            ->route('announcements.show', $announcement)
            ->with('success', 'Pengumuman kampus berhasil dibuat.');
    }

    public function show(Announcement $announcement): Response
    {
        $announcement->load('user:id,name');

        return Inertia::render('Announcements/Show', [
            'announcement' => $announcement,
            'isPublicView' => false,
        ]);
    }

    public function edit(Announcement $announcement): Response
    {
        return Inertia::render('Announcements/Edit', [
            'announcement' => $announcement,
            'categories' => $this->categories,
            'audiences' => $this->audiences,
        ]);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement): RedirectResponse
    {
        $data = $request->validated();

        if (!empty($data['slug'])) {
            $baseSlug = Str::slug($data['slug']);
            $slug = $baseSlug;
            $counter = 1;
            while (Announcement::where('slug', $slug)->where('id', '!=', $announcement->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $data['slug'] = $slug;
        }

        if ($data['status'] === 'published' && empty($announcement->published_at) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if (isset($data['content'])) {
            $data['content'] = \App\Services\HtmlSanitizer::clean($data['content']);
        }

        // Process attachments
        $attachments = $data['attachments'] ?? [];

        if ($request->hasFile('new_files')) {
            foreach ($request->file('new_files') as $file) {
                $originalName = preg_replace('/[^a-zA-Z0-9_\-\. ]/', '', basename($file->getClientOriginalName()));
                $extension = strtolower($file->getClientOriginalExtension());
                $storedPath = $file->store('announcements/attachments', 'public');

                $attachments[] = [
                    'name' => $originalName ?: 'file.'.$extension,
                    'path' => $storedPath,
                    'size' => $file->getSize(),
                    'type' => $extension,
                    'download_count' => 0,
                ];
            }
        }

        unset($data['new_files']);
        $data['attachments'] = $attachments;

        $announcement->update($data);

        return redirect()
            ->route('announcements.show', $announcement)
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return redirect()
            ->route('announcements.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }

    /**
     * Download an attachment and increment download counter.
     */
    public function download(Announcement $announcement, int $index): BinaryFileResponse|RedirectResponse
    {
        $attachments = $announcement->attachments ?? [];

        if (!isset($attachments[$index])) {
            abort(404, 'File lampiran tidak ditemukan.');
        }

        $item = $attachments[$index];
        $path = $item['path'] ?? '';

        // Prevent path traversal
        if (str_contains($path, '..') || !Storage::disk('public')->exists($path)) {
            abort(404, 'File fisik tidak ditemukan pada storage.');
        }

        // Increment download count
        $attachments[$index]['download_count'] = ($item['download_count'] ?? 0) + 1;
        $announcement->attachments = $attachments;
        $announcement->saveQuietly();

        $fullPath = Storage::disk('public')->path($path);
        $downloadName = $item['name'] ?? basename($path);

        return response()->download($fullPath, $downloadName);
    }
}
