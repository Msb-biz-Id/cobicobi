<?php

namespace App\Http\Middleware;

use App\Models\WebSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'webSetting' => fn () => $this->sharedWebSetting(),
            'navigationMenus' => fn () => $this->sharedNavigationMenus(),
            'turnstile' => [
                'enabled' => (bool) config('services.turnstile.enabled', false),
                'site_key' => config('services.turnstile.site_key', ''),
            ],
        ];
    }

    private function sharedWebSetting(): ?array
    {
        if (!Schema::hasTable('web_settings')) {
            return null;
        }

        $setting = WebSetting::query()->first();

        if (!$setting) {
            return null;
        }

        return [
            'site_title' => $setting->site_title,
            'slogan' => $setting->slogan,
            'short_description' => $setting->short_description,
            'logo_url' => $setting->logo_url,
            'icon_url' => $setting->icon_url,
            'favicon_url' => $setting->favicon_url,
            'contact_email' => $setting->contact_email,
            'contact_phone' => $setting->contact_phone,
            'whatsapp_number' => $setting->whatsapp_number,
            'address' => $setting->address,
            'facebook_url' => $setting->facebook_url,
            'instagram_url' => $setting->instagram_url,
            'youtube_url' => $setting->youtube_url,
            'tiktok_url' => $setting->tiktok_url,
            'x_url' => $setting->x_url,
            'linkedin_url' => $setting->linkedin_url,
            'threads_url' => $setting->threads_url,
            'theme_typography' => $setting->getResolvedTypography(),
            'theme_colors' => $setting->getResolvedColors(),
            'theme_layout' => $setting->getResolvedLayout(),
        ];
    }

    private function sharedNavigationMenus(): array
    {
        if (!Schema::hasTable('menus')) {
            return [];
        }

        $rootMenus = \App\Models\Menu::query()
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->orderBy('position')
            ->get();

        if ($rootMenus->isEmpty()) {
            return [];
        }

        return $rootMenus->map(function (\App\Models\Menu $menu): array {
            return [
                'id' => $menu->id,
                'title' => $menu->title,
                'url' => $menu->url,
                'type' => $menu->type ?? 'standard',
                'mega_columns' => $menu->mega_columns ?? 3,
                'target' => $menu->target ?? '_self',
                'icon' => $menu->icon,
                'description' => $menu->description,
                'badge' => $menu->badge,
                'auto_source' => $menu->auto_source,
                'children' => $menu->getResolvedChildren(),
            ];
        })->values()->all();
    }
}
