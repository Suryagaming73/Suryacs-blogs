'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { common, createLowlight } from 'lowlight'
import { useEffect, useState } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Quote,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Link as LinkIcon, Video as YoutubeIcon,
  Heading1, Heading2, Heading3, Minus, Undo, Redo, Code2
} from 'lucide-react'

const lowlight = createLowlight(common)

interface PostEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarBtn({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`editor-toolbar-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

export function PostEditor({ value, onChange, placeholder = 'Start writing your post...' }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Youtube.configure({ controls: true, nocookie: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      handleDrop: function(view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
              const node = schema.nodes.image.create({ src })
              const transaction = view.state.tr.insert(coordinates?.pos || 0, node)
              view.dispatch(transaction)
            }
            reader.readAsDataURL(file)
            return true // handled
          }
        }
        return false
      },
      handlePaste: function(view, event, slice) {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0]
          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              const { schema } = view.state
              const node = schema.nodes.image.create({ src })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            }
            reader.readAsDataURL(file)
            return true // handled
          }
        }
        return false
      }
    },
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [showYtInput, setShowYtInput] = useState(false)

  if (!editor) return <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius)' }} />

  function addLink() {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl(''); setShowLinkInput(false)
    }
  }
  function addImage() {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl(''); setShowImageInput(false)
    }
  }
  function addYoutube() {
    if (youtubeUrl) {
      editor?.commands.setYoutubeVideo({ src: youtubeUrl })
      setYoutubeUrl(''); setShowYtInput(false)
    }
  }

  return (
    <div className="editor-wrap">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarBtn>
        <div className="editor-toolbar-separator" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={15} /></ToolbarBtn>
        <div className="editor-toolbar-separator" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code"><Code size={14} /></ToolbarBtn>
        <div className="editor-toolbar-separator" />

        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={14} /></ToolbarBtn>
        <div className="editor-toolbar-separator" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List"><ListOrdered size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block"><Code2 size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14} /></ToolbarBtn>
        <div className="editor-toolbar-separator" />

        {/* Link */}
        <div style={{ position: 'relative' }}>
          <ToolbarBtn onClick={() => { setShowLinkInput(v => !v); setShowImageInput(false); setShowYtInput(false) }} active={editor.isActive('link')} title="Insert Link"><LinkIcon size={14} /></ToolbarBtn>
          {showLinkInput && (
            <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 100, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', display: 'flex', gap: '0.375rem', minWidth: 260 }}>
              <input className="input" style={{ padding: '0.35rem 0.625rem', fontSize: '0.8rem' }} placeholder="https://..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLink()} autoFocus />
              <button type="button" className="btn btn-primary btn-sm" onClick={addLink}>Add</button>
            </div>
          )}
        </div>

        {/* Image */}
        <div style={{ position: 'relative' }}>
          <ToolbarBtn onClick={() => { setShowImageInput(v => !v); setShowLinkInput(false); setShowYtInput(false) }} title="Insert Image"><ImageIcon size={14} /></ToolbarBtn>
          {showImageInput && (
            <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 100, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 260 }}>
              <input type="file" className="input" accept="image/*" style={{ padding: '0.35rem', fontSize: '0.8rem' }} onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (ev) => {
                    const src = ev.target?.result as string
                    editor?.chain().focus().setImage({ src }).run()
                    setShowImageInput(false)
                  }
                  reader.readAsDataURL(file)
                }
              }} />
              <div className="text-xs text-center text-muted">OR PASTE URL</div>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                <input className="input" style={{ padding: '0.35rem 0.625rem', fontSize: '0.8rem', flex: 1 }} placeholder="Image URL..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addImage()} autoFocus />
                <button type="button" className="btn btn-primary btn-sm" onClick={addImage}>Add</button>
              </div>
            </div>
          )}
        </div>

        {/* YouTube */}
        <div style={{ position: 'relative' }}>
          <ToolbarBtn onClick={() => { setShowYtInput(v => !v); setShowLinkInput(false); setShowImageInput(false) }} title="Embed YouTube"><YoutubeIcon size={14} /></ToolbarBtn>
          {showYtInput && (
            <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 100, background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', display: 'flex', gap: '0.375rem', minWidth: 280 }}>
              <input className="input" style={{ padding: '0.35rem 0.625rem', fontSize: '0.8rem' }} placeholder="YouTube URL..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addYoutube()} autoFocus />
              <button type="button" className="btn btn-primary btn-sm" onClick={addYoutube}>Embed</button>
            </div>
          )}
        </div>
      </div>

      {/* Editor body */}
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
