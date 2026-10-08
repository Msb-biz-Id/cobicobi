<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StructuralPosition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StructuralPositionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = (string) $request->query('search', '');
        $scope = (string) $request->query('scope', '');

        $positions = StructuralPosition::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($scope !== '', function ($query) use ($scope) {
                $query->where('target_scope', $scope);
            })
            ->withCount('assignments')
            ->orderBy('level', 'asc')
            ->orderBy('sort_order', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StructuralPositions/Index', [
            'positions' => $positions,
            'filters' => [
                'search' => $search,
                'scope' => $scope,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:structural_positions,slug'],
            'level' => ['required', 'integer', 'min:1', 'max:5'],
            'target_scope' => ['required', 'string', Rule::in(['all', 'faculty', 'study_program', 'unit', 'extracurricular'])],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $validated['name'] = strip_tags($validated['name']);
        $validated['slug'] = !empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        // Pastikan slug unik
        $originalSlug = $validated['slug'];
        $count = 1;
        while (StructuralPosition::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        $validated['description'] = !empty($validated['description']) ? strip_tags($validated['description']) : null;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        StructuralPosition::create($validated);

        return redirect()->route('admin.structural-positions.index')
            ->with('success', 'Master Jabatan Struktural berhasil ditambahkan.');
    }

    public function update(Request $request, StructuralPosition $structuralPosition): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('structural_positions', 'slug')->ignore($structuralPosition->id)],
            'level' => ['required', 'integer', 'min:1', 'max:5'],
            'target_scope' => ['required', 'string', Rule::in(['all', 'faculty', 'study_program', 'unit', 'extracurricular'])],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $validated['name'] = strip_tags($validated['name']);
        if (!empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $validated['description'] = !empty($validated['description']) ? strip_tags($validated['description']) : null;
        $validated['sort_order'] = $validated['sort_order'] ?? $structuralPosition->sort_order;
        $validated['is_active'] = $request->boolean('is_active', true);

        $structuralPosition->update($validated);

        return redirect()->route('admin.structural-positions.index')
            ->with('success', 'Master Jabatan Struktural berhasil diperbarui.');
    }

    public function destroy(StructuralPosition $structuralPosition): RedirectResponse
    {
        if ($structuralPosition->assignments()->exists()) {
            return redirect()->route('admin.structural-positions.index')
                ->with('error', 'Jabatan tidak dapat dihapus karena masih digunakan dalam riwayat penugasan pejabat.');
        }

        $structuralPosition->delete();

        return redirect()->route('admin.structural-positions.index')
            ->with('success', 'Master Jabatan Struktural berhasil dihapus.');
    }
}
