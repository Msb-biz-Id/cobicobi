import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Network,
    Mail,
    Phone,
    MapPin,
    Globe,
    Building2,
    Briefcase,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon } from '@/Components/Icons/SocialIcons';

export default function InstitutionalUnitPublicShow({ unit }) {
    const assignments = unit.current_assignments || [];

    return (
        <PublicLayout>
            <Head title={`${unit.name} - Unit / Lembaga Kampus`} />

            {/* Header Hero Cover */}
            <div className="relative bg-slate-900 text-white">
                <div className="h-64 sm:h-80 w-full overflow-hidden relative">
                    {unit.cover_url ? (
                        <img
                            src={unit.cover_url}
                            alt={unit.name}
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="site-container relative -mt-24 sm:-mt-32 pb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center shrink-0">
                            {unit.logo_url ? (
                                <img src={unit.logo_url} alt={unit.name} className="h-full w-full object-cover" />
                            ) : (
                                <Network className="w-16 h-16 text-purple-600" />
                            )}
                        </div>

                        <div className="space-y-2 flex-1">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                                {unit.category_label || unit.category}
                            </span>

                            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                                {unit.name}
                            </h1>

                            {unit.code && (
                                <p className="text-xs text-slate-300">
                                    Kode Unit: {unit.code}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="site-container py-10 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column (2 Cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Deskripsi */}
                        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Profil &amp; Peran Strategis
                            </h2>
                            {unit.description ? (
                                <div
                                    className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: unit.description }}
                                />
                            ) : (
                                <p className="text-sm text-slate-500 italic">Deskripsi unit belum diunggah.</p>
                            )}
                        </div>

                        {/* Visi & Misi */}
                        {(unit.vision || unit.mission) && (
                            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                                {unit.vision && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-600" /> Visi
                                        </h3>
                                        <div
                                            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/50"
                                            dangerouslySetInnerHTML={{ __html: unit.vision }}
                                        />
                                    </div>
                                )}

                                {unit.mission && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                            Misi Pelayanan
                                        </h3>
                                        <div
                                            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
                                            dangerouslySetInnerHTML={{ __html: unit.mission }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Layanan & Fasilitas */}
                        {unit.services_overview && (
                            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-purple-600" /> Fasilitas &amp; Layanan Utama
                                </h2>
                                <div
                                    className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: unit.services_overview }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column (1 Col) */}
                    <div className="space-y-6">
                        {/* Pimpinan Unit */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                                Pimpinan Unit
                            </h2>

                            {assignments.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Belum ada data pimpinan unit.</p>
                            ) : (
                                <div className="space-y-4">
                                    {assignments.map((asg) => (
                                        <div key={asg.id} className="flex items-center gap-3">
                                            <img
                                                src={asg.staff_profile?.avatar_url}
                                                alt={asg.staff_profile?.name}
                                                className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                            />
                                            <div>
                                                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                                                    {asg.position?.name || 'Kepala Unit'}
                                                </span>
                                                <Link
                                                    href={route('public.lecturers.show', asg.staff_profile?.slug || asg.staff_profile?.id)}
                                                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-purple-600 transition"
                                                >
                                                    {asg.staff_profile?.full_name_with_titles || asg.staff_profile?.name}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Kontak & Lokasi */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Informasi &amp; Kontak
                            </h2>

                            {unit.office_location && (
                                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                    <span>{unit.office_location}</span>
                                </div>
                            )}

                            {unit.email && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                                    <a href={`mailto:${unit.email}`} className="hover:text-purple-600 transition">
                                        {unit.email}
                                    </a>
                                </div>
                            )}

                            {unit.phone && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Phone className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span>{unit.phone}</span>
                                </div>
                            )}

                            {unit.website_url && (
                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                    <Globe className="w-4 h-4 text-purple-500 shrink-0" />
                                    <a
                                        href={unit.website_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-purple-600 transition truncate"
                                    >
                                        {unit.website_url}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Media Sosial Lengkap (Termasuk TikTok) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                                Media Sosial Unit
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {unit.tiktok_url && (
                                    <a
                                        href={unit.tiktok_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black transition shadow-xs"
                                        title="TikTok Resmi"
                                    >
                                        <TikTokIcon className="w-3.5 h-3.5 fill-current" /> TikTok
                                    </a>
                                )}
                                {unit.instagram_url && (
                                    <a
                                        href={unit.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/60 dark:text-pink-300 transition"
                                        title="Instagram"
                                    >
                                        <InstagramIcon className="w-3.5 h-3.5 fill-current" /> Instagram
                                    </a>
                                )}
                                {unit.facebook_url && (
                                    <a
                                        href={unit.facebook_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition"
                                        title="Facebook"
                                    >
                                        <FacebookIcon className="w-3.5 h-3.5 fill-current" /> Facebook
                                    </a>
                                )}
                                {unit.x_url && (
                                    <a
                                        href={unit.x_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition"
                                        title="X / Twitter"
                                    >
                                        <XIcon className="w-3.5 h-3.5 fill-current" /> Twitter / X
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
