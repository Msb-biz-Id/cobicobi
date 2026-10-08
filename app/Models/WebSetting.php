<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class WebSetting extends Model
{
    protected $fillable = [
        'site_title',
        'slogan',
        'short_description',
        'meta_description',
        'meta_keywords',
        'meta_thumbnail_path',
        'logo_path',
        'icon_path',
        'favicon_path',
        'contact_email',
        'contact_phone',
        'whatsapp_number',
        'address',
        'city',
        'province',
        'country',
        'postal_code',
        'google_maps_url',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'tiktok_url',
        'x_url',
        'linkedin_url',
        'threads_url',
    ];

    protected $appends = [
        'logo_url',
        'icon_url',
        'favicon_url',
        'meta_thumbnail_url',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        if (blank($this->logo_path)) {
            return null;
        }
        if (str_starts_with($this->logo_path, 'http://') || str_starts_with($this->logo_path, 'https://') || str_starts_with($this->logo_path, '/storage/')) {
            return $this->logo_path;
        }
        return Storage::url($this->logo_path);
    }

    public function getIconUrlAttribute(): ?string
    {
        if (blank($this->icon_path)) {
            return null;
        }
        if (str_starts_with($this->icon_path, 'http://') || str_starts_with($this->icon_path, 'https://') || str_starts_with($this->icon_path, '/storage/')) {
            return $this->icon_path;
        }
        return Storage::url($this->icon_path);
    }

    public function getFaviconUrlAttribute(): ?string
    {
        if (blank($this->favicon_path)) {
            return null;
        }
        if (str_starts_with($this->favicon_path, 'http://') || str_starts_with($this->favicon_path, 'https://') || str_starts_with($this->favicon_path, '/storage/')) {
            return $this->favicon_path;
        }
        return Storage::url($this->favicon_path);
    }

    public function getMetaThumbnailUrlAttribute(): ?string
    {
        if (blank($this->meta_thumbnail_path)) {
            return null;
        }
        if (str_starts_with($this->meta_thumbnail_path, 'http://') || str_starts_with($this->meta_thumbnail_path, 'https://') || str_starts_with($this->meta_thumbnail_path, '/storage/')) {
            return $this->meta_thumbnail_path;
        }
        return Storage::url($this->meta_thumbnail_path);
    }
}
