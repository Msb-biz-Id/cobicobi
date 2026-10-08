import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Badge from '@/Components/UI/Badge';
import EmptyState from '@/Components/UI/EmptyState';
import Pagination from '@/Components/UI/Pagination';
import Modal from '@/Components/UI/Modal';
import { Plus, Search, Edit3, Trash2, FolderKanban, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CategoriesIndex({ categories, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const form = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: true,
    });

    const openCreate = () => {
        setEditingItem(null);
        form.reset();
        setModalOpen(true);
    };

    const openEdit = (cat) => {
        setEditingItem(cat);
        form.setData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            is_active: cat.is_active ?? true,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            form.put(route('categories.update', editingItem.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Kategori berhasil diperbarui',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
        } else {
            form.post(route('categories.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Kategori baru berhasil dibuat',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
        }
    };

    const handleDelete = (cat) => {
        Swal.fire({
            title: 'Hapus Kategori?',
            text: `Yakin ingin menghapus kategori "${cat.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        }).then((res) => {
            if (res.isConfirmed) {
                router.delete(route('categories.destroy', cat.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Kategori telah dihapus.', 'success');
                    },
                });
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('categories.index'),
            { search },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />

            <PageHeader
                title="Categories"
                subtitle="Organize articles and content into clear taxonomic sections"
                actions={
                    <Button size="sm" variant="primary" icon={Plus} onClick={openCreate}>
                        New Category
                    </Button>
                }
            />

            <div className="surface-card overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
                    <form onSubmit={handleSearch} className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                    </form>
                </div>

                {/* Table */}
                {categories?.data?.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            icon={FolderKanban}
                            title="No categories found"
                            description="Create a category to group your editorial content."
                            actionLabel="Add Category"
                            onAction={openCreate}
                            actionIcon={Plus}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                <tr>
                                    <th className="py-3.5 pl-5 pr-3">Name</th>
                                    <th className="py-3.5 px-3">Slug</th>
                                    <th className="py-3.5 px-3">Description</th>
                                    <th className="py-3.5 px-3">Status</th>
                                    <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {categories.data.map((cat) => (
                                    <tr
                                        key={cat.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                                    >
                                        <td className="py-3.5 pl-5 pr-3 font-semibold text-slate-900 dark:text-white text-sm">
                                            {cat.name}
                                        </td>
                                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                                            /{cat.slug}
                                        </td>
                                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                            {cat.description || '-'}
                                        </td>
                                        <td className="py-3.5 px-3">
                                            <Badge variant={cat.is_active ? 'success' : 'neutral'} size="sm">
                                                {cat.is_active ? 'Active' : 'Disabled'}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 pl-3 pr-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(cat)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(cat)}
                                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                    <Pagination links={categories?.links} meta={categories} />
                </div>
            </div>

            {/* Create / Edit Modal */}
            <Modal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingItem ? 'Edit Category' : 'New Category'}
                description="Categories help structure your posts and improve SEO."
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Category Name"
                        value={form.data.name}
                        onChange={(e) => {
                            form.setData('name', e.target.value);
                            if (!editingItem) {
                                form.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }
                        }}
                        error={form.errors.name}
                        required
                    />

                    <Input
                        label="Slug"
                        value={form.data.slug}
                        onChange={(e) => form.setData('slug', e.target.value)}
                        error={form.errors.slug}
                        required
                    />

                    <Textarea
                        label="Description"
                        rows={3}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        error={form.errors.description}
                    />

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="cat_is_active"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                        />
                        <label htmlFor="cat_is_active" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Active category (visible on website)
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" loading={form.processing}>
                            {editingItem ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
