import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Table as TableIcon,
} from 'lucide-react';

export default function EditorToolbar({ editor, onOpenMediaPicker }) {
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const Button = ({ onClick, active, disabled, title, children }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors ${
                active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );

    const Divider = () => <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />;

    return (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200/80 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-900/60 sticky top-0 z-20 backdrop-blur-xs">
            {/* History */}
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
            >
                <Undo className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
            >
                <Redo className="h-3.5 w-3.5" />
            </Button>

            <Divider />

            {/* Headings */}
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
            >
                <Heading3 className="h-3.5 w-3.5" />
            </Button>

            <Divider />

            {/* Formatting */}
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
            >
                <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
            >
                <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive('underline')}
                title="Underline (Ctrl+U)"
            >
                <UnderlineIcon className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')}
                title="Strikethrough"
            >
                <Strikethrough className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
                title="Inline Code"
            >
                <Code className="h-3.5 w-3.5" />
            </Button>

            <Divider />

            {/* Alignment */}
            <Button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                active={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
            >
                <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                active={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
            >
                <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                active={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
            >
                <AlignRight className="h-3.5 w-3.5" />
            </Button>

            <Divider />

            {/* Lists & Quotes */}
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                title="Ordered List"
            >
                <ListOrdered className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Blockquote"
            >
                <Quote className="h-3.5 w-3.5" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus className="h-3.5 w-3.5" />
            </Button>

            <Divider />

            {/* Links & Media */}
            <Button onClick={setLink} active={editor.isActive('link')} title="Insert Link">
                <LinkIcon className="h-3.5 w-3.5" />
            </Button>
            <Button onClick={insertTable} title="Insert Table">
                <TableIcon className="h-3.5 w-3.5" />
            </Button>
            {onOpenMediaPicker && (
                <button
                    type="button"
                    onClick={onOpenMediaPicker}
                    className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/40 transition-colors"
                >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Add Media
                </button>
            )}
        </div>
    );
}
