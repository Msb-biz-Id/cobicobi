import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/UI/Input';
import Button from '@/Components/UI/Button';
import { KeyRound, Check } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Update Password
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Ensure your account is protected with a strong, random password.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-5 space-y-4">
                <Input
                    label="Current Password"
                    type="password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    error={errors.current_password}
                    required
                />

                <Input
                    label="New Password"
                    type="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    required
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    required
                />

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        icon={KeyRound}
                        loading={processing}
                    >
                        Update Password
                    </Button>

                    {recentlySuccessful && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" /> Password changed
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
