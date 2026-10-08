<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'category',
        'organizer',
        'status',
        'cover_image_path',
        'summary',
        'description',
        'start_date',
        'end_date',
        'event_type',
        'venue_name',
        'address',
        'maps_url',
        'registration_type',
        'price',
        'registration_url',
        'registration_button_label',
        'registration_deadline',
        'quota',
        'sponsors',
        'contact_name',
        'contact_phone',
        'contact_email',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'registration_deadline' => 'datetime',
        'sponsors' => 'array',
        'quota' => 'integer',
    ];

    protected $appends = [
        'cover_image_url',
        'maps_embed_url',
        'is_registration_open',
        'is_past',
        'formatted_date_range',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        if (blank($this->cover_image_path)) {
            return null;
        }

        if (
            str_starts_with($this->cover_image_path, 'http://') ||
            str_starts_with($this->cover_image_path, 'https://') ||
            str_starts_with($this->cover_image_path, '/storage/')
        ) {
            return $this->cover_image_path;
        }

        return Storage::url($this->cover_image_path);
    }

    /**
     * Auto generate Google Maps Embed URL from maps_url, iframe, or venue/address query.
     */
    public function getMapsEmbedUrlAttribute(): ?string
    {
        $input = trim((string) $this->maps_url);

        // 1. If user entered raw iframe embed code
        if (!empty($input) && preg_match('/src=["\']([^"\']+)["\']/', $input, $match)) {
            return $match[1];
        }

        // 2. If it's already an embed URL
        if (!empty($input) && str_contains($input, 'google.com/maps/embed')) {
            return $input;
        }

        // 3. If it's a direct Google Maps URL or search link
        if (!empty($input)) {
            // Extract query from maps URL or use as search term
            if (str_contains($input, 'q=')) {
                $parts = parse_url($input);
                if (isset($parts['query'])) {
                    parse_str($parts['query'], $queryArr);
                    if (!empty($queryArr['q'])) {
                        return 'https://maps.google.com/maps?q=' . urlencode($queryArr['q']) . '&t=&z=15&ie=UTF8&iwloc=&output=embed';
                    }
                }
            }
            // General maps URL fallback query
            return 'https://maps.google.com/maps?q=' . urlencode($input) . '&t=&z=15&ie=UTF8&iwloc=&output=embed';
        }

        // 4. Auto-generate from venue_name and address if maps_url is not provided
        $locationQuery = trim(($this->venue_name ?? '') . ' ' . ($this->address ?? ''));
        if (!empty($locationQuery) && $this->event_type !== 'online') {
            return 'https://maps.google.com/maps?q=' . urlencode($locationQuery) . '&t=&z=15&ie=UTF8&iwloc=&output=embed';
        }

        return null;
    }

    public function getIsRegistrationOpenAttribute(): bool
    {
        if (blank($this->registration_url)) {
            return false;
        }

        if ($this->registration_deadline) {
            return Carbon::now()->lessThanOrEqualTo($this->registration_deadline);
        }

        if ($this->start_date) {
            return Carbon::now()->lessThanOrEqualTo($this->start_date);
        }

        return true;
    }

    public function getIsPastAttribute(): bool
    {
        $compareDate = $this->end_date ?? $this->start_date;
        if (!$compareDate) {
            return false;
        }

        return Carbon::now()->greaterThan($compareDate);
    }

    public function getFormattedDateRangeAttribute(): string
    {
        if (!$this->start_date) {
            return '-';
        }

        if (!$this->end_date || $this->start_date->isSameDay($this->end_date)) {
            return $this->start_date->translatedFormat('d F Y, H:i') . ($this->end_date ? ' - ' . $this->end_date->format('H:i') . ' WIB' : ' WIB');
        }

        return $this->start_date->translatedFormat('d M Y, H:i') . ' - ' . $this->end_date->translatedFormat('d M Y, H:i') . ' WIB';
    }
}
