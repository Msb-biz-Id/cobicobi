import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import { FolderTreeItemWrapper, SortableTree } from 'dnd-kit-sortable-tree';
import {
    GripVertical,
    Pencil,
    Plus,
    Save,
    Trash2,
    LayoutGrid,
    Check,
    Layers,
    ChevronDown,
    Building2,
    Library,
    Network,
    Landmark,
    Compass,
    GraduationCap,
    FileText,
    Tag,
    Images,
    Sparkles,
    Link as LinkIcon,
    ArrowRight,
    HelpCircle,
} from 'lucide-react';
import { iconMap, renderDynamicIcon } from '@/Components/Nav/DynamicNavbar';
import Swal from 'sweetalert2';

const availableIcons = [
    { label: 'Tanpa Icon', value: '' },
    { label: 'Home (Beranda)', value: 'Home' },
    { label: 'Building2 (Fakultas)', value: 'Building2' },
    { label: 'Library (Prodi)', value: 'Library' },
    { label: 'GraduationCap (Akademik)', value: 'GraduationCap' },
    { label: 'Network (Unit/Lembaga)', value: 'Network' },
    { label: 'Landmark (Fasilitas)', value: 'Landmark' },
    { label: 'Compass (UKM/Kegiatan)', value: 'Compass' },
    { label: 'Images (Galeri)', value: 'Images' },
    { label: 'Camera (Foto)', value: 'Camera' },
    { label: 'BookCopy (Berita/Warta)', value: 'BookCopy' },
    { label: 'Megaphone (Pengumuman)', value: 'Megaphone' },
    { label: 'Calendar (Agenda/Jadwal)', value: 'Calendar' },
    { label: 'Users (Dosen & Tendik)', value: 'Users' },
    { label: 'Phone (Kontak/Hubungi)', value: 'Phone' },
    { label: 'Sparkles (Keunggulan)', value: 'Sparkles' },
    { label: 'Award (Prestasi)', value: 'Award' },
    { label: 'Tag (Kategori/Topik)', value: 'Tag' },
    { label: 'FileText (Laman Statis)', value: 'FileText' },
    { label: 'Globe (Portal Web)', value: 'Globe' },
];

const defaultMenuData = {
    title: '',
    url: '',
    type: 'standard',
    mega_columns: 3,
    target: '_self',
    icon: '',
    description: '',
    badge: '',
    auto_source: '',
    parent_id: '',
    is_active: true,
};

function flattenForOptions(tree, depth = 0, result = []) {
    tree.forEach((node) => {
        result.push({
            id: node.id,
            label: `${'-- '.repeat(depth)}${node.title}`,
        });
        flattenForOptions(node.children || [], depth + 1, result);
    });

    return result;
}

function serializeTree(tree, parentId = null, result = []) {
    tree.forEach((node, index) => {
        result.push({
            id: Number(node.id),
            parent_id: parentId === null ? null : Number(parentId),
            position: index,
        });

        serializeTree(node.children || [], node.id, result);
    });

    return result;
}

function findMenuById(tree, id) {
    for (const node of tree) {
        if (String(node.id) === String(id)) {
            return node;
        }

        const foundChild = findMenuById(node.children || [], id);
        if (foundChild) {
            return foundChild;
        }
    }

    return null;
}

function collectDescendantIds(node, ids = new Set()) {
    for (const child of node.children || []) {
        ids.add(String(child.id));
        collectDescendantIds(child, ids);
    }

    return ids;
}

export default function MenusIndex({ menuTree, systemSources = {} }) {
    const [menuItems, setMenuItems] = useState(menuTree || []);
    const [editingMenuId, setEditingMenuId] = useState(null);
    const [activeTab, setActiveTab] = useState('presets');
    const [selectedQuickItems, setSelectedQuickItems] = useState([]);
    const [quickAddParentId, setQuickAddParentId] = useState('');

    const menuForm = useForm(defaultMenuData);
    const reorderForm = useForm({ _method: 'put', items: [] });
    const batchForm = useForm({ items: [], parent_id: null });

    useEffect(() => {
        setMenuItems(menuTree || []);
    }, [menuTree]);

    const menuOptions = useMemo(() => flattenForOptions(menuItems), [menuItems]);
    const editingMenu = useMemo(
        () => (editingMenuId ? findMenuById(menuItems, editingMenuId) : null),
        [editingMenuId, menuItems],
    );

    const blockedParentIds = useMemo(() => {
        if (!editingMenu) return new Set();

        const ids = new Set([String(editingMenu.id)]);
        collectDescendantIds(editingMenu, ids);
        return ids;
    }, [editingMenu]);

    const resetForm = () => {
        setEditingMenuId(null);
        menuForm.reset();
        menuForm.setData(defaultMenuData);
        menuForm.clearErrors();
    };

    const startEdit = (id) => {
        const node = findMenuById(menuItems, id);
        if (!node) return;

        setEditingMenuId(node.id);
        menuForm.setData({
            title: node.title ?? '',
            url: node.url ?? '',
            type: node.type ?? 'standard',
            mega_columns: node.mega_columns ?? 3,
            target: node.target ?? '_self',
            icon: node.icon ?? '',
            description: node.description ?? '',
            badge: node.badge ?? '',
            auto_source: node.auto_source ?? '',
            parent_id: node.parent_id ?? '',
            is_active: Boolean(node.is_active),
        });
        menuForm.clearErrors();
    };

    const submitMenu = (event) => {
        event.preventDefault();
        const payload = {
            ...menuForm.data,
            parent_id: menuForm.data.parent_id || null,
        };

        if (editingMenuId) {
            menuForm
                .transform(() => ({ ...payload, _method: 'put' }))
                .post(route('menus.update', editingMenuId), {
                    preserveScroll: true,
                    onSuccess: resetForm,
                });
            return;
        }

        menuForm.transform(() => payload).post(route('menus.store'), {
            preserveScroll: true,
            onSuccess: resetForm,
        });
    };

    const deleteMenu = async (id) => {
        const node = findMenuById(menuItems, id);
        if (!node) return;

        const result = await Swal.fire({
            title: 'Hapus Menu?',
            text: `Menu "${node.title}" beserta sub-menunya akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (!result.isConfirmed) return;

        router.delete(route('menus.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                if (String(editingMenuId) === String(id)) {
                    resetForm();
                }
            },
        });
    };

    const handleItemsChanged = (newItems, reason) => {
        setMenuItems(newItems);

        if (reason.type === 'dropped') {
            Swal.fire({
                icon: 'success',
                title: 'Struktur menu diubah',
                text: 'Klik "Simpan Urutan Menu" untuk menyimpan posisi secara permanen.',
                toast: true,
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
            });
        }
    };

    const saveOrder = () => {
        const items = serializeTree(menuItems);
        if (items.length === 0) return;

        reorderForm
            .transform(() => ({
                _method: 'put',
                items,
            }))
            .post(route('menus.reorder'), {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Urutan hierarki menu berhasil disimpan',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
    };

    // Quick Add Batch items
    const toggleQuickSelect = (item) => {
        setSelectedQuickItems((prev) => {
            const exists = prev.some((x) => x.url === item.url);
            if (exists) {
                return prev.filter((x) => x.url !== item.url);
            }
            return [...prev, item];
        });
    };

    const handleBatchAdd = () => {
        if (selectedQuickItems.length === 0) return;

        batchForm
            .transform(() => ({
                items: selectedQuickItems,
                parent_id: quickAddParentId ? Number(quickAddParentId) : null,
            }))
            .post(route('menus.batch'), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedQuickItems([]);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil Ditambahkan',
                        text: `${selectedQuickItems.length} menu berhasil masuk ke struktur navigasi.`,
                        timer: 1800,
                        showConfirmButton: false,
                    });
                },
            });
    };

    const MenuRow = useMemo(
        () =>
            forwardRef((props, ref) => {
                const item = props.item;
                const active = String(editingMenuId) === String(item.id);
                const isMega = item.type === 'mega_menu';
                const isDropdown = item.type === 'dropdown';

                return (
                    <FolderTreeItemWrapper
                        {...props}
                        ref={ref}
                        manualDrag
                        showDragHandle={false}
                        className="!py-1"
                        contentClassName="!bg-transparent !border-0 !p-0"
                    >
                        <div
                            className={`group flex items-center justify-between rounded-2xl border p-3 transition shadow-sm ${
                                active
                                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/40'
                                    : 'border-slate-200/90 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700'
                            }`}
                            onClick={() => startEdit(item.id)}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    {...props.handleProps}
                                    className="cursor-grab active:cursor-grabbing inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 transition"
                                    title="Tarik untuk memindahkan posisi"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <GripVertical className="h-4 w-4" />
                                </button>

                                {item.icon ? (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                        {renderDynamicIcon(item.icon, 'h-4 w-4')}
                                    </div>
                                ) : (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 text-[10px] font-bold">
                                        Teks
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {item.title}
                                        </p>
                                        {isMega && (
                                            <span className="rounded-md bg-purple-100 px-1.5 py-0.2 text-[9px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                                Mega Menu ({item.mega_columns || 3} Kolom)
                                            </span>
                                        )}
                                        {isDropdown && (
                                            <span className="rounded-md bg-sky-100 px-1.5 py-0.2 text-[9px] font-bold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                                                Dropdown
                                            </span>
                                        )}
                                        {item.badge && (
                                            <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.auto_source && (
                                            <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                                Auto: {item.auto_source}
                                            </span>
                                        )}
                                    </div>
                                    <p className="truncate text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                        {item.url || '#'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!item.is_active && (
                                    <Badge variant="neutral" size="sm">
                                        Nonaktif
                                    </Badge>
                                )}
                                {!!props.childCount && (
                                    <Badge variant="indigo" size="sm">
                                        {props.childCount} sub-menu
                                    </Badge>
                                )}
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        startEdit(item.id);
                                    }}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                    title="Edit Menu"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        deleteMenu(item.id);
                                    }}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                    title="Hapus Menu"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </FolderTreeItemWrapper>
                );
            }),
        [editingMenuId, menuItems],
    );

    // Current tab items for quick add
    const currentTabItems = useMemo(() => {
        if (activeTab === 'presets') return systemSources.presets || [];
        if (activeTab === 'faculties') return systemSources.faculties || [];
        if (activeTab === 'studyPrograms') return systemSources.studyPrograms || [];
        if (activeTab === 'institutionalUnits') return systemSources.institutionalUnits || [];
        if (activeTab === 'facilities') return systemSources.facilities || [];
        if (activeTab === 'extracurriculars') return systemSources.extracurriculars || [];
        if (activeTab === 'pages') return systemSources.pages || [];
        if (activeTab === 'categories') return systemSources.categories || [];
        if (activeTab === 'galleries') return systemSources.galleries || [];
        return [];
    }, [activeTab, systemSources]);

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Menu & Navigasi Portal" />

            <div className="space-y-6">
                <PageHeader
                    title="Menu & Navigasi Kampus"
                    subtitle="Kelola menu biasa, sub-menu bertingkat, dan Mega Menu berkolom dengan drag-and-drop & fitur Quick Add otomatis"
                    actions={
                        <Button
                            type="button"
                            variant="primary"
                            icon={Save}
                            onClick={saveOrder}
                            loading={reorderForm.processing}
                        >
                            Simpan Urutan Menu
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* KOLOM KIRI: QUICK ADD DARI DATA SISTEM (LEBIH CANGGIH DARI WORDPRESS) */}
                    <div className="surface-card p-5 lg:col-span-4 h-fit space-y-4">
                        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-600" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Quick Add Konten Otomatis
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Pilih data dari sistem kampus untuk langsung ditambahkan ke menu dalam 1 klik
                            </p>
                        </div>

                        {/* Kategori Tab Pilihan */}
                        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2 dark:border-slate-800">
                            {[
                                { key: 'presets', label: 'Tautan Utama' },
                                { key: 'faculties', label: 'Fakultas' },
                                { key: 'studyPrograms', label: 'Prodi' },
                                { key: 'institutionalUnits', label: 'Unit' },
                                { key: 'facilities', label: 'Fasilitas' },
                                { key: 'extracurriculars', label: 'UKM' },
                                { key: 'pages', label: 'Laman' },
                                { key: 'galleries', label: 'Galeri' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                        activeTab === tab.key
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* List Checkbox Items */}
                        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-xl p-2.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                            {currentTabItems.length === 0 ? (
                                <p className="text-center py-4 text-xs text-slate-400">
                                    Tidak ada item pada kategori ini
                                </p>
                            ) : (
                                currentTabItems.map((item, idx) => {
                                    const isChecked = selectedQuickItems.some((x) => x.url === item.url);
                                    return (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer text-xs transition"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleQuickSelect(item)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 h-3.5 w-3.5"
                                            />
                                            <span className="font-medium text-slate-800 dark:text-slate-200 flex-1 truncate">
                                                {item.title}
                                            </span>
                                            {item.badge && (
                                                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1 rounded dark:bg-indigo-950/60 dark:text-indigo-400">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </label>
                                    );
                                })
                            )}
                        </div>

                        {/* Pilihan Parent untuk Quick Add */}
                        <div className="space-y-2 pt-2">
                            <Select
                                label="Target Parent Node"
                                value={quickAddParentId}
                                onChange={(e) => setQuickAddParentId(e.target.value)}
                                options={[
                                    { value: '', label: 'Root Menu (Menu Utama Atas)' },
                                    ...menuOptions.map((opt) => ({ value: opt.id, label: opt.label })),
                                ]}
                            />

                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                className="w-full justify-center"
                                icon={Plus}
                                disabled={selectedQuickItems.length === 0}
                                loading={batchForm.processing}
                                onClick={handleBatchAdd}
                            >
                                Tambahkan ({selectedQuickItems.length}) Item Terpilih
                            </Button>
                        </div>
                    </div>

                    {/* KOLOM TENGAH: FORM PROPERTI DETAIL MENU */}
                    <div className="surface-card p-5 lg:col-span-4 h-fit">
                        <div className="border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {editingMenuId ? 'Edit Properti Menu' : 'Tambah Menu Manual'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Sesuaikan link, ikon, badge, dan mode Mega Menu
                                </p>
                            </div>
                            {editingMenuId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-xs text-rose-500 hover:underline font-semibold"
                                >
                                    Batal
                                </button>
                            )}
                        </div>

                        <form onSubmit={submitMenu} className="mt-4 space-y-3.5">
                            <Input
                                label="Judul Menu"
                                placeholder="Contoh: Fakultas, Riset & Inovasi, PMB"
                                value={menuForm.data.title}
                                onChange={(e) => menuForm.setData('title', e.target.value)}
                                error={menuForm.errors.title}
                                required
                            />

                            <Input
                                label="Target URL (Tautan)"
                                placeholder="Contoh: /fakultas, /laman/sejarah, https://..."
                                value={menuForm.data.url}
                                onChange={(e) => menuForm.setData('url', e.target.value)}
                                error={menuForm.errors.url}
                            />

                            {/* Jenis Tampilan Menu */}
                            <Select
                                label="Jenis Tampilan Menu"
                                value={menuForm.data.type}
                                onChange={(e) => menuForm.setData('type', e.target.value)}
                                error={menuForm.errors.type}
                                options={[
                                    { value: 'standard', label: 'Menu Standar (Link Tunggal)' },
                                    { value: 'dropdown', label: 'Dropdown Sub-Menu (Bertingkat)' },
                                    { value: 'mega_menu', label: 'Mega Menu Portal (Drawer Kolom Lebar)' },
                                ]}
                            />

                            {/* Kolom Mega Menu jika tipe mega_menu */}
                            {menuForm.data.type === 'mega_menu' && (
                                <Select
                                    label="Jumlah Kolom Mega Menu"
                                    value={menuForm.data.mega_columns}
                                    onChange={(e) => menuForm.setData('mega_columns', Number(e.target.value))}
                                    options={[
                                        { value: 2, label: '2 Kolom Grid' },
                                        { value: 3, label: '3 Kolom Grid (Standar Ideal)' },
                                        { value: 4, label: '4 Kolom Grid (Portal Luas)' },
                                    ]}
                                />
                            )}

                            {/* Pemilih Icon Visual Dinamis atau Tanpa Icon */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Ikon Menu (Lucide Icons)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                                        {menuForm.data.icon ? (
                                            renderDynamicIcon(menuForm.data.icon, 'h-4 w-4')
                                        ) : (
                                            <span className="text-[10px] text-slate-400 font-bold">None</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Select
                                            value={menuForm.data.icon}
                                            onChange={(e) => menuForm.setData('icon', e.target.value)}
                                            options={availableIcons}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Deskripsi / Subtitle (Opsional)"
                                placeholder="Keterangan singkat yang muncul di Mega Menu / Dropdown"
                                value={menuForm.data.description}
                                onChange={(e) => menuForm.setData('description', e.target.value)}
                                error={menuForm.errors.description}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Badge (Opsional)"
                                    placeholder="Contoh: Baru, S1, Unggul"
                                    value={menuForm.data.badge}
                                    onChange={(e) => menuForm.setData('badge', e.target.value)}
                                    error={menuForm.errors.badge}
                                />

                                <Select
                                    label="Target Tab"
                                    value={menuForm.data.target}
                                    onChange={(e) => menuForm.setData('target', e.target.value)}
                                    options={[
                                        { value: '_self', label: 'Tab Sama (_self)' },
                                        { value: '_blank', label: 'Tab Baru (_blank)' },
                                    ]}
                                />
                            </div>

                            {/* Fitur Super Canggih: Auto-Source Dinamis */}
                            <Select
                                label="Sumber Sub-Menu Otomatis (Live Sync)"
                                value={menuForm.data.auto_source}
                                onChange={(e) => menuForm.setData('auto_source', e.target.value)}
                                options={[
                                    { value: '', label: 'Manual (Tidak Ada Auto-Sync)' },
                                    { value: 'faculties', label: 'Otomatis Tarik Semua Fakultas' },
                                    { value: 'study_programs', label: 'Otomatis Tarik Semua Program Studi' },
                                    { value: 'institutional_units', label: 'Otomatis Tarik Semua Unit Kerja' },
                                    { value: 'facilities', label: 'Otomatis Tarik Semua Fasilitas' },
                                    { value: 'extracurriculars', label: 'Otomatis Tarik Semua UKM' },
                                    { value: 'categories', label: 'Otomatis Tarik Semua Kategori' },
                                ]}
                            />

                            <Select
                                label="Parent Container (Induk)"
                                value={menuForm.data.parent_id || ''}
                                onChange={(e) => menuForm.setData('parent_id', e.target.value)}
                                options={[
                                    { value: '', label: 'Root Menu (Menu Utama Paling Atas)' },
                                    ...menuOptions
                                        .filter((opt) => !blockedParentIds.has(String(opt.id)))
                                        .map((opt) => ({ value: opt.id, label: opt.label })),
                                ]}
                            />

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="menu_is_active"
                                    checked={menuForm.data.is_active}
                                    onChange={(e) => menuForm.setData('is_active', e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                                />
                                <label htmlFor="menu_is_active" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    Tampilkan di navigasi publik
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                {editingMenuId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={resetForm}
                                    >
                                        Batal
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    loading={menuForm.processing}
                                >
                                    {editingMenuId ? 'Simpan Perubahan' : 'Tambahkan Menu'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* KOLOM KANAN: TREE HIERARKI DRAG-AND-DROP */}
                    <div className="surface-card p-5 lg:col-span-4">
                        <div className="border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Hierarki Struktur Menu
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Geser vertikal untuk urutan, geser horizontal untuk sub-level
                                </p>
                            </div>
                            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg">
                                {menuItems.length} Node
                            </span>
                        </div>

                        <div className="mt-4 min-h-[350px]">
                            {menuItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                                    <Layers className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-xs">Belum ada struktur menu</p>
                                </div>
                            ) : (
                                <SortableTree
                                    items={menuItems}
                                    onItemsChanged={handleItemsChanged}
                                    TreeItemComponent={MenuRow}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
