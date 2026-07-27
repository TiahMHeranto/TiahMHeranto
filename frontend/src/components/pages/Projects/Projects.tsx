import { FiAward, FiCode, FiCpu, FiGithub, FiLock, FiShield, FiSmartphone } from 'react-icons/fi'
import rawProjectMarkdown from '../../../../../Project.md?raw'
import { normalizeMarkdown, extractSection } from '../../../utils/markdown'

const projectMarkdown = normalizeMarkdown(rawProjectMarkdown)

type Category = 'ai' | 'network' | 'mobile' | 'web'

const CATEGORY_ICONS: Record<Category, typeof FiCode> = {
  ai: FiCpu,
  network: FiShield,
  mobile: FiSmartphone,
  web: FiCode,
}

function inferCategory(stack: string[]): Category {
  const joined = stack.join(' ').toLowerCase()
  if (joined.includes('ollama') || joined.includes('gemma')) return 'ai'
  if (joined.includes('tkinter') || joined.includes('network')) return 'network'
  if (joined.includes('expo') || joined.includes('react native')) return 'mobile'
  return 'web'
}

interface Project {
  number: string
  name: string
  year: string
  role: string
  description: string
  stack: string[]
  featureCount: number
  repoUrl: string | null
  repoLabel: string | null
  isPrivate: boolean
}

const PROJECT_HEADING_RE = /^### (\d+)\.\s+(.+?)\s*\((\d{4})\)\s*$/
const IGNORED_SUBSECTION_RE =
  /^\*\*(Architecture|Core Services|Key Routes|Development (Focus|Philosophy)):?\*\*$/i

function deriveRepoLabel(url: string): string {
  try {
    const { pathname } = new URL(url)
    return pathname.replace(/^\//, '').replace(/\.git$/, '')
  } catch {
    return url
  }
}

function parseProjectBody(body: string): Omit<Project, 'number' | 'name' | 'year'> {
  const lines = body.split('\n').map((line) => line.trim())

  let role = ''
  let description = ''
  const stack: string[] = []
  let featureCount = 0
  let repoValue: string | null = null
  let section: 'stack' | 'features' | 'links' | null = null

  for (const line of lines) {
    if (!line || line.startsWith('```')) continue

    if (/^\*\*Tech Stack:\*\*$/i.test(line)) {
      section = 'stack'
      continue
    }
    if (/^\*\*Key Features:\*\*$/i.test(line)) {
      section = 'features'
      continue
    }
    if (/^\*\*Links:\*\*$/i.test(line)) {
      section = 'links'
      continue
    }
    if (IGNORED_SUBSECTION_RE.test(line)) {
      section = null
      continue
    }

    if (!role && !section && /^\*\*(.+)\*\*$/.test(line)) {
      role = line.replace(/^\*\*(.+)\*\*$/, '$1')
      continue
    }

    if (!description && !section && !line.startsWith('-') && !line.startsWith('>')) {
      description = line
      continue
    }

    if (section === 'stack' && line.startsWith('-')) {
      const item = line.replace(/^-\s*/, '').replace(/\*\*/g, '')
      const [, afterColon] = item.split(/:\s*/)
      const values = (afterColon ?? item)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      stack.push(...values)
      continue
    }

    if (section === 'features' && line.startsWith('-')) {
      featureCount += 1
      continue
    }

    if (section === 'links' && /^- Repository:/i.test(line)) {
      const match = line.match(/Repository:\s*(.+)$/i)
      repoValue = match ? match[1].trim() : null
    }
  }

  const repoUrl =
    repoValue && /^https?:\/\//i.test(repoValue) ? repoValue.replace(/\.git$/, '') : null

  return {
    role,
    description,
    stack,
    featureCount,
    repoUrl,
    repoLabel: repoUrl ? deriveRepoLabel(repoUrl) : null,
    isPrivate: Boolean(repoValue) && !repoUrl,
  }
}

function parseProjects(source: string): Project[] {
  const lines = source.split('\n')
  const headings = lines
    .map((line, index) => ({ index, match: line.match(PROJECT_HEADING_RE) }))
    .filter((entry): entry is { index: number; match: RegExpMatchArray } => entry.match !== null)

  return headings.map(({ index, match }, i) => {
    const bodyEnd = i + 1 < headings.length ? headings[i + 1].index : lines.length
    const body = lines.slice(index + 1, bodyEnd).join('\n')

    return {
      number: match[1],
      name: match[2],
      year: match[3],
      ...parseProjectBody(body),
    }
  })
}

interface Award {
  title: string
  subtitle: string
  bullets: string[]
}

function parseAward(body: string): Award {
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const titleLine = lines.find((line) => line.startsWith('### '))
  const subtitleLine = lines.find((line) => /^\*\*(.+)\*\*$/.test(line))
  const bullets = lines
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s*/, ''))

  return {
    title: titleLine ? titleLine.replace(/^### /, '') : '',
    subtitle: subtitleLine ? subtitleLine.replace(/^\*\*(.+)\*\*$/, '$1') : '',
    bullets,
  }
}

const projects = parseProjects(projectMarkdown)
const award = parseAward(extractSection(projectMarkdown, /^## .*Award-Winning Project.*$/i).body)
const uniqueTechCount = new Set(projects.flatMap((p) => p.stack.map((s) => s.toLowerCase()))).size

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-2xl font-bold text-[var(--fg-strong)] sm:text-3xl">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-faint)] sm:text-[10px]">
        {label}
      </p>
    </div>
  )
}

function ProjectsHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] pb-6">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
          // Project Archive
        </p>
        <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-[var(--fg-strong)] sm:text-2xl md:text-3xl">
          Deployed Systems
        </h1>
      </div>

      <div className="flex gap-6">
        <Stat label="Projects" value={String(projects.length)} />
        <Stat label="Technologies" value={String(uniqueTechCount)} />
        <Stat label="Awards" value={award.title ? '1' : '0'} />
      </div>
    </div>
  )
}

function AwardBanner() {
  if (!award.title) return null

  return (
    <section className="scanlines mb-10 rounded-md border border-[var(--border-strong)] bg-[var(--panel-bg)] p-4 sm:p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
        <FiAward className="h-3.5 w-3.5" />
        Award
      </div>
      <h2 className="mt-2 font-mono text-base font-bold text-[var(--fg-strong)] sm:text-lg">
        {award.title}
      </h2>
      {award.subtitle && (
        <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-[var(--fg-subtle)]">
          {award.subtitle}
        </p>
      )}
      {award.bullets.length > 0 && (
        <ul className="mt-3 space-y-1">
          {award.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-sm text-[var(--fg-muted)]">
              <span className="text-[var(--fg-faint)]">›</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ProjectThumbnail({ number, category }: { number: string; category: Category }) {
  const Icon = CATEGORY_ICONS[category]

  return (
    <div className="scanlines relative flex h-32 items-center justify-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg)] sm:h-36">
      <span className="absolute -right-1 -top-3 font-mono text-6xl font-bold text-[var(--fg-faint)] opacity-25 sm:text-7xl">
        {number.padStart(2, '0')}
      </span>
      <Icon className="relative h-8 w-8 text-[var(--fg-strong)]" />
      <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-faint)]">
        {category}
      </span>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const category = inferCategory(project.stack)

  return (
    <article className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--content-bg)] p-4 sm:p-5">
      <ProjectThumbnail number={project.number} category={category} />

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-sm font-bold text-[var(--fg-strong)] sm:text-base">
          {project.name}
        </h3>
        <span className="shrink-0 font-mono text-[10px] text-[var(--fg-faint)]">
          {project.year}
        </span>
      </div>

      {project.role && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
          {project.role}
        </p>
      )}

      {project.description && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          {project.description}
        </p>
      )}

      {project.stack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-dim)]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
        {project.featureCount > 0 ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-faint)]">
            {project.featureCount} Features
          </span>
        ) : (
          <span />
        )}

        {project.repoUrl && project.repoLabel && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg)] underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--fg-strong)]"
          >
            <FiGithub className="h-3.5 w-3.5" />
            {project.repoLabel}
          </a>
        )}

        {!project.repoUrl && project.isPrivate && (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg-faint)]">
            <FiLock className="h-3.5 w-3.5" />
            Private repository
          </span>
        )}
      </div>
    </article>
  )
}

function Projects() {
  return (
    <div>
      <ProjectsHeader />
      <AwardBanner />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.number} project={project} />
        ))}
      </div>
    </div>
  )
}

export default Projects
