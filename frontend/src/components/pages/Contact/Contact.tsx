import { useState } from 'react'
import type { MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiCopy } from 'react-icons/fi'
import type { IconType } from 'react-icons'

const EMAIL = 'mandanianatiaheranto@gmail.com'
const PHONE_DISPLAY = '+261 34 91 160 56'
const WHATSAPP_NUMBER = PHONE_DISPLAY.replace(/\D/g, '')

// Pending: no LinkedIn URL exists yet in the project's profile data.
const LINKEDIN_URL: string = ''

interface ContactChannel {
  key: string
  label: string
  value: string
  href: string | null
  Icon: IconType
  copyValue?: string
}

const CHANNELS: ContactChannel[] = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: LINKEDIN_URL ? LINKEDIN_URL.replace(/^https?:\/\//, '') : 'Link pending',
    href: LINKEDIN_URL || null,
    Icon: FaLinkedin,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: PHONE_DISPLAY,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    Icon: FaWhatsapp,
    copyValue: PHONE_DISPLAY,
  },
  {
    key: 'email',
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    Icon: FaEnvelope,
    copyValue: EMAIL,
  },
]

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access denied — the value is still visible to copy manually.
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={copied ? 'Copied' : `Copy ${value}`}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--btn-bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)]"
    >
      {copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
    </motion.button>
  )
}

function ContactTile({ channel }: { channel: ContactChannel }) {
  const isPending = !channel.href
  const Icon = channel.Icon

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border)] bg-[var(--btn-bg)]">
          <Icon className="h-4 w-4 text-[var(--fg-strong)]" />
        </div>
        {channel.copyValue && <CopyButton value={channel.copyValue} />}
      </div>

      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-faint)]">
          {channel.label}
        </p>
        <p
          className={`mt-1 break-all font-mono text-sm text-[var(--fg)] sm:text-base ${
            isPending ? 'italic text-[var(--fg-faint)]' : ''
          }`}
        >
          {channel.value}
        </p>
      </div>
    </>
  )

  const sharedClassName =
    'flex flex-col rounded-lg border border-[var(--border)] bg-[var(--content-bg)] p-5 text-left transition-colors sm:p-6'

  if (isPending) {
    return <div className={`${sharedClassName} cursor-not-allowed opacity-60`}>{content}</div>
  }

  return (
    <motion.a
      href={channel.href ?? undefined}
      target={channel.href?.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`${sharedClassName} hover:border-[var(--border-hover)]`}
    >
      {content}
    </motion.a>
  )
}

function Contact() {
  return (
    <div>
      <div className="mb-8 border-b border-[var(--border)] pb-6">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
          // Contact
        </p>
        <h1 className="mb-3 font-mono text-xl font-bold uppercase tracking-widest text-[var(--fg-strong)] sm:text-2xl md:text-3xl">
          Establish Connection
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--fg-subtle)]">
          Open channels for collaboration, opportunities, or just to talk shop about AI, security, or
          whatever's on the workbench. Pick whichever works best for you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((channel) => (
          <ContactTile key={channel.key} channel={channel} />
        ))}
      </div>
    </div>
  )
}

export default Contact
