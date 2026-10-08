import { usePage, Link, router } from '@inertiajs/react';
import {
    Menu as MenuIcon,
    Search,
    Sun,
    Moon,
    User,
    LogOut,
    Check,
    ChevronDown,
    Shield,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';
import Badge from '@/Components/UI/Badge';

export default function AppHeader({ onOpenMobileSidebar, onOpenCommandPalette }) {
    const { auth } = usePage().props;
    const { isDark, toggleDarkMode } = useUiStore();
    const user = auth?.user;

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-[#0c101d]/85">
            {/* Left: Mobile hamburger & Global Search command */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onOpenMobileSidebar}
                    className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    <MenuIcon className="h-5 w-5" />
                </button>

                {/* Command Palette Trigger */}
                <button
                    type="button"
                    onClick={onOpenCommandPalette}
                    className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:text-slate-500 transition-all sm:w-64"
                >
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">Quick jump or search...</span>
                    <kbd className="hidden sm:inline-flex ml-auto items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                        ⌘K
                    </kbd>
                </button>
            </div>

            {/* Right: Theme Toggle, Notifications, User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Dark Mode Switcher */}
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    title="Toggle Theme"
                >
                    {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                </button>



                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

                {/* User Profile Dropdown */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        type="button"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="hidden text-left sm:block">
                            <div className="text-xs font-bold text-slate-900 truncate dark:text-white max-w-[120px]">
                                {user?.name || 'Administrator'}
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 capitalize">
                                {user?.role || 'Admin'}
                            </div>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a] text-xs z-50">
                            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="py-1">
                                <Link
                                    href={route('profile.edit')}
                                    onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <User className="h-4 w-4 text-slate-400" />
                                    Profile Settings
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
