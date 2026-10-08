import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import StatCard from '@/Components/UI/StatCard';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    Users,
    UserCheck,
    BookCopy,
    FileText,
    Image as ImageIcon,
    Mail,
    Plus,
    ArrowUpRight,
    Sparkles,
    Shield,
    Activity,
} from 'lucide-react';

export default function Dashboard({ stats = {} }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <PageHeader
                title="Dashboard Overview"
                subtitle="Welcome back to your workspace. Here is a summary of your website and editorial performance."
                actions={
                    <div className="flex items-center gap-2">
                        <Link href={route('posts.create')}>
                            <Button size="sm" variant="primary" icon={Plus}>
                                New Post
                            </Button>
                        </Link>
                        <Link href={route('media.index')}>
                            <Button size="sm" variant="outline" icon={ImageIcon}>
                                Media Library
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Registered Users"
                    value={stats.totalUsers?.toLocaleString() || '0'}
                    change="+12%"
                    trend="up"
                />
                <StatCard
                    icon={UserCheck}
                    label="Active Accounts"
                    value={stats.activeUsers?.toLocaleString() || '0'}
                    change="+8.4%"
                    trend="up"
                />
                <StatCard
                    icon={Shield}
                    label="Administrators & Staff"
                    value={stats.admins?.toLocaleString() || '0'}
                    description="Superadmin & Admin roles"
                />
                <StatCard
                    icon={Activity}
                    label="System Status"
                    value="Optimal"
                    description="Laravel 13 & SQLite Active"
                />
            </div>

            {/* Content & Shortcuts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Quick Actions & Editorial Hub */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="surface-card p-6">
                        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase text-[11px] text-slate-400 mb-4">
                            Editorial Workflows
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <Link
                                href={route('posts.create')}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/20 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
                                        <BookCopy className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-xs dark:text-white group-hover:text-indigo-600 transition-colors">
                                            Create Blog Post
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                            Write with modern TipTap editor
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </Link>

                            <Link
                                href={route('pages.create')}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/20 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-xs dark:text-white group-hover:text-sky-600 transition-colors">
                                            Create Laman Page
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                            Custom layout for static pages
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
                            </Link>

                            <Link
                                href={route('media.index')}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/20 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-xs dark:text-white group-hover:text-purple-600 transition-colors">
                                            Media Library
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                            Organize photos and assets
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-purple-500 transition-colors" />
                            </Link>

                            <Link
                                href={route('web-settings.edit')}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/20 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-xs dark:text-white group-hover:text-emerald-600 transition-colors">
                                            Website Settings
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                            Logo, metadata, contacts
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right: Quick Links & Information */}
                <div className="space-y-6">
                    <div className="surface-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                                Quick Management
                            </h3>
                        </div>
                        <div className="space-y-2 text-xs">
                            <Link
                                href={route('categories.index')}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <span>Kelola Kategori</span>
                                <span className="text-[11px] text-slate-400">Categories →</span>
                            </Link>
                            <Link
                                href={route('hashtags.index')}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <span>Kelola Hashtags</span>
                                <span className="text-[11px] text-slate-400">Tags →</span>
                            </Link>
                            <Link
                                href={route('menus.index')}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <span>Kelola Menu Navigasi</span>
                                <span className="text-[11px] text-slate-400">Menus →</span>
                            </Link>
                            <Link
                                href={route('contact-messages.index')}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <span>Pesan Kontak Masuk</span>
                                <span className="text-[11px] text-slate-400">Inbox →</span>
                            </Link>
                            <Link
                                href={route('audit-logs.index')}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 font-medium"
                            >
                                <span>Audit Log Aktivitas</span>
                                <span className="text-[11px] text-slate-400">Logs →</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
