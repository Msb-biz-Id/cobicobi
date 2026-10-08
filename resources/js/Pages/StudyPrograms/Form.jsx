import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Library,
    Save,
    ArrowLeft,
    Users,
    Shield,
    Globe,
    FileText,
    Image as ImageIcon,
    Plus,
    Trash2,
    Check,
    Briefcase,
    Building2,
    X,
} from 'lucide-react';

export default function StudyProgramForm({ studyProgram, faculties = [], positions = [], staffList = [] }) {
    const isEdit = Boolean(studyProgram);

    const initialAssignments = studyProgram?.structural_assignments?.map((asg) => ({
        structural_position_id: asg.structural_position_id,
        staff_profile_id: asg.staff_profile_id,
        custom_title: asg.custom_title || '',
        period_start: asg.period_start || '',
        period_end: asg.period_end || '',
        decree_number: asg.decree_number || '',
        is_current: Boolean(asg.is_current),
    })) || [
        {
            structural_position_id: positions[0]?.id || '',
            staff_profile_id: '',
            custom_title: '',
            period_start: '',
            period_end: '',
            decree_number: '',
            is_current: true,
        },
    ];

    const initialLecturerIds = studyProgram?.lecturers?.map((l) => l.id) || [];
    const initialCareerProspects = Array.isArray(studyProgram?.career_prospects)
        ? studyProgram.career_prospects
        : [];

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        faculty_id: studyProgram?.faculty_id || '',
        name: studyProgram?.name || '',
        slug: studyProgram?.slug || '',
        code: studyProgram?.code || '',
        abbreviation: studyProgram?.abbreviation || '',
        degree_level: studyProgram?.degree_level || 'S1',
        graduate_title: studyProgram?.graduate_title || '',
        accreditation: studyProgram?.accreditation || '',
        accreditation_number: studyProgram?.accreditation_number || '',
        decree_number: studyProgram?.decree_number || '',
        description: studyProgram?.description || '',
        vision: studyProgram?.vision || '',
        mission: studyProgram?.mission || '',
        career_prospects: initialCareerProspects,
        curriculum_overview: studyProgram?.curriculum_overview || '',
        facebook_url: studyProgram?.facebook_url || '',
        instagram_url: studyProgram?.instagram_url || '',
        x_url: studyProgram?.x_url || '',
        tiktok_url: studyProgram?.tiktok_url || '',
        youtube_url: studyProgram?.youtube_url || '',
        website_url: studyProgram?.website_url || '',
        email: studyProgram?.email || '',
        phone: studyProgram?.phone || '',
        office_location: studyProgram?.office_location || '',
        sort_order: studyProgram?.sort_order || 0,
        is_active: studyProgram ? Boolean(studyProgram.is_active) : true,
        logo: null,
        cover_image: null,
        assignments: initialAssignments,
        lecturer_ids: initialLecturerIds,
    });

    const [lecturerSearch, setLecturerSearch] = useState('');
    const [newProspect, setNewProspect] = useState('');

    const filteredStaff = staffList.filter((s) => {
        const query = lecturerSearch.toLowerCase();
        const fullName = `${s.front_title || ''} ${s.name} ${s.back_title || ''}`.toLowerCase();
        return fullName.includes(query) || (s.nidn && s.nidn.includes(query));
    });

    const toggleLecturer = (id) => {
        const current = [...data.lecturer_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('lecturer_ids', current);
    };

    const handleAddProspect = (e) => {
        e.preventDefault();
        const val = newProspect.trim();
        if (val && !data.career_prospects.includes(val)) {
            setData('career_prospects', [...data.career_prospects, val]);
            setNewProspect('');
        }
    };

    const handleRemoveProspect = (index) => {
        const updated = [...data.career_prospects];
        updated.splice(index, 1);
        setData('career_prospects', updated);
    };

    const addAssignment = () => {
        setData('assignments', [
            ...data.assignments,
            {
                structural_position_id: positions[0]?.id || '',
                staff_profile_id: '',
                custom_title: '',
                period_start: '',
                period_end: '',
                decree_number: '',
                is_current: true,
            },
        ]);
    };

    const removeAssignment = (index) => {
        const updated = [...data.assignments];
        updated.splice(index, 1);
        setData('assignments', updated);
    };

    const updateAssignmentField = (index, field, value) => {
        const updated = [...data.assignments];
        updated[index][field] = value;
        setData('assignments', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? route('admin.study-programs.update', studyProgram.id)
            : route('admin.study-programs.store');

        post(url);
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEdit ? `Edit Prodi: ${studyProgram.degree_level} ${studyProgram.name}` : 'Tambah Program Studi Baru'} />

            <form onSubmit={handleSubmit} className="space-y-8 pb-16">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.study-programs.index')}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Program Studi
                            </Link>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Library className="w-7 h-7 text-blue-600" />
                            {isEdit ? `Edit Program Studi: ${studyProgram.degree_level} ${studyProgram.name}` : 'Tambah Program Studi Baru'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.study-programs.index')}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded-xl"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                        >
                            <Save className="w-4 h-4" /> {processing ? 'Menyimpan...' : 'Simpan Program Studi'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2 Cols) - Detail Utama & Prospek Karir */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Fakultas & Identitas Akademik */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" /> Identitas Akademik & Fakultas
                            </h2>

                            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                                💡 <strong>Fitur Dinamis:</strong> Jika kampus Anda tidak menggunakan sistem fakultas (misal: Politeknik, Sekolah Tinggi, atau Institut), pilih opsi <em>"Tanpa Fakultas (Program Studi Mandiri)"</em>.
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Fakultas Penaung (Opsional)
                                    </label>
                                    <select
                                        value={data.faculty_id}
                                        onChange={(e) => setData('faculty_id', e.target.value)}
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                    >
                                        <option value="">-- Tanpa Fakultas (Program Studi Mandiri) --</option>
                                        {faculties.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.abbreviation ? `[${f.abbreviation}] ` : ''}{f.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Jenjang Pendidikan <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.degree_level}
                                        onChange={(e) => setData('degree_level', e.target.value)}
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium"
                                    >
                                        <option value="D3">D3 - Ahli Madya (Diploma Tiga)</option>
                                        <option value="D4">D4 - Sarjana Terapan (Diploma Empat)</option>
                                        <option value="S1">S1 - Sarjana</option>
                                        <option value="S2">S2 - Magister</option>
                                        <option value="S3">S3 - Doktor</option>
                                        <option value="Profesi">Profesi</option>
                                        <option value="Spesialis">Spesialis</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Nama Program Studi <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Teknik Informatika"
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Gelar Lulusan Resmi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.graduate_title}
                                        onChange={(e) => setData('graduate_title', e.target.value)}
                                        placeholder="Contoh: S.Kom., S.T."
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Kode Prodi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Contoh: TINF-S1"
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Singkatan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.abbreviation}
                                        onChange={(e) => setData('abbreviation', e.target.value)}
                                        placeholder="Contoh: TI"
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Akreditasi
                                    </label>
                                    <select
                                        value={data.accreditation}
                                        onChange={(e) => setData('accreditation', e.target.value)}
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                    >
                                        <option value="">Pilih Akreditasi</option>
                                        <option value="Unggul">Unggul</option>
                                        <option value="Baik Sekali">Baik Sekali</option>
                                        <option value="Baik">Baik</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="Internasional">Akreditasi Internasional</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Nomor SK Akreditasi (LAM/BAN-PT)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.accreditation_number}
                                        onChange={(e) => setData('accreditation_number', e.target.value)}
                                        placeholder="120/SK/LAM-INFOKOM/Ak/S/XII/2024"
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Nomor SK Pendirian Prodi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.decree_number}
                                        onChange={(e) => setData('decree_number', e.target.value)}
                                        placeholder="SK-DIKTI-456/2018"
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Profil, Visi, Misi, Kurikulum */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" /> Profil, Visi, Misi & Kurikulum Terurut
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Deskripsi Program Studi
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Penjelasan keilmuan, keunggulan peminatan, dan profil pembelajaran..."
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Visi Program Studi
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        placeholder="Visi program studi..."
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Misi Program Studi
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                        placeholder="Poin-poin misi..."
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Ringkasan Kurikulum & Profil Lulusan
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.curriculum_overview}
                                    onChange={(e) => setData('curriculum_overview', e.target.value)}
                                    placeholder="Total SKS, integrasi sertifikasi, konsentrasi peminatan, OBE, dsb..."
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 3. PROSPEK KARIR LULUSAN (FIELD KHUSUS & DINAMIS) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-600" /> Prospek Karir Lulusan
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Tambahkan profesi atau jalur karir yang dapat ditempuh oleh para lulusan program studi ini.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newProspect}
                                    onChange={(e) => setNewProspect(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddProspect(e);
                                        }
                                    }}
                                    placeholder="Ketik prospek karir (misal: Software Engineer, AI Specialist) lalu tekan Tambah..."
                                    className="flex-1 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddProspect}
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                                >
                                    Tambah Prospek
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {data.career_prospects.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">Belum ada prospek karir ditambahkan.</p>
                                ) : (
                                    data.career_prospects.map((cp, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40"
                                        >
                                            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                                            {cp}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProspect(idx)}
                                                className="hover:text-rose-600 transition ml-0.5"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 4. Pejabat Struktural (Kaprodi, Sekprodi) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-600" /> Pimpinan Program Studi (Kaprodi & Sekprodi)
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Ambil jabatan dari Master Jabatan dan tetapkan Dosen yang menjabat.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addAssignment}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 rounded-xl transition"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Tambah Pimpinan
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.assignments.map((asg, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 uppercase">
                                                Pimpinan #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeAssignment(index)}
                                                className="text-slate-400 hover:text-rose-600 p-1 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                                    Pilih Jabatan (Master Data)
                                                </label>
                                                <select
                                                    value={asg.structural_position_id}
                                                    onChange={(e) => updateAssignmentField(index, 'structural_position_id', e.target.value)}
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                >
                                                    <option value="">Pilih Jabatan</option>
                                                    {positions.map((pos) => (
                                                        <option key={pos.id} value={pos.id}>
                                                            {pos.name} (Lvl {pos.level})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                                    Pilih Dosen Pengampu Amanah
                                                </label>
                                                <select
                                                    value={asg.staff_profile_id}
                                                    onChange={(e) => updateAssignmentField(index, 'staff_profile_id', e.target.value)}
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                >
                                                    <option value="">Pilih Dosen</option>
                                                    {staffList.map((st) => (
                                                        <option key={st.id} value={st.id}>
                                                            {st.front_title ? `${st.front_title} ` : ''}{st.name}{st.back_title ? `, ${st.back_title}` : ''} ({st.type})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                                    Sebutan Kustom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={asg.custom_title}
                                                    onChange={(e) => updateAssignmentField(index, 'custom_title', e.target.value)}
                                                    placeholder="Opsional"
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                                    Nomor SK Rektor / Dekan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={asg.decree_number}
                                                    onChange={(e) => updateAssignmentField(index, 'decree_number', e.target.value)}
                                                    placeholder="No. SK Penetapan"
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="flex items-center pt-5">
                                                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={asg.is_current}
                                                        onChange={(e) => updateAssignmentField(index, 'is_current', e.target.checked)}
                                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                                                    />
                                                    <span>Menjabat Aktif</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Multi-Select Dosen Pengajar di Prodi */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600" /> Multi-Pilih Dosen Pengajar Prodi
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Pilih banyak dosen sekaligus yang mengajar di Program Studi ini untuk ditampilkan pada carousel slide publik.
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    {data.lecturer_ids.length} Dosen Terpilih
                                </span>
                            </div>

                            <input
                                type="text"
                                placeholder="Cari nama dosen atau NIDN..."
                                value={lecturerSearch}
                                onChange={(e) => setLecturerSearch(e.target.value)}
                                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                            />

                            <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                {filteredStaff.map((staff) => {
                                    const selected = data.lecturer_ids.includes(staff.id);
                                    return (
                                        <div
                                            key={staff.id}
                                            onClick={() => toggleLecturer(staff.id)}
                                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition ${
                                                selected
                                                    ? 'bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 font-semibold text-blue-900 dark:text-blue-200'
                                                    : 'hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <div>
                                                <span>
                                                    {staff.front_title ? `${staff.front_title} ` : ''}{staff.name}{staff.back_title ? `, ${staff.back_title}` : ''}
                                                </span>
                                                {staff.nidn && (
                                                    <span className="ml-2 text-[10px] text-slate-400 font-mono">
                                                        NIDN: {staff.nidn}
                                                    </span>
                                                )}
                                            </div>
                                            {selected && <Check className="w-4 h-4 text-blue-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Col) - Medsos Lengkap dengan TikTok & Media */}
                    <div className="space-y-6">
                        {/* Media Sosial Lengkap (Termasuk TikTok) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" /> Media Sosial & Website
                            </h2>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    TikTok URL
                                </label>
                                <input
                                    type="url"
                                    value={data.tiktok_url}
                                    onChange={(e) => setData('tiktok_url', e.target.value)}
                                    placeholder="https://tiktok.com/@ti_campus_vlog"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    value={data.instagram_url}
                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                    placeholder="https://instagram.com/ti_campus"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Facebook URL
                                </label>
                                <input
                                    type="url"
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    placeholder="https://facebook.com/ti.campus"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    X / Twitter URL
                                </label>
                                <input
                                    type="url"
                                    value={data.x_url}
                                    onChange={(e) => setData('x_url', e.target.value)}
                                    placeholder="https://x.com/ti_campus"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    YouTube URL
                                </label>
                                <input
                                    type="url"
                                    value={data.youtube_url}
                                    onChange={(e) => setData('youtube_url', e.target.value)}
                                    placeholder="https://youtube.com/@ti_campus"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Website Resmi Program Studi
                                </label>
                                <input
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    placeholder="https://ti.campus.ac.id"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Kontak & Ruang Prodi */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Kontak & Ruang Prodi
                            </h2>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Email Resmi Prodi
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="prodi@campus.ac.id"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Telepon / Kontak
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+62 21 8899 1111"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Ruang Kantor Prodi
                                </label>
                                <input
                                    type="text"
                                    value={data.office_location}
                                    onChange={(e) => setData('office_location', e.target.value)}
                                    placeholder="Gedung Sayap Barat Lantai 2 Ruang 204"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Logo & Cover Image */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-blue-600" /> Logo & Gambar Cover
                            </h2>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Logo / Lambang Prodi
                                </label>
                                {studyProgram?.logo_url && (
                                    <div className="my-2 h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 flex items-center justify-center">
                                        <img src={studyProgram.logo_url} alt="Logo" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('logo', e.target.files[0])}
                                    className="mt-1 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Cover Header / Banner
                                </label>
                                {studyProgram?.cover_url && (
                                    <div className="my-2 h-20 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50">
                                        <img src={studyProgram.cover_url} alt="Cover" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('cover_image', e.target.files[0])}
                                    className="mt-1 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                    <span>Aktif Ditampilkan</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
