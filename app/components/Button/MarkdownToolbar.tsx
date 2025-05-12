
import { RefObject } from "react";

type Props = {
  content: string
  setContent: (value: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export const MarkdownToolbar = ({ content, setContent, textareaRef }: Props) => {
  const insertMarkdown = (before: string, after: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)

    const newText =
      content.slice(0, start) + before + selectedText + after + content.slice(end)

    setContent(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd =
        start + before.length + selectedText.length + after.length
    }, 0)
  }

  return (
    <div className="toolbar">
      <button onClick={() => insertMarkdown('**', '**')}>太字</button>
      <button onClick={() => insertMarkdown('# ', '')}>見出し</button>
      <button onClick={() => insertMarkdown('- ', '')}>リスト</button>
      <button onClick={() => insertMarkdown('`', '`')}>コード</button>
      <button onClick={() => insertMarkdown('```ts\n', '\n```')}>コードブロック</button>
    </div>
  )
}
