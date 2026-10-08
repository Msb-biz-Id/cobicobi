import { useState } from 'react';
import {
    Monitor,
    Tablet,
    Smartphone,
    ExternalLink,
    X,
    Calendar,
    User,
    Tag,
    Clock,
    Eye,
    MapPin,
    Ticket,
    Sparkles,
} from 'lucide-react';

export default function ContentPreviewModal({
    isOpen,
    onClose,
    title = 'Pratinjau Konten',
    data = {},
    type = 'post', // 'post' | 'event' | 'page' | 'announcement'
    categoryName = '',
    tagNames = [],
    authorName = '',
    editorName = '',
    source = '',
    sourceUrl = '',
    publicUrl = null,
}) {
    const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

    if (!isOpen) return null;

    const viewportWidths = {
        desktop: 'w-full max-w-4xl',
        tablet: 'w-[768px] max-w-full',
        mobile: 'w-[375px] max-w-full',
    };

    const formattedDate = data.published_at
        ? new Date(data.published_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative flex flex-col h-[92vh] w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800">
                {/* Header Controls */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                            {title}
                        </h3>
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 uppercase tracking-wider">
                            {(data.status || 'draft').toUpperCase()}
                        </span>
                    </div>

                    {/* Viewport Switcher */}
                    <div className="flex items-center gap-1 rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800">
                        <button
                            type="button"
                            onClick={() => setViewport('desktop')}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewport === 'desktop'
                                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                            title="Tampilan Desktop"
                        >
                            <Monitor className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Desktop</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewport('tablet')}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewport === 'tablet'
                                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                            title="Tampilan Tablet (768px)"
                        >
                            <Tablet className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Tablet</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewport('mobile')}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewport === 'mobile'
                                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                            title="Tampilan Mobile (375px)"
                        >
                            <Smartphone className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Mobile</span>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {publicUrl && (
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors"
                                title="Buka di tab baru untuk melihat tampilan publik asli"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span className="hidden md:inline">Buka di Tab Baru</span>
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Viewport Canvas Container */}
                <div className="flex-1 overflow-y-auto bg-slate-100/70 p-4 sm:p-6 dark:bg-slate-950/50 flex justify-center">
                    <div
                        className={`${viewportWidths[viewport]} bg-white dark:bg-[#090d16] rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all duration-300 flex flex-col`}
                    >
                        {/* Device Frame Top Bar for mobile/tablet simulation */}
                        {viewport !== 'desktop' && (
                            <div className="h-6 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
                                <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
                            </div>
                        )}

                        <div className="p-6 sm:p-10 space-y-6">
                            {/* Category Badge & Meta */}
                            <div className="flex flex-wrap items-center gap-2">
                                {categoryName && (
                                    <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                                        {categoryName}
                                    </span>
                                )}
                                {type === 'event' && data.category && (
                                    <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                                        {data.category}
                                    </span>
                                )}
                                {type === 'event' && (
                                    <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                        Agenda Kampus
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                                {data.title || 'Judul Konten Belum Ditulis'}
                            </h1>

                            {/* Author & Timestamp Bar */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 py-3 dark:border-slate-800">
                                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                    <User className="h-3.5 w-3.5 text-indigo-500" />
                                    {type === 'event'
                                        ? data.organizer || 'Humas & Redaksi Kampus'
                                        : authorName || data.author_name || data.author?.name || 'Redaksi Kampus'}
                                </span>
                                {editorName && (
                                    <>
                                        <span>•</span>
                                        <span className="font-medium text-slate-600 dark:text-slate-400">
                                            Ed: {editorName}
                                        </span>
                                    </>
                                )}
                                {source && (
                                    <>
                                        <span>•</span>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Sumber: {source}
                                        </span>
                                    </>
                                )}
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                    {formattedDate} WIB
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                                    Pratinjau
                                </span>
                            </div>

                            {/* Event Highlight Cards if event */}
                            {type === 'event' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                                    <div className="space-y-1">
                                        <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-indigo-500" /> Waktu Pelaksanaan
                                        </div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200">
                                            {data.start_date || 'Tanggal belum ditentukan'}
                                            {data.end_date && ` - ${data.end_date}`}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-indigo-500" /> Tempat / Lokasi
                                        </div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200">
                                            {data.venue_name || 'Tempat belum diisi'} ({data.event_type || 'offline'})
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Featured Image */}
                            {(data.thumbnail_url || data.cover_image_path) && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40">
                                    <img
                                        src={data.thumbnail_url || data.cover_image_path}
                                        alt="Cover preview"
                                        className="h-auto max-h-[420px] w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            {(data.excerpt || data.summary) && (
                                <p className="text-sm sm:text-base font-medium italic text-slate-600 dark:text-slate-300 border-l-4 border-indigo-500 pl-4 py-1">
                                    {data.excerpt || data.summary}
                                </p>
                            )}

                            {/* Main Content Body (HTML via TipTap) */}
                            <div
                                className="prose prose-slate max-w-none dark:prose-invert text-base leading-relaxed tiptap-content"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        data.content ||
                                        data.description ||
                                        '<p class="text-slate-400 italic">Konten artikel masih kosong...</p>',
                                }}
                            />

                            {/* Editorial Attribution Card for Posts */}
                            {type === 'post' && (authorName || editorName || source) && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                                        Informasi Redaksi
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                                Penulis
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {authorName || data.author_name || data.author?.name || '-'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                                Editor
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {editorName || 'Redaksi Kampus'}
                                            </span>
                                        </div>
                                        {source && (
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                                    Sumber
                                                </span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {source}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tags Footer */}
                            {tagNames && tagNames.length > 0 && (
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Topik Terkait:
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tagNames.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
