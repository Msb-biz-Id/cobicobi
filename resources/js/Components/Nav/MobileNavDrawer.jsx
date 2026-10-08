import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown, ArrowUpRight, GraduationCap } from 'lucide-react';
import { renderDynamicIcon } from './DynamicNavbar';

export default function MobileNavDrawer({ menus = [], isOpen, onClose }) {
    const [expandedIds, setExpandedIds] = useState(new Set());

    if (!isOpen) return null;

    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="border-b border-slate-200 bg-white/95 px-4 py-5 backdrop-blur-xl dark:border-slate-800 dark:bg-[#070b14]/95 lg:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1.5 max-h-[75vh] overflow-y-auto">
                {menus.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedIds.has(item.id);

                    if (!hasChildren) {
                        return (
                            <Link
                                key={item.id}
                                href={item.url || '#'}
                                target={item.target || '_self'}
                                onClick={onClose}
                                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60 transition"
                            >
                                <div className="flex items-center gap-2.5">
                                    {renderDynamicIcon(item.icon, 'h-4 w-4 text-indigo-500 shrink-0')}
                                    <span>{item.title}</span>
                                </div>
                                {item.badge && (
                                    <span className="rounded-md bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    }

                    return (
                        <div key={item.id} className="rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleExpand(item.id)}
                                className="flex w-full items-center justify-between bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:bg-slate-900/50 dark:text-white"
                            >
                                <div className="flex items-center gap-2.5">
                                    {renderDynamicIcon(item.icon, 'h-4 w-4 text-indigo-500 shrink-0')}
                                    <span>{item.title}</span>
                                    {item.type === 'mega_menu' && (
                                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                                            Portal
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180 text-indigo-500' : ''
                                    }`}
                                />
                            </button>

                            {isExpanded && (
                                <div className="space-y-1 bg-white p-2 dark:bg-[#070b14] border-t border-slate-100 dark:border-slate-800/80">
                                    {item.children.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={sub.url || '#'}
                                            target={sub.target || '_self'}
                                            onClick={onClose}
                                            className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                                        >
                                            {sub.icon ? (
                                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mt-0.5">
                                                    {renderDynamicIcon(sub.icon, 'h-3.5 w-3.5')}
                                                </div>
                                            ) : (
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                                        {sub.title}
                                                    </span>
                                                    {sub.badge && (
                                                        <span className="rounded bg-indigo-100 px-1 text-[8px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                                            {sub.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {sub.description && (
                                                    <p className="line-clamp-1 text-[10px] text-slate-400">
                                                        {sub.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
