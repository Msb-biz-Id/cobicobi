<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['dosen', 'tendik'])->default('dosen');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('front_title')->nullable(); // e.g. Prof. Dr. Ir.
            $table->string('back_title')->nullable(); // e.g. S.Kom., M.T., Ph.D.
            $table->string('nidn')->nullable(); // NIDN / NUPTK / NIDK
            $table->string('nip')->nullable(); // NIP / NIK Pegawai
            $table->enum('gender', ['L', 'P'])->nullable();
            
            // Faculty & Work Unit
            $table->string('faculty')->nullable();
            $table->string('study_program')->nullable(); // Program Studi Homebase
            $table->string('academic_position')->nullable(); // Asisten Ahli, Lektor, Lektor Kepala, Guru Besar
            $table->string('structural_position')->nullable(); // Dekan, Kaprodi, Kepala Laboratorium, Kabag TU
            $table->string('employment_status')->nullable(); // Dosen Tetap, ASN/PNS, Tendik Tetap, dll.

            // Academic Expertise & Bio
            $table->json('expertise')->nullable(); // Array of strings (research interests/skills)
            $table->longText('bio')->nullable(); // TipTap / HTML content
            $table->json('education_history')->nullable(); // Array of {degree, institution, major, graduation_year}

            // Contact & Office
            $table->string('office_address')->nullable(); // Gedung, Lantai, Ruang
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('avatar_path')->nullable();

            // Academic Identifiers & External Repositories
            $table->string('google_scholar_url')->nullable();
            $table->string('google_scholar_id')->nullable();
            $table->string('scopus_id')->nullable();
            $table->string('scopus_url')->nullable();
            $table->string('sinta_id')->nullable();
            $table->string('sinta_url')->nullable();
            $table->string('orcid_id')->nullable();
            $table->string('orcid_url')->nullable();
            $table->string('research_gate_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('website_url')->nullable();
            $table->string('rss_feed_url')->nullable(); // Custom RSS / Atom feed for publication auto-fetch

            // Citation Metrics
            $table->unsignedInteger('total_citations')->default(0);
            $table->unsignedInteger('h_index')->default(0);
            $table->unsignedInteger('i10_index')->default(0);

            // Visibility & Ordering
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamp('last_synced_at')->nullable();

            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index(['faculty', 'study_program']);
        });

        Schema::create('staff_publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_profile_id')->constrained('staff_profiles')->cascadeOnDelete();
            $table->string('title');
            $table->text('authors')->nullable();
            $table->string('publication_name')->nullable(); // Journal, Conference proceedings, or Publisher
            $table->unsignedSmallInteger('year')->nullable();
            $table->enum('type', ['journal', 'conference', 'book', 'patent', 'community_service', 'other'])->default('journal');
            $table->enum('source', ['scholar', 'rss', 'manual'])->default('manual');
            $table->string('doi')->nullable();
            $table->string('url')->nullable(); // Direct paper link or Scholar citations link
            $table->unsignedInteger('citations_count')->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);

            $table->timestamps();

            $table->index(['staff_profile_id', 'source']);
            $table->index(['staff_profile_id', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_publications');
        Schema::dropIfExists('staff_profiles');
    }
};
