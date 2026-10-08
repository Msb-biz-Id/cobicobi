<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class InstitutionalUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'name',
        'slug',
        'code',
        'abbreviation',
        'description',
        'vision',
        'mission',
        'services_overview',
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
        'category_label',
        'logo_url',
        'cover_url',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function structuralAssignments(): MorphMany
    {
        return $this->morphMany(StructuralAssignment::class, 'assignable')
            ->orderBy('sort_order', 'asc');
    }

    public function currentAssignments(): MorphMany
    {
        return $this->morphMany(StructuralAssignment::class, 'assignable')
            ->where('is_current', true)
            ->with(['position', 'staffProfile'])
            ->orderBy('sort_order', 'asc');
    }

    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'upt' => 'Unit Pelaksana Teknis (UPT)',
            'lembaga' => 'Lembaga / Biro',
            'organisasi' => 'Organisasi & Badan Khusus',
            default => strtoupper($this->category),
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
