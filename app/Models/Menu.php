<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Menu extends Model
{
    protected $fillable = [
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
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'position' => 'integer',
            'mega_columns' => 'integer',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('position');
    }

    /**
     * Resolve anak-anak menu, baik yang dimasukkan secara manual maupun otomatis dari sumber data dinamis.
     *
     * @return array
     */
    public function getResolvedChildren(): array
    {
        $items = [];

        // 1. Ambil anak-anak manual yang sudah ada di database
        $manualChildren = $this->children()
            ->where('is_active', true)
            ->get();

        foreach ($manualChildren as $child) {
            $items[] = [
                'id' => $child->id,
                'title' => $child->title,
                'url' => $child->url,
                'type' => $child->type ?? 'standard',
                'target' => $child->target ?? '_self',
                'icon' => $child->icon,
                'description' => $child->description,
                'badge' => $child->badge,
                'children' => $child->getResolvedChildren(),
            ];
        }

        // 2. Jika menu ini diset dengan auto_source dinamis, sertakan entitas dari database
        if ($this->auto_source && $this->auto_source !== 'none') {
            $dynamicItems = $this->fetchDynamicSourceItems($this->auto_source);
            $items = array_merge($items, $dynamicItems);
        }

        return $items;
    }

    /**
     * Mengambil item dinamis dari database berdasarkan tipe sumber.
     */
    protected function fetchDynamicSourceItems(string $source): array
    {
        $result = [];

        switch ($source) {
            case 'faculties':
                if (class_exists(Faculty::class)) {
                    $faculties = Faculty::query()
                        ->where('is_active', true)
                        ->orderBy('name')
                        ->get(['id', 'name', 'slug', 'description']);

                    foreach ($faculties as $item) {
                        $result[] = [
                            'id' => 'dyn_fac_' . $item->id,
                            'title' => $item->name,
                            'url' => route('public.faculties.show', $item->slug),
                            'type' => 'standard',
                            'target' => '_self',
                            'icon' => 'GraduationCap',
                            'description' => Str::limit(strip_tags($item->description ?? ''), 60),
                            'badge' => null,
                            'children' => [],
                        ];
                    }
                }
                break;

            case 'study_programs':
                if (class_exists(StudyProgram::class)) {
                    $programs = StudyProgram::query()
                        ->where('is_active', true)
                        ->orderBy('degree')
                        ->orderBy('name')
                        ->get(['id', 'name', 'slug', 'degree', 'accreditation']);

                    foreach ($programs as $item) {
                        $result[] = [
                            'id' => 'dyn_prodi_' . $item->id,
                            'title' => $item->name,
                            'url' => route('public.study-programs.show', $item->slug),
                            'type' => 'standard',
                            'target' => '_self',
                            'icon' => 'BookOpen',
                            'description' => 'Jenjang ' . ($item->degree ?? 'S1') . ' • Akreditasi ' . ($item->accreditation ?? 'Unggul'),
                            'badge' => $item->degree ?? 'S1',
                            'children' => [],
                        ];
                    }
                }
                break;

            case 'institutional_units':
                if (class_exists(InstitutionalUnit::class)) {
                    $units = InstitutionalUnit::query()
                        ->where('is_active', true)
                        ->orderBy('type')
                        ->orderBy('name')
                        ->get(['id', 'name', 'slug', 'type']);

                    foreach ($units as $item) {
                        $result[] = [
                            'id' => 'dyn_unit_' . $item->id,
                            'title' => $item->name,
                            'url' => route('public.institutional-units.show', $item->slug),
                            'type' => 'standard',
                            'target' => '_self',
                            'icon' => 'Building',
                            'description' => $item->type ?? 'Unit Pelaksana Teknis',
                            'badge' => null,
                            'children' => [],
                        ];
                    }
                }
                break;

            case 'facilities':
                if (class_exists(Facility::class)) {
                    $facilities = Facility::query()
                        ->where('is_active', true)
                        ->orderBy('name')
                        ->get(['id', 'name', 'slug', 'category']);

                    foreach ($facilities as $item) {
                        $result[] = [
                            'id' => 'dyn_facil_' . $item->id,
                            'title' => $item->name,
                            'url' => route('public.facilities.show', $item->slug),
                            'type' => 'standard',
                            'target' => '_self',
                            'icon' => 'Sparkles',
                            'description' => $item->category ?? 'Fasilitas Kampus',
                            'badge' => null,
                            'children' => [],
                        ];
                    }
                }
                break;

            case 'extracurriculars':
                if (class_exists(Extracurricular::class)) {
                    $extras = Extracurricular::query()
                        ->where('is_active', true)
                        ->orderBy('name')
                        ->get(['id', 'name', 'slug', 'category']);

                    foreach ($extras as $item) {
                        $result[] = [
                            'id' => 'dyn_extra_' . $item->id,
                            'title' => $item->name,
                            'url' => route('public.extracurriculars.show', $item->slug),
                            'type' => 'standard',
                            'target' => '_self',
                            'icon' => 'Activity',
                            'description' => $item->category ?? 'UKM Mahasiswa',
                            'badge' => null,
                            'children' => [],
                        ];
                    }
                }
                break;

            case 'categories':
                if (class_exists(Category::class)) {
                    $categories = Category::query()
                        ->orderBy('name')
                        ->get(['id', 'name', 'slug']);

                    foreach ($categories as $item) {
                        $result[] = [
                            'id' => 'dyn_cat_' . $item->id,
                            'title' => $item->name,
                            'url' => route('public.categories.show', $item->slug),
                            'type' => 'standard',
                            'target' => '_self',
                            'icon' => 'Tag',
                            'description' => 'Kategori Warta & Artikel',
                            'badge' => null,
                            'children' => [],
                        ];
                    }
                }
                break;
        }

        return $result;
    }
}
