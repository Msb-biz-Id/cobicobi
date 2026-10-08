<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Inertia\Inertia;
use Inertia\Response;

class FacultyPublicController extends Controller
{
    public function index(): Response
    {
        $faculties = Faculty::where('is_active', true)
            ->withCount(['studyPrograms' => fn($q) => $q->where('is_active', true), 'lecturers'])
            ->with([
                'currentAssignments.position',
                'currentAssignments.staffProfile',
            ])
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Public/Faculties/Index', [
            'faculties' => $faculties,
        ]);
    }

    public function show(Faculty $faculty): Response
    {
        abort_unless($faculty->is_active, 404);

        $faculty->load([
            'studyPrograms' => fn($q) => $q->where('is_active', true)->orderBy('sort_order', 'asc'),
            'currentAssignments.position',
            'currentAssignments.staffProfile',
            'lecturers' => fn($q) => $q->where('is_active', true)->orderByPivot('sort_order', 'asc'),
        ]);

        return Inertia::render('Public/Faculties/Show', [
            'faculty' => $faculty,
        ]);
    }
}
