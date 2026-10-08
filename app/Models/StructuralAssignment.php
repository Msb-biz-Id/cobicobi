<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StructuralAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignable_type',
        'assignable_id',
        'structural_position_id',
        'staff_profile_id',
        'custom_title',
        'period_start',
        'period_end',
        'decree_number',
        'is_current',
        'sort_order',
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function assignable(): MorphTo
    {
        return $this->morphTo();
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(StructuralPosition::class, 'structural_position_id');
    }

    public function staffProfile(): BelongsTo
    {
        return $this->belongsTo(StaffProfile::class, 'staff_profile_id');
    }

    public function getDisplayTitleAttribute(): string
    {
        if (!empty($this->custom_title)) {
            return $this->custom_title;
        }

        $posName = $this->position?->name ?? 'Pejabat';
        $entityName = $this->assignable?->name ?? '';

        return "{$posName} {$entityName}";
    }
}
