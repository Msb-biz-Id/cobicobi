export default function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    dot = true,
    className = '',
}) {
    const variants = {
        neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dot-bg-slate-400',
        primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40 dot-bg-indigo-500',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 dot-bg-emerald-500',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40 dot-bg-amber-500',
        danger: 'bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40 dot-bg-rose-500',
        info: 'bg-sky-50 text-sky-700 border border-sky-200/50 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40 dot-bg-sky-500',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200/50 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40 dot-bg-purple-500',
    };

    const dotColors = {
        neutral: 'bg-slate-400 dark:bg-slate-500',
        primary: 'bg-indigo-500',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-rose-500',
        info: 'bg-sky-500',
        purple: 'bg-purple-500',
    };

    const sizes = {
        sm: 'text-[11px] px-2 py-0.5 gap-1.5 rounded-md font-medium',
        md: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg font-medium',
        lg: 'text-sm px-3 py-1.5 gap-2 rounded-lg font-medium',
    };

    return (
        <span
            className={`inline-flex items-center select-none ${sizes[size] || sizes.md} ${variants[variant] || variants.neutral} ${className}`}
        >
            {dot && (
                <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColors[variant] || dotColors.neutral}`}
                />
            )}
            {children}
        </span>
    );
}
