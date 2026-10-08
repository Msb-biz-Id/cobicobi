<?php

namespace Tests\Feature;

use App\Models\Gallery;
use App\Models\GalleryImage;
use App\Models\Menu;
use App\Models\Faculty;
use App\Models\StudyProgram;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryAndMegaMenuTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_gallery_archive_can_be_rendered(): void
    {
        Gallery::create([
            'title' => 'Dokumentasi Wisuda Akbar 2026',
            'slug' => 'dokumentasi-wisuda-akbar-2026',
            'category' => 'Wisuda',
            'description' => 'Momen kebahagiaan wisudawan sarjana dan magister',
            'is_published' => true,
        ]);

        $response = $this->get(route('public.galleries.index'));

        $response->assertOk();
    }

    public function test_public_gallery_single_can_be_rendered_and_increments_views(): void
    {
        $gallery = Gallery::create([
            'title' => 'Kunjungan Laboratorium Robotika',
            'slug' => 'kunjungan-laboratorium-robotika',
            'category' => 'Laboratorium & Riset',
            'description' => 'Pameran inovasi robot otonom dan AI terapan',
            'is_published' => true,
            'views_count' => 5,
        ]);

        GalleryImage::create([
            'gallery_id' => $gallery->id,
            'image_url' => '/storage/galleries/test.jpg',
            'caption' => 'Robot otonom penjelajah medan terjal',
            'position' => 0,
        ]);

        $response = $this->get(route('public.galleries.show', $gallery->slug));

        $response->assertOk();
        $this->assertEquals(6, $gallery->fresh()->views_count);
    }

    public function test_admin_can_create_gallery_with_files_up_to_500kb(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $cover = UploadedFile::fake()->image('cover.jpg')->size(400); // 400 KB <= 500 KB
        $photo = UploadedFile::fake()->image('foto1.jpg')->size(350); // 350 KB <= 500 KB

        $response = $this->actingAs($admin)->post(route('galleries.store'), [
            'title' => 'Pekan Olahraga Mahasiswa 2026',
            'category' => 'Kegiatan Mahasiswa',
            'description' => 'Pertandingan cabang basket, futsal, dan atletik',
            'event_date' => '2026-10-10',
            'is_published' => true,
            'cover_image' => $cover,
            'images' => [$photo],
            'captions' => ['Upacara pembukaan pekan olahraga'],
        ]);

        $response->assertRedirect(route('galleries.index'));
        $this->assertDatabaseHas('galleries', [
            'title' => 'Pekan Olahraga Mahasiswa 2026',
            'category' => 'Kegiatan Mahasiswa',
        ]);
        $this->assertDatabaseHas('gallery_images', [
            'caption' => 'Upacara pembukaan pekan olahraga',
        ]);
    }

    public function test_admin_gallery_creation_rejects_files_larger_than_500kb(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);

        $oversizedCover = UploadedFile::fake()->image('cover_raksasa.jpg')->size(750); // 750 KB > 500 KB

        $response = $this->actingAs($admin)->post(route('galleries.store'), [
            'title' => 'Uji Coba Berkas Gambar Terlalu Besar',
            'category' => 'Umum',
            'cover_image' => $oversizedCover,
        ]);

        $response->assertSessionHasErrors('cover_image');
    }

    public function test_menu_supports_mega_menu_attributes_and_reordering(): void
    {
        $admin = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post(route('menus.store'), [
            'title' => 'Portal Layanan Kampus',
            'url' => '#',
            'type' => 'mega_menu',
            'mega_columns' => 4,
            'target' => '_self',
            'icon' => 'Sparkles',
            'description' => 'Akses terpadu seluruh layanan mahasiswa dan sivitas',
            'badge' => 'Populer',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('menus', [
            'title' => 'Portal Layanan Kampus',
            'type' => 'mega_menu',
            'mega_columns' => 4,
            'badge' => 'Populer',
            'icon' => 'Sparkles',
        ]);
    }

    public function test_menu_quick_add_batch_store_creates_multiple_items(): void
    {
        $admin = User::factory()->create([
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $items = [
            ['title' => 'Fakultas Teknik', 'url' => '/fakultas/teknik', 'icon' => 'Building2', 'badge' => null],
            ['title' => 'Fakultas Kedokteran', 'url' => '/fakultas/kedokteran', 'icon' => 'Building2', 'badge' => null],
            ['title' => 'Galeri Foto', 'url' => '/galeri', 'icon' => 'Images', 'badge' => 'Baru'],
        ];

        $response = $this->actingAs($admin)->post(route('menus.batch'), [
            'items' => $items,
            'parent_id' => null,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('menus', ['title' => 'Fakultas Teknik']);
        $this->assertDatabaseHas('menus', ['title' => 'Fakultas Kedokteran']);
        $this->assertDatabaseHas('menus', ['title' => 'Galeri Foto', 'badge' => 'Baru']);
    }

    public function test_menu_auto_source_dynamically_resolves_children_from_database(): void
    {
        Faculty::create([
            'name' => 'Fakultas Ilmu Komputer & AI',
            'slug' => 'fakultas-ilmu-komputer-dan-ai',
            'is_active' => true,
        ]);

        $menu = Menu::create([
            'title' => 'Fakultas Kampus',
            'url' => '/fakultas',
            'type' => 'mega_menu',
            'target' => '_self',
            'auto_source' => 'faculties',
            'is_active' => true,
            'position' => 0,
        ]);

        $resolvedChildren = $menu->getResolvedChildren();

        $this->assertNotEmpty($resolvedChildren);
        $this->assertEquals('Fakultas Ilmu Komputer & AI', $resolvedChildren[0]['title']);
        $this->assertStringContainsString('fakultas-ilmu-komputer-dan-ai', $resolvedChildren[0]['url']);
    }
}
