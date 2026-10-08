import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment } from 'react';

export default function SlideOver({
    show = false,
    onClose = () => {},
    title,
    description,
    children,
    width = 'md',
}) {
    const widthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
    }[width] || 'max-w-md';

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity dark:bg-slate-950/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel
                                    className={`pointer-events-auto w-screen ${widthClass} border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]`}
                                >
                                    <div className="flex h-full flex-col overflow-y-auto">
                                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
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
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex-1 p-6">{children}</div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
