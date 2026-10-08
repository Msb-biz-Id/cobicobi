import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Calendar,
    User,
    Tag,
    Clock,
    Eye,
    ArrowLeft,
    Share2,
    Copy,
    BookOpen,
} from 'lucide-react';
import { useState } from 'react';

export default function Show({ post, relatedPosts = [] }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PublicLayout>
            <Head title={`${post.title} - Warta Universitas`} />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Link href={route('home')} className="hover:text-indigo-600 transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('public.posts.index')} className="hover:text-indigo-600 transition-colors">
                        Warta &amp; Berita
                    </Link>
                    {post.category && (
                        <>
                            <span>/</span>
                            <Link
                                href={route('public.categories.show', post.category.slug)}
                                className="hover:text-indigo-600 transition-colors"
                            >
                                {post.category.name}
                            </Link>
                        </>
                    )}
                </div>

                {/* Article Header */}
                <header className="space-y-4">
                    {post.category && (
                        <Link
                            href={route('public.categories.show', post.category.slug)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40"
                        >
                            {post.category.name}
                        </Link>
                    )}

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-3.5 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                <User className="h-3.5 w-3.5 text-indigo-500" />
                                {post.user?.name || 'Humas Universitas'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                {post.views_count || 0} kali dibaca
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Copy className="h-3 w-3" />
                            {copied ? 'Tersalin!' : 'Bagikan Artikel'}
                        </button>
                    </div>
                </header>

                {/* Cover Image */}
                {post.thumbnail_url && (
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 aspect-video w-full shadow-lg dark:border-slate-800">
                        <img
                            src={post.thumbnail_url}
                            alt={post.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* Excerpt / Summary (Lead Paragraph) */}
                {post.summary && (
                    <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-200 italic border-l-4 border-indigo-500 pl-4">
                        {post.summary}
                    </p>
                )}

                {/* Rich Text Body TipTap */}
                <article
                    className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-3xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags / Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                            <Tag className="h-3 w-3" /> Topik:
                        </span>
                        {post.hashtags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={route('public.tags.show', tag.slug)}
                                className="rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 transition-colors"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <div className="pt-12 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Berita &amp; Artikel Terkait
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {relatedPosts.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={route('public.posts.show', rel.slug)}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 hover:shadow-md transition-shadow"
                                >
                                    {rel.thumbnail_url && (
                                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                                            <img
                                                src={rel.thumbnail_url}
                                                alt={rel.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    )}
                                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 text-xs line-clamp-2">
                                        {rel.title}
                                    </h3>
                                    <span className="text-[10px] text-slate-400 mt-2">
                                        {new Date(rel.published_at || rel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
