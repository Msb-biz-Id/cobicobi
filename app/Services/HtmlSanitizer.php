<?php

namespace App\Services;

class HtmlSanitizer
{
    /**
     * Clean untrusted HTML content to prevent Cross-Site Scripting (XSS).
     */
    public static function clean(?string $html): ?string
    {
        if (empty($html)) {
            return $html;
        }

        // 1. Remove dangerous script and iframe elements (unless embedded maps)
        $clean = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $html);
        $clean = preg_replace('#<style(.*?)>(.*?)</style>#is', '', $clean);
        $clean = preg_replace('#<object(.*?)>(.*?)</object>#is', '', $clean);
        $clean = preg_replace('#<embed(.*?)>(.*?)</embed>#is', '', $clean);
        $clean = preg_replace('#<applet(.*?)>(.*?)</applet>#is', '', $clean);

        // 2. Remove inline javascript execution (e.g. href="javascript:...", src="javascript:...")
        $clean = preg_replace('#(href|src|data)=([\'\"])javascript:[^\'\"]*([\'\"])#is', '$1="#"', $clean);

        // 3. Remove all DOM event handlers (e.g., onload=..., onerror=..., onclick=..., onmouseover=...)
        $clean = preg_replace('#\s+on[a-zA-Z]+\s*=\s*([\'\"]).*?\1#is', '', $clean);
        $clean = preg_replace('#\s+on[a-zA-Z]+\s*=\s*[^>\s]+#is', '', $clean);

        // 4. Remove vbscript protocols
        $clean = preg_replace('#(href|src)=([\'\"])vbscript:[^\'\"]*([\'\"])#is', '$1="#"', $clean);

        return $clean;
    }
}
