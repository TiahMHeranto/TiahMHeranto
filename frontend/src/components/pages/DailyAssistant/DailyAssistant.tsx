import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiCpu,
  FiFileText,
  FiMic,
  FiMicOff,
  FiPaperclip,
  FiSend,
  FiUser,
  FiX,
} from 'react-icons/fi'

interface Attachment {
  id: string
  name: string
  size: number
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  attachments: Attachment[]
  timestamp: number
}

function createId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "I'm Daiky. This preview wires up chat, voice, and file upload — no model or RAG pipeline behind me yet, so responses are canned for now.",
  attachments: [],
  timestamp: Date.now(),
}

const SUGGESTIONS = [
  'What can you help me with?',
  'Summarize this document for me',
  'Draft a project status update',
]

const CANNED_REPLIES: Array<(context: string) => string> = [
  (context) =>
    `Local inference isn't connected in this preview — no Gemma model or RAG pipeline behind me yet. Once it's wired up, I'll actually reason about: "${context}"`,
  (context) =>
    `Noted. I'm running interface-only right now, no backend attached. This is where I'd respond to "${context}" once the reasoning engine lands.`,
  () =>
    "I can hear you, but there's no model attached yet — this build only wires up chat, voice, and file UI. Reasoning comes next.",
]

function getAssistantReply(userMessage: ChatMessage): string {
  const rawContext = userMessage.content || userMessage.attachments[0]?.name || 'your message'
  const context = rawContext.length > 60 ? `${rawContext.slice(0, 60)}…` : rawContext
  const template = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)]
  let reply = template(context)

  if (userMessage.attachments.length > 0) {
    const subject =
      userMessage.attachments.length === 1 ? 'the file' : `all ${userMessage.attachments.length} files`
    reply += ` I also see ${subject} you attached — file analysis will work once RAG is in place.`
  }

  return reply
}

function useSpeechRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const isSupported =
    typeof window !== 'undefined' && Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  function toggleListening() {
    if (!isSupported) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const RecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!RecognitionCtor) return

    const recognition = new RecognitionCtor()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim()
      if (transcript) onResult(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return { isSupported, isListening, toggleListening }
}

function StatusPill() {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-faint)] sm:text-[10px]">
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="h-1.5 w-1.5 rounded-full bg-[var(--fg-faint)]"
      />
      Model Offline — UI Preview
    </div>
  )
}

function Avatar({ role }: { role: ChatMessage['role'] }) {
  const Icon = role === 'assistant' ? FiCpu : FiUser
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[var(--border)] bg-[var(--btn-bg)]">
      <Icon className="h-3.5 w-3.5 text-[var(--fg-dim)]" />
    </div>
  )
}

function AttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: Attachment
  onRemove?: () => void
}) {
  return (
    <span className="flex items-center gap-1.5 rounded border border-[var(--border)] bg-[var(--btn-bg)] px-2 py-1 font-mono text-[11px] text-[var(--fg-dim)]">
      <FiFileText className="h-3 w-3 shrink-0 text-[var(--fg-faint)]" />
      <span className="max-w-[10rem] truncate">{attachment.name}</span>
      <span className="text-[var(--fg-faint)]">{formatFileSize(attachment.size)}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${attachment.name}`}
          className="ml-0.5 text-[var(--fg-faint)] hover:text-[var(--fg-strong)]"
        >
          <FiX className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar role={message.role} />
      <div className={`flex max-w-[80%] flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {message.content && (
          <div
            className={`rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed ${
              isUser
                ? 'border-[var(--border)] bg-[var(--btn-bg)] text-[var(--fg)]'
                : 'border-[var(--border)] bg-[var(--content-bg)] text-[var(--fg-subtle)]'
            }`}
          >
            {message.content}
          </div>
        )}
        {message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.attachments.map((attachment) => (
              <AttachmentChip key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}
        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-faint)]">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <Avatar role="assistant" />
      <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--content-bg)] px-3.5 py-3">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-[var(--fg-faint)]"
          />
        ))}
      </div>
    </div>
  )
}

interface ChatInputDockProps {
  inputValue: string
  onInputChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onSubmit: (event: FormEvent) => void
  attachments: Attachment[]
  onRemoveAttachment: (id: string) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  voiceSupported: boolean
  isListening: boolean
  onToggleListening: () => void
}

function ChatInputDock({
  inputValue,
  onInputChange,
  onKeyDown,
  onSubmit,
  attachments,
  onRemoveAttachment,
  fileInputRef,
  onFileChange,
  voiceSupported,
  isListening,
  onToggleListening,
}: ChatInputDockProps) {
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3 sm:px-6 sm:pb-6 md:px-12">
      <div className="pointer-events-auto w-full max-w-5xl">
        <div className="overflow-hidden rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-[0_10px_30px_var(--panel-shadow)] backdrop-blur">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b border-[var(--border)] px-4 py-3 sm:px-5">
              {attachments.map((attachment) => (
                <AttachmentChip
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={() => onRemoveAttachment(attachment.id)}
                />
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-end gap-2 px-3 py-3 sm:px-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={onFileChange}
              className="hidden"
            />

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--btn-bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)]"
            >
              <FiPaperclip className="h-3.5 w-3.5" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={voiceSupported ? { scale: 1.08 } : undefined}
              whileTap={voiceSupported ? { scale: 0.92 } : undefined}
              onClick={onToggleListening}
              disabled={!voiceSupported}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              title={voiceSupported ? undefined : 'Voice input is not supported in this browser'}
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isListening
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border-strong)] bg-[var(--btn-bg)] text-[var(--fg-muted)] hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)]'
              }`}
            >
              {isListening && (
                <motion.span
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded border border-[var(--accent)]"
                />
              )}
              {isListening ? <FiMic className="h-3.5 w-3.5" /> : <FiMicOff className="h-3.5 w-3.5" />}
            </motion.button>

            <textarea
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Daiky…"
              rows={1}
              className="max-h-24 flex-1 resize-none rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)] focus:border-[var(--border-hover)]"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              disabled={!inputValue.trim() && attachments.length === 0}
              aria-label="Send message"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--btn-bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiSend className="h-3.5 w-3.5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function DailyAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const scrollAnchorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isSupported: voiceSupported, isListening, toggleListening } = useSpeechRecognition(
    (transcript) => {
      setInputValue((current) => (current ? `${current} ${transcript}` : transcript))
    },
  )

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isThinking])

  function sendMessage(content: string, messageAttachments: Attachment[]) {
    const trimmed = content.trim()
    if (!trimmed && messageAttachments.length === 0) return

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
      attachments: messageAttachments,
      timestamp: Date.now(),
    }

    setMessages((current) => [...current, userMessage])
    setInputValue('')
    setAttachments([])
    setIsThinking(true)

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'assistant',
          content: getAssistantReply(userMessage),
          attachments: [],
          timestamp: Date.now(),
        },
      ])
      setIsThinking(false)
    }, 900 + Math.random() * 700)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    sendMessage(inputValue, attachments)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage(inputValue, attachments)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    const staged = files.map((file) => ({ id: createId(), name: file.name, size: file.size }))
    setAttachments((current) => [...current, ...staged])
    event.target.value = ''
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id))
  }

  const showSuggestions = messages.length === 1

  return (
    <div className="pb-24 sm:pb-28">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
            // Daily Assistant
          </p>
          <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-[var(--fg-strong)] sm:text-2xl md:text-3xl">
            Daiky
          </h1>
        </div>
        <StatusPill />
      </div>

      <section className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--content-bg)]">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--panel-bg)] px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fg-strong)] sm:text-xs">
            <span className="text-[var(--fg-faint)]">//</span>
            Chat Session
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full border border-[var(--border-strong)]" />
            <span className="h-1.5 w-1.5 rounded-full border border-[var(--border-strong)]" />
            <span className="h-1.5 w-1.5 rounded-full border border-[var(--border-strong)]" />
          </div>
        </header>

        <div className="flex h-[50vh] min-h-[280px] flex-col gap-4 overflow-y-auto px-4 py-4 sm:h-[55vh] sm:px-5 sm:py-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pl-9">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInputValue(suggestion)}
                  className="rounded border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--fg-dim)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <TypingBubble />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollAnchorRef} />
        </div>
      </section>

      <ChatInputDock
        inputValue={inputValue}
        onInputChange={setInputValue}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        voiceSupported={voiceSupported}
        isListening={isListening}
        onToggleListening={toggleListening}
      />
    </div>
  )
}

export default DailyAssistant
