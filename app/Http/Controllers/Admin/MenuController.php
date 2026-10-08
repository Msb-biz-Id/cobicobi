<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderMenuRequest;
use App\Http\Requests\Admin\StoreMenuRequest;
use App\Http\Requests\Admin\UpdateMenuRequest;
use App\Models\Category;
use App\Models\Extracurricular;
use App\Models\Facility;
use App\Models\Faculty;
use App\Models\Gallery;
use App\Models\InstitutionalUnit;
use App\Models\Menu;
use App\Models\Page;
use App\Models\StudyProgram;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(): Response
    {
        $menus = Menu::query()
            ->orderBy('parent_id')
            ->orderBy('position')
            ->get([
                'id',
                'title',
                'url',
                'type',
                'mega_columns',
                'target',
                'icon',
                'description',
                'badge',
                'auto_source',
                'parent_id',
                'position',
                'is_active',
            ]);

        // Sumber konten sistem untuk 1-Click Quick Add
        $systemSources = [
            'presets' => [
                ['title' => 'Beranda', 'url' => '/', 'icon' => 'Home', 'badge' => null, 'description' => 'Halaman Utama Portal'],
                ['title' => 'Fakultas', 'url' => '/fakultas', 'icon' => 'Building2', 'badge' => null, 'description' => 'Direktori Fakultas Kampus'],
                ['title' => 'Program Studi', 'url' => '/program-studi', 'icon' => 'Library', 'badge' => null, 'description' => 'Seluruh Program Studi & Jenjang'],
                ['title' => 'Unit & UPT', 'url' => '/unit', 'icon' => 'Network', 'badge' => null, 'description' => 'Biro, Lembaga, dan UPT'],
                ['title' => 'Fasilitas Kampus', 'url' => '/fasilitas', 'icon' => 'Landmark', 'badge' => null, 'description' => 'Sarana & Prasarana Kampus'],
                ['title' => 'Ekstrakurikuler (UKM)', 'url' => '/ekstrakurikuler', 'icon' => 'Compass', 'badge' => null, 'description' => 'Unit Kegiatan Mahasiswa'],
                ['title' => 'Dosen & Tendik', 'url' => '/dosen-dan-tendik', 'icon' => 'GraduationCap', 'badge' => null, 'description' => 'Direktori Civitas Akademika'],
                ['title' => 'Galeri & Lensa Kampus', 'url' => '/galeri', 'icon' => 'Images', 'badge' => 'Baru', 'description' => 'Dokumentasi Visual & Kegiatan'],
                ['title' => 'Berita & Warta', 'url' => '/berita', 'icon' => 'BookCopy', 'badge' => null, 'description' => 'Kabar & Kabar Terkini'],
                ['title' => 'Pengumuman Resmi', 'url' => '/pengumuman', 'icon' => 'Megaphone', 'badge' => null, 'description' => 'Edaran & Unduhan Dokumen'],
                ['title' => 'Agenda & Kegiatan', 'url' => '/agenda', 'icon' => 'Calendar', 'badge' => null, 'description' => 'Jadwal Acara & Registrasi'],
                ['title' => 'Kontak & Informasi', 'url' => '/kontak', 'icon' => 'Phone', 'badge' => null, 'description' => 'Hubungi Layanan Kampus'],
            ],
            'faculties' => Faculty::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->map(fn ($f) => [
                    'id' => $f->id,
                    'title' => $f->name,
                    'url' => "/fakultas/{$f->slug}",
                    'icon' => 'Building2',
                    'badge' => null,
                ]),
            'studyPrograms' => StudyProgram::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'degree'])
                ->map(fn ($sp) => [
                    'id' => $sp->id,
                    'title' => $sp->name,
                    'url' => "/program-studi/{$sp->slug}",
                    'icon' => 'BookOpen',
                    'badge' => $sp->degree ?? 'S1',
                ]),
            'institutionalUnits' => InstitutionalUnit::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'type'])
                ->map(fn ($u) => [
                    'id' => $u->id,
                    'title' => $u->name,
                    'url' => "/unit/{$u->slug}",
                    'icon' => 'Network',
                    'badge' => null,
                ]),
            'facilities' => Facility::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'category'])
                ->map(fn ($fc) => [
                    'id' => $fc->id,
                    'title' => $fc->name,
                    'url' => "/fasilitas/{$fc->slug}",
                    'icon' => 'Landmark',
                    'badge' => $fc->category,
                ]),
            'extracurriculars' => Extracurricular::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'category'])
                ->map(fn ($ex) => [
                    'id' => $ex->id,
                    'title' => $ex->name,
                    'url' => "/ekstrakurikuler/{$ex->slug}",
                    'icon' => 'Compass',
                    'badge' => $ex->category,
                ]),
            'pages' => Page::query()
                ->where('is_published', true)
                ->orderBy('title')
                ->get(['id', 'title', 'slug'])
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'title' => $p->title,
                    'url' => "/laman/{$p->slug}",
                    'icon' => 'FileText',
                    'badge' => null,
                ]),
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'title' => $c->name,
                    'url' => "/kategori/{$c->slug}",
                    'icon' => 'Tag',
                    'badge' => null,
                ]),
            'galleries' => Gallery::query()
                ->published()
                ->latest('id')
                ->limit(10)
                ->get(['id', 'title', 'slug', 'category'])
                ->map(fn ($g) => [
                    'id' => $g->id,
                    'title' => $g->title,
                    'url' => "/galeri/{$g->slug}",
                    'icon' => 'Images',
                    'badge' => $g->category,
                ]),
        ];

        return Inertia::render('Menus/Index', [
            'menuTree' => $this->buildTree($menus),
            'menuOptions' => $menus->map(fn (Menu $menu): array => [
                'id' => $menu->id,
                'title' => $menu->title,
                'parent_id' => $menu->parent_id,
            ])->values()->all(),
            'systemSources' => $systemSources,
        ]);
    }

    public function store(StoreMenuRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['position'] = $this->nextPosition($validated['parent_id'] ?? null);
        $validated['url'] = $this->nullableString($validated['url'] ?? null);
        $validated['icon'] = $this->nullableString($validated['icon'] ?? null);
        $validated['description'] = $this->nullableString($validated['description'] ?? null);
        $validated['badge'] = $this->nullableString($validated['badge'] ?? null);
        $validated['auto_source'] = $this->nullableString($validated['auto_source'] ?? null);
        $validated['type'] = $validated['type'] ?? 'standard';
        $validated['mega_columns'] = (int) ($validated['mega_columns'] ?? 3);

        Menu::create($validated);

        return back()->with('success', 'Menu navigasi berhasil ditambahkan.');
    }

    /**
     * Menambahkan banyak item menu sekaligus dari konten terpilih (1-Click Quick Add).
     */
    public function batchStore(Request $request): RedirectResponse
    {
        $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.title' => ['required', 'string', 'max:120'],
            'items.*.url' => ['required', 'string', 'max:255'],
            'items.*.icon' => ['nullable', 'string', 'max:100'],
            'items.*.badge' => ['nullable', 'string', 'max:50'],
            'items.*.description' => ['nullable', 'string', 'max:255'],
            'parent_id' => ['nullable', 'integer', 'exists:menus,id'],
        ]);

        $parentId = $request->input('parent_id') ? (int) $request->input('parent_id') : null;
        $items = $request->input('items', []);

        DB::transaction(function () use ($items, $parentId) {
            foreach ($items as $item) {
                $pos = $this->nextPosition($parentId);
                Menu::create([
                    'title' => $item['title'],
                    'url' => $item['url'],
                    'type' => 'standard',
                    'target' => '_self',
                    'icon' => !empty($item['icon']) ? $item['icon'] : null,
                    'badge' => !empty($item['badge']) ? $item['badge'] : null,
                    'description' => !empty($item['description']) ? $item['description'] : null,
                    'parent_id' => $parentId,
                    'position' => $pos,
                    'is_active' => true,
                ]);
            }
        });

        return back()->with('success', count($items) . ' item berhasil ditambahkan ke menu navigasi.');
    }

    public function update(UpdateMenuRequest $request, Menu $menu): RedirectResponse
    {
        $validated = $request->validated();
        $newParentId = $validated['parent_id'] ?? null;

        if ($this->isDescendant($menu->id, $newParentId)) {
            return back()->with('error', 'Parent menu tidak valid.');
        }

        if ($newParentId !== $menu->parent_id) {
            $validated['position'] = $this->nextPosition($newParentId);
        }

        $validated['url'] = $this->nullableString($validated['url'] ?? null);
        $validated['icon'] = $this->nullableString($validated['icon'] ?? null);
        $validated['description'] = $this->nullableString($validated['description'] ?? null);
        $validated['badge'] = $this->nullableString($validated['badge'] ?? null);
        $validated['auto_source'] = $this->nullableString($validated['auto_source'] ?? null);
        $validated['type'] = $validated['type'] ?? 'standard';
        $validated['mega_columns'] = (int) ($validated['mega_columns'] ?? 3);

        $menu->update($validated);

        return back()->with('success', 'Menu navigasi berhasil diperbarui.');
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        $menu->delete();

        return back()->with('success', 'Menu berhasil dihapus.');
    }

    public function reorder(ReorderMenuRequest $request): RedirectResponse
    {
        $items = collect($request->validated('items'));

        if ($this->hasCycle($items)) {
            return back()->with('error', 'Struktur menu tidak valid karena membentuk loop.');
        }

        DB::transaction(function () use ($items): void {
            foreach ($items as $item) {
                Menu::query()
                    ->whereKey($item['id'])
                    ->update([
                        'parent_id' => $item['parent_id'],
                        'position' => $item['position'],
                    ]);
            }
        });

        return back()->with('success', 'Urutan struktur menu berhasil disimpan.');
    }

    private function nextPosition(?int $parentId): int
    {
        $maxPosition = Menu::query()
            ->where('parent_id', $parentId)
            ->max('position');

        return ($maxPosition ?? -1) + 1;
    }

    private function nullableString(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    private function hasCycle(Collection $items): bool
    {
        $parentById = $items
            ->mapWithKeys(fn (array $item) => [(int) $item['id'] => $item['parent_id'] ? (int) $item['parent_id'] : null])
            ->all();

        foreach (array_keys($parentById) as $id) {
            $seen = [];
            $current = $id;

            while ($current !== null && array_key_exists($current, $parentById)) {
                if (in_array($current, $seen, true)) {
                    return true;
                }

                $seen[] = $current;
                $current = $parentById[$current];
            }
        }

        return false;
    }

    private function isDescendant(int $menuId, ?int $targetParentId): bool
    {
        if ($targetParentId === null) {
            return false;
        }

        if ($menuId === $targetParentId) {
            return true;
        }

        $currentParent = Menu::query()->whereKey($targetParentId)->value('parent_id');

        while ($currentParent !== null) {
            if ((int) $currentParent === $menuId) {
                return true;
            }

            $currentParent = Menu::query()->whereKey($currentParent)->value('parent_id');
        }

        return false;
    }

    private function buildTree(Collection $menus, ?int $parentId = null): array
    {
        return $menus
            ->filter(fn (Menu $menu) => $menu->parent_id === $parentId)
            ->sortBy('position')
            ->values()
            ->map(fn (Menu $menu): array => [
                'id' => $menu->id,
                'title' => $menu->title,
                'url' => $menu->url,
                'type' => $menu->type ?? 'standard',
                'mega_columns' => $menu->mega_columns ?? 3,
                'target' => $menu->target,
                'icon' => $menu->icon,
                'description' => $menu->description,
                'badge' => $menu->badge,
                'auto_source' => $menu->auto_source,
                'parent_id' => $menu->parent_id,
                'position' => $menu->position,
                'is_active' => $menu->is_active,
                'children' => $this->buildTree($menus, $menu->id),
            ])
            ->all();
    }
}
