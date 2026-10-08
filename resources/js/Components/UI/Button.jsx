import { Loader2 } from 'lucide-react';

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    children,
    icon: Icon,
    ...props
}) {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const sizes = {
        xs: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 h-7',
        sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
        md: 'text-sm px-4 py-2 rounded-xl gap-2 h-10',
        lg: 'text-sm px-5 py-2.5 rounded-xl gap-2.5 h-11',
        icon: 'h-9 w-9 rounded-xl p-0',
    };

    const variants = {
        primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500',
        secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200/80 focus:ring-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
        outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        ghost: 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 focus:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
        danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500',
        'danger-outline': 'border border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100/80 focus:ring-rose-400 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-900/30',
        success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : Icon ? (
                <Icon className="h-4 w-4 shrink-0" />
            ) : null}
            {children}
        </button>
    );
}
