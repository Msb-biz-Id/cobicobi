import { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Library,
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
    Briefcase,
    Building2,
    BookOpen,
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon } from '@/Components/Icons/SocialIcons';

export default function StudyProgramPublicShow({ studyProgram }) {
    const [activeTab, setActiveTab] = useState('profil'); // profil, visi-misi, kurikulum
    const sliderRef = useRef(null);

    const lecturers = studyProgram.lecturers || [];
    const assignments = studyProgram.current_assignments || [];
    const careerProspects = Array.isArray(studyProgram.career_prospects) ? studyProgram.career_prospects : [];

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
            <Head title={`${studyProgram.degree_level} ${studyProgram.name} - Program Studi`} />

            {/* Header Hero Cover */}
            <div className="relative bg-slate-900 text-white">
                <div className="h-64 sm:h-80 w-full overflow-hidden relative">
                    {studyProgram.cover_url ? (
                        <img
                            src={studyProgram.cover_url}
                            alt={studyProgram.name}
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="site-container relative -mt-24 sm:-mt-32 pb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center shrink-0">
                            {studyProgram.logo_url ? (
                                <img src={studyProgram.logo_url} alt={studyProgram.name} className="h-full w-full object-cover" />
                            ) : (
                                <Library className="w-16 h-16 text-blue-600" />
                            )}
                        </div>

                        <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                    Jenjang {studyProgram.degree_level}
                                </span>
                                {studyProgram.graduate_title && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                        Gelar: {studyProgram.graduate_title}
                                    </span>
                                )}
                                {studyProgram.accreditation && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Akreditasi {studyProgram.accreditation}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                                {studyProgram.degree_level} {studyProgram.name}
                            </h1>

                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                                {studyProgram.faculty ? (
                                    <Link
                                        href={route('public.faculties.show', studyProgram.faculty.slug)}
                                        className="hover:text-blue-300 transition underline"
                                    >
                                        {studyProgram.faculty.name}
                                    </Link>
                                ) : (
                                    <span className="text-amber-300 font-medium">Program Studi Mandiri (Vokasi / Kampus Mandiri)</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="site-container py-10 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column (2 Cols): Profil, Visi-Misi, Prospek Karir, Kurikulum */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-sm font-semibold">
                            <button
                                onClick={() => setActiveTab('profil')}
                                className={`pb-3 px-1 border-b-2 transition ${
                                    activeTab === 'profil'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                }`}
                            >
                                Profil &amp; Keunggulan
                            </button>
                            <button
                                onClick={() => setActiveTab('visi-misi')}
                                className={`pb-3 px-1 border-b-2 transition ${
                                    activeTab === 'visi-misi'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                }`}
                            >
                                Visi &amp; Misi
                            </button>
                            <button
                                onClick={() => setActiveTab('kurikulum')}
                                className={`pb-3 px-1 border-b-2 transition ${
                                    activeTab === 'kurikulum'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                }`}
                            >
                                Ringkasan Kurikulum
                            </button>
                        </div>

                        {/* Tab Content 1: Profil */}
                        {activeTab === 'profil' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                        Tentang Program Studi
                                    </h2>
                                    {studyProgram.description ? (
                                        <div
                                            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: studyProgram.description }}
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Deskripsi profil program studi belum tersedia.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content 2: Visi & Misi */}
                        {activeTab === 'visi-misi' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                                    {studyProgram.vision && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-blue-600" /> Visi Program Studi
                                            </h3>
                                            <div
                                                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50"
                                                dangerouslySetInnerHTML={{ __html: studyProgram.vision }}
                                            />
                                        </div>
                                    )}

                                    {studyProgram.mission && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                Misi Program Studi
                                            </h3>
                                            <div
                                                className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
                                                dangerouslySetInnerHTML={{ __html: studyProgram.mission }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content 3: Kurikulum */}
                        {activeTab === 'kurikulum' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-blue-600" /> Kurikulum Berbasis Capaian Pembelajaran (OBE)
                                    </h2>
                                    {studyProgram.curriculum_overview ? (
                                        <div
                                            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: studyProgram.curriculum_overview }}
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Ringkasan kurikulum belum diunggah.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* FITUR KHUSUS: PROSPEK KARIR LULUSAN (CARD GRID) */}
                        {careerProspects.length > 0 && (
                            <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-blue-200/80 dark:border-blue-900/40 shadow-xs">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Prospek &amp; Peluang Karir Lulusan
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Jalur profesi unggulan yang siap dimasuki para lulusan {studyProgram.name}.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {careerProspects.map((cp, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs hover:border-blue-400 transition"
                                        >
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-bold font-mono">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                {cp}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (1 Col): Pimpinan Prodi, Kontak & Medsos (Lengkap TikTok) */}
                    <div className="space-y-6 lg:sticky lg:top-24 self-start">
                        {/* Pimpinan Program Studi (Kaprodi & Sekprodi) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                                Pimpinan Program Studi
                            </h2>

                            {assignments.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Belum ada data ketua atau sekretaris prodi.</p>
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
                                                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                                                    {asg.position?.name || 'Kaprodi'}
                                                </span>
                                                <Link
                                                    href={route('public.lecturers.show', asg.staff_profile?.slug || asg.staff_profile?.id)}
                                                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition"
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

                        {/* Kontak & Sekretariat Prodi */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Informasi &amp; Kontak Prodi
                            </h2>

                            {studyProgram.office_location && (
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span>{studyProgram.office_location}</span>
                                </div>
                            )}

                            {studyProgram.email && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                                    <a href={`mailto:${studyProgram.email}`} className="hover:text-blue-600 transition">
                                        {studyProgram.email}
                                    </a>
                                </div>
                            )}

                            {studyProgram.phone && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span>{studyProgram.phone}</span>
                                </div>
                            )}

                            {studyProgram.website_url && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                                    <a
                                        href={studyProgram.website_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-blue-600 transition truncate"
                                    >
                                        {studyProgram.website_url}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Media Sosial Lengkap (Termasuk TikTok) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                                Media Sosial Program Studi
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {studyProgram.tiktok_url && (
                                    <a
                                        href={studyProgram.tiktok_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black transition shadow-xs"
                                        title="TikTok Resmi"
                                    >
                                        <TikTokIcon className="w-3.5 h-3.5 fill-current" /> TikTok
                                    </a>
                                )}
                                {studyProgram.instagram_url && (
                                    <a
                                        href={studyProgram.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/60 dark:text-pink-300 transition"
                                        title="Instagram"
                                    >
                                        <InstagramIcon className="w-3.5 h-3.5 fill-current" /> Instagram
                                    </a>
                                )}
                                {studyProgram.facebook_url && (
                                    <a
                                        href={studyProgram.facebook_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition"
                                        title="Facebook"
                                    >
                                        <FacebookIcon className="w-3.5 h-3.5 fill-current" /> Facebook
                                    </a>
                                )}
                                {studyProgram.x_url && (
                                    <a
                                        href={studyProgram.x_url}
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

                {/* SLIDE / CAROUSEL DOSEN PENGAJAR DI BAGIAN BAWAH DETAIL PROGRAM STUDI */}
                <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Tim Pengajar
                            </span>
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                                Dosen Pengajar Program Studi
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Dosen homebase dan instruktur profesional yang mengampu mata kuliah di {studyProgram.name}.
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
                            Belum ada data dosen pengajar yang ditautkan ke program studi ini.
                        </div>
                    ) : (
                        <div
                            ref={sliderRef}
                            className="flex gap-5 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-900"
                        >
                            {lecturers.map((lecturer) => (
                                <div
                                    key={lecturer.id}
                                    className="min-w-[280px] max-w-[300px] shrink-0 snap-start flex flex-col justify-between p-5 rounded-3xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 transition group"
                                >
                                    <div>
                                        <div className="flex items-center gap-3.5">
                                            <img
                                                src={lecturer.avatar_url}
                                                alt={lecturer.name}
                                                className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                                            />
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                    {lecturer.pivot?.role || 'Dosen Homebase'}
                                                </span>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 group-hover:text-blue-600 transition">
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
                                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
