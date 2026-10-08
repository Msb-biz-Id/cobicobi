import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import {
    Mail,
    MailOpen,
    MailCheck,
    Search,
    Trash2,
    Eye,
    CheckCheck,
    Undo2,
    Clock,
    Phone,
} from 'lucide-react';
import Swal from 'sweetalert2';

function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

export default function ContactMessagesIndex({ messages, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    const applyFilter = (e) => {
        if (e) e.preventDefault();
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;

        router.get(route('contact-messages.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusTab = (status) => {
        setStatusFilter(status);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (status) params.status = status;

        router.get(route('contact-messages.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilter = () => {
        setSearch('');
        setStatusFilter('');
        router.get(route('contact-messages.index'), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const markRead = (item) => {
        router.put(
            route('contact-messages.mark-read', item.id),
            {},
            { preserveScroll: true },
        );
    };

    const markUnread = (item) => {
        router.put(
            route('contact-messages.mark-unread', item.id),
            {},
            { preserveScroll: true },
        );
    };

    const deleteItem = async (item) => {
        const result = await Swal.fire({
            title: 'Hapus Pesan Masuk?',
            text: `Pesan dari "${item.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (!result.isConfirmed) return;

        router.delete(route('contact-messages.destroy', item.id), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Pesan berhasil dihapus',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Inbox Messages" />

            <div className="space-y-6">
                <PageHeader
                    title="Inbox & Inquiries"
                    subtitle="Manage visitor messages, business inquiries and feedback submitted through web forms"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={Mail}
                        label="Total Inquiries"
                        value={stats.total?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={Mail}
                        label="Unread Messages"
                        value={stats.unread?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={MailOpen}
                        label="Archived & Read"
                        value={stats.read?.toLocaleString() ?? 0}
                    />
                </div>

                {/* Table Container */}
                <div className="surface-card overflow-hidden">
                    {/* Filter and Search Bar */}
                    <div className="flex flex-col gap-3 p-4 border-b border-slate-100 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50 dark:bg-slate-900/40">
                        {/* Status Tabs */}
                        <div className="flex items-center gap-1.5">
                            {[
                                { key: '', label: 'All Inquiries' },
                                { key: 'unread', label: 'Unread' },
                                { key: 'read', label: 'Read' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleStatusTab(tab.key)}
                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                        statusFilter === tab.key
                                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                                            : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={applyFilter} className="flex items-center gap-2">
                            <div className="relative w-full sm:w-64">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search sender, email, message..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                            {search && (
                                <button
                                    type="button"
                                    onClick={resetFilter}
                                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Messages Table */}
                    {messages?.data?.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={Mail}
                                title="No messages found"
                                description="When visitors send inquiries through the contact page, they will appear here."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3.5 pl-5 pr-3">Sender</th>
                                        <th className="py-3.5 px-3">Contact</th>
                                        <th className="py-3.5 px-3">Message Excerpt</th>
                                        <th className="py-3.5 px-3">Status</th>
                                        <th className="py-3.5 px-3">Date</th>
                                        <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {messages.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${
                                                item.is_read
                                                    ? 'hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
                                                    : 'bg-indigo-50/20 font-medium hover:bg-indigo-50/40 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/20'
                                            }`}
                                        >
                                            <td className="py-3.5 pl-5 pr-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                        {getInitials(item.name)}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={route('contact-messages.show', item.id)}
                                                            className="text-xs font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <div className="text-[11px] text-slate-400 font-mono">
                                                            {item.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                                                {item.phone_number ? (
                                                    <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                                                        <Phone className="h-3 w-3 text-slate-400" />
                                                        {item.phone_number}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-3 max-w-sm truncate text-slate-600 dark:text-slate-300">
                                                {item.message}
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <Badge
                                                    variant={item.is_read ? 'neutral' : 'indigo'}
                                                    size="sm"
                                                >
                                                    {item.is_read ? 'Read' : 'New Unread'}
                                                </Badge>
                                            </td>

                                            <td className="py-3.5 px-3 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {item.created_at}
                                            </td>

                                            <td className="py-3.5 pl-3 pr-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {item.is_read ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => markUnread(item)}
                                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                            title="Mark as unread"
                                                        >
                                                            <Undo2 className="h-4 w-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => markRead(item)}
                                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition"
                                                            title="Mark as read"
                                                        >
                                                            <CheckCheck className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={route('contact-messages.show', item.id)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                        title="Read message"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(item)}
                                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                        title="Delete message"
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
                        <Pagination links={messages?.links} meta={messages} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
