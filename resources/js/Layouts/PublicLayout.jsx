import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Menu as MenuIcon,
    X,
    Calendar,
    GraduationCap,
    Phone,
    LogIn,
    MapPin,
    Mail,
    ChevronRight,
    MessageCircle,
    Instagram,
    Youtube,
    Facebook,
    Linkedin,
    Twitter,
    Building2,
    Clock,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';
import DynamicNavbar from '@/Components/Nav/DynamicNavbar';
import MobileNavDrawer from '@/Components/Nav/MobileNavDrawer';

export default function PublicLayout({ children, title }) {
    const { webSetting, auth, navigationMenus = [] } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const siteTitle = webSetting?.site_title || 'Institut Teknologi dan Bisnis Tuban';
    const slogan = webSetting?.slogan || 'Excellence in Technology, Business & Innovation';

    // Fallback navigasi jika database menu belum di-seed
    const fallbackMenus = [
        { id: 'f_home', title: 'Beranda', url: route('home'), type: 'standard', icon: 'Home' },
        { id: 'f_about', title: 'Profil Kampus', url: route('public.about'), type: 'standard', icon: 'GraduationCap' },
        { id: 'f_fac', title: 'Fakultas', url: route('public.faculties.index'), type: 'standard', icon: 'Building2' },
        { id: 'f_prodi', title: 'Program Studi', url: route('public.study-programs.index'), type: 'standard', icon: 'Library' },
        { id: 'f_fasilitas', title: 'Fasilitas', url: route('public.facilities.index'), type: 'standard', icon: 'Sparkles' },
        { id: 'f_galeri', title: 'Galeri Kampus', url: route('public.galleries.index'), type: 'standard', icon: 'Images' },
        { id: 'f_news', title: 'Berita', url: route('public.posts.index'), type: 'standard', icon: 'BookCopy' },
        { id: 'f_agenda', title: 'Agenda', url: route('public.events.index'), type: 'standard', icon: 'Calendar' },
    ];

    const displayMenus = navigationMenus && navigationMenus.length > 0 ? navigationMenus : fallbackMenus;

    // Social networks yang diset secara dinamis di web settings
    const socialLinks = [
        { key: 'instagram_url', label: 'Instagram', icon: Instagram, url: webSetting?.instagram_url },
        { key: 'youtube_url', label: 'YouTube', icon: Youtube, url: webSetting?.youtube_url },
        { key: 'facebook_url', label: 'Facebook', icon: Facebook, url: webSetting?.facebook_url },
        { key: 'x_url', label: 'X (Twitter)', icon: Twitter, url: webSetting?.x_url },
        { key: 'linkedin_url', label: 'LinkedIn', icon: Linkedin, url: webSetting?.linkedin_url },
    ].filter((s) => Boolean(s.url));

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-primary-500 selection:text-white dark:bg-[#070b14] dark:text-slate-100 font-sans">
            {/* Top Quick Bar Dinamis */}
            <div className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md py-2 text-xs dark:border-slate-800/80 dark:bg-slate-950/80">
                <div className="site-container flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Terakreditasi UNGGUL BAN-PT
                        </span>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                        <span className="hidden md:inline truncate">{slogan}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {webSetting?.contact_phone && (
                            <a
                                href={`tel:${webSetting.contact_phone}`}
                                className="hidden sm:flex items-center gap-1 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                            >
                                <Phone className="h-3 w-3" />
                                <span>{webSetting.contact_phone}</span>
                            </a>
                        )}
                        {webSetting?.whatsapp_number && (
                            <a
                                href={`https://wa.me/${webSetting.whatsapp_number.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden md:flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400 font-semibold"
                            >
                                <MessageCircle className="h-3 w-3" />
                                <span>WhatsApp Hotline</span>
                            </a>
                        )}
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-1.5 font-bold text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                <GraduationCap className="h-3.5 w-3.5" />
                                CMS Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-1 text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors font-medium"
                            >
                                <LogIn className="h-3 w-3" />
                                Portal Staff / Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070b14]/95">
                <div className="site-container flex items-center justify-between py-3.5">
                    {/* Brand Logo & Name Dinamis */}
                    <Link href={route('home')} className="flex items-center gap-3 group shrink-0">
                        {webSetting?.logo_url ? (
                            <img
                                src={webSetting.logo_url}
                                alt={siteTitle}
                                className="h-10 w-auto object-contain max-w-[200px]"
                            />
                        ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                                <GraduationCap className="h-6 w-6 text-secondary-400" />
                            </div>
                        )}
                        <div>
                            <span className="block text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none font-heading">
                                {siteTitle}
                            </span>
                            <span className="block text-[10px] sm:text-[11px] font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-widest mt-1">
                                {slogan}
                            </span>
                        </div>
                    </Link>

                    {/* Dynamic Desktop Navigation */}
                    <DynamicNavbar menus={displayMenus} />

                    {/* Action CTA */}
                    <div className="hidden xl:flex items-center gap-3">
                        <Link
                            href={route('public.events.index')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-600/20 hover:bg-primary-500 transition-all hover:scale-[1.02] active:scale-95"
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

            {/* Concise University Footer (Logo, Deskripsi, Akreditasi, Alamat, Medsos & Embed Map) */}
            <footer className="border-t border-slate-200/90 bg-white dark:border-slate-800/80 dark:bg-[#050811] text-slate-600 dark:text-slate-400 transition-colors">
                <div className="site-container py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
                        {/* Kolom 1: Logo, Deskripsi, Akreditasi & Medsos (5 Cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            <Link href={route('home')} className="flex items-center gap-3">
                                {webSetting?.logo_url ? (
                                    <img
                                        src={webSetting.logo_url}
                                        alt={siteTitle}
                                        className="h-10 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 dark:text-white text-base font-heading leading-tight">
                                        {siteTitle}
                                    </span>
                                    {slogan && (
                                        <span className="text-[10px] text-secondary-600 dark:text-secondary-400 font-bold uppercase tracking-wider mt-0.5">
                                            {slogan}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-md">
                                {webSetting?.short_description ||
                                    'Pusat keunggulan akademik, riset teknologi terapan, dan pengembangan talenta kepemimpinan global berlandaskan integritas dan tridharma perguruan tinggi.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <span>Terakreditasi UNGGUL (BAN-PT)</span>
                                </div>

                                {/* Medsos Icons */}
                                <div className="flex flex-wrap gap-1.5">
                                    {socialLinks.map((s) => {
                                        const IconComp = s.icon;
                                        return (
                                            <a
                                                key={s.key}
                                                href={s.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label={s.label}
                                                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 transition-all shadow-2xs"
                                            >
                                                <IconComp className="h-3.5 w-3.5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Kolom 2: Alamat & Kontak Resmi (3.5 Cols) */}
                        <div className="lg:col-span-3 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-primary-500" /> Kontak &amp; Alamat
                            </h3>

                            <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-primary-500 mt-0.5" />
                                    <span className="leading-relaxed">
                                        {webSetting?.address || 'Jl. Manunggal No. 61, Sukolilo, Kec. Tuban, Kabupaten Tuban, Jawa Timur 62319'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                                    <span>{webSetting?.contact_phone || '(0356) 321876'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                                    <a
                                        href={`mailto:${webSetting?.contact_email || 'info@itbtuban.ac.id'}`}
                                        className="hover:underline text-slate-700 dark:text-slate-300 font-medium"
                                    >
                                        {webSetting?.contact_email || 'info@itbtuban.ac.id'}
                                    </a>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400 pt-0.5">
                                    <Clock className="h-3.5 w-3.5 shrink-0 text-secondary-500" />
                                    <span>Senin - Jumat: 08.00 - 16.00 WIB</span>
                                </div>
                            </div>
                        </div>

                        {/* Kolom 3: Embed Google Maps (3.5 Cols) */}
                        <div className="lg:col-span-4 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-secondary-500" /> Peta Lokasi Kampus
                            </h3>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs h-[160px] w-full bg-slate-100 dark:bg-slate-950">
                                <iframe
                                    src={
                                        webSetting?.google_maps_url ||
                                        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126715.4852656972!2d112.0135763!3d-6.8943187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e779a1f970bb513%3A0x3027a76e352bb40!2sTuban%2C%20Tuban%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid'
                                    }
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta Lokasi Kampus"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                        <p>&copy; {new Date().getFullYear()} {siteTitle}. Hak Cipta Dilindungi.</p>
                        <div className="flex items-center gap-3">
                            <Link href={route('public.about')} className="hover:text-primary-600 dark:hover:text-white transition-colors">
                                Profil
                            </Link>
                            <span>&bull;</span>
                            <Link href={route('public.study-programs.index')} className="hover:text-primary-600 dark:hover:text-white transition-colors">
                                Program Studi
                            </Link>
                            <span>&bull;</span>
                            <Link href={route('public.facilities.index')} className="hover:text-primary-600 dark:hover:text-white transition-colors">
                                Fasilitas
                            </Link>
                            <span>&bull;</span>
                            <Link href={route('login')} className="hover:text-primary-600 dark:hover:text-white transition-colors">
                                Login Staff
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
