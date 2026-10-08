import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    GraduationCap,
    Plus,
    Search,
    UserCheck,
    Building2,
    RefreshCw,
    Edit3,
    Trash2,
    ExternalLink,
    Filter,
    Globe,
    BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/Components/UI/Button';
import Pagination from '@/Components/UI/Pagination';
import EmptyState from '@/Components/UI/EmptyState';

export default function Index({ staffList, filters, faculties = [], studyPrograms = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedFaculty, setSelectedFaculty] = useState(filters.faculty || '');
    const [syncingId, setSyncingId] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('staff.index'),
            { search, type: selectedType, faculty: selectedFaculty },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (staff) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${staff.full_name_with_titles}" dari direktori?`)) {
            router.delete(route('staff.destroy', staff.id));
        }
    };

    const handleSync = (staff) => {
        setSyncingId(staff.id);
        router.post(
            route('staff.sync', staff.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setSyncingId(null),
            }
        );
    };

    const items = staffList.data || [];

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Direktori Dosen &amp; Tendik" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                            Direktori Dosen &amp; Tenaga Kependidikan
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Kelola profil civitas akademika, NIDN, jabatan fungsional, integrasi Google Scholar, dan portofolio publikasi.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('public.lecturers.index')}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Lihat Halaman Publik
                        </Link>
                        <Link href={route('staff.create')}>
                            <Button size="sm" variant="primary" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                Tambah Dosen / Tendik
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, NIDN, NIP, fakultas, atau prodi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                            />
                        </div>

                        <div className="sm:w-48">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                            >
                                <option value="">Semua Civitas</option>
                                <option value="dosen">Dosen</option>
                                <option value="tendik">Tenaga Kependidikan</option>
                            </select>
                        </div>

                        <div className="sm:w-60">
                            <select
                                value={selectedFaculty}
                                onChange={(e) => setSelectedFaculty(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                            >
                                <option value="">Semua Fakultas</option>
                                {faculties.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button type="submit" size="sm" variant="secondary" className="gap-1.5">
                            <Filter className="h-3.5 w-3.5" />
                            Filter
                        </Button>
                    </form>
                </div>

                {/* Staff Table / Cards List */}
                {items.length > 0 ? (
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                                    <tr>
                                        <th className="px-5 py-3.5">Nama &amp; Gelar Civitas</th>
                                        <th className="px-4 py-3.5">NIDN / NIP</th>
                                        <th className="px-4 py-3.5">Fakultas &amp; Homebase</th>
                                        <th className="px-4 py-3.5">Jabatan</th>
                                        <th className="px-4 py-3.5 text-center">Metrik Riset</th>
                                        <th className="px-4 py-3.5 text-center">Akun User</th>
                                        <th className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {items.map((staff) => (
                                        <tr
                                            key={staff.id}
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={staff.avatar_url}
                                                        alt={staff.name}
                                                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                    />
                                                    <div className="min-w-0">
                                                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                                                            {staff.full_name_with_titles}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                            <span
                                                                className={`font-semibold capitalize ${
                                                                    staff.type === 'dosen'
                                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                                        : 'text-emerald-600 dark:text-emerald-400'
                                                                }`}
                                                            >
                                                                {staff.type_label}
                                                            </span>
                                                            {staff.email && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="truncate max-w-[150px]">
                                                                        {staff.email}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                                {staff.nidn ? `NIDN: ${staff.nidn}` : staff.nip ? `NIP: ${staff.nip}` : '-'}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                                                <div className="truncate max-w-[180px]">
                                                    <span className="font-medium text-slate-900 dark:text-white block truncate">
                                                        {staff.study_program || '-'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 block truncate">
                                                        {staff.faculty || '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                                                <span className="font-medium">
                                                    {staff.academic_position || staff.structural_position || '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                {staff.type === 'dosen' ? (
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                                                            {staff.total_citations || 0} Sitasi
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            h-index: {staff.h_index || 0}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                {staff.user ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                        <UserCheck className="h-3 w-3" />
                                                        Terhubung
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">
                                                        Standalone
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {staff.google_scholar_url && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSync(staff)}
                                                            disabled={syncingId === staff.id}
                                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 transition-colors"
                                                            title="Sinkronkan Google Scholar"
                                                        >
                                                            <RefreshCw
                                                                className={`h-4 w-4 ${
                                                                    syncingId === staff.id ? 'animate-spin text-indigo-600' : ''
                                                                }`}
                                                            />
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={route('staff.edit', staff.id)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                                        title="Edit Profil"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(staff)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {staffList.links && staffList.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                                <Pagination links={staffList.links} />
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={GraduationCap}
                        title="Belum Ada Dosen atau Tenaga Kependidikan"
                        description="Mulai tambahkan dosen pengajar dan staf tendik ke dalam direktori universitas."
                        actionLabel="Tambah Civitas Sekarang"
                        actionHref={route('staff.create')}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
