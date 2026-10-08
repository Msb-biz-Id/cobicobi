import { Link } from '@inertiajs/react';
import { GraduationCap, Phone, Sparkles } from 'lucide-react';

export default function CTASection({ siteTitle = 'Institut Teknologi Bandung Tuban' }) {
    return (
        <section className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary-400 blur-3xl" />
            </div>

            <div className="site-container text-center relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-secondary-300 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Penerimaan Mahasiswa Baru Telah Dibuka
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto font-heading">
                    Siap Mengukir Prestasi Bersama{' '}
                    <span className="text-secondary-400">{siteTitle}</span>?
                </h2>

                <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                    Daftarkan dirimu sekarang dan mulailah perjalanan akademik berkelas dunia bersama komunitas inovator dan pemimpin masa depan.
                </p>

                <div className="flex justify-center gap-4 flex-wrap pt-4">
                    <Link
                        href={route('public.faculties.index')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-secondary-400 px-8 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-secondary-400/25 hover:bg-secondary-300 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <GraduationCap className="w-4 h-4" />
                        Jelajahi Fakultas &amp; Prodi
                    </Link>

                    <Link
                        href={route('public.posts.index')}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-white/20 transition-all"
                    >
                        <Phone className="w-4 h-4 text-secondary-300" />
                        Informasi Pendaftaran
                    </Link>
                </div>
            </div>
        </section>
    );
}
