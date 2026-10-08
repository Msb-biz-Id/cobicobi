<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class Extracurricular extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'abbreviation',
        'category',
        'description',
        'vision',
        'mission',
        'achievements',
        'activities_overview',
        'registration_info',
        'registration_url',
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
        'gallery_images',
        'sort_order',
        'is_active',
    ];

    protected $appends = [
        'logo_url',
        'cover_url',
        'category_label',
    ];

    protected function casts(): array
    {
        return [
            'achievements' => 'array',
            'gallery_images' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Riwayat penugasan pembina / pengurus dari master jabatan struktural.
     */
    public function structuralAssignments(): MorphMany
    {
        return $this->morphMany(StructuralAssignment::class, 'assignable')
            ->orderBy('sort_order', 'asc');
    }

    /**
     * Pembina aktif saat ini (dosen/tendik).
     */
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
            'penalaran_keilmuan' => 'Penalaran & Keilmuan',
            'seni_budaya' => 'Seni & Kebudayaan',
            'olahraga' => 'Olahraga & Atletik',
            'keagamaan' => 'Kerohanian & Keagamaan',
            'sosial_kemanusiaan' => 'Sosial & Kemanusiaan',
            default => ucfirst(str_replace('_', ' ', $this->category)),
        };
    }

    public function getLogoUrlAttribute(): string
    {
        if (blank($this->logo_path)) {
            return "https://ui-avatars.com/api/?name=" . urlencode($this->abbreviation ?: $this->name) . "&background=e11d48&color=fff";
        }

        if (str_starts_with($this->logo_path, 'http')) {
            return $this->logo_path;
        }

        return Storage::url($this->logo_path);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->cover_url;
    }

    public function getCoverUrlAttribute(): ?string
    {
        if (blank($this->cover_image_path)) {
            return null;
        }

        if (str_starts_with($this->cover_image_path, 'http') || str_starts_with($this->cover_image_path, '/')) {
            return $this->cover_image_path;
        }

        return Storage::url($this->cover_image_path);
    }
}
