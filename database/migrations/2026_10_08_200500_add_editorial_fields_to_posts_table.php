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
        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'author_name')) {
                $table->string('author_name')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('posts', 'editor_id')) {
                $table->foreignId('editor_id')
                    ->nullable()
                    ->after('approved_by')
                    ->constrained('users')
                    ->nullOnDelete();
            }
            if (!Schema::hasColumn('posts', 'editor_name')) {
                $table->string('editor_name')->nullable()->after('editor_id');
            }
            if (!Schema::hasColumn('posts', 'source')) {
                $table->string('source')->nullable()->after('editor_name');
            }
            if (!Schema::hasColumn('posts', 'source_url')) {
                $table->string('source_url')->nullable()->after('source');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['editor_id']);
            $table->dropColumn([
                'author_name',
                'editor_id',
                'editor_name',
                'source',
                'source_url',
            ]);
        });
    }
};
