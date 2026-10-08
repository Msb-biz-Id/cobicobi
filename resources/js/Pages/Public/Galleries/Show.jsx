import { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Calendar,
    Camera,
    Eye,
    Share2,
    ChevronLeft,
    ChevronRight,
    X,
    Download,
    Maximize2,
    ArrowLeft,
    Check,
    Images,
    Sparkles,
} from 'lucide-react';

export default function PublicGalleryShow({ gallery, relatedGalleries }) {
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [copied, setCopied] = useState(false);

    const images = gallery.images || [];

    const openLightbox = (index) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextImage = useCallback(() => {
        if (lightboxIndex !== null && images.length > 0) {
            setLightboxIndex((prev) => (prev + 1) % images.length);
        }
    }, [lightboxIndex, images.length]);

    const prevImage = useCallback(() => {
        if (lightboxIndex !== null && images.length > 0) {
            setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    }, [lightboxIndex, images.length]);

    // Keyboard support for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, nextImage, prevImage]);

    // Salin Tautan Album
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

    return (
        <PublicLayout>
            <Head>
                <title>{`${gallery.title} - Lensa & Galeri Kampus`}</title>
                <meta
                    name="description"
                    content={gallery.description || `Dokumentasi visual album ${gallery.title}`}
                />
                <meta property="og:title" content={gallery.title} />
                <meta property="og:description" content={gallery.description || gallery.title} />
                {gallery.cover_image && <meta property="og:image" content={gallery.cover_image} />}
            </Head>

            {/* Breadcrumb & Navigation Bar */}
            <div className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-[#070b14]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
                    <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link href={route('public.galleries.index')} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            Galeri
                        </Link>
                        <span>/</span>
                        <span className="truncate max-w-[200px] sm:max-w-xs text-slate-800 font-medium dark:text-slate-200">
                            {gallery.title}
                        </span>
                    </nav>

                    <Link
                        href={route('public.galleries.index')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Semua Album
                    </Link>
                </div>
            </div>

            {/* Album Header & Story */}
            <header className="relative bg-slate-900 py-12 text-white sm:py-16 overflow-hidden">
                {/* Background Cover Blur Effect */}
                {gallery.cover_image && (
                    <div className="absolute inset-0 opacity-20">
                        <img src={gallery.cover_image} alt="" className="h-full w-full object-cover filter blur-2xl" />
                    </div>
                )}
                <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 text-xs font-bold text-indigo-300">
                            {gallery.category || 'Dokumentasi'}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                            {images.length} Foto Tersedia
                        </span>
                    </div>

                    <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
                        {gallery.title}
                    </h1>

                    {/* Metadata & Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-300">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            {gallery.event_date && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-indigo-400" />
                                    {new Date(gallery.event_date).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            )}
                            {gallery.photographer && (
                                <span className="flex items-center gap-1.5">
                                    <Camera className="h-4 w-4 text-emerald-400" />
                                    Dokumentasi: <strong className="text-white">{gallery.photographer}</strong>
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 text-slate-400" />
                                {gallery.views_count} kali dilihat
                            </span>
                        </div>

                        {/* Share Button */}
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white transition backdrop-blur-md"
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                            <span>{copied ? 'Tautan Disalin!' : 'Bagikan Album'}</span>
                        </button>
                    </div>

                    {/* Narasi Cerita Album */}
                    {gallery.description && (
                        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 text-sm text-slate-200 leading-relaxed backdrop-blur-md">
                            <p className="whitespace-pre-line">{gallery.description}</p>
                        </div>
                    )}
                </div>
            </header>

            {/* Grid Koleksi Foto Album */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Images className="h-5 w-5 text-indigo-600" />
                            Koleksi Foto Dokumentasi
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Klik pada foto untuk melihat ukuran penuh, navigasi slideshow, atau mengunduh berkas.
                        </p>
                    </div>
                </div>

                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <Camera className="h-10 w-10 text-slate-400" />
                        <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-white">
                            Belum Ada Foto dalam Album Ini
                        </h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <div
                                key={img.id}
                                onClick={() => openLightbox(idx)}
                                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
                            >
                                <img
                                    src={img.image_url}
                                    alt={img.caption || `${gallery.title} Foto ${idx + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Hover Overlay with Caption & Zoom Icon */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-3.5">
                                    <div className="self-end">
                                        <span className="rounded-lg bg-black/50 p-1.5 text-white backdrop-blur-md inline-flex">
                                            <Maximize2 className="h-4 w-4" />
                                        </span>
                                    </div>
                                    <div>
                                        {img.caption && (
                                            <p className="text-xs font-semibold text-white line-clamp-2">
                                                {img.caption}
                                            </p>
                                        )}
                                        <span className="text-[10px] font-mono text-slate-300 mt-1 block">
                                            Foto {idx + 1} dari {images.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Section Album Terkait */}
                {relatedGalleries && relatedGalleries.length > 0 && (
                    <div className="mt-20 border-t border-slate-200/80 pt-12 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-600" />
                            Album Dokumentasi Terkait
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedGalleries.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route('public.galleries.show', item.slug)}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {item.cover_image && (
                                            <img
                                                src={item.cover_image}
                                                alt={item.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                        <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
                                            {item.images_count} Foto
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white line-clamp-2">
                                            {item.title}
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {item.category}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Lightbox Modal Layar Penuh (Interactive Fullscreen Viewer) */}
            {lightboxIndex !== null && activeImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    {/* Top Controls */}
                    <div
                        className="absolute top-0 inset-x-0 flex items-center justify-between p-4 sm:p-6 text-white z-10 bg-gradient-to-b from-black/80 to-transparent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                {lightboxIndex + 1} / {images.length}
                            </span>
                            <span className="text-xs font-medium text-slate-300 hidden sm:inline">
                                {gallery.title}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={activeImage.image_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition backdrop-blur-md"
                                title="Unduh Foto Asli (Maks 500 KB)"
                            >
                                <Download className="h-5 w-5" />
                            </a>
                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="rounded-xl bg-white/10 p-2 text-white hover:bg-rose-600 transition backdrop-blur-md"
                                title="Tutup (Esc)"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigasi Previous */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 rounded-2xl bg-black/60 p-3 text-white hover:bg-indigo-600 transition backdrop-blur-md"
                        title="Foto Sebelumnya (Panah Kiri)"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Foto Utama */}
                    <div
                        className="relative max-h-[85vh] max-w-[90vw] p-2 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={activeImage.image_url}
                            alt={activeImage.caption || gallery.title}
                            className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
                        />

                        {/* Caption Keterangan Foto */}
                        {activeImage.caption && (
                            <div className="mt-4 rounded-xl bg-black/70 px-4 py-2 text-center text-xs font-medium text-slate-200 backdrop-blur-md max-w-xl">
                                {activeImage.caption}
                            </div>
                        )}
                    </div>

                    {/* Navigasi Next */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 rounded-2xl bg-black/60 p-3 text-white hover:bg-indigo-600 transition backdrop-blur-md"
                        title="Foto Selanjutnya (Panah Kanan)"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            )}
        </PublicLayout>
    );
}
