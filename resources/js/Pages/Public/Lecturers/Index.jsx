import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    GraduationCap,
    Search,
    Building2,
    BookOpen,
    Globe,
    ExternalLink,
    Filter,
    Users,
    Sparkles,
    ArrowRight,
    MapPin,
    X,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/UI/Pagination';

export default function Index({
    staffList,
    filters = {},
    faculties = [],
    studyPrograms = [],
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedFaculty, setSelectedFaculty] = useState(filters.faculty || '');
    const [selectedProgram, setSelectedProgram] = useState(filters.study_program || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('public.lecturers.index'),
            {
                search,
                type: selectedType,
                faculty: selectedFaculty,
                study_program: selectedProgram,
            },
            { preserveState: true }
        );
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        router.get(
            route('public.lecturers.index'),
            {
                search,
                type,
                faculty: selectedFaculty,
                study_program: selectedProgram,
            },
            { preserveState: true }
        );
    };

    const handleFacultyChange = (e) => {
        const val = e.target.value;
        setSelectedFaculty(val);
        router.get(
            route('public.lecturers.index'),
            {
                search,
                type: selectedType,
                faculty: val,
                study_program: selectedProgram,
            },
            { preserveState: true }
        );
    };

    const handleProgramChange = (e) => {
        const val = e.target.value;
        setSelectedProgram(val);
        router.get(
            route('public.lecturers.index'),
            {
                search,
                type: selectedType,
                faculty: selectedFaculty,
                study_program: val,
            },
            { preserveState: true }
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedType('');
        setSelectedFaculty('');
        setSelectedProgram('');
        router.get(route('public.lecturers.index'));
    };

    const hasActiveFilters = Boolean(search || selectedType || selectedFaculty || selectedProgram);
    const items = staffList.data || [];

    return (
        <PublicLayout>
            <Head title="Direktori Dosen &amp; Tenaga Kependidikan" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
                {/* Header Title Section */}
                <div className="max-w-3xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Civitas Akademika Universitas
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Direktori Dosen &amp; Peneliti
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                        Temukan profil guru besar, dosen pengajar, peneliti, serta staf tenaga kependidikan berdedikasi tinggi di lingkungan kampus kami, lengkap dengan bidang kepakaran dan portofolio publikasi internasional.
                    </p>
                </div>

                {/* Filter Toolbar (Type Tabs + Search + Faculty Dropdown) */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                    {/* Type Filter Buttons */}
                    <div className="flex rounded-xl bg-slate-100 p-1 text-xs dark:bg-slate-800 self-start w-fit">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('')}
                            className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                                !selectedType
                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Semua Civitas
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('dosen')}
                            className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                                selectedType === 'dosen'
                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Dosen &amp; Peneliti
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('tendik')}
                            className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                                selectedType === 'tendik'
                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            Tenaga Kependidikan
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama dosen, NIDN, atau bidang keahlian (contoh: AI, Robotika)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                            />
                        </div>

                        {faculties.length > 0 && (
                            <div className="sm:w-64 shrink-0">
                                <select
                                    value={selectedFaculty}
                                    onChange={handleFacultyChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                >
                                    <option value="">Semua Fakultas</option>
                                    {faculties.map((f) => (
                                        <option key={f} value={f}>
                                            {f}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {studyPrograms.length > 0 && (
                            <div className="sm:w-56 shrink-0">
                                <select
                                    value={selectedProgram}
                                    onChange={handleProgramChange}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                >
                                    <option value="">Semua Program Studi</option>
                                    {studyPrograms.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
                        >
                            <Search className="h-4 w-4" />
                            Cari
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors shrink-0"
                                title="Reset filter"
                            >
                                <X className="h-4 w-4" />
                                Reset
                            </button>
                        )}
                    </form>
                </div>

                {/* Grid Kartu Dosen & Tendik */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Hasil Direktori ({staffList.total || items.length} Civitas)
                        </h2>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((staff) => {
                                const expertiseList = Array.isArray(staff.expertise) ? staff.expertise : [];

                                return (
                                    <article
                                        key={staff.id}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-indigo-700/60 transition-all duration-300"
                                    >
                                        <div className="space-y-4">
                                            {/* Header Card: Avatar & Badges */}
                                            <div className="flex items-start gap-4">
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-xs">
                                                    <img
                                                        src={staff.avatar_url}
                                                        alt={staff.name}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>

                                                <div className="min-w-0 space-y-1">
                                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                        {staff.academic_position || staff.structural_position || staff.type_label}
                                                    </span>

                                                    {staff.nidn && (
                                                        <span className="block font-mono text-[10px] text-slate-400">
                                                            NIDN: {staff.nidn}
                                                        </span>
                                                    )}

                                                    <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                        {staff.study_program || staff.faculty || '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Full Name With Titles */}
                                            <Link
                                                href={route('public.lecturers.show', staff.slug)}
                                                className="block group-hover:text-indigo-600 transition-colors"
                                            >
                                                <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">
                                                    {staff.full_name_with_titles}
                                                </h3>
                                            </Link>

                                            {/* Research Interests Tags */}
                                            {expertiseList.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {expertiseList.slice(0, 3).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {expertiseList.length > 3 && (
                                                        <span className="text-[10px] text-slate-400 self-center">
                                                            +{expertiseList.length - 3} lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Footer: Citations, External IDs, & Action CTA */}
                                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                                            <div>
                                                {staff.type === 'dosen' && staff.total_citations > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                                        <Globe className="h-3 w-3" />
                                                        {staff.total_citations} Sitasi (h-index: {staff.h_index})
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">
                                                        {staff.faculty || 'Civitas Kampus'}
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                href={route('public.lecturers.show', staff.slug)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors group-hover:translate-x-0.5 transform"
                                            >
                                                Profil
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <GraduationCap className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                            <div className="max-w-md mx-auto space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Civitas Tidak Ditemukan
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Tidak ada data dosen atau tenaga kependidikan yang sesuai dengan kriteria filter atau pencarian Anda.
                                </p>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                                >
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {staffList.links && staffList.links.length > 3 && (
                        <div className="pt-6">
                            <Pagination links={staffList.links} />
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
