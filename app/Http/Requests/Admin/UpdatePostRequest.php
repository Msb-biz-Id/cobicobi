<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $postId = $this->route('post')?->id;

        return [
            'title' => ['required', 'string', 'max:180'],
            'slug' => [
                'required',
                'string',
                'max:200',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('posts', 'slug')->ignore($postId),
            ],
            'excerpt' => ['nullable', 'string', 'max:2000'],
            'content' => ['required', 'string'],
            'thumbnail' => ['nullable'],
            'thumbnail_url' => ['nullable', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'hashtag_ids' => ['nullable', 'array'],
            'hashtag_ids.*' => ['integer', 'exists:hashtags,id'],
            'new_hashtags' => ['nullable', 'array'],
            'new_hashtags.*' => ['string', 'max:50'],
            'status' => ['nullable', 'string', 'in:draft,review,approved,scheduled,published'],
            'published_at' => ['nullable', 'date'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'editor_id' => ['nullable', 'integer', 'exists:users,id'],
            'editor_name' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'source_url' => ['nullable', 'string', 'max:500'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'meta_keywords' => ['nullable', 'string', 'max:1000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $title = (string) $this->input('title', '');
        $slugInput = (string) $this->input('slug', '');

        $this->merge([
            'slug' => Str::slug($slugInput !== '' ? $slugInput : $title),
            'hashtag_ids' => array_values(array_filter((array) $this->input('hashtag_ids', []), fn ($id) => $id !== null && $id !== '')),
        ]);
    }
}
