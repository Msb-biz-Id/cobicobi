import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import Button from '@/Components/UI/Button';

export default function MediaUploader({ onUploaded, galleryId }) {
    const [dragOver, setDragOver] = useState(false);
    const [uploads, setUploads] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);

        const newUploads = Array.from(files).map((f) => ({
            id: Math.random().toString(36).substring(7),
            file: f,
            name: f.name,
            size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
            status: 'uploading',
            progress: 0,
        }));

        setUploads((prev) => [...newUploads, ...prev]);

        for (const item of newUploads) {
            const formData = new FormData();
            formData.append('image', item.file);
            if (galleryId) formData.append('gallery_id', galleryId);

            try {
                const res = await axios.post(route('media.upload'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (evt) => {
                        const pct = Math.round((evt.loaded * 100) / evt.total);
                        setUploads((prev) =>
                            prev.map((u) => (u.id === item.id ? { ...u, progress: pct } : u)),
                        );
                    },
                });

                setUploads((prev) =>
                    prev.map((u) => (u.id === item.id ? { ...u, status: 'done', media: res.data.media } : u)),
                );

                if (onUploaded) onUploaded(res.data.media);
            } catch (err) {
                setUploads((prev) =>
                    prev.map((u) =>
                        u.id === item.id
                            ? { ...u, status: 'error', error: err.response?.data?.message || 'Upload failed' }
                            : u,
                    ),
                );
            }
        }

        setIsUploading(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                    dragOver
                        ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
                    <UploadCloud className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Drop your files here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Supports JPG, PNG, WEBP, GIF, SVG up to 10MB
                </p>
                <div className="mt-4">
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        Select Files
                    </Button>
                </div>
            </div>

            {uploads.length > 0 && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {uploads.map((u) => (
                        <div
                            key={u.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="flex items-center gap-2.5 truncate">
                                {u.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
                                {u.status === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                {u.status === 'error' && <AlertCircle className="h-4 w-4 text-rose-500" />}
                                <div className="truncate">
                                    <div className="font-medium text-slate-900 truncate dark:text-white">{u.name}</div>
                                    <div className="text-[11px] text-slate-400">{u.size}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                {u.status === 'uploading' && <span className="font-semibold text-indigo-600">{u.progress}%</span>}
                                {u.status === 'done' && <span className="text-emerald-600 font-medium">Uploaded</span>}
                                {u.status === 'error' && <span className="text-rose-500 font-medium">{u.error}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
