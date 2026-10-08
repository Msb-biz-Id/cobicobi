import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import Modal from '@/Components/UI/Modal';
import {
    Bell,
    CheckCircle2,
    ShieldAlert,
    XCircle,
    Plus,
    Search,
    Edit3,
    Trash2,
    Send,
    ExternalLink,
} from 'lucide-react';
import Swal from 'sweetalert2';

const defaultData = {
    title: '',
    message: '',
    type: 'info',
    target_role: 'all',
    link_url: '',
    published_at: '',
    is_active: true,
};

function toDatetimeLocal(value) {
    if (!value) return '';
    const normalized = String(value).replace(' ', 'T');
    return normalized.length === 16 ? normalized : normalized.slice(0, 16);
}

export default function NotificationsIndex({ notifications, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [targetRoleFilter, setTargetRoleFilter] = useState(filters.target_role ?? '');
    const [typeFilter, setTypeFilter] = useState(filters.type ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
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
            title: item.title,
            message: item.message,
            type: item.type,
            target_role: item.target_role,
            link_url: item.link_url ?? '',
            published_at: toDatetimeLocal(item.published_at),
            is_active: item.is_active,
        });
        form.clearErrors();
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingItem) {
            form.put(route('notifications.update', editingItem.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Notifikasi berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
            return;
        }

        form.post(route('notifications.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setModalOpen(false);
                form.reset();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Notifikasi baru berhasil dikirim',
                    showConfirmButton: false,
                    timer: 2000,
                });
            },
        });
    };

    const applyFilter = (e) => {
        if (e) e.preventDefault();
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (targetRoleFilter) params.target_role = targetRoleFilter;
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;

        router.get(route('notifications.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilter = () => {
        setSearch('');
        setTargetRoleFilter('');
        setTypeFilter('');
        setStatusFilter('');
        router.get(route('notifications.index'), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Hapus Notifikasi?',
            text: `Notifikasi "${item.title}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (!result.isConfirmed) return;

        router.delete(route('notifications.destroy', item.id), { preserveScroll: true });
    };

    const typeBadgeVariant = (type) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'danger':
                return 'danger';
            default:
                return 'indigo';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="System Notifications" />

            <div className="space-y-6">
                <PageHeader
                    title="System Notifications"
                    subtitle="Broadcast announcements, operational alerts and system messages across user roles"
                    actions={
                        <Button size="sm" variant="primary" icon={Plus} onClick={openCreate}>
                            New Notification
                        </Button>
                    }
                />

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={Bell}
                        label="Total Broadcasts"
                        value={stats.total?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Active Alerts"
                        value={stats.active?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={XCircle}
                        label="Inactive / Expired"
                        value={stats.inactive?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={ShieldAlert}
                        label="Superadmin Targeted"
                        value={stats.superadmin_targeted?.toLocaleString() ?? 0}
                    />
                </div>

                {/* Table Container */}
                <div className="surface-card overflow-hidden">
                    {/* Filters Bar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <form onSubmit={applyFilter} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="relative lg:col-span-2">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search title, message, url..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <select
                                value={targetRoleFilter}
                                onChange={(e) => setTargetRoleFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Target Roles</option>
                                <option value="all">Everyone (All)</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="author">Author</option>
                                <option value="viewer">Viewer</option>
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Alert Types</option>
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="danger">Danger</option>
                            </select>

                            <div className="flex items-center gap-2">
                                <Button type="submit" size="sm" variant="secondary" className="w-full">
                                    Filter
                                </Button>
                                {(search || targetRoleFilter || typeFilter || statusFilter) && (
                                    <button
                                        type="button"
                                        onClick={resetFilter}
                                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    {notifications?.data?.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={Bell}
                                title="No notifications found"
                                description="Create an announcement or alert to inform administrators."
                                actionLabel="Create Alert"
                                onAction={openCreate}
                                actionIcon={Plus}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3.5 pl-5 pr-3">Notification Alert</th>
                                        <th className="py-3.5 px-3">Type</th>
                                        <th className="py-3.5 px-3">Target Role</th>
                                        <th className="py-3.5 px-3">Created By</th>
                                        <th className="py-3.5 px-3">Status</th>
                                        <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {notifications.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                        >
                                            <td className="py-3.5 pl-5 pr-3 max-w-sm">
                                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {item.title}
                                                </p>
                                                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {item.message}
                                                </p>
                                                {item.link_url && (
                                                    <a
                                                        href={item.link_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        {item.link_url}
                                                    </a>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <Badge variant={typeBadgeVariant(item.type)} size="sm">
                                                    {item.type}
                                                </Badge>
                                            </td>

                                            <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300 capitalize">
                                                {item.target_role}
                                            </td>

                                            <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                                                {item.creator?.name || 'System'}
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
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                        title="Edit notification"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                        title="Delete notification"
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
                        <Pagination links={notifications?.links} meta={notifications} />
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <Modal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem ? 'Edit Notification' : 'Create Broadcast Notification'}
                description="Send system announcement or urgent alert to dashboard users"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Notification Title"
                        placeholder="e.g. Scheduled System Maintenance"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        error={form.errors.title}
                        required
                    />

                    <Textarea
                        label="Message"
                        placeholder="Write the notification details here..."
                        rows={3}
                        value={form.data.message}
                        onChange={(e) => form.setData('message', e.target.value)}
                        error={form.errors.message}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Alert Type"
                            value={form.data.type}
                            onChange={(e) => form.setData('type', e.target.value)}
                            options={[
                                { value: 'info', label: 'Info (Blue)' },
                                { value: 'success', label: 'Success (Green)' },
                                { value: 'warning', label: 'Warning (Amber)' },
                                { value: 'danger', label: 'Danger (Red)' },
                            ]}
                        />

                        <Select
                            label="Target Audience"
                            value={form.data.target_role}
                            onChange={(e) => form.setData('target_role', e.target.value)}
                            options={[
                                { value: 'all', label: 'All Users (Everyone)' },
                                { value: 'superadmin', label: 'Superadmin Only' },
                                { value: 'admin', label: 'Admin Only' },
                                { value: 'editor', label: 'Editor Only' },
                                { value: 'author', label: 'Author Only' },
                                { value: 'viewer', label: 'Viewer Only' },
                            ]}
                        />
                    </div>

                    <Input
                        label="Action Link (Optional URL)"
                        placeholder="https://..."
                        value={form.data.link_url}
                        onChange={(e) => form.setData('link_url', e.target.value)}
                        error={form.errors.link_url}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Schedule Publication (Optional)"
                            type="datetime-local"
                            value={form.data.published_at}
                            onChange={(e) => form.setData('published_at', e.target.value)}
                            error={form.errors.published_at}
                        />

                        <div className="flex flex-col justify-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                                />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    Active / Visible immediately
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" icon={Send} loading={form.processing}>
                            {editingItem ? 'Update Notification' : 'Broadcast Now'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}