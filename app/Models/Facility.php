<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'short_description',
        'description',
        'features',
        'location',
        'operational_hours',
        'contact_person',
        'contact_phone',
        'booking_info',
        'booking_url',
        'primary_image_path',
        'gallery_images',
        'sort_order',
        'is_active',
    ];

    protected $appends = [
        'primary_image_url',
        'image_url',
        'category_label',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'gallery_images' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'akademik' => 'Akademik & Perkuliahan',
            'laboratorium' => 'Laboratorium & Riset',
            'olahraga' => 'Olahraga & Kebugaran',
            'seni_budaya' => 'Seni & Kebudayaan',
            'layanan_umum' => 'Layanan Publik & Asrama',
            'kesehatan_ibadah' => 'Kesehatan & Ibadah',
            default => ucfirst(str_replace('_', ' ', $this->category ?? '')),
        };
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->primary_image_url;
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        if (blank($this->primary_image_path)) {
            return null;
        }

        if (str_starts_with($this->primary_image_path, 'http') || str_starts_with($this->primary_image_path, '/')) {
            return $this->primary_image_path;
        }

        return Storage::url($this->primary_image_path);
    }
}
