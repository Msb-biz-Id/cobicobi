<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryRequest;
use App\Http\Requests\Admin\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Models\GalleryImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Gallery::query()
            ->withCount('images')
            ->latest('event_date')
            ->latest('id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('photographer', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        $galleries = $query->paginate(12)->withQueryString();

        $categories = Gallery::query()
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->values();

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries,
            'filters' => $request->only(['search', 'category']),
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Galleries/Form', [
            'isEditing' => false,
            'gallery' => null,
            'categories' => ['Dies Natalis', 'Wisuda', 'Akademik & Perkuliahan', 'Laboratorium & Riset', 'Kegiatan Mahasiswa', 'Fasilitas Kampus', 'Prestasi', 'Umum'],
        ]);
    }

    public function store(StoreGalleryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $coverUrl = null;
            if ($request->hasFile('cover_image')) {
                $path = $request->file('cover_image')->store('galleries/covers', 'public');
                $coverUrl = Storage::url($path);
            }

            $gallery = Gallery::create([
                'title' => $validated['title'],
                'category' => $validated['category'],
                'description' => $validated['description'] ?? null,
                'event_date' => $validated['event_date'] ?? null,
                'photographer' => $validated['photographer'] ?? null,
                'is_published' => $validated['is_published'] ?? true,
                'cover_image' => $coverUrl,
            ]);

            // Simpan multi-foto jika ada
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                $captions = $validated['captions'] ?? [];

                foreach ($images as $index => $imageFile) {
                    $path = $imageFile->store("galleries/{$gallery->id}", 'public');
                    GalleryImage::create([
                        'gallery_id' => $gallery->id,
                        'image_url' => Storage::url($path),
                        'caption' => $captions[$index] ?? null,
                        'alt_text' => $validated['title'] . ' - Foto ' . ($index + 1),
                        'position' => $index,
                    ]);
                }

                // Jika cover_image kosong, set gambar pertama sebagai cover
                if (!$coverUrl && count($images) > 0) {
                    $firstImage = $gallery->images()->first();
                    if ($firstImage) {
                        $gallery->update(['cover_image' => $firstImage->image_url]);
                    }
                }
            }
        });

        return redirect()->route('galleries.index')->with('success', 'Album galeri berhasil dibuat.');
    }

    public function edit(Gallery $gallery): Response
    {
        $gallery->load('images');

        return Inertia::render('Admin/Galleries/Form', [
            'isEditing' => true,
            'gallery' => $gallery,
            'categories' => ['Dies Natalis', 'Wisuda', 'Akademik & Perkuliahan', 'Laboratorium & Riset', 'Kegiatan Mahasiswa', 'Fasilitas Kampus', 'Prestasi', 'Umum'],
        ]);
    }

    public function update(UpdateGalleryRequest $request, Gallery $gallery): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated, $gallery) {
            $updateData = [
                'title' => $validated['title'],
                'category' => $validated['category'],
                'description' => $validated['description'] ?? null,
                'event_date' => $validated['event_date'] ?? null,
                'photographer' => $validated['photographer'] ?? null,
                'is_published' => $validated['is_published'] ?? true,
            ];

            if ($request->hasFile('cover_image')) {
                $path = $request->file('cover_image')->store('galleries/covers', 'public');
                $updateData['cover_image'] = Storage::url($path);
            }

            $gallery->update($updateData);

            // 1. Hapus gambar yang ditandai untuk dihapus
            if (!empty($validated['delete_image_ids'])) {
                $imagesToDelete = GalleryImage::where('gallery_id', $gallery->id)
                    ->whereIn('id', $validated['delete_image_ids'])
                    ->get();

                foreach ($imagesToDelete as $img) {
                    $relativePath = str_replace('/storage/', '', $img->image_url);
                    Storage::disk('public')->delete($relativePath);
                    $img->delete();
                }
            }

            // 2. Perbarui caption gambar yang sudah ada
            if (!empty($validated['existing_captions'])) {
                foreach ($validated['existing_captions'] as $imgId => $caption) {
                    GalleryImage::where('gallery_id', $gallery->id)
                        ->where('id', $imgId)
                        ->update(['caption' => $caption]);
                }
            }

            // 3. Tambahkan foto-foto baru
            if ($request->hasFile('new_images')) {
                $maxPos = $gallery->images()->max('position') ?? -1;
                $newImages = $request->file('new_images');
                $newCaptions = $validated['new_captions'] ?? [];

                foreach ($newImages as $index => $imgFile) {
                    $path = $imgFile->store("galleries/{$gallery->id}", 'public');
                    GalleryImage::create([
                        'gallery_id' => $gallery->id,
                        'image_url' => Storage::url($path),
                        'caption' => $newCaptions[$index] ?? null,
                        'alt_text' => $gallery->title . ' - Foto',
                        'position' => $maxPos + 1 + $index,
                    ]);
                }
            }

            // Jika cover masih kosong dan ada foto, gunakan foto pertama
            if (empty($gallery->cover_image)) {
                $firstImage = $gallery->images()->first();
                if ($firstImage) {
                    $gallery->update(['cover_image' => $firstImage->image_url]);
                }
            }
        });

        return redirect()->route('galleries.index')->with('success', 'Album galeri berhasil diperbarui.');
    }

    public function destroy(Gallery $gallery): RedirectResponse
    {
        $gallery->load('images');

        foreach ($gallery->images as $img) {
            $relativePath = str_replace('/storage/', '', $img->image_url);
            Storage::disk('public')->delete($relativePath);
        }

        if ($gallery->cover_image) {
            $relativePath = str_replace('/storage/', '', $gallery->cover_image);
            Storage::disk('public')->delete($relativePath);
        }

        $gallery->delete();

        return redirect()->route('galleries.index')->with('success', 'Album galeri dan seluruh foto berhasil dihapus.');
    }
}
