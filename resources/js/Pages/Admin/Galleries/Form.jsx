import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Textarea from '@/Components/UI/Textarea';
import {
    Save,
    ArrowLeft,
    UploadCloud,
    Image as ImageIcon,
    Trash2,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function GalleryForm({ isEditing, gallery, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: isEditing ? 'put' : 'post',
        title: gallery?.title || '',
        category: gallery?.category || 'Akademik & Perkuliahan',
        description: gallery?.description || '',
        event_date: gallery?.event_date || '',
        photographer: gallery?.photographer || '',
        is_published: gallery?.is_published ?? true,
        cover_image: null,
        // Untuk create
        images: [],
        captions: [],
        // Untuk update
        new_images: [],
        new_captions: [],
        existing_captions: gallery?.images?.reduce((acc, img) => {
            acc[img.id] = img.caption || '';
            return acc;
        }, {}) || {},
        delete_image_ids: [],
    });

    const [coverPreview, setCoverPreview] = useState(gallery?.cover_image || null);
    const [newImagesPreviews, setNewImagesPreviews] = useState([]);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
            Swal.fire({
                icon: 'warning',
                title: 'Ukuran Terlalu Besar',
                text: `Ukuran file cover ${(file.size / 1024).toFixed(1)} KB melebihi batas maksimal 500 KB.`,
            });
            e.target.value = '';
            return;
        }

        setData('cover_image', file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleMultiImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const oversizedFiles = files.filter((f) => f.size > 500 * 1024);
        if (oversizedFiles.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Beberapa File Melebihi 500 KB',
                text: `${oversizedFiles.length} berkas foto melebihi batas 500 KB dan tidak dapat diunggah. Mohon kompres foto terlebih dahulu.`,
            });
            e.target.value = '';
            return;
        }

        if (isEditing) {
            setData((prev) => ({
                ...prev,
                new_images: [...prev.new_images, ...files],
                new_captions: [...prev.new_captions, ...files.map(() => '')],
            }));
        } else {
            setData((prev) => ({
                ...prev,
                images: [...prev.images, ...files],
                captions: [...prev.captions, ...files.map(() => '')],
            }));
        }

        const newPreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(1),
        }));

        setNewImagesPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        setNewImagesPreviews((prev) => prev.filter((_, i) => i !== index));
        if (isEditing) {
            setData((prev) => ({
                ...prev,
                new_images: prev.new_images.filter((_, i) => i !== index),
                new_captions: prev.new_captions.filter((_, i) => i !== index),
            }));
        } else {
            setData((prev) => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index),
                captions: prev.captions.filter((_, i) => i !== index),
            }));
        }
    };

    const handleExistingCaptionChange = (imgId, value) => {
        setData((prev) => ({
            ...prev,
            existing_captions: {
                ...prev.existing_captions,
                [imgId]: value,
            },
        }));
    };

    const markExistingImageForDeletion = (imgId) => {
        setData((prev) => ({
            ...prev,
            delete_image_ids: prev.delete_image_ids.includes(imgId)
                ? prev.delete_image_ids.filter((id) => id !== imgId)
                : [...prev.delete_image_ids, imgId],
        }));
    };

    const handleNewCaptionChange = (index, value) => {
        if (isEditing) {
            setData((prev) => {
                const updated = [...prev.new_captions];
                updated[index] = value;
                return { ...prev, new_captions: updated };
            });
        } else {
            setData((prev) => {
                const updated = [...prev.captions];
                updated[index] = value;
                return { ...prev, captions: updated };
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            post(route('galleries.update', gallery.id), {
                preserveScroll: true,
            });
        } else {
            post(route('galleries.store'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? `Edit Album: ${gallery.title}` : 'Buat Album Galeri Baru'} />

            <div className="space-y-6">
                <PageHeader
                    title={isEditing ? 'Perbarui Album Galeri' : 'Buat Album Galeri Baru'}
                    subtitle="Dokumentasikan kegiatan penting, fasilitas, momen wisuda, atau prestasi kampus"
                    actions={
                        <Link href={route('galleries.index')}>
                            <Button variant="outline" icon={ArrowLeft}>
                                Kembali ke Daftar
                            </Button>
                        </Link>
                    }
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Informasi Dasar Album */}
                    <div className="surface-card p-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                            Informasi Album Galeri
                        </h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Input
                                    label="Judul Album"
                                    placeholder="Contoh: Dokumentasi Wisuda Sarjana & Magister Gelombang II 2026"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                    required
                                />
                            </div>

                            <Select
                                label="Kategori Galeri"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                error={errors.category}
                                options={categories.map((c) => ({ value: c, label: c }))}
                            />

                            <Input
                                label="Tanggal Kegiatan / Acara"
                                type="date"
                                value={data.event_date}
                                onChange={(e) => setData('event_date', e.target.value)}
                                error={errors.event_date}
                            />

                            <Input
                                label="Fotografer / Dokumentasi Oleh (Opsional)"
                                placeholder="Contoh: Tim Humas & Biro Komunikasi Publik"
                                value={data.photographer}
                                onChange={(e) => setData('photographer', e.target.value)}
                                error={errors.photographer}
                            />

                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Publikasikan album ini di portal publik
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <Textarea
                                    label="Deskripsi / Cerita Album (Opsional)"
                                    placeholder="Tuliskan latar belakang kegiatan, jalannya acara, tokoh penting yang hadir, dan pencapaian yang diraih..."
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sampul / Cover Image */}
                    <div className="surface-card p-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Sampul Album (Cover Image)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Batas maksimal ukuran berkas: <strong>500 KB</strong> (Format: JPG, PNG, WEBP)
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                                Maksimal 500 KB
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {coverPreview ? (
                                <div className="relative aspect-[16/10] w-48 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                                    <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            ) : (
                                <div className="flex aspect-[16/10] w-48 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                    <ImageIcon className="h-8 w-8 text-slate-400" />
                                </div>
                            )}

                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="cover_image_input"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={handleCoverChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-indigo-950/40 dark:file:text-indigo-400"
                                />
                                {errors.cover_image && (
                                    <p className="mt-2 text-xs text-rose-600 font-medium">{errors.cover_image}</p>
                                )}
                                <p className="mt-2 text-xs text-slate-400">
                                    Jika dikosongkan, gambar pertama dari koleksi foto album akan otomatis dijadikan sampul.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Foto-Foto yang Sudah Ada (Mode Edit) */}
                    {isEditing && gallery?.images && gallery.images.length > 0 && (
                        <div className="surface-card p-6">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                                Foto yang Sudah Ada ({gallery.images.length} Foto)
                            </h3>
                            <p className="text-xs text-slate-500 mb-4">
                                Anda dapat memperbarui caption keterangan tiap foto atau menandai foto untuk dihapus.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {gallery.images.map((img) => {
                                    const isDeleted = data.delete_image_ids.includes(img.id);
                                    return (
                                        <div
                                            key={img.id}
                                            className={`relative rounded-xl border p-2.5 transition ${
                                                isDeleted
                                                    ? 'border-rose-400 bg-rose-50/50 opacity-60 dark:border-rose-800 dark:bg-rose-950/20'
                                                    : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60'
                                            }`}
                                        >
                                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                                                <img src={img.image_url} alt={img.caption || 'Foto'} className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => markExistingImageForDeletion(img.id)}
                                                    className={`absolute top-2 right-2 rounded-lg p-1.5 shadow-sm transition ${
                                                        isDeleted
                                                            ? 'bg-rose-600 text-white'
                                                            : 'bg-white/80 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-slate-900/80'
                                                    }`}
                                                    title={isDeleted ? 'Batalkan hapus' : 'Tandai hapus'}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Tulis keterangan foto..."
                                                    value={data.existing_captions[img.id] ?? ''}
                                                    onChange={(e) => handleExistingCaptionChange(img.id, e.target.value)}
                                                    disabled={isDeleted}
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Upload Multi-Foto Baru */}
                    <div className="surface-card p-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    {isEditing ? 'Tambah Foto-Foto Baru' : 'Unggah Koleksi Foto Album'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pilih banyak foto sekaligus. Batasan sistem: <strong>Maks. 500 KB per file foto</strong>.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                                Maksimal 500 KB / Foto
                            </span>
                        </div>

                        {/* Dropzone Area */}
                        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800/20">
                            <UploadCloud className="h-10 w-10 text-indigo-500 animate-bounce" />
                            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Klik untuk memilih file foto dokumentasi
                            </p>
                            <p className="text-xs text-slate-400">
                                Mendukung multi-select (JPEG, PNG, WEBP). Maksimal 500 KB per foto.
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={handleMultiImagesChange}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                        </div>

                        {/* Pratinjau Foto Baru */}
                        {newImagesPreviews.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Foto Baru Siap Diunggah ({newImagesPreviews.length} Berkas)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {newImagesPreviews.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                                        >
                                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                                                <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-rose-600 transition"
                                                    title="Hapus foto dari daftar"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                                <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                                    {img.size} KB
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Keterangan foto (opsional)..."
                                                    value={
                                                        isEditing
                                                            ? data.new_captions[idx] || ''
                                                            : data.captions[idx] || ''
                                                    }
                                                    onChange={(e) => handleNewCaptionChange(idx, e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <Link href={route('galleries.index')}>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Save}
                            loading={processing}
                        >
                            {isEditing ? 'Simpan Perubahan Album' : 'Terbitkan Album Galeri'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
