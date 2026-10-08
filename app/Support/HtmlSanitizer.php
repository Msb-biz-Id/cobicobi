<?php

namespace App\Support;

class HtmlSanitizer
{
    /**
     * Bersihkan HTML dari skrip berbahaya, SVG injection, dan atribut berbahaya.
     */
    public static function clean(?string $html): ?string
    {
        if (blank($html)) {
            return null;
        }

        // Hapus skrip, event handlers dan protokol berbahaya
        $disallowed = [
            '/<script\b[^>]*>(.*?)<\/script>/is',
            '/<iframe\b[^>]*>(.*?)<\/iframe>/is',
            '/<object\b[^>]*>(.*?)<\/object>/is',
            '/<embed\b[^>]*>(.*?)<\/embed>/is',
            '/<applet\b[^>]*>(.*?)<\/applet>/is',
            '/<meta\b[^>]*>/is',
            '/<link\b[^>]*>/is',
            '/\bon\w+\s*=\s*["\']?[^"\'>]+["\']?/is', // hapus onclick, onerror, dll
            '/javascript:/i',
            '/vbscript:/i',
            '/data:text\/html/i',
        ];

        $cleaned = preg_replace($disallowed, '', $html);

        // Hanya izinkan tag tipikal konten portal kampus
        $allowedTags = '<p><br><b><strong><i><em><u><s><ul><ol><li><a><h3><h4><h5><h6><blockquote><hr><table><thead><tbody><tr><th><td><span><div><img>';

        return strip_tags($cleaned, $allowedTags);
    }
}
