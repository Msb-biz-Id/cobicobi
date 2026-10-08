<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UnitPositionHolder extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_unit_id',
        'structural_position_id',
        'staff_profile_id',
        'custom_title',
        'period_start',
        'period_end',
        'decree_number',
        'is_current',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_current' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(OrganizationUnit::class, 'organization_unit_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(StructuralPosition::class, 'structural_position_id');
    }

    public function staffProfile(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class, 'staff_profile_id');
    }

    /**
     * Get official display title (e.g. Dekan Fakultas Ilmu Komputer or Custom Title).
     */
    public function getDisplayTitleAttribute(): string
    {
        if (!empty($this->custom_title)) {
            return $this->custom_title;
        }

        $posName = $this->position?->name ?? 'Pejabat';
        $unitName = $this->unit?->name ?? '';

        return "{$posName} {$unitName}";
    }
}
