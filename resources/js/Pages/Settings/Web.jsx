import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';
import {
    Save,
    Globe,
    Image as ImageIcon,
    Share2,
    MapPin,
    Search,
    Type,
    Palette,
    Upload,
    ExternalLink,
    X,
    Check,
    Sliders,
    Sparkles,
    Eye,
    Maximize2,
} from 'lucide-react';
import Swal from 'sweetalert2';

const PRESET_THEMES = [
    {
        id: 'itb_tuban_azure_gold',
        name: 'ITB Azure & Gold (Resmi)',
        desc: 'Biru langit modern ITB dengan aksen emas berwibawa.',
        primary_50: '#f0f9ff',
        primary_100: '#e0f2fe',
        primary_200: '#bae6fd',
        primary_300: '#7dd3fc',
        primary_400: '#38bdf8',
        primary_500: '#0284c7',
        primary_600: '#0369a1',
        primary_700: '#075985',
        primary_800: '#0c4a6e',
        primary_900: '#082f49',
        secondary_50: '#fffbeb',
        secondary_100: '#fef3c7',
        secondary_200: '#fde68a',
        secondary_300: '#fcd34d',
        secondary_400: '#fbbf24',
        secondary_500: '#f59e0b',
        secondary_600: '#d97706',
        secondary_700: '#b45309',
        bg_light: '#f8fafc',
        bg_dark: '#070b14',
        surface_light: '#ffffff',
        surface_dark: '#0f172a',
        border_light: '#e2e8f0',
        border_dark: '#1e293b',
        text_main_light: '#0f172a',
        text_muted_light: '#64748b',
        text_main_dark: '#f8fafc',
        text_muted_dark: '#94a3b8',
    },
    {
        id: 'royal_navy_amber',
        name: 'Royal Navy & Warm Amber',
        desc: 'Nuansa biru navy megah dengan sentuhan amber hangat.',
        primary_50: '#eef2ff',
        primary_100: '#e0e7ff',
        primary_200: '#c7d2fe',
        primary_300: '#a5b4fc',
        primary_400: '#818cf8',
        primary_500: '#4f46e5',
        primary_600: '#4338ca',
        primary_700: '#3730a3',
        primary_800: '#312e81',
        primary_900: '#1e1b4b',
        secondary_50: '#fffbeb',
        secondary_100: '#fef3c7',
        secondary_200: '#fde68a',
        secondary_300: '#fcd34d',
        secondary_400: '#fbbf24',
        secondary_500: '#f59e0b',
        secondary_600: '#d97706',
        secondary_700: '#b45309',
        bg_light: '#fafafa',
        bg_dark: '#090d16',
        surface_light: '#ffffff',
        surface_dark: '#111827',
        border_light: '#e5e7eb',
        border_dark: '#1f2937',
        text_main_light: '#111827',
        text_muted_light: '#6b7280',
        text_main_dark: '#f9fafb',
        text_muted_dark: '#9ca3af',
    },
    {
        id: 'emerald_academic',
        name: 'Emerald Campus & Gold',
        desc: 'Nuansa hijau kampus asri, sejuk, dan terpelajar.',
        primary_50: '#ecfdf5',
        primary_100: '#d1fae5',
        primary_200: '#a7f3d0',
        primary_300: '#6ee7b7',
        primary_400: '#34d399',
        primary_500: '#059669',
        primary_600: '#047857',
        primary_700: '#065f46',
        primary_800: '#064e3b',
        primary_900: '#022c22',
        secondary_50: '#fefce8',
        secondary_100: '#fef9c3',
        secondary_200: '#fef08a',
        secondary_300: '#fde047',
        secondary_400: '#facc15',
        secondary_500: '#eab308',
        secondary_600: '#ca8a04',
        secondary_700: '#a16207',
        bg_light: '#f8fafc',
        bg_dark: '#06130d',
        surface_light: '#ffffff',
        surface_dark: '#0e2319',
        border_light: '#e2e8f0',
        border_dark: '#163828',
        text_main_light: '#0f172a',
        text_muted_light: '#64748b',
        text_main_dark: '#f8fafc',
        text_muted_dark: '#94a3b8',
    },
    {
        id: 'crimson_heritage',
        name: 'Crimson Heritage & Bronze',
        desc: 'Nuansa marun prestisius, kokoh, dan berkarakter kuat.',
        primary_50: '#fff1f2',
        primary_100: '#ffe4e6',
        primary_200: '#fecdd3',
        primary_300: '#fda4af',
        primary_400: '#fb7185',
        primary_500: '#e11d48',
        primary_600: '#be123c',
        primary_700: '#9f1239',
        primary_800: '#881337',
        primary_900: '#4c0519',
        secondary_50: '#fffbeb',
        secondary_100: '#fef3c7',
        secondary_200: '#fde68a',
        secondary_300: '#fcd34d',
        secondary_400: '#fbbf24',
        secondary_500: '#f59e0b',
        secondary_600: '#d97706',
        secondary_700: '#b45309',
        bg_light: '#fafaf9',
        bg_dark: '#13080b',
        surface_light: '#ffffff',
        surface_dark: '#210d13',
        border_light: '#e7e5e4',
        border_dark: '#381620',
        text_main_light: '#1c1917',
        text_muted_light: '#78716c',
        text_main_dark: '#fafaf9',
        text_muted_dark: '#a8a29e',
    },
];

const FONT_OPTIONS_SANS = [
    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Modern Clean)' },
    { value: 'Inter', label: 'Inter (High Legibility)' },
    { value: 'Outfit', label: 'Outfit (Trendy Geometric)' },
    { value: 'Poppins', label: 'Poppins (Friendly & Rounded)' },
    { value: 'Montserrat', label: 'Montserrat (Bold Classic)' },
    { value: 'system-ui, sans-serif', label: 'System Default Sans' },
];

const FONT_OPTIONS_HEADING = [
    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Harmonious)' },
    { value: 'Outfit', label: 'Outfit (Modern Display)' },
    { value: 'Poppins', label: 'Poppins (Impactful)' },
    { value: 'Montserrat', label: 'Montserrat (Formal Capitalized)' },
    { value: 'Playfair Display', label: 'Playfair Display (Academic Serif)' },
];

export default function WebSettings({ setting }) {
    const [activeTab, setActiveTab] = useState('general');
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null);

    const form = useForm({
        site_title: setting?.site_title ?? '',
        slogan: setting?.slogan ?? '',
        short_description: setting?.short_description ?? '',
        meta_description: setting?.meta_description ?? '',
        meta_keywords: setting?.meta_keywords ?? '',
        logo: setting?.logo_url ?? null,
        icon: setting?.icon_url ?? null,
        favicon: setting?.favicon_url ?? null,
        meta_thumbnail: setting?.meta_thumbnail_url ?? null,
        contact_email: setting?.contact_email ?? '',
        contact_phone: setting?.contact_phone ?? '',
        whatsapp_number: setting?.whatsapp_number ?? '',
        address: setting?.address ?? '',
        city: setting?.city ?? '',
        province: setting?.province ?? '',
        country: setting?.country ?? '',
        postal_code: setting?.postal_code ?? '',
        google_maps_url: setting?.google_maps_url ?? '',
        facebook_url: setting?.facebook_url ?? '',
        instagram_url: setting?.instagram_url ?? '',
        youtube_url: setting?.youtube_url ?? '',
        tiktok_url: setting?.tiktok_url ?? '',
        x_url: setting?.x_url ?? '',
        linkedin_url: setting?.linkedin_url ?? '',
        threads_url: setting?.threads_url ?? '',

        // Typography Settings
        theme_typography: setting?.theme_typography ?? {
            font_sans: 'Plus Jakarta Sans',
            font_heading: 'Plus Jakarta Sans',
            font_mono: 'ui-monospace, monospace',
            h1_size: '3.25rem',
            h2_size: '2.25rem',
            h3_size: '1.5rem',
            h4_size: '1.25rem',
            body_size: '1rem',
            small_size: '0.875rem',
            h1_weight: '800',
            body_line_height: '1.65',
        },

        // Color Management
        theme_colors: setting?.theme_colors ?? {
            preset: 'itb_tuban_azure_gold',
            primary_50: '#f0f9ff',
            primary_100: '#e0f2fe',
            primary_200: '#bae6fd',
            primary_300: '#7dd3fc',
            primary_400: '#38bdf8',
            primary_500: '#0284c7',
            primary_600: '#0369a1',
            primary_700: '#075985',
            primary_800: '#0c4a6e',
            primary_900: '#082f49',
            secondary_50: '#fffbeb',
            secondary_100: '#fef3c7',
            secondary_200: '#fde68a',
            secondary_300: '#fcd34d',
            secondary_400: '#fbbf24',
            secondary_500: '#f59e0b',
            secondary_600: '#d97706',
            secondary_700: '#b45309',
            bg_light: '#f8fafc',
            bg_dark: '#070b14',
            surface_light: '#ffffff',
            surface_dark: '#0f172a',
            border_light: '#e2e8f0',
            border_dark: '#1e293b',
            text_main_light: '#0f172a',
            text_muted_light: '#64748b',
            text_main_dark: '#f8fafc',
            text_muted_dark: '#94a3b8',
        },

        // Layout Settings
        theme_layout: setting?.theme_layout ?? {
            container_max_width: '1400px',
            container_padding_mobile: '1.5rem',
            container_padding_desktop: '2rem',
            card_radius: '1.5rem',
            button_radius: '1rem',
        },
    });

    const submit = (event) => {
        event.preventDefault();

        form.post(route('web-settings.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Web settings & tema berhasil disimpan',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const handleMediaSelect = (media) => {
        if (!mediaPickerTarget) return;
        form.setData(mediaPickerTarget, media.url);
        setMediaPickerTarget(null);
    };

    const applyColorPreset = (preset) => {
        form.setData('theme_colors', {
            ...form.data.theme_colors,
            preset: preset.id,
            primary_50: preset.primary_50,
            primary_100: preset.primary_100,
            primary_200: preset.primary_200,
            primary_300: preset.primary_300,
            primary_400: preset.primary_400,
            primary_500: preset.primary_500,
            primary_600: preset.primary_600,
            primary_700: preset.primary_700,
            primary_800: preset.primary_800,
            primary_900: preset.primary_900,
            secondary_50: preset.secondary_50,
            secondary_100: preset.secondary_100,
            secondary_200: preset.secondary_200,
            secondary_300: preset.secondary_300,
            secondary_400: preset.secondary_400,
            secondary_500: preset.secondary_500,
            secondary_600: preset.secondary_600,
            secondary_700: preset.secondary_700,
            bg_light: preset.bg_light,
            bg_dark: preset.bg_dark,
            surface_light: preset.surface_light,
            surface_dark: preset.surface_dark,
            border_light: preset.border_light,
            border_dark: preset.border_dark,
            text_main_light: preset.text_main_light,
            text_muted_light: preset.text_muted_light,
            text_main_dark: preset.text_main_dark,
            text_muted_dark: preset.text_muted_dark,
        });
    };

    const tabs = [
        { id: 'general', label: 'General & Identity', icon: Globe },
        { id: 'branding', label: 'Branding Assets', icon: ImageIcon },
        { id: 'typography', label: 'Tipografi & Font', icon: Type },
        { id: 'colors', label: 'Palet Warna & Layout', icon: Palette },
        { id: 'seo', label: 'SEO & Search Preview', icon: Search },
        { id: 'contact', label: 'Contact & Location', icon: MapPin },
        { id: 'socials', label: 'Social Networks', icon: Share2 },
    ];

    const renderAssetBox = (title, key, description, dimensions) => {
        const val = form.data[key];
        const previewUrl =
            typeof val === 'string'
                ? val
                : val instanceof File
                  ? URL.createObjectURL(val)
                  : null;

        return (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 transition hover:border-slate-300 dark:hover:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            {title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                        <span className="mt-1.5 inline-block text-[11px] font-mono text-slate-400">
                            {dimensions}
                        </span>
                    </div>

                    {previewUrl && (
                        <button
                            type="button"
                            onClick={() => form.setData(key, '')}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition"
                            title="Remove asset"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-4">
                    {previewUrl ? (
                        <div className="relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/50">
                            <img
                                src={previewUrl}
                                alt={title}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20 text-slate-400">
                            <ImageIcon className="h-6 w-6 stroke-[1.5]" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            icon={ImageIcon}
                            onClick={() => setMediaPickerTarget(key)}
                        >
                            Media Library
                        </Button>
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition">
                            <Upload className="mr-1.5 h-3.5 w-3.5" />
                            Upload New
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        form.setData(key, e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Web, Tipografi & Palet Warna" />

            <form onSubmit={submit} className="space-y-6 max-w-7xl mx-auto pb-16">
                <PageHeader
                    title="Pengaturan Web & Visual Design"
                    description="Kelola identitas situs, tipografi lengkap, dan sistem palet warna global yang tersinkronisasi di seluruh website."
                    action={
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Save}
                            loading={form.processing}
                        >
                            Simpan Perubahan
                        </Button>
                    }
                />

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                    active
                                        ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab: General */}
                {activeTab === 'general' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Identitas Dasar Situs
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Nama institusi kampus dan slogan utama yang tampil di header dan footer.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Input
                                    label="Nama Kampus / Situs"
                                    value={form.data.site_title}
                                    onChange={(e) => form.setData('site_title', e.target.value)}
                                    placeholder="Institut Teknologi Bandung Tuban"
                                    error={form.errors.site_title}
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Input
                                    label="Slogan / Tagline"
                                    value={form.data.slogan}
                                    onChange={(e) => form.setData('slogan', e.target.value)}
                                    placeholder="Unggul, Inovatif, dan Berkarakter Menuju Kemandirian Bangsa"
                                    error={form.errors.slogan}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Textarea
                                    label="Deskripsi Singkat"
                                    rows={3}
                                    value={form.data.short_description}
                                    onChange={(e) => form.setData('short_description', e.target.value)}
                                    placeholder="Ringkasan tentang profil perguruan tinggi..."
                                    error={form.errors.short_description}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Branding */}
                {activeTab === 'branding' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Aset Branding Kampus
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Logo resmi, ikon navigasi, favicon browser, dan gambar open graph meta.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {renderAssetBox(
                                'Main Site Logo',
                                'logo',
                                'Logo utama berlatar transparan untuk header navigasi.',
                                'Recommended: 240x60px PNG/SVG'
                            )}
                            {renderAssetBox(
                                'Small Icon / Badge',
                                'icon',
                                'Simbol kampus kotak untuk mobile header atau avatar.',
                                'Recommended: 128x128px PNG/SVG'
                            )}
                            {renderAssetBox(
                                'Browser Favicon',
                                'favicon',
                                'Ikon kecil tab browser.',
                                'Recommended: 32x32px or 64x64px ICO/PNG'
                            )}
                            {renderAssetBox(
                                'Social Meta Thumbnail',
                                'meta_thumbnail',
                                'Pratinjau visual banner saat link situs dibagikan ke WhatsApp / sosmed.',
                                'Recommended: 1200x630px JPG/PNG'
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Typography & Font */}
                {activeTab === 'typography' && (
                    <div className="space-y-6">
                        <div className="surface-card p-6 space-y-6">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Type className="h-4 w-4 text-primary-500" />
                                        Konfigurasi Tipografi & Jenis Font
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Atur jenis font, proporsi ukuran heading (H1-H4), body text, dan line height secara menyeluruh.
                                    </p>
                                </div>
                            </div>

                            {/* Font Family Selection */}
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Font Body / Teks Utama (Sans)
                                    </label>
                                    <select
                                        value={form.data.theme_typography.font_sans}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                font_sans: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {FONT_OPTIONS_SANS.map((f) => (
                                            <option key={f.value} value={f.value}>
                                                {f.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-[11px] text-slate-400 mt-1 block">
                                        Digunakan untuk navigasi, tombol, teks paragraf, dan elemen UI.
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Font Heading / Judul Bagian
                                    </label>
                                    <select
                                        value={form.data.theme_typography.font_heading}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                font_heading: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        {FONT_OPTIONS_HEADING.map((f) => (
                                            <option key={f.value} value={f.value}>
                                                {f.label}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-[11px] text-slate-400 mt-1 block">
                                        Digunakan untuk judul hero slider, section title, dan nama artikel.
                                    </span>
                                </div>
                            </div>

                            {/* Font Sizes Grid */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                                    Skala Ukuran Huruf (Font Sizing)
                                </h4>
                                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                    <Input
                                        label="Heading 1 (H1)"
                                        value={form.data.theme_typography.h1_size}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                h1_size: e.target.value,
                                            })
                                        }
                                        placeholder="3.25rem"
                                    />
                                    <Input
                                        label="Heading 2 (H2)"
                                        value={form.data.theme_typography.h2_size}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                h2_size: e.target.value,
                                            })
                                        }
                                        placeholder="2.25rem"
                                    />
                                    <Input
                                        label="Heading 3 (H3)"
                                        value={form.data.theme_typography.h3_size}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                h3_size: e.target.value,
                                            })
                                        }
                                        placeholder="1.5rem"
                                    />
                                    <Input
                                        label="Heading 4 (H4)"
                                        value={form.data.theme_typography.h4_size}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                h4_size: e.target.value,
                                            })
                                        }
                                        placeholder="1.25rem"
                                    />
                                    <Input
                                        label="Paragraf (Body)"
                                        value={form.data.theme_typography.body_size}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                body_size: e.target.value,
                                            })
                                        }
                                        placeholder="1rem"
                                    />
                                    <Input
                                        label="Teks Kecil (Small)"
                                        value={form.data.theme_typography.small_size}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                small_size: e.target.value,
                                            })
                                        }
                                        placeholder="0.875rem"
                                    />
                                </div>
                            </div>

                            {/* Weight and Line Height */}
                            <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 dark:border-slate-800 pt-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Ketebalan Heading Utama (H1 Weight)
                                    </label>
                                    <select
                                        value={form.data.theme_typography.h1_weight}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                h1_weight: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="600">Semi-Bold (600)</option>
                                        <option value="700">Bold (700)</option>
                                        <option value="800">Extra-Bold (800 - Rekomendasi)</option>
                                        <option value="900">Black (900)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Kerapatan Baris Teks (Body Line Height)
                                    </label>
                                    <select
                                        value={form.data.theme_typography.body_line_height}
                                        onChange={(e) =>
                                            form.setData('theme_typography', {
                                                ...form.data.theme_typography,
                                                body_line_height: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="1.5">Normal (1.5)</option>
                                        <option value="1.65">Proporsional Nyaman (1.65 - Rekomendasi)</option>
                                        <option value="1.75">Renggang Santai (1.75)</option>
                                        <option value="1.85">Editorial Longgar (1.85)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Typography Live Preview */}
                        <div className="surface-card p-6 bg-slate-50/60 dark:bg-slate-900/40 border-dashed">
                            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <Eye className="h-4 w-4 text-primary-500" />
                                Pratinjau Tipografi Langsung (Live Typography Preview)
                            </div>
                            <div
                                className="space-y-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 dark:bg-slate-950 dark:border-slate-800"
                                style={{
                                    fontFamily: `"${form.data.theme_typography.font_sans}", sans-serif`,
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: `"${form.data.theme_typography.font_heading}", sans-serif`,
                                        fontSize: form.data.theme_typography.h1_size,
                                        fontWeight: form.data.theme_typography.h1_weight,
                                        lineHeight: 1.15,
                                    }}
                                    className="text-slate-900 dark:text-white"
                                >
                                    Contoh Heading 1 Kampus Inovatif
                                </div>
                                <div
                                    style={{
                                        fontFamily: `"${form.data.theme_typography.font_heading}", sans-serif`,
                                        fontSize: form.data.theme_typography.h2_size,
                                        fontWeight: '700',
                                        lineHeight: 1.25,
                                    }}
                                    className="text-slate-800 dark:text-slate-100"
                                >
                                    Contoh Heading 2 Bagian Program Studi
                                </div>
                                <div
                                    style={{
                                        fontSize: form.data.theme_typography.body_size,
                                        lineHeight: form.data.theme_typography.body_line_height,
                                    }}
                                    className="text-slate-600 dark:text-slate-300 max-w-3xl"
                                >
                                    Ini adalah simulasi teks tubuh paragraf yang mencerminkan keterbacaan, proporsi spasi, dan harmoni tipografi di seluruh halaman web kampus. Tipografi yang tepat memastikan pengunjung dapat menyerap informasi dengan nyaman.
                                </div>
                                <div
                                    style={{ fontSize: form.data.theme_typography.small_size }}
                                    className="text-slate-400 dark:text-slate-500 font-medium"
                                >
                                    Teks kecil / keterangan metadata tanggal rilis: 08 Oktober 2026 • Kategori Berita Utama
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Colors & Palette Management */}
                {activeTab === 'colors' && (
                    <div className="space-y-6">
                        {/* Presets Selection */}
                        <div className="surface-card p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                        Tema & Palet Siap Pakai (Preset Themes)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Pilih preset tema terkurasi atau sesuaikan warna secara manual di bawah.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {PRESET_THEMES.map((preset) => {
                                    const isSelected = form.data.theme_colors.preset === preset.id;
                                    return (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => applyColorPreset(preset)}
                                            className={`flex flex-col text-left rounded-2xl p-4 border transition ${
                                                isSelected
                                                    ? 'border-primary-500 bg-primary-50/40 ring-2 ring-primary-500/20 dark:bg-primary-950/20 dark:border-primary-400'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-2">
                                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                    {preset.name}
                                                </span>
                                                {isSelected && (
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                                                        <Check className="h-3 w-3" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                                                {preset.desc}
                                            </p>
                                            <div className="mt-auto flex items-center gap-1.5">
                                                <div
                                                    className="h-6 flex-1 rounded-md shadow-sm"
                                                    style={{ backgroundColor: preset.primary_500 }}
                                                    title="Primary 500"
                                                />
                                                <div
                                                    className="h-6 flex-1 rounded-md shadow-sm"
                                                    style={{ backgroundColor: preset.primary_700 }}
                                                    title="Primary 700"
                                                />
                                                <div
                                                    className="h-6 flex-1 rounded-md shadow-sm"
                                                    style={{ backgroundColor: preset.secondary_400 }}
                                                    title="Secondary 400"
                                                />
                                                <div
                                                    className="h-6 flex-1 rounded-md shadow-sm"
                                                    style={{ backgroundColor: preset.secondary_500 }}
                                                    title="Secondary 500"
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Detailed Color Pickers: Primary & Secondary Scales */}
                        <div className="surface-card p-6 space-y-6">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-primary-500" />
                                    Skala Palet Warna Primer (Primary Scale)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Warna dominan untuk tombol aksi, header brand, hover state, dan aksen latar utama.
                                </p>
                            </div>

                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 lg:grid-cols-10">
                                {[
                                    { key: 'primary_50', label: '50 (Tint)' },
                                    { key: 'primary_100', label: '100' },
                                    { key: 'primary_200', label: '200' },
                                    { key: 'primary_300', label: '300' },
                                    { key: 'primary_400', label: '400' },
                                    { key: 'primary_500', label: '500 (Base)' },
                                    { key: 'primary_600', label: '600 (Hover)' },
                                    { key: 'primary_700', label: '700' },
                                    { key: 'primary_800', label: '800' },
                                    { key: 'primary_900', label: '900 (Deep)' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                                            {label}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="color"
                                                value={form.data.theme_colors[key] || '#0284c7'}
                                                onChange={(e) =>
                                                    form.setData('theme_colors', {
                                                        ...form.data.theme_colors,
                                                        [key]: e.target.value,
                                                    })
                                                }
                                                className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={form.data.theme_colors[key] || ''}
                                                onChange={(e) =>
                                                    form.setData('theme_colors', {
                                                        ...form.data.theme_colors,
                                                        [key]: e.target.value,
                                                    })
                                                }
                                                className="w-full text-[11px] font-mono px-1.5 py-1 rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Secondary / Accent Scale */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Skala Palet Warna Sekunder & Aksen (Secondary Scale)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Warna aksen hangat (emas, amber, highlight) untuk badge sorotan, bintang review, dan CTA pelengkap.
                                    </p>
                                </div>

                                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
                                    {[
                                        { key: 'secondary_50', label: '50' },
                                        { key: 'secondary_100', label: '100' },
                                        { key: 'secondary_200', label: '200' },
                                        { key: 'secondary_300', label: '300' },
                                        { key: 'secondary_400', label: '400 (Highlight)' },
                                        { key: 'secondary_500', label: '500 (Base Gold)' },
                                        { key: 'secondary_600', label: '600' },
                                        { key: 'secondary_700', label: '700' },
                                    ].map(({ key, label }) => (
                                        <div key={key} className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                {label}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="color"
                                                    value={form.data.theme_colors[key] || '#f59e0b'}
                                                    onChange={(e) =>
                                                        form.setData('theme_colors', {
                                                            ...form.data.theme_colors,
                                                            [key]: e.target.value,
                                                        })
                                                    }
                                                    className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={form.data.theme_colors[key] || ''}
                                                    onChange={(e) =>
                                                        form.setData('theme_colors', {
                                                            ...form.data.theme_colors,
                                                            [key]: e.target.value,
                                                        })
                                                    }
                                                    className="w-full text-[11px] font-mono px-1.5 py-1 rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Background & Surface Colors */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                                    Warna Latar (Surface & Background)
                                </h4>
                                <div className="grid gap-4 sm:grid-cols-4">
                                    {[
                                        { key: 'bg_light', label: 'Background Mode Terang' },
                                        { key: 'bg_dark', label: 'Background Mode Gelap' },
                                        { key: 'surface_light', label: 'Card Surface Terang' },
                                        { key: 'surface_dark', label: 'Card Surface Gelap' },
                                    ].map(({ key, label }) => (
                                        <div key={key} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                {label}
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={form.data.theme_colors[key] || '#ffffff'}
                                                    onChange={(e) =>
                                                        form.setData('theme_colors', {
                                                            ...form.data.theme_colors,
                                                            [key]: e.target.value,
                                                        })
                                                    }
                                                    className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={form.data.theme_colors[key] || ''}
                                                    onChange={(e) =>
                                                        form.setData('theme_colors', {
                                                            ...form.data.theme_colors,
                                                            [key]: e.target.value,
                                                        })
                                                    }
                                                    className="w-full text-xs font-mono px-2 py-1 rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Layout & Container Configuration */}
                        <div className="surface-card p-6 space-y-5">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Maximize2 className="h-4 w-4 text-primary-500" />
                                    Standarisasi Container & Grid Layout
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Mengatur batas lebar maksimal kontainer dan padding horizontal agar seluruh halaman sinkron tanpa pergeseran.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Lebar Maksimal Kontainer (Site Max-Width)
                                    </label>
                                    <select
                                        value={form.data.theme_layout.container_max_width}
                                        onChange={(e) =>
                                            form.setData('theme_layout', {
                                                ...form.data.theme_layout,
                                                container_max_width: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="1280px">1280px (Standard Max-w-7xl)</option>
                                        <option value="1400px">1400px (Spacious ITB Canvas - Rekomendasi)</option>
                                        <option value="1536px">1536px (Ultra Wide 2XL)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Padding Sisi Desktop (Container PX)
                                    </label>
                                    <select
                                        value={form.data.theme_layout.container_padding_desktop}
                                        onChange={(e) =>
                                            form.setData('theme_layout', {
                                                ...form.data.theme_layout,
                                                container_padding_desktop: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="1.5rem">1.5rem (24px)</option>
                                        <option value="2rem">2rem (32px - Standar Harmonis)</option>
                                        <option value="2.5rem">2.5rem (40px - Ekstra Luas)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Kelengkungan Kartu (Card Radius)
                                    </label>
                                    <select
                                        value={form.data.theme_layout.card_radius}
                                        onChange={(e) =>
                                            form.setData('theme_layout', {
                                                ...form.data.theme_layout,
                                                card_radius: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <option value="1rem">1rem (16px Modern)</option>
                                        <option value="1.25rem">1.25rem (20px Rounded)</option>
                                        <option value="1.5rem">1.5rem (24px Smooth - Rekomendasi)</option>
                                        <option value="2rem">2rem (32px Pill Soft)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Color Live Preview */}
                        <div className="surface-card p-6 bg-slate-50/60 dark:bg-slate-900/40 border-dashed">
                            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <Eye className="h-4 w-4 text-primary-500" />
                                Pratinjau Komponen Tema Langsung (Live Theme Components Preview)
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div
                                    className="rounded-2xl p-6 border shadow-sm space-y-4"
                                    style={{
                                        backgroundColor: form.data.theme_colors.surface_light,
                                        borderColor: form.data.theme_colors.border_light,
                                        borderRadius: form.data.theme_layout.card_radius,
                                    }}
                                >
                                    <span
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                                        style={{
                                            backgroundColor: form.data.theme_colors.secondary_100,
                                            color: form.data.theme_colors.secondary_700,
                                        }}
                                    >
                                        Aksen Sekunder
                                    </span>
                                    <h4
                                        className="text-lg font-bold"
                                        style={{ color: form.data.theme_colors.primary_800 }}
                                    >
                                        Kartu Komponen Kampus Terpadu
                                    </h4>
                                    <p
                                        className="text-sm"
                                        style={{ color: form.data.theme_colors.text_muted_light }}
                                    >
                                        Sinkronisasi palet memastikan seluruh tombol, kartu, dan teks menggunakan variabel warna yang harmonis.
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                                            style={{
                                                backgroundColor: form.data.theme_colors.primary_500,
                                                borderRadius: form.data.theme_layout.button_radius,
                                            }}
                                        >
                                            Tombol Primer
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:opacity-90"
                                            style={{
                                                backgroundColor: form.data.theme_colors.secondary_400,
                                                borderRadius: form.data.theme_layout.button_radius,
                                            }}
                                        >
                                            Tombol Sekunder
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className="rounded-2xl p-6 border shadow-sm space-y-4"
                                    style={{
                                        backgroundColor: form.data.theme_colors.bg_dark,
                                        borderColor: form.data.theme_colors.border_dark,
                                        borderRadius: form.data.theme_layout.card_radius,
                                    }}
                                >
                                    <span
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                                        style={{
                                            backgroundColor: `${form.data.theme_colors.secondary_500}33`,
                                            color: form.data.theme_colors.secondary_300,
                                        }}
                                    >
                                        Aksen Mode Gelap
                                    </span>
                                    <h4
                                        className="text-lg font-bold"
                                        style={{ color: form.data.theme_colors.primary_200 }}
                                    >
                                        Mode Gelap & Header Malam
                                    </h4>
                                    <p
                                        className="text-sm"
                                        style={{ color: form.data.theme_colors.text_muted_dark }}
                                    >
                                        Kontras optimal terjaga di setiap latar gelap maupun terang di seluruh penjuru aplikasi.
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                                            style={{
                                                backgroundColor: form.data.theme_colors.primary_600,
                                                borderRadius: form.data.theme_layout.button_radius,
                                            }}
                                        >
                                            Aksi Utama
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: SEO */}
                {activeTab === 'seo' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Search Engine Optimization (SEO)
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Konfigurasi meta tag agar situs terindeks dengan baik di Google.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Textarea
                                label="Meta Description"
                                rows={3}
                                value={form.data.meta_description}
                                onChange={(e) => form.setData('meta_description', e.target.value)}
                                placeholder="Deskripsi meta untuk hasil pencarian Google..."
                                error={form.errors.meta_description}
                            />

                            <Input
                                label="Meta Keywords (Pisahkan dengan koma)"
                                value={form.data.meta_keywords}
                                onChange={(e) => form.setData('meta_keywords', e.target.value)}
                                placeholder="kampus tuban, itb tuban, teknologi informasi, teknik industri"
                                error={form.errors.meta_keywords}
                            />
                        </div>
                    </div>
                )}

                {/* Tab: Contact */}
                {activeTab === 'contact' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Informasi Kontak & Lokasi Kampus
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ditampilkan pada header kontak cepat, footer, dan laman hubungi kami.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Email Kontak Resmi"
                                type="email"
                                value={form.data.contact_email}
                                onChange={(e) => form.setData('contact_email', e.target.value)}
                                placeholder="humas@itbtuban.ac.id"
                                error={form.errors.contact_email}
                            />
                            <Input
                                label="Nomor Telepon / Call Center"
                                value={form.data.contact_phone}
                                onChange={(e) => form.setData('contact_phone', e.target.value)}
                                placeholder="(0356) 123456"
                                error={form.errors.contact_phone}
                            />
                            <Input
                                label="Nomor WhatsApp Hotline"
                                value={form.data.whatsapp_number}
                                onChange={(e) => form.setData('whatsapp_number', e.target.value)}
                                placeholder="08123456789"
                                error={form.errors.whatsapp_number}
                            />
                            <Input
                                label="Tautan Google Maps Embed / Link"
                                value={form.data.google_maps_url}
                                onChange={(e) => form.setData('google_maps_url', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                error={form.errors.google_maps_url}
                            />
                            <div className="sm:col-span-2">
                                <Textarea
                                    label="Alamat Kampus Lengkap"
                                    rows={2}
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    placeholder="Jl. Raya Tuban KM. 5, Tuban, Jawa Timur"
                                    error={form.errors.address}
                                />
                            </div>
                            <Input
                                label="Kota / Kabupaten"
                                value={form.data.city}
                                onChange={(e) => form.setData('city', e.target.value)}
                                placeholder="Tuban"
                                error={form.errors.city}
                            />
                            <Input
                                label="Provinsi"
                                value={form.data.province}
                                onChange={(e) => form.setData('province', e.target.value)}
                                placeholder="Jawa Timur"
                                error={form.errors.province}
                            />
                        </div>
                    </div>
                )}

                {/* Tab: Social Networks */}
                {activeTab === 'socials' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Tautan Media Sosial Resmi
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ikon sosial media di header dan footer akan otomatis mengarah ke akun-akun ini.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Instagram"
                                value={form.data.instagram_url}
                                onChange={(e) => form.setData('instagram_url', e.target.value)}
                                placeholder="https://instagram.com/itbtuban"
                                error={form.errors.instagram_url}
                            />
                            <Input
                                label="TikTok"
                                value={form.data.tiktok_url}
                                onChange={(e) => form.setData('tiktok_url', e.target.value)}
                                placeholder="https://tiktok.com/@itbtuban"
                                error={form.errors.tiktok_url}
                            />
                            <Input
                                label="YouTube"
                                value={form.data.youtube_url}
                                onChange={(e) => form.setData('youtube_url', e.target.value)}
                                placeholder="https://youtube.com/@itbtuban"
                                error={form.errors.youtube_url}
                            />
                            <Input
                                label="X (Twitter)"
                                value={form.data.x_url}
                                onChange={(e) => form.setData('x_url', e.target.value)}
                                placeholder="https://x.com/itbtuban"
                                error={form.errors.x_url}
                            />
                            <Input
                                label="Facebook"
                                value={form.data.facebook_url}
                                onChange={(e) => form.setData('facebook_url', e.target.value)}
                                placeholder="https://facebook.com/itbtuban"
                                error={form.errors.facebook_url}
                            />
                            <Input
                                label="LinkedIn"
                                value={form.data.linkedin_url}
                                onChange={(e) => form.setData('linkedin_url', e.target.value)}
                                placeholder="https://linkedin.com/school/itbtuban"
                                error={form.errors.linkedin_url}
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Threads"
                                    value={form.data.threads_url}
                                    onChange={(e) => form.setData('threads_url', e.target.value)}
                                    placeholder="https://threads.net/@itbtuban"
                                    error={form.errors.threads_url}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Media Picker Modal */}
            <MediaPickerModal
                show={Boolean(mediaPickerTarget)}
                onClose={() => setMediaPickerTarget(null)}
                onSelect={handleMediaSelect}
                title={`Select ${mediaPickerTarget?.replace('_', ' ')?.toUpperCase()}`}
            />
        </AuthenticatedLayout>
    );
}
