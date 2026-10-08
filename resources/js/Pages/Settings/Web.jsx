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
    Check,
    Upload,
    ExternalLink,
    X,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function WebSettings({ setting }) {
    const [activeTab, setActiveTab] = useState('general');
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // 'logo' | 'icon' | 'favicon' | 'meta_thumbnail' | null

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
                    title: 'Web settings updated successfully',
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

    const tabs = [
        { id: 'general', label: 'General & Identity', icon: Globe },
        { id: 'branding', label: 'Branding Assets', icon: ImageIcon },
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
                            Direct Upload
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
            <Head title="Web Settings" />

            <form onSubmit={submit} className="space-y-6">
                <PageHeader
                    title="Website Settings"
                    subtitle="Manage global branding identity, SEO configuration, contacts and social integrations"
                    actions={
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Save}
                            loading={form.processing}
                        >
                            Save Settings
                        </Button>
                    }
                />

                {/* Modern Navigation Tabs */}
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
                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
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
                                Basic Information
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Global website title and primary taglines.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Input
                                    label="Site Title"
                                    value={form.data.site_title}
                                    onChange={(e) => form.setData('site_title', e.target.value)}
                                    placeholder="e.g. Apparel Studio CMS"
                                    error={form.errors.site_title}
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Input
                                    label="Slogan / Tagline"
                                    value={form.data.slogan}
                                    onChange={(e) => form.setData('slogan', e.target.value)}
                                    placeholder="e.g. Modern Minimalist Fashion & Editorial Stories"
                                    error={form.errors.slogan}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Textarea
                                    label="Short Description"
                                    rows={3}
                                    value={form.data.short_description}
                                    onChange={(e) => form.setData('short_description', e.target.value)}
                                    placeholder="A concise description used across the site footer and about widgets..."
                                    error={form.errors.short_description}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Branding */}
                {activeTab === 'branding' && (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {renderAssetBox(
                                'Main Brand Logo',
                                'logo',
                                'Main brand logo for the navbar and dark/light headers.',
                                'Recommended: SVG or PNG, transparent background'
                            )}
                            {renderAssetBox(
                                'Favicon',
                                'favicon',
                                'Browser tab icon bookmark symbol.',
                                'Recommended: 32x32px or 64x64px .ico / .png'
                            )}
                            {renderAssetBox(
                                'App Icon / Mobile Icon',
                                'icon',
                                'Square icon for PWA, bookmarks, or mobile homescreen.',
                                'Recommended: 512x512px PNG'
                            )}
                            {renderAssetBox(
                                'Meta / OpenGraph Image',
                                'meta_thumbnail',
                                'Image shown when links are shared on Twitter, WhatsApp, FB.',
                                'Recommended: 1200x630px JPG/WebP'
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: SEO */}
                {activeTab === 'seo' && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="surface-card p-6 space-y-5 lg:col-span-2">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Search Engine Optimization (SEO)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Configure metadata tags that appear in Google, Bing and social platforms.
                                </p>
                            </div>

                            <Textarea
                                label="Meta Description"
                                rows={4}
                                value={form.data.meta_description}
                                onChange={(e) => form.setData('meta_description', e.target.value)}
                                placeholder="Describe your publication in 150-160 characters for high search click-through rates..."
                                error={form.errors.meta_description}
                            />

                            <Textarea
                                label="Meta Keywords"
                                rows={3}
                                value={form.data.meta_keywords}
                                onChange={(e) => form.setData('meta_keywords', e.target.value)}
                                placeholder="apparel, streetwear, editorial, high fashion, lifestyle"
                                error={form.errors.meta_keywords}
                            />
                        </div>

                        {/* Live Google Search Snippet Preview */}
                        <div className="surface-card p-6 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Google SERP Preview
                            </h3>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-indigo-600 dark:bg-slate-800">
                                        W
                                    </span>
                                    <div className="flex flex-col text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                            {form.data.site_title || 'Your Site Title'}
                                        </span>
                                        <span className="truncate text-slate-400 font-mono text-[10px]">
                                            https://yoursite.com
                                        </span>
                                    </div>
                                </div>
                                <h4 className="mt-2 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer">
                                    {form.data.site_title || 'Site Title'} - {form.data.slogan || 'Official Website'}
                                </h4>
                                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                    {form.data.meta_description ||
                                        'Provide a meta description above to preview how your site snippet appears to searchers on Google.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Contact & Location */}
                {activeTab === 'contact' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Contact Information & Address
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                These details are displayed across your website header, footer and contact pages.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Input
                                label="Contact Email"
                                type="email"
                                value={form.data.contact_email}
                                onChange={(e) => form.setData('contact_email', e.target.value)}
                                placeholder="hello@brand.com"
                                error={form.errors.contact_email}
                            />
                            <Input
                                label="Phone Number"
                                value={form.data.contact_phone}
                                onChange={(e) => form.setData('contact_phone', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                error={form.errors.contact_phone}
                            />
                            <Input
                                label="WhatsApp Number"
                                value={form.data.whatsapp_number}
                                onChange={(e) => form.setData('whatsapp_number', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                error={form.errors.whatsapp_number}
                            />

                            <div className="sm:col-span-3">
                                <Textarea
                                    label="Street Address"
                                    rows={2}
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    placeholder="Jalan Kemang Raya No. 12, South Jakarta"
                                    error={form.errors.address}
                                />
                            </div>

                            <Input
                                label="City"
                                value={form.data.city}
                                onChange={(e) => form.setData('city', e.target.value)}
                                placeholder="Jakarta Selatan"
                                error={form.errors.city}
                            />
                            <Input
                                label="Province / State"
                                value={form.data.province}
                                onChange={(e) => form.setData('province', e.target.value)}
                                placeholder="DKI Jakarta"
                                error={form.errors.province}
                            />
                            <Input
                                label="Postal Code"
                                value={form.data.postal_code}
                                onChange={(e) => form.setData('postal_code', e.target.value)}
                                placeholder="12730"
                                error={form.errors.postal_code}
                            />

                            <div className="sm:col-span-3">
                                <Input
                                    label="Country"
                                    value={form.data.country}
                                    onChange={(e) => form.setData('country', e.target.value)}
                                    placeholder="Indonesia"
                                    error={form.errors.country}
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <Input
                                    label="Google Maps Embed / URL"
                                    value={form.data.google_maps_url}
                                    onChange={(e) => form.setData('google_maps_url', e.target.value)}
                                    placeholder="https://maps.google.com/?q=..."
                                    error={form.errors.google_maps_url}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Socials */}
                {activeTab === 'socials' && (
                    <div className="surface-card p-6 space-y-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Social Media Links
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Leave blank any channels you do not actively maintain.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Instagram"
                                value={form.data.instagram_url}
                                onChange={(e) => form.setData('instagram_url', e.target.value)}
                                placeholder="https://instagram.com/brand"
                                error={form.errors.instagram_url}
                            />
                            <Input
                                label="TikTok"
                                value={form.data.tiktok_url}
                                onChange={(e) => form.setData('tiktok_url', e.target.value)}
                                placeholder="https://tiktok.com/@brand"
                                error={form.errors.tiktok_url}
                            />
                            <Input
                                label="YouTube"
                                value={form.data.youtube_url}
                                onChange={(e) => form.setData('youtube_url', e.target.value)}
                                placeholder="https://youtube.com/@brand"
                                error={form.errors.youtube_url}
                            />
                            <Input
                                label="X (Twitter)"
                                value={form.data.x_url}
                                onChange={(e) => form.setData('x_url', e.target.value)}
                                placeholder="https://x.com/brand"
                                error={form.errors.x_url}
                            />
                            <Input
                                label="Facebook"
                                value={form.data.facebook_url}
                                onChange={(e) => form.setData('facebook_url', e.target.value)}
                                placeholder="https://facebook.com/brand"
                                error={form.errors.facebook_url}
                            />
                            <Input
                                label="LinkedIn"
                                value={form.data.linkedin_url}
                                onChange={(e) => form.setData('linkedin_url', e.target.value)}
                                placeholder="https://linkedin.com/company/brand"
                                error={form.errors.linkedin_url}
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Threads"
                                    value={form.data.threads_url}
                                    onChange={(e) => form.setData('threads_url', e.target.value)}
                                    placeholder="https://threads.net/@brand"
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
