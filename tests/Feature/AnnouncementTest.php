<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnnouncementTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_announcements_page_can_be_rendered(): void
    {
        Announcement::create([
            'title' => 'Pengumuman Ujian Akhir Semester Genap',
            'slug' => 'pengumuman-ujian-akhir-semester-genap',
            'reference_number' => '001/AKAD/2026',
            'category' => 'Akademik',
            'target_audience' => 'Mahasiswa',
            'issuer' => 'BAAK',
            'status' => 'published',
            'content' => '<p>Konten pengumuman ujian akhir.</p>',
            'published_at' => now(),
        ]);

        $response = $this->get(route('public.announcements.index'));
        $response->assertStatus(200);
    }

    public function test_public_announcement_detail_can_be_rendered(): void
    {
        $announcement = Announcement::create([
            'title' => 'Pengumuman Beasiswa Prestasi 2026',
            'slug' => 'pengumuman-beasiswa-prestasi-2026',
            'reference_number' => '002/BEA/2026',
            'category' => 'Beasiswa',
            'target_audience' => 'Mahasiswa',
            'issuer' => 'Kemahasiswaan',
            'status' => 'published',
            'content' => '<p>Konten beasiswa prestasi.</p>',
            'published_at' => now(),
        ]);

        $response = $this->get(route('public.announcements.show', $announcement->slug));
        $response->assertStatus(200);
    }

    public function test_attachment_download_and_counter_increment(): void
    {
        Storage::fake('public');
        $dummyPath = 'announcements/attachments/pedoman_beasiswa.pdf';
        Storage::disk('public')->put($dummyPath, 'Dummy PDF content for testing');

        $announcement = Announcement::create([
            'title' => 'Surat Edaran Panduan Beasiswa',
            'slug' => 'surat-edaran-panduan-beasiswa',
            'reference_number' => '003/EDR/2026',
            'category' => 'Beasiswa',
            'target_audience' => 'Mahasiswa',
            'issuer' => 'Rektorat',
            'status' => 'published',
            'content' => '<p>Silakan unduh dokumen panduan.</p>',
            'attachments' => [
                [
                    'name' => 'Pedoman_Beasiswa.pdf',
                    'path' => $dummyPath,
                    'size' => 1024,
                    'type' => 'pdf',
                    'download_count' => 0,
                ],
            ],
            'published_at' => now(),
        ]);

        $response = $this->get(route('announcements.download', [$announcement->slug, 0]));

        $response->assertStatus(200);
        $response->assertDownload('Pedoman_Beasiswa.pdf');

        $announcement->refresh();
        $this->assertEquals(1, $announcement->attachments[0]['download_count']);
    }

    public function test_admin_can_create_announcement_with_file_upload(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $file = UploadedFile::fake()->create('SK_Rektor_2026.pdf', 500, 'application/pdf');

        $response = $this->actingAs($admin)->post(route('announcements.store'), [
            'title' => 'SK Rektor tentang Kalender Akademik 2026',
            'reference_number' => '004/SK/REK/2026',
            'category' => 'Akademik',
            'target_audience' => 'Semua Civitas',
            'issuer' => 'Sekretariat Rektorat',
            'status' => 'published',
            'content' => '<p>Keputusan Rektor mengenai kalender akademik.</p>',
            'new_files' => [$file],
        ]);

        $response->assertRedirect();

        $announcement = Announcement::where('reference_number', '004/SK/REK/2026')->first();
        $this->assertNotNull($announcement);
        $this->assertCount(1, $announcement->attachments);
        $this->assertEquals('SK_Rektor_2026.pdf', $announcement->attachments[0]['name']);
        Storage::disk('public')->assertExists($announcement->attachments[0]['path']);
    }
}
