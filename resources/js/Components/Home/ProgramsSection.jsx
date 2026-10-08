import { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight, Users, Award, Star, GraduationCap } from 'lucide-react';

const FALLBACK_IMAGES = [
    '/images/lab.png',
    '/images/building.png',
    '/images/students-activity.png',
    '/images/campus-hero.png',
    '/images/library.png',
];

export default function ProgramsSection({ programs = [] }) {
    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const defaultPrograms = [
        {
            id: 1,
            name: 'Teknik Informatika',
            slug: 'teknik-informatika',
            degree_title: 'S1 - Sarjana Komputer',
            faculty: { name: 'Fakultas Teknologi Informasi' },
            hero_image_url: '/images/lab.png',
            students_count: '1.200 Mahasiswa',
            accreditation_grade: 'Akreditasi UNGGUL',
            description: 'Mempelajari dasar-dasar ilmu komputer, pemrograman modern, kecerdasan buatan, rekayasa perangkat lunak, dan cloud computing.',
        },
        {
            id: 2,
            name: 'Sistem Informasi',
            slug: 'sistem-informasi',
            degree_title: 'S1 - Sarjana Komputer',
            faculty: { name: 'Fakultas Teknologi Informasi' },
            hero_image_url: '/images/building.png',
            students_count: '980 Mahasiswa',
            accreditation_grade: 'Akreditasi UNGGUL',
            description: 'Mengintegrasikan teknologi informasi dengan manajemen strategi bisnis untuk transformasi digital korporasi modern.',
        },
        {
            id: 3,
            name: 'Teknik Industri',
            slug: 'teknik-industri',
            degree_title: 'S1 - Sarjana Teknik',
            faculty: { name: 'Fakultas Teknik Industri' },
            hero_image_url: '/images/students-activity.png',
            students_count: '850 Mahasiswa',
            accreditation_grade: 'Akreditasi UNGGUL',
            description: 'Fokus pada optimasi sistem integral manusia, material, mesin, energi, dan finansial dalam manufaktur dan rantai pasok.',
        },
        {
            id: 4,
            name: 'Bisnis Digital',
            slug: 'bisnis-digital',
            degree_title: 'S1 - Sarjana Bisnis',
            faculty: { name: 'Fakultas Bisnis & Manajemen' },
            hero_image_url: '/images/campus-hero.png',
            students_count: '720 Mahasiswa',
            accreditation_grade: 'Akreditasi A',
            description: 'Membentuk wirausahawan dan profesional strategi pemasaran digital, e-commerce, fin-tech, dan inkubasi startup inovatif.',
        },
        {
            id: 5,
            name: 'Rekayasa Perangkat Lunak',
            slug: 'rekayasa-perangkat-lunak',
            degree_title: 'D3 - Ahli Madya Komputer',
            faculty: { name: 'Fakultas Vokasi' },
            hero_image_url: '/images/lab.png',
            students_count: '540 Mahasiswa',
            accreditation_grade: 'Akreditasi A',
            description: 'Program vokasi terapan berorientasi industri untuk melahirkan software engineer handal, web & mobile developer siap kerja.',
        },
    ];

    const displayPrograms = programs && programs.length > 0 ? programs : defaultPrograms;

    const checkScrollButtons = () => {
        if (!sliderRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        const cardWidth = 360; // Card estimate width + gap
        const current = Math.round(scrollLeft / cardWidth);
        setActiveIndex(Math.min(Math.max(current, 0), displayPrograms.length - 1));
    };

    useEffect(() => {
        const el = sliderRef.current;
        if (el) {
            checkScrollButtons();
            el.addEventListener('scroll', checkScrollButtons);
            return () => el.removeEventListener('scroll', checkScrollButtons);
        }
    }, [displayPrograms.length]);

    const scrollByStep = (direction) => {
        if (!sliderRef.current) return;
        const step = direction === 'left' ? -380 : 380;
        sliderRef.current.scrollBy({ left: step, behavior: 'smooth' });
    };

    const scrollToIndex = (index) => {
        if (!sliderRef.current) return;
        const cardWidth = 370;
        sliderRef.current.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth',
        });
        setActiveIndex(index);
    };

    return (
        <section className="py-16 sm:py-20 bg-white dark:bg-[#070b14] overflow-hidden">
            <div className="site-container">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
                    <div>
                        <span className="section-label">
                            PROGRAM STUDI UNGGULAN
                        </span>
                        <h2 className="section-title">
                            Pilihan Disiplin Ilmu Masa Depan
                        </h2>
                        <div className="section-underline" />
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mt-2">
                            Program akademik terakreditasi BAN-PT yang membekali mahasiswa dengan keahlian teknologi terkini, kurikulum aplikatif, dan kesiapan berkarier global.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Prev & Next Slider Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scrollByStep('left')}
                                disabled={!canScrollLeft}
                                aria-label="Slide sebelumnya"
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                                    canScrollLeft
                                        ? 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-primary-500 hover:text-primary-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                                        : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800/50 dark:bg-slate-950 dark:text-slate-700'
                                }`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollByStep('right')}
                                disabled={!canScrollRight}
                                aria-label="Slide berikutnya"
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                                    canScrollRight
                                        ? 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-primary-500 hover:text-primary-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                                        : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800/50 dark:bg-slate-950 dark:text-slate-700'
                                }`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <Link
                            href={route('public.study-programs.index')}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors shadow-xs"
                        >
                            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Horizontal Slider / Carousel Container Sesuai Vue */}
                <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div
                        ref={sliderRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scrollbar-hide scroll-smooth"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {displayPrograms.map((prog, idx) => {
                            const imgSrc =
                                prog.hero_image_url ||
                                prog.cover_image_url ||
                                FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                            const facultyName =
                                prog.faculty?.name || prog.faculty_name || 'Fakultas Teknik & Teknologi';

                            return (
                                <div
                                    key={prog.id || idx}
                                    className="w-[85vw] sm:w-[350px] lg:w-[380px] shrink-0 snap-start bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden dark:border-slate-800/90 dark:bg-slate-900 group"
                                >
                                    {/* Cover Image */}
                                    <div className="h-[210px] overflow-hidden relative shrink-0 bg-slate-100 dark:bg-slate-950">
                                        <img
                                            src={imgSrc}
                                            alt={prog.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                        {/* Faculty Tag */}
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-block text-[11px] font-bold tracking-wider text-white bg-primary-600/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md">
                                                {facultyName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <span className="text-xs font-bold text-secondary-500 dark:text-secondary-400 mb-1">
                                            {prog.degree_title || prog.degree || 'Strata-1 (S1)'}
                                        </span>

                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 font-heading">
                                            <Link href={route('public.study-programs.show', prog.slug || prog.id)}>
                                                {prog.name}
                                            </Link>
                                        </h3>

                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6">
                                            {prog.description ||
                                                'Program studi unggulan berorientasi praktikum industri untuk mencetak profesional handal.'}
                                        </p>

                                        {/* Card Footer Info: Mahasiswa & Akreditasi */}
                                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                                                <span>{prog.students_count || '850+ Mahasiswa'}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5 text-secondary-600 dark:text-secondary-400 font-bold">
                                                <Award className="w-4 h-4 text-secondary-500 shrink-0" />
                                                <span>{prog.accreditation_grade || 'Akreditasi UNGGUL'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Slider Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    {displayPrograms.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => scrollToIndex(index)}
                            aria-label={`Ke slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                activeIndex === index
                                    ? 'bg-primary-600 w-8 shadow-xs'
                                    : 'bg-slate-200 dark:bg-slate-800 w-2.5 hover:bg-primary-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
