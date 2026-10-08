<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. TABEL FASILITAS KAMPUS (TERPISAH)
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category', 50)->default('akademik'); // akademik, laboratorium, olahraga, seni_budaya, layanan_umum, kesehatan_ibadah
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->json('features')->nullable(); // Spesifikasi / fasilitas pendukung (AC, Kapasitas, Sound, Wi-Fi, dll)
            $table->string('location')->nullable(); // Lokasi gedung / lantai
            $table->string('operational_hours')->nullable(); // Jam operasional
            $table->string('contact_person')->nullable(); // Nama PIC
            $table->string('contact_phone', 50)->nullable(); // No WhatsApp / Telp PIC
            $table->text('booking_info')->nullable(); // Panduan / syarat reservasi
            $table->string('booking_url', 500)->nullable(); // Link form reservasi jika ada
            $table->string('primary_image_path', 500)->nullable(); // Foto cover utama
            $table->json('gallery_images')->nullable(); // Galeri foto pendukung
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. TABEL EKSTRAKURIKULER / UKM (TERPISAH)
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: UKM Robotika & Kecerdasan Buatan
            $table->string('slug')->unique();
            $table->string('abbreviation', 50)->nullable(); // ROBOTIK, PSM, MAPALA
            $table->string('category', 50)->default('penalaran_keilmuan'); // penalaran_keilmuan, seni_budaya, olahraga, keagamaan, sosial_kemanusiaan
            $table->longText('description')->nullable();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->json('achievements')->nullable(); // Prestasi unggulan (Juara Kontes Robot, Medali Emas, dll)
            $table->text('activities_overview')->nullable(); // Jadwal latihan / agenda rutin
            $table->text('registration_info')->nullable(); // Info open recruitment anggota baru
            $table->string('registration_url', 500)->nullable(); // Form pendaftaran online

            // Media Sosial Lengkap (termasuk TikTok)
            $table->string('facebook_url', 500)->nullable();
            $table->string('instagram_url', 500)->nullable();
            $table->string('x_url', 500)->nullable();
            $table->string('tiktok_url', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->string('website_url', 500)->nullable();

            // Kontak & Lokasi Sekretariat UKM
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('office_location')->nullable(); // Ruang sekretariat di Student Center / PKM

            // Media Gambar
            $table->string('logo_path', 500)->nullable();
            $table->string('cover_image_path', 500)->nullable();
            $table->json('gallery_images')->nullable();

            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extracurriculars');
        Schema::dropIfExists('facilities');
    }
};
