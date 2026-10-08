<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:announcements,slug'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'target_audience' => ['required', 'string', 'max:100'],
            'issuer' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:published,draft,archived'],
            'is_pinned' => ['nullable', 'boolean'],
            'cover_image_path' => ['nullable', 'string'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'attachments' => ['nullable', 'array'],
            'attachments.*.name' => ['required_with:attachments', 'string', 'max:255'],
            'attachments.*.path' => ['required_with:attachments', 'string'],
            'attachments.*.size' => ['nullable', 'integer'],
            'attachments.*.type' => ['nullable', 'string', 'max:20'],
            'new_files' => ['nullable', 'array'],
            'new_files.*' => ['file', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,7z,jpg,jpeg,png,webp', 'max:500'], // max 500KB per file
        ];
    }
}
