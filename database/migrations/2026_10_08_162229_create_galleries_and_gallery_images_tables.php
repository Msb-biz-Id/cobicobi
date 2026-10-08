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
        Schema::create('galleries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('category')->default('Umum');
            $table->date('event_date')->nullable();
            $table->string('photographer')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'event_date']);
            $table->index('category');
        });

        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained('galleries')->cascadeOnDelete();
            $table->string('image_url');
            $table->string('caption')->nullable();
            $table->string('alt_text')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index(['gallery_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
        Schema::dropIfExists('galleries');
    }
};
