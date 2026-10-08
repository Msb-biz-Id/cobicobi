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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('reference_number')->nullable(); // e.g. B/1042/UN.1/PK.02/2026
            $table->string('category')->default('Akademik'); // Akademik, Kemahasiswaan, Beasiswa, Karir & Magang, Registrasi, Umum
            $table->string('target_audience')->default('Semua Civitas'); // Semua Civitas, Mahasiswa, Dosen & Tendik, Mahasiswa Baru, Alumni
            $table->string('issuer')->nullable(); // e.g. Biro Administrasi Akademik (BAAK)
            $table->string('status')->default('published'); // published, draft, archived
            $table->boolean('is_pinned')->default(false); // Disematkan di paling atas

            // Cover & Content
            $table->string('cover_image_path')->nullable();
            $table->text('summary')->nullable();
            $table->longText('content')->nullable(); // TipTap rich text

            // Attachments (JSON array of {name, path, size, type, download_count})
            $table->json('attachments')->nullable();

            // Dates & Analytics
            $table->dateTime('published_at')->nullable();
            $table->dateTime('expires_at')->nullable(); // Batas waktu/deadline jika ada
            $table->unsignedBigInteger('views_count')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
