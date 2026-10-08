<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'photographer' => ['nullable', 'string', 'max:150'],
            'is_published' => ['boolean'],
            // Cover album dibatasi maksimal 500 KB jika diunggah baru
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:500'],
            // Multi-foto galeri baru dibatasi maksimal 500 KB per foto
            'new_images' => ['nullable', 'array'],
            'new_images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:500'],
            'new_captions' => ['nullable', 'array'],
            'new_captions.*' => ['nullable', 'string', 'max:255'],
            'existing_captions' => ['nullable', 'array'],
            'delete_image_ids' => ['nullable', 'array'],
            'delete_image_ids.*' => ['integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'cover_image.max' => 'Ukuran berkas sampul galeri tidak boleh melebihi 500 KB.',
            'new_images.*.max' => 'Setiap foto baru galeri tidak boleh melebihi ukuran maksimal 500 KB.',
            'new_images.*.image' => 'Berkas yang diunggah harus berupa gambar yang valid (jpeg, png, jpg, webp).',
        ];
    }
}
