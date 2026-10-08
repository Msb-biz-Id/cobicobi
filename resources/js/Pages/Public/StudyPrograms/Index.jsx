import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Library, GraduationCap, Users, ArrowRight, ShieldCheck, Sparkles, Building2, Briefcase } from 'lucide-react';

export default function StudyProgramsPublicIndex({ studyPrograms = [], faculties = [], filters = {} }) {
    const [selectedFaculty, setSelectedFaculty] = useState(filters.fakultas || '');
    const [selectedDegree, setSelectedDegree] = useState(filters.jenjang || '');

    const handleFilterChange = (fakultas, jenjang) => {
        router.get(
            route('public.study-programs.index'),
            { fakultas, jenjang },
            { preserveState: true }
        );
    };

    return (
        <PublicLayout>
            <Head title="Program Studi - Jelajahi Jurusan & Jenjang Studi" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-16 sm:py-24 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Kurikulum Mutakhir & Prospek Karir Global
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Daftar Program Studi
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Pilih program studi masa depan Anda, dari jenjang Diploma, Sarjana, hingga Pascasarjana dengan sertifikasi industri dan peluang karir yang luas.
                    </p>

                    {/* Filter Pills */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedDegree('');
                                handleFilterChange(selectedFaculty, '');
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                                selectedDegree === ''
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                            }`}
                        >
                            Semua Jenjang
                        </button>
                        {['D3', 'D4', 'S1', 'S2', 'S3'].map((deg) => (
                            <button
                                key={deg}
                                onClick={() => {
                                    setSelectedDegree(deg);
                                    handleFilterChange(selectedFaculty, deg);
                                }}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                                    selectedDegree === deg
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                                }`}
                            >
                                Jenjang {deg}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* List Program Studi */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studyPrograms.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            Tidak ditemukan program studi yang sesuai filter.
                        </div>
                    ) : (
                        studyPrograms.map((prodi) => (
                            <div
                                key={prodi.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                {prodi.logo_url ? (
                                                    <img src={prodi.logo_url} alt={prodi.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Library className="w-6 h-6 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                        {prodi.degree_level}
                                                    </span>
                                                    {prodi.graduate_title && (
                                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                            {prodi.graduate_title}
                                                        </span>
                                                    )}
                                                </div>
                                                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                                                    {prodi.name}
                                                </h2>
                                            </div>
                                        </div>

                                        {prodi.accreditation && (
                                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900">
                                                {prodi.accreditation}
                                            </span>
                                        )}
                                    </div>

                                    {/* Fakultas / Status Mandiri */}
                                    <div className="mt-3 text-xs flex items-center gap-1.5 text-slate-500">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                        <span>
                                            {prodi.faculty ? (
                                                prodi.faculty.name
                                            ) : (
                                                <em className="text-amber-600 dark:text-amber-400 font-medium">Program Studi Mandiri (Vokasi)</em>
                                            )}
                                        </span>
                                    </div>

                                    {/* Prospek Karir Pills */}
                                    {prodi.career_prospects && prodi.career_prospects.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                                                <Briefcase className="w-3 h-3 text-blue-500" /> Prospek Karir:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {prodi.career_prospects.slice(0, 3).map((cp, idx) => (
                                                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50/60 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                                        {cp}
                                                    </span>
                                                ))}
                                                {prodi.career_prospects.length > 3 && (
                                                    <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                                                        +{prodi.career_prospects.length - 3} lagi
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Stats */}
                                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span>{prodi.lecturers_count || 0} Dosen Pengajar</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        {prodi.code || 'Prodi Terakreditasi'}
                                    </span>
                                    <Link
                                        href={route('public.study-programs.show', prodi.slug)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition"
                                    >
                                        Detail Kurikulum &amp; Profil <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
