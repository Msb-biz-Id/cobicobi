<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'cover_image',
        'category',
        'event_date',
        'photographer',
        'is_published',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'views_count' => 'integer',
            'event_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Gallery $gallery): void {
            if (empty($gallery->slug)) {
                $base = Str::slug($gallery->title);
                $slug = $base;
                $counter = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$counter}";
                    $counter++;
                }
                $gallery->slug = $slug;
            }
        });
    }

    public function images(): HasMany
    {
        return $this->hasMany(GalleryImage::class)->orderBy('position');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->event_date
            ? $this->event_date->translatedFormat('d F Y')
            : $this->created_at->translatedFormat('d F Y');
    }
}
