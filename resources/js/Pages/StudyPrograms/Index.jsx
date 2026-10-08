import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Library, Plus, Search, Edit2, Trash2, ExternalLink, GraduationCap, Users, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function StudyProgramsIndex({ studyPrograms, faculties, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [facultyId, setFacultyId] = useState(filters.faculty_id || '');
    const [degreeLevel, setDegreeLevel] = useState(filters.degree_level || '');

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        router.get(
            route('admin.study-programs.index'),
            { search, faculty_id: facultyId, degree_level: degreeLevel },
            { preserveState: true }
        );
    };

    const handleDelete = (prodi) => {
        Swal.fire({
            title: 'Hapus Program Studi?',
            text: `Yakin ingin menghapus prodi "${prodi.degree_level} ${prodi.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.study-programs.destroy', prodi.id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Program Studi" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Library className="w-7 h-7 text-indigo-600" />
                            Program Studi
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Kelola program studi sarjana/vokasi/pascasarjana, prospek karir, gelar, pimpinan prodi, dan dosen pengajar.
                        </p>
                    </div>
                    <Link
                        href={route('admin.study-programs.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah Program Studi
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                    <form onSubmit={handleFilter} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama prodi, kode, atau gelar lulusan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-xl transition"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={facultyId}
                            onChange={(e) => {
                                setFacultyId(e.target.value);
                                router.get(route('admin.study-programs.index'), { search, faculty_id: e.target.value, degree_level: degreeLevel }, { preserveState: true });
                            }}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2"
                        >
                            <option value="">Semua Fakultas</option>
                            <option value="none">Tanpa Fakultas (Mandiri)</option>
                            {faculties.map((f) => (
                                <option key={f.id} value={f.id}>
                                    {f.abbreviation ? `${f.abbreviation} - ` : ''}{f.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={degreeLevel}
                            onChange={(e) => {
                                setDegreeLevel(e.target.value);
                                router.get(route('admin.study-programs.index'), { search, faculty_id: facultyId, degree_level: e.target.value }, { preserveState: true });
                            }}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2"
                        >
                            <option value="">Semua Jenjang</option>
                            <option value="D3">D3 (Diploma Tiga)</option>
                            <option value="D4">D4 (Sarjana Terapan)</option>
                            <option value="S1">S1 (Sarjana)</option>
                            <option value="S2">S2 (Magister)</option>
                            <option value="S3">S3 (Doktor)</option>
                            <option value="Profesi">Profesi</option>
                        </select>
                    </div>
                </div>

                {/* Grid List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studyPrograms.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                            Belum ada data program studi. Silakan tambahkan program studi.
                        </div>
                    ) : (
                        studyPrograms.data.map((prodi) => (
                            <div
                                key={prodi.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
                                                {prodi.logo_url ? (
                                                    <img src={prodi.logo_url} alt={prodi.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Library className="w-6 h-6 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                                                        {prodi.degree_level}
                                                    </span>
                                                    {prodi.graduate_title && (
                                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                            {prodi.graduate_title}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">
                                                    {prodi.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fakultas Penaung */}
                                    <div className="mt-3 text-xs flex items-center gap-1.5 text-slate-500">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                        <span>
                                            {prodi.faculty ? prodi.faculty.name : <em className="text-amber-600 dark:text-amber-400 font-medium">Program Studi Mandiri (Tanpa Fakultas)</em>}
                                        </span>
                                    </div>

                                    {/* Pimpinan Prodi (Kaprodi / Sekprodi) */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        <p className="text-xs text-slate-400 font-medium">Pimpinan Program Studi:</p>
                                        {prodi.current_assignments && prodi.current_assignments.length > 0 ? (
                                            <div className="mt-1 space-y-1">
                                                {prodi.current_assignments.map((asg) => (
                                                    <div key={asg.id} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{asg.position?.name || 'Pejabat'}: </span>
                                                        {asg.staff_profile?.full_name_with_titles || asg.staff_profile?.name}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic mt-0.5">Belum ditentukan</p>
                                        )}
                                    </div>

                                    {/* Prospek Karir Singkat */}
                                    {prodi.career_prospects && prodi.career_prospects.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {prodi.career_prospects.slice(0, 3).map((cp, idx) => (
                                                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    {cp}
                                                </span>
                                            ))}
                                            {prodi.career_prospects.length > 3 && (
                                                <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                                                    +{prodi.career_prospects.length - 3} lainnya
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>{prodi.lecturers_count || 0} Dosen Pengajar</span>
                                        </div>
                                        {prodi.accreditation && (
                                            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                Akreditasi: {prodi.accreditation}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <a
                                        href={route('public.study-programs.show', prodi.slug)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Lihat Publik
                                    </a>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('admin.study-programs.edit', prodi.id)}
                                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 rounded-xl transition"
                                            title="Edit Prodi"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(prodi)}
                                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-xl transition"
                                            title="Hapus Prodi"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
