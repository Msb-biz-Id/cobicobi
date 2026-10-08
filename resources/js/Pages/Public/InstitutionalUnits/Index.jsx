import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Network, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function InstitutionalUnitsPublicIndex({ units = [], filters = {} }) {
    const handleCategoryFilter = (cat) => {
        router.get(route('public.institutional-units.index'), { kategori: cat }, { preserveState: true });
    };

    const getCategoryLabel = (cat) => {
        switch (cat) {
            case 'upt':
                return 'Unit Pelaksana Teknis (UPT)';
            case 'lembaga':
                return 'Lembaga Penunjang';
            case 'biro':
                return 'Biro Administrasi';
            default:
                return 'Organisasi & Badan Khusus';
        }
    };

    return (
        <PublicLayout>
            <Head title="Unit, UPT & Lembaga Kampus" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-white py-16 sm:py-24 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
                <div className="site-container text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Layanan & Fasilitas Terpadu
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Unit, UPT & Lembaga
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Pusat layanan akademik, laboratorium riset terpadu, perpustakaan digital, serta lembaga penjaminan mutu yang menunjang aktivitas sivitas akademika.
                    </p>

                    {/* Filter Pills */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {[
                            { val: '', label: 'Semua Kategori' },
                            { val: 'upt', label: 'UPT' },
                            { val: 'lembaga', label: 'Lembaga' },
                            { val: 'biro', label: 'Biro' },
                            { val: 'organisasi', label: 'Badan Khusus' },
                        ].map((btn) => (
                            <button
                                key={btn.val}
                                onClick={() => handleCategoryFilter(btn.val)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                                    (filters.kategori || '') === btn.val
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* List Cards */}
            <section className="site-container pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            Belum ada unit atau lembaga untuk kategori yang dipilih.
                        </div>
                    ) : (
                        units.map((unit) => (
                            <div
                                key={unit.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-900"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                {unit.logo_url ? (
                                                    <img src={unit.logo_url} alt={unit.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Network className="w-6 h-6 text-purple-600" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                                    {getCategoryLabel(unit.category)}
                                                </span>
                                                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-purple-600 transition-colors">
                                                    {unit.name}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                                    {unit.description && (
                                        <div
                                            className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: unit.description }}
                                        />
                                    )}

                                    {unit.office_location && (
                                        <p className="mt-3 text-xs text-slate-500">
                                            📍 {unit.office_location}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        {unit.code || 'Unit Kampus'}
                                    </span>
                                    <Link
                                        href={route('public.institutional-units.show', unit.slug)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 transition"
                                    >
                                        Profil &amp; Layanan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
