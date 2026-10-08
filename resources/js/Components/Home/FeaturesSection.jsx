import {
    Award,
    BookOpen,
    Users,
    Laptop,
    Sparkles,
    Rocket,
    Factory,
    Leaf,
    GraduationCap,
    Globe,
    Building2,
    Cpu,
    ShieldCheck,
    Landmark,
    Compass,
    HeartHandshake,
    Target,
    FlaskConical,
    Lightbulb,
    CheckCircle2,
    BarChart3,
    Briefcase,
    Zap,
    TrendingUp,
    Trophy,
    Star,
    Layers,
    School,
} from 'lucide-react';

export default function FeaturesSection({ models = [] }) {
    const defaultFeatures = [
        {
            title: 'Akreditasi Unggul',
            icon: 'Award',
            iconBg: 'bg-secondary-500/80',
            desc: 'Terakreditasi A oleh BAN-PT dengan predikat unggul untuk seluruh program studi dan tata kelola perguruan tinggi.',
        },
        {
            title: 'Kurikulum Modern & AI-Ready',
            icon: 'BookOpen',
            iconBg: 'bg-emerald-500/80',
            desc: 'Kurikulum berbasis proyek industri riil dan kecerdasan artifisial yang selalu selaras dengan kebutuhan dunia kerja global.',
        },
        {
            title: 'Dosen & Praktisi Ahli',
            icon: 'Users',
            iconBg: 'bg-primary-500/80',
            desc: 'Tenaga pendidik profesional berkualifikasi doktoral S3 serta praktisi industri bereputasi nasional dan internasional.',
        },
        {
            title: 'Fasilitas Smart Campus',
            icon: 'Laptop',
            iconBg: 'bg-purple-500/80',
            desc: 'Laboratorium riset mutakhir, perpustakaan digital interaktif berakses jurnal global, dan smart classroom modern.',
        },
    ];

    const iconMap = {
        Award,
        BookOpen,
        Users,
        Laptop,
        Sparkles,
        Rocket,
        Factory,
        Leaf,
        GraduationCap,
        Globe,
        Building2,
        Cpu,
        ShieldCheck,
        Landmark,
        Compass,
        HeartHandshake,
        Target,
        FlaskConical,
        Lightbulb,
        CheckCircle2,
        BarChart3,
        Briefcase,
        Zap,
        TrendingUp,
        Trophy,
        Star,
        Layers,
        School,
    };

    // Urutan ikon cerdas jika data belum memiliki icon terdefinisi
    const smartFallbackIcons = [Landmark, Rocket, Globe, Award, Target, Cpu, ShieldCheck, FlaskConical];

    const displayList = models && models.length > 0 ? models : defaultFeatures;

    return (
        <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
            {/* Background Texture & Circles Sesuai Vue */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-white/20" />
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full border-2 border-white/10" />
            </div>

            <div className="site-container relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <span className="section-label !text-secondary-300">
                        KEUNGGULAN KAMI
                    </span>
                    <h2 className="section-title !text-white text-center">
                        Mengapa Memilih Kampus Kami?
                    </h2>
                    <div className="section-underline mx-auto" />
                    <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
                        Kami menawarkan ekosistem pendidikan terbaik dengan berbagai keunggulan kompetitif untuk mengantarkan setiap talenta mencapai potensi tertingginya.
                    </p>
                </div>

                {/* Grid Ramping, Rata & Seimbang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
                    {displayList.map((item, idx) => {
                        const IconComponent =
                            typeof item.icon === 'string' && iconMap[item.icon]
                                ? iconMap[item.icon]
                                : item.icon && typeof item.icon !== 'string'
                                ? item.icon
                                : smartFallbackIcons[idx % smartFallbackIcons.length] || Sparkles;

                        return (
                            <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full shadow-xs"
                            >
                                <div>
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform bg-white/20 text-white shadow-2xs">
                                        <IconComponent className="h-5 w-5 text-secondary-300 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2 leading-snug font-heading">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-white/75 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
