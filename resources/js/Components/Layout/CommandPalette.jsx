import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { router } from '@inertiajs/react';
import {
    Search,
    LayoutDashboard,
    BookCopy,
    FileText,
    Image as ImageIcon,
    FolderKanban,
    Hash,
    Menu as MenuIcon,
    Users,
    Settings,
    Plus,
    X,
    Calendar,
    Megaphone,
} from 'lucide-react';

const actions = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { title: 'All Posts', href: '/admin/posts', icon: BookCopy, category: 'Navigation' },
    { title: 'Create New Post', href: '/admin/posts/create', icon: Plus, category: 'Actions' },
    { title: 'All Pages', href: '/admin/pages', icon: FileText, category: 'Navigation' },
    { title: 'Create New Page', href: '/admin/pages/create', icon: Plus, category: 'Actions' },
    { title: 'All Announcements', href: '/admin/announcements', icon: Megaphone, category: 'Navigation' },
    { title: 'Create New Announcement', href: '/admin/announcements/create', icon: Plus, category: 'Actions' },
    { title: 'All Events / Agenda', href: '/admin/events', icon: Calendar, category: 'Navigation' },
    { title: 'Create New Event', href: '/admin/events/create', icon: Plus, category: 'Actions' },
    { title: 'Media Library', href: '/media', icon: ImageIcon, category: 'Navigation' },
    { title: 'Categories', href: '/categories', icon: FolderKanban, category: 'Navigation' },
    { title: 'Hashtags', href: '/hashtags', icon: Hash, category: 'Navigation' },
    { title: 'Menu Manager', href: '/menus', icon: MenuIcon, category: 'Navigation' },
    { title: 'Users & Roles', href: '/users', icon: Users, category: 'Navigation' },
    { title: 'Web Settings', href: '/settings/web', icon: Settings, category: 'Navigation' },
];

export default function CommandPalette({ isOpen = false, onClose = () => {} }) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) onClose();
                else onClose(true); // Toggle
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    const filtered = query === ''
        ? actions
        : actions.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase()),
          );

    const handleSelect = (href) => {
        onClose();
        router.visit(href);
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs dark:bg-slate-950/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-150"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-[#0f172a] text-xs">
                            <div className="flex items-center border-b border-slate-100 px-4 dark:border-slate-800">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Type a command or search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full border-0 bg-transparent py-3.5 pl-3 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
                                    autoFocus
                                />
                                <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                                    ESC
                                </kbd>
                            </div>

                            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                                {filtered.length === 0 ? (
                                    <div className="p-4 text-center text-slate-400">
                                        No matching commands found.
                                    </div>
                                ) : (
                                    filtered.map((item, idx) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSelect(item.href)}
                                                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-400 transition-colors">
                                                        <Icon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {item.title}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                    {item.category}
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
