import { CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function MediaGrid({
    items = [],
    selectedId = null,
    selectedIds = [],
    multiple = false,
    onSelect = () => {},
    loading = false,
}) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-1">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60"
                    />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs">No media files found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-1">
            {items.map((item) => {
                const isSelected = multiple
                    ? selectedIds.includes(item.id)
                    : selectedId === item.id;
                const selectionIndex = multiple
                    ? selectedIds.indexOf(item.id) + 1
                    : null;

                return (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-slate-50 transition-all dark:bg-slate-900 ${
                            isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                                : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                        }`}
                    >
                        <img
                            src={item.image_url}
                            alt={item.alt_text || item.title}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div
                            className={`absolute inset-0 transition-opacity ${
                                isSelected
                                    ? 'bg-indigo-600/10'
                                    : 'bg-black/0 group-hover:bg-black/10'
                            }`}
                        />
                        {isSelected && (
                            <div className="absolute top-2 right-2 rounded-full bg-indigo-600 text-white shadow-xs">
                                {multiple ? (
                                    <span className="flex h-5 w-5 items-center justify-center text-[10px] font-bold">
                                        {selectionIndex}
                                    </span>
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 fill-indigo-600 text-white" />
                                )}
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 truncate">
                            {item.title}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
