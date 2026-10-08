<?php

namespace App\Services;

use App\Models\WebSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Alignment;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;
use Throwable;

class ImageUploadService
{
    /**
     * Process uploaded image with compression and optional watermark.
     */
    public function storeOptimized(
        UploadedFile $file,
        string $directory,
        bool $useWatermark = false,
        int $quality = 78
    ): string {
        $manager = new ImageManager(new Driver());
        $image = $manager->decodePath($file->getRealPath());

        // Keep output lightweight for web delivery.
        $image->scaleDown(width: 1920, height: 1920);

        if ($useWatermark) {
            $this->applyLogoWatermark($image, $manager);
        }

        $encoded = $image->encode(new WebpEncoder(quality: $quality));
        $fileName = Str::uuid()->toString().'.webp';
        $path = trim($directory, '/').'/'.$fileName;

        Storage::disk('public')->put($path, (string) $encoded);

        return $path;
    }

    /**
     * Alias for uploading images with optional dimensions and quality.
     */
    public function upload(
        UploadedFile $file,
        string $directory = 'media',
        bool $applyWatermark = false,
        int $maxWidth = 1920,
        int $maxHeight = 1920,
        int $quality = 80
    ): string {
        return $this->storeOptimized($file, $directory, $applyWatermark, $quality);
    }

    /**
     * Best-effort watermarking, fallback silently if logo unavailable.
     */
    private function applyLogoWatermark(ImageInterface $image, ImageManager $manager): void
    {
        try {
            $logoPath = WebSetting::query()->value('logo_path');

            if (blank($logoPath)) {
                return;
            }

            $absoluteLogoPath = Storage::disk('public')->path($logoPath);
            if (!is_file($absoluteLogoPath)) {
                return;
            }

            $logo = $manager->decodePath($absoluteLogoPath);
            $targetWidth = (int) round($image->width() * 0.16);
            $targetWidth = max(64, min(220, $targetWidth));
            $logo->scaleDown(width: $targetWidth);

            $offset = max(12, (int) round($image->width() * 0.02));

            // Opacity 35 keeps watermark visible without ruining image.
            $image->insert($logo, $offset, $offset, Alignment::BOTTOM_RIGHT, 0.35);
        } catch (Throwable) {
            // No-op: uploading image should not fail only because watermark fails.
        }
    }
}

