import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/Components/UI/PageHeader';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Account Settings" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <PageHeader
                    title="Pengaturan Akun &amp; Profil"
                    subtitle="Kelola kredensial akun, password, dan biodata akademik civitas universitas"
                />

                {/* Banner Biodata Dosen & Tendik */}
                <div className="rounded-3xl border-2 border-indigo-200/80 bg-gradient-to-r from-indigo-50/60 via-white to-indigo-50/40 p-6 shadow-xs dark:border-indigo-900/60 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Biodata Dosen / Tendik &amp; Portofolio Riset
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Atur gelar akademik, NIDN/NIP, riwayat pendidikan, integrasi Google Scholar, RSS Feed, dan karya ilmiah Anda.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('profile.staff.edit')}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
                    >
                        Kelola Biodata Civitas
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="surface-card p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="surface-card p-6">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="surface-card p-6 border-rose-200/50 dark:border-rose-900/30">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
