<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstitutionalUnit;
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

class InstitutionalUnitController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');
        $category = (string) $request->query('category', '');

        $units = InstitutionalUnit::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
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

        return Inertia::render('InstitutionalUnits/Index', [
            'units' => $units,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create(): Response
    {
        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'unit'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('InstitutionalUnits/Form', [
            'unit' => null,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateUnit($request);

        DB::transaction(function () use ($request, $validated) {
            $unitData = $this->prepareUnitData($request, $validated);
            $unit = InstitutionalUnit::create($unitData);

            $this->handleAssignments($request, $unit);
        });

        return redirect()->route('admin.institutional-units.index')
            ->with('success', 'Unit/Lembaga berhasil ditambahkan.');
    }

    public function edit(InstitutionalUnit $institutionalUnit): Response
    {
        $institutionalUnit->load([
            'structuralAssignments.position',
            'structuralAssignments.staffProfile',
        ]);

        $positions = StructuralPosition::where('is_active', true)
            ->whereIn('target_scope', ['all', 'unit'])
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'level']);

        $staffList = StaffProfile::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'front_title', 'back_title', 'type', 'nidn', 'nip']);

        return Inertia::render('InstitutionalUnits/Form', [
            'unit' => $institutionalUnit,
            'positions' => $positions,
            'staffList' => $staffList,
        ]);
    }

    public function update(Request $request, InstitutionalUnit $institutionalUnit): RedirectResponse
    {
        $validated = $this->validateUnit($request, $institutionalUnit->id);

        DB::transaction(function () use ($request, $validated, $institutionalUnit) {
            $unitData = $this->prepareUnitData($request, $validated, $institutionalUnit);
            $institutionalUnit->update($unitData);

            $this->handleAssignments($request, $institutionalUnit);
        });

        return redirect()->route('admin.institutional-units.index')
            ->with('success', 'Data Unit/Lembaga berhasil diperbarui.');
    }

    public function destroy(InstitutionalUnit $institutionalUnit): RedirectResponse
    {
        $institutionalUnit->structuralAssignments()->delete();
        $institutionalUnit->delete();

        return redirect()->route('admin.institutional-units.index')
            ->with('success', 'Unit/Lembaga berhasil dihapus.');
    }

    protected function validateUnit(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'category' => ['required', 'string', Rule::in(['upt', 'lembaga', 'biro', 'badan_khusus', 'organisasi', 'rektorat', 'senat'])],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('institutional_units', 'slug')->ignore($id)],
            'code' => ['nullable', 'string', 'max:50'],
            'abbreviation' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'services_overview' => ['nullable', 'string'],
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

    protected function prepareUnitData(Request $request, array $validated, ?InstitutionalUnit $existing = null): array
    {
        $data = [
            'category' => $validated['category'],
            'name' => strip_tags($validated['name']),
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'code' => !empty($validated['code']) ? strip_tags($validated['code']) : null,
            'abbreviation' => !empty($validated['abbreviation']) ? strip_tags($validated['abbreviation']) : null,
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'vision' => HtmlSanitizer::clean($validated['vision'] ?? null),
            'mission' => HtmlSanitizer::clean($validated['mission'] ?? null),
            'services_overview' => HtmlSanitizer::clean($validated['services_overview'] ?? null),
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
        while (InstitutionalUnit::where('slug', $data['slug'])->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists()) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $this->imageUploadService->upload($request->file('logo'), 'units/logos');
        }

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $this->imageUploadService->upload($request->file('cover_image'), 'units/covers');
        }

        return $data;
    }

    protected function handleAssignments(Request $request, InstitutionalUnit $unit): void
    {
        if ($request->has('assignments')) {
            $unit->structuralAssignments()->delete();

            foreach ((array) $request->input('assignments', []) as $idx => $asg) {
                if (empty($asg['structural_position_id']) || empty($asg['staff_profile_id'])) {
                    continue;
                }

                StructuralAssignment::create([
                    'assignable_type' => InstitutionalUnit::class,
                    'assignable_id' => $unit->id,
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
