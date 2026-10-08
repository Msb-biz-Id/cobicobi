import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    BookOpen,
    Search,
    Calendar,
    User,
    ArrowRight,
    Tag,
    FolderKanban,
    Eye,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/UI/Pagination';

export default function Index({ posts, categories = [], popularTags = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('public.posts.index'),
            { search, category: filters.category },
            { preserveState: true }
        );
    };

    return (
        <PublicLayout>
            <Head title="Warta & Berita Universitas" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
                {/* Header Title */}
                <div className="max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                        <BookOpen className="h-3.5 w-3.5" />
                        Publikasi & Informasi Kampus
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Warta, Riset &amp; Kabar Universitas
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                        Informasi terkini mengenai capaian akademik, inovasi riset dosen, prestasi mahasiswa, dan pengumuman resmi rektorat.
                    </p>
                </div>

                {/* Main Content Layout with Sidebar */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
                    {/* Articles Grid (3 cols) */}
                    <div className="space-y-8 lg:col-span-3">
                        {/* Search & Active Category Banner */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
                            <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari berita atau artikel..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </form>

                            {filters.category && (
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-400">Kategori aktif:</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                        {filters.category}
                                    </span>
                                    <Link
                                        href={route('public.posts.index')}
                                        className="text-[11px] text-slate-400 hover:text-rose-500 ml-1"
                                    >
                                        (Reset)
                                    </Link>
                                </div>
                            )}
                        </div>

                        {posts.data.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                                <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                                    Tidak Ada Artikel Ditemukan
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                    Silakan gunakan kata kunci pencarian lain atau pilih kategori yang tersedia.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                                {posts.data.map((post) => (
                                    <article
                                        key={post.id}
                                        className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700 transition-all duration-300"
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                                            {post.thumbnail_url ? (
                                                <img
                                                    src={post.thumbnail_url}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-indigo-50/50 text-indigo-400 dark:bg-indigo-950/30">
                                                    <BookOpen className="h-10 w-10" />
                                                </div>
                                            )}
                                            {post.category && (
                                                <div className="absolute top-3 left-3">
                                                    <Link
                                                        href={route('public.categories.show', post.category.slug)}
                                                        className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-indigo-600 shadow-sm backdrop-blur-sm dark:bg-slate-950/90 dark:text-indigo-400 hover:text-indigo-700"
                                                    >
                                                        {post.category.name}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {post.user?.name || 'Humas'}
                                                </span>
                                            </div>

                                            <Link
                                                href={route('public.posts.show', post.slug)}
                                                className="block font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors text-base line-clamp-2 leading-snug"
                                            >
                                                {post.title}
                                            </Link>

                                            {post.summary && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {post.summary}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                    <Eye className="h-3 w-3" /> {post.views_count || 0} dibaca
                                                </span>
                                                <Link
                                                    href={route('public.posts.show', post.slug)}
                                                    className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-xs"
                                                >
                                                    Baca Selengkapnya <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {posts.links && posts.data.length > 0 && (
                            <div className="flex justify-center pt-6">
                                <Pagination links={posts.links} />
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Categories & Popular Tags (1 col) */}
                    <div className="space-y-8">
                        {/* Categories Box */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <FolderKanban className="h-4 w-4 text-indigo-600" />
                                Kategori Warta
                            </h3>
                            <ul className="space-y-2 text-xs">
                                {categories.map((c) => (
                                    <li key={c.id}>
                                        <Link
                                            href={route('public.categories.show', c.slug)}
                                            className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white transition-colors"
                                        >
                                            <span className="font-medium">{c.name}</span>
                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                {c.posts_count}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Popular Tags Box */}
                        {popularTags.length > 0 && (
                            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-indigo-600" />
                                    Topik &amp; Tag Populer
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('public.tags.show', tag.slug)}
                                            className="rounded-lg border border-slate-200/80 bg-slate-50/50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:text-white transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
