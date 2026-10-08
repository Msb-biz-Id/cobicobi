import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function GalleriesSection({ galleries = [] }) {
    if (!galleries || galleries.length === 0) return null;

    return (
        <section className="py-20 sm:py-24 bg-white dark:bg-[#070b14]">
            <div className="site-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                    <div>
                        <span className="section-label">
                            GALERI KAMPUS
                        </span>
                        <h2 className="section-title">
                            Momen &amp; Dokumentasi Kegiatan
                        </h2>
                        <div className="w-16 h-1.5 bg-secondary-400 rounded-full mt-3" />
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                            Potret kehidupan akademik, riset laboratorium, wisuda sarjana, dan prestasi sivitas akademika.
                        </p>
                    </div>

                    <Link
                        href={route('public.galleries.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors shrink-0"
                    >
                        Lihat Seluruh Album <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleries.slice(0, 8).map((album, idx) => (
                        <Link
                            key={album.id}
                            href={route('public.galleries.show', album.slug)}
                            className={`group relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all duration-300 ${
                                idx === 0 ? 'col-span-2 row-span-2 aspect-[16/10] sm:aspect-auto' : 'aspect-square'
                            }`}
                        >
                            <img
                                src={album.cover_image_url || '/images/campus-hero.png'}
                                alt={album.title}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white space-y-1">
                                <span className="inline-block text-[10px] font-bold text-secondary-300 uppercase tracking-wider">
                                    {album.category || 'Dokumentasi Kampus'}
                                </span>
                                <h3 className={`font-bold leading-tight group-hover:text-secondary-300 transition-colors line-clamp-2 font-heading ${
                                    idx === 0 ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm'
                                }`}>
                                    {album.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
