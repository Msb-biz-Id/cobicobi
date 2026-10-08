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
    CheckCircle2,
    ShieldCheck,
    ExternalLink,
    BookOpen,
    MessageCircle,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { FacebookIcon, XIcon } from '@/Components/Icons/SocialIcons';

export default function Show({ post, relatedPosts = [], isPreview = false }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Social share URLs
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(post.title);
    const encodedUrl = encodeURIComponent(currentUrl);

    const shareWhatsapp = `https://api.whatsapp.com/send?text=${shareTitle}%20${encodedUrl}`;
    const shareTwitter = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`;
    const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const shareTelegram = `https://t.me/share/url?url=${encodedUrl}&text=${shareTitle}`;

    // Estimated read time based on word count
    const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <PublicLayout>
            <Head title={`${isPreview ? '[PREVIEW] ' : ''}${post.title} - Warta & Berita`} />

            {isPreview && (
                <div className="sticky top-16 z-30 bg-amber-500 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-semibold">
                    <div className="site-container flex items-center gap-2">
                        <span className="rounded bg-black/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            Mode Pratinjau
                        </span>
                        <span>Postingan ini berstatus <strong>{(post.status || 'draft').toUpperCase()}</strong> dan belum dipublikasikan ke publik.</span>
                    </div>
                </div>
            )}

            <main className="bg-slate-50/60 dark:bg-[#070b14] min-h-screen py-8 sm:py-12">
                <div className="site-container">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Beranda
                        </Link>
                        <span>&raquo;</span>
                        <Link href={route('public.posts.index')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Warta &amp; Berita
                        </Link>
                        {post.category && (
                            <>
                                <span>&raquo;</span>
                                <Link
                                    href={route('public.categories.show', post.category.slug)}
                                    className="text-primary-600 hover:underline dark:text-primary-400 font-bold"
                                >
                                    {post.category.name}
                                </Link>
                            </>
                        )}
                        <span>&raquo;</span>
                        <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs font-medium">
                            {post.title}
                        </span>
                    </nav>

                    {/* Main 2-Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                        {/* Left Column (8 Cols): Main Article */}
                        <article className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-8">
                            {/* Article Header */}
                            <header className="space-y-4">
                                {post.category && (
                                    <Link
                                        href={route('public.categories.show', post.category.slug)}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {post.category.name}
                                    </Link>
                                )}

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight font-heading">
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-3.5 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                                            <User className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                                            {post.author_name || post.author?.name || post.user?.name || 'Humas Universitas'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                                            {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            {readingTime} menit baca
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                                            {post.views_count || 0} dibaca
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                        {copied ? 'Tersalin!' : 'Salin Tautan'}
                                    </button>
                                </div>
                            </header>

                            {/* Featured Image */}
                            {post.thumbnail_url && (
                                <div className="overflow-hidden rounded-3xl border border-slate-200/80 aspect-video w-full shadow-md dark:border-slate-800">
                                    <img
                                        src={post.thumbnail_url}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Lead Excerpt */}
                            {post.summary && (
                                <div className="rounded-2xl border-l-4 border-primary-500 bg-primary-50/40 p-4 sm:p-5 text-base sm:text-lg font-medium leading-relaxed text-slate-700 dark:border-primary-600 dark:bg-primary-950/20 dark:text-slate-200 italic">
                                    {post.summary}
                                </div>
                            )}

                            {/* Rich Article Body with Robust Typography */}
                            <div
                                className="prose tiptap-content max-w-none text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Editorial Attribution Card */}
                            {(post.author_name || post.author || post.editor_name || post.editor || post.source) && (
                                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 space-y-3">
                                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                        <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                        Informasi Redaksi &amp; Sumber Rujukan
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                                Penulis / Kontributor
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {post.author_name || post.author?.name || post.user?.name || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                                Editor / Penyunting
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {post.editor_name || post.editor?.name || 'Redaksi Kampus'}
                                            </span>
                                        </div>
                                        {post.source && (
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                                    Sumber Rujukan
                                                </span>
                                                {post.source_url ? (
                                                    <a
                                                        href={post.source_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-semibold text-primary-600 hover:underline dark:text-primary-400 inline-flex items-center gap-1"
                                                    >
                                                        {post.source} <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {post.source}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

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
                                            className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:text-primary-300 transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Back to news button */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('public.posts.index')}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Kembali ke Indeks Warta &amp; Berita
                                </Link>
                            </div>
                        </article>

                        {/* Right Column (4 Cols): STICKY SIDEBAR */}
                        <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6">
                            {/* Card 1: Bagikan Artikel */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-primary-600" />
                                    Bagikan Artikel
                                </h3>

                                <div className="grid grid-cols-2 gap-2.5">
                                    <a
                                        href={shareWhatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" /> WhatsApp
                                    </a>
                                    <a
                                        href={shareTwitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-white hover:bg-slate-200 transition-colors"
                                    >
                                        <XIcon className="w-3.5 h-3.5" /> X (Twitter)
                                    </a>
                                    <a
                                        href={shareFacebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500/10 px-3 py-2.5 text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    >
                                        <FacebookIcon className="w-4 h-4" /> Facebook
                                    </a>
                                    <a
                                        href={shareTelegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500/10 px-3 py-2.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
                                    >
                                        <Send className="w-3.5 h-3.5" /> Telegram
                                    </a>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Tautan Berhasil Disalin!' : 'Salin Tautan Artikel'}
                                </button>
                            </div>

                            {/* Card 2: Berita & Artikel Terkait */}
                            {relatedPosts.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-primary-600" />
                                        Berita &amp; Artikel Terkait
                                    </h3>

                                    <div className="space-y-4">
                                        {relatedPosts.map((rel) => (
                                            <Link
                                                key={rel.id}
                                                href={route('public.posts.show', rel.slug)}
                                                className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                                            >
                                                {rel.thumbnail_url && (
                                                    <div className="w-18 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                                                        <img
                                                            src={rel.thumbnail_url}
                                                            alt={rel.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 leading-snug">
                                                        {rel.title}
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                                        {new Date(rel.published_at || rel.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Card 3: Hotline & Redaksi Kampus */}
                            <div className="rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50/80 to-primary-100/30 p-6 dark:border-primary-950/40 dark:bg-slate-900/40 space-y-3 text-xs">
                                <span className="font-extrabold text-primary-700 dark:text-primary-300 block uppercase tracking-wider text-[11px]">
                                    Kanal Berita Kampus
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Informasi resmi, agenda kegiatan, pengumuman rektorat, dan publikasi penelitian civitas akademika diperbarui secara berkala oleh tim redaksi humas.
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href={route('public.posts.index')}
                                        className="inline-flex items-center gap-1.5 font-bold text-primary-700 hover:underline dark:text-primary-400"
                                    >
                                        Jelajahi Semua Arsip Berita &raquo;
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
