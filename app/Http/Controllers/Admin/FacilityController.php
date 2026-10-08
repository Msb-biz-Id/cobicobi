<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Services\ImageUploadService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageUploadService
    ) {}

    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');
        $category = (string) $request->query('category', '');

        $facilities = Facility::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('contact_person', 'like', "%{$search}%");
                });
            })
            ->when($category !== '', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Facilities/Index', [
            'facilities' => $facilities,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Facilities/Form', [
            'facility' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateFacility($request);
        $facilityData = $this->prepareFacilityData($request, $validated);

        Facility::create($facilityData);

        return redirect()->route('admin.facilities.index')
            ->with('success', 'Fasilitas kampus berhasil ditambahkan.');
    }

    public function edit(Facility $facility): Response
    {
        return Inertia::render('Facilities/Form', [
            'facility' => $facility,
        ]);
    }

    public function update(Request $request, Facility $facility): RedirectResponse
    {
        $validated = $this->validateFacility($request, $facility->id);
        $facilityData = $this->prepareFacilityData($request, $validated, $facility);

        $facility->update($facilityData);

        return redirect()->route('admin.facilities.index')
            ->with('success', 'Data fasilitas kampus berhasil diperbarui.');
    }

    public function destroy(Facility $facility): RedirectResponse
    {
        $facility->delete();

        return redirect()->route('admin.facilities.index')
            ->with('success', 'Fasilitas kampus berhasil dihapus.');
    }

    protected function validateFacility(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('facilities', 'slug')->ignore($id)],
            'category' => ['required', 'string', Rule::in(['akademik', 'laboratorium', 'olahraga', 'seni_budaya', 'layanan_umum', 'kesehatan_ibadah'])],
            'short_description' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'operational_hours' => ['nullable', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'booking_info' => ['nullable', 'string'],
            'booking_url' => ['nullable', 'url', 'max:500'],
            'primary_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }

    protected function prepareFacilityData(Request $request, array $validated, ?Facility $existing = null): array
    {
        $features = [];
        if (!empty($validated['features'])) {
            $features = array_values(array_filter(array_map('strip_tags', (array) $validated['features'])));
        }

        $data = [
            'name' => strip_tags($validated['name']),
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'category' => $validated['category'],
            'short_description' => !empty($validated['short_description']) ? strip_tags($validated['short_description']) : null,
            'description' => HtmlSanitizer::clean($validated['description'] ?? null),
            'features' => $features,
            'location' => !empty($validated['location']) ? strip_tags($validated['location']) : null,
            'operational_hours' => !empty($validated['operational_hours']) ? strip_tags($validated['operational_hours']) : null,
            'contact_person' => !empty($validated['contact_person']) ? strip_tags($validated['contact_person']) : null,
            'contact_phone' => !empty($validated['contact_phone']) ? strip_tags($validated['contact_phone']) : null,
            'booking_info' => HtmlSanitizer::clean($validated['booking_info'] ?? null),
            'booking_url' => $validated['booking_url'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ];

        // Unik slug
        $originalSlug = $data['slug'];
        $count = 1;
        while (Facility::where('slug', $data['slug'])->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists()) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($request->hasFile('primary_image')) {
            $data['primary_image_path'] = $this->imageUploadService->upload($request->file('primary_image'), 'facilities');
        }

        return $data;
    }
}
