import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiMapPin,
  FiTag,
  FiUser,
  FiX,
} from 'react-icons/fi'
import articlesData from '../../../data/articles.json'

export interface Article {
  id: string
  title: string
  date: string
  location: string
  source: string
  writer: string
  photos: string[]
  body: string
}

const articles = articlesData as Article[]
const categories = Array.from(new Set(articles.map((article) => article.source)))
const totalPhotos = articles.reduce((count, article) => count + article.photos.length, 0)

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function getExcerpt(body: string, maxLength = 160): string {
  const firstParagraph = body.split('\n\n')[0] ?? body
  if (firstParagraph.length <= maxLength) return firstParagraph
  return `${firstParagraph.slice(0, maxLength).trim()}…`
}

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

function ArticlesHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] pb-6">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-faint)]">
          // Field Log
        </p>
        <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-[var(--fg-strong)] sm:text-2xl md:text-3xl">
          Articles
        </h1>
      </div>

      <div className="flex gap-6">
        <Stat label="Entries" value={String(articles.length)} />
        <Stat label="Categories" value={String(categories.length)} />
        <Stat label="Photos" value={String(totalPhotos)} />
      </div>
    </div>
  )
}

function ArticleCard({ article, onOpen }: { article: Article; onOpen: () => void }) {
  const thumbnail = article.photos[0]

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--content-bg)] text-left focus:outline-none focus-visible:border-[var(--border-hover)]"
    >
      <div className="relative h-40 overflow-hidden border-b border-[var(--border)] bg-[var(--btn-bg)] sm:h-44">
        {thumbnail ? (
          <img src={thumbnail} alt={article.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiImage className="h-6 w-6 text-[var(--fg-faint)]" />
          </div>
        )}
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--panel-bg)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-dim)]">
          <FiTag className="h-2.5 w-2.5" />
          {article.source}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="font-mono text-sm font-bold text-[var(--fg-strong)] sm:text-base">
          {article.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-faint)]">
          <span className="flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            {formatDate(article.date)}
          </span>
          {article.location && (
            <span className="flex items-center gap-1">
              <FiMapPin className="h-3 w-3" />
              {article.location}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{getExcerpt(article.body)}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-2 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-faint)]">
          <FiUser className="h-3 w-3" />
          {article.writer}
        </span>
      </div>
    </motion.button>
  )
}

function ArticleReader({ article, onClose }: { article: Article; onClose: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const hasMultiplePhotos = article.photos.length > 1
  const paragraphs = article.body.split('\n\n').filter(Boolean)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function showPrevPhoto() {
    setPhotoIndex((current) => (current - 1 + article.photos.length) % article.photos.length)
  }

  function showNextPhoto() {
    setPhotoIndex((current) => (current + 1) % article.photos.length)
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-[0_20px_60px_var(--panel-shadow)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--btn-bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)]"
        >
          <FiX className="h-4 w-4" />
        </button>

        <div className="overflow-y-auto">
          {article.photos.length > 0 && (
            <div className="relative h-56 border-b border-[var(--border)] bg-[var(--btn-bg)] sm:h-72">
              <img
                src={article.photos[photoIndex]}
                alt={article.title}
                className="h-full w-full object-cover"
              />
              {hasMultiplePhotos && (
                <>
                  <button
                    type="button"
                    onClick={showPrevPhoto}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--panel-bg)] text-[var(--fg-muted)] hover:text-[var(--fg-strong)]"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextPhoto}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--panel-bg)] text-[var(--fg-muted)] hover:text-[var(--fg-strong)]"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                    {article.photos.map((photo, index) => (
                      <span
                        key={photo}
                        className={`h-1.5 w-1.5 rounded-full ${
                          index === photoIndex ? 'bg-[var(--fg-strong)]' : 'bg-[var(--fg-faint)]'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-5 sm:p-6">
            <span className="mb-3 inline-flex items-center gap-1 rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-dim)]">
              <FiTag className="h-2.5 w-2.5" />
              {article.source}
            </span>

            <h2 className="mb-3 font-mono text-lg font-bold text-[var(--fg-strong)] sm:text-xl">
              {article.title}
            </h2>

            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-[var(--border)] pb-5 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-faint)]">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="h-3 w-3" />
                {formatDate(article.date)}
              </span>
              {article.location && (
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="h-3 w-3" />
                  {article.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FiUser className="h-3 w-3" />
                {article.writer}
              </span>
            </div>

            <div className="space-y-3">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-[var(--fg-subtle)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

function Articles() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedArticle = articles.find((article) => article.id === selectedId) ?? null

  return (
    <div>
      <ArticlesHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onOpen={() => setSelectedId(article.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <ArticleReader
            key={selectedArticle.id}
            article={selectedArticle}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Articles
