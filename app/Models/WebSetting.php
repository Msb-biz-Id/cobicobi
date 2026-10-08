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
        'theme_typography',
        'theme_colors',
        'theme_layout',
    ];

    protected $casts = [
        'theme_typography' => 'array',
        'theme_colors' => 'array',
        'theme_layout' => 'array',
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

    /**
     * Dapatkan konfigurasi tipografi dengan fallback lengkap
     */
    public function getResolvedTypography(): array
    {
        $default = [
            'font_sans' => 'Plus Jakarta Sans',
            'font_heading' => 'Plus Jakarta Sans',
            'font_mono' => 'ui-monospace, monospace',
            'h1_size' => '3.25rem',
            'h2_size' => '2.25rem',
            'h3_size' => '1.5rem',
            'h4_size' => '1.25rem',
            'body_size' => '1rem',
            'small_size' => '0.875rem',
            'h1_weight' => '800',
            'body_line_height' => '1.65',
        ];

        return array_merge($default, $this->theme_typography ?: []);
    }

    /**
     * Dapatkan konfigurasi palet warna dengan fallback lengkap
     */
    public function getResolvedColors(): array
    {
        $default = [
            'preset' => 'itb_tuban_azure_gold',
            // Primary Scale (ITB / Academic Blue)
            'primary_50' => '#f0f9ff',
            'primary_100' => '#e0f2fe',
            'primary_200' => '#bae6fd',
            'primary_300' => '#7dd3fc',
            'primary_400' => '#38bdf8',
            'primary_500' => '#0284c7', // Base Primary
            'primary_600' => '#0369a1', // Hover Primary
            'primary_700' => '#075985',
            'primary_800' => '#0c4a6e',
            'primary_900' => '#082f49',
            // Secondary / Accent Scale (Warm Gold / Amber)
            'secondary_50' => '#fffbeb',
            'secondary_100' => '#fef3c7',
            'secondary_200' => '#fde68a',
            'secondary_300' => '#fcd34d',
            'secondary_400' => '#fbbf24', // Accent Highlight
            'secondary_500' => '#f59e0b', // Base Secondary / Button CTA
            'secondary_600' => '#d97706', // Hover Secondary
            'secondary_700' => '#b45309',
            // Background & Surface
            'bg_light' => '#f8fafc',
            'bg_dark' => '#070b14',
            'surface_light' => '#ffffff',
            'surface_dark' => '#0f172a',
            'border_light' => '#e2e8f0',
            'border_dark' => '#1e293b',
            'text_main_light' => '#0f172a',
            'text_muted_light' => '#64748b',
            'text_main_dark' => '#f8fafc',
            'text_muted_dark' => '#94a3b8',
        ];

        return array_merge($default, $this->theme_colors ?: []);
    }

    /**
     * Dapatkan konfigurasi layout & container dengan fallback lengkap
     */
    public function getResolvedLayout(): array
    {
        $default = [
            'container_max_width' => '1400px',
            'container_padding_mobile' => '1.5rem',
            'container_padding_desktop' => '2rem',
            'card_radius' => '1.5rem',
            'button_radius' => '1rem',
        ];

        return array_merge($default, $this->theme_layout ?: []);
    }
}
