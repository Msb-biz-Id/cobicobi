import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Swal from 'sweetalert2';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    Loader2,
    CheckCircle2,
    MessageSquare,
    Sparkles,
} from 'lucide-react';

export default function ContactIndex({ webSetting = {}, campusSetting = {} }) {
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    // Ambil nilai dinamis dengan fallback aman
    const campusName = campusSetting?.campus_name || webSetting?.site_title || 'Institut Teknologi dan Bisnis Tuban';
    
    // Alamat dinamis
    const fullAddress = [
        webSetting?.address || campusSetting?.address,
        webSetting?.city || campusSetting?.city,
        webSetting?.province || campusSetting?.province,
        webSetting?.postal_code || campusSetting?.postal_code,
    ]
        .filter(Boolean)
        .join(', ') || 'Tuban, Jawa Timur, Indonesia';

    // Telepon & WhatsApp
    const phonePrimary = webSetting?.contact_phone || campusSetting?.phone || '(0356) 321-456';
    const whatsapp = webSetting?.whatsapp_number || campusSetting?.phone;

    // Email
    const emailPrimary = webSetting?.contact_email || campusSetting?.email || 'info@itbtuban.ac.id';

    // Jam Layanan
    const contactHours = 'Senin - Jumat: 08.00 - 16.00 WIB\nSabtu: 08.00 - 12.00 WIB';

    // Peta Google Embed
    const mapsEmbedUrl =
        webSetting?.google_maps_url ||
        campusSetting?.google_maps_url ||
        `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress || campusName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    // Formulir Kontak
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        subject: 'Penerimaan Mahasiswa Baru (PMB)',
        message: '',
        website: '', // Honeypot field
        source_url: typeof window !== 'undefined' ? window.location.href : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Gabungkan subjek pertanyaan ke isi pesan agar tersimpan rapi di sistem
        const combinedMessage = `[Subjek: ${data.subject}]\n\n${data.message}`;

        post('/kontak', {
            preserveScroll: true,
            data: {
                ...data,
                message: combinedMessage,
            },
            onSuccess: () => {
                reset('name', 'email', 'phone_number', 'message', 'website');
                setSubmittedSuccess(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Pesan Berhasil Terkirim!',
                    text: 'Terima kasih telah menghubungi kami. Tim layanan informasi kampus akan segera merespons pesan Anda.',
                    confirmButtonColor: '#059669',
                    confirmButtonText: 'Baik, Terima Kasih',
                });
            },
            onError: (errs) => {
                const firstError = Object.values(errs)[0];
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengirim Pesan',
                    text: firstError || 'Mohon periksa kembali formulir Anda.',
                    confirmButtonColor: '#dc2626',
                    confirmButtonText: 'Tutup',
                });
            },
        });
    };

    // Daftar Akun Media Sosial
    const socialLinks = [
        {
            name: 'Facebook',
            url: webSetting?.facebook_url || campusSetting?.facebook_url,
            iconClass: 'fab fa-facebook-f',
        },
        {
            name: 'Instagram',
            url: webSetting?.instagram_url || campusSetting?.instagram_url,
            iconClass: 'fab fa-instagram',
        },
        {
            name: 'YouTube',
            url: webSetting?.youtube_url || campusSetting?.youtube_url,
            iconClass: 'fab fa-youtube',
        },
        {
            name: 'TikTok',
            url: webSetting?.tiktok_url || campusSetting?.tiktok_url,
            iconClass: 'fab fa-tiktok',
        },
        {
            name: 'X (Twitter)',
            url: webSetting?.x_url || campusSetting?.x_url,
            iconClass: 'fab fa-x-twitter',
        },
    ].filter((item) => Boolean(item.url));

    return (
        <PublicLayout>
            <Head>
                <title>{`Kontak & Layanan Informasi - ${campusName}`}</title>
                <meta
                    name="description"
                    content={`Hubungi layanan resmi ${campusName}. Alamat kampus, nomor telepon, email resmi, jam layanan operasional, serta formulir pengiriman pertanyaan dan konsultasi.`}
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
                        <span className="text-slate-900 font-semibold">Kontak Kami</span>
                    </div>
                </div>

                <div className="site-container pt-10 pb-6">
                    {/* Header Title Section */}
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block bg-primary-100/70 text-primary-800 text-[11px] font-extrabold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-3 shadow-xs">
                            HUBUNGI KAMI
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Ada Pertanyaan?
                        </h1>
                        <div className="w-16 h-1 bg-secondary-500 rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Tim layanan informasi kami siap membantu menjawab pertanyaan Anda terkait penerimaan mahasiswa baru, program akademik, kemitraan, atau informasi kampus lainnya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Kolom Kiri: Informasi Kontak & Media Sosial */}
                        <div className="lg:col-span-1 space-y-5">
                            {/* Card Alamat */}
                            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex items-start gap-4 hover:border-primary-300 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 border border-primary-100">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Alamat Kampus
                                    </h2>
                                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                                        {fullAddress}
                                    </p>
                                </div>
                            </div>

                            {/* Card Telepon & WhatsApp */}
                            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex items-start gap-4 hover:border-primary-300 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Telepon & WhatsApp
                                    </h2>
                                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                                        {phonePrimary}
                                    </p>
                                    {whatsapp && whatsapp !== phonePrimary && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            WA: {whatsapp}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Card Email */}
                            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex items-start gap-4 hover:border-primary-300 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Alamat Email
                                    </h2>
                                    <a
                                        href={`mailto:${emailPrimary}`}
                                        className="text-sm font-semibold text-slate-800 hover:text-primary-700 transition leading-snug block truncate"
                                    >
                                        {emailPrimary}
                                    </a>
                                </div>
                            </div>

                            {/* Card Jam Operasional */}
                            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex items-start gap-4 hover:border-primary-300 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Jam Operasional
                                    </h2>
                                    <p className="text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                                        {contactHours}
                                    </p>
                                </div>
                            </div>

                            {/* Card Ikuti Media Sosial */}
                            <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 rounded-2xl shadow-sm p-6 text-white text-center">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="w-5 h-5 text-secondary-400" />
                                </div>
                                <h2 className="text-base font-bold mb-1">
                                    Ikuti Media Sosial Kami
                                </h2>
                                <p className="text-xs text-white/80 mb-5">
                                    Dapatkan warta, prestasi, dan agenda terhangat kampus setiap hari
                                </p>
                                <div className="flex flex-wrap justify-center gap-2.5">
                                    {socialLinks.map((s) => (
                                        <a
                                            key={s.name}
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={s.name}
                                            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-secondary-500 hover:text-slate-900 flex items-center justify-center text-white transition-all transform hover:-translate-y-0.5 shadow-2xs"
                                        >
                                            <i className={s.iconClass}></i>
                                        </a>
                                    ))}
                                    {socialLinks.length === 0 && (
                                        <span className="text-xs text-white/70 italic">
                                            Kanal media sosial resmi segera hadir.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Formulir Pesan & Google Maps Embed */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Formulir Kontak */}
                            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-7 md:p-9">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                                            Kirim Pesan
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Sampaikan pertanyaan, masukan, atau permohonan informasi Anda
                                        </p>
                                    </div>
                                </div>

                                {submittedSuccess && (
                                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                                        <div className="text-xs md:text-sm">
                                            <span className="font-bold">Pesan Anda Berhasil Terkirim!</span> Tim kami akan membalas ke email atau WhatsApp Anda.
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Honeypot spam trap */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        style={{ display: 'none' }}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Nama Lengkap <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border ${
                                                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                                                } focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all`}
                                                placeholder="Contoh: Budi Santoso"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-rose-500 font-medium">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Alamat Email <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border ${
                                                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                                                } focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all`}
                                                placeholder="alamat@email.com"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-rose-500 font-medium">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border ${
                                                    errors.phone_number ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                                                } focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all`}
                                                placeholder="081234567890"
                                                required
                                            />
                                            {errors.phone_number && (
                                                <p className="mt-1 text-xs text-rose-500 font-medium">
                                                    {errors.phone_number}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Subjek Pertanyaan <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all"
                                                required
                                            >
                                                <option value="Penerimaan Mahasiswa Baru (PMB)">Penerimaan Mahasiswa Baru (PMB)</option>
                                                <option value="Informasi Akademik & Kurikulum">Informasi Akademik & Kurikulum</option>
                                                <option value="Kerjasama & Kemitraan Kampus">Kerjasama & Kemitraan Kampus</option>
                                                <option value="Layanan Administrasi & Kemahasiswaan">Layanan Administrasi & Kemahasiswaan</option>
                                                <option value="Pertanyaan Umum & Lainnya">Pertanyaan Umum & Lainnya</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Isi Pesan / Pertanyaan <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border ${
                                                errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                                            } focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all resize-none`}
                                            placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda tanyakan secara jelas di sini..."
                                            required
                                        ></textarea>
                                        {errors.message && (
                                            <p className="mt-1 text-xs text-rose-500 font-medium">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm md:text-base"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Sedang Mengirim Pesan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Kirim Pesan Sekarang</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Google Map Interaktif */}
                            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-2.5 overflow-hidden">
                                <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500">
                                    <span className="font-bold flex items-center gap-1.5 text-slate-700">
                                        <MapPin className="w-4 h-4 text-primary-600" /> Lokasi Kampus di Google Maps
                                    </span>
                                    <span>Peta Interaktif</span>
                                </div>
                                <div className="h-[360px] w-full rounded-2xl overflow-hidden bg-slate-100">
                                    <iframe
                                        title={`Lokasi ${campusName}`}
                                        src={mapsEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
