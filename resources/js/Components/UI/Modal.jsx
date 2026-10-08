import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment } from 'react';

export default function Modal({
    show = false,
    onClose = () => {},
    title,
    description,
    children,
    maxWidth = '2xl',
    closeable = true,
}) {
    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        '6xl': 'sm:max-w-6xl',
        full: 'sm:max-w-[95vw]',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
                onClose={closeable ? onClose : () => {}}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity dark:bg-slate-950/70" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`relative w-full transform overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#0f172a] ${maxWidthClass}`}
                    >
                        {(title || closeable) && (
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                                <div>
                                    {title && (
                                        <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    {description && (
                                        <Dialog.Description className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            {description}
                                        </Dialog.Description>
                                    )}
                                </div>
                                {closeable && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="p-6">{children}</div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
