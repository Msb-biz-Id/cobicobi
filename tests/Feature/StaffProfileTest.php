<?php

namespace Tests\Feature;

use App\Models\StaffProfile;
use App\Models\StaffPublication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_lecturers_directory_can_be_rendered(): void
    {
        StaffProfile::create([
            'name' => 'Dr. Hendra Wijaya',
            'slug' => 'dr-hendra-wijaya',
            'type' => 'dosen',
            'academic_position' => 'Lektor Kepala',
            'faculty' => 'Fakultas Teknik',
            'study_program' => 'Teknik Elektro',
            'facebook_url' => 'https://facebook.com/hendra.wijaya',
            'instagram_url' => 'https://instagram.com/hendrawijaya',
            'x_url' => 'https://x.com/hendraw',
            'tiktok_url' => 'https://tiktok.com/@hendraw.tech',
            'is_active' => true,
        ]);

        $response = $this->get(route('public.lecturers.index'));
        $response->assertStatus(200);
    }

    public function test_public_lecturer_detail_can_be_rendered(): void
    {
        $staff = StaffProfile::create([
            'name' => 'Prof. Maya Putri',
            'slug' => 'prof-maya-putri',
            'type' => 'dosen',
            'front_title' => 'Prof. Dr.',
            'back_title' => 'M.Sc.',
            'academic_position' => 'Guru Besar / Profesor',
            'faculty' => 'Fakultas MIPA',
            'study_program' => 'Matematika',
            'facebook_url' => 'https://facebook.com/profmaya',
            'instagram_url' => 'https://instagram.com/prof_maya',
            'x_url' => 'https://x.com/profmaya',
            'tiktok_url' => 'https://tiktok.com/@profmaya',
            'is_active' => true,
        ]);

        StaffPublication::create([
            'staff_profile_id' => $staff->id,
            'title' => 'Advanced Stochastic Calculus and Machine Learning Applications',
            'year' => 2024,
            'type' => 'journal',
            'source' => 'scholar',
            'citations_count' => 50,
        ]);

        $response = $this->get(route('public.lecturers.show', $staff->slug));
        $response->assertStatus(200);
    }

    public function test_dosen_can_access_and_update_their_own_staff_bio_including_social_media(): void
    {
        $user = User::factory()->create([
            'role' => 'dosen',
            'is_active' => true,
        ]);

        $profile = StaffProfile::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'slug' => 'dosen-test-slug',
            'type' => 'dosen',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->get(route('profile.staff.edit'));
        $response->assertStatus(200);

        $updateResponse = $this->actingAs($user)->put(route('profile.staff.update'), [
            'name' => 'Prof. Dr. Anton Kurnia, Ph.D.',
            'type' => 'dosen',
            'front_title' => 'Prof. Dr.',
            'back_title' => 'Ph.D.',
            'faculty' => 'Fakultas Kedokteran',
            'study_program' => 'Pendidikan Dokter',
            'academic_position' => 'Guru Besar / Profesor',
            'bio' => '<p>Biografi riset kedokteran tropis.</p>',
            'facebook_url' => 'https://facebook.com/profantonkurnia',
            'instagram_url' => 'https://instagram.com/dr_antonkurnia',
            'x_url' => 'https://x.com/profanton',
            'tiktok_url' => 'https://tiktok.com/@profanton_medika',
        ]);

        $updateResponse->assertSessionHasNoErrors();
        $updateResponse->assertRedirect();

        $this->assertDatabaseHas('staff_profiles', [
            'user_id' => $user->id,
            'front_title' => 'Prof. Dr.',
            'facebook_url' => 'https://facebook.com/profantonkurnia',
            'instagram_url' => 'https://instagram.com/dr_antonkurnia',
            'x_url' => 'https://x.com/profanton',
            'tiktok_url' => 'https://tiktok.com/@profanton_medika',
        ]);
    }

    public function test_dosen_can_manage_manual_publications(): void
    {
        $user = User::factory()->create([
            'role' => 'dosen',
            'is_active' => true,
        ]);

        $profile = StaffProfile::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'slug' => 'dosen-karya-slug',
            'type' => 'dosen',
            'is_active' => true,
        ]);

        $storeResponse = $this->actingAs($user)->post(route('profile.staff.publications.store'), [
            'title' => 'Buku Monograf: Panduan Klinis Penanganan Pandemi',
            'authors' => 'Anton Kurnia, Tim Satgas',
            'publication_name' => 'Penerbit Medika Press',
            'year' => 2024,
            'type' => 'book',
            'citations_count' => 12,
        ]);

        $storeResponse->assertRedirect();

        $this->assertDatabaseHas('staff_publications', [
            'staff_profile_id' => $profile->id,
            'title' => 'Buku Monograf: Panduan Klinis Penanganan Pandemi',
            'type' => 'book',
            'source' => 'manual',
        ]);
    }
}
