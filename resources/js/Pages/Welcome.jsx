import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Calendar,
    BookOpen,
    GraduationCap,
    Clock,
    MapPin,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Users,
    Award,
    TrendingUp,
    FileText,
    ExternalLink,
    Search,
} from 'lucide-react';

export default function Welcome({ webSetting, latestPosts = [], upcomingEvents = [], categories = [] }) {
    const siteTitle = webSetting?.site_title || 'Universitas Sains & Teknologi Nusantara';
    const slogan = webSetting?.slogan || 'Excellence in Research, Integrity in Character, Global in Impact';

    return (
        <PublicLayout>
            <Head title={`Beranda - ${siteTitle}`} />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 py-16 sm:py-24 dark:border-slate-800/80 dark:from-[#091124] dark:via-[#070b14] dark:to-[#070b14]">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-20" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs backdrop-blur-sm dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                            Pusat Keunggulan Sains, Teknologi &amp; Kepemimpinan Global
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                            Membangun Masa Depan Melalui{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                                Riset, Inovasi &amp; Karakter
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                            {slogan}. Akses terintegrasi warta akademik, konferensi ilmiah bergengsi, dan kalender kegiatan universitas kelas dunia.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <Link
                                href={route('public.events.index')}
                                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Calendar className="h-4 w-4" />
                                Kalender Event &amp; Pendaftaran
                            </Link>
                            <Link
                                href={route('public.posts.index')}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 transition-all"
                            >
                                <BookOpen className="h-4 w-4" />
                                Baca Warta Kampus
                            </Link>
                        </div>

                        {/* Campus Metric Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-10 sm:grid-cols-4 w-full">
                            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">UNGGUL</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Akreditasi BAN-PT</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
                                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">18+</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Program Studi</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">250+</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Publikasi Scopus</span>
                            </div>
                            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/40">
                                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">95%</span>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Serapan Alumni</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 1: Upcoming Campus Events */}
            <section className="py-16 sm:py-20 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                <Calendar className="h-3.5 w-3.5" />
                                Agenda &amp; Konferensi
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                                Event &amp; Seminar Kampus Mendatang
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Hadiri forum ilmiah, seminar nasional, kuliah umum, dan pameran karir.
                            </p>
                        </div>
                        <Link
                            href={route('public.events.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Lihat Semua Agenda <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
                            Tidak ada event mendatang yang dijadwalkan saat ini.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {upcomingEvents.map((evt) => (
                                <div
                                    key={evt.id}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/60 transition-all duration-300"
                                >
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                                        {evt.cover_image_url ? (
                                            <img
                                                src={evt.cover_image_url}
                                                alt={evt.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-indigo-400 dark:bg-indigo-950/40">
                                                <Calendar className="h-8 w-8" />
                                            </div>
                                        )}
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-bold text-indigo-600 shadow-xs dark:bg-slate-950/90 dark:text-indigo-400">
                                                {evt.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-5 space-y-3">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                            <Clock className="h-3 w-3" />
                                            <span>{evt.formatted_date_range}</span>
                                        </div>

                                        <Link
                                            href={route('public.events.show', evt.slug)}
                                            className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 text-sm line-clamp-2"
                                        >
                                            {evt.title}
                                        </Link>

                                        {evt.venue_name && (
                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{evt.venue_name}</span>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {evt.price || 'Gratis'}
                                            </span>
                                            <Link
                                                href={route('public.events.show', evt.slug)}
                                                className="font-bold text-indigo-600 hover:underline text-xs inline-flex items-center gap-0.5"
                                            >
                                                Daftar <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 2: Latest News & Research Publications */}
            <section className="py-16 sm:py-20 bg-slate-50/60 dark:bg-slate-900/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                <BookOpen className="h-3.5 w-3.5" />
                                Warta &amp; Publikasi
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                                Kabar Terkini &amp; Warta Ilmiah
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Artikel ilmiah, inovasi teknologi terapan, dan berita resmi universitas.
                            </p>
                        </div>
                        <Link
                            href={route('public.posts.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Arsip Berita Lengkap <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {latestPosts.map((post) => (
                            <article
                                key={post.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/60 transition-all duration-300"
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
                                                className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-indigo-600 shadow-sm backdrop-blur-sm dark:bg-slate-950/90 dark:text-indigo-400"
                                            >
                                                {post.category.name}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-6 space-y-3">
                                    <span className="text-[11px] text-slate-400">
                                        {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>

                                    <Link
                                        href={route('public.posts.show', post.slug)}
                                        className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors text-base line-clamp-2 leading-snug"
                                    >
                                        {post.title}
                                    </Link>

                                    {post.summary && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {post.summary}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        <Link
                                            href={route('public.posts.show', post.slug)}
                                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-xs"
                                        >
                                            Baca Artikel <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
