<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryPublicController extends Controller
{
    /**
     * Halaman Arsip Galeri Dokumentasi Kampus.
     */
    public function index(Request $request): Response
    {
        $query = Gallery::query()
            ->published()
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

        if ($request->filled('kategori')) {
            $query->where('category', $request->input('kategori'));
        }

        $galleries = $query->paginate(12)->withQueryString();

        $categories = Gallery::query()
            ->published()
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->values();

        $totalPhotos = Gallery::query()->published()->withCount('images')->get()->sum('images_count');

        return Inertia::render('Public/Galleries/Index', [
            'galleries' => $galleries,
            'filters' => [
                'search' => $request->input('search', ''),
                'kategori' => $request->input('kategori', ''),
            ],
            'categories' => $categories,
            'stats' => [
                'totalGalleries' => Gallery::query()->published()->count(),
                'totalPhotos' => $totalPhotos,
            ],
        ]);
    }

    /**
     * Halaman Detail Single Galeri Dokumentasi Foto & Lightbox.
     */
    public function show(Gallery $gallery): Response
    {
        abort_unless($gallery->is_published, 404);

        // Tambah counter kunjungan secara aman
        $gallery->increment('views_count');

        $gallery->load('images');

        $relatedGalleries = Gallery::query()
            ->published()
            ->where('id', '!=', $gallery->id)
            ->where('category', $gallery->category)
            ->withCount('images')
            ->latest('event_date')
            ->limit(3)
            ->get();

        // Jika album terkait dalam kategori sama kurang dari 3, ambil dari kategori lain
        if ($relatedGalleries->count() < 3) {
            $additional = Gallery::query()
                ->published()
                ->where('id', '!=', $gallery->id)
                ->whereNotIn('id', $relatedGalleries->pluck('id'))
                ->withCount('images')
                ->latest('id')
                ->limit(3 - $relatedGalleries->count())
                ->get();
            $relatedGalleries = $relatedGalleries->merge($additional);
        }

        return Inertia::render('Public/Galleries/Show', [
            'gallery' => $gallery,
            'relatedGalleries' => $relatedGalleries,
        ]);
    }
}
