import { Link } from '@inertiajs/react';
import { Layers } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-[#090d16]">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.2),rgba(9,13,22,0))]" />

            <div className="relative z-10 w-full max-w-sm">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-md shadow-indigo-500/25">
                            <Layers className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Apparel Studio
                        </span>
                    </Link>
                </div>

                <div className="surface-card p-7 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    {children}
                </div>
            </div>
        </div>
    );
}
