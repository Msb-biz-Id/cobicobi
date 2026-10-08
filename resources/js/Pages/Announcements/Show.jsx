import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Megaphone,
    Calendar,
    Clock,
    Tag,
    Share2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ExternalLink,
    Users,
    Pin,
    Copy,
    Building2,
    FileText,
    Download,
    Eye,
    Edit3,
    Trash2,
    FileSpreadsheet,
    Archive,
    FileCheck,
    Paperclip,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/Components/UI/Button';

export default function Show({ announcement, isPublicView = true, latestAnnouncements = [] }) {
    const [copied, setCopied] = useState(false);
    const [copiedFileIndex, setCopiedFileIndex] = useState(null);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyDownloadUrl = (index, url) => {
        const fullUrl = route('announcements.download', [announcement.slug || announcement.id, index]);
        navigator.clipboard.writeText(fullUrl);
        setCopiedFileIndex(index);
        setTimeout(() => setCopiedFileIndex(null), 2000);
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengumuman "${announcement.title}"?`)) {
            router.delete(route('announcements.destroy', announcement.id));
        }
    };

    const getFileIcon = (ext) => {
        const normalized = (ext || '').toLowerCase();
        if (normalized === 'pdf') {
            return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
                    <FileText className="h-6 w-6" />
                </div>
            );
        }
        if (['xls', 'xlsx', 'csv'].includes(normalized)) {
            return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                    <FileSpreadsheet className="h-6 w-6" />
                </div>
            );
        }
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(normalized)) {
            return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                    <Archive className="h-6 w-6" />
                </div>
            );
        }
        if (['doc', 'docx', 'odt'].includes(normalized)) {
            return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                    <FileText className="h-6 w-6" />
                </div>
            );
        }
        return (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40">
                <FileCheck className="h-6 w-6" />
            </div>
        );
    };

    const attachments = Array.isArray(announcement.formatted_attachments)
        ? announcement.formatted_attachments
        : [];

    const pageContent = (
        <div className="site-container py-8 sm:py-12">
            {/* Top Navigation / Breadcrumbs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Link href={route('home')} className="hover:text-indigo-600 transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link
                        href={route('public.announcements.index')}
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Pengumuman Resmi
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md font-medium">
                        {announcement.title}
                    </span>
                </div>

                {!isPublicView && (
                    <div className="flex items-center gap-2">
                        <Link href={route('announcements.index')}>
                            <Button size="sm" variant="outline">
                                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                                Daftar Pengumuman
                            </Button>
                        </Link>
                        <a
                            href={route('public.announcements.show', announcement.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="sm" variant="outline" className="gap-1">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Halaman Publik
                            </Button>
                        </a>
                        <Link href={route('announcements.edit', announcement.id)}>
                            <Button size="sm" variant="primary" className="gap-1">
                                <Edit3 className="h-3.5 w-3.5" />
                                Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="danger" onClick={handleDelete} className="gap-1">
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                        </Button>
                    </div>
                )}
            </div>

            {/* Announcement Card Header */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none mb-10">
                {/* Optional Cover Banner */}
                {announcement.cover_image_url && (
                    <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img
                            src={announcement.cover_image_url}
                            alt={announcement.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    </div>
                )}

                <div className="p-6 sm:p-10 space-y-6">
                    {/* Meta Badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {announcement.is_pinned && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300/80 dark:border-amber-800/60">
                                <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                Disematkan / Penting
                            </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                            <Tag className="h-3 w-3" />
                            {announcement.category}
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            Sasaran: {announcement.target_audience}
                        </span>

                        {announcement.reference_number && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1 text-xs font-mono font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                                No. {announcement.reference_number}
                            </span>
                        )}

                        {!isPublicView && (
                            <span
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                    announcement.status === 'published'
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                }`}
                            >
                                Status: {announcement.status}
                            </span>
                        )}
                    </div>

                    {/* Announcement Title */}
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {announcement.title}
                    </h1>

                    {/* Issuer & Date Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 dark:border-slate-800/80 py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                <div>
                                    <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                                        Penerbit
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {announcement.issuer || 'Pusat Informasi Kampus'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-indigo-500" />
                                <div>
                                    <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                                        Tanggal Publikasi
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {announcement.formatted_published_at}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-indigo-500" />
                                <div>
                                    <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                                        Dilihat
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {announcement.views_count || 0} kali
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Share & Copy Action */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopyUrl}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                        <span>Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="h-3.5 w-3.5" />
                                        <span>Bagikan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Deadline Alert Box (If specified) */}
                    {announcement.expires_at && (
                        <div
                            className={`rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 ${
                                announcement.is_expired
                                    ? 'bg-rose-50/70 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                                    : 'bg-amber-50/70 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                            }`}
                        >
                            <AlertCircle
                                className={`h-5 w-5 shrink-0 mt-0.5 ${
                                    announcement.is_expired ? 'text-rose-500' : 'text-amber-500'
                                }`}
                            />
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                                    {announcement.is_expired
                                        ? 'Batas Waktu Telah Berakhir'
                                        : 'Batas Akhir / Deadline Pengajuan'}
                                </h4>
                                <p className="text-xs sm:text-sm mt-0.5 opacity-90">
                                    {announcement.is_expired
                                        ? 'Pengumuman ini telah melewati masa tenggat waktu pengajuan/pelaksanaan.'
                                        : `Harap perhatikan batas akhir pelaksanaan atau pengumpulan berkas: ${new Date(
                                              announcement.expires_at
                                          ).toLocaleDateString('id-ID', {
                                              weekday: 'long',
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })} WIB.`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: 2 Columns - Summary, Rich Content, and Official Attachments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Ringkasan / Summary Quote Box */}
                    {announcement.summary && (
                        <div className="rounded-2xl border-l-4 border-indigo-600 bg-indigo-50/30 p-5 dark:bg-indigo-950/20 dark:border-indigo-500 text-slate-700 dark:text-slate-300">
                            <p className="text-sm sm:text-base font-medium leading-relaxed italic">
                                &ldquo;{announcement.summary}&rdquo;
                            </p>
                        </div>
                    )}

                    {/* TipTap Full Rich Content */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
                        <div
                            className="prose dark:prose-invert prose-indigo max-w-none text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />
                    </div>

                    {/* SEKSI BERKAS LAMPIRAN RESMI & FILE UPLOAD DOWNLOAD */}
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                    <Paperclip className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        Dokumen &amp; Lampiran Resmi
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Unduh salinan resmi SK, pedoman, atau formulir pendukung pengumuman.
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                {attachments.length} Berkas
                            </span>
                        </div>

                        {attachments.length > 0 ? (
                            <div className="space-y-3 pt-2">
                                {attachments.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-indigo-700/60 dark:hover:bg-slate-800/60"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            {getFileIcon(file.type)}
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                                    {file.name}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    <span className="font-medium uppercase tracking-wider text-[11px] text-slate-600 dark:text-slate-300">
                                                        {file.type}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{file.formatted_size}</span>
                                                    <span>•</span>
                                                    <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                                        <Download className="h-3 w-3" />
                                                        {file.download_count || 0} unduhan
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => handleCopyDownloadUrl(file.index, file.url)}
                                                className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                                title="Salin tautan unduh"
                                            >
                                                {copiedFileIndex === file.index ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </button>

                                            <a
                                                href={route('announcements.download', [
                                                    announcement.slug || announcement.id,
                                                    file.index,
                                                ])}
                                                download
                                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                Unduh Berkas
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                <FileText className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    Tidak ada berkas lampiran terpisah untuk pengumuman ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: 1 Column - Document Specs & Other Announcements */}
                <div className="space-y-6">
                    {/* Spesifikasi Surat & Dokumen */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                            Informasi Dokumen Resmi
                        </h3>

                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-slate-400 block text-[11px]">Nomor Referensi / Surat:</span>
                                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                                    {announcement.reference_number || '-'}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400 block text-[11px]">Kategori:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {announcement.category}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400 block text-[11px]">Sasaran Civitas:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {announcement.target_audience}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400 block text-[11px]">Unit Penerbit:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {announcement.issuer || 'Biro Rektorat & Akademik'}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400 block text-[11px]">Diterbitkan Oleh:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {announcement.user?.name || 'Administrator Portal'}
                                </span>
                            </div>

                            {announcement.expires_at && (
                                <div>
                                    <span className="text-slate-400 block text-[11px]">Batas Waktu (Deadline):</span>
                                    <span
                                        className={`font-semibold ${
                                            announcement.is_expired
                                                ? 'text-rose-600 dark:text-rose-400'
                                                : 'text-amber-600 dark:text-amber-400'
                                        }`}
                                    >
                                        {new Date(announcement.expires_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pengumuman Terbaru Lainnya */}
                    {latestAnnouncements && latestAnnouncements.length > 0 && (
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                                Pengumuman Terkini Lainnya
                            </h3>

                            <div className="space-y-3.5">
                                {latestAnnouncements.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('public.announcements.show', item.slug)}
                                        className="group block rounded-2xl p-3 border border-slate-100 hover:border-indigo-200 bg-slate-50/40 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 transition-all"
                                    >
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                {item.category}
                                            </span>
                                            <span>•</span>
                                            <span>{item.formatted_published_at}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h4>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href={route('public.announcements.index')}
                                className="block text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 pt-2"
                            >
                                Lihat Semua Pengumuman &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (isPublicView) {
        return (
            <PublicLayout>
                <Head title={`${announcement.title} - Pengumuman Resmi Kampus`} />
                {pageContent}
            </PublicLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Pengumuman: ${announcement.title}`} />
            {pageContent}
        </AuthenticatedLayout>
    );
}
