<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. MASTER GLOBAL JABATAN BERTINGKAT
        Schema::create('structural_positions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Dekan, Wakil Dekan, Kaprodi, Sekprodi, Kepala UPT, dll.
            $table->string('slug')->unique();
            $table->integer('level')->default(1); // 1: Pimpinan Utama/Dekan/Direktur, 2: Wakil Pimpinan, 3: Kaprodi/Kepala UPT, 4: Sekprodi/Kepala Lab, 5: Koordinator
            $table->string('target_scope')->default('all'); // all, faculty, study_program, unit, organization
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. FAKULTAS (Bisa kosong jika kampus tidak memiliki fakultas)
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: Fakultas Ilmu Komputer
            $table->string('slug')->unique();
            $table->string('code', 50)->nullable(); // Kode Fakultas
            $table->string('abbreviation', 50)->nullable(); // FASILKOM
            $table->string('decree_number', 100)->nullable(); // SK Pendirian Fakultas
            $table->string('accreditation', 50)->nullable(); // Akreditasi Fakultas

            // Konten berurutan
            $table->longText('description')->nullable(); // Sejarah, deskripsi lengkap
            $table->text('vision')->nullable(); // Visi
            $table->text('mission')->nullable(); // Misi
            $table->text('objectives')->nullable(); // Tujuan strategis

            // Media sosial (termasuk TikTok)
            $table->string('facebook_url', 500)->nullable();
            $table->string('instagram_url', 500)->nullable();
            $table->string('x_url', 500)->nullable();
            $table->string('tiktok_url', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->string('website_url', 500)->nullable();

            // Kontak & Lokasi
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('office_location')->nullable();

            // Media
            $table->string('logo_path')->nullable();
            $table->string('cover_image_path')->nullable();

            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. PROGRAM STUDI (PRODI)
        Schema::create('study_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->nullable()->constrained('faculties')->nullOnDelete(); // NULLABLE: Kampus tanpa fakultas tetap bisa punya prodi langsung
            $table->string('name'); // Contoh: S1 Teknik Informatika
            $table->string('slug')->unique();
            $table->string('code', 50)->nullable(); // Kode Prodi PDDIKTI
            $table->string('abbreviation', 50)->nullable(); // TIF
            $table->string('degree_level', 20)->default('S1'); // D3, D4, S1, S2, S3, Profesi, Spesialis
            $table->string('graduate_title', 100)->nullable(); // Contoh: Sarjana Komputer (S.Kom.)
            $table->string('accreditation', 50)->nullable(); // Unggul, A, Baik Sekali, B, dll
            $table->string('accreditation_number', 100)->nullable(); // No SK Akreditasi
            $table->string('decree_number', 100)->nullable(); // SK Izin Operasional Prodi

            // Konten berurutan khusus Prodi
            $table->longText('description')->nullable(); // Profil, keunggulan
            $table->text('vision')->nullable(); // Visi
            $table->text('mission')->nullable(); // Misi
            $table->json('career_prospects')->nullable(); // Prospek Karir & Peluang Kerja Lulusan (Array)
            $table->longText('curriculum_overview')->nullable(); // Gambaran kurikulum & kompetensi

            // Media sosial (termasuk TikTok)
            $table->string('facebook_url', 500)->nullable();
            $table->string('instagram_url', 500)->nullable();
            $table->string('x_url', 500)->nullable();
            $table->string('tiktok_url', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->string('website_url', 500)->nullable();

            // Kontak & Lokasi
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('office_location')->nullable();

            // Media
            $table->string('logo_path')->nullable();
            $table->string('cover_image_path')->nullable();

            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. UNIT, UPT, LEMBAGA & ORGANISASI
        Schema::create('institutional_units', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('upt'); // upt, lembaga, biro, organisasi
            $table->string('name'); // Contoh: UPT Perpustakaan, LPPM, Lab Cyber Security, BEM
            $table->string('slug')->unique();
            $table->string('code', 50)->nullable();
            $table->string('abbreviation', 50)->nullable();

            // Konten
            $table->longText('description')->nullable();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->text('services_overview')->nullable(); // Layanan, fasilitas, atau tupoksi

            // Media sosial (termasuk TikTok)
            $table->string('facebook_url', 500)->nullable();
            $table->string('instagram_url', 500)->nullable();
            $table->string('x_url', 500)->nullable();
            $table->string('tiktok_url', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->string('website_url', 500)->nullable();

            // Kontak & Lokasi
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('office_location')->nullable();

            // Media
            $table->string('logo_path')->nullable();
            $table->string('cover_image_path')->nullable();

            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. PIVOT DOSEN PENGAJAR PADA FAKULTAS (Multi-select Dosen di Fakultas)
        Schema::create('faculty_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->constrained('faculties')->cascadeOnDelete();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->string('role')->default('dosen_homebase'); // dosen_homebase, dosen_pengajar, dll
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['faculty_id', 'staff_profile_id']);
        });

        // 6. PIVOT DOSEN PENGAJAR PADA PRODI (Multi-select Dosen di Prodi)
        Schema::create('study_program_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_program_id')->constrained('study_programs')->cascadeOnDelete();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->string('role')->default('dosen_homebase'); // dosen_homebase, dosen_pengajar, dll
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['study_program_id', 'staff_profile_id']);
        });

        // 7. PENETAPAN PEJABAT STRUKTURAL (Polymorphic / Universal untuk Fakultas, Prodi, atau Unit)
        Schema::create('structural_assignments', function (Blueprint $table) {
            $table->id();
            $table->string('assignable_type'); // App\Models\Faculty, App\Models\StudyProgram, App\Models\InstitutionalUnit
            $table->unsignedBigInteger('assignable_id');
            $table->foreignId('structural_position_id')->constrained('structural_positions')->cascadeOnDelete();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->string('custom_title')->nullable(); // Sebutan khusus jika ada
            $table->string('period_start', 20)->nullable(); // misal: 2024
            $table->string('period_end', 20)->nullable(); // misal: 2028
            $table->string('decree_number', 100)->nullable(); // SK Pengangkatan Pejabat
            $table->boolean('is_current')->default(true); // Status aktif
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['assignable_type', 'assignable_id'], 'assignable_scope_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('structural_assignments');
        Schema::dropIfExists('study_program_staff');
        Schema::dropIfExists('faculty_staff');
        Schema::dropIfExists('institutional_units');
        Schema::dropIfExists('study_programs');
        Schema::dropIfExists('faculties');
        Schema::dropIfExists('structural_positions');
    }
};
