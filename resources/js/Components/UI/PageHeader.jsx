import { ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs = [],
    actions,
    className = '',
}) {
    return (
        <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
            <div>
                {breadcrumbs.length > 0 && (
                    <nav className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                        {breadcrumbs.map((crumb, idx) => (
                            <span key={idx} className="flex items-center gap-1.5">
                                {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
        </div>
    );
}
