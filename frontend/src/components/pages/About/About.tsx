import type { ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiCpu, FiShield, FiWifi } from 'react-icons/fi'
import rawProfileMarkdown from '../../../../../TiahMHeranto.md?raw'

const profileMarkdown = rawProfileMarkdown.replace(/\r\n/g, '\n')

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

interface SectionSplit {
  body: string
  rest: string
}

function extractSection(source: string, headingRe: RegExp): SectionSplit {
  const lines = source.split('\n')
  const startIndex = lines.findIndex((line) => headingRe.test(line))
  if (startIndex === -1) return { body: '', rest: source }

  let endIndex = lines.length
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      endIndex = i
      break
    }
  }

  return {
    body: lines.slice(startIndex + 1, endIndex).join('\n'),
    rest: [...lines.slice(0, startIndex), ...lines.slice(endIndex)].join('\n'),
  }
}

function extractBlockquote(source: string): string {
  const match = source.match(/^>\s*"?(.+?)"?\s*$/m)
  return match ? match[1] : ''
}

interface ExpertiseArea {
  title: string
  items: string[]
}

function parseExpertiseAreas(body: string): ExpertiseArea[] {
  const areas: ExpertiseArea[] = []

  for (const rawLine of body.split('\n')) {
    const categoryMatch = rawLine.match(/^- \*\*(.+?)\*\*/)
    if (categoryMatch) {
      areas.push({ title: categoryMatch[1], items: [] })
      continue
    }

    const itemMatch = rawLine.match(/^\s{2,}- (.+)$/)
    if (itemMatch) {
      areas.at(-1)?.items.push(itemMatch[1])
    }
  }

  return areas
}

interface ProfileStat {
  label: string
  value: string
}

function computeProfileStats(source: string): ProfileStat[] {
  const skillCount = (
    extractSection(source, /^## .*Technical Competencies.*$/i).body.match(/^- /gm) ?? []
  ).length
  const roleCount = (
    extractSection(source, /^## .*Professional Experience.*$/i).body.match(/^### /gm) ?? []
  ).length
  const awardCount = (
    extractSection(source, /^## .*Awards.*$/i).body.match(/^### /gm) ?? []
  ).length

  const educationYears = [
    ...extractSection(source, /^## .*Education.*$/i).body.matchAll(/\b(19|20)\d{2}\b/g),
  ].map((match) => Number(match[0]))
  const firstYear = educationYears.length ? Math.min(...educationYears) : new Date().getFullYear()
  const yearsActive = Math.max(1, new Date().getFullYear() - firstYear)

  return [
    { label: 'Years Active', value: `${yearsActive}+` },
    { label: 'Technical Skills', value: `${skillCount}` },
    { label: 'Professional Roles', value: `${roleCount}` },
    { label: 'Awards Earned', value: `${awardCount}` },
  ]
}

const { body: philosophyBody, rest: withoutPhilosophy } = extractSection(
  profileMarkdown,
  /^## .*Professional Philosophy.*$/i,
)
const { body: expertiseBody, rest: withoutExpertise } = extractSection(
  withoutPhilosophy,
  /^## .*Areas of Interest.*$/i,
)

const TITLE_RE = /^# (.+)$/m
const titleMatch = withoutExpertise.match(TITLE_RE)
const pageTitle = titleMatch ? titleMatch[1].trim() : ''
const bodyMarkdown = withoutExpertise.replace(TITLE_RE, '').replace(/^\s+/, '')

const heroQuote = extractBlockquote(philosophyBody)
const expertiseAreas = parseExpertiseAreas(expertiseBody)
const profileStats = computeProfileStats(profileMarkdown)

const EXPERTISE_ICONS = [FiCpu, FiShield, FiWifi]

function CornerBrackets() {
  const corners = [
    '-left-1 -top-1 border-l border-t',
    '-right-1 -top-1 border-r border-t',
    '-left-1 -bottom-1 border-l border-b',
    '-right-1 -bottom-1 border-r border-b',
  ]

  return (
    <>
      {corners.map((cornerClass) => (
        <span
          key={cornerClass}
          className={`pointer-events-none absolute h-4 w-4 border-[var(--fg-strong)] ${cornerClass}`}
        />
      ))}
    </>
  )
}

function Hero() {
  return (
    <section className="mb-10 grid gap-8 border-b border-[var(--border)] pb-10 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
      <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-36 sm:w-36">
        <img
          src="/20251231_135847.jpg"
          alt="Tiaheranto Mandaniana Lalaharijaona Heriarinivo"
          className="h-full w-full rounded-md object-cover grayscale contrast-125"
        />
        <CornerBrackets />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
            // Operator Profile
          </p>
          {heroQuote && (
            <blockquote className="font-mono text-base italic leading-relaxed text-[var(--fg)] sm:text-lg">
              &ldquo;{heroQuote}&rdquo;
            </blockquote>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {profileStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-2xl font-bold text-[var(--fg-strong)] sm:text-3xl">
                {stat.value}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-faint)] sm:text-[10px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AreaCards() {
  if (expertiseAreas.length === 0) return null

  return (
    <section className="mb-10 grid gap-4 sm:grid-cols-3">
      {expertiseAreas.map((area, index) => {
        const Icon = EXPERTISE_ICONS[index % EXPERTISE_ICONS.length]
        const featured = index === 0

        return (
          <div
            key={area.title}
            className={`rounded-lg border p-5 ${
              featured
                ? 'border-[var(--fg-strong)] bg-[var(--fg-strong)]'
                : 'border-[var(--border)] bg-[var(--content-bg)]'
            }`}
          >
            <Icon
              className="mb-4 h-6 w-6"
              style={{ color: featured ? 'var(--bg)' : 'var(--fg-strong)' }}
            />
            <h3
              className="mb-1 font-mono text-sm font-bold uppercase tracking-wide sm:text-base"
              style={{ color: featured ? 'var(--bg)' : 'var(--fg-strong)' }}
            >
              {area.title}
            </h3>
            <p
              className="mb-3 font-mono text-[9px] uppercase tracking-widest sm:text-[10px]"
              style={{ color: featured ? 'var(--bg)' : 'var(--fg-faint)' }}
            >
              {area.items.length} Focus Areas
            </p>
            <ul className="space-y-1 text-sm">
              {area.items.map((item) => (
                <li key={item} style={{ color: featured ? 'var(--bg)' : 'var(--fg-muted)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
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
      {pageTitle && (
        <h1 className="mb-8 font-mono text-xl font-bold uppercase tracking-widest text-[var(--fg-strong)] sm:text-2xl md:text-3xl">
          {pageTitle}
        </h1>
      )}
      <Hero />
      <AreaCards />
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {bodyMarkdown}
      </ReactMarkdown>
    </article>
  )
}

export default About