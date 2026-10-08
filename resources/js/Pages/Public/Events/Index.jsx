import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Calendar,
    Search,
    MapPin,
    Clock,
    Tag,
    ArrowRight,
    Sparkles,
    Ticket,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/UI/Pagination';

export default function Index({ events, filters, categories = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const currentTab = filters.tab || 'upcoming';

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('public.events.index'),
            { search, category: filters.category, tab: currentTab },
            { preserveState: true }
        );
    };

    const handleTabChange = (tab) => {
        router.get(
            route('public.events.index'),
            { search, category: filters.category, tab },
            { preserveState: true }
        );
    };

    const handleCategoryFilter = (cat) => {
        const next = filters.category === cat ? '' : cat;
        router.get(
            route('public.events.index'),
            { search, category: next, tab: currentTab },
            { preserveState: true }
        );
    };

    return (
        <PublicLayout>
            <Head title="Kalender Agenda & Event Kampus" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
                {/* Header Title */}
                <div className="max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                        <Calendar className="h-3.5 w-3.5" />
                        Agenda & Kegiatan Universitas
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Kalender Event Akademik & Kemahasiswaan
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                        Ikuti konferensi ilmiah internasional, seminar nasional, kuliah umum rektorat, upacara wisuda, dan job fair karir.
                    </p>
                </div>

                {/* Filter Controls (Tabs + Search + Categories) */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
                    {/* Tabs */}
                    <div className="flex rounded-xl bg-slate-100 p-1 text-xs dark:bg-slate-900 self-start">
                        <button
                            type="button"
                            onClick={() => handleTabChange('upcoming')}
                            className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                                currentTab === 'upcoming'
                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Akan Datang (Upcoming)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('past')}
                            className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                                currentTab === 'past'
                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Telah Selesai
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('all')}
                            className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                                currentTab === 'all'
                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Semua Event
                        </button>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative w-full md:max-w-xs">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari event kampus..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                    </form>
                </div>

                {/* Category Pills */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter('')}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                !filters.category
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                            }`}
                        >
                            Semua Kategori
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryFilter(cat)}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    filters.category === cat
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Event Cards Grid */}
                {events.data.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                        <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                            Tidak Ada Event Ditemukan
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Coba ubah kata kunci pencarian atau kategori event yang dipilih.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {events.data.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700 transition-all duration-300"
                            >
                                {/* Cover Image with Category Badge */}
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                                    {item.cover_image_url ? (
                                        <img
                                            src={item.cover_image_url}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-indigo-50/50 text-indigo-400 dark:bg-indigo-950/30">
                                            <Calendar className="h-10 w-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-indigo-600 shadow-sm backdrop-blur-sm dark:bg-slate-950/90 dark:text-indigo-400">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase text-white backdrop-blur-sm">
                                            {item.event_type}
                                        </span>
                                    </div>
                                </div>

                                {/* Event Body */}
                                <div className="flex flex-1 flex-col p-6 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{item.formatted_date_range}</span>
                                        </div>
                                        <Link
                                            href={route('public.events.show', item.slug)}
                                            className="block font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors text-base line-clamp-2"
                                        >
                                            {item.title}
                                        </Link>
                                    </div>

                                    {item.summary && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {item.summary}
                                        </p>
                                    )}

                                    <div className="mt-auto space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                        {item.venue_name && (
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                <span className="truncate">{item.venue_name}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-1">
                                            <div>
                                                <span className="text-[10px] uppercase text-slate-400 block font-medium">HTM / Biaya</span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {item.price || 'Gratis'}
                                                </span>
                                            </div>
                                            <Link
                                                href={route('public.events.show', item.slug)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                            >
                                                Detail &amp; Daftar <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {events.links && events.data.length > 0 && (
                    <div className="flex justify-center pt-6">
                        <Pagination links={events.links} />
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
