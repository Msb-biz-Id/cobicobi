<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Extracurricular;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExtracurricularPublicController extends Controller
{
    public function index(Request $request): Response
    {
        $category = (string) $request->query('kategori', '');

        $extracurriculars = Extracurricular::where('is_active', true)
            ->when($category !== '', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->with([
                'currentAssignments.position',
                'currentAssignments.staffProfile',
            ])
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Public/Extracurriculars/Index', [
            'extracurriculars' => $extracurriculars,
            'filters' => [
                'kategori' => $category,
            ],
        ]);
    }

    public function show(Extracurricular $extracurricular): Response
    {
        abort_unless($extracurricular->is_active, 404);

        $extracurricular->load([
            'currentAssignments.position',
            'currentAssignments.staffProfile',
        ]);

        $otherExtracurriculars = Extracurricular::where('is_active', true)
            ->where('id', '!=', $extracurricular->id)
            ->take(3)
            ->get(['id', 'name', 'slug', 'category', 'logo_path']);

        return Inertia::render('Public/Extracurriculars/Show', [
            'extracurricular' => $extracurricular,
            'otherExtracurriculars' => $otherExtracurriculars,
        ]);
    }
}
