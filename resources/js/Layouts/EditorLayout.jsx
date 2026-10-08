import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    PanelRightClose,
    PanelRightOpen,
    Eye,
    Save,
    Check,
    Clock,
    History,
    Sparkles,
    Sun,
    Moon,
} from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import { useUiStore } from '@/stores/uiStore';

export default function EditorLayout({
    backUrl = '/posts',
    backLabel = 'Posts',
    title = 'Untitled',
    status = 'draft',
    dirty = false,
    saving = false,
    lastSaved = null,
    onSaveDraft,
    onPublish,
    publishLabel = 'Publish',
    publishLoading = false,
    headerActions,
    sidebarContent,
    children,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { isDark, toggleDarkMode } = useUiStore();

    const statusBadgeVariant = {
        draft: 'neutral',
        review: 'info',
        approved: 'purple',
        published: 'success',
    }[status] || 'neutral';

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f8fafc] text-slate-800 antialiased dark:bg-[#090d16] dark:text-slate-100">
            {/* Topbar */}
            <header className="flex h-15 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-[#0f172a]/90 z-30">
                {/* Left: Back & Title */}
                <div className="flex items-center gap-3 truncate">
                    <Link
                        href={backUrl}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                        title={`Back to ${backLabel}`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>

                    <div className="flex items-center gap-2.5 truncate">
                        <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md dark:text-white text-sm sm:text-base">
                            {title || 'Untitled Post'}
                        </span>
                        <Badge variant={statusBadgeVariant} size="sm">
                            {status.toUpperCase()}
                        </Badge>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 pl-2 text-xs text-slate-400">
                        {saving ? (
                            <span className="inline-flex items-center gap-1 text-indigo-500 animate-pulse">
                                <Clock className="h-3 w-3" /> Saving...
                            </span>
                        ) : dirty ? (
                            <span className="text-amber-500">Unsaved changes</span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <Check className="h-3 w-3" /> Saved {lastSaved || 'just now'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right: Actions & Sidebar Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        title="Toggle Dark Mode"
                    >
                        {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
                    </button>

                    {headerActions}

                    {onSaveDraft && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onSaveDraft}
                            loading={saving}
                            className="hidden sm:inline-flex"
                        >
                            Save Draft
                        </Button>
                    )}

                    {onPublish && (
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={onPublish}
                            loading={publishLoading}
                        >
                            {publishLabel}
                        </Button>
                    )}

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                            sidebarOpen
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        }`}
                        title={sidebarOpen ? 'Hide settings sidebar' : 'Show settings sidebar'}
                    >
                        {sidebarOpen ? (
                            <PanelRightClose className="h-4 w-4" />
                        ) : (
                            <PanelRightOpen className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </header>

            {/* Editor Workspace */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main Writing Canvas */}
                <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-12 lg:px-16">
                    <div className="mx-auto max-w-4xl">{children}</div>
                </main>

                {/* Right Document Settings Sidebar */}
                {sidebarOpen && (
                    <aside className="w-80 sm:w-96 shrink-0 border-l border-slate-200/80 bg-white overflow-y-auto dark:border-slate-800 dark:bg-[#0f172a] shadow-sm">
                        {sidebarContent}
                    </aside>
                )}
            </div>
        </div>
    );
}
