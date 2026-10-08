import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Sparkles,
    User,
    Sliders,
    BookOpen,
    Layers,
    Save,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    Image as ImageIcon,
    Video,
    Award,
    CheckCircle2,
    Eye,
    ExternalLink,
    HelpCircle,
    GraduationCap,
    School,
    Target,
    Compass,
    ShieldCheck,
    Calendar,
    ChevronRight,
} from 'lucide-react';

export default function CampusSettings({ campusSetting }) {
    const [activeTab, setActiveTab] = useState('rector'); // 'rector' | 'hero' | 'profile' | 'page_builder'

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        // Sambutan Rektor
        rector_name: campusSetting?.rector_name || '',
        rector_title: campusSetting?.rector_title || '',
        rector_image: null,
        rector_image_url: campusSetting?.rector_image_url || '',
        rector_quote: campusSetting?.rector_quote || '',
        rector_speech: campusSetting?.rector_speech || '',
        rector_video_url: campusSetting?.rector_video_url || '',

        // Hero Slides & Stats
        hero_slides: campusSetting?.hero_slides && campusSetting.hero_slides.length > 0
            ? campusSetting.hero_slides
            : [
                {
                    id: 'slide-1',
                    badge: 'KAMPUS UNGGULAN',
                    title: 'Membangun <span class="text-amber-400">Generasi Emas</span> Masa Depan',
                    desc: 'Lingkungan belajar modern dengan tenaga pendidik profesional dan program terarah.',
                    media_type: 'image',
                    image_url: '',
                    youtube_url: '',
                    primary_btn_text: 'Daftar Sekarang',
                    primary_btn_url: '/pendaftaran',
                    secondary_btn_text: 'Profil Kampus',
                    secondary_btn_url: '/tentang',
                },
            ],
        hero_stats: campusSetting?.hero_stats && campusSetting.hero_stats.length > 0
            ? campusSetting.hero_stats
            : [
                { value: 'UNGGUL', label: 'Akreditasi BAN-PT', accent: false },
                { value: '8.500+', label: 'Mahasiswa Aktif', accent: true },
                { value: '320+', label: 'Dosen & Praktisi', accent: true },
                { value: '25+', label: 'Program Studi', accent: true },
            ],

        // Profil Kampus
        about_background: campusSetting?.about_background || '',
        about_image: null,
        about_image_url: campusSetting?.about_image_url || '',
        about_vision: campusSetting?.about_vision || '',
        about_missions: campusSetting?.about_missions || ['Menyelenggarakan pendidikan berkualitas tinggi berbasis riset dan teknologi.'],
        about_goals: campusSetting?.about_goals || [],
        about_development_models: campusSetting?.about_development_models || [],
        about_development_strategies: campusSetting?.about_development_strategies || [],
        about_accreditation: campusSetting?.about_accreditation || {
            grade: 'UNGGUL (A)',
            institution: 'BAN-PT',
            sk_number: '',
            valid_until: '',
            desc: '',
        },

        // Page Builder Sections
        home_sections: campusSetting?.home_sections || [],
    });

    const [rectorPreview, setRectorPreview] = useState(campusSetting?.rector_image_url || null);
    const [aboutPreview, setAboutPreview] = useState(campusSetting?.about_image_url || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.campus-settings.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Helper Functions for Hero Slides
    const handleAddSlide = () => {
        const newSlide = {
            id: `slide-${Date.now()}`,
            badge: 'KEUNGGULAN BARU',
            title: 'Judul Slide <span class="text-amber-400">Kampus</span>',
            desc: 'Deskripsi lengkap keunggulan atau program yang ditawarkan kepada mahasiswa.',
            media_type: 'image',
            image_url: '',
            youtube_url: '',
            primary_btn_text: 'Jelajahi',
            primary_btn_url: '/tentang',
            secondary_btn_text: 'Hubungi Kami',
            secondary_btn_url: '/kontak',
        };
        setData('hero_slides', [...data.hero_slides, newSlide]);
    };

    const handleRemoveSlide = (index) => {
        const updated = data.hero_slides.filter((_, i) => i !== index);
        setData('hero_slides', updated);
    };

    const handleUpdateSlide = (index, field, value) => {
        const updated = [...data.hero_slides];
        updated[index] = { ...updated[index], [field]: value };
        setData('hero_slides', updated);
    };

    // Helper Functions for Missions
    const handleAddMission = () => {
        setData('about_missions', [...data.about_missions, '']);
    };

    const handleRemoveMission = (index) => {
        setData('about_missions', data.about_missions.filter((_, i) => i !== index));
    };

    const handleUpdateMission = (index, val) => {
        const updated = [...data.about_missions];
        updated[index] = val;
        setData('about_missions', updated);
    };

    // Helper Functions for Development Models (Dinamis)
    const handleAddModel = () => {
        const newModel = {
            title: 'Model Pengembangan Baru',
            desc: 'Penjelasan model inovasi atau pilar transformasi yang diterapkan oleh institusi.',
            icon: 'Rocket',
            tag: 'Pilar Strategis',
        };
        setData('about_development_models', [...data.about_development_models, newModel]);
    };

    const handleRemoveModel = (index) => {
        setData('about_development_models', data.about_development_models.filter((_, i) => i !== index));
    };

    const handleUpdateModel = (index, field, value) => {
        const updated = [...data.about_development_models];
        updated[index] = { ...updated[index], [field]: value };
        setData('about_development_models', updated);
    };

    // Helper Functions for Goals (Tujuan)
    const handleAddGoal = () => {
        const newGoal = {
            title: 'Tujuan Pendidikan Baru',
            desc: 'Penjelasan target luaran pendidikan yang ingin dicapai sivitas akademika.',
            icon: 'GraduationCap',
            bg: 'bg-indigo-600',
        };
        setData('about_goals', [...data.about_goals, newGoal]);
    };

    const handleRemoveGoal = (index) => {
        setData('about_goals', data.about_goals.filter((_, i) => i !== index));
    };

    const handleUpdateGoal = (index, field, value) => {
        const updated = [...data.about_goals];
        updated[index] = { ...updated[index], [field]: value };
        setData('about_goals', updated);
    };

    // Helper Functions for Development Strategies (Strategi)
    const handleAddStrategy = () => {
        const newStrat = {
            phase: `Fase ${data.about_development_strategies.length + 1}`,
            title: 'Target Capaian Strategis',
            desc: 'Langkah taktis dan milestone implementasi program pengembangan kampus.',
            target_year: `${new Date().getFullYear() + 2}`,
        };
        setData('about_development_strategies', [...data.about_development_strategies, newStrat]);
    };

    const handleRemoveStrategy = (index) => {
        setData('about_development_strategies', data.about_development_strategies.filter((_, i) => i !== index));
    };

    const handleUpdateStrategy = (index, field, value) => {
        const updated = [...data.about_development_strategies];
        updated[index] = { ...updated[index], [field]: value };
        setData('about_development_strategies', updated);
    };

    // Helper Functions for Home Sections (Page Builder)
    const handleToggleSection = (index) => {
        const updated = [...data.home_sections];
        updated[index].enabled = !updated[index].enabled;
        setData('home_sections', updated);
    };

    const handleMoveSection = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === data.home_sections.length - 1)) {
            return;
        }
        const updated = [...data.home_sections];
        const temp = updated[index];
        updated[index] = updated[index + direction];
        updated[index + direction] = temp;
        // update order
        updated.forEach((item, i) => {
            item.order = i + 1;
        });
        setData('home_sections', updated);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel Konfigurasi Kampus - Portal Administrasi" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300 mb-2">
                            <School className="w-3.5 h-3.5" />
                            Modul Terdedikasi Panel Kampus
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Konfigurasi Profil &amp; Beranda Kampus
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Kelola sambutan rektor, hero slider interaktif, visi-misi-tujuan dinamis, serta layout page builder beranda sesuai standar template institusi.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={route('home')}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Eye className="w-4 h-4 text-slate-400" />
                            Lihat Beranda
                        </a>
                        <a
                            href={route('public.about')}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                            Lihat Laman Tentang
                        </a>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                        </button>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold">
                            Seluruh konfigurasi Panel Kampus berhasil diperbarui dan telah aktif pada portal publik.
                        </span>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('rector')}
                        className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'rector'
                                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        <User className="w-4 h-4" />
                        Sambutan Rektor
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('hero')}
                        className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'hero'
                                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        <Sliders className="w-4 h-4" />
                        Hero Slider &amp; Stats Bar
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'profile'
                                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Profil Lengkap &amp; Akreditasi
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('page_builder')}
                        className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'page_builder'
                                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        Page Builder Beranda (Home)
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* TAB 1: SAMBUTAN REKTOR */}
                    {activeTab === 'rector' && (
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Konfigurasi Sambutan Rektor (Welcome Section)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Informasi ini ditampilkan di bagian selamat datang pada beranda serta modal dialog baca pidato lengkap.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                                {/* Foto Rektor */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Foto Resmi Rektor
                                    </label>
                                    <div className="relative aspect-[3/4] w-full max-w-[260px] mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-800 dark:bg-slate-950 flex flex-col items-center justify-center">
                                        {rectorPreview ? (
                                            <img
                                                src={rectorPreview}
                                                alt="Rektor Preview"
                                                className="h-full w-full object-cover rounded-xl shadow-sm"
                                            />
                                        ) : (
                                            <div className="space-y-2 p-4 text-slate-400">
                                                <User className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs">Belum ada foto rektor diunggah</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setData('rector_image', file);
                                                    setRectorPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="w-full text-xs text-slate-500 file:mr-2 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950/60 dark:file:text-indigo-300"
                                        />
                                        <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP (Maksimal 2MB)</p>
                                    </div>
                                </div>

                                {/* Informasi Rektor */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                Nama Lengkap &amp; Gelar Rektor
                                            </label>
                                            <input
                                                type="text"
                                                value={data.rector_name}
                                                onChange={(e) => setData('rector_name', e.target.value)}
                                                placeholder="Contoh: Prof. Dr. Ahmad Wijaya, M.Sc."
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                Jabatan Resmi
                                            </label>
                                            <input
                                                type="text"
                                                value={data.rector_title}
                                                onChange={(e) => setData('rector_title', e.target.value)}
                                                placeholder="Contoh: Rektor Institut Teknologi &amp; Bisnis"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Kutipan Sambutan Singkat (Quote di Beranda)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={data.rector_quote}
                                            onChange={(e) => setData('rector_quote', e.target.value)}
                                            placeholder="Tuliskan 2-3 kalimat sambutan hangat yang tampil langsung di homepage..."
                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Video Sambutan YouTube (Auto-Embed Opsional)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.rector_video_url}
                                                onChange={(e) => setData('rector_video_url', e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                            />
                                            <Video className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Naskah Pidato Sambutan Lengkap (HTML Didukung)
                                        </label>
                                        <textarea
                                            rows={6}
                                            value={data.rector_speech}
                                            onChange={(e) => setData('rector_speech', e.target.value)}
                                            placeholder="Tuliskan naskah pidato lengkap sambutan rektor yang akan ditampilkan pada modal dialog..."
                                            className="w-full font-mono rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: HERO SLIDER & STATS */}
                    {activeTab === 'hero' && (
                        <div className="space-y-6">
                            {/* Slide List */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Sliders className="w-4 h-4 text-indigo-600" />
                                            Manajemen Slide Hero (Latar Belakang Gambar / YouTube Auto Embed)
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Setiap slide mendukung latar belakang gambar beresolusi tinggi atau video YouTube dengan efek overlay profesional.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddSlide}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Tambah Slide Hero
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {data.hero_slides.map((slide, index) => (
                                        <div
                                            key={slide.id || index}
                                            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-950/40 space-y-4"
                                        >
                                            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-bold text-white">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                                                        Slide {index + 1}: {slide.badge || 'Tanpa Badge'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {data.hero_slides.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSlide(index)}
                                                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                                            title="Hapus Slide"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                        Badge Tag
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={slide.badge}
                                                        onChange={(e) => handleUpdateSlide(index, 'badge', e.target.value)}
                                                        placeholder="Contoh: KAMPUS UNGGULAN"
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                        Tipe Latar Belakang Media
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                checked={slide.media_type === 'image'}
                                                                onChange={() => handleUpdateSlide(index, 'media_type', 'image')}
                                                                className="text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                                                            Gambar Background
                                                        </label>
                                                        <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                checked={slide.media_type === 'youtube'}
                                                                onChange={() => handleUpdateSlide(index, 'media_type', 'youtube')}
                                                                className="text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <Video className="w-3.5 h-3.5 text-rose-500" />
                                                            Video YouTube Auto Embed
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                        Judul Besar (Heading)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={slide.title}
                                                        onChange={(e) => handleUpdateSlide(index, 'title', e.target.value)}
                                                        placeholder="Judul Slide (Gunakan <span class='text-amber-400'>kata</span> untuk warna aksen)"
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                        Deskripsi Slide
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={slide.desc}
                                                        onChange={(e) => handleUpdateSlide(index, 'desc', e.target.value)}
                                                        placeholder="Deskripsi pendukung di bawah judul utama..."
                                                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                    />
                                                </div>

                                                {slide.media_type === 'image' ? (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                            URL Gambar Background
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={slide.image_url}
                                                            onChange={(e) => handleUpdateSlide(index, 'image_url', e.target.value)}
                                                            placeholder="Contoh: /images/campus-hero.png atau https://..."
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                            URL Video YouTube (Auto Background Loop)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={slide.youtube_url}
                                                            onChange={(e) => handleUpdateSlide(index, 'youtube_url', e.target.value)}
                                                            placeholder="Contoh: https://www.youtube.com/watch?v=..."
                                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                        />
                                                    </div>
                                                )}

                                                {/* Tombol Aksi 1 & 2 */}
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                        Tombol Utama (CTA 1)
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={slide.primary_btn_text}
                                                            onChange={(e) => handleUpdateSlide(index, 'primary_btn_text', e.target.value)}
                                                            placeholder="Teks Tombol"
                                                            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={slide.primary_btn_url}
                                                            onChange={(e) => handleUpdateSlide(index, 'primary_btn_url', e.target.value)}
                                                            placeholder="/url-tujuan"
                                                            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                        Tombol Kedua (CTA 2)
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={slide.secondary_btn_text}
                                                            onChange={(e) => handleUpdateSlide(index, 'secondary_btn_text', e.target.value)}
                                                            placeholder="Teks Tombol"
                                                            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={slide.secondary_btn_url}
                                                            onChange={(e) => handleUpdateSlide(index, 'secondary_btn_url', e.target.value)}
                                                            placeholder="/url-tujuan"
                                                            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Stats Bar */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        Hero Stats Bar (Papan Metrik Kampus di Bawah Slider)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        4 angka kunci performa institusi yang ditampilkan langsung di bawah slider hero.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {data.hero_stats.map((stat, i) => (
                                        <div
                                            key={i}
                                            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3"
                                        >
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                                    Nilai Angka / Grade
                                                </label>
                                                <input
                                                    type="text"
                                                    value={stat.value}
                                                    onChange={(e) => {
                                                        const updated = [...data.hero_stats];
                                                        updated[i].value = e.target.value;
                                                        setData('hero_stats', updated);
                                                    }}
                                                    placeholder="Contoh: UNGGUL / 8.500+"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-900 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                                    Label Keterangan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={stat.label}
                                                    onChange={(e) => {
                                                        const updated = [...data.hero_stats];
                                                        updated[i].label = e.target.value;
                                                        setData('hero_stats', updated);
                                                    }}
                                                    placeholder="Contoh: Akreditasi BAN-PT"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                                />
                                            </div>

                                            <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={stat.accent}
                                                    onChange={(e) => {
                                                        const updated = [...data.hero_stats];
                                                        updated[i].accent = e.target.checked;
                                                        setData('hero_stats', updated);
                                                    }}
                                                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                                                />
                                                Sorot Warna Kuning/Emas
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: PROFIL KAMPUS & AKREDITASI */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Sejarah & Latar Belakang */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                        Latar Belakang &amp; Sejarah Kampus
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Naskah sejarah berdirinya kampus dan foto gedung kampus untuk halaman profil institusi.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Naskah Latar Belakang / Sejarah Singkat
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={data.about_background}
                                            onChange={(e) => setData('about_background', e.target.value)}
                                            placeholder="Tuliskan latar belakang sejarah pendirian kampus..."
                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Foto Gedung / Kampus Utama
                                        </label>
                                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center">
                                            {aboutPreview ? (
                                                <img
                                                    src={aboutPreview}
                                                    alt="Kampus Preview"
                                                    className="h-full w-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <div className="p-4 text-slate-400">
                                                    <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
                                                    <span className="text-[11px]">Foto Sejarah / Gedung Kampus</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setData('about_image', file);
                                                    setAboutPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="w-full text-xs text-slate-500 file:mr-2 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visi & Misi Dinamis */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Target className="w-4 h-4 text-indigo-600" />
                                        Visi &amp; Misi Institusi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Pernyataan visi komprehensif dan daftar butir misi yang dapat ditambah dinamis.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Visi Kampus
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={data.about_vision}
                                            onChange={(e) => setData('about_vision', e.target.value)}
                                            placeholder="Tuliskan pernyataan visi..."
                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Daftar Butir Misi (Dinamis)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAddMission}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Tambah Poin Misi
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {data.about_missions.map((mission, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        {index + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={mission}
                                                        onChange={(e) => handleUpdateMission(index, e.target.value)}
                                                        placeholder={`Poin misi ke-${index + 1}...`}
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                                    />
                                                    {data.about_missions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMission(index)}
                                                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/40"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Model Pengembangan Kampus (Dinamis) */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Compass className="w-4 h-4 text-indigo-600" />
                                            Model Pengembangan Kampus (Bisa Ditambah Dinamis)
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Pilar model keunggulan akademik, inkubator industri, smart green campus, atau program inovatif lainnya.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddModel}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Tambah Model Pengembangan
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.about_development_models.map((model, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3"
                                        >
                                            <div className="flex items-center gap-2 justify-between">
                                                <input
                                                    type="text"
                                                    value={model.tag || ''}
                                                    onChange={(e) => handleUpdateModel(index, 'tag', e.target.value)}
                                                    placeholder="Tag Kategori"
                                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 max-w-[120px]"
                                                />
                                                <select
                                                    value={model.icon || 'Sparkles'}
                                                    onChange={(e) => handleUpdateModel(index, 'icon', e.target.value)}
                                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                                >
                                                    <option value="Landmark">🏛️ Landmark (Kelembagaan)</option>
                                                    <option value="Rocket">🚀 Rocket (Riset & Inovasi)</option>
                                                    <option value="Globe">🌐 Globe (Internasional)</option>
                                                    <option value="Award">🏆 Award (Prestasi & Akreditasi)</option>
                                                    <option value="GraduationCap">🎓 GraduationCap (Akademik)</option>
                                                    <option value="BookOpen">📖 BookOpen (Kurikulum)</option>
                                                    <option value="Users">👥 Users (Dosen & Praktisi)</option>
                                                    <option value="Laptop">💻 Laptop (Smart Campus)</option>
                                                    <option value="Cpu">⚡ Cpu (Teknologi & AI)</option>
                                                    <option value="FlaskConical">🔬 FlaskConical (Laboratorium)</option>
                                                    <option value="HeartHandshake">🤝 HeartHandshake (Mitra)</option>
                                                    <option value="Target">🎯 Target (Sasaran Mutu)</option>
                                                    <option value="ShieldCheck">🛡️ ShieldCheck (Penjamin Mutu)</option>
                                                    <option value="Sparkles">✨ Sparkles (Inovasi)</option>
                                                    <option value="Building2">🏢 Building2 (Sarana)</option>
                                                    <option value="Compass">🧭 Compass (Roadmap)</option>
                                                    <option value="Lightbulb">💡 Lightbulb (Kreativitas)</option>
                                                    <option value="TrendingUp">📈 TrendingUp (Pertumbuhan)</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveModel(index)}
                                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/40"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                value={model.title}
                                                onChange={(e) => handleUpdateModel(index, 'title', e.target.value)}
                                                placeholder="Judul Model Pengembangan"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                            />

                                            <textarea
                                                rows={3}
                                                value={model.desc}
                                                onChange={(e) => handleUpdateModel(index, 'desc', e.target.value)}
                                                placeholder="Deskripsi penjelasan model..."
                                                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tujuan Pendidikan (Dinamis) */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Target className="w-4 h-4 text-emerald-600" />
                                            Tujuan Pendidikan Institusi
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Grid kartu tujuan pendidikan yang dirender pada laman profil kampus.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddGoal}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Tambah Tujuan
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data.about_goals.map((goal, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-2.5"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                                                <select
                                                    value={goal.icon || 'GraduationCap'}
                                                    onChange={(e) => handleUpdateGoal(index, 'icon', e.target.value)}
                                                    className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                                >
                                                    <option value="GraduationCap">🎓 GraduationCap</option>
                                                    <option value="FlaskConical">🔬 FlaskConical</option>
                                                    <option value="HeartHandshake">🤝 HeartHandshake</option>
                                                    <option value="Globe">🌐 Globe</option>
                                                    <option value="Cpu">⚡ Cpu</option>
                                                    <option value="Award">🏆 Award</option>
                                                    <option value="Sparkles">✨ Sparkles</option>
                                                    <option value="Rocket">🚀 Rocket</option>
                                                    <option value="Target">🎯 Target</option>
                                                    <option value="ShieldCheck">🛡️ ShieldCheck</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGoal(index)}
                                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/40"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                value={goal.title}
                                                onChange={(e) => handleUpdateGoal(index, 'title', e.target.value)}
                                                placeholder="Judul Tujuan"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                            />

                                            <textarea
                                                rows={2}
                                                value={goal.desc}
                                                onChange={(e) => handleUpdateGoal(index, 'desc', e.target.value)}
                                                placeholder="Deskripsi tujuan..."
                                                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strategi Pengembangan Kampus */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Compass className="w-4 h-4 text-indigo-600" />
                                            Strategi &amp; Roadmap Pengembangan
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Tahapan roadmap jangka pendek, menengah, dan panjang institusi.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddStrategy}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Tambah Fase Strategi
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.about_development_strategies.map((strat, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
                                        >
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Fase / Periode</label>
                                                <input
                                                    type="text"
                                                    value={strat.phase}
                                                    onChange={(e) => handleUpdateStrategy(index, 'phase', e.target.value)}
                                                    placeholder="Fase I (2024 - 2026)"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Judul Strategi</label>
                                                <input
                                                    type="text"
                                                    value={strat.title}
                                                    onChange={(e) => handleUpdateStrategy(index, 'title', e.target.value)}
                                                    placeholder="Penguatan Fondasi Digital..."
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Tahun</label>
                                                    <input
                                                        type="text"
                                                        value={strat.target_year || ''}
                                                        onChange={(e) => handleUpdateStrategy(index, 'target_year', e.target.value)}
                                                        placeholder="2026"
                                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStrategy(index)}
                                                    className="mt-5 p-2 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/40"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="md:col-span-4">
                                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Deskripsi Langkah Strategis</label>
                                                <textarea
                                                    rows={2}
                                                    value={strat.desc}
                                                    onChange={(e) => handleUpdateStrategy(index, 'desc', e.target.value)}
                                                    placeholder="Deskripsi langkah konkret..."
                                                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Data Akreditasi Institusi */}
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                        Data Akreditasi BAN-PT &amp; Legalitas Institusi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Informasi pengakuan resmi mutu penyelenggaraan akademik kampus.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Peringkat / Grade Akreditasi
                                        </label>
                                        <input
                                            type="text"
                                            value={data.about_accreditation?.grade || ''}
                                            onChange={(e) =>
                                                setData('about_accreditation', {
                                                    ...data.about_accreditation,
                                                    grade: e.target.value,
                                                })
                                            }
                                            placeholder="Contoh: UNGGUL (A)"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-emerald-600 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Lembaga Akreditasi
                                        </label>
                                        <input
                                            type="text"
                                            value={data.about_accreditation?.institution || ''}
                                            onChange={(e) =>
                                                setData('about_accreditation', {
                                                    ...data.about_accreditation,
                                                    institution: e.target.value,
                                                })
                                            }
                                            placeholder="BAN-PT / LAM-PTKES"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Nomor Surat Keputusan (SK)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.about_accreditation?.sk_number || ''}
                                            onChange={(e) =>
                                                setData('about_accreditation', {
                                                    ...data.about_accreditation,
                                                    sk_number: e.target.value,
                                                })
                                            }
                                            placeholder="Nomor SK resmi..."
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Masa Berlaku Hingga
                                        </label>
                                        <input
                                            type="date"
                                            value={data.about_accreditation?.valid_until || ''}
                                            onChange={(e) =>
                                                setData('about_accreditation', {
                                                    ...data.about_accreditation,
                                                    valid_until: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-4">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Keterangan Akreditasi
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.about_accreditation?.desc || ''}
                                            onChange={(e) =>
                                                setData('about_accreditation', {
                                                    ...data.about_accreditation,
                                                    desc: e.target.value,
                                                })
                                            }
                                            placeholder="Keterangan singkat capaian standar 9 kriteria akreditasi..."
                                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: PAGE BUILDER BERANDA */}
                    {activeTab === 'page_builder' && (
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-indigo-600" />
                                    Page Builder Beranda (Home Component Reordering &amp; Visibility)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Aktifkan atau nonaktifkan section, dan sesuaikan urutan tata letak halaman utama beranda secara modular sesuai template kampus.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {data.home_sections.map((section, index) => (
                                    <div
                                        key={section.id}
                                        className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                                            section.enabled
                                                ? 'border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950'
                                                : 'border-slate-200/60 bg-slate-50/50 opacity-60 dark:border-slate-800/50 dark:bg-slate-900/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                    {section.label}
                                                </h4>
                                                <span className="text-[11px] text-slate-400">
                                                    ID Komponen: <code className="font-mono text-indigo-500">{section.id}</code>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Reorder Buttons */}
                                            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 dark:border-slate-800">
                                                <button
                                                    type="button"
                                                    disabled={index === 0}
                                                    onClick={() => handleMoveSection(index, -1)}
                                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 transition-colors"
                                                    title="Pindah ke Atas"
                                                >
                                                    <ArrowUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={index === data.home_sections.length - 1}
                                                    onClick={() => handleMoveSection(index, 1)}
                                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 transition-colors"
                                                    title="Pindah ke Bawah"
                                                >
                                                    <ArrowDown className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Toggle Switch */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSection(index)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    section.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                        section.enabled ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <span className="text-xs font-semibold w-16 text-right text-slate-600 dark:text-slate-400">
                                                {section.enabled ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom Save Bar */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Pastikan menekan tombol simpan setelah mengubah konfigurasi di tab aktif.
                        </span>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
