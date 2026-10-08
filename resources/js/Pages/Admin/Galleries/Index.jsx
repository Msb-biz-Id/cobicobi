import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import {
    Plus,
    Search,
    Image as ImageIcon,
    Calendar,
    Eye,
    Pencil,
    Trash2,
    Camera,
    ExternalLink,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function GalleryIndex({ galleries, filters, categories }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(
            route('galleries.index'),
            { search, category },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = async (id, title) => {
        const result = await Swal.fire({
            title: 'Hapus Album Galeri?',
            text: `Album "${title}" dan seluruh foto di dalamnya akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (result.isConfirmed) {
            router.delete(route('galleries.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Terhapus',
                        text: 'Album galeri berhasil dihapus.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Galeri & Lensa Kampus" />

            <div className="space-y-6">
                <PageHeader
                    title="Galeri & Lensa Kampus"
                    subtitle="Kelola album dokumentasi kegiatan, wisuda, riset, fasilitas, dan momen kampus"
                    actions={
                        <Link href={route('galleries.create')}>
                            <Button variant="primary" icon={Plus}>
                                Buat Album Baru
                            </Button>
                        </Link>
                    }
                />

                {/* Filter & Pencarian */}
                <div className="surface-card p-4">
                    <form onSubmit={handleFilter} className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Cari album, deskripsi, atau fotografer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                        <div className="w-full md:w-56">
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                options={[
                                    { value: '', label: 'Semua Kategori' },
                                    ...categories.map((c) => ({ value: c, label: c })),
                                ]}
                            />
                        </div>
                        <Button type="submit" variant="secondary" icon={Search}>
                            Filter
                        </Button>
                        {(filters.search || filters.category) && (
                            <Link href={route('galleries.index')}>
                                <Button type="button" variant="outline">
                                    Reset
                                </Button>
                            </Link>
                        )}
                    </form>
                </div>

                {/* Grid Daftar Album */}
                {galleries.data.length === 0 ? (
                    <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <ImageIcon className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                            Belum Ada Album Galeri
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 max-w-sm">
                            Mulai unggah dokumentasi momen wisuda, Dies Natalis, perkuliahan, atau fasilitas kampus.
                        </p>
                        <Link href={route('galleries.create')} className="mt-4">
                            <Button variant="primary" icon={Plus} size="sm">
                                Buat Album Sekarang
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {galleries.data.map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
                            >
                                {/* Thumbnail Cover */}
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    {item.cover_image ? (
                                        <img
                                            src={item.cover_image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <ImageIcon className="h-10 w-10 opacity-40" />
                                        </div>
                                    )}

                                    {/* Badges Over Cover */}
                                    <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
                                        <Badge variant="indigo" size="sm">
                                            {item.category || 'Umum'}
                                        </Badge>
                                        {!item.is_published && (
                                            <Badge variant="neutral" size="sm">
                                                Draf
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                        <Camera className="h-3.5 w-3.5" />
                                        <span>{item.images_count} Foto</span>
                                    </div>
                                </div>

                                {/* Body Card */}
                                <div className="flex flex-1 flex-col p-4">
                                    <h4 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                                        {item.title}
                                    </h4>

                                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        {item.event_date && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(item.event_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            {item.views_count} views
                                        </span>
                                    </div>

                                    {item.photographer && (
                                        <p className="mt-1 text-[11px] text-slate-400 truncate">
                                            Fotografer: {item.photographer}
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                                        <a
                                            href={route('public.galleries.show', item.slug)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Lihat Publik
                                        </a>

                                        <div className="flex items-center gap-1">
                                            <Link href={route('galleries.edit', item.id)}>
                                                <button
                                                    type="button"
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                    title="Edit Album"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id, item.title)}
                                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                title="Hapus Album"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {galleries.links && galleries.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination links={galleries.links} />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
