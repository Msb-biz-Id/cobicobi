import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function FacilitiesShow({ facility, relatedFacilities = [] }) {
    return (
        <PublicLayout>
            <Head title={`${facility.name} - Fasilitas Kampus`} />

            <main className="bg-slate-50 dark:bg-[#070b14] min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="site-container py-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Beranda
                        </Link>
                        <span>&raquo;</span>
                        <Link href={route('public.facilities.index')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Fasilitas
                        </Link>
                        <span>&raquo;</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{facility.name}</span>
                    </div>
                </div>

                <div className="site-container py-12 space-y-12">
                    {/* Header Banner */}
                    <div className="relative rounded-3xl overflow-hidden min-h-[360px] sm:h-[420px] shadow-lg flex flex-col justify-end p-8 text-white">
                        <img
                            src={facility.image_url || '/images/building.png'}
                            alt={facility.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
                            }}
                            className="absolute inset-0 w-full h-full object-cover -z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent -z-10" />

                        <div className="space-y-3 max-w-3xl">
                            {facility.category && (
                                <span className="inline-block text-xs font-black uppercase tracking-wider bg-secondary-400 text-slate-950 px-3.5 py-1 rounded-full shadow-xs">
                                    {facility.category}
                                </span>
                            )}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight font-heading">
                                {facility.name}
                            </h1>
                            {facility.location && (
                                <p className="flex items-center gap-2 text-sm text-white/90">
                                    <MapPin className="w-4 h-4 text-secondary-400" />
                                    <span>{facility.location}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Content Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                                Deskripsi Sarana &amp; Fungsi
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                                {facility.description || 'Fasilitas ini disediakan untuk mendukung kegiatan perkuliahan, riset praktikum, serta operasional akademik di lingkungan kampus.'}
                            </div>

                            {facility.specifications && (
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Fasilitas &amp; Kelengkapan Ruang
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                        {Array.isArray(facility.specifications) ? (
                                            facility.specifications.map((spec, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    <span>{spec}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>{facility.specifications}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('public.facilities.index')}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Fasilitas
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar Fasilitas Terkait */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
                            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                                    Fasilitas Lainnya
                                </h3>
                                <div className="space-y-3">
                                    {relatedFacilities.slice(0, 4).map((rel) => (
                                        <Link
                                            key={rel.id}
                                            href={route('public.facilities.show', rel.slug)}
                                            className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                        >
                                            <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                                                <img src={rel.image_url || '/images/building.png'} alt={rel.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                                                    {rel.name}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 block truncate">
                                                    {rel.location || 'Kampus Utama'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
