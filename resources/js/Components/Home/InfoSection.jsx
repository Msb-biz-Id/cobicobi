import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, MapPin, Megaphone } from 'lucide-react';

export default function InfoSection({ posts = [], events = [], announcements = [] }) {
    return (
        <section className="py-16 sm:py-20 bg-slate-50/80 dark:bg-slate-900/40">
            <div className="site-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                    <div>
                        <span className="section-label">
                            INFORMASI TERKINI
                        </span>
                        <h2 className="section-title">
                            Warta, Agenda &amp; Pengumuman
                        </h2>
                        <div className="section-underline" />
                    </div>

                    <Link
                        href={route('public.posts.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-2xs"
                    >
                        Lihat Semua Berita <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Berita Terbaru (2 Kolom) */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center justify-between border-l-4 border-primary-600 pl-3">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                                Berita Terkini
                            </h3>
                            <Link href={route('public.posts.index')} className="text-xs font-bold text-primary-600 hover:underline">
                                Semua &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {posts.slice(0, 4).map((post) => (
                                <article
                                    key={post.id}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300"
                                >
                                    <div className="relative h-[140px] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                                        <img
                                            src={post.thumbnail_url || '/images/building.png'}
                                            alt={post.title}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {post.category && (
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className="rounded-md bg-secondary-400 text-slate-950 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                                                    {post.category.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 flex flex-col flex-1 space-y-1.5">
                                        <Link
                                            href={route('public.posts.show', post.slug)}
                                            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug font-heading"
                                        >
                                            {post.title}
                                        </Link>

                                        {post.excerpt && (
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                                            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                                                Baca &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Kolom Kanan: Agenda & Pengumuman (1 Kolom) */}
                    <div className="space-y-7">
                        {/* Agenda Kampus */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-l-4 border-secondary-500 pl-3">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                                    Agenda Kampus
                                </h3>
                                <Link href={route('public.events.index')} className="text-xs font-bold text-primary-600 hover:underline">
                                    Semua &rarr;
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {events.slice(0, 3).map((evt) => {
                                    const eventDate = new Date(evt.start_date || evt.created_at);
                                    const day = eventDate.getDate();
                                    const month = eventDate.toLocaleDateString('id-ID', { month: 'short' });
                                    return (
                                        <Link
                                            key={evt.id}
                                            href={route('public.events.show', evt.slug)}
                                            className="group flex overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 hover:border-secondary-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all gap-3.5 shadow-2xs"
                                        >
                                            <div className="flex h-13 w-13 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-xs">
                                                <span className="text-base font-black leading-none">{day}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{month}</span>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 font-heading">
                                                    {evt.title}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                                                    <Clock className="w-3 h-3 text-secondary-500 shrink-0" />
                                                    <span className="truncate">{evt.formatted_date_range || 'Sesuai Jadwal'}</span>
                                                </div>
                                                {evt.venue_name && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-primary-500 shrink-0" />
                                                        <span className="truncate">{evt.venue_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pengumuman Resmi */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-3">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading">
                                    Pengumuman Resmi
                                </h3>
                                <Link href={route('public.announcements.index')} className="text-xs font-bold text-primary-600 hover:underline">
                                    Semua &rarr;
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {announcements.slice(0, 3).map((ann) => (
                                    <Link
                                        key={ann.id}
                                        href={route('public.announcements.show', ann.slug)}
                                        className="group flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all shadow-2xs"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            <Megaphone className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1 font-heading">
                                                {ann.title}
                                            </h4>
                                            <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
                                                {new Date(ann.published_at || ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
