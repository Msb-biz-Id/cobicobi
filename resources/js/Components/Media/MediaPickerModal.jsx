import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Search, Image as ImageIcon, UploadCloud } from 'lucide-react';
import axios from 'axios';
import Button from '@/Components/UI/Button';
import MediaUploader from './MediaUploader';
import MediaGrid from './MediaGrid';
import MediaInspector from './MediaInspector';

export default function MediaPickerModal({
    isOpen = false,
    onClose = () => {},
    onSelect = () => {},
    title = 'Select or Upload Media',
    confirmLabel = 'Select Media',
    multiple = false,
}) {
    const [activeTab, setActiveTab] = useState('library'); // 'upload' | 'library'
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchMedia = async (searchQuery = '') => {
        setLoading(true);
        try {
            const res = await axios.get(route('media.items'), {
                params: { search: searchQuery, per_page: 36 },
                headers: { Accept: 'application/json' },
            });
            const data = res.data.data || res.data;
            setItems(data);
            if (data.length > 0 && !selectedItem) {
                setSelectedItem(data[0]);
            }
        } catch (err) {
            console.error('Error fetching media items', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMedia(search);
        } else {
            setSelectedItems([]);
        }
    }, [isOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchMedia(search);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        if (multiple) {
            setSelectedItems((prev) => {
                const exists = prev.some((i) => i.id === item.id);
                if (exists) {
                    return prev.filter((i) => i.id !== item.id);
                } else {
                    return [...prev, item];
                }
            });
        }
    };

    const handleUploaded = (newMedia) => {
        setItems((prev) => [newMedia, ...prev]);
        setSelectedItem(newMedia);
        if (multiple) {
            setSelectedItems((prev) => [...prev, newMedia]);
        }
        setActiveTab('library');
    };

    const handleConfirm = () => {
        if (multiple) {
            if (selectedItems.length === 0) return;
            onSelect(selectedItems);
        } else {
            if (!selectedItem) return;
            onSelect(selectedItem);
        }
        onClose();
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="flex h-[88vh] w-full max-w-6xl flex-col rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-[#0f172a]">
                            {/* Modal Header & Tabs */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                                <div className="flex items-center gap-6">
                                    <Dialog.Title className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-indigo-600" />
                                        {title}
                                    </Dialog.Title>
                                    <div className="flex rounded-lg bg-slate-100 p-1 text-xs dark:bg-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('upload')}
                                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
                                                activeTab === 'upload'
                                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                            }`}
                                        >
                                            <UploadCloud className="h-3.5 w-3.5" />
                                            Upload Files
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('library')}
                                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
                                                activeTab === 'library'
                                                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                            }`}
                                        >
                                            <ImageIcon className="h-3.5 w-3.5" />
                                            Media Library
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex flex-1 overflow-hidden">
                                {activeTab === 'upload' ? (
                                    <div className="flex-1 p-8 flex items-center justify-center overflow-y-auto">
                                        <div className="w-full max-w-xl">
                                            <MediaUploader onUploaded={handleUploaded} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-1 overflow-hidden">
                                        {/* Library Left: Grid + Search */}
                                        <div className="flex flex-1 flex-col overflow-hidden border-r border-slate-100 dark:border-slate-800">
                                            <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                                                <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search media files..."
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </form>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <MediaGrid
                                                    items={items}
                                                    selectedId={selectedItem?.id}
                                                    selectedIds={selectedItems.map((i) => i.id)}
                                                    multiple={multiple}
                                                    onSelect={handleItemClick}
                                                    loading={loading}
                                                />
                                            </div>
                                        </div>

                                        {/* Library Right: Inspector Sidebar */}
                                        <div className="w-80 shrink-0 bg-slate-50/40 dark:bg-slate-900/30 overflow-y-auto">
                                            <MediaInspector
                                                media={selectedItem}
                                                onUpdated={(upd) => {
                                                    setSelectedItem(upd);
                                                    setItems((prev) => prev.map((i) => (i.id === upd.id ? upd : i)));
                                                }}
                                                onDeleted={(deletedId) => {
                                                    setItems((prev) => prev.filter((i) => i.id !== deletedId));
                                                    setSelectedItems((prev) => prev.filter((i) => i.id !== deletedId));
                                                    setSelectedItem(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                                    {multiple ? (
                                        selectedItems.length > 0 ? (
                                            <span>
                                                Selected: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{selectedItems.length} media item{selectedItems.length > 1 ? 's' : ''}</strong>
                                            </span>
                                        ) : (
                                            'No media selected (click images to select multiple)'
                                        )
                                    ) : selectedItem ? (
                                        <span>
                                            Selected: <strong className="text-slate-800 dark:text-slate-200">{selectedItem.title}</strong>
                                        </span>
                                    ) : (
                                        'No image selected'
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        disabled={multiple ? selectedItems.length === 0 : !selectedItem}
                                        onClick={handleConfirm}
                                    >
                                        {confirmLabel} {multiple && selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                                    </Button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
