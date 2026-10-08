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
        Schema::dropIfExists('gallery_images');
        Schema::dropIfExists('galleries');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed as galleries module is replaced by universal Media Library
    }
};
