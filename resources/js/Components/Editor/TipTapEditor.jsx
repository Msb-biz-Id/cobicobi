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
import { useState, useEffect } from 'react';
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
