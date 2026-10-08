import { useState, useEffect } from 'react';
import { Copy, Trash2, Check, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';

export default function MediaInspector({ media, onUpdated, onDeleted }) {
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        alt_text: '',
        caption: '',
    });

    useEffect(() => {
        if (media) {
            setFormData({
                title: media.title || '',
                alt_text: media.alt_text || '',
                caption: media.caption || '',
            });
        }
    }, [media]);

    if (!media) {
        return (
            <div className="flex h-full items-center justify-center p-6 text-center text-xs text-slate-400">
                Select an image to view details
            </div>
        );
    }

    const copyUrl = () => {
        if (!media.image_url) return;
        navigator.clipboard.writeText(media.image_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(route('media.update', media.id), formData);
            if (onUpdated) onUpdated({ ...media, ...formData });
        } catch (err) {
            console.error('Failed to update media', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this media file?')) return;
        setDeleting(true);
        try {
            await axios.delete(route('media.destroy', media.id));
            if (onDeleted) onDeleted(media.id);
        } catch (err) {
            console.error('Failed to delete media', err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex h-full flex-col overflow-y-auto p-4 text-xs space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center">
                <img
                    src={media.image_url}
                    alt={media.alt_text || media.title}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            <div className="space-y-1 text-slate-500 dark:text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="font-semibold text-slate-900 truncate dark:text-white">
                    {media.file_name || media.title}
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                    {media.file_size && <span>{media.file_size}</span>}
                    <span>{media.created_at}</span>
                </div>
                <div className="pt-1.5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={copyUrl}
                        className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied URL!' : 'Copy URL'}
                    </button>
                    <span>•</span>
                    <a
                        href={media.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <ExternalLink className="h-3 w-3" />
                        View full
                    </a>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
                <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Input
                    label="Alt Text"
                    helperText="Alternative text for screen readers & SEO"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                />
                <Textarea
                    label="Caption"
                    rows={2}
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                />
                <div className="flex items-center justify-between pt-2">
                    <Button type="submit" size="xs" variant="primary" loading={saving}>
                        Save Details
                    </Button>
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}
