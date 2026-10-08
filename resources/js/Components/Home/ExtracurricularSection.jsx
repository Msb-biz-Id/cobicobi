import { Link } from '@inertiajs/react';
import { ArrowRight, Compass } from 'lucide-react';

export default function ExtracurricularSection({ extracurriculars = [] }) {
    if (!extracurriculars || extracurriculars.length === 0) return null;

    return (
        <section className="py-20 sm:py-24 bg-slate-50/80 dark:bg-slate-900/40">
            <div className="site-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                    <div>
                        <span className="section-label">
                            ORGANISASI &amp; UKM KEMAHASISWAAN
                        </span>
                        <h2 className="section-title">
                            Aktivitas &amp; Ekstrakurikuler Kampus
                        </h2>
                        <div className="w-16 h-1.5 bg-secondary-400 rounded-full mt-3" />
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                            Wadah eksplorasi minat, bakat, kepemimpinan, dan jejaring sosial mahasiswa.
                        </p>
                    </div>

                    <Link
                        href={route('public.extracurriculars.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shrink-0"
                    >
                        Lihat Semua Komunitas <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {extracurriculars.map((item) => (
                        <Link
                            key={item.id}
                            href={route('public.extracurriculars.show', item.slug)}
                            className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900 transition-all duration-300"
                        >
                            <div className="sm:w-[240px] sm:min-w-[240px] h-[200px] sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary-50/50 text-primary-400">
                                        <Compass className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col justify-center space-y-2">
                                <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    {item.category || 'Unit Kegiatan Mahasiswa'}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-heading">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.description || 'Komunitas pengembangan bakat mahasiswa di lingkungan kampus.'}
                                </p>
                                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 pt-2 inline-flex items-center gap-1">
                                    Informasi Keanggotaan &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
