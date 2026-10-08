<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CampusSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CampusSettingController extends Controller
{
    /**
     * Tampilkan Halaman Konfigurasi Panel Kampus
     */
    public function edit(): Response
    {
        $setting = CampusSetting::getActive();

        return Inertia::render('Campus/Settings', [
            'campusSetting' => $this->presentSetting($setting),
        ]);
    }

    /**
     * Perbarui Konfigurasi Panel Kampus
     */
    public function update(Request $request): RedirectResponse
    {
        $setting = CampusSetting::getActive();

        $data = $request->validate([
            // Sambutan Rektor
            'rector_name' => ['nullable', 'string', 'max:255'],
            'rector_title' => ['nullable', 'string', 'max:255'],
            'rector_quote' => ['nullable', 'string'],
            'rector_speech' => ['nullable', 'string'],
            'rector_video_url' => ['nullable', 'string', 'max:500'],
            'rector_image' => ['nullable'],

            // Hero Slides & Stats
            'hero_slides' => ['nullable', 'array'],
            'hero_stats' => ['nullable', 'array'],

            // Profil Lengkap Kampus
            'about_background' => ['nullable', 'string'],
            'about_image' => ['nullable'],
            'about_vision' => ['nullable', 'string'],
            'about_missions' => ['nullable', 'array'],
            'about_goals' => ['nullable', 'array'],
            'about_development_models' => ['nullable', 'array'],
            'about_development_strategies' => ['nullable', 'array'],
            'about_accreditation' => ['nullable', 'array'],

            // Home Sections
            'home_sections' => ['nullable', 'array'],
        ]);

        // Upload Rector Image
        if ($request->hasFile('rector_image')) {
            if ($setting->rector_image_path && Storage::disk('public')->exists($setting->rector_image_path)) {
                Storage::disk('public')->delete($setting->rector_image_path);
            }
            $data['rector_image_path'] = $request->file('rector_image')->store('campus', 'public');
        } elseif ($request->filled('rector_image') && is_string($request->input('rector_image'))) {
            $val = $request->input('rector_image');
            if (str_starts_with($val, '/storage/')) {
                $val = substr($val, strlen('/storage/'));
            }
            $data['rector_image_path'] = $val;
        }
        unset($data['rector_image']);

        // Upload About Image
        if ($request->hasFile('about_image')) {
            if ($setting->about_image_path && Storage::disk('public')->exists($setting->about_image_path)) {
                Storage::disk('public')->delete($setting->about_image_path);
            }
            $data['about_image_path'] = $request->file('about_image')->store('campus', 'public');
        } elseif ($request->filled('about_image') && is_string($request->input('about_image'))) {
            $val = $request->input('about_image');
            if (str_starts_with($val, '/storage/')) {
                $val = substr($val, strlen('/storage/'));
            }
            $data['about_image_path'] = $val;
        }
        unset($data['about_image']);

        $setting->update($data);

        return back()->with('success', 'Konfigurasi Panel Kampus berhasil diperbarui.');
    }

    private function presentSetting(CampusSetting $setting): array
    {
        return [
            'id' => $setting->id,
            'rector_name' => $setting->rector_name,
            'rector_title' => $setting->rector_title,
            'rector_image_path' => $setting->rector_image_path,
            'rector_image_url' => $setting->rector_image_url,
            'rector_quote' => $setting->rector_quote,
            'rector_speech' => $setting->rector_speech,
            'rector_video_url' => $setting->rector_video_url,
            'hero_slides' => $setting->hero_slides ?: [],
            'hero_stats' => $setting->hero_stats ?: [],
            'about_background' => $setting->about_background,
            'about_image_path' => $setting->about_image_path,
            'about_image_url' => $setting->about_image_url,
            'about_vision' => $setting->about_vision,
            'about_missions' => $setting->about_missions ?: [],
            'about_goals' => $setting->about_goals ?: [],
            'about_development_models' => $setting->about_development_models ?: [],
            'about_development_strategies' => $setting->about_development_strategies ?: [],
            'about_accreditation' => $setting->about_accreditation ?: [],
            'home_sections' => $setting->home_sections ?: [],
        ];
    }
}
