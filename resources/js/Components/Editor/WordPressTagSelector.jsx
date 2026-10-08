import { useState, useMemo, useRef } from 'react';
import { Tag as TagIcon, X, Plus, Sparkles, Hash } from 'lucide-react';
import Badge from '@/Components/UI/Badge';

export default function WordPressTagSelector({
    allTags = [],
    selectedTagIds = [],
    selectedNewTags = [],
    onChange, // ({ hashtag_ids, new_hashtags }) => void
    label = 'Tags & Hashtags',
    helperText = 'Ketik nama tag lalu tekan Enter atau koma untuk menambahkan.',
}) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    // Map existing tags for easy lookup
    const tagMap = useMemo(() => {
        const map = new Map();
        allTags.forEach((t) => map.set(t.id, t));
        return map;
    }, [allTags]);

    // Selected existing tag objects
    const selectedExisting = useMemo(() => {
        return (selectedTagIds || [])
            .map((id) => tagMap.get(id))
            .filter(Boolean);
    }, [selectedTagIds, tagMap]);

    // Filter suggestions based on input
    const suggestions = useMemo(() => {
        const query = inputValue.trim().toLowerCase().replace(/^#/, '');
        if (!query) return [];
        return allTags.filter((t) => {
            const matches = t.name.toLowerCase().includes(query) || (t.slug && t.slug.includes(query));
            const alreadySelected = (selectedTagIds || []).includes(t.id);
            return matches && !alreadySelected;
        }).slice(0, 8);
    }, [inputValue, allTags, selectedTagIds]);

    // Top / Popular tags for quick click
    const popularTags = useMemo(() => {
        return allTags.slice(0, 10);
    }, [allTags]);

    const addTagByName = (rawName) => {
        const clean = rawName.trim().replace(/^#/, '').trim();
        if (!clean) return;

        // Check if tag already exists in allTags
        const existing = allTags.find(
            (t) => t.name.toLowerCase() === clean.toLowerCase() || t.slug === clean.toLowerCase()
        );

        if (existing) {
            if (!selectedTagIds.includes(existing.id)) {
                onChange({
                    hashtag_ids: [...selectedTagIds, existing.id],
                    new_hashtags: selectedNewTags,
                });
            }
        } else {
            // New tag
            if (!selectedNewTags.includes(clean)) {
                onChange({
                    hashtag_ids: selectedTagIds,
                    new_hashtags: [...selectedNewTags, clean],
                });
            }
        }

        setInputValue('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTagByName(inputValue);
        } else if (e.key === 'Backspace' && !inputValue) {
            // Remove last tag if input is empty
            if (selectedNewTags.length > 0) {
                removeNewTag(selectedNewTags[selectedNewTags.length - 1]);
            } else if (selectedTagIds.length > 0) {
                removeExistingTag(selectedTagIds[selectedTagIds.length - 1]);
            }
        }
    };

    const removeExistingTag = (tagId) => {
        onChange({
            hashtag_ids: selectedTagIds.filter((id) => id !== tagId),
            new_hashtags: selectedNewTags,
        });
    };

    const removeNewTag = (tagName) => {
        onChange({
            hashtag_ids: selectedTagIds,
            new_hashtags: selectedNewTags.filter((t) => t !== tagName),
        });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <TagIcon className="h-3.5 w-3.5 text-indigo-500" />
                    {label}
                </label>
                {(selectedTagIds.length > 0 || selectedNewTags.length > 0) && (
                    <span className="text-[10px] text-slate-400">
                        {selectedTagIds.length + selectedNewTags.length} dipilih
                    </span>
                )}
            </div>

            {/* Selected Tag Badges / Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
                {selectedExisting.map((tag) => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-1 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs"
                    >
                        <span>#{tag.name}</span>
                        <button
                            type="button"
                            onClick={() => removeExistingTag(tag.id)}
                            className="text-indigo-400 hover:text-rose-500 transition-colors ml-0.5"
                            title="Hapus Tag"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}

                {selectedNewTags.map((name) => (
                    <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs"
                    >
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>#{name}</span>
                        <span className="text-[9px] font-normal text-emerald-500">(baru)</span>
                        <button
                            type="button"
                            onClick={() => removeNewTag(name)}
                            className="text-emerald-400 hover:text-rose-500 transition-colors ml-0.5"
                            title="Hapus Tag Baru"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}

                {selectedTagIds.length === 0 && selectedNewTags.length === 0 && (
                    <span className="text-xs text-slate-400 italic self-center px-1">
                        Belum ada tag dipilih...
                    </span>
                )}
            </div>

            {/* Input with Autocomplete Dropdown */}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ketik nama tag lalu Enter..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => addTagByName(inputValue)}
                        disabled={!inputValue.trim()}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah
                    </button>
                </div>

                {/* Autocomplete suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 max-h-48 overflow-y-auto">
                        <div className="p-1">
                            {suggestions.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        addTagByName(tag.name);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                                >
                                    <span className="font-semibold">#{tag.name}</span>
                                    <span className="text-[10px] text-slate-400">Pilih</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {helperText && (
                <p className="text-[10px] text-slate-400">
                    {helperText}
                </p>
            )}

            {/* Most Used Tags / Tag Cloud ala WordPress */}
            {popularTags.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Pilih dari tag populer:
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {popularTags.map((tag) => {
                            const isSelected = selectedTagIds.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => {
                                        if (isSelected) {
                                            removeExistingTag(tag.id);
                                        } else {
                                            onChange({
                                                hashtag_ids: [...selectedTagIds, tag.id],
                                                new_hashtags: selectedNewTags,
                                            });
                                        }
                                    }}
                                    className={`rounded-lg px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                        isSelected
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    #{tag.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
