import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import {
    Activity,
    Calendar,
    FileClock,
    Search,
    Shield,
    Trash2,
    Wrench,
    PlusCircle,
    Globe,
} from 'lucide-react';

export default function AuditLogsIndex({ logs, filters = {}, roleOptions = [], stats = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [actionFilter, setActionFilter] = useState(filters.action ?? '');
    const [roleFilter, setRoleFilter] = useState(filters.role ?? '');
    const [dateFilter, setDateFilter] = useState(filters.date ?? '');

    const applyFilter = (e) => {
        if (e) e.preventDefault();
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (actionFilter) params.action = actionFilter;
        if (roleFilter) params.role = roleFilter;
        if (dateFilter) params.date = dateFilter;

        router.get(route('audit-logs.index'), params, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilter = () => {
        setSearch('');
        setActionFilter('');
        setRoleFilter('');
        setDateFilter('');
        router.get(route('audit-logs.index'), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const getActionBadgeVariant = (action) => {
        switch (action?.toLowerCase()) {
            case 'create':
                return 'success';
            case 'update':
                return 'warning';
            case 'delete':
                return 'danger';
            default:
                return 'neutral';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Audit Activity Logs" />

            <div className="space-y-6">
                <PageHeader
                    title="Security & Audit Logs"
                    subtitle="Immutable chronological ledger of administrative operations, mutations and system access"
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={FileClock}
                        label="Total Operations"
                        value={stats.total?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={Calendar}
                        label="Recorded Today"
                        value={stats.today?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={Wrench}
                        label="Data Updates"
                        value={stats.updates?.toLocaleString() ?? 0}
                    />
                    <StatCard
                        icon={Trash2}
                        label="Deletions"
                        value={stats.deletes?.toLocaleString() ?? 0}
                    />
                </div>

                {/* Table Card */}
                <div className="surface-card overflow-hidden">
                    {/* Filters Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <form onSubmit={applyFilter} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="relative lg:col-span-2">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search actor, route, IP, resource..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Actions</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                                <option value="other">Other</option>
                            </select>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">All Roles</option>
                                {roleOptions.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <Button type="submit" size="sm" variant="secondary">
                                    Filter
                                </Button>
                                {(search || actionFilter || roleFilter || dateFilter) && (
                                    <button
                                        type="button"
                                        onClick={resetFilter}
                                        className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    {logs?.data?.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={Activity}
                                title="No audit entries found"
                                description="Administrative operations will be logged here automatically."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                    <tr>
                                        <th className="py-3.5 pl-5 pr-3">Actor</th>
                                        <th className="py-3.5 px-3">Operation & Method</th>
                                        <th className="py-3.5 px-3">Resource Target</th>
                                        <th className="py-3.5 px-3">IP Address</th>
                                        <th className="py-3.5 pl-3 pr-5 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {logs.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                        >
                                            <td className="py-3.5 pl-5 pr-3">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {item.actor?.name || 'Unknown / System'}
                                                </p>
                                                <p className="text-[11px] font-mono text-slate-400 capitalize">
                                                    {item.actor?.role || '-'}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getActionBadgeVariant(item.action)} size="sm">
                                                        {item.action}
                                                    </Badge>
                                                    <span className="font-mono text-[11px] text-slate-400">
                                                        {item.method}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-slate-600 dark:text-slate-300">
                                                    {item.description || item.route_name || '-'}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                                    {item.subject_label || '-'}
                                                </p>
                                                {item.payload_keys?.length > 0 && (
                                                    <p className="mt-0.5 max-w-xs truncate font-mono text-[10px] text-slate-400">
                                                        Mutated: {item.payload_keys.join(', ')}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-3">
                                                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                                    <Shield className="h-3 w-3 text-slate-400" />
                                                    {item.ip_address || '-'}
                                                </span>
                                            </td>

                                            <td className="py-3.5 pl-3 pr-5 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                                {item.created_at}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                        <Pagination links={logs?.links} meta={logs} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}