<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaSeeder extends Seeder
{
    /**
     * Seed initial media items for the Media Library.
     */
    public function run(): void
    {
        Media::query()->delete();

        $admin = User::query()->where('role', 'superadmin')->first() ?: User::query()->first();
        $adminId = $admin?->id;

        $items = [
            ['title' => 'Oversized Streetwear Hoodie - Slate', 'filename' => 'oversized-streetwear-hoodie.svg', 'alt' => 'Oversized streetwear hoodie in dark slate tone'],
            ['title' => 'Heavyweight Boxy Tee - Cream', 'filename' => 'heavyweight-boxy-tee.svg', 'alt' => 'Heavyweight cotton boxy tee cream colorway'],
            ['title' => 'Wide Leg Cargo Trousers - Olive', 'filename' => 'cargo-trousers-olive.svg', 'alt' => 'Utility cargo trousers with multi pockets in olive green'],
            ['title' => 'Acid Wash Vintage Crewneck', 'filename' => 'acid-wash-vintage-crewneck.svg', 'alt' => 'Acid wash vintage aesthetic crewneck pullover'],
            ['title' => 'Raw Denim Relaxed Jeans', 'filename' => 'raw-denim-relaxed-jeans.svg', 'alt' => 'Japanese selvedge raw denim relaxed cut trousers'],
            ['title' => 'Nylon Tech Windbreaker Jacket', 'filename' => 'tech-windbreaker-jacket.svg', 'alt' => 'Waterproof techwear windbreaker jacket in obsidian black'],
            ['title' => 'Editorial Studio Lookbook Front Cover', 'filename' => 'editorial-lookbook-cover.svg', 'alt' => 'Editorial lookbook photography front cover'],
            ['title' => 'Minimalist Brand Badge Logo Mark', 'filename' => 'brand-badge-logomark.svg', 'alt' => 'Minimalist apparel brand identity logomark'],
            ['title' => 'Fabric Texture & Weave Macro Shot', 'filename' => 'fabric-texture-macro.svg', 'alt' => 'Close up organic heavyweight cotton fabric weave'],
            ['title' => 'Autumn Winter Campaign Banner', 'filename' => 'autumn-winter-campaign.svg', 'alt' => 'Campaign photoshoot banner autumn winter collection'],
            ['title' => 'Casual Everyday Canvas Tote Bag', 'filename' => 'everyday-canvas-tote.svg', 'alt' => 'Durable organic canvas tote bag with minimal typography'],
            ['title' => 'Distressed Denim Overshirt', 'filename' => 'distressed-denim-overshirt.svg', 'alt' => 'Washed denim utility overshirt with silver hardware'],
        ];

        foreach ($items as $index => $item) {
            $path = "media/{$item['filename']}";
            Storage::disk('public')->put($path, $this->makeSvgBanner($item['title'], $index));

            $fileSize = Storage::disk('public')->size($path);

            Media::query()->create([
                'user_id' => $adminId,
                'title' => $item['title'],
                'file_name' => $item['filename'],
                'file_path' => $path,
                'mime_type' => 'image/svg+xml',
                'file_size' => $fileSize,
                'alt_text' => $item['alt'],
                'caption' => "Curated apparel media asset: {$item['title']}",
            ]);
        }
    }

    private function makeSvgBanner(string $title, int $seed): string
    {
        $hue = ($seed * 37) % 360;
        $label = Str::limit($title, 24, '');

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g{$seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl({$hue}, 65%, 55%)"/>
      <stop offset="100%" stop-color="hsl({$hue}, 85%, 28%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g{$seed})"/>
  <circle cx="1050" cy="120" r="140" fill="rgba(255,255,255,0.12)"/>
  <circle cx="140" cy="680" r="160" fill="rgba(255,255,255,0.08)"/>
  <rect x="80" y="80" width="1040" height="640" rx="16" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <text x="120" y="420" fill="white" font-size="52" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="700">
    {$label}
  </text>
  <text x="120" y="480" fill="rgba(255,255,255,0.7)" font-size="20" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="500">
    APPAREL STUDIO MEDIA LIBRARY
  </text>
</svg>
SVG;
    }
}
