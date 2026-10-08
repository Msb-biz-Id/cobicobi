import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Save,
    Calendar,
    MapPin,
    Link as LinkIcon,
    Users,
    Image as ImageIcon,
    Plus,
    Trash2,
    Globe,
    Phone,
    Mail,
    Eye,
    ExternalLink,
    Clock,
    Sparkles,
} from 'lucide-react';
import Button from '@/Components/UI/Button';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';
import WordPressTagSelector from '@/Components/Editor/WordPressTagSelector';
import QuickCreateCategoryModal from '@/Components/Editor/QuickCreateCategoryModal';
import ContentPreviewModal from '@/Components/Editor/ContentPreviewModal';

export default function Edit({ event, categories = [], hashtags = [] }) {
    const isEdit = Boolean(event?.id);
    const [categoriesList, setCategoriesList] = useState(categories);
    const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [scheduleMode, setScheduleMode] = useState(Boolean(event?.published_at));

    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title || '',
        slug: event?.slug || '',
        category_id: event?.category_id || (categories[0]?.id || ''),
        category: event?.category || (categories[0]?.name || 'Seminar'),
        hashtag_ids: event?.hashtag_ids || [],
        new_hashtags: [],
        organizer: event?.organizer || '',
        status: event?.status || 'published',
        published_at: event?.published_at ? event.published_at.substring(0, 16) : '',
        cover_image_path: event?.cover_image_path || '',
        summary: event?.summary || '',
        description: event?.description || '',
        start_date: event?.start_date ? event.start_date.substring(0, 16) : '',
        end_date: event?.end_date ? event.end_date.substring(0, 16) : '',
        event_type: event?.event_type || 'offline',
        venue_name: event?.venue_name || '',
        address: event?.address || '',
        maps_url: event?.maps_url || '',
        registration_type: event?.registration_type || 'free',
        price: event?.price || 'Gratis',
        registration_url: event?.registration_url || '',
        registration_button_label: event?.registration_button_label || 'Daftar Sekarang',
        registration_deadline: event?.registration_deadline ? event.registration_deadline.substring(0, 16) : '',
        quota: event?.quota || '',
        sponsors: Array.isArray(event?.sponsors) ? event.sponsors : [],
        contact_name: event?.contact_name || '',
        contact_phone: event?.contact_phone || '',
        contact_email: event?.contact_email || '',
    });

    const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
    const [sponsorLogoPickerIndex, setSponsorLogoPickerIndex] = useState(null);

    const handleCategoryCreated = (newCat) => {
        setCategoriesList((prev) => [...prev, newCat]);
        setData((prev) => ({
            ...prev,
            category_id: newCat.id,
            category: newCat.name,
        }));
    };

    const handlePublishDateChange = (val) => {
        setData((prev) => {
            const next = { ...prev, published_at: val };
            if (val) {
                const targetDate = new Date(val);
                if (targetDate > new Date()) {
                    next.status = 'scheduled';
                }
            }
            return next;
        });
    };

    // Auto-generate slug from title
    const handleTitleChange = (val) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        }));
    };

    // Calculate live embed URL for Maps preview
    const liveMapsEmbedUrl = useMemo(() => {
        const input = (data.maps_url || '').trim();
        if (input) {
            const match = input.match(/src=["']([^"']+)["']/);
            if (match) return match[1];
            if (input.includes('google.com/maps/embed')) return input;
            if (input.includes('q=')) {
                try {
                    const parsed = new URL(input);
                    const q = parsed.searchParams.get('q');
                    if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                } catch {}
            }
            return `https://maps.google.com/maps?q=${encodeURIComponent(input)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        const fallbackQuery = `${data.venue_name || ''} ${data.address || ''}`.trim();
        if (fallbackQuery && data.event_type !== 'online') {
            return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        return null;
    }, [data.maps_url, data.venue_name, data.address, data.event_type]);

    // Sponsor Repeater Handlers
    const addSponsor = () => {
        setData('sponsors', [
            ...data.sponsors,
            { name: '', type: 'Supported by', logo_url: '', website_url: '' },
        ]);
    };

    const updateSponsor = (index, field, value) => {
        const next = [...data.sponsors];
        next[index][field] = value;
        setData('sponsors', next);
    };

    const removeSponsor = (index) => {
        setData('sponsors', data.sponsors.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('events.update', event.id));
        } else {
            post(route('events.store'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEdit ? `Edit Event: ${data.title}` : 'Buat Event Kampus Baru'} />

            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header Action Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md py-3 dark:bg-[#090d16]/90 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('events.index')}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {isEdit ? 'Edit Event Kampus' : 'Jadwalkan Event Kampus'}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Konferensi, seminar, wisuda, link pendaftaran kustom & sponsor partnership.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewModalOpen(true)}
                            className="gap-1.5"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Pratinjau
                        </Button>
                        {isEdit && (
                            <Link
                                href={route('public.events.show', event.slug || event.id)}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Buka di Tab Baru
                            </Link>
                        )}
                        <Button type="submit" size="sm" variant="primary" disabled={processing} className="gap-1.5">
                            <Save className="h-4 w-4" />
                            {processing
                                ? 'Menyimpan...'
                                : data.status === 'scheduled' || (data.published_at && new Date(data.published_at) > new Date())
                                ? 'Jadwalkan Event'
                                : isEdit
                                ? 'Perbarui Event'
                                : 'Terbitkan Event'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Core Event Content (2 cols) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Title & Basic Information */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Judul Event Kampus *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Contoh: International Conference on Artificial Intelligence 2026"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Slug URL
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="slug-event"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                    />
                                    {errors.slug && <p className="text-xs text-rose-500 mt-1">{errors.slug}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Penyelenggara (Organizer)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.organizer}
                                        onChange={(e) => setData('organizer', e.target.value)}
                                        placeholder="Contoh: BEM Fakultas Ilmu Komputer / LPPM"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Ringkasan Singkat (Summary)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.summary}
                                    onChange={(e) => setData('summary', e.target.value)}
                                    placeholder="Tulis ringkasan singkat event yang memikat untuk ditampilkan pada kartu agenda..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Rich Text Editor for Description */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Deskripsi Detail, Rundown & Pemateri (TipTap Editor)
                            </label>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <TipTapEditor
                                    content={data.description}
                                    onChange={(content) => setData('description', content)}
                                    placeholder="Jelaskan tujuan acara, pembicara, fasilitas peserta, dan petunjuk kehadiran..."
                                />
                            </div>
                        </div>

                        {/* Lokasi & Auto Embed Maps */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                                <MapPin className="h-4 w-4 text-indigo-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Lokasi & Auto Embed Google Maps
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Tipe Penyelenggaraan
                                    </label>
                                    <select
                                        value={data.event_type}
                                        onChange={(e) => setData('event_type', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="offline">Tatap Muka (Offline)</option>
                                        <option value="online">Daring (Online / Webinar)</option>
                                        <option value="hybrid">Kombinasi (Hybrid)</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nama Tempat / Gedung / Platform
                                    </label>
                                    <input
                                        type="text"
                                        value={data.venue_name}
                                        onChange={(e) => setData('venue_name', e.target.value)}
                                        placeholder="Contoh: Auditorium Prof. Soedarto / Zoom Meeting ID"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Kampus Merdeka No. 101, Kompleks Rektorat..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Google Maps URL atau Iframe Embed (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.maps_url}
                                    onChange={(e) => setData('maps_url', e.target.value)}
                                    placeholder="Tempel tautan Google Maps / share link atau kode iframe. Jika kosong, peta di-generate otomatis dari nama gedung & alamat."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                />
                            </div>

                            {/* Live Interactive Maps Preview */}
                            {liveMapsEmbedUrl && data.event_type !== 'online' && (
                                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Sparkles className="h-3 w-3 text-indigo-500" />
                                            Live Auto Embed Maps Preview
                                        </span>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Aktif</span>
                                    </div>
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={liveMapsEmbedUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Live Maps Preview"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sponsor & Partnership Builder (Text & Gambar) */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Users className="h-4 w-4 text-indigo-600" />
                                        Sponsor & Partnership (Teks / Gambar)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Mendukung partner berbasis teks murni (pills/badge) maupun logo gambar resmi.
                                    </p>
                                </div>
                                <Button type="button" size="sm" variant="outline" onClick={addSponsor} className="gap-1 text-xs">
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah Partner
                                </Button>
                            </div>

                            {data.sponsors.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2">
                                    Belum ada sponsor atau mitra ditambahkan. Klik &quot;Tambah Partner&quot; untuk menambahkan sponsor.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {data.sponsors.map((sponsor, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    Mitra #{index + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSponsor(index)}
                                                    className="rounded-md p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                                    title="Hapus Partner"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                        Nama Instansi / Sponsor *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={sponsor.name}
                                                        onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                                                        placeholder="Contoh: IEEE Indonesia / Kementerian Diktisaintek"
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                        Kategori / Role Mitra
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={sponsor.type}
                                                        onChange={(e) => updateSponsor(index, 'type', e.target.value)}
                                                        placeholder="Contoh: Main Sponsor / Supported by / Media Partner"
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                        Logo Gambar (Kosongkan jika hanya ingin mode TEKS)
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        {sponsor.logo_url ? (
                                                            <div className="relative h-9 w-14 shrink-0 rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                                                                <img
                                                                    src={sponsor.logo_url}
                                                                    alt={sponsor.name}
                                                                    className="h-full w-full object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                                Mode Teks
                                                            </span>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-xs"
                                                            onClick={() => setSponsorLogoPickerIndex(index)}
                                                        >
                                                            {sponsor.logo_url ? 'Ganti Logo' : 'Pilih Logo Media'}
                                                        </Button>
                                                        {sponsor.logo_url && (
                                                            <button
                                                                type="button"
                                                                onClick={() => updateSponsor(index, 'logo_url', '')}
                                                                className="text-xs text-slate-400 hover:text-rose-500"
                                                            >
                                                                Jadikan Teks
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                                        Website URL Mitra (Opsional)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={sponsor.website_url}
                                                        onChange={(e) => updateSponsor(index, 'website_url', e.target.value)}
                                                        placeholder="https://..."
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Settings, Custom Registration & Metadata (1 col) */}
                    <div className="space-y-6">
                        {/* Status & Kategori */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Pengaturan Publikasi
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Status Publikasi
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="published">Published (Tayang Publik)</option>
                                    <option value="scheduled">Scheduled (Terjadwal)</option>
                                    <option value="draft">Draft (Arsip)</option>
                                    <option value="cancelled">Cancelled (Dibatalkan)</option>
                                    <option value="archived">Archived (Diarsipkan)</option>
                                </select>
                            </div>

                            {/* Content Scheduling Box */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                        Jadwal Tayang Publik
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (scheduleMode) {
                                                setScheduleMode(false);
                                                setData('published_at', '');
                                                if (data.status === 'scheduled') setData('status', 'draft');
                                            } else {
                                                setScheduleMode(true);
                                                const tomorrow = new Date(Date.now() + 86400000).toISOString().substring(0, 16);
                                                handlePublishDateChange(tomorrow);
                                            }
                                        }}
                                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                    >
                                        {scheduleMode ? 'Ubah ke Segera' : 'Atur Jadwal'}
                                    </button>
                                </div>

                                {scheduleMode ? (
                                    <div className="space-y-1.5 pt-1">
                                        <input
                                            type="datetime-local"
                                            value={data.published_at ? data.published_at.substring(0, 16) : ''}
                                            onChange={(e) => handlePublishDateChange(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                        <p className="text-[10px] text-slate-400">
                                            Event akan tayang publik secara otomatis pada waktu ini.
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {data.status === 'published' ? 'Sudah diterbitkan' : 'Akan tayang langsung saat disimpan sebagai Published.'}
                                    </p>
                                )}
                            </div>

                            {/* Kategori Agenda (Dari master Kategori Post) */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori Agenda
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setCreateCategoryModalOpen(true)}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Kategori Baru
                                    </button>
                                </div>
                                <select
                                    value={data.category_id || ''}
                                    onChange={(e) => {
                                        const catId = e.target.value;
                                        const found = categoriesList.find((c) => String(c.id) === String(catId));
                                        setData((prev) => ({
                                            ...prev,
                                            category_id: catId,
                                            category: found ? found.name : prev.category,
                                        }));
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="">Pilih Kategori...</option>
                                    {categoriesList.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags & Hashtags (Dari master Tags Post) */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <WordPressTagSelector
                                    allTags={hashtags}
                                    selectedTagIds={data.hashtag_ids || []}
                                    selectedNewTags={data.new_hashtags || []}
                                    onChange={({ hashtag_ids, new_hashtags }) => {
                                        setData('hashtag_ids', hashtag_ids);
                                        setData('new_hashtags', new_hashtags);
                                    }}
                                    label="Topik & Tag Event"
                                />
                            </div>
                        </div>

                        {/* Banner Cover Image */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Cover Banner Event
                            </h3>

                            {data.cover_image_path ? (
                                <div className="space-y-2">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                                        <img
                                            src={data.cover_image_path}
                                            alt="Cover"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs"
                                            onClick={() => setIsCoverPickerOpen(true)}
                                        >
                                            Ganti Banner
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="danger"
                                            onClick={() => setData('cover_image_path', '')}
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsCoverPickerOpen(true)}
                                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 transition-colors dark:border-slate-800 dark:bg-slate-900/40"
                                >
                                    <ImageIcon className="h-7 w-7 text-slate-400 mb-1" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        Pilih Dari Media Library
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Tanggal & Waktu Pelaksanaan */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                Waktu & Tanggal
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Mulai Tanggal & Jam *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    required
                                />
                                {errors.start_date && <p className="text-xs text-rose-500 mt-1">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Selesai Tanggal & Jam
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Custom Registration Link & Pricing */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <LinkIcon className="h-3.5 w-3.5 text-indigo-500" />
                                Pendaftaran & Tiket Kustom
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Tipe Pendaftaran
                                </label>
                                <select
                                    value={data.registration_type}
                                    onChange={(e) => setData('registration_type', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="free">Gratis (Free)</option>
                                    <option value="paid">Berbayar (Paid)</option>
                                    <option value="invite_only">Khusus Undangan (Invite Only)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Biaya / HTM
                                </label>
                                <input
                                    type="text"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Contoh: Gratis / Rp 50.000"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Custom URL Pendaftaran
                                </label>
                                <input
                                    type="url"
                                    value={data.registration_url}
                                    onChange={(e) => setData('registration_url', e.target.value)}
                                    placeholder="https://forms.gle/... atau portal pendaftaran"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Bisa berupa tautan Google Forms, sistem PMB, atau link eksternal manapun.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Label Teks Tombol Pendaftaran
                                </label>
                                <input
                                    type="text"
                                    value={data.registration_button_label}
                                    onChange={(e) => setData('registration_button_label', e.target.value)}
                                    placeholder="Daftar Sekarang"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Batas Akhir (Deadline)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.registration_deadline}
                                        onChange={(e) => setData('registration_deadline', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kuota Peserta
                                    </label>
                                    <input
                                        type="number"
                                        value={data.quota}
                                        onChange={(e) => setData('quota', e.target.value)}
                                        placeholder="500"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kontak Narahubung / PIC */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Kontak Narahubung (PIC)
                            </h3>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Nama PIC / Panitia
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_name}
                                    onChange={(e) => setData('contact_name', e.target.value)}
                                    placeholder="Dr. Hendra / Sekretariat BEM"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Nomor Telepon / WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    placeholder="+62 812-..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Email Narahubung
                                </label>
                                <input
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    placeholder="panitia@kampus.ac.id"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Media Picker for Cover Banner */}
            <MediaPickerModal
                isOpen={isCoverPickerOpen}
                onClose={() => setIsCoverPickerOpen(false)}
                onSelect={(media) => {
                    setData('cover_image_path', media.image_url);
                    setIsCoverPickerOpen(false);
                }}
                title="Pilih Banner Event dari Media Library"
            />

            {/* Media Picker for Sponsor Logo */}
            <MediaPickerModal
                isOpen={sponsorLogoPickerIndex !== null}
                onClose={() => setSponsorLogoPickerIndex(null)}
                onSelect={(media) => {
                    if (sponsorLogoPickerIndex !== null) {
                        updateSponsor(sponsorLogoPickerIndex, 'logo_url', media.image_url);
                        setSponsorLogoPickerIndex(null);
                    }
                }}
                title="Pilih Logo Sponsor dari Media Library"
            />

            {/* Quick Category Modal */}
            <QuickCreateCategoryModal
                isOpen={createCategoryModalOpen}
                onClose={() => setCreateCategoryModalOpen(false)}
                onCreated={handleCategoryCreated}
            />

            {/* Universal Content Preview Modal */}
            <ContentPreviewModal
                isOpen={previewModalOpen}
                onClose={() => setPreviewModalOpen(false)}
                title="Pratinjau Event"
                type="event"
                data={data}
                categoryName={
                    categoriesList.find((c) => String(c.id) === String(data.category_id))?.name ||
                    data.category ||
                    'Seminar'
                }
                tagNames={[
                    ...hashtags.filter((h) => (data.hashtag_ids || []).includes(h.id)).map((h) => h.name),
                    ...(data.new_hashtags || []),
                ]}
                publicUrl={isEdit && data.slug ? route('public.events.show', data.slug) : null}
            />
        </AuthenticatedLayout>
    );
}
