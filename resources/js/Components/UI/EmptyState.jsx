import { FolderOpen } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
    icon: Icon = FolderOpen,
    title = 'No data found',
    description = 'There are no items to display right now.',
    actionLabel,
    onAction,
    actionIcon,
    className = '',
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/30 ${className}`}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
                <Icon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="mt-4 text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                {title}
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
            </p>
            {actionLabel && onAction && (
                <div className="mt-5">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={onAction}
                        icon={actionIcon}
                    >
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}
