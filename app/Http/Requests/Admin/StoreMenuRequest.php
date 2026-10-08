<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:120'],
            'url' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'in:standard,dropdown,mega_menu'],
            'mega_columns' => ['nullable', 'integer', 'in:2,3,4'],
            'target' => ['required', 'string', 'in:_self,_blank'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'badge' => ['nullable', 'string', 'max:50'],
            'auto_source' => ['nullable', 'string', 'max:50'],
            'parent_id' => ['nullable', 'integer', 'exists:menus,id'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
