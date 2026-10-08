import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MapPin } from 'lucide-react';

export default function FacilitiesIndex({ facilities = [] }) {
    return (
        <PublicLayout>
            <Head title="Fasilitas Kampus & Sarana Prasarana Modern" />

            <main className="bg-slate-50 dark:bg-[#070b14] min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="site-container py-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Beranda
                        </Link>
                        <span>&raquo;</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Fasilitas Kampus</span>
                    </div>
                </div>

                <div className="site-container py-12 sm:py-16 space-y-10">
                    {/* Header Banner */}
                    <div className="space-y-3">
                        <span className="section-label">
                            SARANA &amp; PRASARANA
                        </span>
                        <h1 className="section-title">
                            Fasilitas Kampus Terpadu
                        </h1>
                        <div className="w-16 h-1.5 bg-secondary-400 rounded-full" />
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Fasilitas lengkap dan modern untuk mendukung proses pembelajaran, penelitian, inovasi teknologi, serta pengembangan talenta mahasiswa.
                        </p>
                    </div>

                    {/* Facilities Grid */}
                    {facilities.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400 dark:border-slate-800">
                            Belum ada fasilitas kampus yang dipublikasikan saat ini.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {facilities.map((item, i) => {
                                const cleanDesc =
                                    item.short_description ||
                                    (item.description || '').replace(/<[^>]*>/g, '') ||
                                    'Sarana prasarana modern untuk mendukung aktivitas akademik kampus.';
                                const imgSrc =
                                    item.primary_image_url ||
                                    item.image_url ||
                                    '/images/building.png';

                                return (
                                    <Link
                                        key={item.id}
                                        href={route('public.facilities.show', item.slug)}
                                        className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-slate-900 block ${
                                            i === 0 ? 'md:col-span-2 h-[360px]' : 'h-[300px]'
                                        }`}
                                    >
                                        <img
                                            src={imgSrc}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/building.png';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent pointer-events-none" />

                                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white z-10 space-y-2">
                                            <span className="inline-block bg-secondary-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                {item.category_label || item.category || 'Fasilitas Kampus'}
                                            </span>
                                            <h3 className="text-lg sm:text-2xl font-black leading-tight group-hover:text-secondary-300 transition-colors font-heading">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                                                {cleanDesc}
                                            </p>
                                            {item.location && (
                                                <div className="flex items-center gap-1.5 text-xs text-secondary-300/90 pt-1">
                                                    <MapPin className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                                                    <span className="truncate">{item.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
