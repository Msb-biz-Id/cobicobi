<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class StaffProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'slug',
        'front_title',
        'back_title',
        'nidn',
        'nip',
        'gender',
        'faculty',
        'study_program',
        'academic_position',
        'structural_position',
        'employment_status',
        'expertise',
        'bio',
        'education_history',
        'office_address',
        'email',
        'phone',
        'avatar_path',
        'google_scholar_url',
        'google_scholar_id',
        'scopus_id',
        'scopus_url',
        'sinta_id',
        'sinta_url',
        'orcid_id',
        'orcid_url',
        'research_gate_url',
        'linkedin_url',
        'website_url',
        'facebook_url',
        'instagram_url',
        'x_url',
        'tiktok_url',
        'rss_feed_url',
        'total_citations',
        'h_index',
        'i10_index',
        'is_active',
        'is_featured',
        'sort_order',
        'last_synced_at',
    ];

    protected $casts = [
        'expertise' => 'array',
        'education_history' => 'array',
        'total_citations' => 'integer',
        'h_index' => 'integer',
        'i10_index' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
        'last_synced_at' => 'datetime',
    ];

    protected $appends = [
        'full_name_with_titles',
        'avatar_url',
        'type_label',
        'auto_structural_position',
        'advisory_extracurriculars',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function publications(): HasMany
    {
        return $this->hasMany(StaffPublication::class)->orderBy('year', 'desc')->orderBy('id', 'desc');
    }

    /**
     * Riwayat & Amanah Jabatan Struktural di Fakultas, Prodi, atau Unit.
     */
    public function structuralAssignments(): HasMany
    {
        return $this->hasMany(StructuralAssignment::class, 'staff_profile_id')
            ->orderBy('is_current', 'desc')
            ->orderBy('period_start', 'desc');
    }

    /**
     * Jabatan struktural yang aktif saat ini.
     */
    public function activeAssignments(): HasMany
    {
        return $this->hasMany(StructuralAssignment::class, 'staff_profile_id')
            ->where('is_current', true)
            ->with(['position', 'assignable']);
    }

    /**
     * Fakultas tempat dosen bertugas/mengajar.
     */
    public function teachingFaculties(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Faculty::class, 'faculty_staff')
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps();
    }

    /**
     * Program Studi tempat dosen bertugas/mengajar.
     */
    public function teachingStudyPrograms(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(StudyProgram::class, 'study_program_staff')
            ->withPivot(['role', 'sort_order'])
            ->withTimestamps();
    }

    public function getFullNameWithTitlesAttribute(): string
    {
        $parts = [];

        if (!empty($this->front_title)) {
            $parts[] = trim($this->front_title);
        }

        $parts[] = trim($this->name);

        $base = implode(' ', $parts);

        if (!empty($this->back_title)) {
            $base .= ', ' . trim($this->back_title);
        }

        return $base;
    }

    public function getAvatarUrlAttribute(): string
    {
        if (!empty($this->avatar_path)) {
            if (
                str_starts_with($this->avatar_path, 'http://') ||
                str_starts_with($this->avatar_path, 'https://') ||
                str_starts_with($this->avatar_path, '/storage/')
            ) {
                return $this->avatar_path;
            }

            return Storage::url($this->avatar_path);
        }

        // Fallback placeholder with initials
        $nameEncoded = urlencode($this->name ?: 'Civitas');
        return "https://ui-avatars.com/api/?name={$nameEncoded}&background=4f46e5&color=fff&size=256";
    }

    public function getTypeLabelAttribute(): string
    {
        return $this->type === 'dosen' ? 'Dosen' : 'Tenaga Kependidikan';
    }

    public function getAutoStructuralPositionAttribute(): string
    {
        $activeHolders = $this->activeAssignments;
        if ($activeHolders && $activeHolders->isNotEmpty()) {
            return $activeHolders->map(fn($item) => $item->display_title)->implode(' & ');
        }

        return $this->structural_position ?: '';
    }

    public function getAdvisoryExtracurricularsAttribute(): array
    {
        $holders = $this->activeAssignments;
        if (!$holders) {
            return [];
        }

        return $holders
            ->filter(fn ($asg) => $asg->assignable instanceof Extracurricular)
            ->values()
            ->map(fn ($asg) => [
                'position_name' => $asg->position?->name ?? 'Pembina',
                'custom_title' => $asg->custom_title,
                'display_title' => $asg->display_title,
                'ukm_name' => $asg->assignable?->name,
                'ukm_slug' => $asg->assignable?->slug,
                'ukm_category' => $asg->assignable?->category_label,
                'decree_number' => $asg->decree_number,
            ])
            ->toArray();
    }
}
