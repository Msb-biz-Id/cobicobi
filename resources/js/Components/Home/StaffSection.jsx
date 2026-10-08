import { Link } from '@inertiajs/react';
import { ArrowRight, Linkedin, Mail, GraduationCap } from 'lucide-react';

const FALLBACK_STAFF_PHOTOS = [
    '/images/dosen-female.png',
    '/images/dosen-male.png',
    '/images/dosen-female.png',
    '/images/dosen-male.png',
];

export default function StaffSection({ staff = [] }) {
    const defaultStaff = [
        {
            id: 1,
            name: 'Dr. Sari Wijaya, M.Pd.',
            slug: 'sari-wijaya',
            role: 'Ketua Program Studi Teknik Informatika',
            photo_url: '/images/dosen-female.png',
        },
        {
            id: 2,
            name: 'Ir. Budi Santoso, M.T.',
            slug: 'budi-santoso',
            role: 'Kepala Pusat Riset Artificial Intelligence',
            photo_url: '/images/dosen-male.png',
        },
        {
            id: 3,
            name: 'Dra. Maya Lestari, M.Si.',
            slug: 'maya-lestari',
            role: 'Dosen Senior Sistem Informasi & Basis Data',
            photo_url: '/images/dosen-female.png',
        },
        {
            id: 4,
            name: 'Dr. Rudi Hartono, S.E., M.M.',
            slug: 'rudi-hartono',
            role: 'Dosen Manajemen Bisnis & Kewirausahaan',
            photo_url: '/images/dosen-male.png',
        },
    ];

    const displayStaff = staff && staff.length > 0 ? staff : defaultStaff;

    return (
        <section className="py-16 sm:py-20 bg-slate-50/70 dark:bg-slate-900/40">
            <div className="site-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                    <div>
                        <span className="section-label">
                            TENAGA PENDIDIK
                        </span>
                        <h2 className="section-title">
                            Dosen &amp; Pimpinan Akademik
                        </h2>
                        <div className="section-underline" />
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                            Tenaga pendidik profesional berkualifikasi magister &amp; doktoral dengan dedikasi tinggi dalam membimbing mahasiswa menuju keunggulan.
                        </p>
                    </div>

                    <Link
                        href={route('public.lecturers.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors shrink-0 shadow-xs"
                    >
                        Lihat Semua Dosen <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayStaff.slice(0, 4).map((member, idx) => {
                        const photoSrc =
                            member.photo_url ||
                            FALLBACK_STAFF_PHOTOS[idx % FALLBACK_STAFF_PHOTOS.length];

                        return (
                            <Link
                                key={member.id || idx}
                                href={route('public.lecturers.show', member.slug || member.id)}
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center overflow-hidden flex flex-col group dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="h-[260px] sm:h-[280px] overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                                    <img
                                        src={photoSrc}
                                        alt={member.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = FALLBACK_STAFF_PHOTOS[idx % FALLBACK_STAFF_PHOTOS.length];
                                        }}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="p-5 flex flex-col flex-1 justify-between">
                                    <div>
                                        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 font-heading">
                                            {member.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                            {member.role || member.academic_rank || member.structural_position || 'Dosen Tetap Program Studi'}
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs hover:bg-primary-600 hover:text-white transition-colors dark:bg-primary-950/50 dark:text-primary-400">
                                            <Linkedin className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs hover:bg-primary-600 hover:text-white transition-colors dark:bg-primary-950/50 dark:text-primary-400">
                                            <Mail className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs hover:bg-primary-600 hover:text-white transition-colors dark:bg-primary-950/50 dark:text-primary-400">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
