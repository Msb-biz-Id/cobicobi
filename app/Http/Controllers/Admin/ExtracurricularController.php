<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Extracurricular;
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

class ExtracurricularController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');
        $category = (string) $request->query('category', '');

        $extracurriculars = Extracurricular::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('abbreviation', 'like', "%{$search}%");
                });
            })
            ->when($category !== '', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->with(['currentAssignments.position', 'currentAssignments.staffProfile'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Extracurriculars/Index', [
            'extracurriculars' => $extracurriculars,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create(): Response
    {
        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'extracurricular'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('Extracurriculars/Form', [
            'extracurricular' => null,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateExtracurricular($request);

        DB::transaction(function () use ($request, $validated) {
            $ukmData = $this->prepareExtracurricularData($request, $validated);
            $ukm = Extracurricular::create($ukmData);

            $this->handleAdvisors($request, $ukm);
        });

        return redirect()->route('admin.extracurriculars.index')
            ->with('success', 'Ekstrakurikuler / UKM berhasil ditambahkan.');
    }

    public function edit(Extracurricular $extracurricular): Response
    {
        $extracurricular->load([
            'structuralAssignments.position',
            'structuralAssignments.staffProfile',
        ]);

        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'extracurricular'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('Extracurriculars/Form', [
            'extracurricular' => $extracurricular,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function update(Request $request, Extracurricular $extracurricular): RedirectResponse
    {
        $validated = $this->validateExtracurricular($request, $extracurricular->id);

        DB::transaction(function () use ($request, $validated, $extracurricular) {
            $ukmData = $this->prepareExtracurricularData($request, $validated, $extracurricular);
            $extracurricular->update($ukmData);

            $this->handleAdvisors($request, $extracurricular);
        });

        return redirect()->route('admin.extracurriculars.index')
            ->with('success', 'Data Ekstrakurikuler / UKM berhasil diperbarui.');
    }

    public function destroy(Extracurricular $extracurricular): RedirectResponse
    {
        $extracurricular->structuralAssignments()->delete();
        $extracurricular->delete();

        return redirect()->route('admin.extracurriculars.index')
            ->with('success', 'Ekstrakurikuler / UKM berhasil dihapus.');
    }

    protected function validateExtracurricular(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('extracurriculars', 'slug')->ignore($id)],
            'abbreviation' => ['nullable', 'string', 'max:50'],
            'category' => ['required', 'string', Rule::in(['penalaran_keilmuan', 'seni_budaya', 'olahraga', 'keagamaan', 'sosial_kemanusiaan'])],
            'description' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'achievements' => ['nullable', 'array'],
            'achievements.*' => ['string', 'max:255'],
            'activities_overview' => ['nullable', 'string'],
            'registration_info' => ['nullable', 'string'],
            'registration_url' => ['nullable', 'url', 'max:500'],
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

    protected function prepareExtracurricularData(Request $request, array $validated, ?Extracurricular $existing = null): array
    {
        $achievements = [];
        if (!empty($validated['achievements'])) {
            $achievements = array_values(array_filter(array_map('strip_tags', (array) $validated['achievements'])));
        }

        $data = [
            'name' => strip_tags($validated['name']),
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'abbreviation' => !empty($validated['abbreviation']) ? strip_tags($validated['abbreviation']) : null,
            'category' => $validated['category'],
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'vision' => HtmlSanitizer::clean($validated['vision'] ?? null),
            'mission' => HtmlSanitizer::clean($validated['mission'] ?? null),
            'achievements' => $achievements,
            'activities_overview' => HtmlSanitizer::clean($validated['activities_overview'] ?? null),
            'registration_info' => HtmlSanitizer::clean($validated['registration_info'] ?? null),
            'registration_url' => $validated['registration_url'] ?? null,
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

        // Slug Unik
        $originalSlug = $data['slug'];
        $count = 1;
        while (Extracurricular::where('slug', $data['slug'])->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists()) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $this->imageUploadService->upload($request->file('logo'), 'extracurriculars/logos');
        }

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $this->imageUploadService->upload($request->file('cover_image'), 'extracurriculars/covers');
        }

        return $data;
    }

    protected function handleAdvisors(Request $request, Extracurricular $extracurricular): void
    {
        if ($request->has('assignments')) {
            $extracurricular->structuralAssignments()->delete();

            foreach ((array) $request->input('assignments', []) as $idx => $asg) {
                if (empty($asg['structural_position_id']) || empty($asg['staff_profile_id'])) {
                    continue;
                }

                StructuralAssignment::create([
                    'assignable_type' => Extracurricular::class,
                    'assignable_id' => $extracurricular->id,
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
