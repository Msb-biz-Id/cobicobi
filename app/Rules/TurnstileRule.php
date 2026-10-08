<?php

namespace App\Rules;

use App\Services\TurnstileService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class TurnstileRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $turnstile = app(TurnstileService::class);

        if (!$turnstile->isEnabled()) {
            return;
        }

        // Bypass jika testing environment dan token tidak dikirim
        if (app()->environment('testing') && empty($value)) {
            return;
        }

        $token = is_string($value) ? trim($value) : null;
        $ip = request()->ip();

        if (!$turnstile->verify($token, $ip)) {
            $fail('Verifikasi keamanan Cloudflare Turnstile gagal. Silakan coba kembali.');
        }
    }
}
