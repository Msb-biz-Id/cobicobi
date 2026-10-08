import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import EmptyState from '@/Components/UI/EmptyState';
import Modal from '@/Components/UI/Modal';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    History,
    CheckCircle2,
    Send,
    RotateCcw,
    Image as ImageIcon,
    Filter,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function PostsIndex({
    posts,
    filters = {},
    categories = [],
    authors = [],
    stats = {},
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id || '');
    const [revisionModalPost, setRevisionModalPost] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const applyFilters = (overrides = {}) => {
        router.get(
            route('posts.index'),
            {
                search,
                status: statusFilter,
                category_id: categoryFilter,
                ...overrides,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleDelete = (post) => {
        Swal.fire({
            title: 'Hapus Postingan?',
            text: `Yakin ingin menghapus postingan "${post.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        }).then((res) => {
            if (res.isConfirmed) {
                router.delete(route('posts.destroy', post.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Postingan berhasil dihapus.', 'success');
                    },
                });
            }
        });
    };

    const handleWorkflowAction = (post, action) => {
        const routes = {
            'submit-review': route('posts.workflow.submit-review', post.id),
            approve: route('posts.workflow.approve', post.id),
            publish: route('posts.workflow.publish', post.id),
            'send-back': route('posts.workflow.send-back', post.id),
        };

        if (routes[action]) {
            router.put(
                routes[action],
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Status postingan diperbarui',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    },
                },
            );
        }
    };

    const statusTabs = [
        { label: 'All', value: '', count: stats.total },
        { label: 'Published', value: 'published', count: stats.published },
        { label: 'Review', value: 'review', count: stats.review },
        { label: 'Approved', value: 'approved', count: stats.approved },
        { label: 'Draft', value: 'draft', count: stats.draft },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Posts" />

            <PageHeader
                title="Posts"
                subtitle="Manage and publish all articles and editorial content"
                actions={
                    <Link href={route('posts.create')}>
                        <Button size="sm" variant="primary" icon={Plus}>
                            New Post
                        </Button>
                    </Link>
                }
            />

            {/* Status Quick Filter Tabs */}
            <div className="flex border-b border-slate-200/80 dark:border-slate-800 mb-6 gap-2 overflow-x-auto">
                {statusTabs.map((tab) => {
                    const active = statusFilter === tab.value;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setStatusFilter(tab.value);
                                applyFilters({ status: tab.value });
                            }}
                            className={`flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                                active
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        active
                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Table Card Container */}
            <div className="surface-card overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
                    <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search title, slug, excerpt..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                    </form>

                    <div className="flex w-full sm:w-auto items-center gap-2">
                        {categories.length > 0 && (
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    applyFilters({ category_id: e.target.value });
                                }}
                                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Table Data */}
                {posts?.data?.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            title="No posts found"
                            description="Try adjusting your search criteria or create a new post to get started."
                            actionLabel="Create First Post"
                            onAction={() => router.visit(route('posts.create'))}
                            actionIcon={Plus}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">Post</th>
                                    <th className="py-3.5 px-3">Category</th>
                                    <th className="py-3.5 px-3">Author</th>
                                    <th className="py-3.5 px-3">Status</th>
                                    <th className="py-3.5 px-3">Views</th>
                                    <th className="py-3.5 px-3">Date</th>
                                    <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {posts.data.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors group"
                                    >
                                        {/* Thumbnail & Title */}
                                        <td className="py-3.5 pl-5 pr-3 max-w-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/80 dark:border-slate-800 dark:bg-slate-800 flex items-center justify-center">
                                                    {post.thumbnail_url ? (
                                                        <img
                                                            src={post.thumbnail_url}
                                                            alt={post.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                                                    )}
                                                </div>
                                                <div className="truncate">
                                                    <Link
                                                        href={route('posts.edit', post.id)}
                                                        className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 truncate block text-sm transition-colors"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                                        /{post.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            {post.category ? (
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {post.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>

                                        {/* Author & Editorial */}
                                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {post.author_name || post.author?.name || '-'}
                                            </div>
                                            {(post.editor_name || post.editor?.name) && (
                                                <div className="text-[10px] text-slate-400">
                                                    Ed: {post.editor_name || post.editor?.name}
                                                </div>
                                            )}
                                            {post.source && (
                                                <div className="text-[10px] text-indigo-500 dark:text-indigo-400 truncate max-w-[140px]">
                                                    Src: {post.source}
                                                </div>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-3 whitespace-nowrap">
                                            <Badge
                                                variant={
                                                    post.status === 'published'
                                                        ? 'success'
                                                        : post.status === 'approved'
                                                        ? 'purple'
                                                        : post.status === 'review'
                                                        ? 'info'
                                                        : 'neutral'
                                                }
                                                size="sm"
                                            >
                                                {post.status.toUpperCase()}
                                            </Badge>
                                        </td>

                                        {/* Views */}
                                        <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
                                            {post.views_count.toLocaleString()}
                                        </td>

                                        {/* Date */}
                                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                                            {post.created_at}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route('posts.edit', post.id)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                                                    title="Edit Post"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(post)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                                                    title="Delete Post"
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

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                    <Pagination links={posts?.links} meta={posts} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
