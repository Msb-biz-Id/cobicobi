<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- SEO & Feeds Discovery -->
        <link rel="sitemap" type="application/xml" title="Sitemap" href="{{ url('/sitemap.xml') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ config('app.name', 'Portal Kampus') }} - Feed Terkini" href="{{ url('/feed') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ config('app.name', 'Portal Kampus') }} - Berita Kampus" href="{{ url('/feed/berita') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ config('app.name', 'Portal Kampus') }} - Pengumuman Resmi" href="{{ url('/feed/pengumuman') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ config('app.name', 'Portal Kampus') }} - Agenda Kampus" href="{{ url('/feed/agenda') }}">

        <!-- Cloudflare Turnstile Security Protection (Anti-Bruteforce & Anti-Bot) -->
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
