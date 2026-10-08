<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'reference_number',
        'category',
        'target_audience',
        'issuer',
        'status',
        'is_pinned',
        'cover_image_path',
        'summary',
        'content',
        'attachments',
        'published_at',
        'expires_at',
        'views_count',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'attachments' => 'array',
        'is_pinned' => 'boolean',
        'views_count' => 'integer',
    ];

    protected $appends = [
        'cover_image_url',
        'is_expired',
        'formatted_published_at',
        'formatted_attachments',
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

    public function getIsExpiredAttribute(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return Carbon::now()->greaterThan($this->expires_at);
    }

    public function getFormattedPublishedAtAttribute(): string
    {
        $date = $this->published_at ?? $this->created_at;

        return $date ? $date->translatedFormat('d F Y, H:i') . ' WIB' : '-';
    }

    public function getFormattedAttachmentsAttribute(): array
    {
        $items = is_array($this->attachments) ? $this->attachments : [];

        return array_map(function ($item, $index) {
            $path = $item['path'] ?? '';
            $url = '';
            if (!empty($path)) {
                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/storage/')) {
                    $url = $path;
                } else {
                    $url = Storage::url($path);
                }
            }

            $sizeBytes = $item['size'] ?? 0;
            $formattedSize = $this->formatFileSize($sizeBytes);

            return [
                'index' => $index,
                'name' => $item['name'] ?? 'Lampiran Dokumen',
                'path' => $path,
                'url' => $url,
                'size_bytes' => $sizeBytes,
                'formatted_size' => $formattedSize,
                'type' => $item['type'] ?? pathinfo($item['name'] ?? '', PATHINFO_EXTENSION) ?: 'file',
                'download_count' => $item['download_count'] ?? 0,
            ];
        }, $items, array_keys($items));
    }

    private function formatFileSize(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $power = min((int) floor(log($bytes, 1024)), count($units) - 1);

        return round($bytes / (1024 ** $power), 2) . ' ' . $units[$power];
    }
}
