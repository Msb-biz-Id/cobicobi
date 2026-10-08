import { useState, useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import EditorLayout from '@/Layouts/EditorLayout';
import TipTapEditor from '@/Components/Editor/TipTapEditor';
import DocumentSidebar from '@/Components/Editor/DocumentSidebar';
import ContentPreviewModal from '@/Components/Editor/ContentPreviewModal';
import Button from '@/Components/UI/Button';
import Swal from 'sweetalert2';
import { Send, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PostEdit({
    post,
    categories = [],
    hashtags = [],
    authors = [],
    editors = [],
    currentUser = {},
}) {
    const isEdit = Boolean(post?.id);
    const [previewOpen, setPreviewOpen] = useState(false);

    const form = useForm({
        user_id: post?.user_id || currentUser?.id || '',
        author_name: post?.author_name || '',
        editor_id: post?.editor_id || '',
        editor_name: post?.editor_name || '',
        source: post?.source || '',
        source_url: post?.source_url || '',
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        thumbnail: null,
        thumbnail_url: post?.thumbnail_url || null,
        category_id: post?.category_id || '',
        hashtag_ids: post?.hashtag_ids || [],
        new_hashtags: [],
        published_at: post?.published_at || '',
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        meta_keywords: post?.meta_keywords || '',
        status: post?.status || 'draft',
    });

    const isFutureSchedule = useMemo(() => {
        if (!form.data.published_at) return false;
        return new Date(form.data.published_at) > new Date();
    }, [form.data.published_at]);

    const handleSaveDraft = (e) => {
        if (e) e.preventDefault();
        submitForm('draft');
    };

    const handlePublish = (e) => {
        if (e) e.preventDefault();
        if (isFutureSchedule || form.data.status === 'scheduled') {
            submitForm('scheduled');
        } else {
            submitForm('published');
        }
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

    const selectedCategoryName = useMemo(() => {
        const cat = categories.find((c) => String(c.id) === String(form.data.category_id));
        return cat?.name || '';
    }, [categories, form.data.category_id]);

    const selectedTagNames = useMemo(() => {
        const existingNames = hashtags
            .filter((h) => (form.data.hashtag_ids || []).includes(h.id))
            .map((h) => h.name);
        return [...existingNames, ...(form.data.new_hashtags || [])];
    }, [hashtags, form.data.hashtag_ids, form.data.new_hashtags]);

    const publishButtonLabel = useMemo(() => {
        if (isFutureSchedule || form.data.status === 'scheduled') {
            return 'Jadwalkan Post';
        }
        if (form.data.status === 'published') {
            return 'Perbarui Post';
        }
        return 'Publish Post';
    }, [isFutureSchedule, form.data.status]);

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
            onPreview={() => setPreviewOpen(true)}
            publishLabel={publishButtonLabel}
            publishLoading={form.processing}
            sidebarContent={
                <DocumentSidebar
                    data={form.data}
                    setData={form.setData}
                    errors={form.errors}
                    categories={categories}
                    hashtags={hashtags}
                    authors={authors}
                    editors={editors}
                    currentUser={currentUser}
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

            {/* Universal Content Preview Modal */}
            <ContentPreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Pratinjau Postingan"
                type="post"
                data={form.data}
                categoryName={selectedCategoryName}
                tagNames={selectedTagNames}
                authorName={
                    form.data.author_name ||
                    authors.find((u) => String(u.id) === String(form.data.user_id))?.name ||
                    currentUser?.name ||
                    'Redaksi Kampus'
                }
                editorName={
                    form.data.editor_name ||
                    editors.find((e) => String(e.id) === String(form.data.editor_id))?.name ||
                    ''
                }
                source={form.data.source}
                sourceUrl={form.data.source_url}
                publicUrl={form.data.slug ? route('public.posts.show', form.data.slug) : null}
            />
        </EditorLayout>
    );
}
