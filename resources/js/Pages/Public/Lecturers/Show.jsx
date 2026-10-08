import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    GraduationCap,
    Globe,
    ExternalLink,
    Mail,
    Phone,
    MapPin,
    Building2,
    BookOpen,
    Share2,
    Calendar,
    Award,
    CheckCircle2,
    Copy,
    ArrowLeft,
    Sparkles,
    FileText,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/Components/UI/Button';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon } from '@/Components/Icons/SocialIcons';

export default function Show({ staff, relatedStaff = [] }) {
    const [activeTab, setActiveTab] = useState('publications'); // publications, bio, education
    const [copied, setCopied] = useState(false);
    const [pubFilter, setPubFilter] = useState('all');

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const publications = Array.isArray(staff.publications) ? staff.publications : [];
    const educationHistory = Array.isArray(staff.education_history) ? staff.education_history : [];
    const expertiseList = Array.isArray(staff.expertise) ? staff.expertise : [];

    const filteredPublications = publications.filter((p) => {
        if (pubFilter === 'all') return true;
        if (pubFilter === 'scholar') return p.source === 'scholar';
        if (pubFilter === 'manual') return p.source === 'manual';
        if (pubFilter === 'rss') return p.source === 'rss';
        return p.type === pubFilter;
    });

    return (
        <PublicLayout>
            <Head title={`${staff.full_name_with_titles} - Profil Civitas Akademika`} />

            <div className="site-container py-8 sm:py-12 space-y-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Link href={route('home')} className="hover:text-indigo-600 transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('public.lecturers.index')} className="hover:text-indigo-600 transition-colors">
                        Direktori Dosen &amp; Tendik
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md font-medium">
                        {staff.full_name_with_titles}
                    </span>
                </div>

                {/* Academic Hero Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none">
                    <div className="h-32 sm:h-44 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                    </div>

                    <div className="px-6 sm:px-10 pb-8 sm:pb-10 pt-0 relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
                            {/* Avatar */}
                            <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-3xl border-4 border-white bg-slate-100 dark:border-slate-900 dark:bg-slate-800 overflow-hidden shadow-lg shrink-0">
                                <img
                                    src={staff.avatar_url}
                                    alt={staff.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Share Action */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            <span>Tautan Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-3.5 w-3.5" />
                                            <span>Bagikan Profil</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Name & Academic Rank Details */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                                    {staff.academic_position || staff.auto_structural_position || staff.structural_position || staff.type_label}
                                </span>

                                {staff.nidn && (
                                    <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        NIDN: {staff.nidn}
                                    </span>
                                )}

                                {staff.nip && (
                                    <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        NIP: {staff.nip}
                                    </span>
                                )}

                                {staff.employment_status && (
                                    <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                                        {staff.employment_status}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                                {staff.full_name_with_titles}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                {staff.study_program && (
                                    <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                                        <Building2 className="h-4 w-4 text-indigo-500" />
                                        {staff.study_program}
                                    </div>
                                )}

                                {staff.faculty && (
                                    <span>• {staff.faculty}</span>
                                )}
                            </div>
                        </div>

                        {/* Citation & Research Metrics Bar (For Dosen) */}
                        {staff.type === 'dosen' && (
                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-indigo-100/80 bg-indigo-50/30 dark:border-indigo-950/40 dark:bg-indigo-950/20">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Total Sitasi Riset
                                    </span>
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                        {staff.total_citations || 0}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Google Scholar</span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        h-index
                                    </span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                                        {staff.h_index || 0}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Produktivitas Riset</span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        i10-index
                                    </span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                                        {staff.i10_index || 0}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Paper &gt;= 10 Sitasi</span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Total Publikasi
                                    </span>
                                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                        {publications.length}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">Karya Terdaftar</span>
                                </div>
                            </div>
                        )}

                        {/* Academic ID Badges & Social Links */}
                        <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {staff.google_scholar_url && (
                                <a
                                    href={staff.google_scholar_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700"
                                >
                                    <Globe className="h-3.5 w-3.5 text-blue-500" />
                                    Google Scholar
                                    <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                                </a>
                            )}

                            {(staff.scopus_url || staff.scopus_id) && (
                                <a
                                    href={
                                        staff.scopus_url ||
                                        `https://www.scopus.com/authid/detail.uri?authorId=${staff.scopus_id}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    <Award className="h-3.5 w-3.5 text-amber-500" />
                                    Scopus Profile
                                    <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                                </a>
                            )}

                            {(staff.sinta_url || staff.sinta_id) && (
                                <a
                                    href={staff.sinta_url || `https://sinta.kemdikbud.go.id/authors/profile/${staff.sinta_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                                    SINTA Kemendikbud
                                    <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                                </a>
                            )}

                            {(staff.orcid_url || staff.orcid_id) && (
                                <a
                                    href={
                                        staff.orcid_url ||
                                        `https://orcid.org/${staff.orcid_id}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-lime-600" />
                                    ORCID
                                    <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                                </a>
                            )}

                            {staff.website_url && (
                                <a
                                    href={staff.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    <Globe className="h-3.5 w-3.5 text-indigo-500" />
                                    Website
                                </a>
                            )}

                            {staff.facebook_url && (
                                <a
                                    href={staff.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-blue-400"
                                    title="Facebook"
                                >
                                    <FacebookIcon className="h-3.5 w-3.5 text-blue-600" />
                                    Facebook
                                </a>
                            )}

                            {staff.instagram_url && (
                                <a
                                    href={staff.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-pink-400 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-pink-400"
                                    title="Instagram"
                                >
                                    <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />
                                    Instagram
                                </a>
                            )}

                            {staff.x_url && (
                                <a
                                    href={staff.x_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-500 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                                    title="X (Twitter)"
                                >
                                    <XIcon className="h-3.5 w-3.5" />
                                    X
                                </a>
                            )}

                            {staff.tiktok_url && (
                                <a
                                    href={staff.tiktok_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-500 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                                    title="TikTok"
                                >
                                    <TikTokIcon className="h-3.5 w-3.5" />
                                    TikTok
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: Tabs (Left 2 Cols) & Contact / Sidebar (Right 1 Col) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: 2 Columns - Tabbed Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tab Switcher */}
                        <div className="flex rounded-2xl bg-slate-100 p-1.5 text-xs dark:bg-slate-800/80">
                            <button
                                type="button"
                                onClick={() => setActiveTab('publications')}
                                className={`flex-1 rounded-xl py-2.5 font-bold transition-all text-center ${
                                    activeTab === 'publications'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                Karya Ilmiah &amp; Publikasi ({publications.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('bio')}
                                className={`flex-1 rounded-xl py-2.5 font-bold transition-all text-center ${
                                    activeTab === 'bio'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                Biografi &amp; Kepakaran
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('education')}
                                className={`flex-1 rounded-xl py-2.5 font-bold transition-all text-center ${
                                    activeTab === 'education'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                Riwayat Pendidikan
                            </button>
                        </div>

                        {/* TAB 1: KARYA ILMIAH & PUBLIKASI */}
                        {activeTab === 'publications' && (
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        Daftar Portofolio Publikasi Riset
                                    </h3>

                                    {/* Source Filter Chips */}
                                    <div className="flex flex-wrap gap-1 text-[11px]">
                                        <button
                                            type="button"
                                            onClick={() => setPubFilter('all')}
                                            className={`rounded-lg px-2.5 py-1 font-semibold ${
                                                pubFilter === 'all'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            Semua ({publications.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPubFilter('scholar')}
                                            className={`rounded-lg px-2.5 py-1 font-semibold ${
                                                pubFilter === 'scholar'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            Google Scholar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPubFilter('journal')}
                                            className={`rounded-lg px-2.5 py-1 font-semibold ${
                                                pubFilter === 'journal'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            Jurnal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPubFilter('conference')}
                                            className={`rounded-lg px-2.5 py-1 font-semibold ${
                                                pubFilter === 'conference'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            Konferensi
                                        </button>
                                    </div>
                                </div>

                                {filteredPublications.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                        {filteredPublications.map((pub) => (
                                            <article
                                                key={pub.id}
                                                className="py-4 first:pt-0 last:pb-0 space-y-1.5"
                                            >
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                        {pub.type_label || pub.type}
                                                    </span>
                                                    {pub.year && (
                                                        <span className="font-mono text-[11px] text-slate-400">
                                                            {pub.year}
                                                        </span>
                                                    )}
                                                    {pub.citations_count > 0 && (
                                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {pub.citations_count} Sitasi
                                                        </span>
                                                    )}
                                                </div>

                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                                                    {pub.url ? (
                                                        <a
                                                            href={pub.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1.5"
                                                        >
                                                            {pub.title}
                                                            <ExternalLink className="h-3.5 w-3.5 inline text-slate-400 shrink-0" />
                                                        </a>
                                                    ) : (
                                                        pub.title
                                                    )}
                                                </h4>

                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {pub.authors && <span className="font-medium">{pub.authors}</span>}
                                                    {pub.authors && pub.publication_name && ' — '}
                                                    {pub.publication_name && (
                                                        <span className="italic">{pub.publication_name}</span>
                                                    )}
                                                </p>

                                                {pub.description && (
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic pt-1">
                                                        &ldquo;{pub.description}&rdquo;
                                                    </p>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                        <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Belum ada publikasi ilmiah yang terdaftar dalam kategori ini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: BIOGRAFI & KEPAKARAN */}
                        {activeTab === 'bio' && (
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
                                {expertiseList.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Fokus Kepakaran &amp; Bidang Riset
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {expertiseList.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40"
                                                >
                                                    <Sparkles className="h-3 w-3 text-indigo-500" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3 pt-2">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Biografi Akademik
                                    </h3>
                                    {staff.bio ? (
                                        <div
                                            className="prose dark:prose-invert prose-indigo max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                                            dangerouslySetInnerHTML={{ __html: staff.bio }}
                                        />
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">
                                            Biografi lengkap belum ditambahkan oleh civitas.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: RIWAYAT PENDIDIKAN */}
                        {activeTab === 'education' && (
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                                    Riwayat Jenjang Pendidikan Tinggi
                                </h3>

                                {educationHistory.length > 0 ? (
                                    <div className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-900 space-y-6">
                                        {educationHistory.map((edu, idx) => (
                                            <div key={idx} className="relative space-y-1">
                                                <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                                                        {edu.degree}
                                                    </span>
                                                    {edu.graduation_year && (
                                                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            Lulus {edu.graduation_year}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                                    {edu.major || 'Program Studi'}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {edu.institution || '-'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic text-center py-6">
                                        Riwayat pendidikan belum ditambahkan.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: 1 Column - Contact, Office Info, & Related Faculty */}
                    <div className="space-y-6 lg:sticky lg:top-24 self-start">
                        {/* Informasi Komunikasi & Kantor */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800">
                                Kontak Resmi &amp; Lokasi Kerja
                            </h3>

                            <div className="space-y-3.5 text-xs">
                                {staff.email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">Email Resmi:</span>
                                            <a
                                                href={`mailto:${staff.email}`}
                                                className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors break-all"
                                            >
                                                {staff.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {staff.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">Nomor Kantor:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {staff.phone}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {staff.office_address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">Ruang Kantor:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {staff.office_address}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {staff.faculty && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="text-slate-400 block text-[11px]">Unit Fakultas:</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {staff.faculty}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {(staff.facebook_url || staff.instagram_url || staff.x_url || staff.tiktok_url) && (
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-400 block text-[11px] mb-2">Media Sosial:</span>
                                        <div className="flex items-center gap-2">
                                            {staff.facebook_url && (
                                                <a
                                                    href={staff.facebook_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-400 transition-colors"
                                                    title="Facebook"
                                                >
                                                    <FacebookIcon className="h-4 w-4 fill-current text-blue-600" />
                                                </a>
                                            )}
                                            {staff.instagram_url && (
                                                <a
                                                    href={staff.instagram_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/40 text-slate-600 dark:text-slate-400 transition-colors"
                                                    title="Instagram"
                                                >
                                                    <InstagramIcon className="h-4 w-4 fill-current text-pink-600" />
                                                </a>
                                            )}
                                            {staff.x_url && (
                                                <a
                                                    href={staff.x_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors"
                                                    title="X (Twitter)"
                                                >
                                                    <XIcon className="h-4 w-4 fill-current" />
                                                </a>
                                            )}
                                            {staff.tiktok_url && (
                                                <a
                                                    href={staff.tiktok_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white text-slate-600 dark:text-slate-400 transition-colors"
                                                    title="TikTok"
                                                >
                                                    <TikTokIcon className="h-4 w-4 fill-current" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amanah Pembina Ekstrakurikuler (UKM) */}
                        {staff.advisory_extracurriculars && staff.advisory_extracurriculars.length > 0 && (
                            <div className="rounded-3xl border border-indigo-200/80 bg-indigo-50/40 p-6 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/30 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 border-b border-indigo-100 pb-3 dark:border-indigo-900/50 flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Pembina Ekstrakurikuler & Kemahasiswaan
                                </h3>

                                <div className="space-y-3">
                                    {staff.advisory_extracurriculars.map((adv, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-2xl bg-white p-3.5 border border-indigo-100 dark:bg-slate-900 dark:border-slate-800 shadow-2xs"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                    {adv.custom_title || adv.position_name}
                                                </span>
                                                {adv.decree_number && (
                                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                        SK: {adv.decree_number}
                                                    </span>
                                                )}
                                            </div>

                                            {adv.ukm_slug ? (
                                                <Link
                                                    href={route('public.extracurriculars.show', adv.ukm_slug)}
                                                    className="mt-1.5 flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                >
                                                    <span>{adv.ukm_name}</span>
                                                    <span className="text-indigo-500 text-xs font-normal">&rarr;</span>
                                                </Link>
                                            ) : (
                                                <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                    {adv.ukm_name}
                                                </p>
                                            )}

                                            {adv.ukm_category && (
                                                <span className="mt-1 inline-block text-[10px] text-slate-400">
                                                    Kategori: {adv.ukm_category}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dosen & Civitas Terkait Lainnya */}
                        {relatedStaff && relatedStaff.length > 0 && (
                            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800">
                                    Dosen Pada Bidang Terkait
                                </h3>

                                <div className="space-y-3.5">
                                    {relatedStaff.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route('public.lecturers.show', item.slug)}
                                            className="group flex items-center gap-3 rounded-2xl p-2.5 border border-slate-100 hover:border-indigo-200 bg-slate-50/40 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 transition-all"
                                        >
                                            <img
                                                src={item.avatar_url}
                                                alt={item.name}
                                                className="h-10 w-10 shrink-0 rounded-xl object-cover"
                                            />
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-indigo-600 transition-colors truncate">
                                                    {item.full_name_with_titles}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 truncate">
                                                    {item.study_program || item.faculty}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
