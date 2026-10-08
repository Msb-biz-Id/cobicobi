import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Home,
    Building2,
    Library,
    Network,
    Landmark,
    Compass,
    GraduationCap,
    Images,
    BookCopy,
    Megaphone,
    Calendar,
    Phone,
    Sparkles,
    Users,
    Award,
    Tag,
    FileText,
    Globe,
    ChevronDown,
    ChevronRight,
    ArrowUpRight,
    Camera,
    FolderKanban,
    Layers,
} from 'lucide-react';

// Icon Map Registry untuk Lucide Icons yang dinamis
export const iconMap = {
    Home,
    Building2,
    Library,
    Network,
    Landmark,
    Compass,
    GraduationCap,
    Images,
    BookCopy,
    Megaphone,
    Calendar,
    Phone,
    Sparkles,
    Users,
    Award,
    Tag,
    FileText,
    Globe,
    Camera,
    FolderKanban,
    Layers,
};

export function renderDynamicIcon(iconName, className = 'h-4 w-4') {
    if (!iconName) return null;
    const Component = iconMap[iconName];
    if (!Component) return null;
    return <Component className={className} />;
}

export default function DynamicNavbar({ menus = [] }) {
    const { url } = usePage();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const timeoutRef = useRef(null);

    const handleMouseEnter = (id) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpenDropdownId(id);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenDropdownId(null);
        }, 180);
    };

    const isActive = (menuUrl) => {
        if (!menuUrl || menuUrl === '#' || menuUrl === '/') return url === '/';
        return url.startsWith(menuUrl);
    };

    return (
        <nav className="hidden lg:flex items-center gap-1 relative">
            {menus.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isMega = item.type === 'mega_menu';
                const isDropdown = item.type === 'dropdown' || (hasChildren && !isMega);
                const isOpen = openDropdownId === item.id;
                const active = isActive(item.url);

                // Menu Biasa (Tanpa Anak)
                if (!hasChildren && !isMega && !isDropdown) {
                    return (
                        <Link
                            key={item.id}
                            href={item.url || '#'}
                            target={item.target || '_self'}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                active
                                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                            }`}
                        >
                            {renderDynamicIcon(item.icon, 'h-3.5 w-3.5 text-indigo-500 shrink-0')}
                            <span>{item.title}</span>
                            {item.badge && (
                                <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                }

                // Menu dengan Dropdown atau Mega Menu
                return (
                    <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                active || isOpen
                                    ? 'bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                            }`}
                        >
                            {renderDynamicIcon(item.icon, 'h-3.5 w-3.5 text-indigo-500 shrink-0')}
                            <span>{item.title}</span>
                            {item.badge && (
                                <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                    {item.badge}
                                </span>
                            )}
                            <ChevronDown
                                className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180 text-indigo-500' : ''
                                }`}
                            />
                        </button>

                        {/* MEGA MENU CONTAINER */}
                        {isMega && isOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-[780px] max-w-[95vw] animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-[#070b14]/95">
                                    {/* Header Mega Menu */}
                                    {item.description && (
                                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                                    {renderDynamicIcon(item.icon, 'h-4 w-4')}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {item.badge && (
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Kolom Grid Mega Menu */}
                                    <div
                                        className={`grid gap-3 ${
                                            item.mega_columns === 4
                                                ? 'grid-cols-4'
                                                : item.mega_columns === 2
                                                ? 'grid-cols-2'
                                                : 'grid-cols-3'
                                        }`}
                                    >
                                        {item.children.map((sub) => (
                                            <Link
                                                key={sub.id}
                                                href={sub.url || '#'}
                                                target={sub.target || '_self'}
                                                onClick={() => setOpenDropdownId(null)}
                                                className="group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800"
                                            >
                                                {sub.icon ? (
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm dark:bg-indigo-950/50 dark:text-indigo-400">
                                                        {renderDynamicIcon(sub.icon, 'h-4 w-4')}
                                                    </div>
                                                ) : (
                                                    <div className="flex h-2 w-2 shrink-0 rounded-full bg-indigo-400 mt-2" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="truncate text-xs font-bold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                                                            {sub.title}
                                                        </span>
                                                        {sub.badge && (
                                                            <span className="rounded-md bg-indigo-100 px-1 py-0.2 text-[8px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                                                {sub.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {sub.description && (
                                                        <p className="mt-0.5 line-clamp-2 text-[10px] text-slate-500 leading-relaxed dark:text-slate-400">
                                                            {sub.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Footer Highlight di Mega Menu */}
                                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50/70 via-indigo-50/30 to-transparent p-3 dark:from-indigo-950/30 dark:via-transparent border border-indigo-100/50 dark:border-indigo-900/30">
                                        <div className="flex items-center gap-2 text-xs text-indigo-950 dark:text-indigo-200">
                                            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                            <span className="font-semibold">Portal Penerimaan & Informasi Kampus</span>
                                        </div>
                                        <Link
                                            href={route('public.events.index')}
                                            onClick={() => setOpenDropdownId(null)}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Lihat Kalender Akademik
                                            <ArrowUpRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DROPDOWN SUB-MENU BIASA */}
                        {!isMega && isOpen && (
                            <div className="absolute left-0 top-full pt-2 z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-[#070b14]/95 space-y-1">
                                    {item.children.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={sub.url || '#'}
                                            target={sub.target || '_self'}
                                            onClick={() => setOpenDropdownId(null)}
                                            className="group flex items-start gap-2.5 rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-900/60"
                                        >
                                            {sub.icon && (
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition shadow-sm dark:bg-indigo-950/50 dark:text-indigo-400">
                                                    {renderDynamicIcon(sub.icon, 'h-3.5 w-3.5')}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 truncate">
                                                        {sub.title}
                                                    </span>
                                                    {sub.badge && (
                                                        <span className="rounded bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                                            {sub.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {sub.description && (
                                                    <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500 dark:text-slate-400">
                                                        {sub.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
