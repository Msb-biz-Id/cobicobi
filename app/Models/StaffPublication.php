<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffPublication extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_profile_id',
        'title',
        'authors',
        'publication_name',
        'year',
        'type',
        'source',
        'doi',
        'url',
        'citations_count',
        'description',
        'is_featured',
    ];

    protected $casts = [
        'year' => 'integer',
        'citations_count' => 'integer',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'type_label',
        'source_label',
    ];

    public function staffProfile(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class);
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'journal' => 'Jurnal Ilmiah',
            'conference' => 'Prosiding Konferensi',
            'book' => 'Buku / Monograf',
            'patent' => 'Paten / HKI',
            'community_service' => 'Pengabdian Masyarakat',
            default => 'Lainnya',
        };
    }

    public function getSourceLabelAttribute(): string
    {
        return match ($this->source) {
            'scholar' => 'Google Scholar',
            'rss' => 'RSS Feed',
            default => 'Manual',
        };
    }
}
