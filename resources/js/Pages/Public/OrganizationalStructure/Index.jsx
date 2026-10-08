import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    Landmark,
    Award,
    Building2,
    GraduationCap,
    Users,
    BookOpen,
    ShieldCheck,
    Layers,
    ChevronDown,
    Search,
    User,
    ArrowUpRight,
    Maximize2,
    Minimize2,
    SlidersHorizontal,
} from 'lucide-react';

const ICON_MAP = {
    Landmark: Landmark,
    Award: Award,
    Building2: Building2,
    GraduationCap: GraduationCap,
    Users: Users,
    BookOpen: BookOpen,
    ShieldCheck: ShieldCheck,
    Layers: Layers,
};

export default function OrganizationalStructureIndex({ structure = [] }) {
    // By default, open the first group (Rektorat)
    const [openGroups, setOpenGroups] = useState([0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const toggleGroup = (index) => {
        setOpenGroups((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const expandAll = () => {
        setOpenGroups(structure.map((_, i) => i));
    };

    const collapseAll = () => {
        setOpenGroups([]);
    };

    // Filter structure based on category and search query
    const filteredStructure = useMemo(() => {
        return structure
            .map((dept, index) => {
                // Category filter
                if (selectedCategory !== 'all' && dept.category !== selectedCategory) {
                    return null;
                }

                // Search query filter (matches dept title, member name, position, or nidn)
                if (!searchQuery.trim()) {
                    return { ...dept, originalIndex: index };
                }

                const query = searchQuery.toLowerCase();
                const titleMatches = dept.group.toLowerCase().includes(query);
                const matchingMembers = dept.members.filter(
                    (m) =>
                        m.name.toLowerCase().includes(query) ||
                        m.position.toLowerCase().includes(query) ||
                        (m.nidn && m.nidn.includes(query)) ||
                        (m.nip && m.nip.includes(query))
                );

                if (titleMatches || matchingMembers.length > 0) {
                    return {
                        ...dept,
                        originalIndex: index,
                        members: titleMatches ? dept.members : matchingMembers,
                    };
                }

                return null;
            })
            .filter(Boolean);
    }, [structure, selectedCategory, searchQuery]);

    const categories = [
        { id: 'all', label: 'Semua Struktur' },
        { id: 'rektorat', label: 'Rektorat' },
        { id: 'senat', label: 'Senat Akademik' },
        { id: 'fakultas', label: 'Fakultas & Dekanat' },
        { id: 'prodi', label: 'Program Studi' },
        { id: 'biro', label: 'Biro Administrasi' },
        { id: 'lembaga', label: 'Lembaga' },
        { id: 'badan_khusus', label: 'Badan Khusus' },
        { id: 'upt', label: 'UPT' },
    ];

    return (
        <PublicLayout>
            <Head>
                <title>Struktur Organisasi - Institut Teknologi dan Bisnis Tuban</title>
                <meta
                    name="description"
                    content="Bagan dan hierarki struktur kepemimpinan, rektorat, dekanat, kaprodi, biro, lembaga, dan unit kerja terpadu ITB Tuban."
                />
            </Head>

            <main className="bg-slate-50 min-h-screen pb-24">
                {/* Breadcrumb Header */}
                <div className="bg-white border-b border-slate-200">
                    <div className="site-container py-3.5 flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Link href="/" className="hover:text-primary-700 transition">
                            Beranda
                        </Link>
                        <span className="text-slate-300">/</span>
                        <Link href="/tentang" className="hover:text-primary-700 transition">
                            Tentang
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-semibold">Struktur Organisasi</span>
                    </div>
                </div>

                <div className="site-container pt-10 pb-6">
                    {/* Hero Title Section */}
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="inline-block bg-primary-100/70 text-primary-800 text-[11px] font-extrabold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-3 shadow-xs">
                            TATA KELOLA KAMPUS
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Struktur Organisasi
                        </h1>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Bagan tata kelola pimpinan institusi, dekanat, pengelola program studi,
                            biro layanan, lembaga riset, serta unit pelaksana teknis (UPT) di
                            lingkungan Institut Teknologi dan Bisnis Tuban.
                        </p>
                    </div>

                    {/* Filter & Toolbar */}
                    <div className="max-w-5xl mx-auto mb-8 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                            {/* Search Input */}
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama pejabat, jabatan, NIDN..."
                                    className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition"
                                />
                            </div>

                            {/* Expand / Collapse Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                <button
                                    type="button"
                                    onClick={expandAll}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                    title="Buka seluruh bagian"
                                >
                                    <Maximize2 className="w-3.5 h-3.5" /> Buka Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={collapseAll}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                    title="Tutup seluruh bagian"
                                >
                                    <Minimize2 className="w-3.5 h-3.5" /> Tutup Semua
                                </button>
                            </div>
                        </div>

                        {/* Category Chips */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2 flex items-center gap-1 shrink-0">
                                <SlidersHorizontal className="w-3.5 h-3.5" /> Kategori:
                            </span>
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                            isSelected
                                                ? 'bg-primary-700 text-white shadow-sm ring-2 ring-primary-700/20'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Organizational List (Grid Layout) */}
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {filteredStructure.length === 0 ? (
                            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-slate-800 mb-1">
                                    Tidak Ada Data Struktur Ditemukan
                                </h3>
                                <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
                                    Tidak ada pimpinan atau unit yang sesuai dengan kata kunci "
                                    {searchQuery}". Coba gunakan kata kunci lain atau pilih Semua Kategori.
                                </p>
                            </div>
                        ) : (
                            filteredStructure.map((dept) => {
                                const groupIndex = dept.originalIndex;
                                const isRectorate = dept.category === 'rektorat';
                                const isOpen = openGroups.includes(groupIndex);
                                const IconComponent = ICON_MAP[dept.icon] || Landmark;

                                return (
                                    <div
                                        key={dept.group}
                                        className={`bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden group hover:shadow-md transition-shadow duration-300 ${
                                            isRectorate ? 'md:col-span-2 ring-1 ring-primary-500/10' : 'col-span-1'
                                        }`}
                                    >
                                        {/* Group Header (Collapsible Toggle) */}
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(groupIndex)}
                                            className={`w-full text-left px-5 py-4 border-b flex items-center justify-between gap-4 transition-colors focus:outline-none ${
                                                isRectorate
                                                    ? 'bg-gradient-to-r from-primary-800 via-primary-700 to-primary-900 border-primary-950 text-white'
                                                    : 'bg-slate-50/70 border-slate-200 text-slate-900 hover:bg-slate-100/70'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                        isRectorate
                                                            ? 'bg-white/15 text-white backdrop-blur-xs'
                                                            : 'bg-primary-100 text-primary-700'
                                                    }`}
                                                >
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h2
                                                        className={`text-base md:text-lg font-extrabold tracking-tight truncate ${
                                                            isRectorate ? 'text-white' : 'text-slate-900'
                                                        }`}
                                                    >
                                                        {dept.group}
                                                    </h2>
                                                    {dept.description && (
                                                        <p
                                                            className={`text-xs line-clamp-1 ${
                                                                isRectorate ? 'text-white/80' : 'text-slate-500'
                                                            }`}
                                                        >
                                                            {dept.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span
                                                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                        isRectorate
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-slate-200 text-slate-700'
                                                    }`}
                                                >
                                                    {dept.members.length} Pejabat
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 transition-transform duration-300 ${
                                                        isRectorate ? 'text-white' : 'text-slate-400'
                                                    } ${isOpen ? 'rotate-180' : ''}`}
                                                />
                                            </div>
                                        </button>

                                        {/* Members List */}
                                        {isOpen && (
                                            <div className="divide-y divide-slate-100 animate-fadeIn">
                                                {dept.members.map((member, mIdx) => {
                                                    const Wrapper = member.slug ? Link : 'div';
                                                    const wrapperProps = member.slug
                                                        ? {
                                                              href: `/dosen-dan-tendik/${member.slug}`,
                                                              className:
                                                                  'flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 hover:bg-primary-50/40 transition-colors gap-3 group/member',
                                                          }
                                                        : {
                                                              className:
                                                                  'flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors gap-3',
                                                          };

                                                    return (
                                                        <Wrapper key={`${member.name}-${mIdx}`} {...wrapperProps}>
                                                            <div className="flex items-center gap-3.5 min-w-0">
                                                                {/* Member Photo */}
                                                                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-xs relative">
                                                                    {member.photo ? (
                                                                        <img
                                                                            src={member.photo}
                                                                            alt={member.name}
                                                                            className="w-full h-full object-cover object-top"
                                                                            loading="lazy"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                                                            <User className="w-6 h-6" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Name & Identifiers */}
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="block font-bold text-slate-900 text-sm leading-snug group-hover/member:text-primary-700 transition-colors">
                                                                            {member.name}
                                                                        </span>
                                                                        {member.slug && (
                                                                            <ArrowUpRight className="w-3.5 h-3.5 text-primary-600 opacity-0 group-hover/member:opacity-100 transition-opacity shrink-0" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
                                                                        {member.nidn && (
                                                                            <span>NIDN: {member.nidn}</span>
                                                                        )}
                                                                        {member.nidn && member.nip && <span>•</span>}
                                                                        {member.nip && (
                                                                            <span>NIP: {member.nip}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Position Badge */}
                                                            <div className="sm:text-right shrink-0">
                                                                <span className="inline-block text-[11px] md:text-xs font-bold text-secondary-700 bg-secondary-50 border border-secondary-200/80 px-3 py-1 rounded-lg shadow-2xs">
                                                                    {member.position}
                                                                </span>
                                                            </div>
                                                        </Wrapper>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
