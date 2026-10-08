import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Megaphone,
    Search,
    Pin,
    Calendar,
    Users,
    FileText,
    Download,
    ArrowRight,
    Tag,
    Clock,
    Building2,
    Paperclip,
    Filter,
    X,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/UI/Pagination';

export default function Index({ announcements, filters = {}, categories = [], audiences = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedAudience, setSelectedAudience] = useState(filters.target_audience || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('public.announcements.index'),
            {
                search,
                category: selectedCategory,
                target_audience: selectedAudience,
            },
            { preserveState: true }
        );
    };

    const handleCategoryClick = (cat) => {
        const next = selectedCategory === cat ? '' : cat;
        setSelectedCategory(next);
        router.get(
            route('public.announcements.index'),
            {
                search,
                category: next,
                target_audience: selectedAudience,
            },
            { preserveState: true }
        );
    };

    const handleAudienceChange = (e) => {
        const val = e.target.value;
        setSelectedAudience(val);
        router.get(
            route('public.announcements.index'),
            {
                search,
                category: selectedCategory,
                target_audience: val,
            },
            { preserveState: true }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedAudience('');
        router.get(route('public.announcements.index'));
    };

    const hasActiveFilters = Boolean(search || selectedCategory || selectedAudience);

    // List of announcements items
    const items = announcements.data || [];
    const pinnedItems = items.filter((a) => Boolean(a.is_pinned));
    const regularItems = items;

    return (
        <PublicLayout>
            <Head title="Papan Pengumuman &amp; Surat Edaran Resmi Kampus" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
                {/* Header Title Section */}
                <div className="max-w-3xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                        <Megaphone className="h-3.5 w-3.5" />
                        Pusat Informasi &amp; Edaran Resmi Rektorat
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Papan Pengumuman Kampus
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                        Temukan surat edaran resmi, pedoman registrasi semester, pengumuman beasiswa, kalender akademik, serta unduh lampiran berkas resmi langsung ke perangkat Anda.
                    </p>
                </div>

                {/* Filter Toolbar (Search, Categories, Audiences) */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari judul, nomor surat (contoh: 048/UNIV), atau unit penerbit..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                            />
                        </div>

                        {/* Audience Filter Dropdown */}
                        <div className="sm:w-56 shrink-0">
                            <select
                                value={selectedAudience}
                                onChange={handleAudienceChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                            >
                                <option value="">Semua Sasaran Civitas</option>
                                {audiences.map((aud) => (
                                    <option key={aud} value={aud}>
                                        {aud}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                        >
                            <Search className="h-4 w-4" />
                            Cari
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2.5 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                                title="Reset filter"
                            >
                                <X className="h-4 w-4" />
                                Reset
                            </button>
                        )}
                    </form>

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Kategori:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('')}
                            className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                                !selectedCategory
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryClick(cat)}
                                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Pinned / Pengumuman Penting (Hanya ditampilkan jika di halaman pertama & tidak sedang cari tertentu atau jika ada pinned) */}
                {pinnedItems.length > 0 && !search && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Pin className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                                Pengumuman Penting &amp; Disematkan
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {pinnedItems.slice(0, 2).map((item) => {
                                const attCount = Array.isArray(item.attachments) ? item.attachments.length : 0;
                                return (
                                    <div
                                        key={`pinned-${item.id}`}
                                        className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 shadow-md transition-all hover:shadow-lg dark:border-amber-800/70 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-xs">
                                                        <Pin className="h-2.5 w-2.5" /> Penting
                                                    </span>
                                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                {item.reference_number && (
                                                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                        {item.reference_number}
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                href={route('public.announcements.show', item.slug)}
                                                className="block group"
                                            >
                                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>
                                            </Link>

                                            {item.summary && (
                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                    {item.summary}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-amber-200/60 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                                                <span>{item.formatted_published_at}</span>
                                                {attCount > 0 && (
                                                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                                                        <Paperclip className="h-3 w-3" />
                                                        {attCount} Berkas Lampiran
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                href={route('public.announcements.show', item.slug)}
                                                className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 text-xs"
                                            >
                                                Lihat &amp; Unduh Berkas
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Main List Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Semua Pengumuman Resmi ({announcements.total || items.length})
                        </h2>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((announcement) => {
                                const attachmentsList = Array.isArray(announcement.attachments)
                                    ? announcement.attachments
                                    : [];
                                const totalAttachments = attachmentsList.length;

                                return (
                                    <article
                                        key={announcement.id}
                                        className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-indigo-700/60 transition-all duration-200"
                                    >
                                        <div className="space-y-4">
                                            {/* Meta Header */}
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                    {announcement.category}
                                                </span>

                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                    <Users className="h-3 w-3 text-slate-400" />
                                                    {announcement.target_audience}
                                                </span>
                                            </div>

                                            {/* Reference Number */}
                                            {announcement.reference_number && (
                                                <div className="font-mono text-[11px] text-slate-400">
                                                    No: {announcement.reference_number}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <Link
                                                href={route('public.announcements.show', announcement.slug)}
                                                className="block"
                                            >
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white text-base leading-snug line-clamp-2 transition-colors">
                                                    {announcement.title}
                                                </h3>
                                            </Link>

                                            {/* Summary */}
                                            {announcement.summary && (
                                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                                    {announcement.summary}
                                                </p>
                                            )}
                                        </div>

                                        {/* Card Footer: Issuer, Date, and Attachment indicator */}
                                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                <span className="truncate max-w-[180px] text-[11px]">
                                                    {announcement.issuer || 'Pusat Informasi Kampus'}
                                                </span>
                                                <span className="text-[11px]">
                                                    {announcement.formatted_published_at}
                                                </span>
                                            </div>

                                            {/* File Attachments Badge or Direct Download Shortcut */}
                                            <div className="flex items-center justify-between pt-1">
                                                {totalAttachments > 0 ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                                                        <FileText className="h-3.5 w-3.5" />
                                                        {totalAttachments} Berkas Unduhan
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">
                                                        Informasi Teks
                                                    </span>
                                                )}

                                                <Link
                                                    href={route('public.announcements.show', announcement.slug)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                                                >
                                                    Detail
                                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <Megaphone className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                            <div className="max-w-md mx-auto space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Belum Ada Pengumuman
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Tidak ditemukan pengumuman resmi yang sesuai dengan filter atau kata kunci pencarian Anda.
                                </p>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                                >
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {announcements.links && announcements.links.length > 3 && (
                        <div className="pt-6">
                            <Pagination links={announcements.links} />
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
