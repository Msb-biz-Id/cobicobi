import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Award, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';
import Swal from 'sweetalert2';

export default function StructuralPositionsIndex({ positions, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [scope, setScope] = useState(filters.scope || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        level: 2,
        target_scope: 'all',
        description: '',
        sort_order: 0,
        is_active: true,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.structural-positions.index'), { search, scope }, { preserveState: true });
    };

    const handleScopeFilter = (val) => {
        setScope(val);
        router.get(route('admin.structural-positions.index'), { search, scope: val }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingPosition(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (pos) => {
        setEditingPosition(pos);
        clearErrors();
        setData({
            name: pos.name,
            slug: pos.slug,
            level: pos.level,
            target_scope: pos.target_scope,
            description: pos.description || '',
            sort_order: pos.sort_order,
            is_active: Boolean(pos.is_active),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPosition) {
            put(route('admin.structural-positions.update', editingPosition.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.structural-positions.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (pos) => {
        Swal.fire({
            title: 'Hapus Master Jabatan?',
            text: `Yakin ingin menghapus jabatan "${pos.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.structural-positions.destroy', pos.id));
            }
        });
    };

    const getScopeBadge = (sc) => {
        switch (sc) {
            case 'faculty':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Fakultas</span>;
            case 'study_program':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Program Studi</span>;
            case 'unit':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">Unit & UPT</span>;
            case 'extracurricular':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">Ekstrakurikuler</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">Global / Semua</span>;
        }
    };

    const getLevelBadge = (lvl) => {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <ArrowUpDown className="w-3 h-3" /> Level {lvl}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Jabatan Struktural" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Award className="w-7 h-7 text-indigo-600" />
                            Master Data Jabatan Struktural
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Kelola hierarki jabatan pimpinan untuk Fakultas, Program Studi, UPT, Lembaga, dan Organisasi Kampus.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Tambah Jabatan
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama jabatan atau keterangan..."
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
                            value={scope}
                            onChange={(e) => handleScopeFilter(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Semua Lingkup Scope</option>
                            <option value="all">Global / Seluruh Kampus</option>
                            <option value="faculty">Khusus Fakultas</option>
                            <option value="study_program">Khusus Program Studi</option>
                            <option value="unit">Khusus Unit / Lembaga</option>
                            <option value="extracurricular">Khusus Ekstrakurikuler / UKM</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Urutan & Tingkat</th>
                                <th className="px-5 py-3.5">Nama Jabatan</th>
                                <th className="px-5 py-3.5">Lingkup Peruntukan</th>
                                <th className="px-5 py-3.5">Keterangan</th>
                                <th className="px-5 py-3.5">Pejabat Aktif</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {positions.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                                        Belum ada data jabatan struktural.
                                    </td>
                                </tr>
                            ) : (
                                positions.data.map((pos) => (
                                    <tr key={pos.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                        <td className="px-5 py-3.5 font-mono text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">#{pos.sort_order}</span>
                                                {getLevelBadge(pos.level)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                                            {pos.name}
                                            <div className="text-[11px] text-slate-400 font-normal">slug: {pos.slug}</div>
                                        </td>
                                        <td className="px-5 py-3.5">{getScopeBadge(pos.target_scope)}</td>
                                        <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs truncate">
                                            {pos.description || '-'}
                                        </td>
                                        <td className="px-5 py-3.5 text-xs">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {pos.assignments_count} orang
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {pos.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-medium">
                                                    <XCircle className="w-3.5 h-3.5" /> Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <button
                                                    onClick={() => openEditModal(pos)}
                                                    className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pos)}
                                                    className="p-1.5 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {editingPosition ? 'Edit Master Jabatan' : 'Tambah Master Jabatan Baru'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Nama Jabatan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Dekan, Kaprodi, Kepala UPT"
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Tingkat / Level (1-5) <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.level}
                                        onChange={(e) => setData('level', parseInt(e.target.value))}
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="1">Level 1 (Pimpinan Universitas)</option>
                                        <option value="2">Level 2 (Pimpinan Fakultas / UPT)</option>
                                        <option value="3">Level 3 (Pimpinan Program Studi)</option>
                                        <option value="4">Level 4 (Laboratorium / Bagian)</option>
                                        <option value="5">Level 5 (Staf / Koordinator)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Lingkup Peruntukan <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.target_scope}
                                        onChange={(e) => setData('target_scope', e.target.value)}
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="all">Global (Semua)</option>
                                        <option value="faculty">Fakultas Saja</option>
                                        <option value="study_program">Program Studi Saja</option>
                                        <option value="unit">Unit & Lembaga Saja</option>
                                        <option value="extracurricular">Ekstrakurikuler / UKM Saja</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Nomor Urut Tampil
                                    </label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="flex items-center pt-5">
                                    <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        <span>Status Aktif</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Keterangan / Tugas Pokok
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi peran tanggung jawab jabatan..."
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
