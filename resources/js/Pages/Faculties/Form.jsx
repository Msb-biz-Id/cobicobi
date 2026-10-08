import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Building2,
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
} from 'lucide-react';

export default function FacultyForm({ faculty, positions = [], staffList = [] }) {
    const isEdit = Boolean(faculty);

    const initialAssignments = faculty?.structural_assignments?.map((asg) => ({
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

    const initialLecturerIds = faculty?.lecturers?.map((l) => l.id) || [];

    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? 'PUT' : 'POST',
        name: faculty?.name || '',
        slug: faculty?.slug || '',
        code: faculty?.code || '',
        abbreviation: faculty?.abbreviation || '',
        decree_number: faculty?.decree_number || '',
        accreditation: faculty?.accreditation || '',
        description: faculty?.description || '',
        vision: faculty?.vision || '',
        mission: faculty?.mission || '',
        objectives: faculty?.objectives || '',
        facebook_url: faculty?.facebook_url || '',
        instagram_url: faculty?.instagram_url || '',
        x_url: faculty?.x_url || '',
        tiktok_url: faculty?.tiktok_url || '',
        youtube_url: faculty?.youtube_url || '',
        website_url: faculty?.website_url || '',
        email: faculty?.email || '',
        phone: faculty?.phone || '',
        office_location: faculty?.office_location || '',
        sort_order: faculty?.sort_order || 0,
        is_active: faculty ? Boolean(faculty.is_active) : true,
        logo: null,
        cover_image: null,
        assignments: initialAssignments,
        lecturer_ids: initialLecturerIds,
    });

    const [lecturerSearch, setLecturerSearch] = useState('');

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
            ? route('admin.faculties.update', faculty.id)
            : route('admin.faculties.store');

        post(url);
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEdit ? `Edit Fakultas: ${faculty.name}` : 'Tambah Fakultas Baru'} />

            <form onSubmit={handleSubmit} className="space-y-8 pb-16">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.faculties.index')}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Fakultas
                            </Link>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-7 h-7 text-indigo-600" />
                            {isEdit ? `Edit Fakultas: ${faculty.name}` : 'Tambah Fakultas Baru'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.faculties.index')}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded-xl"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                        >
                            <Save className="w-4 h-4" /> {processing ? 'Menyimpan...' : 'Simpan Fakultas'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (2 Cols) - Detail Utama */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Identitas & Legalitas */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> Identitas & Status Akreditasi
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Nama Fakultas Lengkap <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Fakultas Ilmu Komputer dan Rekayasa Sistem"
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Kode Fakultas
                                    </label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Contoh: FIKRS"
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
                                        placeholder="Contoh: FIK"
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Peringkat Akreditasi
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
                                        <option value="Internasional">Terakreditasi Internasional</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Nomor SK Pendirian / Izin Operasional
                                </label>
                                <input
                                    type="text"
                                    value={data.decree_number}
                                    onChange={(e) => setData('decree_number', e.target.value)}
                                    placeholder="Contoh: SK-MENDIKBUD/042/2020"
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 2. Narasi & Profil (Deskripsi, Visi, Misi, Tujuan) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> Profil, Visi & Misi Terurut
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Deskripsi Profil Fakultas
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Penjelasan lengkap sejarah, peran, dan ruang lingkup keilmuan fakultas..."
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Visi Fakultas
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        placeholder="Visi jangka panjang fakultas..."
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                        Misi Fakultas
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                        placeholder="Poin-poin misi tridharma perguruan tinggi..."
                                        className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                                    Tujuan & Sasaran Strategis
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.objectives}
                                    onChange={(e) => setData('objectives', e.target.value)}
                                    placeholder="Tujuan pencapaian kompetensi lulusan dan riset..."
                                    className="mt-1 w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 3. Pejabat Struktural Dinamis (Dekanat) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-600" /> Pimpinan Struktural (Dekanat)
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Ambil jabatan dari Master Data Jabatan dan pilih Dosen/Tendik sebagai pemangku amanah.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addAssignment}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-xl transition"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Tambah Pejabat
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
                                                Pejabat #{index + 1}
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
                                                    Pilih Dosen / Pejabat
                                                </label>
                                                <select
                                                    value={asg.staff_profile_id}
                                                    onChange={(e) => updateAssignmentField(index, 'staff_profile_id', e.target.value)}
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                >
                                                    <option value="">Pilih Civitas</option>
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
                                                    Gelar / Sebutan Kustom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={asg.custom_title}
                                                    onChange={(e) => updateAssignmentField(index, 'custom_title', e.target.value)}
                                                    placeholder="Opsional jika beda"
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                                    Nomor SK Pengangkatan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={asg.decree_number}
                                                    onChange={(e) => updateAssignmentField(index, 'decree_number', e.target.value)}
                                                    placeholder="No. SK Rektor"
                                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="flex items-center pt-5">
                                                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={asg.is_current}
                                                        onChange={(e) => updateAssignmentField(index, 'is_current', e.target.checked)}
                                                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                    />
                                                    <span>Menjabat Aktif</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Multi-Select Dosen Pengajar di Fakultas */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" /> Multi-Pilih Dosen Pengajar Fakultas
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Pilih banyak dosen sekaligus yang bertugas di fakultas ini untuk ditampilkan pada slider publik.
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
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
                                                    ? 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 font-semibold text-indigo-900 dark:text-indigo-200'
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
                                            {selected && <Check className="w-4 h-4 text-indigo-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1 Col) - Kontak, Medsos Lengkap dengan TikTok & Media */}
                    <div className="space-y-6">
                        {/* Media Sosial Lengkap (Termasuk TikTok) */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-600" /> Media Sosial & Website
                            </h2>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    TikTok URL
                                </label>
                                <input
                                    type="url"
                                    value={data.tiktok_url}
                                    onChange={(e) => setData('tiktok_url', e.target.value)}
                                    placeholder="https://tiktok.com/@fikrs_life"
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
                                    placeholder="https://instagram.com/fikrs_official"
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
                                    placeholder="https://facebook.com/fikrs.campus"
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
                                    placeholder="https://x.com/fikrs_campus"
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
                                    placeholder="https://youtube.com/@fikrsofficial"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Website Resmi Fakultas
                                </label>
                                <input
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    placeholder="https://fikrs.campus.ac.id"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Kontak & Lokasi */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Kontak & Sekretariat
                            </h2>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Email Resmi
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="fikrs@campus.ac.id"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Telepon / Hotline
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+62 21 8899 1100"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Lokasi Kantor Dekanat
                                </label>
                                <input
                                    type="text"
                                    value={data.office_location}
                                    onChange={(e) => setData('office_location', e.target.value)}
                                    placeholder="Gedung Dekanat Lantai 3, Kampus Terpadu"
                                    className="mt-1 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Logo & Cover Image */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-indigo-600" /> Logo & Gambar Cover
                            </h2>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Logo Fakultas
                                </label>
                                {faculty?.logo_url && (
                                    <div className="my-2 h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 flex items-center justify-center">
                                        <img src={faculty.logo_url} alt="Logo" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('logo', e.target.files[0])}
                                    className="mt-1 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    Cover Header / Banner
                                </label>
                                {faculty?.cover_url && (
                                    <div className="my-2 h-20 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50">
                                        <img src={faculty.cover_url} alt="Cover" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('cover_image', e.target.files[0])}
                                    className="mt-1 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-300"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
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
