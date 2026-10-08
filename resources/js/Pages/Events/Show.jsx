import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    MapPin,
    Clock,
    Tag,
    Share2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ExternalLink,
    Phone,
    Mail,
    Users,
    Sparkles,
    Ticket,
    Copy,
    Building2,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/Components/UI/Button';

export default function Show({ event, isPublicView = true, otherEvents = [] }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Separate sponsors into text-only vs with-logo
    const sponsorsList = Array.isArray(event.sponsors) ? event.sponsors : [];
    const logoSponsors = sponsorsList.filter((s) => Boolean(s.logo_url));
    const textSponsors = sponsorsList.filter((s) => !s.logo_url && Boolean(s.name));

    const content = (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Top Navigation / Breadcrumbs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Link href={route('home')} className="hover:text-indigo-600 transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href={route('public.events.index')} className="hover:text-indigo-600 transition-colors">
                        Agenda & Event
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs font-medium">
                        {event.title}
                    </span>
                </div>

                {!isPublicView && (
                    <div className="flex items-center gap-2">
                        <Link href={route('events.index')}>
                            <Button size="sm" variant="outline">
                                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                                Kembali ke Admin
                            </Button>
                        </Link>
                        <Link href={route('events.edit', event.id)}>
                            <Button size="sm" variant="primary">
                                Edit Event
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Hero Cover & Title Card */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none mb-10">
                {event.cover_image_url && (
                    <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img
                            src={event.cover_image_url}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    </div>
                )}

                <div className="p-6 sm:p-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                            <Tag className="h-3 w-3" />
                            {event.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {event.event_type}
                        </span>
                        {event.is_past ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Selesai
                            </span>
                        ) : event.is_registration_open ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Pendaftaran Dibuka
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                                Pendaftaran Ditutup
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-500" />
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {event.formatted_date_range}
                            </span>
                        </div>
                        {event.venue_name && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                <span>{event.venue_name}</span>
                            </div>
                        )}
                        {event.organizer && (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                <span>Penyelenggara: <strong className="text-slate-700 dark:text-slate-200">{event.organizer}</strong></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content & Registration Sidebar */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Left 2 Cols: Details, Description, Live Maps, Sponsors */}
                <div className="space-y-10 lg:col-span-2">
                    {/* Ringkasan Singkat (jika ada) */}
                    {event.summary && (
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm sm:text-base leading-relaxed text-indigo-950 dark:border-indigo-950/50 dark:bg-indigo-950/20 dark:text-indigo-200 font-medium">
                            {event.summary}
                        </div>
                    )}

                    {/* Deskripsi Lengkap TipTap */}
                    <div className="space-y-4">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Deskripsi Acara & Informasi Lengkap
                        </h2>
                        {event.description ? (
                            <div
                                className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed dark:prose-invert prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-2xl"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        ) : (
                            <p className="text-sm text-slate-400 italic">
                                Belum ada deskripsi tambahan untuk acara ini.
                            </p>
                        )}
                    </div>

                    {/* Auto Embed Maps & Location Card */}
                    {event.event_type !== 'online' && (
                        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-indigo-600" />
                                        Lokasi Acara & Denah Kampus
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {event.venue_name} • {event.address || 'Kompleks Kampus Universitas'}
                                    </p>
                                </div>
                                {event.maps_embed_url && (
                                    <a
                                        href={event.maps_url || `https://maps.google.com/?q=${encodeURIComponent(`${event.venue_name} ${event.address}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Petunjuk Arah Google Maps
                                    </a>
                                )}
                            </div>

                            {/* Auto Embed Map Frame */}
                            {event.maps_embed_url && (
                                <div className="overflow-hidden rounded-2xl border border-slate-200/80 aspect-video w-full shadow-inner dark:border-slate-800">
                                    <iframe
                                        src={event.maps_embed_url}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Lokasi ${event.title}`}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sponsors & Partnership Section (Text & Gambar) */}
                    {sponsorsList.length > 0 && (
                        <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-600" />
                                    Mitra & Sponsor Kerjasama
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Dukungan resmi institusi pemerintah, industri, dan mitra media universitas.
                                </p>
                            </div>

                            {/* Logo-based Sponsors */}
                            {logoSponsors.length > 0 && (
                                <div className="space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Mitra Utama & Sponsor Resmi
                                    </span>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        {logoSponsors.map((sponsor, idx) => (
                                            <div
                                                key={idx}
                                                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-center transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                                            >
                                                <div className="flex h-12 w-full items-center justify-center">
                                                    <img
                                                        src={sponsor.logo_url}
                                                        alt={sponsor.name}
                                                        className="max-h-10 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                                                    />
                                                </div>
                                                <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-full">
                                                    {sponsor.name}
                                                </span>
                                                {sponsor.type && (
                                                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-full">
                                                        {sponsor.type}
                                                    </span>
                                                )}
                                                {sponsor.website_url && (
                                                    <a
                                                        href={sponsor.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 text-[10px] font-semibold text-indigo-600 hover:underline flex items-center gap-0.5"
                                                    >
                                                        Kunjungi <ExternalLink className="h-2.5 w-2.5" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Text-based Sponsors */}
                            {textSponsors.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Dukungan Kelembagaan & Media Partner
                                    </span>
                                    <div className="flex flex-wrap gap-2.5">
                                        {textSponsors.map((sponsor, idx) => (
                                            <div
                                                key={idx}
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                                            >
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {sponsor.name}
                                                </span>
                                                {sponsor.type && (
                                                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                        {sponsor.type}
                                                    </span>
                                                )}
                                                {sponsor.website_url && (
                                                    <a
                                                        href={sponsor.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-slate-400 hover:text-indigo-600"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right 1 Col: Floating Sticky Registration Action Card */}
                <div className="space-y-6">
                    <div className="sticky top-24 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none space-y-6">
                        <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Investasi / Biaya Kehadiran
                            </span>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {event.price || 'Gratis'}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                                {event.registration_type === 'free' ? 'Terbuka bebas untuk civitas akademika & umum' : 'Termasuk e-sertifikat resmi & konsumsi'}
                            </span>
                        </div>

                        {/* Registration Details */}
                        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
                            {event.registration_deadline && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Batas Registrasi:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {new Date(event.registration_deadline).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })} WIB
                                    </span>
                                </div>
                            )}

                            {event.quota && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Kuota Peserta:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {event.quota} Orang
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Format Acara:</span>
                                <span className="font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                                    {event.event_type}
                                </span>
                            </div>
                        </div>

                        {/* CUSTOM REGISTRATION BUTTON LINK */}
                        {event.registration_url ? (
                            <a
                                href={event.registration_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${
                                    event.is_registration_open
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-600/30 hover:scale-[1.02]'
                                        : 'bg-slate-400 cursor-not-allowed opacity-60'
                                }`}
                            >
                                <Ticket className="h-4 w-4" />
                                {event.registration_button_label || 'Daftar Sekarang'}
                                <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </a>
                        ) : (
                            <div className="rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                                Pendaftaran offline di tempat saat acara berlangsung.
                            </div>
                        )}

                        {/* Share & Copy Link */}
                        <div className="border-t border-slate-100 pt-5 dark:border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-slate-400">
                                Bagikan Event:
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Copy className="h-3 w-3" />
                                {copied ? 'Tersalin!' : 'Salin Tautan'}
                            </button>
                        </div>

                        {/* Narahubung / PIC */}
                        {(event.contact_name || event.contact_phone || event.contact_email) && (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Narahubung / Helpdesk
                                </span>
                                {event.contact_name && (
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                        {event.contact_name}
                                    </p>
                                )}
                                <div className="space-y-1 text-xs">
                                    {event.contact_phone && (
                                        <a
                                            href={`https://wa.me/${event.contact_phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            <Phone className="h-3.5 w-3.5 text-emerald-500" />
                                            <span>{event.contact_phone}</span>
                                        </a>
                                    )}
                                    {event.contact_email && (
                                        <a
                                            href={`mailto:${event.contact_email}`}
                                            className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            <Mail className="h-3.5 w-3.5 text-indigo-500" />
                                            <span>{event.contact_email}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (isPublicView) {
        return (
            <PublicLayout>
                <Head title={`${event.title} - Agenda Kampus`} />
                {content}
            </PublicLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Preview: ${event.title}`} />
            {content}
        </AuthenticatedLayout>
    );
}
