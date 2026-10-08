<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\StudyProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudyProgramPublicController extends Controller
{
    public function index(Request $request): Response
    {
        $facultySlug = (string) $request->query('fakultas', '');
        $degreeLevel = (string) $request->query('jenjang', '');

        $studyPrograms = StudyProgram::where('is_active', true)
            ->with(['faculty:id,name,slug,abbreviation', 'currentAssignments.position', 'currentAssignments.staffProfile'])
            ->withCount('lecturers')
            ->when($facultySlug !== '', function ($query) use ($facultySlug) {
                if ($facultySlug === 'mandiri') {
                    $query->whereNull('faculty_id');
                } else {
                    $query->whereHas('faculty', fn($q) => $q->where('slug', $facultySlug));
                }
            })
            ->when($degreeLevel !== '', function ($query) use ($degreeLevel) {
                $query->where('degree_level', $degreeLevel);
            })
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $faculties = Faculty::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'slug', 'abbreviation']);

        return Inertia::render('Public/StudyPrograms/Index', [
            'studyPrograms' => $studyPrograms,
            'faculties' => $faculties,
            'filters' => [
                'fakultas' => $facultySlug,
                'jenjang' => $degreeLevel,
            ],
        ]);
    }

    public function show(StudyProgram $studyProgram): Response
    {
        abort_unless($studyProgram->is_active, 404);

        $studyProgram->load([
            'faculty',
            'currentAssignments.position',
            'currentAssignments.staffProfile',
            'lecturers' => fn($q) => $q->where('is_active', true)->orderByPivot('sort_order', 'asc'),
        ]);

        return Inertia::render('Public/StudyPrograms/Show', [
            'studyProgram' => $studyProgram,
        ]);
    }
}
