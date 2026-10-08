<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Rules\TurnstileRule;
use App\Services\TurnstileService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TurnstileAndUploadLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_announcement_file_upload_rejects_files_larger_than_500kb(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        // Berkas 600 KB (melebihi batas 500 KB)
        $oversizedFile = UploadedFile::fake()->create('dokumen_besar.pdf', 600, 'application/pdf');

        $response = $this->actingAs($user)->post(route('announcements.store'), [
            'title' => 'Pengumuman Uji Coba Ukuran Berkas',
            'category' => 'Akademik',
            'target_audience' => 'Semua Civitas',
            'status' => 'published',
            'new_files' => [$oversizedFile],
        ]);

        $response->assertSessionHasErrors('new_files.0');
    }

    public function test_announcement_file_upload_accepts_files_up_to_500kb(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        // Berkas 400 KB (di bawah batas 500 KB)
        $validFile = UploadedFile::fake()->create('dokumen_valid.pdf', 400, 'application/pdf');

        $response = $this->actingAs($user)->post(route('announcements.store'), [
            'title' => 'Pengumuman Berkas Valid 400KB',
            'category' => 'Akademik',
            'target_audience' => 'Semua Civitas',
            'status' => 'published',
            'new_files' => [$validFile],
        ]);

        $response->assertSessionHasNoErrors();
    }

    public function test_media_upload_rejects_files_larger_than_500kb(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        // Gambar 700 KB
        $oversizedImage = UploadedFile::fake()->image('foto_besar.jpg')->size(700);

        $response = $this->actingAs($user)->postJson(route('media.upload'), [
            'file' => $oversizedImage,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('file');
    }

    public function test_turnstile_service_verifies_valid_token(): void
    {
        Config::set('services.turnstile.testing_enabled', true);
        Config::set('services.turnstile.enabled', true);
        Config::set('services.turnstile.secret_key', 'test-secret-key');

        Http::fake([
            'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
                'success' => true,
                'challenge_ts' => now()->toIso8601String(),
                'hostname' => 'localhost',
            ], 200),
        ]);

        $service = new TurnstileService();
        $this->assertTrue($service->verify('valid-test-token', '127.0.0.1'));
    }

    public function test_turnstile_service_rejects_invalid_token(): void
    {
        Config::set('services.turnstile.testing_enabled', true);
        Config::set('services.turnstile.enabled', true);
        Config::set('services.turnstile.secret_key', 'test-secret-key');

        Http::fake([
            'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
                'success' => false,
                'error-codes' => ['invalid-input-response'],
            ], 200),
        ]);

        $service = new TurnstileService();
        $this->assertFalse($service->verify('invalid-token', '127.0.0.1'));
    }

    public function test_turnstile_rule_fails_validation_when_token_is_invalid(): void
    {
        Config::set('services.turnstile.testing_enabled', true);
        Config::set('services.turnstile.enabled', true);
        Config::set('services.turnstile.secret_key', 'real-secret-mock');

        Http::fake([
            'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
                'success' => false,
            ], 200),
        ]);

        $rule = new TurnstileRule();
        $failed = false;

        $rule->validate('cf_turnstile_response', 'bad-token', function ($msg) use (&$failed) {
            $failed = true;
        });

        $this->assertTrue($failed);
    }

    public function test_login_rejects_bruteforce_attempts_without_turnstile_token_when_enabled(): void
    {
        Config::set('services.turnstile.testing_enabled', true);
        Config::set('services.turnstile.enabled', true);
        Config::set('services.turnstile.secret_key', 'test-secret-key');

        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password123',
            // sengaja tanpa cf_turnstile_response untuk mensimulasikan bot brute-force
        ]);

        $response->assertSessionHasErrors('cf_turnstile_response');
        $this->assertGuest();
    }
}
