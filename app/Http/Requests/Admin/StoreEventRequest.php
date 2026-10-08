<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:events,slug'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'category' => ['nullable', 'string', 'max:100'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:published,draft,scheduled,archived,cancelled'],
            'published_at' => ['nullable', 'date'],
            'hashtag_ids' => ['nullable', 'array'],
            'hashtag_ids.*' => ['integer', 'exists:hashtags,id'],
            'new_hashtags' => ['nullable', 'array'],
            'new_hashtags.*' => ['string', 'max:50'],
            'cover_image_path' => ['nullable', 'string'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'event_type' => ['required', 'in:offline,online,hybrid'],
            'venue_name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'maps_url' => ['nullable', 'string'],
            'registration_type' => ['required', 'in:free,paid,invite_only'],
            'price' => ['nullable', 'string', 'max:100'],
            'registration_url' => ['nullable', 'string', 'max:1000'],
            'registration_button_label' => ['nullable', 'string', 'max:100'],
            'registration_deadline' => ['nullable', 'date'],
            'quota' => ['nullable', 'integer', 'min:0'],
            'sponsors' => ['nullable', 'array'],
            'sponsors.*.name' => ['required_with:sponsors', 'string', 'max:255'],
            'sponsors.*.type' => ['nullable', 'string', 'max:100'],
            'sponsors.*.logo_url' => ['nullable', 'string'],
            'sponsors.*.website_url' => ['nullable', 'string', 'max:500'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
        ];
    }
}
