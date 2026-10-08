<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class OrganizationUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'type',
        'name',
        'slug',
        'code',
        'abbreviation',
        'degree_level',
        'accreditation',
        'accreditation_number',
        'decree_number',
        'graduate_title',
        'description',
        'vision',
        'mission',
        'career_prospects',
        'facebook_url',
        'instagram_url',
        'x_url',
        'tiktok_url',
        'youtube_url',
        'website_url',
        'email',
        'phone',
        'office_location',
        'logo_path',
        'cover_image_path',
        'sort_order',
        'is_active',
    ];

    protected $appends = [
        'type_label',
        'logo_url',
        'cover_url',
    ];

    protected function casts(): array
    {
        return [
            'career_prospects' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order', 'asc');
    }

    public function positionHolders(): HasMany
    {
        return $this->hasMany(UnitPositionHolder::class, 'organization_unit_id')
            ->orderBy('sort_order', 'asc');
    }

    public function currentHolders(): HasMany
    {
        return $this->hasMany(UnitPositionHolder::class, 'organization_unit_id')
            ->where('is_current', true)
            ->with(['position', 'staffProfile'])
            ->orderBy('sort_order', 'asc');
    }

    /**
     * Dosen yang mengajar di Fakultas / Prodi ini (Many-to-Many).
     */
    public function lecturers(): BelongsToMany
    {
        return $this->belongsToMany(StaffProfile::class, 'organization_unit_staff')
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order', 'asc');
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'fakultas' => 'Fakultas',
            'jurusan' => 'Jurusan / Departemen',
            'prodi' => 'Program Studi',
            'upt' => 'Unit Pelaksana Teknis (UPT)',
            'lembaga' => 'Lembaga / Biro',
            'organisasi' => 'Organisasi & Lembaga Khusus',
            default => ucfirst($this->type),
        };
    }

    public function getLogoUrlAttribute(): string
    {
        if (blank($this->logo_path)) {
            return "https://ui-avatars.com/api/?name=" . urlencode($this->abbreviation ?: $this->name) . "&background=4f46e5&color=fff";
        }

        if (str_starts_with($this->logo_path, 'http')) {
            return $this->logo_path;
        }

        return Storage::url($this->logo_path);
    }

    public function getCoverUrlAttribute(): ?string
    {
        if (blank($this->cover_image_path)) {
            return null;
        }

        if (str_starts_with($this->cover_image_path, 'http')) {
            return $this->cover_image_path;
        }

        return Storage::url($this->cover_image_path);
    }
}
