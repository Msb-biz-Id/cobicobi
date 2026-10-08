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
        Schema::create('campus_settings', function (Blueprint $table) {
            $table->id();

            // Sambutan Rektor
            $table->string('rector_name')->nullable();
            $table->string('rector_title')->nullable();
            $table->string('rector_image_path')->nullable();
            $table->text('rector_quote')->nullable();
            $table->longText('rector_speech')->nullable();
            $table->string('rector_video_url')->nullable();

            // Hero Slider & Stats
            $table->json('hero_slides')->nullable();
            $table->json('hero_stats')->nullable();

            // Profil Lengkap Kampus & Akreditasi
            $table->longText('about_background')->nullable();
            $table->string('about_image_path')->nullable();
            $table->text('about_vision')->nullable();
            $table->json('about_missions')->nullable();
            $table->json('about_goals')->nullable();
            $table->json('about_development_models')->nullable();
            $table->json('about_development_strategies')->nullable();
            $table->json('about_accreditation')->nullable();

            // Page Builder Home Sections
            $table->json('home_sections')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus_settings');
    }
};
