import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Menu, { type PageKey } from '../Menu'
import ThemeToggle from '../ThemeToggle'
import About from '../../pages/About'
import Projects from '../../pages/Projects'
import DailyAssistant from '../../pages/DailyAssistant'
import AddNew from '../../pages/AddNew'

const PAGES: Record<PageKey, ComponentType> = {
  about: About,
  projects: Projects,
  'daily-assistant': DailyAssistant,
  'add-new': AddNew,
}

function SystemWrapper() {
  const [currentPage, setCurrentPage] = useState<PageKey>('about')
  const ActivePage = PAGES[currentPage]

  return (
    <div className="min-h-screen w-full">
      <Menu currentPage={currentPage} onPageChange={setCurrentPage} />

      <div className="fixed right-2 top-3 z-30 sm:right-4 sm:top-4 md:right-6 md:top-6">
        <ThemeToggle />
      </div>

      <main className="flex justify-center px-3 pb-8 pt-28 sm:px-6 sm:pb-16 sm:pt-36 md:px-12 md:pt-44">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-5xl rounded-lg border border-[var(--border)] bg-[var(--content-bg)] p-5 sm:p-8 md:p-10"
          >
            <ActivePage />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default SystemWrapper