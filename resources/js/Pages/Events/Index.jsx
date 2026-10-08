import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Plus,
    Search,
    MapPin,
    Eye,
    Edit3,
    Trash2,
    Users,
    ExternalLink,
    Clock,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/Components/UI/Button';
import Pagination from '@/Components/UI/Pagination';
import EmptyState from '@/Components/UI/EmptyState';

export default function Index({ events, filters, categories = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('events.index'),
            { search, category: selectedCategory, status: selectedStatus },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (event) => {
        if (confirm(`Apakah Anda yakin ingin menghapus event "${event.title}"?`)) {
            router.delete(route('events.destroy', event.id));
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
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Cancelled
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
            <Head title="Manajemen Event & Agenda Kampus" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                            Agenda & Event Kampus
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Kelola jadwal seminar, konferensi, kuliah umum, wisuda, pendaftaran online, dan kemitraan sponsor.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('public.events.index')}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Lihat Halaman Publik
                        </Link>
                        <Link href={route('events.create')}>
                            <Button size="sm" variant="primary" className="gap-1.5">
                                <Plus className="h-4 w-4" />
                                Tambah Event Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="relative sm:col-span-2">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari judul event, tempat, atau penyelenggara..."
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
                                        route('events.index'),
                                        { search, category: e.target.value, status: selectedStatus },
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
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    router.get(
                                        route('events.index'),
                                        { search, category: selectedCategory, status: e.target.value },
                                        { preserveState: true }
                                    );
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* Table Data */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
                    {events.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <EmptyState
                                title="Belum Ada Event"
                                description="Mulai jadwalkan kegiatan akademik, seminar, atau wisuda kampus Anda."
                                actionLabel="Tambah Event"
                                onAction={() => router.visit(route('events.create'))}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                    <tr>
                                        <th className="px-5 py-3.5">Event</th>
                                        <th className="px-4 py-3.5">Kategori</th>
                                        <th className="px-4 py-3.5">Waktu Pelaksanaan</th>
                                        <th className="px-4 py-3.5">Lokasi & Tipe</th>
                                        <th className="px-4 py-3.5">Pendaftaran</th>
                                        <th className="px-4 py-3.5">Status</th>
                                        <th className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {events.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {item.cover_image_url ? (
                                                        <img
                                                            src={item.cover_image_url}
                                                            alt={item.title}
                                                            className="h-10 w-14 shrink-0 rounded-lg object-cover border border-slate-200/80 dark:border-slate-800"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                            <Calendar className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 max-w-xs">
                                                        <Link
                                                            href={route('events.show', item.id)}
                                                            className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 truncate block text-xs"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <span className="text-[11px] text-slate-400 truncate block">
                                                            Oleh: {item.organizer || 'Kampus'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    <Tag className="h-2.5 w-2.5" />
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px]">
                                                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                                                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                                    <span>{item.formatted_date_range}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px]">
                                                <div className="flex items-center gap-1 truncate max-w-[180px]">
                                                    <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                                                    <span className="truncate">{item.venue_name || item.event_type}</span>
                                                </div>
                                                <span className="text-[10px] uppercase font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {item.event_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-[11px]">
                                                <span className="font-medium text-slate-800 dark:text-slate-200 block">
                                                    {item.price || 'Gratis'}
                                                </span>
                                                {item.registration_url && (
                                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                                        Link Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route('events.show', item.id)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                                                        title="Detail Event & Preview"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('events.edit', item.id)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-colors"
                                                        title="Hapus Event"
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
                {events.links && events.data.length > 0 && (
                    <div className="flex justify-end">
                        <Pagination links={events.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
