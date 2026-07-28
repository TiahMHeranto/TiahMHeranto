import { useRef, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Menu, { type PageKey } from '../Menu'
import ThemeToggle from '../ThemeToggle'
import About from '../../pages/About'
import Projects from '../../pages/Projects'
import DailyAssistant from '../../pages/DailyAssistant'
import Articles from '../../pages/Articles'

const PAGES: Record<PageKey, ComponentType> = {
  about: About,
  projects: Projects,
  'daily-assistant': DailyAssistant,
  articles: Articles,
}

interface Origin {
  x: number
  y: number
}

const CENTERED_ORIGIN: Origin = { x: 0, y: 0 }

function SystemWrapper() {
  const [currentPage, setCurrentPage] = useState<PageKey>('about')
  const [origin, setOrigin] = useState<Origin>(CENTERED_ORIGIN)
  const contentRef = useRef<HTMLDivElement>(null)
  const ActivePage = PAGES[currentPage]

  function handlePageChange(page: PageKey, buttonRect?: DOMRect) {
    const contentRect = contentRef.current?.getBoundingClientRect()

    if (buttonRect && contentRect) {
      setOrigin({
        x: buttonRect.left + buttonRect.width / 2 - (contentRect.left + contentRect.width / 2),
        y: buttonRect.top + buttonRect.height / 2 - (contentRect.top + contentRect.height / 2),
      })
    }

    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen w-full">
      <Menu currentPage={currentPage} onPageChange={handlePageChange} />

      <div className="fixed right-2 top-3 z-30 sm:right-4 sm:top-4 md:right-6 md:top-6">
        <ThemeToggle />
      </div>

      <main className="flex justify-center px-3 pb-8 pt-28 sm:px-6 sm:pb-16 sm:pt-36 md:px-12 md:pt-44">
        <div ref={contentRef} className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ scale: 0, opacity: 0, x: origin.x, y: origin.y }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0, opacity: 0, x: origin.x, y: origin.y }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="rounded-lg border border-[var(--border)] bg-[var(--content-bg)] p-5 sm:p-8 md:p-10"
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default SystemWrapper