import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Camera,
    Calendar,
    Search,
    Eye,
    Images,
    Sparkles,
    ChevronRight,
    Filter,
} from 'lucide-react';

export default function PublicGalleriesIndex({ galleries, filters, categories, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeCategory, setActiveCategory] = useState(filters.kategori || '');

    const handleSearch = (e) => {
        e?.preventDefault();
        router.get(
            route('public.galleries.index'),
            { search, kategori: activeCategory },
            { preserveState: true, replace: true }
        );
    };

    const handleCategoryClick = (cat) => {
        const nextCat = activeCategory === cat ? '' : cat;
        setActiveCategory(nextCat);
        router.get(
            route('public.galleries.index'),
            { search, kategori: nextCat },
            { preserveState: true, replace: true }
        );
    };

    return (
        <PublicLayout>
            <Head>
                <title>Lensa & Galeri Dokumentasi Kampus - Universitas Sains & Teknologi Nusantara</title>
                <meta
                    name="description"
                    content="Koleksi foto dan dokumentasi kegiatan resmi kampus, perayaan wisuda, laboratorium riset, fasilitas, dan momen civitas akademika."
                />
            </Head>

            {/* Hero Banner Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 py-16 text-white sm:py-24">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative site-container">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            Dokumentasi Resmi & Kilas Peristiwa
                        </div>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                            Lensa Kampus & Galeri Foto
                        </h1>
                        <p className="mt-4 text-base text-slate-300 sm:text-lg">
                            Menyaksikan geliat keunggulan inovasi riset, sukacita wisuda, fasilitas modern,
                            serta rekam jejak prestasi civitas akademika dalam bidikan visual berkualitas.
                        </p>

                        {/* Statistik Singkat */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-md">
                                <Images className="h-4 w-4 text-indigo-400" />
                                <span className="font-bold text-white">{stats.totalGalleries}</span>
                                <span className="text-slate-400">Album Terbit</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-md">
                                <Camera className="h-4 w-4 text-emerald-400" />
                                <span className="font-bold text-white">{stats.totalPhotos}</span>
                                <span className="text-slate-400">Total Dokumentasi Foto</span>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mt-8 mx-auto max-w-xl">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Cari album, momen wisuda, nama acara..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/10 py-3.5 pl-11 pr-28 text-sm text-white placeholder-slate-400 backdrop-blur-md focus:border-indigo-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                                />
                                <Search className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                <button
                                    type="submit"
                                    className="absolute right-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Filter Kategori & Konten Galeri */}
            <section className="site-container py-10">
                {/* Kategori Filter Tabs */}
                {categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
                            <Filter className="h-3.5 w-3.5" />
                            Kategori:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('')}
                            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                activeCategory === ''
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                            }`}
                        >
                            Semua Koleksi
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryClick(cat)}
                                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                    activeCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid Koleksi Galeri */}
                {galleries.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <Camera className="h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
                            Tidak Ada Album Ditemukan
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Coba ubah kata kunci pencarian atau pilih kategori lain.
                        </p>
                        {(search || activeCategory) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setActiveCategory('');
                                    router.get(route('public.galleries.index'));
                                }}
                                className="mt-4 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {galleries.data.map((item) => (
                            <Link
                                key={item.id}
                                href={route('public.galleries.show', item.slug)}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/30 dark:border-slate-800 dark:bg-slate-900/60"
                            >
                                {/* Cover Image Container */}
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {item.cover_image ? (
                                        <img
                                            src={item.cover_image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <Images className="h-10 w-10 opacity-30" />
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Badges on Cover */}
                                    <div className="absolute top-3 left-3">
                                        <span className="rounded-xl bg-white/90 px-3 py-1 text-[11px] font-bold text-indigo-700 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-indigo-400">
                                            {item.category || 'Dokumentasi'}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                        <Camera className="h-3.5 w-3.5 text-indigo-400" />
                                        <span>{item.images_count} Foto</span>
                                    </div>
                                </div>

                                {/* Body Information */}
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        {item.event_date && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                                {new Date(item.event_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            {item.views_count} tayangan
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-indigo-400">
                                        {item.title}
                                    </h3>

                                    {item.description && (
                                        <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="text-xs font-medium text-slate-400">
                                            {item.photographer ? `Foto: ${item.photographer}` : 'Dokumentasi Kampus'}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform dark:text-indigo-400">
                                            Buka Album
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galleries.links && galleries.links.length > 3 && (
                    <div className="mt-12 flex justify-center">
                        <div className="flex flex-wrap items-center gap-1">
                            {galleries.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : link.url
                                            ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                            : 'cursor-not-allowed opacity-40 text-slate-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
