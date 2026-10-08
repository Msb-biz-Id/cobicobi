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
        Schema::table('menus', function (Blueprint $table) {
            $table->string('type', 30)->default('standard')->after('url'); // 'standard', 'dropdown', 'mega_menu'
            $table->unsignedTinyInteger('mega_columns')->default(3)->after('type'); // 2, 3, 4
            $table->string('description')->nullable()->after('icon');
            $table->string('badge', 50)->nullable()->after('description');
            $table->string('auto_source', 50)->nullable()->after('badge'); // 'faculties', 'study_programs', 'institutional_units', 'facilities', 'extracurriculars', 'categories'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn(['type', 'mega_columns', 'description', 'badge', 'auto_source']);
        });
    }
};
