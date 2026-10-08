<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\InstitutionalUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionalUnitPublicController extends Controller
{
    public function index(Request $request): Response
    {
        $category = (string) $request->query('kategori', '');

        $units = InstitutionalUnit::where('is_active', true)
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

        return Inertia::render('Public/InstitutionalUnits/Index', [
            'units' => $units,
            'filters' => [
                'kategori' => $category,
            ],
        ]);
    }

    public function show(InstitutionalUnit $institutionalUnit): Response
    {
        abort_unless($institutionalUnit->is_active, 404);

        $institutionalUnit->load([
            'currentAssignments.position',
            'currentAssignments.staffProfile',
        ]);

        return Inertia::render('Public/InstitutionalUnits/Show', [
            'unit' => $institutionalUnit,
        ]);
    }
}
