<?php

namespace Tests\Feature;

use App\Models\Faculty;
use App\Models\InstitutionalUnit;
use App\Models\StaffProfile;
use App\Models\StructuralPosition;
use App\Models\StudyProgram;
use App\Models\User;
use Database\Seeders\AcademicStructureSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\StaffProfileSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcademicStructureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(StaffProfileSeeder::class);
        $this->seed(AcademicStructureSeeder::class);
    }

    public function test_public_faculties_and_detail_page_can_be_accessed(): void
    {
        $faculty = Faculty::where('slug', 'fakultas-ilmu-komputer-dan-rekayasa-sistem')->first();
        $this->assertNotNull($faculty);

        $response = $this->get('/fakultas');
        $response->assertStatus(200);

        $responseDetail = $this->get("/fakultas/{$faculty->slug}");
        $responseDetail->assertStatus(200);
    }

    public function test_public_study_programs_and_standalone_prodi_can_be_accessed(): void
    {
        $ti = StudyProgram::where('slug', 's1-teknik-informatika')->first();
        $this->assertNotNull($ti);

        // Uji Prodi di bawah Fakultas
        $responseTi = $this->get("/program-studi/{$ti->slug}");
        $responseTi->assertStatus(200);

        // Uji Prodi Mandiri (Tanpa Fakultas)
        $rpla = StudyProgram::where('slug', 'd3-rekayasa-perangkat-lunak-aplikasi')->first();
        $this->assertNotNull($rpla);
        $this->assertNull($rpla->faculty_id);

        $responseRpla = $this->get("/program-studi/{$rpla->slug}");
        $responseRpla->assertStatus(200);
    }

    public function test_public_institutional_units_can_be_accessed(): void
    {
        $unit = InstitutionalUnit::where('slug', 'upt-perpustakaan-dan-literasi-digital')->first();
        $this->assertNotNull($unit);

        $response = $this->get('/unit');
        $response->assertStatus(200);

        $responseDetail = $this->get("/unit/{$unit->slug}");
        $responseDetail->assertStatus(200);
    }

    public function test_lecturer_auto_structural_position_reflects_active_assignments(): void
    {
        $lecturer = StaffProfile::first();
        $this->assertNotNull($lecturer);

        $autoPosition = $lecturer->auto_structural_position;
        $this->assertIsString($autoPosition);
    }

    public function test_admin_can_access_structural_positions_index(): void
    {
        $superadmin = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $response = $this->actingAs($superadmin)->get('/admin/jabatan-struktural');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_faculties_and_study_programs_index(): void
    {
        $superadmin = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $responseFac = $this->actingAs($superadmin)->get('/admin/fakultas');
        $responseFac->assertStatus(200);

        $responseProdi = $this->actingAs($superadmin)->get('/admin/program-studi');
        $responseProdi->assertStatus(200);

        $responseUnit = $this->actingAs($superadmin)->get('/admin/unit-lembaga');
        $responseUnit->assertStatus(200);
    }
}
