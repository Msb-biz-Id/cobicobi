import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Save,
    GraduationCap,
    UserCheck,
    Building2,
    Plus,
    Trash2,
    Globe,
    FileText,
    Image as ImageIcon,
    Sparkles,
    X,
} from 'lucide-react';
import Button from '@/Components/UI/Button';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';
import { FacebookIcon, InstagramIcon, XIcon, TikTokIcon } from '@/Components/Icons/SocialIcons';

export default function Edit({
    staff,
    availableUsers = [],
    faculties = [],
    studyPrograms = [],
    academicPositions = [],
}) {
    const isEdit = Boolean(staff?.id);

    const { data, setData, post, put, processing, errors } = useForm({
        user_id: staff?.user_id || '',
        name: staff?.name || '',
        slug: staff?.slug || '',
        type: staff?.type || 'dosen',
        front_title: staff?.front_title || '',
        back_title: staff?.back_title || '',
        nidn: staff?.nidn || '',
        nip: staff?.nip || '',
        gender: staff?.gender || 'L',
        faculty: staff?.faculty || faculties[0] || '',
        study_program: staff?.study_program || studyPrograms[0] || '',
        academic_position: staff?.academic_position || academicPositions[0] || '',
        structural_position: staff?.structural_position || '',
        employment_status: staff?.employment_status || 'Dosen Tetap',
        expertise: Array.isArray(staff?.expertise) ? staff.expertise : [],
        bio: staff?.bio || '',
        education_history: Array.isArray(staff?.education_history) ? staff.education_history : [],
        office_address: staff?.office_address || '',
        email: staff?.email || '',
        phone: staff?.phone || '',
        avatar_path: staff?.avatar_path || '',
        google_scholar_url: staff?.google_scholar_url || '',
        scopus_id: staff?.scopus_id || '',
        scopus_url: staff?.scopus_url || '',
        sinta_id: staff?.sinta_id || '',
        sinta_url: staff?.sinta_url || '',
        orcid_id: staff?.orcid_id || '',
        orcid_url: staff?.orcid_url || '',
        research_gate_url: staff?.research_gate_url || '',
        linkedin_url: staff?.linkedin_url || '',
        facebook_url: staff?.facebook_url || '',
        instagram_url: staff?.instagram_url || '',
        x_url: staff?.x_url || '',
        tiktok_url: staff?.tiktok_url || '',
        website_url: staff?.website_url || '',
        rss_feed_url: staff?.rss_feed_url || '',
        is_active: staff ? Boolean(staff.is_active) : true,
        is_featured: Boolean(staff?.is_featured),
    });

    const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
    const [newExpertiseTag, setNewExpertiseTag] = useState('');

    const handleNameChange = (val) => {
        setData((prev) => ({
            ...prev,
            name: val,
            slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        }));
    };

    const handleUserSelect = (userId) => {
        setData('user_id', userId);
        if (userId && !isEdit) {
            const foundUser = availableUsers.find((u) => String(u.id) === String(userId));
            if (foundUser) {
                setData((prev) => ({
                    ...prev,
                    user_id: userId,
                    name: prev.name || foundUser.name,
                    email: prev.email || foundUser.email,
                }));
            }
        }
    };

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
        setData('education_history', data.education_history.filter((_, i) => i !== index));
    };

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

    const removeExpertiseTag = (tag) => {
        setData('expertise', data.expertise.filter((t) => t !== tag));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('staff.update', staff.id));
        } else {
            post(route('staff.store'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEdit ? `Edit Dosen: ${data.name}` : 'Tambah Civitas Dosen / Tendik Baru'} />

            <form onSubmit={handleSubmit} className="space-y-6 pb-20 max-w-7xl mx-auto">
                {/* Header Action Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20 bg-slate-50/90 backdrop-blur-md py-3 dark:bg-[#090d16]/90 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('staff.index')}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {isEdit ? `Edit Profil: ${staff.full_name_with_titles}` : 'Tambah Civitas Dosen / Tendik'}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Lengkapi identitas akademik, riwayat pendidikan, dan integrasi Google Scholar.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={processing} variant="primary" className="gap-1.5">
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Terbitkan Civitas'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Main Info, Affiliation, Education, Bio */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Identitas Resmi */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-indigo-500" />
                                Identitas &amp; Gelar Civitas
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="sm:col-span-1">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Gelar Depan
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Prof. Dr."
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
                                        onChange={(e) => handleNameChange(e.target.value)}
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
                                        placeholder="S.T., M.Kom."
                                        value={data.back_title}
                                        onChange={(e) => setData('back_title', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tipe Civitas
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="dosen">Dosen / Tenaga Pendidik</option>
                                        <option value="tendik">Tenaga Kependidikan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NIDN / NUPTK / NIDK
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nidn}
                                        onChange={(e) => setData('nidn', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        NIP / NIK Pegawai
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Afiliasi Fakultas & Prodi */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-500" />
                                Penempatan &amp; Jabatan Akademik
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Fakultas
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
                                        Jabatan Fungsional
                                    </label>
                                    <select
                                        value={data.academic_position}
                                        onChange={(e) => setData('academic_position', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="">Pilih Jabatan</option>
                                        {academicPositions.map((pos) => (
                                            <option key={pos} value={pos}>
                                                {pos}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jabatan Tambahan / Struktural
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Dekan Fakultas, Kaprodi"
                                        value={data.structural_position}
                                        onChange={(e) => setData('structural_position', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Research Interests Tags */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                Bidang Keahlian / Research Interests
                            </h2>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ketik keahlian (contoh: Machine Learning, Data Science) lalu tekan Enter"
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

                        {/* Riwayat Pendidikan */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                                    Riwayat Pendidikan
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
                                                    placeholder="Nama Universitas"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                />
                                            </div>

                                            <div className="sm:col-span-4">
                                                <input
                                                    type="text"
                                                    placeholder="Jurusan / Program Studi"
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
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                    Belum ada data riwayat pendidikan.
                                </p>
                            )}
                        </div>

                        {/* Bio TipTap */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-500" />
                                Biografi Civitas
                            </h2>

                            <TipTapEditor
                                content={data.bio}
                                onChange={(html) => setData('bio', html)}
                                placeholder="Tuliskan biografi singkat dosen / tendik..."
                            />
                        </div>
                    </div>

                    {/* Right 1 Col: User account link, Avatar, External IDs, Settings */}
                    <div className="space-y-6">
                        {/* Tautkan ke Akun User Login */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Hubungkan ke Akun Pengguna Login
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Memungkinkan dosen/tendik untuk login dan mengedit profilnya sendiri secara mandiri.
                            </p>

                            <select
                                value={data.user_id}
                                onChange={(e) => handleUserSelect(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                            >
                                <option value="">Tidak Ditautkan (Standalone)</option>
                                {availableUsers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email}) — [{u.role}]
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Foto Resmi */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3 text-center">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Foto Resmi Civitas
                            </h3>

                            <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                <img
                                    src={data.avatar_path || staff?.avatar_url || 'https://ui-avatars.com/api/?name=Civitas&background=4f46e5&color=fff'}
                                    alt="Avatar"
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
                                    Pilih Media
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

                        {/* Google Scholar & RSS Feed */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 dark:border-slate-800 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-indigo-500" />
                                Google Scholar &amp; RSS Auto-Feed
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Google Scholar Profile URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://scholar.google.com/citations?user=..."
                                    value={data.google_scholar_url}
                                    onChange={(e) => setData('google_scholar_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    RSS / Atom Feed Publikasi
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://repository.univ.ac.id/feed.xml"
                                    value={data.rss_feed_url}
                                    onChange={(e) => setData('rss_feed_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Scopus ID / URL
                                </label>
                                <input
                                    type="text"
                                    value={data.scopus_url || data.scopus_id}
                                    onChange={(e) => setData('scopus_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    SINTA URL / ID
                                </label>
                                <input
                                    type="text"
                                    value={data.sinta_url || data.sinta_id}
                                    onChange={(e) => setData('sinta_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    ORCID ID
                                </label>
                                <input
                                    type="text"
                                    value={data.orcid_url || data.orcid_id}
                                    onChange={(e) => setData('orcid_url', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Akun Media Sosial */}
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

                        {/* Kontak & Status */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 dark:border-slate-800">
                                Kontak &amp; Status
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Email Resmi
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
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Tampilkan di Direktori Publik
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Sorot Civitas (Featured)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <MediaPickerModal
                isOpen={isAvatarPickerOpen}
                onClose={() => setIsAvatarPickerOpen(false)}
                onSelect={(media) => {
                    setData('avatar_path', media.image_url);
                    setIsAvatarPickerOpen(false);
                }}
                title="Pilih Foto Resmi Dosen / Tendik"
            />
        </AuthenticatedLayout>
    );
}
