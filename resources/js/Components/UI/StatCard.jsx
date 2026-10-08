import { TrendingDown, TrendingUp } from 'lucide-react';

export default function StatCard({
    icon: Icon,
    label,
    value,
    change,
    trend = 'up',
    description,
    className = '',
}) {
    const isUp = trend === 'up';

    return (
        <div className={`surface-card relative overflow-hidden p-5 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                </div>
                {change && (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            isUp
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        }`}
                    >
                        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {change}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {value}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{label}</span>
                    {description && <span>{description}</span>}
                </div>
            </div>
        </div>
    );
}
