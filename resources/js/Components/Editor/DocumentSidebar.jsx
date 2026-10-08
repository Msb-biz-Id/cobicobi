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
} from 'lucide-react';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Select from '@/Components/UI/Select';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';

export default function DocumentSidebar({
    data,
    setData,
    errors = {},
    categories = [],
    hashtags = [],
    revisions = [],
    onRollback,
    workflowActions,
}) {
    const [activeTab, setActiveTab] = useState('document'); // 'document' | 'seo'
    const [featuredImageModal, setFeaturedImageModal] = useState(false);

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
                        <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                Status & Visibility
                            </h4>
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                <span>Current Status</span>
                                <Badge
                                    variant={
                                        data.status === 'published'
                                            ? 'success'
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

                        {/* Category */}
                        {categories.length > 0 && (
                            <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                    Category
                                </h4>
                                <Select
                                    value={data.category_id || ''}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                                    placeholder="Choose category"
                                    error={errors.category_id}
                                />
                            </div>
                        )}

                        {/* Hashtags / Tags */}
                        {hashtags.length > 0 && (
                            <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[11px]">
                                    Tags & Hashtags
                                </h4>
                                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                                    {hashtags.map((tag) => {
                                        const selected = (data.hashtag_ids || []).includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => {
                                                    const cur = data.hashtag_ids || [];
                                                    if (selected) {
                                                        setData(
                                                            'hashtag_ids',
                                                            cur.filter((id) => id !== tag.id),
                                                        );
                                                    } else {
                                                        setData('hashtag_ids', [...cur, tag.id]);
                                                    }
                                                }}
                                                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                                    selected
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                #{tag.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
        </div>
    );
}
