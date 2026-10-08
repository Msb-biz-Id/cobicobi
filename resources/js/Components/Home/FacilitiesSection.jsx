import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';

export default function FacilitiesSection({ facilities = [] }) {
    const defaultFacilities = [
        {
            id: 1,
            name: 'Laboratorium Terpadu & Riset Digital',
            slug: 'laboratorium-terpadu',
            image_url: '/images/lab.png',
            desc: 'Lab komputer modern, software engineering lab, kecerdasan buatan, dan studio riset terapan berstandar internasional.',
            location: 'Gedung Riset Lt. 3',
        },
        {
            id: 2,
            name: 'Perpustakaan Digital & Co-Working Hub',
            slug: 'perpustakaan-digital',
            image_url: '/images/library.png',
            desc: 'Koleksi ribuan e-book, repositori jurnal bereputasi Scopus, dan ruang kolaborasi pintar untuk mahasiswa.',
            location: 'Gedung Rektorat Lt. 2',
        },
        {
            id: 3,
            name: 'Auditorium Utama & Convention Hall',
            slug: 'auditorium-utama',
            image_url: '/images/auditorium.png',
            desc: 'Ruang serbaguna berkapasitas 1.500 kursi untuk seminar internasional, konferensi akademik, dan wisuda sarjana.',
            location: 'Kampus Barat',
        },
    ];

    const displayList = facilities && facilities.length > 0 ? facilities : defaultFacilities;
    const first = displayList[0];
    const others = displayList.slice(1, 3);

    return (
        <section className="py-16 sm:py-20 bg-white dark:bg-[#070b14]">
            <div className="site-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                    <div>
                        <span className="section-label">
                            FASILITAS KAMPUS
                        </span>
                        <h2 className="section-title">
                            Sarana &amp; Prasarana Modern
                        </h2>
                        <div className="section-underline" />
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                            Fasilitas kampus terpadu dirancang untuk mendukung optimalisasi proses pembelajaran, riset mutakhir, dan aktivitas kemahasiswaan.
                        </p>
                    </div>

                    <Link
                        href={route('public.facilities.index')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors shrink-0 shadow-xs"
                    >
                        Lihat Semua Fasilitas <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Highlight Kiri Besar */}
                    {first && (
                        <Link
                            href={route('public.facilities.show', first.slug || first.id)}
                            className="relative rounded-3xl overflow-hidden h-[380px] lg:h-[516px] group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 block"
                        >
                            <img
                                src={first.image_url || '/images/lab.png'}
                                alt={first.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/lab.png';
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
                                <span className="inline-block bg-secondary-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    Fasilitas Unggulan
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black leading-tight group-hover:text-secondary-300 transition-colors font-heading">
                                    {first.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                                    {first.description || first.desc}
                                </p>
                                {first.location && (
                                    <div className="flex items-center gap-1.5 text-xs text-white/70 pt-1">
                                        <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                                        <span>{first.location}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    )}

                    {/* Right Column: 2 Items Bertumpuk Sesuai Vue */}
                    <div className="grid grid-cols-1 gap-8">
                        {others.map((item, i) => (
                            <Link
                                key={item.id || i}
                                href={route('public.facilities.show', item.slug || item.id)}
                                className="relative rounded-3xl overflow-hidden h-[242px] group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 block"
                            >
                                <img
                                    src={item.image_url || (i === 0 ? '/images/library.png' : '/images/auditorium.png')}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = i === 0 ? '/images/library.png' : '/images/auditorium.png';
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                                    <h3 className="text-xl font-bold leading-tight group-hover:text-secondary-300 transition-colors font-heading">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                                        {item.description || item.desc}
                                    </p>
                                    {item.location && (
                                        <div className="flex items-center gap-1.5 text-[11px] text-white/70 pt-1">
                                            <MapPin className="w-3 h-3 text-secondary-400" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
