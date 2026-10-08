<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\StaffProfile;
use App\Models\StructuralAssignment;
use App\Models\StructuralPosition;
use App\Services\ImageUploadService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FacultyController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');

        $faculties = Faculty::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('abbreviation', 'like', "%{$search}%");
                });
            })
            ->withCount(['studyPrograms', 'lecturers'])
            ->with(['currentAssignments.position', 'currentAssignments.staffProfile'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Faculties/Index', [
            'faculties' => $faculties,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'faculty'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('Faculties/Form', [
            'faculty' => null,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateFaculty($request);

        DB::transaction(function () use ($request, $validated) {
            $facultyData = $this->prepareFacultyData($request, $validated);
            $faculty = Faculty::create($facultyData);

            $this->handleStaffAndAssignments($request, $faculty);
        });

        return redirect()->route('admin.faculties.index')
            ->with('success', 'Fakultas berhasil ditambahkan.');
    }

    public function edit(Faculty $faculty): Response
    {
        $faculty->load([
            'lecturers:id,name,front_title,back_title,type,nidn',
            'structuralAssignments.position',
            'structuralAssignments.staffProfile',
        ]);

        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'faculty'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('Faculties/Form', [
            'faculty' => $faculty,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function update(Request $request, Faculty $faculty): RedirectResponse
    {
        $validated = $this->validateFaculty($request, $faculty->id);

        DB::transaction(function () use ($request, $validated, $faculty) {
            $facultyData = $this->prepareFacultyData($request, $validated, $faculty);
            $faculty->update($facultyData);

            $this->handleStaffAndAssignments($request, $faculty);
        });

        return redirect()->route('admin.faculties.index')
            ->with('success', 'Data Fakultas berhasil diperbarui.');
    }

    public function destroy(Faculty $faculty): RedirectResponse
    {
        if ($faculty->studyPrograms()->exists()) {
            return redirect()->route('admin.faculties.index')
                ->with('error', 'Fakultas tidak dapat dihapus karena masih menaungi Program Studi aktif.');
        }

        $faculty->structuralAssignments()->delete();
        $faculty->lecturers()->detach();
        $faculty->delete();

        return redirect()->route('admin.faculties.index')
            ->with('success', 'Fakultas berhasil dihapus.');
    }

    protected function validateFaculty(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('faculties', 'slug')->ignore($id)],
            'code' => ['nullable', 'string', 'max:50'],
            'abbreviation' => ['nullable', 'string', 'max:50'],
            'decree_number' => ['nullable', 'string', 'max:100'],
            'accreditation' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'objectives' => ['nullable', 'string'],
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

    protected function prepareFacultyData(Request $request, array $validated, ?Faculty $existing = null): array
    {
        $data = [
            'name' => strip_tags($validated['name']),
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'code' => !empty($validated['code']) ? strip_tags($validated['code']) : null,
            'abbreviation' => !empty($validated['abbreviation']) ? strip_tags($validated['abbreviation']) : null,
            'decree_number' => !empty($validated['decree_number']) ? strip_tags($validated['decree_number']) : null,
            'accreditation' => !empty($validated['accreditation']) ? strip_tags($validated['accreditation']) : null,
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'vision' => HtmlSanitizer::clean($validated['vision'] ?? null),
            'mission' => HtmlSanitizer::clean($validated['mission'] ?? null),
            'objectives' => HtmlSanitizer::clean($validated['objectives'] ?? null),
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
        while (Faculty::where('slug', $data['slug'])->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists()) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $this->imageUploadService->upload($request->file('logo'), 'faculties/logos');
        }

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $this->imageUploadService->upload($request->file('cover_image'), 'faculties/covers');
        }

        return $data;
    }

    protected function handleStaffAndAssignments(Request $request, Faculty $faculty): void
    {
        // 1. Sync Dosen Pengajar (Multi-Select)
        if ($request->has('lecturer_ids')) {
            $lecturerIds = (array) $request->input('lecturer_ids', []);
            $syncData = [];
            foreach ($lecturerIds as $idx => $id) {
                $syncData[$id] = ['role' => 'Dosen Fakultas', 'sort_order' => $idx + 1];
            }
            $faculty->lecturers()->sync($syncData);
        }

        // 2. Simpan Pejabat Struktural
        if ($request->has('assignments')) {
            $faculty->structuralAssignments()->delete();

            foreach ((array) $request->input('assignments', []) as $idx => $asg) {
                if (empty($asg['structural_position_id']) || empty($asg['staff_profile_id'])) {
                    continue;
                }

                StructuralAssignment::create([
                    'assignable_type' => Faculty::class,
                    'assignable_id' => $faculty->id,
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
