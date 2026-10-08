import { useState } from 'react';
import { User, ArrowRight, X, Video, Quote } from 'lucide-react';

export default function RectorWelcome({ rectorData = {} }) {
    const [showSpeechModal, setShowSpeechModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const {
        rector_name = 'Prof. Dr. Ahmad Wijaya, M.Sc.',
        rector_title = 'Rektor Institut Teknologi & Bisnis',
        rector_image_url = null,
        rector_quote = 'Puji syukur ke hadirat Tuhan YME, atas segala rahmat dan karunia-Nya. Selamat datang di portal resmi kampus kami. Kami berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi yang mempersiapkan generasi muda menghadapi revolusi industri global.',
        rector_speech = '',
        rector_video_url = '',
    } = rectorData;

    // Parse YouTube ID untuk video embed jika ada
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
            videoId = match[1];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return '';
    };

    return (
        <section className="py-20 sm:py-24 bg-white dark:bg-[#070b14] overflow-hidden">
            <div className="site-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Kolom Kiri: Foto Rektor dengan Ornamen Elegan */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        <div className="relative w-full max-w-[380px]">
                            {/* Decorative Backdrop Blobs */}
                            <div className="absolute -bottom-5 -right-5 w-48 h-48 bg-secondary-400/20 rounded-3xl -z-10 blur-sm" />
                            <div className="absolute -top-5 -left-5 w-40 h-40 bg-primary-600/15 rounded-3xl -z-10 blur-sm" />

                            {/* Foto Frame */}
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                {rector_image_url ? (
                                    <img
                                        src={rector_image_url}
                                        alt={rector_name}
                                        className="h-full w-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-slate-100 text-primary-400 dark:from-slate-900 dark:to-slate-950">
                                        <User className="h-28 w-28 opacity-40 mb-2" />
                                        <span className="text-xs font-semibold text-slate-400">Pimpinan Institusi</span>
                                    </div>
                                )}

                                {/* Overlay Badge on Photo */}
                                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md dark:bg-slate-950/90 border border-slate-100 dark:border-slate-800 text-center">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate font-heading">
                                        {rector_name}
                                    </h4>
                                    <p className="text-[11px] font-bold text-secondary-600 dark:text-secondary-400 mt-0.5 truncate">
                                        {rector_title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Naskah Sambutan Rektor */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <span className="section-label">
                                SAMBUTAN REKTOR
                            </span>
                            <h2 className="section-title">
                                Menyongsong Era Baru Pendidikan Berkelanjutan &amp; Berkarakter
                            </h2>
                            <div className="w-16 h-1.5 bg-secondary-400 rounded-full mt-3" />
                        </div>

                        <div className="relative">
                            <Quote className="absolute -top-3 -left-3 h-8 w-8 text-primary-200/60 dark:text-primary-950 -z-0" />
                            <p className="relative z-10 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">
                                "{rector_quote}"
                            </p>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Di tengah percepatan transformasi kecerdasan artifisial dan integrasi industri global, komitmen kami adalah menghadirkan kurikulum berbasis proyek riil yang adaptif, mengasah karakter kepemimpinan, dan membuka kesempatan seluas-luasnya bagi mahasiswa untuk berprestasi di panggung dunia.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setShowSpeechModal(true)}
                                className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary-600/25 hover:bg-primary-500 active:scale-95 transition-all cursor-pointer"
                            >
                                Baca Pidato Sambutan <ArrowRight className="w-4 h-4" />
                            </button>

                            {rector_video_url && (
                                <button
                                    type="button"
                                    onClick={() => setShowVideoModal(true)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-all cursor-pointer"
                                >
                                    <Video className="w-4 h-4 text-rose-500" />
                                    Tonton Video Sambutan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Dialog 1: Full-Text Pidato Sambutan Rektor */}
            {showSpeechModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                        onClick={() => setShowSpeechModal(false)}
                    />

                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Dialog */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                            <div>
                                <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">
                                    Naskah Pidato Resmi Rektorat
                                </span>
                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading">
                                    Sambutan Rektor {rector_name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSpeechModal(false)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Speech Content Body */}
                        <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
                            {/* Rector Attribution Header Card */}
                            <div className="flex items-center gap-4 rounded-2xl bg-primary-50/60 p-4 border border-primary-100 dark:bg-primary-950/30 dark:border-primary-900/40">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-xs dark:border-slate-800">
                                    {rector_image_url ? (
                                        <img src={rector_image_url} alt={rector_name} className="h-full w-full object-cover object-top" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-500">
                                            <User className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-heading">
                                        {rector_name}
                                    </h4>
                                    <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                                        {rector_title}
                                    </p>
                                </div>
                            </div>

                            {/* Kutipan Sorotan */}
                            {rector_quote && (
                                <div className="border-l-4 border-secondary-400 bg-secondary-50/50 dark:bg-secondary-950/20 p-4 rounded-r-2xl">
                                    <p className="text-sm sm:text-base font-medium italic text-slate-700 dark:text-slate-200">
                                        "{rector_quote}"
                                    </p>
                                </div>
                            )}

                            {/* Teks Lengkap Pidato */}
                            <div
                                className="prose tiptap-content max-w-none text-base leading-relaxed text-slate-700 dark:text-slate-200 space-y-4"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        rector_speech ||
                                        `<p><strong>Assalamu’alaikum Warahmatullahi Wabarakatuh,</strong><br>Salam sejahtera bagi kita semua.</p><p>Puji syukur ke hadirat Tuhan Yang Maha Esa, atas segala rahmat dan karunia-Nya. Selamat datang di portal resmi institusi kami.</p><p>Di era transformasi digital dan kecerdasan artifisial saat ini, perguruan tinggi memegang peranan krusial untuk mencetak lulusan yang tidak hanya menguasai sains dan teknologi terkini, namun juga menjunjung tinggi etika, moralitas, serta empati sosial. Melalui sinergi riset terapan bersama industri dan masyarakat, kami berkomitmen menjadi wadah pembinaan generasi unggul Indonesia.</p><p>Mari bersama-sama kita songsong masa depan dengan optimisme, inovasi tanpa henti, dan karya nyata untuk nusa dan bangsa.</p><p><strong>Wassalamu’alaikum Warahmatullahi Wabarakatuh.</strong></p>`,
                                }}
                            />

                            {/* Tanda Tangan & Penutup Resmi */}
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <div className="text-right space-y-1">
                                    <p className="text-xs text-slate-400">Tertanda,</p>
                                    <p className="text-sm font-extrabold text-slate-900 dark:text-white font-heading">
                                        {rector_name}
                                    </p>
                                    <p className="text-xs text-secondary-600 dark:text-secondary-400 font-semibold">
                                        {rector_title}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Dialog */}
                        <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-end shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                            <button
                                type="button"
                                onClick={() => setShowSpeechModal(false)}
                                className="rounded-xl bg-slate-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                Tutup Dialog Pidato
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Dialog 2: Dedicated Video Sambutan Rektor */}
            {showVideoModal && rector_video_url && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => setShowVideoModal(false)}
                    />

                    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl border border-slate-800 flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Video */}
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900 text-white shrink-0">
                            <div className="flex items-center gap-2">
                                <Video className="w-5 h-5 text-rose-500" />
                                <h3 className="text-sm sm:text-base font-bold font-heading">
                                    Video Sambutan Rektor - {rector_name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowVideoModal(false)}
                                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={getYouTubeEmbedUrl(rector_video_url)}
                                title="Video Sambutan Rektor"
                                className="h-full w-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
