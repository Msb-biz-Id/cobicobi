import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Input from '@/Components/UI/Input';
import Button from '@/Components/UI/Button';
import Turnstile from '@/Components/Turnstile';
import { LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        cf_turnstile_response: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="mb-6">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Sign in to your account
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enter your administrative credentials to continue.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Input
                    label="Email Address"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="admin@brand.com"
                    autoFocus
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder="••••••••"
                    required
                />

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <Turnstile
                    onSuccess={(token) => setData('cf_turnstile_response', token)}
                    onExpire={() => setData('cf_turnstile_response', '')}
                />
                {errors.cf_turnstile_response && (
                    <p className="text-xs text-rose-500 text-center font-medium">
                        {errors.cf_turnstile_response}
                    </p>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    icon={LogIn}
                    loading={processing}
                >
                    Sign in
                </Button>
            </form>
        </GuestLayout>
    );
}
