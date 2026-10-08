<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\StaffProfile;
use App\Models\StructuralAssignment;
use App\Models\StructuralPosition;
use App\Models\StudyProgram;
use App\Services\ImageUploadService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudyProgramController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');
        $facultyId = $request->query('faculty_id');
        $degreeLevel = (string) $request->query('degree_level', '');

        $studyPrograms = StudyProgram::query()
            ->with(['faculty:id,name,abbreviation', 'currentAssignments.position', 'currentAssignments.staffProfile'])
            ->withCount('lecturers')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('graduate_title', 'like', "%{$search}%")
                        ->orWhere('accreditation', 'like', "%{$search}%");
                });
            })
            ->when($facultyId !== null && $facultyId !== '', function ($query) use ($facultyId) {
                if ($facultyId === 'none') {
                    $query->whereNull('faculty_id');
                } else {
                    $query->where('faculty_id', (int) $facultyId);
                }
            })
            ->when($degreeLevel !== '', function ($query) use ($degreeLevel) {
                $query->where('degree_level', $degreeLevel);
            })
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        $faculties = Faculty::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'abbreviation']);

        return Inertia::render('StudyPrograms/Index', [
            'studyPrograms' => $studyPrograms,
            'faculties' => $faculties,
            'filters' => [
                'search' => $search,
                'faculty_id' => $facultyId,
                'degree_level' => $degreeLevel,
            ],
        ]);
    }

    public function create(): Response
    {
        $faculties = Faculty::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'abbreviation']);

        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'study_program'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('StudyPrograms/Form', [
            'studyProgram' => null,
            'faculties' => $faculties,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateStudyProgram($request);

        DB::transaction(function () use ($request, $validated) {
            $prodiData = $this->prepareStudyProgramData($request, $validated);
            $prodi = StudyProgram::create($prodiData);

            $this->handleStaffAndAssignments($request, $prodi);
        });

        return redirect()->route('admin.study-programs.index')
            ->with('success', 'Program Studi berhasil ditambahkan.');
    }

    public function edit(StudyProgram $studyProgram): Response
    {
        $studyProgram->load([
            'faculty:id,name',
            'lecturers:id,name,front_title,back_title,type,nidn',
            'structuralAssignments.position',
            'structuralAssignments.staffProfile',
        ]);

        $faculties = Faculty::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'abbreviation']);

        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'study_program'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('StudyPrograms/Form', [
            'studyProgram' => $studyProgram,
            'faculties' => $faculties,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function update(Request $request, StudyProgram $studyProgram): RedirectResponse
    {
        $validated = $this->validateStudyProgram($request, $studyProgram->id);

        DB::transaction(function () use ($request, $validated, $studyProgram) {
            $prodiData = $this->prepareStudyProgramData($request, $validated, $studyProgram);
            $studyProgram->update($prodiData);

            $this->handleStaffAndAssignments($request, $studyProgram);
        });

        return redirect()->route('admin.study-programs.index')
            ->with('success', 'Data Program Studi berhasil diperbarui.');
    }

    public function destroy(StudyProgram $studyProgram): RedirectResponse
    {
        $studyProgram->structuralAssignments()->delete();
        $studyProgram->lecturers()->detach();
        $studyProgram->delete();

        return redirect()->route('admin.study-programs.index')
            ->with('success', 'Program Studi berhasil dihapus.');
    }

    protected function validateStudyProgram(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'faculty_id' => ['nullable', 'exists:faculties,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('study_programs', 'slug')->ignore($id)],
            'code' => ['nullable', 'string', 'max:50'],
            'abbreviation' => ['nullable', 'string', 'max:50'],
            'degree_level' => ['required', 'string', 'max:20'],
            'graduate_title' => ['nullable', 'string', 'max:50'],
            'accreditation' => ['nullable', 'string', 'max:50'],
            'accreditation_number' => ['nullable', 'string', 'max:100'],
            'decree_number' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'career_prospects' => ['nullable', 'array'],
            'career_prospects.*' => ['string', 'max:255'],
            'curriculum_overview' => ['nullable', 'string'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'x_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'office_location' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:500'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'lecturer_ids' => ['nullable', 'array'],
            'lecturer_ids.*' => ['integer', 'exists:staff_profiles,id'],
            'assignments' => ['nullable', 'array'],
            'assignments.*.structural_position_id' => ['required', 'exists:structural_positions,id'],
            'assignments.*.staff_profile_id' => ['required', 'exists:staff_profiles,id'],
            'assignments.*.custom_title' => ['nullable', 'string', 'max:255'],
            'assignments.*.period_start' => ['nullable', 'date'],
            'assignments.*.period_end' => ['nullable', 'date'],
            'assignments.*.decree_number' => ['nullable', 'string', 'max:100'],
            'assignments.*.is_current' => ['boolean'],
        ]);
    }

    protected function prepareStudyProgramData(Request $request, array $validated, ?StudyProgram $existing = null): array
    {
        $careerProspects = [];
        if (!empty($validated['career_prospects'])) {
            $careerProspects = array_values(array_filter(array_map('strip_tags', (array) $validated['career_prospects'])));
        }

        $data = [
            'faculty_id' => !empty($validated['faculty_id']) ? (int) $validated['faculty_id'] : null,
            'name' => strip_tags($validated['name']),
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'code' => !empty($validated['code']) ? strip_tags($validated['code']) : null,
            'abbreviation' => !empty($validated['abbreviation']) ? strip_tags($validated['abbreviation']) : null,
            'degree_level' => strip_tags($validated['degree_level']),
            'graduate_title' => !empty($validated['graduate_title']) ? strip_tags($validated['graduate_title']) : null,
            'accreditation' => !empty($validated['accreditation']) ? strip_tags($validated['accreditation']) : null,
            'accreditation_number' => !empty($validated['accreditation_number']) ? strip_tags($validated['accreditation_number']) : null,
            'decree_number' => !empty($validated['decree_number']) ? strip_tags($validated['decree_number']) : null,
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'vision' => HtmlSanitizer::clean($validated['vision'] ?? null),
            'mission' => HtmlSanitizer::clean($validated['mission'] ?? null),
            'career_prospects' => $careerProspects,
            'curriculum_overview' => HtmlSanitizer::clean($validated['curriculum_overview'] ?? null),
            'facebook_url' => $validated['facebook_url'] ?? null,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'x_url' => $validated['x_url'] ?? null,
            'tiktok_url' => $validated['tiktok_url'] ?? null,
            'youtube_url' => $validated['youtube_url'] ?? null,
            'website_url' => $validated['website_url'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => !empty($validated['phone']) ? strip_tags($validated['phone']) : null,
            'office_location' => !empty($validated['office_location']) ? strip_tags($validated['office_location']) : null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ];

        // Pastikan slug unik
        $originalSlug = $data['slug'];
        $count = 1;
        while (StudyProgram::where('slug', $data['slug'])->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists()) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $this->imageUploadService->upload($request->file('logo'), 'study-programs/logos');
        }

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $this->imageUploadService->upload($request->file('cover_image'), 'study-programs/covers');
        }

        return $data;
    }

    protected function handleStaffAndAssignments(Request $request, StudyProgram $studyProgram): void
    {
        // 1. Sync Dosen Pengajar (Multi-Select)
        if ($request->has('lecturer_ids')) {
            $lecturerIds = (array) $request->input('lecturer_ids', []);
            $syncData = [];
            foreach ($lecturerIds as $idx => $id) {
                $syncData[$id] = ['role' => 'Dosen Homebase', 'sort_order' => $idx + 1];
            }
            $studyProgram->lecturers()->sync($syncData);
        }

        // 2. Simpan Pejabat Struktural (Kaprodi, Sekprodi, dll)
        if ($request->has('assignments')) {
            $studyProgram->structuralAssignments()->delete();

            foreach ((array) $request->input('assignments', []) as $idx => $asg) {
                if (empty($asg['structural_position_id']) || empty($asg['staff_profile_id'])) {
                    continue;
                }

                StructuralAssignment::create([
                    'assignable_type' => StudyProgram::class,
                    'assignable_id' => $studyProgram->id,
                    'structural_position_id' => $asg['structural_position_id'],
                    'staff_profile_id' => $asg['staff_profile_id'],
                    'custom_title' => !empty($asg['custom_title']) ? strip_tags($asg['custom_title']) : null,
                    'period_start' => $asg['period_start'] ?? null,
                    'period_end' => $asg['period_end'] ?? null,
                    'decree_number' => !empty($asg['decree_number']) ? strip_tags($asg['decree_number']) : null,
                    'is_current' => filter_var($asg['is_current'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'sort_order' => $idx + 1,
                ]);
            }
        }
    }
}
