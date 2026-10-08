import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Compass, Users, ChevronRight, ArrowLeft } from 'lucide-react';

export default function ExtracurricularsShow({ extracurricular, otherExtracurriculars = [] }) {
    return (
        <PublicLayout>
            <Head title={`${extracurricular.name} - Ekstrakurikuler Kampus`} />

            <main className="bg-slate-50 dark:bg-[#070b14] min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="site-container py-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="text-indigo-600 hover:underline dark:text-indigo-400 font-semibold">
                            Beranda
                        </Link>
                        <span>&raquo;</span>
                        <Link href={route('public.extracurriculars.index')} className="text-indigo-600 hover:underline dark:text-indigo-400 font-semibold">
                            Ekstrakurikuler
                        </Link>
                        <span>&raquo;</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{extracurricular.name}</span>
                    </div>
                </div>

                <div className="site-container py-12 space-y-12">
                    {/* Header Banner */}
                    <div className="relative rounded-3xl overflow-hidden min-h-[340px] sm:h-[400px] shadow-lg flex flex-col justify-end p-8 text-white">
                        <img
                            src={extracurricular.image_url || '/images/students-activity.png'}
                            alt={extracurricular.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80';
                            }}
                            className="absolute inset-0 w-full h-full object-cover -z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent -z-10" />

                        <div className="space-y-3 max-w-3xl">
                            {extracurricular.category && (
                                <span className="inline-block text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full shadow-xs">
                                    {extracurricular.category}
                                </span>
                            )}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                                {extracurricular.name}
                            </h1>
                        </div>
                    </div>

                    {/* Content Detail */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Profil &amp; Kegiatan Organisasi
                            </h2>

                            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {extracurricular.description || 'Organisasi kemahasiswaan ini aktif dalam pembinaan karakter, latihan rutin, kepemimpinan, dan keikutsertaan kompetisi tingkat regional maupun nasional.'}
                            </div>
                        </div>

                        {/* Sidebar / Other Communities */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
                            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Komunitas Lainnya
                                </h3>
                                <div className="space-y-3">
                                    {otherExtracurriculars.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route('public.extracurriculars.show', item.slug)}
                                            className="group flex items-center gap-3 rounded-2xl border border-slate-100 p-3 hover:border-indigo-500 hover:shadow-xs dark:border-slate-800 transition-all"
                                        >
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                <Compass className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                                                    {item.name}
                                                </h4>
                                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                                    {item.category || 'UKM'}
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
