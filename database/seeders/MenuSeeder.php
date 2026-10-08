<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Menu::query()->delete();

        // 1. Beranda (Menu Biasa dengan Icon)
        Menu::query()->create([
            'title' => 'Beranda',
            'url' => '/',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Home',
            'position' => 0,
            'is_active' => true,
        ]);

        // 2. Akademik & Kelembagaan (MEGA MENU Modern 3 Kolom)
        $academic = Menu::query()->create([
            'title' => 'Akademik',
            'url' => '#',
            'type' => 'mega_menu',
            'mega_columns' => 3,
            'target' => '_self',
            'icon' => 'GraduationCap',
            'description' => 'Eksplorasi fakultas, program studi terakreditasi, direktori dosen, dan kalender kegiatan',
            'position' => 1,
            'is_active' => true,
        ]);

        // Anak-anak Mega Menu
        Menu::query()->create([
            'title' => 'Fakultas',
            'url' => '/fakultas',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Building2',
            'description' => 'Fakultas Teknik, Kedokteran, Ekonomi, Humaniora, dll',
            'badge' => null,
            'parent_id' => $academic->id,
            'position' => 0,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Program Studi',
            'url' => '/program-studi',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Library',
            'description' => 'Program Sarjana (S1), Magister (S2), dan Vokasi Unggul',
            'badge' => 'Unggul',
            'parent_id' => $academic->id,
            'position' => 1,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Dosen & Tendik',
            'url' => '/dosen-dan-tendik',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Users',
            'description' => 'Direktori profil pengajar, kepakaran riset, & staf',
            'badge' => null,
            'parent_id' => $academic->id,
            'position' => 2,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Unit & UPT',
            'url' => '/unit',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Network',
            'description' => 'Lembaga Penjaminan Mutu, Perpustakaan, & Lab Terpadu',
            'badge' => null,
            'parent_id' => $academic->id,
            'position' => 3,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Agenda & Jadwal',
            'url' => '/agenda',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Calendar',
            'description' => 'Jadwal seminar, wisuda, registrasi, & konferensi',
            'badge' => null,
            'parent_id' => $academic->id,
            'position' => 4,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Pengumuman Resmi',
            'url' => '/pengumuman',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Megaphone',
            'description' => 'Edaran rektorat, beasiswa, & unduhan dokumen resmi',
            'badge' => 'Penting',
            'parent_id' => $academic->id,
            'position' => 5,
            'is_active' => true,
        ]);

        // 3. Kehidupan Kampus (SUB MENU Dropdown Klasik dengan Icon)
        $campusLife = Menu::query()->create([
            'title' => 'Kehidupan Kampus',
            'url' => '#',
            'type' => 'dropdown',
            'target' => '_self',
            'icon' => 'Sparkles',
            'description' => 'Sarana prasarana penunjang dan kegiatan mahasiswa',
            'position' => 2,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Fasilitas Kampus',
            'url' => '/fasilitas',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Landmark',
            'description' => 'Laboratorium, asrama, sarana olahraga, & perpustakaan',
            'parent_id' => $campusLife->id,
            'position' => 0,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Ekstrakurikuler (UKM)',
            'url' => '/ekstrakurikuler',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Compass',
            'description' => 'Wadah minat bakat, olahraga, seni, & penalaran mahasiswa',
            'parent_id' => $campusLife->id,
            'position' => 1,
            'is_active' => true,
        ]);

        Menu::query()->create([
            'title' => 'Galeri & Lensa Kampus',
            'url' => '/galeri',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Images',
            'description' => 'Dokumentasi visual wisuda, riset, dan momen istimewa',
            'badge' => 'Baru',
            'parent_id' => $campusLife->id,
            'position' => 2,
            'is_active' => true,
        ]);

        // 4. Warta & Berita (Menu Biasa tanpa Icon / opsional icon)
        Menu::query()->create([
            'title' => 'Berita',
            'url' => '/berita',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'BookCopy',
            'position' => 3,
            'is_active' => true,
        ]);

        // 5. Galeri Foto (Menu Biasa dengan Badge)
        Menu::query()->create([
            'title' => 'Galeri',
            'url' => '/galeri',
            'type' => 'standard',
            'target' => '_self',
            'icon' => 'Camera',
            'badge' => 'Foto',
            'position' => 4,
            'is_active' => true,
        ]);

        // 6. Agenda
        Menu::query()->create([
            'title' => 'Agenda',
            'url' => '/agenda',
            'type' => 'standard',
            'target' => '_self',
            'icon' => null, // Mendemonstrasikan menu tanpa icon tetap rapi dan konsisten
            'position' => 5,
            'is_active' => true,
        ]);
    }
}
