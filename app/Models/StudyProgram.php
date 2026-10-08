<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Storage;

class StudyProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'name',
        'slug',
        'code',
        'abbreviation',
        'degree_level',
        'graduate_title',
        'accreditation',
        'accreditation_number',
        'decree_number',
        'description',
        'vision',
        'mission',
        'career_prospects',
        'curriculum_overview',
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
        'logo_url',
        'cover_url',
        'full_degree_name',
    ];

    protected function casts(): array
    {
        return [
            'career_prospects' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }

    /**
     * Dosen yang mengajar di Program Studi ini.
     */
    public function lecturers(): BelongsToMany
    {
        return $this->belongsToMany(StaffProfile::class, 'study_program_staff')
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order', 'asc');
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

    public function getFullDegreeNameAttribute(): string
    {
        return "{$this->degree_level} {$this->name}";
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
