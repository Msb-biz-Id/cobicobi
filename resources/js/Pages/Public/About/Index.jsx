import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Eye,
    Target,
    Landmark,
    ShieldCheck,
    GraduationCap,
    FlaskConical,
    HeartHandshake,
    Globe,
    Cpu,
    Award,
    Sparkles,
    Compass,
    CheckCircle2,
    Calendar,
    FileCheck,
} from 'lucide-react';

export default function AboutIndex({ webSetting, campusSetting }) {
    const siteTitle = webSetting?.site_title || 'Institut Teknologi dan Bisnis Tuban';

    const {
        about_background = '',
        about_image_url = null,
        about_vision = '',
        about_missions = [],
        about_goals = [],
        about_development_models = [],
        about_development_strategies = [],
        about_accreditation = {},
    } = campusSetting || {};

    const iconMap = {
        GraduationCap,
        FlaskConical,
        HeartHandshake,
        Globe,
        Cpu,
        Award,
        Sparkles,
        Compass,
    };

    const accreditationGrade = about_accreditation?.grade || 'UNGGUL';
    const accreditationInstitution = about_accreditation?.institution || 'BAN-PT';
    const accreditationSk = about_accreditation?.sk_number || 'SK BAN-PT No. 1284/SK/BAN-PT/Ak/PT/2024';
    const accreditationValid = about_accreditation?.valid_until || '2029';

    const defaultTujuan = [
        { title: 'Lulusan Berkualitas', icon: GraduationCap, bg: 'bg-primary-600', desc: 'Menghasilkan lulusan yang kompeten, berkarakter unggul, dan siap bersaing di pasar kerja global.' },
        { title: 'Riset & Inovasi Terapan', icon: FlaskConical, bg: 'bg-emerald-600', desc: 'Mendorong penelitian inovatif yang berkontribusi nyata pada kemajuan sains, teknologi, dan industri.' },
        { title: 'Pengabdian Masyarakat', icon: HeartHandshake, bg: 'bg-secondary-600', desc: 'Memberikan kontribusi berdampak positif kepada masyarakat melalui pendampingan dan solusi terapan.' },
        { title: 'Kerjasama Multinasional', icon: Globe, bg: 'bg-sky-600', desc: 'Membangun sinergi kolaboratif dengan universitas global dan mitra korporasi terkemuka.' },
        { title: 'Digital Smart Campus', icon: Cpu, bg: 'bg-indigo-600', desc: 'Memanfaatkan teknologi mutakhir dan kecerdasan artifisial dalam proses pembelajaran modern.' },
        { title: 'Integritas & Kepemimpinan', icon: Award, bg: 'bg-rose-600', desc: 'Menanamkan nilai-nilai etika luhur, kepemimpinan visioner, dan tanggung jawab sosial kemasyarakatan.' },
    ];

    const displayGoals = about_goals && about_goals.length > 0 ? about_goals : defaultTujuan;

    return (
        <PublicLayout>
            <Head title={`Profil Kampus & Tentang - ${siteTitle}`} />

            <main className="bg-slate-50 dark:bg-[#070b14] min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                    <div className="site-container py-3.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('home')} className="text-primary-600 hover:underline dark:text-primary-400 font-bold">
                            Beranda
                        </Link>
                        <span>&raquo;</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Profil Kampus</span>
                    </div>
                </div>

                {/* Hero Banner (Sesuai Profil.vue) */}
                <div className="relative h-[280px] sm:h-[320px] overflow-hidden bg-slate-950">
                    <img
                        src={about_image_url || '/images/building.png'}
                        alt="Profil Kampus"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/building.png';
                        }}
                        className="w-full h-full object-cover transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-slate-950/70 flex items-center">
                        <div className="site-container w-full space-y-2">
                            <span className="section-label !text-secondary-300">
                                PROFIL KAMPUS
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
                                {siteTitle}
                            </h1>
                            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
                                Dedikasi tridharma perguruan tinggi, integritas moral, dan pencapaian akademik berstandar internasional.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="site-container py-10 sm:py-14 space-y-14">
                    {/* 1. AKREDITASI MINIMALIS DI BAGIAN ATAS (Sesuai Permintaan User) */}
                    <div className="rounded-2xl border border-emerald-200/80 bg-white p-6 sm:p-7 shadow-xs dark:border-emerald-900/50 dark:bg-slate-900/90 transition-all hover:shadow-md">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                                    <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                            Status Akreditasi Resmi
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">•</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                            Lembaga: {accreditationInstitution}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                                        Terakreditasi <span className="text-emerald-600 dark:text-emerald-400">{accreditationGrade}</span> Nasional
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                                        Institusi memenuhi seluruh standar penjaminan mutu BAN-PT, menjamin kualitas penyelenggaraan kurikulum, kompetensi dosen, laboratorium, dan tata kelola perguruan tinggi unggulan.
                                    </p>
                                </div>
                            </div>

                            {/* Minimalist Info Pills */}
                            <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 w-full lg:w-auto">
                                <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>{accreditationSk}</span>
                                </div>
                                <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                                    <Calendar className="h-3.5 w-3.5 text-secondary-500" />
                                    <span>Berlaku hingga tahun {accreditationValid}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Visi & Misi Sesuai Profil.vue */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Visi */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center dark:bg-primary-950/50 dark:text-primary-400">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                            Arah Masa Depan
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                                            Visi Kampus
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                    {about_vision ||
                                        'Menjadi universitas unggulan bertaraf internasional yang menghasilkan lulusan berkarakter, berdaya saing global, dan berkontribusi nyata dalam pembangunan bangsa melalui Tri Dharma Perguruan Tinggi.'}
                                </p>
                            </div>
                        </div>

                        {/* Misi */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center dark:bg-secondary-950/50 dark:text-secondary-400">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400">
                                        Langkah Konkret
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                                        Misi Kampus
                                    </h3>
                                </div>
                            </div>

                            <ol className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-none">
                                {about_missions && about_missions.length > 0 ? (
                                    about_missions.map((m, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[11px] font-bold text-white mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span>{m}</span>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li className="flex items-start gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[11px] font-bold text-white">1</span>
                                            <span>Menyelenggarakan pendidikan berkualitas tinggi berbasis riset dan teknologi digital terapan.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[11px] font-bold text-white">2</span>
                                            <span>Mengembangkan penelitian inovatif yang berkontribusi nyata pada kemajuan ilmu pengetahuan dan industri.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[11px] font-bold text-white">3</span>
                                            <span>Melaksanakan pengabdian masyarakat yang berdampak positif dan berkelanjutan bagi kemandirian bangsa.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[11px] font-bold text-white">4</span>
                                            <span>Membangun kerja sama strategis dengan institusi riset dan mitra industri nasional serta global.</span>
                                        </li>
                                    </>
                                )}
                            </ol>
                        </div>
                    </div>

                    {/* 3. Sejarah & Latar Belakang Pendirian */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/50 dark:text-emerald-400">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    Historis &amp; Rekam Jejak
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                                    Sejarah &amp; Latar Belakang Pendirian
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7 space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {about_background ||
                                    'Institut Teknologi dan Bisnis didirikan dengan visi menjadi pusat pendidikan unggulan yang adaptif terhadap dinamika era digital. Dengan fokus pada teknologi terapan dan kepemimpinan bisnis, kampus terus berkembang untuk menjawab tantangan industri masa depan.\n\nSaat ini, kampus telah memiliki berbagai program studi unggulan, ribuan mahasiswa aktif, dan tenaga pendidik berkualifikasi tinggi yang berdedikasi membimbing generasi penerus bangsa.'}
                            </div>

                            <div className="lg:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                                <img
                                    src="/images/campus-hero.png"
                                    alt="Sejarah Kampus"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Model Pengembangan Kampus */}
                    {about_development_models && about_development_models.length > 0 && (
                        <div className="space-y-6">
                            <div className="text-center max-w-xl mx-auto space-y-2">
                                <span className="section-label">
                                    MODEL PENGEMBANGAN
                                </span>
                                <h3 className="section-title text-center">
                                    Pilar Ekosistem &amp; Model Transformasi
                                </h3>
                                <div className="section-underline mx-auto" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {about_development_models.map((model, idx) => {
                                    const IconComp = iconMap[model.icon] || Sparkles;
                                    return (
                                        <div
                                            key={idx}
                                            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 transition-all space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center dark:bg-primary-950/50 dark:text-primary-400">
                                                    <IconComp className="w-5 h-5" />
                                                </div>
                                                {model.tag && (
                                                    <span className="text-[10px] font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider bg-secondary-50 dark:bg-secondary-950/40 px-2 py-0.5 rounded-full">
                                                        {model.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug font-heading">
                                                {model.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                {model.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 5. Tujuan Pendidikan Sesuai Profil.vue */}
                    <div className="space-y-8">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="section-label">
                                TUJUAN
                            </span>
                            <h3 className="section-title text-center">
                                Tujuan Pendidikan &amp; Luaran Lulusan
                            </h3>
                            <div className="section-underline mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayGoals.map((g, idx) => {
                                const IconComp = (typeof g.icon === 'string' && iconMap[g.icon]) ? iconMap[g.icon] : (g.icon && typeof g.icon !== 'string' ? g.icon : GraduationCap);
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 space-y-3"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-600/20">
                                            <IconComp className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                                            {g.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {g.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 6. Strategi & Roadmap Pengembangan */}
                    {about_development_strategies && about_development_strategies.length > 0 && (
                        <div className="space-y-6">
                            <div className="text-center max-w-xl mx-auto space-y-2">
                                <span className="section-label">
                                    ROADMAP &amp; STRATEGI
                                </span>
                                <h3 className="section-title text-center">
                                    Rencana Strategis Pengembangan
                                </h3>
                                <div className="section-underline mx-auto" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {about_development_strategies.map((strat, idx) => (
                                    <div
                                        key={idx}
                                        className="relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                                {strat.phase}
                                            </span>
                                            {strat.target_year && (
                                                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                                                    Target {strat.target_year}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug font-heading">
                                            {strat.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {strat.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}
