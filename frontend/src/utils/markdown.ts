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
