import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export type PageKey = 'about' | 'projects' | 'daily-assistant' | 'add-new'

interface MenuItemConfig {
  key: PageKey
  label: string
}

const MENU_ITEMS: MenuItemConfig[] = [
  { key: 'about', label: 'About' },
  { key: 'projects', label: 'Projects' },
  { key: 'daily-assistant', label: 'Daily Assistant' },
  { key: 'add-new', label: 'Add New' },
]

const ITEM_WIDTH = 208
const VIEWPORT_WIDTH = 460

interface MenuProps {
  currentPage: PageKey
  onPageChange: (page: PageKey) => void
}

function Menu({ currentPage, onPageChange }: MenuProps) {
  const activeIndex = useMemo(
    () => MENU_ITEMS.findIndex((item) => item.key === currentPage),
    [currentPage],
  )

  const trackX = VIEWPORT_WIDTH / 2 - ITEM_WIDTH / 2 - activeIndex * ITEM_WIDTH

  const goTo = (direction: 1 | -1) => {
    const nextIndex =
      (activeIndex + direction + MENU_ITEMS.length) % MENU_ITEMS.length
    onPageChange(MENU_ITEMS[nextIndex].key)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex flex-col items-center pt-6">
      <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
        <span className="text-white/70">TiahM Heranto</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          _
        </motion.span>
        <span>SYSTEM LAUNCHER</span>
      </div>

      <div className="scanlines flex items-center gap-3 overflow-hidden rounded-md border border-white/15 bg-black/90 px-3 py-4 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
        <ArrowButton direction="left" onClick={() => goTo(-1)} />

        <div
          className="relative flex h-16 items-center overflow-hidden"
          style={{ width: VIEWPORT_WIDTH }}
        >
          <motion.div
            className="flex items-center"
            animate={{ x: trackX }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {MENU_ITEMS.map((item, index) => {
              const distance = index - activeIndex
              const isActive = distance === 0
              const isAdjacent = Math.abs(distance) === 1

              return (
                <div
                  key={item.key}
                  style={{ width: ITEM_WIDTH }}
                  className="flex flex-shrink-0 items-center justify-center"
                >
                  <button
                    type="button"
                    onClick={() => onPageChange(item.key)}
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    <motion.span
                      animate={{
                        scale: isActive ? 1.2 : isAdjacent ? 0.85 : 0.7,
                        opacity: isActive ? 1 : isAdjacent ? 0.45 : 0.2,
                      }}
                      whileHover={
                        !isActive ? { scale: (isAdjacent ? 0.85 : 0.7) + 0.08, opacity: 0.7 } : undefined
                      }
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className={`whitespace-nowrap font-mono uppercase tracking-widest ${
                        isActive
                          ? 'text-lg font-bold text-white'
                          : 'text-sm font-medium text-white/50'
                      }`}
                    >
                      {item.label}
                    </motion.span>

                    {!isActive && (
                      <span className="mt-1 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
                    )}

                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                          className="mt-1 font-mono text-white/70"
                        >
                          ^
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              )
            })}
          </motion.div>
        </div>

        <ArrowButton direction="right" onClick={() => goTo(1)} />
      </div>
    </header>
  )
}

interface ArrowButtonProps {
  direction: 'left' | 'right'
  onClick: () => void
}

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  const Icon = direction === 'left' ? FiChevronLeft : FiChevronRight

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded border border-white/20 bg-white/5 text-white/50 transition-colors hover:border-white/50 hover:text-white"
      aria-label={direction === 'left' ? 'Previous section' : 'Next section'}
    >
      <Icon className="h-4 w-4" />
    </motion.button>
  )
}

export default Menu
