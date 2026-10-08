import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    BookCopy,
    Image as ImageIcon,
    FolderKanban,
    Hash,
    Menu as MenuIcon,
    Mail,
    Bell,
    Users,
    ShieldCheck,
    Settings,
    Activity,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Calendar,
    Megaphone,
    GraduationCap,
    UserCheck,
    Building2,
    Library,
    Award,
    Network,
    Landmark,
    Compass,
} from 'lucide-react';
import { useState } from 'react';

const menuGroups = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, route: 'dashboard', activeKey: 'dashboard' },
            { label: 'Biodata & Portofolio', icon: UserCheck, route: 'profile.staff.edit', activeKey: 'profile.staff.*' },
        ],
    },
    {
        title: 'Akademik & Kelembagaan',
        items: [
            { label: 'Master Jabatan', icon: Award, route: 'admin.structural-positions.index', activeKey: 'admin.structural-positions.*' },
            { label: 'Fakultas', icon: Building2, route: 'admin.faculties.index', activeKey: 'admin.faculties.*' },
            { label: 'Program Studi', icon: Library, route: 'admin.study-programs.index', activeKey: 'admin.study-programs.*' },
            { label: 'Unit & Lembaga', icon: Network, route: 'admin.institutional-units.index', activeKey: 'admin.institutional-units.*' },
            { label: 'Fasilitas Kampus', icon: Landmark, route: 'admin.facilities.index', activeKey: 'admin.facilities.*' },
            { label: 'Ekstrakurikuler (UKM)', icon: Compass, route: 'admin.extracurriculars.index', activeKey: 'admin.extracurriculars.*' },
        ],
    },
    {
        title: 'Editorial & Civitas',
        items: [
            { label: 'Posts', icon: BookCopy, route: 'posts.index', activeKey: 'posts.*' },
            { label: 'Pages', icon: FileText, route: 'pages.index', activeKey: 'pages.*' },
            { label: 'Dosen & Tendik', icon: GraduationCap, route: 'staff.index', activeKey: 'staff.*' },
            { label: 'Pengumuman', icon: Megaphone, route: 'announcements.index', activeKey: 'announcements.*' },
            { label: 'Events / Agenda', icon: Calendar, route: 'events.index', activeKey: 'events.*' },
            { label: 'Galeri & Album', icon: ImageIcon, route: 'galleries.index', activeKey: 'galleries.*' },
            { label: 'Media Library', icon: FolderKanban, route: 'media.index', activeKey: 'media.*' },
            { label: 'Categories', icon: FolderKanban, route: 'categories.index', activeKey: 'categories.*' },
            { label: 'Hashtags', icon: Hash, route: 'hashtags.index', activeKey: 'hashtags.*' },
        ],
    },
    {
        title: 'Site Structure',
        items: [
            { label: 'Menus', icon: MenuIcon, route: 'menus.index', activeKey: 'menus.*' },
        ],
    },
    {
        title: 'Communications',
        items: [
            { label: 'Messages', icon: Mail, route: 'contact-messages.index', activeKey: 'contact-messages.*' },
            { label: 'Notifications', icon: Bell, route: 'notifications.index', activeKey: 'notifications.*' },
        ],
    },
    {
        title: 'System & Admin',
        items: [
            { label: 'Users', icon: Users, route: 'users.index', activeKey: 'users.*' },
            { label: 'Roles & Permissions', icon: ShieldCheck, route: 'roles-permissions.index', activeKey: 'roles-permissions.*' },
            { label: 'Web Settings', icon: Settings, route: 'web-settings.edit', activeKey: 'web-settings.*' },
            { label: 'Audit Logs', icon: Activity, route: 'audit-logs.index', activeKey: 'audit-logs.*' },
        ],
    },
];

export default function AppSidebar({ collapsed = false, onToggleCollapse, isMobileOpen = false, onCloseMobile }) {
    const { url } = usePage();
    const { webSetting } = usePage().props;

    const isActive = (itemRoute, activeKey) => {
        try {
            return route().current(activeKey || itemRoute);
        } catch {
            return false;
        }
    };

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between overflow-y-auto px-3.5 py-4">
            <div>
                {/* Brand Logo & Name */}
                <div className={`mb-6 flex items-center gap-3 px-2 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
                        {webSetting?.logo_url ? (
                            <img src={webSetting.logo_url} alt="Logo" className="h-6 w-6 object-contain" />
                        ) : (
                            <Sparkles className="h-5 w-5" />
                        )}
                    </div>
                    {!collapsed && (
                        <div className="truncate">
                            <h2 className="text-sm font-bold tracking-tight text-slate-900 truncate dark:text-white">
                                {webSetting?.site_title || 'CMS Lara'}
                            </h2>
                            <p className="text-[11px] font-medium text-slate-400 truncate">
                                Admin Suite
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation Menus */}
                <nav className="space-y-6">
                    {menuGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1">
                            {!collapsed && (
                                <h3 className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {group.title}
                                </h3>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map((item, iIdx) => {
                                    const active = isActive(item.route, item.activeKey);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={iIdx}
                                            href={route(item.route)}
                                            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                                collapsed ? 'justify-center px-2' : ''
                                            } ${
                                                active
                                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white'
                                            }`}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <Icon className={`h-4 w-4 shrink-0 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                                            {!collapsed && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Collapse Toggle Footer */}
            {onToggleCollapse && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${
                            collapsed ? 'justify-center' : ''
                        }`}
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        {!collapsed && <span>Collapse Sidebar</span>}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:block shrink-0 border-r border-slate-200/80 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-[#0c101d] ${
                    collapsed ? 'w-20' : 'w-64'
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                        onClick={onCloseMobile}
                    />
                    <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#0c101d] shadow-2xl z-10 flex flex-col">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
