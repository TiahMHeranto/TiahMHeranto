import type { ReactNode } from 'react'
import type { MouseEvent } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  FiCheckCircle,
  FiCpu,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiWifi,
} from 'react-icons/fi'
import rawProfileMarkdown from '../../../../../TiahMHeranto.md?raw'
import { normalizeMarkdown, extractSection, splitSections } from '../../../utils/markdown'

const profileMarkdown = normalizeMarkdown(rawProfileMarkdown)

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

interface PersonalInfoField {
  label: string
  value: string
}

function parsePersonalInfo(body: string): PersonalInfoField[] {
  const fields: PersonalInfoField[] = []

  for (const rawLine of body.split('\n')) {
    const match = rawLine.match(/^- \*\*(.+?):\*\*\s*(.+)$/)
    if (match) {
      fields.push({ label: match[1].trim(), value: match[2].trim() })
    }
  }

  return fields
}

function getFieldValue(fields: PersonalInfoField[], label: string): string {
  return fields.find((field) => field.label.toLowerCase() === label.toLowerCase())?.value ?? ''
}

function generateIdNumber(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return `TMH-${(hash % 9000) + 1000}`
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
    { label: 'Years Active', value: `${yearsActive - 2}+` },
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
const { body: personalInfoBody, rest: withoutPersonalInfo } = extractSection(
  withoutExpertise,
  /^## .*Personal Information.*$/i,
)

const TITLE_RE = /^# (.+)$/m
const titleMatch = withoutPersonalInfo.match(TITLE_RE)
const pageTitle = titleMatch ? titleMatch[1].trim() : ''
const bodyMarkdown = withoutPersonalInfo.replace(TITLE_RE, '').replace(/^\s+/, '')

const heroQuote = extractBlockquote(philosophyBody)
const expertiseAreas = parseExpertiseAreas(expertiseBody)
const profileStats = computeProfileStats(profileMarkdown)
const personalInfo = parsePersonalInfo(personalInfoBody)
const cardholderName = getFieldValue(personalInfo, 'Full Name')
const idNumber = generateIdNumber(cardholderName || pageTitle)

const sections = splitSections(bodyMarkdown, /^## /).map((section) => ({
  ...section,
  title: section.title.replace(EMOJI_PREFIX_RE, ''),
}))

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

function useTiltEffect() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 220,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 220,
    damping: 20,
  })

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return { rotateX, rotateY, onMouseMove, onMouseLeave }
}

function IdentityCard() {
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTiltEffect()

  if (personalInfo.length === 0) return null

  const location = getFieldValue(personalInfo, 'Location')
  const phone = getFieldValue(personalInfo, 'Phone')
  const email = getFieldValue(personalInfo, 'Email')

  return (
    <section className="mb-10" style={{ perspective: 1200 }}>
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={{ boxShadow: '0px 8px 20px -8px rgba(0,0,0,0.4)' }}
        whileHover={{ scale: 1.015, boxShadow: '0px 30px 50px -15px rgba(0,0,0,0.55)' }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative overflow-hidden rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-5 sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
            <FiCreditCard className="h-3.5 w-3.5" />
            System Access Card
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-dim)]">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--fg-strong)]"
            />
            Verified
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="relative mx-auto h-24 w-24 shrink-0 sm:mx-0">
            <img
              src="/20251231_135847.jpg"
              alt={cardholderName || 'Identity photo'}
              className="h-full w-full rounded-md object-cover grayscale contrast-125"
            />
            <CornerBrackets />
          </div>

          <div>
            <p className="font-mono text-lg font-bold uppercase tracking-wide text-[var(--fg-strong)] sm:text-xl">
              {cardholderName}
            </p>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-faint)]">
              ID {idNumber}
            </p>

            <div className="grid gap-2.5">
              {location && (
                <div className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)]">
                  <FiMapPin className="h-3.5 w-3.5 shrink-0 text-[var(--fg-faint)]" />
                  <span>{location}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)]">
                  <FiPhone className="h-3.5 w-3.5 shrink-0 text-[var(--fg-faint)]" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--accent)]"
                >
                  <FiMail className="h-3.5 w-3.5 shrink-0 text-[var(--fg-faint)]" />
                  <span className="underline decoration-[var(--border-strong)] underline-offset-4">
                    {email}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div
            className="h-5 w-32 opacity-60"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, var(--fg-strong) 0px, var(--fg-strong) 2px, transparent 2px, transparent 5px)',
            }}
          />
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-faint)]">
            <FiCheckCircle className="h-3 w-3" />
            Clearance Granted
          </span>
        </div>
      </motion.div>
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
    <h3 className="mt-5 border-t border-[var(--border)] pt-4 font-mono text-sm font-semibold text-[var(--fg)] first:mt-0 first:border-t-0 first:pt-0 sm:text-base">
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
      className="text-[var(--accent)] underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--accent)]"
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

const chipComponents: Components = {
  ...components,
  ul: ({ children }) => <ul className="mb-2 flex flex-wrap gap-2">{children}</ul>,
  li: ({ children }) => (
    <li className="rounded border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--fg-dim)]">
      {children}
    </li>
  ),
}

function KeywordChips({ body }: { body: string }) {
  const tags = body.match(/#[A-Za-z0-9]+/g) ?? []
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--fg-dim)]"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

type BoardVariant = 'default' | 'chips' | 'keywords'

function getBoardVariant(title: string): BoardVariant {
  if (/technical competencies/i.test(title)) return 'chips'
  if (/professional keywords/i.test(title)) return 'keywords'
  return 'default'
}

function BoardDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full border border-[var(--border-strong)]" />
      <span className="h-1.5 w-1.5 rounded-full border border-[var(--border-strong)]" />
      <span className="h-1.5 w-1.5 rounded-full border border-[var(--border-strong)]" />
    </div>
  )
}

interface BoardProps {
  title: string
  body: string
}

function Board({ title, body }: BoardProps) {
  const variant = getBoardVariant(title)

  return (
    <section className="mb-6 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--content-bg)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--panel-bg)] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-strong)] sm:text-xs">
          <span className="text-[var(--fg-faint)]">//</span>
          {title}
        </div>
        <BoardDots />
      </header>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {variant === 'keywords' ? (
          <KeywordChips body={body} />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={variant === 'chips' ? chipComponents : components}
          >
            {body}
          </ReactMarkdown>
        )}
      </div>
    </section>
  )
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
      <IdentityCard />
      <AreaCards />
      {sections.map((section) => (
        <Board key={section.title} title={section.title} body={section.body} />
      ))}
    </article>
  )
}

export default About