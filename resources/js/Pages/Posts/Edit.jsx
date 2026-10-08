import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import EditorLayout from '@/Layouts/EditorLayout';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import DocumentSidebar from '@/Components/Editor/DocumentSidebar';
import Button from '@/Components/UI/Button';
import Swal from 'sweetalert2';
import { Send, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PostEdit({ post, categories = [], hashtags = [] }) {
    const isEdit = Boolean(post?.id);

    const form = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        thumbnail: null,
        thumbnail_url: post?.thumbnail_url || null,
        category_id: post?.category_id || '',
        hashtag_ids: post?.hashtag_ids || [],
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        meta_keywords: post?.meta_keywords || '',
        status: post?.status || 'draft',
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
                text: 'Harap masukkan judul postingan sebelum menyimpan.',
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
                route('posts.update', post.id),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Postingan berhasil disimpan',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    },
                },
            );
        } else {
            form.transform(() => dataToSubmit).post(route('posts.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Postingan baru berhasil dibuat',
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
            'submit-review': route('posts.workflow.submit-review', post.id),
            approve: route('posts.workflow.approve', post.id),
            publish: route('posts.workflow.publish', post.id),
            'send-back': route('posts.workflow.send-back', post.id),
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
            text: 'Konten saat ini akan ditimpa dengan riwayat versi yang dipilih.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Rollback',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#4f46e5',
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route('posts.rollback', [post.id, revisionId]),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire('Berhasil!', 'Versi postingan telah dipulihkan.', 'success');
                        },
                    },
                );
            }
        });
    };

    return (
        <EditorLayout
            backUrl={route('posts.index')}
            backLabel="Posts"
            title={form.data.title}
            status={form.data.status}
            dirty={form.isDirty}
            saving={form.processing}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            publishLabel={
                form.data.status === 'published' ? 'Update Post' : 'Publish Post'
            }
            publishLoading={form.processing}
            sidebarContent={
                <DocumentSidebar
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    categories={categories}
                    hashtags={hashtags}
                    revisions={post?.revisions || []}
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
                                            Approve Post
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="danger-outline"
                                            onClick={() => handleWorkflowAction('send-back')}
                                            icon={RotateCcw}
                                        >
                                            Send Back to Draft
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
            <Head title={isEdit ? `Edit: ${post.title}` : 'Create New Post'} />

            <div className="space-y-6">
                {/* Title Input ala Medium / Gutenberg */}
                <textarea
                    rows={1}
                    value={form.data.title}
                    onChange={(e) => {
                        form.setData('title', e.target.value);
                        // Auto slug if creating
                        if (!isEdit && !form.data.slug) {
                            form.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                        }
                    }}
                    placeholder="Add Post Title..."
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

                {/* TipTap Rich Content Canvas */}
                <TipTapEditor
                    content={form.data.content}
                    onChange={(html) => form.setData('content', html)}
                    placeholder="Type '/' for commands, or start writing your article..."
                    minHeight="550px"
                />

                {form.errors.content && (
                    <p className="text-xs text-rose-500">{form.errors.content}</p>
                )}
            </div>
        </EditorLayout>
    );
}
