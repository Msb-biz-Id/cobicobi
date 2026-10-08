import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Network, Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

export default function InstitutionalUnitsIndex({ units, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleFilter = (e) => {
        if (e) e.preventDefault();
        router.get(
            route('admin.institutional-units.index'),
            { search, category },
            { preserveState: true }
        );
    };

    const handleDelete = (unit) => {
        Swal.fire({
            title: 'Hapus Unit/Lembaga?',
            text: `Yakin ingin menghapus "${unit.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.institutional-units.destroy', unit.id));
            }
        });
    };

    const getCategoryBadge = (cat) => {
        switch (cat) {
            case 'upt':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">UPT</span>;
            case 'lembaga':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">Lembaga</span>;
            case 'biro':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">Biro</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Organisasi</span>;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Unit & Lembaga" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Network className="w-7 h-7 text-indigo-600" />
                            Unit, UPT & Lembaga
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Kelola profil dan pimpinan Unit Pelaksana Teknis (UPT), Lembaga, Biro, dan Organisasi Kampus.
                        </p>
                    </div>
                    <Link
                        href={route('admin.institutional-units.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah Unit / Lembaga
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                    <form onSubmit={handleFilter} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau singkatan unit..."
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

                    <div className="flex gap-2">
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                router.get(route('admin.institutional-units.index'), { search, category: e.target.value }, { preserveState: true });
                            }}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="upt">UPT (Unit Pelaksana Teknis)</option>
                            <option value="lembaga">Lembaga</option>
                            <option value="biro">Biro</option>
                            <option value="organisasi">Badan / Organisasi Khusus</option>
                        </select>
                    </div>
                </div>

                {/* Grid List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {units.data.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                            Belum ada data unit atau lembaga. Silakan tambahkan baru.
                        </div>
                    ) : (
                        units.data.map((unit) => (
                            <div
                                key={unit.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 flex items-center justify-center shrink-0">
                                                {unit.logo_url ? (
                                                    <img src={unit.logo_url} alt={unit.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Network className="w-6 h-6 text-purple-600" />
                                                )}
                                            </div>
                                            <div>
                                                {getCategoryBadge(unit.category)}
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">
                                                    {unit.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pimpinan Terkini */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        <p className="text-xs text-slate-400 font-medium">Pimpinan Terkini:</p>
                                        {unit.current_assignments && unit.current_assignments.length > 0 ? (
                                            <div className="mt-1 space-y-1">
                                                {unit.current_assignments.map((asg) => (
                                                    <div key={asg.id} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                        <span className="text-purple-600 dark:text-purple-400 font-semibold">{asg.position?.name || 'Pejabat'}: </span>
                                                        {asg.staff_profile?.full_name_with_titles || asg.staff_profile?.name}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic mt-0.5">Belum ditentukan</p>
                                        )}
                                    </div>

                                    {unit.office_location && (
                                        <p className="mt-3 text-xs text-slate-500 line-clamp-1">
                                            📍 {unit.office_location}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <a
                                        href={route('public.institutional-units.show', unit.slug)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-purple-600 transition"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Lihat Publik
                                    </a>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={route('admin.institutional-units.edit', unit.id)}
                                            className="p-2 text-slate-600 hover:text-purple-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-purple-400 dark:hover:bg-slate-800 rounded-xl transition"
                                            title="Edit Unit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(unit)}
                                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-xl transition"
                                            title="Hapus Unit"
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
