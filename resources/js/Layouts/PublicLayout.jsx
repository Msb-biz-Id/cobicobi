import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Menu as MenuIcon,
    X,
    Calendar,
    GraduationCap,
    Phone,
    LogIn,
} from 'lucide-react';
import DynamicNavbar from '@/Components/Nav/DynamicNavbar';
import MobileNavDrawer from '@/Components/Nav/MobileNavDrawer';

export default function PublicLayout({ children, title }) {
    const { webSetting, auth, navigationMenus = [] } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const siteTitle = webSetting?.site_title || 'Universitas Sains & Teknologi Nusantara';
    const slogan = webSetting?.slogan || 'Excellence in Research, Integrity in Character, Global in Impact';

    // Fallback navigasi jika database menu belum di-seed
    const fallbackMenus = [
        { id: 'f_home', title: 'Beranda', url: route('home'), type: 'standard', icon: 'Home' },
        { id: 'f_fac', title: 'Fakultas', url: route('public.faculties.index'), type: 'standard', icon: 'Building2' },
        { id: 'f_prodi', title: 'Program Studi', url: route('public.study-programs.index'), type: 'standard', icon: 'Library' },
        { id: 'f_galeri', title: 'Galeri Kampus', url: route('public.galleries.index'), type: 'standard', icon: 'Images', badge: 'Baru' },
        { id: 'f_news', title: 'Berita', url: route('public.posts.index'), type: 'standard', icon: 'BookCopy' },
        { id: 'f_agenda', title: 'Agenda', url: route('public.events.index'), type: 'standard', icon: 'Calendar' },
    ];

    const displayMenus = navigationMenus && navigationMenus.length > 0 ? navigationMenus : fallbackMenus;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white dark:bg-[#070b14] dark:text-slate-100 font-sans">
            {/* Top Quick Bar */}
            <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-2 text-xs dark:border-slate-800/80 dark:bg-slate-950/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Akreditasi Unggul BAN-PT
                        </span>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                        <span className="hidden md:inline truncate">{slogan}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {webSetting?.contact_phone && (
                            <a
                                href={`tel:${webSetting.contact_phone}`}
                                className="hidden sm:flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Phone className="h-3 w-3" />
                                <span>{webSetting.contact_phone}</span>
                            </a>
                        )}
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                <GraduationCap className="h-3.5 w-3.5" />
                                CMS Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                <LogIn className="h-3 w-3" />
                                Login Staff / Portal
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070b14]/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
                    {/* Brand Logo */}
                    <Link href={route('home')} className="flex items-center gap-3 group shrink-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            {webSetting?.logo_url ? (
                                <img src={webSetting.logo_url} alt="Logo" className="h-6 w-6 object-contain" />
                            ) : (
                                <GraduationCap className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <span className="block text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                {siteTitle}
                            </span>
                            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Portal Akademik & Agenda Kampus
                            </span>
                        </div>
                    </Link>

                    {/* Dynamic Desktop Navigation (Mega Menu, Sub Menu & Standard) */}
                    <DynamicNavbar menus={displayMenus} />

                    {/* Actions / CTA */}
                    <div className="hidden xl:flex items-center gap-3">
                        <Link
                            href={route('public.events.index')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Calendar className="h-3.5 w-3.5" />
                            Jadwal Agenda
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                <MobileNavDrawer
                    menus={displayMenus}
                    isOpen={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                />
            </header>

            {/* Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Prestigious University Footer */}
            <footer className="border-t border-slate-200/90 bg-white dark:border-slate-800/80 dark:bg-[#050811] text-slate-600 dark:text-slate-400 transition-colors">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                        {/* Column 1: Identity */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-base">
                                    {siteTitle}
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                {webSetting?.short_description ||
                                    'Pusat keunggulan akademik, riset teknologi terapan, dan pengembangan talenta kepemimpinan global berlandaskan integritas dan tridharma perguruan tinggi.'}
                            </p>
                            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Terakreditasi UNGGUL (BAN-PT)
                            </div>
                        </div>

                        {/* Column 2: Tautan Cepat */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Informasi & Portal
                            </h3>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <Link href={route('home')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        Beranda Portal
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('public.posts.index')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        Berita & Opini Ilmiah
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('public.events.index')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        Kalender Agenda & Event
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('login')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                        Portal Dosen & Staff
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Agenda & Event Populer */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Agenda Kampus
                            </h3>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Dapatkan akses pendaftaran seminar nasional, konferensi internasional, wisuda sarjana, dan job fair kampus terkini.
                            </p>
                            <Link
                                href={route('public.events.index')}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Jelajahi Event <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {/* Column 4: Kontak & Sekretariat */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Sekretariat Rektorat
                            </h3>
                            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                                {webSetting?.address && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                                        <span>{webSetting.address}, {webSetting.city}</span>
                                    </div>
                                )}
                                {webSetting?.contact_email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                        <a href={`mailto:${webSetting.contact_email}`} className="hover:underline">
                                            {webSetting.contact_email}
                                        </a>
                                    </div>
                                )}
                                {webSetting?.contact_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span>{webSetting.contact_phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                        <p>© {new Date().getFullYear()} {siteTitle}. Hak Cipta Dilindungi Undang-Undang.</p>
                        <p className="flex items-center gap-1 text-slate-400">
                            Academic Portal CMS Suite
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
