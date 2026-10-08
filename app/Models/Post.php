<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'author_name',
        'category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail_path',
        'meta_description',
        'meta_keywords',
        'views_count',
        'status',
        'submitted_for_review_at',
        'reviewed_at',
        'approved_at',
        'reviewed_by',
        'approved_by',
        'editor_id',
        'editor_name',
        'source',
        'source_url',
        'published_at',
    ];

    protected $appends = [
        'thumbnail_url',
        'display_author',
        'display_editor',
    ];

    protected function casts(): array
    {
        return [
            'views_count' => 'integer',
            'submitted_for_review_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if (blank($this->thumbnail_path)) {
            return null;
        }

        if (str_starts_with($this->thumbnail_path, 'http://') || str_starts_with($this->thumbnail_path, 'https://') || str_starts_with($this->thumbnail_path, '/')) {
            return $this->thumbnail_path;
        }

        return Storage::url($this->thumbnail_path);
    }

    public function getDisplayAuthorAttribute(): string
    {
        return $this->author_name ?: ($this->author?->name ?? 'Anonim');
    }

    public function getDisplayEditorAttribute(): ?string
    {
        return $this->editor_name ?: ($this->editor?->name ?? null);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'editor_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function hashtags(): BelongsToMany
    {
        return $this->belongsToMany(Hashtag::class, 'hashtag_post')
            ->withTimestamps();
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(ContentRevision::class, 'revisionable');
    }
}
