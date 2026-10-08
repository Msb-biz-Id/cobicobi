<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\CampusSetting;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampusPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_public_about_page_can_be_accessed(): void
    {
        $response = $this->get(route('public.about'));

        $response->assertStatus(200);
    }

    public function test_admin_can_access_campus_settings_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.campus-settings.edit'));

        $response->assertStatus(200);
    }

    public function test_admin_can_update_campus_settings(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.campus-settings.update'), [
            'rector_name' => 'Prof. Dr. Ir. H. Bambang Sudarmono, M.T.',
            'rector_title' => 'Rektor Universitas Teknologi',
            'rector_quote' => 'Mencetak pemimpin unggul yang berakhlak mulia.',
            'about_vision' => 'Visi kampus baru untuk masa depan.',
            'about_missions' => ['Misi 1', 'Misi 2'],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('campus_settings', [
            'rector_name' => 'Prof. Dr. Ir. H. Bambang Sudarmono, M.T.',
            'rector_title' => 'Rektor Universitas Teknologi',
        ]);
    }
}
