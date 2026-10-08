import Input from '@/Components/UI/Input';
import Button from '@/Components/UI/Button';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Save, Check } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Profile Information
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Update your account's display name and primary contact email.
                </p>
            </header>

            <form onSubmit={submit} className="mt-5 space-y-4">
                <Input
                    label="Display Name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    required
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
                        <span>Your email address is unverified. </span>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-semibold underline hover:text-amber-900"
                        >
                            Click here to re-send verification email.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-semibold text-emerald-600">
                                A new verification link has been dispatched to your inbox.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        icon={Save}
                        loading={processing}
                    >
                        Save Profile
                    </Button>

                    {recentlySuccessful && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" /> Changes saved
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
