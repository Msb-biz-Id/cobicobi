<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $webSetting = $page['props']['webSetting'] ?? null;
            $typo = $webSetting['theme_typography'] ?? [];
            $colors = $webSetting['theme_colors'] ?? [];
            $layout = $webSetting['theme_layout'] ?? [];
        @endphp

        <title inertia>{{ $webSetting['site_title'] ?? config('app.name', 'Laravel') }}</title>

        @if (!empty($webSetting['favicon_url']))
            <link rel="icon" href="{{ $webSetting['favicon_url'] }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- Dynamic Theme Variables (Typography, Colors, Layout Container) -->
        <style id="theme-system-tokens">
            :root {
                /* Typography Font Families */
                --font-sans: '{{ $typo['font_sans'] ?? 'Plus Jakarta Sans' }}', system-ui, -apple-system, sans-serif;
                --font-heading: '{{ $typo['font_heading'] ?? 'Plus Jakarta Sans' }}', Georgia, serif;
                --font-mono: {{ $typo['font_mono'] ?? 'ui-monospace, monospace' }};

                /* Typography Font Sizes & Line Heights */
                --font-size-h1: {{ $typo['h1_size'] ?? '3.25rem' }};
                --font-size-h2: {{ $typo['h2_size'] ?? '2.25rem' }};
                --font-size-h3: {{ $typo['h3_size'] ?? '1.5rem' }};
                --font-size-h4: {{ $typo['h4_size'] ?? '1.25rem' }};
                --font-size-body: {{ $typo['body_size'] ?? '1rem' }};
                --font-size-small: {{ $typo['small_size'] ?? '0.875rem' }};
                --font-weight-h1: {{ $typo['h1_weight'] ?? '800' }};
                --line-height-body: {{ $typo['body_line_height'] ?? '1.65' }};

                /* Primary Colors Scale */
                --color-primary-50: {{ $colors['primary_50'] ?? '#f0f9ff' }};
                --color-primary-100: {{ $colors['primary_100'] ?? '#e0f2fe' }};
                --color-primary-200: {{ $colors['primary_200'] ?? '#bae6fd' }};
                --color-primary-300: {{ $colors['primary_300'] ?? '#7dd3fc' }};
                --color-primary-400: {{ $colors['primary_400'] ?? '#38bdf8' }};
                --color-primary-500: {{ $colors['primary_500'] ?? '#0284c7' }};
                --color-primary-600: {{ $colors['primary_600'] ?? '#0369a1' }};
                --color-primary-700: {{ $colors['primary_700'] ?? '#075985' }};
                --color-primary-800: {{ $colors['primary_800'] ?? '#0c4a6e' }};
                --color-primary-900: {{ $colors['primary_900'] ?? '#082f49' }};

                /* Secondary / Accent Scale */
                --color-secondary-50: {{ $colors['secondary_50'] ?? '#fffbeb' }};
                --color-secondary-100: {{ $colors['secondary_100'] ?? '#fef3c7' }};
                --color-secondary-200: {{ $colors['secondary_200'] ?? '#fde68a' }};
                --color-secondary-300: {{ $colors['secondary_300'] ?? '#fcd34d' }};
                --color-secondary-400: {{ $colors['secondary_400'] ?? '#fbbf24' }};
                --color-secondary-500: {{ $colors['secondary_500'] ?? '#f59e0b' }};
                --color-secondary-600: {{ $colors['secondary_600'] ?? '#d97706' }};
                --color-secondary-700: {{ $colors['secondary_700'] ?? '#b45309' }};

                /* Surface & Background */
                --color-bg-light: {{ $colors['bg_light'] ?? '#f8fafc' }};
                --color-bg-dark: {{ $colors['bg_dark'] ?? '#070b14' }};
                --color-surface-light: {{ $colors['surface_light'] ?? '#ffffff' }};
                --color-surface-dark: {{ $colors['surface_dark'] ?? '#0f172a' }};
                --color-border-light: {{ $colors['border_light'] ?? '#e2e8f0' }};
                --color-border-dark: {{ $colors['border_dark'] ?? '#1e293b' }};

                /* Layout & Container Constraints */
                --site-max-width: {{ $layout['container_max_width'] ?? '1400px' }};
                --site-padding-mobile: {{ $layout['container_padding_mobile'] ?? '1.5rem' }};
                --site-padding-desktop: {{ $layout['container_padding_desktop'] ?? '2rem' }};
            }

            body {
                font-family: var(--font-sans);
                font-size: var(--font-size-body);
                line-height: var(--line-height-body);
            }

            h1, h2, h3, h4 {
                font-family: var(--font-heading);
            }

            /* Container Kelas Baku & Konsisten di Seluruh Web */
            .site-container {
                width: 100%;
                max-width: var(--site-max-width);
                margin-left: auto;
                margin-right: auto;
                padding-left: var(--site-padding-mobile);
                padding-right: var(--site-padding-mobile);
            }
            @media (min-width: 1024px) {
                .site-container {
                    padding-left: var(--site-padding-desktop);
                    padding-right: var(--site-padding-desktop);
                }
            }
        </style>

        <!-- SEO & Feeds Discovery -->
        <link rel="sitemap" type="application/xml" title="Sitemap" href="{{ url('/sitemap.xml') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ $webSetting['site_title'] ?? config('app.name', 'Portal Kampus') }} - Feed Terkini" href="{{ url('/feed') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ $webSetting['site_title'] ?? config('app.name', 'Portal Kampus') }} - Berita Kampus" href="{{ url('/feed/berita') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ $webSetting['site_title'] ?? config('app.name', 'Portal Kampus') }} - Pengumuman Resmi" href="{{ url('/feed/pengumuman') }}">
        <link rel="alternate" type="application/rss+xml" title="{{ $webSetting['site_title'] ?? config('app.name', 'Portal Kampus') }} - Agenda Kampus" href="{{ url('/feed/agenda') }}">

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
