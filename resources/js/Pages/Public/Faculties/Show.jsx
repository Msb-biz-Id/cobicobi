import { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Building2,
    GraduationCap,
    Users,
    Mail,
    Phone,
    MapPin,
    Globe,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    ArrowRight,
    ExternalLink,
    Sparkles,
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon } from '@/Components/Icons/SocialIcons';

export default function FacultyPublicShow({ faculty }) {
    const [activeTab, setActiveTab] = useState('profil'); // profil, visi-misi, prodi
    const sliderRef = useRef(null);

    const lecturers = faculty.lecturers || [];
    const studyPrograms = faculty.study_programs || [];
    const assignments = faculty.current_assignments || [];

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 340;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <PublicLayout>
            <Head title={`${faculty.name} - Profil Resmi Fakultas`} />

            {/* Header Hero Cover */}
            <div className="relative bg-slate-900 text-white">
                <div className="h-64 sm:h-80 w-full overflow-hidden relative">
                    {faculty.cover_url ? (
                        <img
                            src={faculty.cover_url}
                            alt={faculty.name}
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="site-container relative -mt-24 sm:-mt-32 pb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center shrink-0">
                            {faculty.logo_url ? (
                                <img src={faculty.logo_url} alt={faculty.name} className="h-full w-full object-cover" />
                            ) : (
                                <Building2 className="w-16 h-16 text-indigo-600" />
                            )}
                        </div>

                        <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                    {faculty.code || faculty.abbreviation || 'FAKULTAS'}
                                </span>
                                {faculty.accreditation && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Akreditasi {faculty.accreditation}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                                {faculty.name}
                            </h1>

                            {faculty.decree_number && (
                                <p className="text-xs text-slate-300">
                                    Nomor SK: {faculty.decree_number}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="site-container py-10 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column (2 Cols): Profil, Visi Misi, Prodi */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-sm font-semibold">
                            <button
                                onClick={() => setActiveTab('profil')}
                                className={`pb-3 px-1 border-b-2 transition ${
                                    activeTab === 'profil'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                }`}
                            >
                                Profil &amp; Deskripsi
                            </button>
                            <button
                                onClick={() => setActiveTab('visi-misi')}
                                className={`pb-3 px-1 border-b-2 transition ${
                                    activeTab === 'visi-misi'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                }`}
                            >
                                Visi, Misi &amp; Tujuan
                            </button>
                            <button
                                onClick={() => setActiveTab('prodi')}
                                className={`pb-3 px-1 border-b-2 transition flex items-center gap-1.5 ${
                                    activeTab === 'prodi'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                }`}
                            >
                                Program Studi <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{studyPrograms.length}</span>
                            </button>
                        </div>

                        {/* Tab Content 1: Profil */}
                        {activeTab === 'profil' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                        Tentang {faculty.name}
                                    </h2>
                                    {faculty.description ? (
                                        <div
                                            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: faculty.description }}
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Deskripsi profil fakultas belum tersedia.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content 2: Visi & Misi */}
                        {activeTab === 'visi-misi' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                                    {faculty.vision && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-indigo-600" /> Visi Fakultas
                                            </h3>
                                            <div
                                                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50"
                                                dangerouslySetInnerHTML={{ __html: faculty.vision }}
                                            />
                                        </div>
                                    )}

                                    {faculty.mission && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                Misi Fakultas
                                            </h3>
                                            <div
                                                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
                                                dangerouslySetInnerHTML={{ __html: faculty.mission }}
                                            />
                                        </div>
                                    )}

                                    {faculty.objectives && (
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                Tujuan Strategis
                                            </h3>
                                            <div
                                                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
                                                dangerouslySetInnerHTML={{ __html: faculty.objectives }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content 3: Program Studi */}
                        {activeTab === 'prodi' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Program Studi di Bawah Naungan {faculty.abbreviation || faculty.name}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {studyPrograms.map((prodi) => (
                                        <Link
                                            key={prodi.id}
                                            href={route('public.study-programs.show', prodi.slug)}
                                            className="group block p-5 rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                    {prodi.degree_level}
                                                </span>
                                                {prodi.accreditation && (
                                                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {prodi.accreditation}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                                                {prodi.name}
                                            </h3>
                                            {prodi.graduate_title && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Gelar: {prodi.graduate_title}
                                                </p>
                                            )}
                                            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                Lihat Detail Prodi <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (1 Col): Dekanat, Kontak & Medsos (Lengkap TikTok) */}
                    <div className="space-y-6">
                        {/* Pimpinan Dekanat */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                                Pimpinan Dekanat
                            </h2>

                            {assignments.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Belum ada data pimpinan dekanat.</p>
                            ) : (
                                <div className="space-y-4">
                                    {assignments.map((asg) => (
                                        <div key={asg.id} className="flex items-center gap-3">
                                            <img
                                                src={asg.staff_profile?.avatar_url}
                                                alt={asg.staff_profile?.name}
                                                className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                            />
                                            <div>
                                                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                                                    {asg.position?.name || 'Pejabat'}
                                                </span>
                                                <Link
                                                    href={route('public.lecturers.show', asg.staff_profile?.slug || asg.staff_profile?.id)}
                                                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition"
                                                >
                                                    {asg.staff_profile?.full_name_with_titles || asg.staff_profile?.name}
                                                </Link>
                                                {asg.staff_profile?.nidn && (
                                                    <p className="text-[10px] text-slate-400">
                                                        NIDN: {asg.staff_profile.nidn}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Kontak & Sekretariat */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Sekretariat &amp; Kontak
                            </h2>

                            {faculty.office_location && (
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                    <span>{faculty.office_location}</span>
                                </div>
                            )}

                            {faculty.email && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <a href={`mailto:${faculty.email}`} className="hover:text-indigo-600 transition">
                                        {faculty.email}
                                    </a>
                                </div>
                            )}

                            {faculty.phone && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <span>{faculty.phone}</span>
                                </div>
                            )}

                            {faculty.website_url && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <a
                                        href={faculty.website_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-indigo-600 transition truncate"
                                    >
                                        {faculty.website_url}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Media Sosial Lengkap (Termasuk TikTok) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                                Ikuti Media Sosial
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {faculty.tiktok_url && (
                                    <a
                                        href={faculty.tiktok_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black transition shadow-xs"
                                        title="TikTok Resmi"
                                    >
                                        <TikTokIcon className="w-3.5 h-3.5 fill-current" /> TikTok
                                    </a>
                                )}
                                {faculty.instagram_url && (
                                    <a
                                        href={faculty.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/60 dark:text-pink-300 transition"
                                        title="Instagram"
                                    >
                                        <InstagramIcon className="w-3.5 h-3.5 fill-current" /> Instagram
                                    </a>
                                )}
                                {faculty.facebook_url && (
                                    <a
                                        href={faculty.facebook_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition"
                                        title="Facebook"
                                    >
                                        <FacebookIcon className="w-3.5 h-3.5 fill-current" /> Facebook
                                    </a>
                                )}
                                {faculty.x_url && (
                                    <a
                                        href={faculty.x_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition"
                                        title="X / Twitter"
                                    >
                                        <XIcon className="w-3.5 h-3.5 fill-current" /> Twitter / X
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLIDE / CAROUSEL DOSEN PENGAJAR DI BAGIAN BAWAH DETAIL FAKULTAS */}
                <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                Civitas Akademika
                            </span>
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                                Dosen &amp; Tenaga Pengajar Fakultas
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Para pakar dan dosen berpengalaman yang mengajar dan meneliti di lingkungan {faculty.name}.
                            </p>
                        </div>

                        {lecturers.length > 3 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scrollSlider('left')}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                    title="Sebelumnya"
                                >
                                    <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                </button>
                                <button
                                    onClick={() => scrollSlider('right')}
                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                    title="Selanjutnya"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                </button>
                            </div>
                        )}
                    </div>

                    {lecturers.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                            Belum ada data dosen pengajar yang ditautkan ke fakultas ini.
                        </div>
                    ) : (
                        <div
                            ref={sliderRef}
                            className="flex gap-5 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-indigo-900"
                        >
                            {lecturers.map((lecturer) => (
                                <div
                                    key={lecturer.id}
                                    className="min-w-[280px] max-w-[300px] shrink-0 snap-start flex flex-col justify-between p-5 rounded-3xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 transition group"
                                >
                                    <div>
                                        <div className="flex items-center gap-3.5">
                                            <img
                                                src={lecturer.avatar_url}
                                                alt={lecturer.name}
                                                className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                                            />
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                    {lecturer.pivot?.role || 'Dosen Pengajar'}
                                                </span>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 group-hover:text-indigo-600 transition">
                                                    {lecturer.full_name_with_titles || lecturer.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {lecturer.academic_position && (
                                            <p className="mt-3 text-xs text-slate-500 font-medium">
                                                Jabatan: {lecturer.academic_position}
                                            </p>
                                        )}

                                        {lecturer.nidn && (
                                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                NIDN: {lecturer.nidn}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <Link
                                            href={route('public.lecturers.show', lecturer.slug || lecturer.id)}
                                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                        >
                                            Lihat Profil <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
