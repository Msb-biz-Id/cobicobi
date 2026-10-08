import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links = [], meta, className = '' }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav
            className={`flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
            aria-label="Pagination"
        >
            {meta && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing <span className="font-medium text-slate-700 dark:text-slate-200">{meta.from || 0}</span> to{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-200">{meta.to || 0}</span> of{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-200">{meta.total || 0}</span> results
                </p>
            )}
            <div className="flex flex-wrap items-center gap-1">
                {links.map((link, idx) => {
                    const isPrev = idx === 0;
                    const isNext = idx === links.length - 1;
                    const label = link.label
                        .replace('&laquo; Previous', '')
                        .replace('Next &raquo;', '');

                    if (!link.url) {
                        return (
                            <span
                                key={idx}
                                className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-medium text-slate-300 select-none dark:text-slate-600"
                            >
                                {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors select-none ${
                                link.active
                                    ? 'bg-indigo-600 font-semibold text-white shadow-xs dark:bg-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                            }`}
                        >
                            {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
