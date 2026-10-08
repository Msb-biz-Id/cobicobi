import { useState } from 'react';
import {
    Calendar,
    Globe,
    Image as ImageIcon,
    Tag,
    FolderKanban,
    RotateCcw,
    Sparkles,
    Eye,
    X,
    Plus,
    Clock,
    User,
    ShieldCheck,
    Link2,
} from 'lucide-react';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Select from '@/Components/UI/Select';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';
import WordPressTagSelector from './WordPressTagSelector';
import QuickCreateCategoryModal from './QuickCreateCategoryModal';

export default function DocumentSidebar({
    data,
    setData,
    errors = {},
    categories = [],
    hashtags = [],
    authors = [],
    editors = [],
    currentUser = {},
    revisions = [],
    onRollback,
    workflowActions,
}) {
    const [activeTab, setActiveTab] = useState('document'); // 'document' | 'seo'
    const [featuredImageModal, setFeaturedImageModal] = useState(false);
    const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
    const [categoriesList, setCategoriesList] = useState(categories);
    const [scheduleMode, setScheduleMode] = useState(Boolean(data.published_at));

    const handleCategoryCreated = (newCat) => {
        setCategoriesList((prev) => [...prev, newCat]);
        setData('category_id', newCat.id);
    };

    const handlePublishDateChange = (val) => {
        setData((prev) => {
            const next = { ...prev, published_at: val };
            if (val) {
                const targetDate = new Date(val);
                if (targetDate > new Date()) {
                    next.status = 'scheduled';
                }
            }
            return next;
        });
    };

    return (
        <div className="flex flex-col text-xs">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('document')}
                    className={`flex-1 py-2 font-semibold text-center rounded-lg transition-colors ${
                        activeTab === 'document'
                            ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-white'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                >
                    Document
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    className={`flex-1 py-2 font-semibold text-center rounded-lg transition-colors ${
                        activeTab === 'seo'
                            ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-white'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                >
                    SEO & Social
                </button>
            </div>

            <div className="p-5 space-y-6">
                {activeTab === 'document' ? (
                    <>
                        {/* Status & Workflow Panel */}
                        <div className="space-y-3.5 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                Status & Visibility
                            </h4>
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                <span>Current Status</span>
                                <Badge
                                    variant={
                                        data.status === 'published'
                                            ? 'success'
                                            : data.status === 'scheduled'
                                            ? 'purple'
                                            : data.status === 'approved'
                                            ? 'purple'
                                            : data.status === 'review'
                                            ? 'info'
                                            : 'neutral'
                                    }
                                >
                                    {(data.status || 'draft').toUpperCase()}
                                </Badge>
                            </div>

                            {/* WordPress Content Scheduling Box */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                        Jadwal Terbit
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (scheduleMode) {
                                                setScheduleMode(false);
                                                setData('published_at', '');
                                                if (data.status === 'scheduled') setData('status', 'draft');
                                            } else {
                                                setScheduleMode(true);
                                                const tomorrow = new Date(Date.now() + 86400000).toISOString().substring(0, 16);
                                                handlePublishDateChange(tomorrow);
                                            }
                                        }}
                                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                    >
                                        {scheduleMode ? 'Ubah ke Segera' : 'Atur Jadwal'}
                                    </button>
                                </div>

                                {scheduleMode ? (
                                    <div className="space-y-1.5 pt-1">
                                        <input
                                            type="datetime-local"
                                            value={data.published_at ? data.published_at.substring(0, 16) : ''}
                                            onChange={(e) => handlePublishDateChange(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                        <p className="text-[10px] text-slate-400">
                                            Artikel akan tayang publik secara otomatis pada waktu ini.
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {data.status === 'published' ? 'Sudah diterbitkan' : 'Akan terbit langsung saat tombol Publish ditekan.'}
                                    </p>
                                )}
                            </div>

                            {workflowActions && <div className="pt-2">{workflowActions}</div>}
                        </div>

                        {/* Permalink / Slug */}
                        <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                Permalink
                            </h4>
                            <Input
                                label="URL Slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                error={errors.slug}
                                helperText={`Live URL: /posts/${data.slug || 'your-slug'}`}
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-2.5 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                Featured Image
                            </h4>
                            {data.thumbnail_url || data.thumbnail ? (
                                <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                    <img
                                        src={
                                            data.thumbnail_url ||
                                            (typeof data.thumbnail === 'string'
                                                ? data.thumbnail
                                                : URL.createObjectURL(data.thumbnail))
                                        }
                                        alt="Featured preview"
                                        className="h-40 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="xs"
                                            variant="secondary"
                                            onClick={() => setFeaturedImageModal(true)}
                                        >
                                            Replace
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="danger"
                                            onClick={() => {
                                                setData('thumbnail', null);
                                                setData('thumbnail_url', null);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setFeaturedImageModal(true)}
                                    className="flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700 transition-colors"
                                >
                                    <ImageIcon className="h-6 w-6 text-slate-400 mb-1" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        Set Featured Image
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                        Choose or upload from media library
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Category with Quick Create Dialog */}
                        <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                    Category
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => setCreateCategoryModalOpen(true)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                >
                                    <Plus className="h-3 w-3" />
                                    Kategori Baru
                                </button>
                            </div>
                            <Select
                                value={data.category_id || ''}
                                onChange={(e) => setData('category_id', e.target.value)}
                                options={categoriesList.map((c) => ({ value: c.id, label: c.name }))}
                                placeholder="Choose category"
                                error={errors.category_id}
                            />
                        </div>

                        {/* WordPress-Style Tags & Hashtags */}
                        <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
                            <WordPressTagSelector
                                allTags={hashtags}
                                selectedTagIds={data.hashtag_ids || []}
                                selectedNewTags={data.new_hashtags || []}
                                onChange={({ hashtag_ids, new_hashtags }) => {
                                    setData('hashtag_ids', hashtag_ids);
                                    setData('new_hashtags', new_hashtags);
                                }}
                            />
                        </div>

                        {/* Atribusi Redaksi: Penulis, Editor & Sumber */}
                        <div className="space-y-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-indigo-500" />
                                Redaksi & Sumber
                            </h4>

                            {/* Penulis (Author) */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Penulis (Author)
                                </label>
                                {currentUser?.canAssignAuthor ? (
                                    <Select
                                        value={data.user_id || ''}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        options={[
                                            { value: '', label: '-- Pilih Akun Penulis --' },
                                            ...authors.map((u) => ({
                                                value: u.id,
                                                label: `${u.name} (${u.role})`,
                                            })),
                                        ]}
                                        placeholder="Pilih Penulis"
                                        error={errors.user_id}
                                    />
                                ) : (
                                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/40">
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                                            {authors.find((u) => String(u.id) === String(data.user_id))?.name || currentUser?.name || 'Akun Anda'}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            Terkunci sesuai akun login Anda (Role: {currentUser?.role || 'Author'})
                                        </div>
                                    </div>
                                )}
                                <Input
                                    label="Nama Penulis Kustom (Byline / Gelar)"
                                    placeholder="Contoh: Dr. Budi Santoso, M.Kom / Tim Humas"
                                    value={data.author_name || ''}
                                    onChange={(e) => setData('author_name', e.target.value)}
                                    error={errors.author_name}
                                    helperText="Opsional. Jika diisi, nama ini yang akan tampil di halaman publik."
                                />
                            </div>

                            {/* Editor (Penyunting) */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                    <span>Editor (Penyunting)</span>
                                    <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> Tim Redaksi
                                    </span>
                                </label>
                                {currentUser?.canAssignEditor ? (
                                    <>
                                        <Select
                                            value={data.editor_id || ''}
                                            onChange={(e) => setData('editor_id', e.target.value)}
                                            options={[
                                                { value: '', label: '-- Belum Ditugaskan / Otomatis saat Review --' },
                                                ...editors.map((ed) => ({
                                                    value: ed.id,
                                                    label: `${ed.name} (${ed.role})`,
                                                })),
                                            ]}
                                            placeholder="Pilih Editor"
                                            error={errors.editor_id}
                                        />
                                        <Input
                                            placeholder="Nama Editor Kustom (Opsional)"
                                            value={data.editor_name || ''}
                                            onChange={(e) => setData('editor_name', e.target.value)}
                                            error={errors.editor_name}
                                        />
                                    </>
                                ) : (
                                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/40 text-[11px] text-slate-500 dark:text-slate-400">
                                        {data.editor_name || editors.find((e) => String(e.id) === String(data.editor_id))?.name || 'Akan ditugaskan otomatis oleh tim redaksi saat review/approval.'}
                                    </div>
                                )}
                            </div>

                            {/* Sumber Berita / Rujukan */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Sumber Berita & Rujukan
                                </label>
                                <Input
                                    placeholder="Nama Sumber (Contoh: Humas Kampus / Antara News)"
                                    value={data.source || ''}
                                    onChange={(e) => setData('source', e.target.value)}
                                    error={errors.source}
                                />
                                <Input
                                    placeholder="URL Tautan Sumber (https://...)"
                                    value={data.source_url || ''}
                                    onChange={(e) => setData('source_url', e.target.value)}
                                    error={errors.source_url}
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                Excerpt
                            </h4>
                            <Textarea
                                rows={3}
                                placeholder="Write a short teaser or summary..."
                                value={data.excerpt || ''}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                error={errors.excerpt}
                            />
                        </div>

                        {/* Revision History */}
                        {revisions && revisions.length > 0 && (
                            <div className="space-y-2.5">
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px] flex items-center justify-between">
                                    <span>Version History</span>
                                    <span className="text-[10px] text-slate-400 font-normal">
                                        {revisions.length} versions
                                    </span>
                                </h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {revisions.map((rev) => (
                                        <div
                                            key={rev.id}
                                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40 text-[11px]"
                                        >
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    v{rev.version} {rev.note && `• ${rev.note}`}
                                                </div>
                                                <div className="text-slate-400">{rev.created_at}</div>
                                            </div>
                                            {onRollback && (
                                                <Button
                                                    size="xs"
                                                    variant="secondary"
                                                    onClick={() => onRollback(rev.id)}
                                                    icon={RotateCcw}
                                                >
                                                    Rollback
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* SEO Tab */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                Search Engine Preview
                            </h4>
                            {/* Google Preview Snippet */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs">
                                <div className="text-[11px] text-slate-400 truncate">
                                    example.com &gt; posts &gt; {data.slug || 'your-slug'}
                                </div>
                                <div className="font-semibold text-indigo-600 text-sm mt-0.5 truncate dark:text-indigo-400">
                                    {data.meta_title || data.title || 'Page Title'}
                                </div>
                                <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-1 line-clamp-2">
                                    {data.meta_description ||
                                        data.excerpt ||
                                        'Please provide a meta description for search engine listings...'}
                                </div>
                            </div>

                            <Input
                                label="Meta Title"
                                placeholder="Custom SEO title..."
                                value={data.meta_title || ''}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                helperText="Leave empty to use document title"
                            />

                            <Textarea
                                label="Meta Description"
                                rows={3}
                                placeholder="Summary for Google and social previews..."
                                value={data.meta_description || ''}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                error={errors.meta_description}
                            />

                            <Input
                                label="Meta Keywords"
                                placeholder="keyword1, keyword2, keyword3..."
                                value={data.meta_keywords || ''}
                                onChange={(e) => setData('meta_keywords', e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>

            <MediaPickerModal
                isOpen={featuredImageModal}
                onClose={() => setFeaturedImageModal(false)}
                onSelect={(media) => {
                    setData('thumbnail_url', media.image_url);
                    setData('thumbnail', media.image_url);
                }}
                title="Select Featured Image"
                confirmLabel="Set as Featured Image"
            />

            <QuickCreateCategoryModal
                isOpen={createCategoryModalOpen}
                onClose={() => setCreateCategoryModalOpen(false)}
                onCreated={handleCategoryCreated}
            />
        </div>
    );
}
