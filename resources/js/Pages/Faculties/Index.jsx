import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Building2, Plus, Search, Edit2, Trash2, Eye, ExternalLink, GraduationCap, Users } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FacultiesIndex({ faculties, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.faculties.index'), { search }, { preserveState: true });
    };

    const handleDelete = (fac) => {
        Swal.fire({
            title: 'Hapus Fakultas?',
            text: `Yakin ingin menghapus fakultas "${fac.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.faculties.destroy', fac.id));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Fakultas" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-7 h-7 text-indigo-600" />
                            Fakultas
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Kelola profil fakultas, struktur dekanat, prodi yang dinaungi, dan dosen pengajar.
                        </p>
                    </div>
                    <Link
                        href={route('admin.faculties.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah Fakultas
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau singkatan fakultas..."
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
                </div>

                {/* Grid / List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faculties.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                            Belum ada data fakultas. Silakan tambahkan fakultas baru.
                        </div>
                    ) : (
                        faculties.data.map((fac) => (
                            <div
                                key={fac.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shrink-0">
                                                {fac.logo_url ? (
                                                    <img src={fac.logo_url} alt={fac.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Building2 className="w-6 h-6 text-indigo-600" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                    {fac.code || fac.abbreviation || 'FAKULTAS'}
                                                </span>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                                                    {fac.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pimpinan Terkini */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        <p className="text-xs text-slate-400 font-medium">Pimpinan Terkini:</p>
                                        {fac.current_assignments && fac.current_assignments.length > 0 ? (
                                            <div className="mt-1 space-y-1">
                                                {fac.current_assignments.map((asg) => (
                                                    <div key={asg.id} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{asg.position?.name || 'Pejabat'}: </span>
                                                        {asg.staff_profile?.full_name_with_titles || asg.staff_profile?.name}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic mt-0.5">Belum ditentukan</p>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <GraduationCap className="w-4 h-4 text-slate-400" />
                                            <span>{fac.study_programs_count || 0} Prodi</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>{fac.lecturers_count || 0} Dosen</span>
                                        </div>
                                        {fac.accreditation && (
                                            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                {fac.accreditation}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <a
                                        href={route('public.faculties.show', fac.slug)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Lihat Publik
                                    </a>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('admin.faculties.edit', fac.id)}
                                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 rounded-xl transition"
                                            title="Edit Fakultas"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(fac)}
                                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-xl transition"
                                            title="Hapus Fakultas"
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
