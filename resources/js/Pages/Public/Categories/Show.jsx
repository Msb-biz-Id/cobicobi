import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FolderKanban, Calendar, ArrowRight, User, BookOpen } from 'lucide-react';
import Pagination from '@/Components/UI/Pagination';

export default function Show({ category, posts }) {
    return (
        <PublicLayout>
            <Head title={`Arsip Kategori: ${category.name} - Warta Universitas`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
                <div className="max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                        <FolderKanban className="h-3.5 w-3.5" />
                        Arsip Kategori
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                            {category.description}
                        </p>
                    )}
                </div>

                {posts.data.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                        <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
                        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                            Belum Ada Artikel dalam Kategori Ini
                        </h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <article
                                key={post.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/60 transition-all duration-300"
                            >
                                {post.thumbnail_url && (
                                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                                        <img
                                            src={post.thumbnail_url}
                                            alt={post.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-1 flex-col p-6 space-y-3">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                    <Link
                                        href={route('public.posts.show', post.slug)}
                                        className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors text-base line-clamp-2"
                                    >
                                        {post.title}
                                    </Link>

                                    {post.summary && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {post.summary}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        <Link
                                            href={route('public.posts.show', post.slug)}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                        >
                                            Baca <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
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
        </PublicLayout>
    );
}
