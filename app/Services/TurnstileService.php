<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TurnstileService
{
    /**
     * Memeriksa apakah proteksi Cloudflare Turnstile sedang diaktifkan.
     */
    public function isEnabled(): bool
    {
        if (app()->environment('testing')) {
            return (bool) config('services.turnstile.testing_enabled', false);
        }

        return (bool) config('services.turnstile.enabled', false)
            && !empty(config('services.turnstile.secret_key'));
    }

    /**
     * Mengambil public site key Turnstile untuk widget frontend.
     */
    public function getSiteKey(): string
    {
        return (string) config('services.turnstile.site_key', '');
    }

    /**
     * Memverifikasi token Cloudflare Turnstile ke API Cloudflare.
     */
    public function verify(?string $token, ?string $ip = null): bool
    {
        // 1. Jika dinonaktifkan di sistem, lewati verifikasi
        if (!$this->isEnabled()) {
            return true;
        }

        // 2. Bypass pada environment testing jika token kosong untuk kestabilan automated test
        if (app()->environment('testing') && empty($token)) {
            return true;
        }

        // 3. Jika token kosong pada environment aktif, tolak
        if (empty($token)) {
            return false;
        }

        // 4. Jika menggunakan official dummy keys Cloudflare dalam mode testing/offline dev
        $secret = (string) config('services.turnstile.secret_key');
        if ($secret === '1x0000000000000000000000000000000AA' && ($token === 'XXXX.DUMMY.TOKEN.XXXX' || $token === 'test-token' || app()->environment('local', 'testing'))) {
            // Official Cloudflare Dummy Pass Key
            return true;
        }

        try {
            $response = Http::asForm()
                ->timeout(6)
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $secret,
                    'response' => $token,
                    'remoteip' => $ip ?: request()->ip(),
                ]);

            if (!$response->successful()) {
                Log::warning('Cloudflare Turnstile API HTTP failure', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return false;
            }

            $result = $response->json();
            return (bool) ($result['success'] ?? false);
        } catch (\Throwable $e) {
            Log::error('Cloudflare Turnstile verification exception: ' . $e->getMessage());
            return false;
        }
    }
}
