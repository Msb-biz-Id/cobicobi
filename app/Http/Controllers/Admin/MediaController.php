<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    /**
     * Display media library view or return JSON list of media.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = (string) $request->query('search', '');
        $perPage = (int) $request->query('per_page', 24);
        $perPage = max(6, min(100, $perPage));

        $query = Media::query()
            ->with(['uploader:id,name'])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('caption', 'like', "%{$search}%")
                        ->orWhere('alt_text', 'like', "%{$search}%")
                        ->orWhere('file_name', 'like', "%{$search}%");
                });
            })
            ->with('uploader:id,name')
            ->latest('id');

        $paginated = $query->paginate($perPage)->withQueryString();

        $items = $paginated->through(function (Media $item) {
            return [
                'id' => $item->id,
                'title' => $item->title ?: $item->file_name,
                'caption' => $item->caption,
                'alt_text' => $item->alt_text,
                'file_name' => $item->file_name,
                'file_size' => $item->formatted_size,
                'url' => $item->url,
                'thumbnail_url' => $item->url,
                'mime_type' => $item->mime_type,
                'created_at' => $item->created_at?->translatedFormat('d M Y, H:i') ?? '-',
                'uploader' => $item->uploader?->name ?? 'System',
            ];
        });

        if ($request->wantsJson()) {
            return response()->json($items);
        }

        $totalBytes = (int) Media::query()->sum('file_size');
        $formattedTotalSize = $totalBytes >= 1048576
            ? round($totalBytes / 1048576, 2) . ' MB'
            : round($totalBytes / 1024, 1) . ' KB';

        return Inertia::render('Media/Index', [
            'media' => $items,
            'filters' => [
                'search' => $search,
            ],
            'stats' => [
                'total_items' => Media::query()->count(),
                'total_size' => $formattedTotalSize,
            ],
        ]);
    }

    /**
     * Upload an image file to the Media Library.
     */
    public function upload(Request $request, ImageUploadService $uploader): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:500'], // max 500KB
            'title' => ['nullable', 'string', 'max:255'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:1000'],
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $title = $request->input('title') ?: pathinfo($originalName, PATHINFO_FILENAME);

        $path = $uploader->upload(
            file: $file,
            directory: 'media',
            applyWatermark: false,
            maxWidth: 2400,
            maxHeight: 2400,
            quality: 85,
        );

        $fileSizeBytes = Storage::disk('public')->exists($path)
            ? Storage::disk('public')->size($path)
            : $file->getSize();

        $media = Media::query()->create([
            'user_id' => $request->user()?->id,
            'title' => $title,
            'file_name' => $originalName,
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType() ?: 'image/jpeg',
            'file_size' => $fileSizeBytes,
            'alt_text' => $request->input('alt_text') ?: $title,
            'caption' => $request->input('caption'),
        ]);

        return response()->json([
            'id' => $media->id,
            'title' => $media->title,
            'file_name' => $media->file_name,
            'file_size' => $media->formatted_size,
            'url' => $media->url,
            'thumbnail_url' => $media->url,
            'alt_text' => $media->alt_text,
            'caption' => $media->caption,
            'created_at' => $media->created_at?->translatedFormat('d M Y, H:i'),
            'uploader' => $request->user()?->name ?? 'System',
        ], 201);
    }

    /**
     * Update media metadata (title, alt_text, caption).
     */
    public function update(Request $request, Media $media): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:1000'],
        ]);

        $media->update($validated);

        return response()->json([
            'message' => 'Media updated successfully',
            'media' => [
                'id' => $media->id,
                'title' => $media->title,
                'caption' => $media->caption,
                'alt_text' => $media->alt_text,
                'url' => $media->url,
                'file_name' => $media->file_name,
                'file_size' => $media->formatted_size,
            ],
        ]);
    }

    /**
     * Delete a media item permanently.
     */
    public function destroy(Media $media): JsonResponse
    {
        if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }

        $media->delete();

        return response()->json([
            'message' => 'Media deleted permanently',
        ]);
    }
}
