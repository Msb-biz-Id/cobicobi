import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FileText, Calendar, ArrowLeft } from 'lucide-react';

export default function Show({ page }) {
    return (
        <PublicLayout>
            <Head title={`${page.title} - Laman Universitas`} />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Link href={route('home')} className="hover:text-indigo-600 transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {page.title}
                    </span>
                </div>

                <header className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {page.title}
                    </h1>
                </header>

                {/* Cover Image if available */}
                {page.thumbnail_url && (
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 aspect-[21/9] w-full shadow-lg dark:border-slate-800">
                        <img
                            src={page.thumbnail_url}
                            alt={page.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                {/* TipTap Rich Content */}
                <article
                    className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-3xl"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </PublicLayout>
    );
}
