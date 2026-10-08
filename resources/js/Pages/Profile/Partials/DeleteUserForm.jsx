import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/UI/Modal';
import Input from '@/Components/UI/Input';
import Button from '@/Components/UI/Button';
import { Trash2 } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <header>
                <h2 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Delete Account
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Permanently delete your user credentials and administrative access.
                </p>
            </header>

            <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={confirmUserDeletion}
            >
                Delete Account
            </Button>

            <Modal
                show={confirmingUserDeletion}
                onClose={closeModal}
                title="Delete Account Confirmation"
                description="Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm."
            >
                <form onSubmit={deleteUser} className="space-y-4">
                    <Input
                        label="Account Password"
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            loading={processing}
                        >
                            Confirm Deletion
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
