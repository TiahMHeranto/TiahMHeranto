import type { ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import profileMarkdown from '../../../../../TiahMHeranto.md?raw'

const VARIATION_SELECTOR_16 = String.fromCharCode(0xfe0f)
const ZERO_WIDTH_JOINER = String.fromCharCode(0x200d)
const EMOJI_PREFIX_RE = new RegExp(
  `^[\\p{Extended_Pictographic}${VARIATION_SELECTOR_16}${ZERO_WIDTH_JOINER}\\s]+`,
  'u',
)

function stripEmojiPrefix(node: ReactNode): ReactNode {
  if (typeof node !== 'string') return node
  return node.replace(EMOJI_PREFIX_RE, '')
}

function stripEmoji(children: ReactNode): ReactNode {
  return Array.isArray(children)
    ? children.map((child, index) =>
        typeof child === 'string' ? stripEmojiPrefix(child) : child ?? index,
      )
    : stripEmojiPrefix(children)
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  return ''
}

interface TimelineEntry {
  period: string
  events: string[]
}

function parseMermaidTimeline(source: string): TimelineEntry[] {
  const entries: TimelineEntry[] = []

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trim()
    if (!line || line === 'timeline' || line.startsWith('title')) continue

    if (line.startsWith(':')) {
      entries.at(-1)?.events.push(line.slice(1).trim())
      continue
    }

    const match = line.match(/^(.+?)\s*:\s*(.+)$/)
    if (match) {
      entries.push({ period: match[1], events: [match[2]] })
    }
  }

  return entries
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative my-2 space-y-6 border-l border-[var(--border)] pl-6">
      {entries.map((entry) => (
        <li key={entry.period} className="relative">
          <span className="absolute -left-[1.65rem] top-1 h-2 w-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg)]" />
          <p className="font-mono text-sm font-bold text-[var(--fg-strong)] sm:text-base">
            {entry.period}
          </p>
          <ul className="mt-1 space-y-1">
            {entry.events.map((event) => (
              <li
                key={event}
                className="flex gap-2 text-sm text-[var(--fg-muted)] sm:text-base"
              >
                <span className="text-[var(--fg-faint)]">›</span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 border-b border-[var(--border)] pb-3 font-mono text-xl font-bold uppercase tracking-widest text-[var(--fg-strong)] sm:text-2xl md:text-3xl">
      {stripEmoji(children)}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-10 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[var(--fg-strong)] first:mt-0 sm:text-sm md:text-base">
      <span className="text-[var(--fg-faint)]">//</span>
      {stripEmoji(children)}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 font-mono text-sm font-semibold text-[var(--fg)] sm:text-base">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed text-[var(--fg-subtle)] sm:text-base">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 space-y-1.5 [&_ul]:mt-1.5 [&_ul]:border-l [&_ul]:border-[var(--border)] [&_ul]:pl-4">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
      <span className="text-[var(--fg-faint)]">›</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--fg-strong)]">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[var(--fg-strong)] underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--fg-strong)]"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-[var(--border)]" />,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-[var(--border-strong)] pl-4 font-mono text-sm italic text-[var(--fg-dim)] sm:text-base">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-left font-mono text-xs sm:text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-[var(--border-strong)]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="py-2 pr-4 uppercase tracking-widest text-[var(--fg-subtle)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[var(--border)] py-2 pr-4 text-[var(--fg-muted)]">
      {children}
    </td>
  ),
  code: ({ className, children }) => {
    if (className?.includes('language-mermaid')) {
      return <Timeline entries={parseMermaidTimeline(extractText(children))} />
    }
    return (
      <code className="rounded bg-[var(--btn-bg)] px-1.5 py-0.5 font-mono text-[var(--fg)]">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
}

function About() {
  return (
    <article>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {profileMarkdown}
      </ReactMarkdown>
    </article>
  )
}

export default About