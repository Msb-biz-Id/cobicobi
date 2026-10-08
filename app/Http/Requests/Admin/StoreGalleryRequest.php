<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryRequest extends FormRequest
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
            // Cover album dibatasi maksimal 500 KB
            'cover_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:500'],
            // Multi-foto galeri dibatasi maksimal 500 KB per foto
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:500'],
            'captions' => ['nullable', 'array'],
            'captions.*' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'cover_image.max' => 'Ukuran berkas sampul galeri tidak boleh melebihi 500 KB.',
            'images.*.max' => 'Setiap foto galeri tidak boleh melebihi ukuran maksimal 500 KB.',
            'images.*.image' => 'Berkas yang diunggah harus berupa gambar yang valid (jpeg, png, jpg, webp).',
        ];
    }
}
