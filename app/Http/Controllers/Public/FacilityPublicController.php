<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityPublicController extends Controller
{
    public function index(Request $request): Response
    {
        $category = (string) $request->query('kategori', '');

        $facilities = Facility::where('is_active', true)
            ->when($category !== '', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Public/Facilities/Index', [
            'facilities' => $facilities,
            'filters' => [
                'kategori' => $category,
            ],
        ]);
    }

    public function show(Facility $facility): Response
    {
        abort_unless($facility->is_active, 404);

        $relatedFacilities = Facility::where('is_active', true)
            ->where('id', '!=', $facility->id)
            ->where('category', $facility->category)
            ->take(3)
            ->get();

        return Inertia::render('Public/Facilities/Show', [
            'facility' => $facility,
            'relatedFacilities' => $relatedFacilities,
        ]);
    }
}
