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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Seminar'); // Seminar, Workshop, Konferensi, Kuliah Umum, Wisuda, Lomba, Expo, Dies Natalis
            $table->string('organizer')->nullable(); // e.g. BEM, Rektorat, LPPM, Himpunan
            $table->string('status')->default('published'); // draft, published, archived, cancelled
            
            // Cover & Excerpt
            $table->string('cover_image_path')->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();

            // Date & Time
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();

            // Location & Auto Embed Maps
            $table->string('event_type')->default('offline'); // offline, online, hybrid
            $table->string('venue_name')->nullable(); // e.g. Auditorium Prof. Soedarto
            $table->text('address')->nullable();
            $table->text('maps_url')->nullable(); // Google Maps share link, query, or raw embed

            // Custom Registration Link & Pricing
            $table->string('registration_type')->default('free'); // free, paid, invite_only
            $table->string('price')->nullable()->default('Gratis'); // e.g. "Gratis", "Rp 50.000 (Mahasiswa) / Rp 100.000 (Umum)"
            $table->text('registration_url')->nullable(); // Custom link pendaftaran
            $table->string('registration_button_label')->default('Daftar Sekarang'); // Custom text link pendaftaran
            $table->dateTime('registration_deadline')->nullable();
            $table->integer('quota')->nullable();

            // Sponsors & Partnership (Array of {name, type, logo_url, website_url}) - Supports text or image
            $table->json('sponsors')->nullable();

            // Contact Person / PIC
            $table->string('contact_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
