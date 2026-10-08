import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Save,
    Megaphone,
    FileText,
    UploadCloud,
    Trash2,
    Pin,
    Calendar,
    Users,
    Eye,
    Plus,
    X,
    Image as ImageIcon,
    AlertCircle,
} from 'lucide-react';
import Button from '@/Components/UI/Button';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';

export default function Edit({ announcement, categories = [], audiences = [] }) {
    const isEdit = Boolean(announcement?.id);

    const { data, setData, post, processing, errors } = useForm({
        title: announcement?.title || '',
        slug: announcement?.slug || '',
        reference_number: announcement?.reference_number || '',
        category: announcement?.category || categories[0] || 'Akademik',
        target_audience: announcement?.target_audience || audiences[0] || 'Semua Civitas',
        issuer: announcement?.issuer || 'Biro Administrasi Akademik & Kemahasiswaan (BAAK)',
        status: announcement?.status || 'published',
        is_pinned: Boolean(announcement?.is_pinned),
        cover_image_path: announcement?.cover_image_path || '',
        summary: announcement?.summary || '',
        content: announcement?.content || '',
        published_at: announcement?.published_at ? announcement.published_at.substring(0, 16) : '',
        expires_at: announcement?.expires_at ? announcement.expires_at.substring(0, 16) : '',
        attachments: Array.isArray(announcement?.attachments) ? announcement.attachments : [],
        new_files: [],
    });

    const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
    const [selectedNewFileNames, setSelectedNewFileNames] = useState([]);

    const handleTitleChange = (val) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setData('new_files', files);
        setSelectedNewFileNames(files.map((f) => ({ name: f.name, size: formatBytes(f.size) })));
    };

    const removeExistingAttachment = (index) => {
        setData('attachments', data.attachments.filter((_, idx) => idx !== index));
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            router.post(route('announcements.update', announcement.id), {
                ...data,
                _method: 'PUT',
            }, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route('announcements.store'), {
                forceFormData: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEdit ? `Edit Pengumuman: ${data.title}` : 'Buat Pengumuman Kampus Baru'} />

            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Header Action Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md py-3 dark:bg-[#090d16]/90 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('announcements.index')}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {isEdit ? 'Edit Pengumuman Kampus' : 'Buat Pengumuman Resmi Baru'}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Publikasikan edaran, pedoman beasiswa, jadwal akademik, dan lampiran berkas PDF.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEdit && (
                            <Link
                                href={route('announcements.show', announcement.id)}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                            </Link>
                        )}
                        <Button type="submit" size="sm" variant="primary" disabled={processing} className="gap-1.5">
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Perbarui Pengumuman' : 'Terbitkan Pengumuman'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Core Announcement Content (2 cols) */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Title & Metadata */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Judul Pengumuman Resmi *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Contoh: Pengumuman Pembukaan Pendaftaran Beasiswa Bank Indonesia 2026"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nomor Surat / Referensi Resmi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.reference_number}
                                        onChange={(e) => setData('reference_number', e.target.value)}
                                        placeholder="Contoh: B/1042/UN4.1/PK.02/2026"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Unit Kerja / Penerbit (Issuer)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.issuer}
                                        onChange={(e) => setData('issuer', e.target.value)}
                                        placeholder="Contoh: BAAK / Wakil Rektor I Bidang Akademik"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Ringkasan Singkat (Lead / Summary)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.summary}
                                    onChange={(e) => setData('summary', e.target.value)}
                                    placeholder="Tuliskan rangkuman pokok penting pengumuman yang mudah dipahami cepat..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Rich Text Editor for Content */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Isi Detail Surat / Dokumen Pengumuman (TipTap Editor)
                            </label>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <TipTapEditor
                                    content={data.content}
                                    onChange={(content) => setData('content', content)}
                                    placeholder="Ketik rincian instruksi, poin-poin persyaratan, prosedur berkas, atau tata tertib..."
                                />
                            </div>
                        </div>

                        {/* File Upload & Attachments Management */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-indigo-600" />
                                        Lampiran Berkas &amp; Dokumen Unduhan
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Unggah SK Rektor, panduan, atau formulir (PDF, Word, Excel, ZIP maks. 500KB).
                                    </p>
                                </div>
                            </div>

                            {/* Existing Saved Attachments */}
                            {data.attachments && data.attachments.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                        Berkas yang Tersimpan:
                                    </span>
                                    <div className="space-y-2">
                                        {data.attachments.map((att, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                            >
                                                <div className="flex items-center gap-3 truncate">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <span className="font-semibold text-slate-900 dark:text-white text-xs block truncate">
                                                            {att.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {formatBytes(att.size)} • {att.download_count || 0} unduhan
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingAttachment(idx)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                                                    title="Hapus Lampiran"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dropzone for New Files */}
                            <div className="space-y-2">
                                <label className="flex aspect-[21/6] sm:aspect-[24/5] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/90 bg-slate-50/50 hover:border-indigo-500 hover:bg-indigo-50/20 transition-all dark:border-slate-800 dark:bg-slate-900/40">
                                    <div className="flex flex-col items-center justify-center p-4 text-center">
                                        <UploadCloud className="h-8 w-8 text-indigo-500 mb-1" />
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Klik untuk Memilih File atau Drag &amp; Drop
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            Format: PDF, DOCX, XLSX, PPTX, ZIP (Maks. 500KB per berkas)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>

                                {/* List of Selected New Files */}
                                {selectedNewFileNames.length > 0 && (
                                    <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/30 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/20 space-y-1.5">
                                        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 block">
                                            File baru siap diunggah ({selectedNewFileNames.length}):
                                        </span>
                                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                            {selectedNewFileNames.map((f, i) => (
                                                <li key={i} className="flex items-center justify-between">
                                                    <span className="truncate max-w-xs">• {f.name}</span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">{f.size}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Target Audience (1 col) */}
                    <div className="space-y-6">
                        {/* Status & Pin Settings */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Pengaturan Publikasi
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    <option value="published">Published (Tayang Publik)</option>
                                    <option value="draft">Draft (Arsip)</option>
                                    <option value="archived">Archived (Diarsipkan)</option>
                                </select>
                            </div>

                            {/* Pinned Switch */}
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                        <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                        Sematkan di Atas (Pin)
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                        Tampilkan prioritas di beranda &amp; arsip.
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.is_pinned}
                                    onChange={(e) => setData('is_pinned', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Kategori Pengumuman
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Sasaran Civitas (Audience)
                                </label>
                                <select
                                    value={data.target_audience}
                                    onChange={(e) => setData('target_audience', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                >
                                    {audiences.map((a) => (
                                        <option key={a} value={a}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Banner Cover Image (Opsional) */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Gambar Ilustrasi / Header (Opsional)
                            </h3>

                            {data.cover_image_path ? (
                                <div className="space-y-2">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                                        <img
                                            src={data.cover_image_path}
                                            alt="Cover"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs"
                                            onClick={() => setIsCoverPickerOpen(true)}
                                        >
                                            Ganti
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="danger"
                                            onClick={() => setData('cover_image_path', '')}
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsCoverPickerOpen(true)}
                                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 transition-colors dark:border-slate-800 dark:bg-slate-900/40"
                                >
                                    <ImageIcon className="h-7 w-7 text-slate-400 mb-1" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        Pilih Dari Media Library
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Waktu & Batas Waktu / Deadline */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                Tanggal &amp; Batas Waktu
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Tanggal Terbit
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                    Kosongkan untuk otomatis menggunakan waktu saat diterbitkan.
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Batas Akhir / Deadline (Jika Ada)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                    Batas submit berkas, registrasi, atau pengajuan surat.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isCoverPickerOpen}
                onClose={() => setIsCoverPickerOpen(false)}
                onSelect={(media) => {
                    setData('cover_image_path', media.image_url);
                    setIsCoverPickerOpen(false);
                }}
                title="Pilih Banner Pengumuman dari Media Library"
            />
        </AuthenticatedLayout>
    );
}
