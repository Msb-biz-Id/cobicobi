import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    GraduationCap,
    UserCheck,
    Save,
    RefreshCw,
    Plus,
    Trash2,
    Edit3,
    ExternalLink,
    BookOpen,
    Globe,
    Share2,
    Calendar,
    Award,
    CheckCircle2,
    AlertCircle,
    Building2,
    Mail,
    Phone,
    MapPin,
    Rss,
    FileText,
    Sparkles,
    Image as ImageIcon,
    X,
} from 'lucide-react';
import Button from '@/Components/UI/Button';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon } from '@/Components/Icons/SocialIcons';

export default function StaffBio({
    profile,
    faculties = [],
    studyPrograms = [],
    academicPositions = [],
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: profile?.name || '',
        type: profile?.type || 'dosen',
        front_title: profile?.front_title || '',
        back_title: profile?.back_title || '',
        nidn: profile?.nidn || '',
        nip: profile?.nip || '',
        gender: profile?.gender || 'L',
        faculty: profile?.faculty || faculties[0] || '',
        study_program: profile?.study_program || studyPrograms[0] || '',
        academic_position: profile?.academic_position || academicPositions[0] || '',
        structural_position: profile?.structural_position || '',
        employment_status: profile?.employment_status || 'Dosen Tetap',
        expertise: Array.isArray(profile?.expertise) ? profile.expertise : [],
        bio: profile?.bio || '',
        education_history: Array.isArray(profile?.education_history) ? profile.education_history : [],
        office_address: profile?.office_address || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        avatar_path: profile?.avatar_path || '',
        google_scholar_url: profile?.google_scholar_url || '',
        scopus_id: profile?.scopus_id || '',
        scopus_url: profile?.scopus_url || '',
        sinta_id: profile?.sinta_id || '',
        sinta_url: profile?.sinta_url || '',
        orcid_id: profile?.orcid_id || '',
        orcid_url: profile?.orcid_url || '',
        research_gate_url: profile?.research_gate_url || '',
        linkedin_url: profile?.linkedin_url || '',
        facebook_url: profile?.facebook_url || '',
        instagram_url: profile?.instagram_url || '',
        x_url: profile?.x_url || '',
        tiktok_url: profile?.tiktok_url || '',
        website_url: profile?.website_url || '',
        rss_feed_url: profile?.rss_feed_url || '',
    });

    const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
    const [newExpertiseTag, setNewExpertiseTag] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [pubFilter, setPubFilter] = useState('all'); // all, scholar, rss, manual
    const [pubSearch, setPubSearch] = useState('');

    // Publication Modal State
    const [isPubModalOpen, setIsPubModalOpen] = useState(false);
    const [editingPub, setEditingPub] = useState(null);
    const pubForm = useForm({
        title: '',
        authors: '',
        publication_name: '',
        year: new Date().getFullYear(),
        type: 'journal',
        doi: '',
        url: '',
        citations_count: 0,
        description: '',
    });

    const handleSaveBio = (e) => {
        e.preventDefault();
        put(route('profile.staff.update'), {
            preserveScroll: true,
        });
    };

    // Google Scholar & RSS Sync Trigger
    const handleSyncScholar = () => {
        setIsSyncing(true);
        router.post(
            route('profile.staff.sync-scholar'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsSyncing(false),
            }
        );
    };

    // Education History Handlers
    const addEducation = () => {
        setData('education_history', [
            ...data.education_history,
            { degree: 'S1', institution: '', major: '', graduation_year: new Date().getFullYear() },
        ]);
    };

    const updateEducation = (index, field, value) => {
        const next = [...data.education_history];
        next[index][field] = value;
        setData('education_history', next);
    };

    const removeEducation = (index) => {
        setData(
            'education_history',
            data.education_history.filter((_, i) => i !== index)
        );
    };

    // Expertise Tags Handlers
    const addExpertiseTag = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            const tag = newExpertiseTag.trim();
            if (tag && !data.expertise.includes(tag)) {
                setData('expertise', [...data.expertise, tag]);
                setNewExpertiseTag('');
            }
        }
    };

    const removeExpertiseTag = (tagToRemove) => {
        setData(
            'expertise',
            data.expertise.filter((t) => t !== tagToRemove)
        );
    };

    // Publication Modal Handlers
    const openAddPubModal = () => {
        setEditingPub(null);
        pubForm.setData({
            title: '',
            authors: data.name || '',
            publication_name: '',
            year: new Date().getFullYear(),
            type: 'journal',
            doi: '',
            url: '',
            citations_count: 0,
            description: '',
        });
        setIsPubModalOpen(true);
    };

    const openEditPubModal = (pub) => {
        setEditingPub(pub);
        pubForm.setData({
            title: pub.title || '',
            authors: pub.authors || '',
            publication_name: pub.publication_name || '',
            year: pub.year || new Date().getFullYear(),
            type: pub.type || 'journal',
            doi: pub.doi || '',
            url: pub.url || '',
            citations_count: pub.citations_count || 0,
            description: pub.description || '',
        });
        setIsPubModalOpen(true);
    };

    const handleSavePub = (e) => {
        e.preventDefault();
        if (editingPub) {
            pubForm.put(route('profile.staff.publications.update', editingPub.id), {
                onSuccess: () => setIsPubModalOpen(false),
                preserveScroll: true,
            });
        } else {
            pubForm.post(route('profile.staff.publications.store'), {
                onSuccess: () => setIsPubModalOpen(false),
                preserveScroll: true,
            });
        }
    };

    const handleDeletePub = (pub) => {
        if (confirm(`Hapus publikasi "${pub.title}"?`)) {
            router.delete(route('profile.staff.publications.destroy', pub.id), {
                preserveScroll: true,
            });
        }
    };

    // Filter publications
    const allPubs = Array.isArray(profile?.publications) ? profile.publications : [];
    const filteredPubs = allPubs.filter((p) => {
        if (pubFilter !== 'all' && p.source !== pubFilter) return false;
        if (pubSearch) {
            const q = pubSearch.toLowerCase();
            return (
                (p.title && p.title.toLowerCase().includes(q)) ||
                (p.publication_name && p.publication_name.toLowerCase().includes(q)) ||
                (p.authors && p.authors.toLowerCase().includes(q))
            );
        }
        return true;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Biodata Dosen &amp; Portofolio Publikasi Ilmiah" />

            <div className="space-y-8 pb-20 max-w-7xl mx-auto">
                {/* Header Action Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                <GraduationCap className="h-3.5 w-3.5" />
                                Portal Civitas Akademika
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {data.type === 'dosen' ? 'Dosen / Tenaga Pendidik' : 'Tenaga Kependidikan'}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Biodata &amp; Portofolio Ilmiah Saya
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Kelola profil biodata resmi, integrasi Google Scholar, RSS Feed, serta publikasi karya ilmiah Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {profile?.slug && (
                            <a
                                href={route('public.lecturers.show', profile.slug)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Lihat Profil Publik
                            </a>
                        )}
                        <Button
                            type="button"
                            onClick={handleSaveBio}
                            disabled={processing}
                            variant="primary"
                            className="gap-1.5"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Biodata'}
                        </Button>
                    </div>
                </div>

                {/* Citation Metrics Showcase Card */}
                {data.type === 'dosen' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                Total Sitasi
                            </span>
                            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
                                {profile?.total_citations || 0}
                            </span>
                            <span className="text-[10px] text-slate-400">Sitasi Google Scholar</span>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                h-index
                            </span>
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                                {profile?.h_index || 0}
                            </span>
                            <span className="text-[10px] text-slate-400">Indeks Produktivitas Riset</span>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                i10-index
                            </span>
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                                {profile?.i10_index || 0}
                            </span>
                            <span className="text-[10px] text-slate-400">Artikel &gt;= 10 Sitasi</span>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Total Publikasi
                                </span>
                                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                                    {allPubs.length}
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                                {profile?.last_synced_at
                                    ? `Update: ${new Date(profile.last_synced_at).toLocaleDateString('id-ID')}`
                                    : 'Belum pernah disinkronkan'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Main 2-Column Form Layout */}
                <form onSubmit={handleSaveBio} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2 Cols): Bio, Edu History, Expertise, & TipTap Bio */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Identitas Resmi */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-indigo-500" />
                                Identitas &amp; Gelar Akademik
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="sm:col-span-1">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Gelar Depan
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Prof. Dr. Ir."
                                        value={data.front_title}
                                        onChange={(e) => setData('front_title', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Lengkap (Tanpa Gelar) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Gelar Belakang
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="S.T., M.Kom., Ph.D."
                                        value={data.back_title}
                                        onChange={(e) => setData('back_title', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis Civitas
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="dosen">Dosen / Tenaga Pendidik</option>
                                        <option value="tendik">Tenaga Kependidikan (Staf)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        {data.type === 'dosen' ? 'NIDN / NUPTK / NIDK' : 'NIP / NIK Pegawai'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="0012058401"
                                        value={data.type === 'dosen' ? data.nidn : data.nip}
                                        onChange={(e) =>
                                            setData(data.type === 'dosen' ? 'nidn' : 'nip', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Afiliasi Akademik & Jabatan */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                Afiliasi Fakultas &amp; Program Studi
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Fakultas / Unit Kerja
                                    </label>
                                    <select
                                        value={data.faculty}
                                        onChange={(e) => setData('faculty', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="">Pilih Fakultas</option>
                                        {faculties.map((f) => (
                                            <option key={f} value={f}>
                                                {f}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Program Studi / Homebase
                                    </label>
                                    <select
                                        value={data.study_program}
                                        onChange={(e) => setData('study_program', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="">Pilih Program Studi</option>
                                        {studyPrograms.map((p) => (
                                            <option key={p} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jabatan Fungsional Akademik
                                    </label>
                                    <select
                                        value={data.academic_position}
                                        onChange={(e) => setData('academic_position', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="">Pilih Jabatan Fungsional</option>
                                        {academicPositions.map((pos) => (
                                            <option key={pos} value={pos}>
                                                {pos}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jabatan Tambahan / Struktural (Jika Ada)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Ketua Program Studi, Kepala Lab AI"
                                        value={data.structural_position}
                                        onChange={(e) => setData('structural_position', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bidang Keahlian / Research Interests */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                Bidang Keahlian &amp; Fokus Riset (Research Interests)
                            </h2>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ketik keahlian (contoh: Artificial Intelligence, Cyber Security) lalu tekan Enter"
                                    value={newExpertiseTag}
                                    onChange={(e) => setNewExpertiseTag(e.target.value)}
                                    onKeyDown={addExpertiseTag}
                                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <Button type="button" size="sm" variant="outline" onClick={addExpertiseTag}>
                                    Tambah
                                </Button>
                            </div>

                            {data.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {data.expertise.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeExpertiseTag(tag)}
                                                className="text-indigo-400 hover:text-indigo-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Riwayat Pendidikan (S1, S2, S3) */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                                    Riwayat Pendidikan Tinggi
                                </h2>
                                <Button type="button" size="sm" variant="outline" onClick={addEducation} className="gap-1">
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah Jenjang
                                </Button>
                            </div>

                            {data.education_history.length > 0 ? (
                                <div className="space-y-3">
                                    {data.education_history.map((edu, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 items-center"
                                        >
                                            <div className="sm:col-span-2">
                                                <select
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                >
                                                    <option value="D3">D3</option>
                                                    <option value="D4">D4</option>
                                                    <option value="S1">S1</option>
                                                    <option value="S2">S2</option>
                                                    <option value="S3">S3</option>
                                                    <option value="Post-Doc">Post-Doc</option>
                                                </select>
                                            </div>

                                            <div className="sm:col-span-4">
                                                <input
                                                    type="text"
                                                    placeholder="Nama Universitas / Institusi"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />
                                            </div>

                                            <div className="sm:col-span-4">
                                                <input
                                                    type="text"
                                                    placeholder="Program Studi / Jurusan"
                                                    value={edu.major}
                                                    onChange={(e) => updateEducation(idx, 'major', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />
                                            </div>

                                            <div className="sm:col-span-1">
                                                <input
                                                    type="number"
                                                    placeholder="Tahun"
                                                    value={edu.graduation_year}
                                                    onChange={(e) =>
                                                        updateEducation(idx, 'graduation_year', e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-center"
                                                />
                                            </div>

                                            <div className="sm:col-span-1 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeEducation(idx)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                    Belum ada data riwayat pendidikan. Klik tombol &ldquo;Tambah Jenjang&rdquo; di atas.
                                </p>
                            )}
                        </div>

                        {/* Biografi Lengkap (TipTap Editor) */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-500" />
                                Biografi &amp; Deskripsi Diri
                            </h2>

                            <TipTapEditor
                                content={data.bio}
                                onChange={(html) => setData('bio', html)}
                                placeholder="Tuliskan biografi singkat, pengalaman mengajar, riset, atau pengabdian masyarakat..."
                            />
                        </div>
                    </div>

                    {/* Right Column (1 Col): Avatar, Contacts, Google Scholar & RSS Auto-Feed */}
                    <div className="space-y-6">
                        {/* Foto Profil Akademik */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3 text-center">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Foto Resmi Civitas
                            </h3>

                            <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                <img
                                    src={data.avatar_path || profile?.avatar_url}
                                    alt={data.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex items-center justify-center gap-2 pt-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsAvatarPickerOpen(true)}
                                    className="gap-1 text-xs"
                                >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    Pilih dari Media
                                </Button>
                                {data.avatar_path && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="danger"
                                        onClick={() => setData('avatar_path', '')}
                                        className="text-xs"
                                    >
                                        Hapus
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* FITUR AUTO-FEED: Google Scholar & RSS Feed Integration Card */}
                        <div className="rounded-3xl border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/20 p-6 shadow-xs dark:border-indigo-900/60 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 space-y-4">
                            <div className="flex items-center justify-between border-b border-indigo-100 pb-3 dark:border-indigo-900/60">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                                        Google Scholar &amp; RSS Auto-Feed
                                    </h3>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Tempelkan link profil Google Scholar Anda di bawah ini, lalu klik tombol sinkronisasi untuk otomatis menarik daftar publikasi, sitasi, dan h-index.
                            </p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Link Profil Google Scholar
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://scholar.google.com/citations?user=..."
                                    value={data.google_scholar_url}
                                    onChange={(e) => setData('google_scholar_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <span className="text-[10px] text-slate-400 block mt-1">
                                    Contoh: https://scholar.google.com/citations?user=xyz123abc
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Rss className="h-3 w-3 text-amber-500" />
                                    Link RSS / Atom Feed Publikasi (Opsional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://repository.univ.ac.id/feed.xml"
                                    value={data.rss_feed_url}
                                    onChange={(e) => setData('rss_feed_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                                <span className="text-[10px] text-slate-400 block mt-1">
                                    Feed dari repositori kampus, jurnal OJS, atau blog riset pribadi.
                                </span>
                            </div>

                            {/* Tombol Eksekusi Sync Sekarang */}
                            <button
                                type="button"
                                onClick={handleSyncScholar}
                                disabled={isSyncing || (!data.google_scholar_url && !data.rss_feed_url)}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
                            >
                                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                {isSyncing ? 'Sedang Mensinkronkan...' : 'Sinkronkan Google Scholar & RSS'}
                            </button>
                        </div>

                        {/* ID Akademik Tambahan: Scopus, SINTA, ORCID */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 dark:border-slate-800">
                                ID Repositori &amp; Indeks Akademik
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Scopus ID / URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="Scopus Author ID atau URL profil"
                                    value={data.scopus_url || data.scopus_id}
                                    onChange={(e) => setData('scopus_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    SINTA ID / URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="SINTA ID atau URL profil Kemendikbud"
                                    value={data.sinta_url || data.sinta_id}
                                    onChange={(e) => setData('sinta_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    ORCID ID / URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="0000-0002-1825-0097"
                                    value={data.orcid_url || data.orcid_id}
                                    onChange={(e) => setData('orcid_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Website / Blog Akademik Pribadi
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://dosen.ac.id"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Akun Media Sosial Resmi / Pribadi */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 dark:border-slate-800 flex items-center justify-between">
                                <span>Akun Media Sosial</span>
                                <span className="text-[10px] lowercase font-normal text-indigo-500">FB • IG • X • TikTok</span>
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <FacebookIcon className="h-3.5 w-3.5 text-blue-600" />
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://facebook.com/username"
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <InstagramIcon className="h-3.5 w-3.5 text-pink-600" />
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://instagram.com/username"
                                    value={data.instagram_url}
                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <XIcon className="h-3.5 w-3.5 text-slate-900 dark:text-white" />
                                    X (Twitter)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://x.com/username"
                                    value={data.x_url}
                                    onChange={(e) => setData('x_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <TikTokIcon className="h-3.5 w-3.5 text-slate-900 dark:text-white" />
                                    TikTok
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://tiktok.com/@username"
                                    value={data.tiktok_url}
                                    onChange={(e) => setData('tiktok_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Kontak & Ruang Kantor */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 dark:border-slate-800">
                                Kontak &amp; Lokasi Kerja
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Email Resmi Kampus
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nomor Telepon / WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Ruang Kantor / Gedung
                                </label>
                                <input
                                    type="text"
                                    placeholder="Gedung Rektorat Lt. 3 / Lab AI Gedung F"
                                    value={data.office_address}
                                    onChange={(e) => setData('office_address', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* SEKSI DAFTAR PUBLIKASI & KARYA ILMIAH (AUTO-FEED & MANUAL ENTRY) */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-600" />
                                Daftar Publikasi &amp; Portofolio Karya Ilmiah ({allPubs.length})
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Publikasi hasil auto-sync Google Scholar / RSS dan input manual (buku, paten, pengabdian).
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="primary"
                                onClick={openAddPubModal}
                                className="gap-1.5"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Publikasi Manual
                            </Button>
                        </div>
                    </div>

                    {/* Filter Tabs & Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex rounded-xl bg-slate-100 p-1 text-xs dark:bg-slate-800 self-start">
                            <button
                                type="button"
                                onClick={() => setPubFilter('all')}
                                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                                    pubFilter === 'all'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Semua ({allPubs.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setPubFilter('scholar')}
                                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                                    pubFilter === 'scholar'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Google Scholar ({allPubs.filter((p) => p.source === 'scholar').length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setPubFilter('rss')}
                                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                                    pubFilter === 'rss'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                RSS Feed ({allPubs.filter((p) => p.source === 'rss').length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setPubFilter('manual')}
                                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                                    pubFilter === 'manual'
                                        ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}
                            >
                                Manual ({allPubs.filter((p) => p.source === 'manual').length})
                            </button>
                        </div>

                        <div className="sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari judul paper..."
                                value={pubSearch}
                                onChange={(e) => setPubSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Publication List Table / Cards */}
                    {filteredPubs.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {filteredPubs.map((pub) => (
                                <div
                                    key={pub.id}
                                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                                >
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                                    pub.source === 'scholar'
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                                                        : pub.source === 'rss'
                                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                }`}
                                            >
                                                {pub.source_label || pub.source}
                                            </span>
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {pub.type_label || pub.type}
                                            </span>
                                            {pub.year && (
                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {pub.year}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                            {pub.url ? (
                                                <a
                                                    href={pub.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                                                >
                                                    {pub.title}
                                                    <ExternalLink className="h-3 w-3 inline text-slate-400" />
                                                </a>
                                            ) : (
                                                pub.title
                                            )}
                                        </h3>

                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {pub.authors && <span className="font-medium">{pub.authors}</span>}
                                            {pub.authors && pub.publication_name && ' — '}
                                            {pub.publication_name && (
                                                <span className="italic">{pub.publication_name}</span>
                                            )}
                                        </p>

                                        {pub.citations_count > 0 && (
                                            <span className="inline-block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                                {pub.citations_count} Sitasi
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                        {pub.source === 'manual' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditPubModal(pub)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePub(pub)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Belum ada publikasi ilmiah yang terdaftar.
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Tempelkan link Google Scholar Anda lalu klik &ldquo;Sinkronkan&rdquo;, atau klik tombol &ldquo;Tambah Publikasi Manual&rdquo;.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isAvatarPickerOpen}
                onClose={() => setIsAvatarPickerOpen(false)}
                onSelect={(media) => {
                    setData('avatar_path', media.image_url);
                    setIsAvatarPickerOpen(false);
                }}
                title="Pilih Foto Resmi Dosen / Tendik"
            />

            {/* Modal Tambah / Edit Publikasi Manual */}
            {isPubModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingPub ? 'Edit Publikasi Ilmiah' : 'Tambah Publikasi Ilmiah Manual'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsPubModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSavePub} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Judul Artikel / Buku / Paten *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={pubForm.data.title}
                                    onChange={(e) => pubForm.setData('title', e.target.value)}
                                    placeholder="Contoh: Implementasi Deep Learning pada Deteksi Citra Medis..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tipe Karya
                                    </label>
                                    <select
                                        value={pubForm.data.type}
                                        onChange={(e) => pubForm.setData('type', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                    >
                                        <option value="journal">Jurnal Ilmiah</option>
                                        <option value="conference">Prosiding Konferensi</option>
                                        <option value="book">Buku / Monograf</option>
                                        <option value="patent">Paten / HKI</option>
                                        <option value="community_service">Pengabdian Masyarakat</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tahun Terbit
                                    </label>
                                    <input
                                        type="number"
                                        value={pubForm.data.year}
                                        onChange={(e) => pubForm.setData('year', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Daftar Penulis (Authors)
                                </label>
                                <input
                                    type="text"
                                    value={pubForm.data.authors}
                                    onChange={(e) => pubForm.setData('authors', e.target.value)}
                                    placeholder="Contoh: Budi Santoso, Siti Aminah, John Doe"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Jurnal / Penerbit / Penyelenggara
                                </label>
                                <input
                                    type="text"
                                    value={pubForm.data.publication_name}
                                    onChange={(e) => pubForm.setData('publication_name', e.target.value)}
                                    placeholder="Contoh: IEEE Access / Penerbit Andi / Jurnal Nasional Terakreditasi SINTA 2"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Link URL Paper / Dokumen
                                    </label>
                                    <input
                                        type="url"
                                        value={pubForm.data.url}
                                        onChange={(e) => pubForm.setData('url', e.target.value)}
                                        placeholder="https://doi.org/..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jumlah Sitasi (Jika Ada)
                                    </label>
                                    <input
                                        type="number"
                                        value={pubForm.data.citations_count}
                                        onChange={(e) => pubForm.setData('citations_count', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsPubModalOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={pubForm.processing}
                                >
                                    {editingPub ? 'Perbarui Karya' : 'Tambahkan Karya'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
