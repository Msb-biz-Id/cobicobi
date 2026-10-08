import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Building2, GraduationCap, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function FacultiesPublicIndex({ faculties = [] }) {
    return (
        <PublicLayout>
            <Head title="Fakultas & Program Studi - Keunggulan Akademik" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white py-16 sm:py-24 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
                <div className="site-container text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Pusat Keunggulan Akademik
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Fakultas & Lingkungan Akademik
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Jelajahi fakultas-fakultas terkemuka kami dengan kurikulum berbasis masa depan, riset berdampak, serta fasilitas bertaraf internasional.
                    </p>
                </div>
            </section>

            {/* List Faculties */}
            <section className="site-container pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {faculties.map((fac) => (
                        <div
                            key={fac.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            {fac.logo_url ? (
                                                <img src={fac.logo_url} alt={fac.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Building2 className="w-8 h-8 text-indigo-600" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                {fac.code || fac.abbreviation || 'FAKULTAS'}
                                            </span>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 transition-colors">
                                                {fac.name}
                                            </h2>
                                        </div>
                                    </div>

                                    {fac.accreditation && (
                                        <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900 flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" /> {fac.accreditation}
                                        </span>
                                    )}
                                </div>

                                {fac.description && (
                                    <div
                                        className="mt-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 prose dark:prose-invert prose-sm"
                                        dangerouslySetInnerHTML={{ __html: fac.description }}
                                    />
                                )}

                                {/* Pimpinan Dekanat */}
                                {fac.current_assignments && fac.current_assignments.length > 0 && (
                                    <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                            Pimpinan Dekanat:
                                        </span>
                                        <div className="mt-1 space-y-1">
                                            {fac.current_assignments.map((asg) => (
                                                <p key={asg.id} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{asg.position?.name || 'Pejabat'}: </span>
                                                    {asg.staff_profile?.full_name_with_titles || asg.staff_profile?.name}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Stats */}
                                <div className="mt-6 flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                                        <span>{fac.study_programs_count || 0} Program Studi</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        <span>{fac.lecturers_count || 0} Dosen Pengajar</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                    {fac.office_location ? `📍 ${fac.office_location}` : 'Gedung Fakultas'}
                                </span>
                                <Link
                                    href={route('public.faculties.show', fac.slug)}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
                                >
                                    Eksplorasi Profil <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
