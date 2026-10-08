import { Head, router, useForm } from '@inertiajs/react';
import EditorLayout from '@/Layouts/EditorLayout';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import DocumentSidebar from '@/Components/Editor/DocumentSidebar';
import Button from '@/Components/UI/Button';
import Swal from 'sweetalert2';
import { Send, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PageEdit({ page }) {
    const isEdit = Boolean(page?.id);

    const form = useForm({
        title: page?.title || '',
        slug: page?.slug || '',
        content: page?.content || '',
        thumbnail: null,
        thumbnail_url: page?.thumbnail_url || null,
        meta_title: page?.meta_title || '',
        meta_description: page?.meta_description || '',
        meta_keywords: page?.meta_keywords || '',
        status: page?.status || 'draft',
    });

    const handleSaveDraft = (e) => {
        if (e) e.preventDefault();
        submitForm('draft');
    };

    const handlePublish = (e) => {
        if (e) e.preventDefault();
        submitForm('published');
    };

    const submitForm = (targetStatus = null) => {
        if (!form.data.title.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Judul Wajib Diisi',
                text: 'Harap masukkan judul laman sebelum menyimpan.',
                confirmButtonColor: '#4f46e5',
            });
            return;
        }

        const dataToSubmit = { ...form.data };
        if (targetStatus) {
            dataToSubmit.status = targetStatus;
        }

        if (isEdit) {
            form.transform(() => ({ ...dataToSubmit, _method: 'put' })).post(
                route('pages.update', page.id),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Laman berhasil disimpan',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    },
                },
            );
        } else {
            form.transform(() => dataToSubmit).post(route('pages.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Laman baru berhasil dibuat',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                },
            });
        }
    };

    const handleWorkflowAction = (action) => {
        if (!isEdit) return;
        const routes = {
            'submit-review': route('pages.workflow.submit-review', page.id),
            approve: route('pages.workflow.approve', page.id),
            publish: route('pages.workflow.publish', page.id),
            'send-back': route('pages.workflow.send-back', page.id),
        };

        if (routes[action]) {
            router.put(
                routes[action],
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Status workflow berhasil diperbarui',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    },
                },
            );
        }
    };

    const handleRollback = (revisionId) => {
        if (!isEdit) return;
        Swal.fire({
            title: 'Rollback ke Versi Ini?',
            text: 'Konten laman saat ini akan digantikan dengan riwayat versi yang dipilih.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Rollback',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#4f46e5',
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route('pages.rollback', [page.id, revisionId]),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire('Berhasil!', 'Versi laman telah dipulihkan.', 'success');
                        },
                    },
                );
            }
        });
    };

    return (
        <EditorLayout
            backUrl={route('pages.index')}
            backLabel="Pages"
            title={form.data.title}
            status={form.data.status}
            dirty={form.isDirty}
            saving={form.processing}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            publishLabel={
                form.data.status === 'published' ? 'Update Page' : 'Publish Page'
            }
            publishLoading={form.processing}
            sidebarContent={
                <DocumentSidebar
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    revisions={page?.revisions || []}
                    onRollback={handleRollback}
                    workflowActions={
                        isEdit ? (
                            <div className="flex flex-col gap-1.5">
                                {form.data.status === 'draft' && (
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => handleWorkflowAction('submit-review')}
                                        icon={Send}
                                    >
                                        Submit for Review
                                    </Button>
                                )}
                                {form.data.status === 'review' && (
                                    <>
                                        <Button
                                            size="xs"
                                            variant="primary"
                                            onClick={() => handleWorkflowAction('approve')}
                                            icon={CheckCircle2}
                                        >
                                            Approve Page
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="danger-outline"
                                            onClick={() => handleWorkflowAction('send-back')}
                                            icon={RotateCcw}
                                        >
                                            Send Back
                                        </Button>
                                    </>
                                )}
                                {form.data.status === 'approved' && (
                                    <Button
                                        size="xs"
                                        variant="success"
                                        onClick={() => handleWorkflowAction('publish')}
                                        icon={CheckCircle2}
                                    >
                                        Publish Now
                                    </Button>
                                )}
                            </div>
                        ) : null
                    }
                />
            }
        >
            <Head title={isEdit ? `Edit Laman: ${page.title}` : 'Create New Page'} />

            <div className="space-y-6">
                <textarea
                    rows={1}
                    value={form.data.title}
                    onChange={(e) => {
                        form.setData('title', e.target.value);
                        if (!isEdit && !form.data.slug) {
                            form.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                        }
                    }}
                    placeholder="Add Page Title..."
                    className="w-full resize-none border-0 bg-transparent p-0 text-3xl font-extrabold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-0 sm:text-4xl lg:text-5xl dark:text-white dark:placeholder:text-slate-700"
                    style={{ overflow: 'hidden' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />

                {form.errors.title && (
                    <p className="text-xs text-rose-500">{form.errors.title}</p>
                )}

                <TipTapEditor
                    content={form.data.content}
                    onChange={(html) => form.setData('content', html)}
                    placeholder="Write page content here..."
                    minHeight="550px"
                />

                {form.errors.content && (
                    <p className="text-xs text-rose-500">{form.errors.content}</p>
                )}
            </div>
        </EditorLayout>
    );
}
