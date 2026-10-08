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
        Schema::table('web_settings', function (Blueprint $table) {
            $table->json('theme_typography')->nullable()->after('threads_url');
            $table->json('theme_colors')->nullable()->after('theme_typography');
            $table->json('theme_layout')->nullable()->after('theme_colors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('web_settings', function (Blueprint $table) {
            $table->dropColumn(['theme_typography', 'theme_colors', 'theme_layout']);
        });
    }
};
