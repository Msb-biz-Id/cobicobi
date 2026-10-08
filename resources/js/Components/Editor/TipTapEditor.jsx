import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { useState, useEffect, useCallback } from 'react';
import EditorToolbar from './EditorToolbar';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';

export default function TipTapEditor({
    content = '',
    onChange = () => {},
    placeholder = 'Start writing your story or content here...',
    className = '',
    minHeight = '350px',
}) {
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

    // Block Mover Helpers (Gutenberg-style Up / Down)
    const moveBlockUp = useCallback((ed) => {
        if (!ed || !ed.view) return false;
        const { state, dispatch } = ed.view;
        const { selection, doc } = state;
        const $from = selection.$from;
        const index = $from.index(0);
        if (index <= 0) return false;

        let posBeforePrev = 0;
        for (let i = 0; i < index - 1; i++) {
            posBeforePrev += doc.child(i).nodeSize;
        }
        const prevNode = doc.child(index - 1);
        const currentNode = doc.child(index);
        const currentPos = posBeforePrev + prevNode.nodeSize;

        const tr = state.tr;
        tr.delete(currentPos, currentPos + currentNode.nodeSize);
        tr.insert(posBeforePrev, currentNode);
        const offset = Math.min($from.pos - currentPos, currentNode.nodeSize - 1);
        const targetPos = Math.max(0, posBeforePrev + Math.max(1, offset));
        tr.setSelection(selection.constructor.near(tr.doc.resolve(targetPos)));
        dispatch(tr.scrollIntoView());
        return true;
    }, []);

    const moveBlockDown = useCallback((ed) => {
        if (!ed || !ed.view) return false;
        const { state, dispatch } = ed.view;
        const { selection, doc } = state;
        const $from = selection.$from;
        const index = $from.index(0);
        if (index >= doc.childCount - 1) return false;

        let currentPos = 0;
        for (let i = 0; i < index; i++) {
            currentPos += doc.child(i).nodeSize;
        }
        const currentNode = doc.child(index);
        const nextNode = doc.child(index + 1);

        const tr = state.tr;
        tr.delete(currentPos, currentPos + currentNode.nodeSize);
        tr.insert(currentPos + nextNode.nodeSize, currentNode);
        const offset = Math.min($from.pos - currentPos, currentNode.nodeSize - 1);
        const targetPos = Math.max(0, currentPos + nextNode.nodeSize + Math.max(1, offset));
        tr.setSelection(selection.constructor.near(tr.doc.resolve(targetPos)));
        dispatch(tr.scrollIntoView());
        return true;
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full my-4 mx-auto shadow-sm',
                },
            }),
            Youtube.configure({
                inline: false,
                controls: true,
                nocookie: true,
                allowFullscreen: true,
                autoplay: false,
                HTMLAttributes: {
                    class: 'aspect-video w-full rounded-2xl shadow-md my-6 mx-auto overflow-hidden border border-slate-200 dark:border-slate-800',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline font-medium hover:text-indigo-700',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none dark:prose-invert p-6 min-h-[300px] text-base leading-relaxed',
            },
            handleKeyDown: (view, event) => {
                if (event.altKey && event.key === 'ArrowUp') {
                    event.preventDefault();
                    if (editor) return moveBlockUp(editor);
                }
                if (event.altKey && event.key === 'ArrowDown') {
                    event.preventDefault();
                    if (editor) return moveBlockDown(editor);
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync content if changed externally
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only update if fundamentally different to avoid cursor reset
            const isSame = editor.getHTML() === content || (editor.isEmpty && !content);
            if (!isSame) {
                editor.commands.setContent(content, false);
            }
        }
    }, [content, editor]);

    const handleInsertMedia = (media) => {
        if (!editor || !media?.image_url) return;
        editor
            .chain()
            .focus()
            .setImage({
                src: media.image_url,
                alt: media.alt_text || media.title || '',
                title: media.title || '',
            })
            .run();
    };

    return (
        <div className={`surface-card overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 ${className}`}>
            <EditorToolbar
                editor={editor}
                onOpenMediaPicker={() => setMediaPickerOpen(true)}
                onMoveBlockUp={() => moveBlockUp(editor)}
                onMoveBlockDown={() => moveBlockDown(editor)}
            />

            <div style={{ minHeight }} className="tiptap-wrapper">
                <EditorContent editor={editor} />
            </div>

            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleInsertMedia}
                title="Insert Media into Content"
                confirmLabel="Insert into Content"
            />
        </div>
    );
}
