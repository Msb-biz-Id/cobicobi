import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Badge from '@/Components/UI/Badge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import Modal from '@/Components/UI/Modal';
import { Hash, Tags, Eye, Plus, Search, Edit3, Trash2, TrendingUp, X } from 'lucide-react';
import Swal from 'sweetalert2';

const defaultData = {
    name: '',
    slug: '',
    description: '',
    views_count: 0,
    is_active: true,
};

export default function HashtagsIndex({ hashtags, filters = {}, topHashtags = [], stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const form = useForm(defaultData);

    const openCreate = () => {
        setEditingItem(null);
        form.setData(defaultData);
        form.clearErrors();
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        form.setData({
            name: item.name,
            slug: item.slug,
            description: item.description || '',
            views_count: item.views_count ?? 0,
            is_active: item.is_active ?? true,
        });
        form.clearErrors();
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            form.put(route('hashtags.update', editingItem.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Hashtag berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
        } else {
            form.post(route('hashtags.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Hashtag baru berhasil dibuat',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
        }
    };

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Hapus Hashtag?',
            text: `Hashtag #${item.slug} akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        }).then((res) => {
            if (res.isConfirmed) {
                router.delete(route('hashtags.destroy', item.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Hashtag telah dihapus.', 'success');
                    },
                });
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('hashtags.index'),
            { search },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetSearch = () => {
        setSearch('');
        router.get(route('hashtags.index'), {}, { preserveScroll: true, preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Hashtags" />

            <PageHeader
                title="Hashtags"
                subtitle="Manage editorial tags and track engagement across trending topics"
                actions={
                    <Button size="sm" variant="primary" icon={Plus} onClick={openCreate}>
                        New Hashtag
                    </Button>
                }
            />

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    icon={Tags}
                    label="Total Hashtags"
                    value={stats.total?.toLocaleString() ?? 0}
                />
                <StatCard
                    icon={Hash}
                    label="Active Topics"
                    value={stats.active?.toLocaleString() ?? 0}
                />
                <StatCard
                    icon={Eye}
                    label="Total Impressions"
                    value={stats.views?.toLocaleString() ?? 0}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Inactive Topics"
                    value={stats.inactive?.toLocaleString() ?? 0}
                />
            </div>

            {/* Top Hashtags Pills */}
            {topHashtags.length > 0 && (
                <div className="surface-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Most Viewed Hashtags
                            </h3>
                        </div>
                        <span className="text-[11px] text-slate-400">Ranked by editorial views</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {topHashtags.map((item, idx) => (
                            <div
                                key={item.id}
                                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
                            >
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">#{item.slug}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                    {(item.views_count || 0).toLocaleString()} views
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Table Card */}
            <div className="surface-card overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
                    <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs flex gap-2">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search hashtags..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                        {search && (
                            <button
                                type="button"
                                onClick={resetSearch}
                                className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Reset
                            </button>
                        )}
                    </form>
                </div>

                {/* Table */}
                {hashtags?.data?.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            icon={Hash}
                            title="No hashtags found"
                            description="Add hashtags to categorize content with high-velocity tags."
                            actionLabel="Add Hashtag"
                            onAction={openCreate}
                            actionIcon={Plus}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">Hashtag</th>
                                    <th className="py-3.5 px-3">Display Name</th>
                                    <th className="py-3.5 px-3">Description</th>
                                    <th className="py-3.5 px-3">Views</th>
                                    <th className="py-3.5 px-3">Status</th>
                                    <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {hashtags.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                    >
                                        <td className="py-3.5 pl-5 pr-3 font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
                                            #{item.slug}
                                        </td>
                                        <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-white">
                                            {item.name}
                                        </td>
                                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                            {item.description || '-'}
                                        </td>
                                        <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                                            {(item.views_count || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <Badge variant={item.is_active ? 'success' : 'neutral'} size="sm">
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 pl-3 pr-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(item)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                                                    title="Delete"
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

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                    <Pagination links={hashtags?.links} meta={hashtags} />
                </div>
            </div>

            {/* Create / Edit Modal */}
            <Modal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem ? 'Edit Hashtag' : 'New Hashtag'}
                description="Manage hashtag identifier and metadata for content grouping."
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tag Name"
                        placeholder="e.g. Streetwear Fashion"
                        value={form.data.name}
                        onChange={(e) => {
                            form.setData('name', e.target.value);
                            if (!editingItem) {
                                form.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }
                        }}
                        error={form.errors.name}
                        required
                    />

                    <Input
                        label="Slug (Without #)"
                        placeholder="e.g. streetwear-fashion"
                        value={form.data.slug}
                        onChange={(e) => form.setData('slug', e.target.value)}
                        error={form.errors.slug}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Brief summary of what this tag represents..."
                        rows={3}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        error={form.errors.description}
                    />

                    <Input
                        label="Views Count"
                        type="number"
                        min="0"
                        value={form.data.views_count}
                        onChange={(e) => form.setData('views_count', Number(e.target.value || 0))}
                        error={form.errors.views_count}
                    />

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="tag_is_active"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                        />
                        <label htmlFor="tag_is_active" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Active topic (visible on website navigation and filters)
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" loading={form.processing}>
                            {editingItem ? 'Update Hashtag' : 'Create Hashtag'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
