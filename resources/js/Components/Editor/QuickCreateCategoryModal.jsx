import { useState } from 'react';
import Modal from '@/Components/UI/Modal';
import Input from '@/Components/UI/Input';
import Textarea from '@/Components/UI/Textarea';
import Button from '@/Components/UI/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function QuickCreateCategoryModal({ isOpen, onClose, onCreated }) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleNameChange = (val) => {
        setName(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(route('categories.store'), {
                name,
                slug,
                description,
                is_active: true,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Kategori baru berhasil dibuat',
                showConfirmButton: false,
                timer: 2000,
            });

            // If response returned category data or we construct it
            const newCat = response.data?.category || {
                id: response.data?.id,
                name,
                slug,
            };

            if (onCreated) {
                onCreated(newCat);
            }

            setName('');
            setSlug('');
            setDescription('');
            onClose();
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal membuat kategori',
                    text: err.response?.data?.message || 'Terjadi kesalahan sistem.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Kategori Baru" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nama Kategori *"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Riset & Teknologi"
                    error={errors.name?.[0]}
                    required
                    autoFocus
                />

                <Input
                    label="Slug URL *"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="riset-dan-teknologi"
                    error={errors.slug?.[0]}
                    required
                />

                <Textarea
                    label="Deskripsi (Opsional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi singkat seputar kategori ini..."
                    rows={2}
                    error={errors.description?.[0]}
                />

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        loading={loading}
                    >
                        Simpan Kategori
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
