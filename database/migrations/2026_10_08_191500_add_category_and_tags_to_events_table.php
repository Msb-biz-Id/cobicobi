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
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'category_id')) {
                $table->foreignId('category_id')->nullable()->after('slug')->constrained('categories')->nullOnDelete();
            }
            if (!Schema::hasColumn('events', 'published_at')) {
                $table->dateTime('published_at')->nullable()->after('status');
            }
        });

        if (!Schema::hasTable('hashtag_event')) {
            Schema::create('hashtag_event', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
                $table->foreignId('hashtag_id')->constrained('hashtags')->cascadeOnDelete();
                $table->timestamps();

                $table->unique(['event_id', 'hashtag_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hashtag_event');

        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'category_id')) {
                $table->dropConstrainedForeignId('category_id');
            }
            if (Schema::hasColumn('events', 'published_at')) {
                $table->dropColumn('published_at');
            }
        });
    }
};
