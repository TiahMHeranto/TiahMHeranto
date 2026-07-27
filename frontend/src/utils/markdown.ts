export function normalizeMarkdown(raw: string): string {
  return raw.replace(/\r\n/g, '\n')
}

export interface SectionSplit {
  body: string
  rest: string
}

/** Extracts the body of the first `## `-level heading matching `headingRe`, up to the next `## ` heading. */
export function extractSection(source: string, headingRe: RegExp): SectionSplit {
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

export interface MarkdownSection {
  title: string
  body: string
}

/** Splits `source` into one section per heading line matching `headingRe`, each running until the next match. */
export function splitSections(source: string, headingRe: RegExp): MarkdownSection[] {
  const lines = source.split('\n')
  const headings = lines
    .map((line, index) => ({ index, line }))
    .filter(({ line }) => headingRe.test(line))

  return headings.map(({ index, line }, i) => {
    const bodyEnd = i + 1 < headings.length ? headings[i + 1].index : lines.length
    return {
      title: line.replace(/^#+\s*/, '').trim(),
      body: lines.slice(index + 1, bodyEnd).join('\n'),
    }
  })
}
