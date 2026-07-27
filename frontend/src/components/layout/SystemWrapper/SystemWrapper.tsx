import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Menu, { type PageKey } from '../Menu'
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

      <main className="flex justify-center px-6 pb-16 pt-44 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-5xl rounded-lg border border-white/10 bg-white/[0.02] p-10"
          >
            <ActivePage />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default SystemWrapper
