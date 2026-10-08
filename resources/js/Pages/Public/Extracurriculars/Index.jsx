import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Compass, Users, ChevronRight, Sparkles } from 'lucide-react';

export default function ExtracurricularsIndex({ extracurriculars = [], filters = {} }) {
    return (
        <PublicLayout>
            <Head title="Ekstrakurikuler & Organisasi Kemahasiswaan" />

            <main className="bg-slate-50 dark:bg-[#070b14] min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="site-container py-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Beranda
                        </Link>
                        <span>&raquo;</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Ekstrakurikuler</span>
                    </div>
                </div>

                <div className="site-container py-12 sm:py-16 space-y-10">
                    {/* Header Banner */}
                    <div className="space-y-3">
                        <span className="inline-block text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                            KEGIATAN KEMAHASISWAAN
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Ekstrakurikuler &amp; Komunitas Kampus
                        </h1>
                        <div className="w-16 h-1.5 bg-amber-400 rounded-full" />
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Wadah pengembangan minat, bakat, kepemimpinan, seni, olahraga, dan pengabdian sosial mahasiswa di lingkungan kampus.
                        </p>
                    </div>

                    {/* Extracurriculars Grid */}
                    {extracurriculars.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400 dark:border-slate-800">
                            Belum ada ekstrakurikuler yang dipublikasikan saat ini.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {extracurriculars.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('public.extracurriculars.show', item.slug)}
                                    className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300"
                                >
                                    <div className="sm:w-[260px] sm:min-w-[260px] h-[220px] sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                                        <img
                                            src={item.image_url || '/images/students-activity.png'}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';
                                            }}
                                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="p-6 flex flex-col justify-center space-y-2">
                                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                            {item.category || 'Unit Kegiatan Mahasiswa'}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {item.description || 'Organisasi kemahasiswaan aktif dalam mengembangkan kreativitas dan prestasi.'}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-2">
                                            Lihat Profil Komunitas <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
