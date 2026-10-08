import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, PlayCircle } from 'lucide-react';

export default function HeroSlider({ slides = [], stats = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const defaultSlides = [
        {
            id: 'd1',
            badge: 'KAMPUS UNGGULAN ITB TUBAN',
            title: 'Membangun <span class="text-secondary-400">Generasi Emas</span> Berdaya Saing Global',
            desc: 'Lingkungan belajar modern dengan fasilitas riset terdepan, tenaga pendidik profesional, dan kurikulum aplikatif untuk mencetak lulusan berkarakter unggul dan inovatif.',
            media_type: 'image',
            image_url: '/images/campus-hero.png',
            youtube_url: '',
            primary_btn_text: 'DAFTAR SEKARANG',
            primary_btn_url: '/pendaftaran',
            secondary_btn_text: 'Profil Lengkap',
            secondary_btn_url: '/tentang',
        },
    ];

    const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

    useEffect(() => {
        if (activeSlides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 6500);
        return () => clearInterval(interval);
    }, [activeSlides.length]);

    // Parse YouTube ID untuk embed video background
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
            videoId = match[1];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1`;
        }
        return '';
    };

    return (
        <section className="relative min-h-[600px] sm:min-h-[660px] lg:min-h-[82vh] flex flex-col justify-center overflow-hidden bg-slate-950">
            {/* Slider Track / Slides */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {activeSlides.map((slide, i) => {
                    const desc = slide.desc || slide.subtitle || '';
                    const primaryText = slide.primary_btn_text || slide.cta_primary_label || '';
                    const primaryUrl = slide.primary_btn_url || slide.cta_primary_url || '#';
                    const secondaryText = slide.secondary_btn_text || slide.cta_secondary_label || '';
                    const secondaryUrl = slide.secondary_btn_url || slide.cta_secondary_url || '#';
                    const isVideo = (slide.media_type === 'youtube' || slide.type === 'video') && (slide.youtube_url || slide.video_url);
                    const videoUrl = slide.youtube_url || slide.video_url || '';
                    const imageUrl = slide.image_url || slide.image_path || slide.image || '/images/campus-hero.png';
                    const isActive = currentSlide === i;

                    return (
                        <div
                            key={slide.id || i}
                            className={`absolute inset-0 w-full h-full flex flex-col justify-center overflow-hidden transition-all duration-700 ease-in-out ${
                                isActive
                                    ? 'opacity-100 translate-x-0 pointer-events-auto z-10'
                                    : currentSlide > i
                                      ? 'opacity-0 -translate-x-full pointer-events-none z-0'
                                      : 'opacity-0 translate-x-full pointer-events-none z-0'
                            }`}
                        >
                            {/* Background Layer */}
                            <div className="absolute inset-0 z-0">
                                {isVideo ? (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <iframe
                                            src={getYouTubeEmbedUrl(videoUrl)}
                                            title={slide.badge || 'YouTube Hero Background'}
                                            className="w-[120vw] h-[120vh] -ml-[10vw] -mt-[10vh] object-cover border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src={imageUrl}
                                        alt={slide.badge || 'Campus Hero'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/campus-hero.png';
                                        }}
                                        className={`w-full h-full object-cover transform transition-transform duration-[10000ms] ${
                                            isActive ? 'scale-105' : 'scale-100'
                                        }`}
                                    />
                                )}

                                {/* Deep Modern Overlay Gradient */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, rgba(8, 47, 73, 0.94) 0%, rgba(12, 74, 110, 0.82) 50%, rgba(8, 28, 44, 0.92) 100%)',
                                    }}
                                />
                                {/* Subtle Grid Texture */}
                                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
                            </div>

                            {/* Slide Content (Standardized site-container) */}
                            <div className="relative z-[2] site-container pt-20 pb-36 sm:pt-24 sm:pb-44 lg:py-28 lg:pb-48 w-full">
                                <div
                                    className={`max-w-[760px] transition-all duration-700 delay-150 ${
                                        isActive
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-6'
                                    }`}
                                >
                                    {slide.badge && (
                                        <span className="inline-block bg-secondary-400/20 text-secondary-300 text-[11px] sm:text-xs font-black tracking-[0.14em] px-3.5 py-1.5 rounded-full border border-secondary-400/40 mb-4 sm:mb-6 uppercase shadow-xs backdrop-blur-sm max-w-full truncate">
                                            {slide.badge}
                                        </span>
                                    )}

                                    <h1
                                        className="text-2xl sm:text-3xl md:text-5xl lg:text-[54px] font-black text-white leading-[1.2] sm:leading-[1.16] mb-4 sm:mb-6 tracking-tight drop-shadow-sm font-heading break-words"
                                        dangerouslySetInnerHTML={{ __html: slide.title }}
                                    />

                                    {desc && (
                                        <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed mb-6 sm:mb-9 max-w-[620px] line-clamp-3 sm:line-clamp-none">
                                            {desc}
                                        </p>
                                    )}

                                    <div className="flex gap-3 sm:gap-4 flex-wrap items-center">
                                        {primaryText && (
                                            <Link
                                                href={primaryUrl}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary-400 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-lg shadow-secondary-400/25 hover:bg-secondary-300 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                <ChevronRight className="w-4 h-4 shrink-0" />
                                                <span>{primaryText}</span>
                                            </Link>
                                        )}

                                        {secondaryText && (
                                            <Link
                                                href={secondaryUrl}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-white/20 transition-all"
                                            >
                                                <PlayCircle className="w-4 h-4 text-secondary-300 shrink-0" />
                                                <span>{secondaryText}</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Slider Dots */}
            {activeSlides.length > 1 && (
                <div className="absolute bottom-28 max-lg:bottom-32 sm:bottom-32 max-lg:pb-2 left-0 right-0 z-[4] flex justify-center gap-2.5">
                    {activeSlides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Slide ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentSlide === index
                                    ? 'bg-secondary-400 w-9 sm:w-10 shadow-sm'
                                    : 'bg-white/40 w-2.5 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Stats Bar (Sesuai Desain Template Kampus & Standar site-container) */}
            {stats && stats.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 z-[5] bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 border-t-2 border-secondary-400/90 shadow-2xl backdrop-blur-md">
                    <div className="site-container">
                        <div className="grid grid-cols-2 md:grid-cols-4 text-center">
                            {stats.map((stat, i) => (
                                <div
                                    key={stat.label || i}
                                    className={`py-3.5 sm:py-5 px-2 sm:px-4 ${
                                        i < stats.length - 1 ? 'border-r border-white/10' : ''
                                    }`}
                                >
                                    <div
                                        className={`text-xl sm:text-3xl lg:text-4xl font-black leading-tight mb-0.5 sm:mb-1 ${
                                            stat.accent ? 'text-secondary-400' : 'text-white'
                                        }`}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-white/75 font-bold uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
