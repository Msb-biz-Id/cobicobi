import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Globe,
    Undo2,
    Trash2,
    Reply,
    Shield,
} from 'lucide-react';
import Swal from 'sweetalert2';

function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

export default function ContactMessagesShow({ message }) {
    const markUnread = () => {
        router.put(
            route('contact-messages.mark-unread', message.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'info',
                        title: 'Tandai sebagai belum dibaca',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
            },
        );
    };

    const deleteItem = async () => {
        const result = await Swal.fire({
            title: 'Hapus Pesan Masuk?',
            text: `Pesan dari "${message.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#e11d48',
        });

        if (!result.isConfirmed) return;

        router.delete(route('contact-messages.destroy', message.id), {
            onSuccess: () => {
                router.visit(route('contact-messages.index'));
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Message from ${message.name}`} />

            <div className="space-y-6 max-w-5xl mx-auto">
                <PageHeader
                    title="Inquiry Details"
                    subtitle={`Received from ${message.name} on ${message.created_at}`}
                    actions={
                        <div className="flex items-center gap-2">
                            <Link href={route('contact-messages.index')}>
                                <Button variant="outline" size="sm" icon={ArrowLeft}>
                                    Back to Inbox
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={Undo2}
                                onClick={markUnread}
                            >
                                Mark Unread
                            </Button>
                            <a
                                href={`mailto:${message.email}?subject=Re: Inquiry from ${encodeURIComponent(
                                    message.name,
                                )}`}
                            >
                                <Button variant="primary" size="sm" icon={Reply}>
                                    Reply via Email
                                </Button>
                            </a>
                            <Button
                                variant="danger"
                                size="sm"
                                icon={Trash2}
                                onClick={deleteItem}
                            >
                                Delete
                            </Button>
                        </div>
                    }
                />

                {/* Main Message Card */}
                <div className="surface-card overflow-hidden">
                    {/* Header info */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-500/20">
                                    {getInitials(message.name)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            {message.name}
                                        </h3>
                                        <Badge variant={message.is_read ? 'neutral' : 'indigo'} size="sm">
                                            {message.is_read ? 'Read' : 'New Unread'}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1 font-mono">
                                            <Mail className="h-3 w-3 text-slate-400" />
                                            {message.email}
                                        </span>
                                        {message.phone_number && (
                                            <span className="flex items-center gap-1 font-mono">
                                                <Phone className="h-3 w-3 text-slate-400" />
                                                {message.phone_number}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right text-xs text-slate-400">
                                <div className="flex items-center gap-1 font-mono sm:justify-end">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {message.created_at}
                                </div>
                                {message.read_at && (
                                    <div className="mt-0.5 text-[11px] text-slate-400">
                                        First read: {message.read_at}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="p-6 sm:p-8">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                            Message Content
                        </h4>
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                            {message.message}
                        </div>
                    </div>

                    {/* Technical Metadata Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-6">
                        {message.ip_address && (
                            <span className="flex items-center gap-1.5 font-mono text-[11px]">
                                <Shield className="h-3.5 w-3.5 text-slate-400" />
                                IP: {message.ip_address}
                            </span>
                        )}
                        {message.source_url && (
                            <span className="flex items-center gap-1.5 text-[11px]">
                                <Globe className="h-3.5 w-3.5 text-slate-400" />
                                Sent from: <span className="font-mono">{message.source_url}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
