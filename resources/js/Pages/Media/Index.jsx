import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import MediaGrid from '@/Components/Media/MediaGrid';
import MediaInspector from '@/Components/Media/MediaInspector';
import MediaUploader from '@/Components/Media/MediaUploader';
import Pagination from '@/Components/UI/Pagination';
import { UploadCloud, Image as ImageIcon, Search, Filter } from 'lucide-react';

export default function MediaIndex({ media, filters = {}, stats = {} }) {
    const [activeTab, setActiveTab] = useState('library');
    const [selectedItem, setSelectedItem] = useState(media?.data?.[0] || null);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('media.index'),
            { search },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleItemUpdated = (updated) => {
        setSelectedItem(updated);
        router.reload({ only: ['media'] });
    };

    const handleItemDeleted = (deletedId) => {
        setSelectedItem(null);
        router.reload({ only: ['media', 'stats'] });
    };

    const handleUploaded = (newMedia) => {
        setActiveTab('library');
        setSelectedItem(newMedia);
        router.reload({ only: ['media', 'stats'] });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Media Library" />

            <PageHeader
                title="Media Library"
                subtitle="Upload, organize, and inspect all images and assets across your site"
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant={activeTab === 'upload' ? 'primary' : 'outline'}
                            icon={UploadCloud}
                            onClick={() => setActiveTab(activeTab === 'upload' ? 'library' : 'upload')}
                        >
                            {activeTab === 'upload' ? 'Back to Library' : 'Upload Files'}
                        </Button>
                    </div>
                }
            />

            {activeTab === 'upload' ? (
                <div className="surface-card p-8 max-w-2xl mx-auto">
                    <MediaUploader onUploaded={handleUploaded} />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Grid View */}
                    <div className="flex-1 surface-card overflow-hidden flex flex-col min-h-[600px]">
                        {/* Search & Filter Bar */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
                            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search filename, title, alt text..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </form>

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(route('media.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
                                    }}
                                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Images Grid */}
                        <div className="flex-1 p-5 overflow-y-auto">
                            <MediaGrid
                                items={media?.data || []}
                                selectedId={selectedItem?.id}
                                onSelect={(item) => setSelectedItem(item)}
                            />
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                            <Pagination links={media?.links} meta={media} />
                        </div>
                    </div>

                    {/* Right Inspector Sidebar */}
                    <div className="w-full lg:w-80 shrink-0 surface-card overflow-hidden">
                        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 font-semibold text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/40">
                            Attachment Details
                        </div>
                        <div className="h-[600px]">
                            <MediaInspector
                                media={selectedItem}
                                onUpdated={handleItemUpdated}
                                onDeleted={handleItemDeleted}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
