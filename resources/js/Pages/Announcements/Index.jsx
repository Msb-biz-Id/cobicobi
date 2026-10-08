import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Megaphone,
    Plus,
    Search,
    Pin,
    FileText,
    Download,
    Eye,
    Edit3,
    Trash2,
    Calendar,
    Users,
    ExternalLink,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/Components/UI/Button';
import Pagination from '@/Components/UI/Pagination';
import EmptyState from '@/Components/UI/EmptyState';

export default function Index({ announcements, filters, categories = [], audiences = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedAudience, setSelectedAudience] = useState(filters.target_audience || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('announcements.index'),
            { search, category: selectedCategory, target_audience: selectedAudience, status: selectedStatus },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (item) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengumuman "${item.title}"?`)) {
            router.delete(route('announcements.destroy', item.id));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'published':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Published
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Draft
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengumuman Kampus" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                            <Megaphone className="h-6 w-6 text-indigo-600" />
                            Pengumuman &amp; Surat Edaran Resmi
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Kelola pengumuman akademik, beasiswa, registrasi, edaran rektorat, dan unggahan berkas lampiran PDF.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('public.announcements.index')}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Lihat Halaman Publik
                        </Link>
                        <Link href={route('announcements.create')}>
                            <Button size="sm" variant="primary" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                Buat Pengumuman Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari judul, nomor surat, penerbit..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    router.get(
                                        route('announcements.index'),
                                        { search, category: e.target.value, target_audience: selectedAudience, status: selectedStatus },
                                        { preserveState: true }
                                    );
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedAudience}
                                onChange={(e) => {
                                    setSelectedAudience(e.target.value);
                                    router.get(
                                        route('announcements.index'),
                                        { search, category: selectedCategory, target_audience: e.target.value, status: selectedStatus },
                                        { preserveState: true }
                                    );
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">Semua Sasaran</option>
                                {audiences.map((a) => (
                                    <option key={a} value={a}>
                                        {a}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    router.get(
                                        route('announcements.index'),
                                        { search, category: selectedCategory, target_audience: selectedAudience, status: e.target.value },
                                        { preserveState: true }
                                    );
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Table Data */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
                    {announcements.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <EmptyState
                                title="Belum Ada Pengumuman"
                                description="Mulai terbitkan pengumuman akademik, edaran wisuda, atau beasiswa."
                                actionLabel="Buat Pengumuman"
                                onAction={() => router.visit(route('announcements.create'))}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3.5">Pengumuman</th>
                                        <th className="px-4 py-3.5">Kategori &amp; Sasaran</th>
                                        <th className="px-4 py-3.5">Nomor Surat / Penerbit</th>
                                        <th className="px-4 py-3.5">Lampiran</th>
                                        <th className="px-4 py-3.5">Tanggal Terbit</th>
                                        <th className="px-4 py-3.5">Status</th>
                                        <th className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {announcements.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-start gap-3">
                                                    {item.is_pinned && (
                                                        <span className="shrink-0 rounded-md bg-amber-50 p-1 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" title="Disematkan (Pinned)">
                                                            <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                                        </span>
                                                    )}
                                                    <div className="min-w-0 max-w-sm">
                                                        <Link
                                                            href={route('announcements.show', item.id)}
                                                            className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 truncate block text-xs leading-snug"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        {item.summary && (
                                                            <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                                                                {item.summary}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                        <Tag className="h-2.5 w-2.5" />
                                                        {item.category}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-400">
                                                        Untuk: <strong className="text-slate-600 dark:text-slate-300">{item.target_audience}</strong>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px]">
                                                <span className="font-mono text-slate-800 dark:text-slate-200 block truncate max-w-[160px]">
                                                    {item.reference_number || '-'}
                                                </span>
                                                <span className="text-[10px] text-slate-400 truncate block">
                                                    {item.issuer || 'Rektorat'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px]">
                                                {item.formatted_attachments && item.formatted_attachments.length > 0 ? (
                                                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        <FileText className="h-3 w-3 text-indigo-500" />
                                                        {item.formatted_attachments.length} Berkas
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[10px]">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px]">
                                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    <span>{item.formatted_published_at}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                                    {item.views_count || 0} dilihat
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route('announcements.show', item.id)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                                                        title="Detail Pengumuman"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('announcements.edit', item.id)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                                        title="Edit Pengumuman"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors"
                                                        title="Hapus Pengumuman"
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
                    )}
                </div>

                {/* Pagination */}
                {announcements.links && announcements.data.length > 0 && (
                    <div className="flex justify-end">
                        <Pagination links={announcements.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
