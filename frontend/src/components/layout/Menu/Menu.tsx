import { useEffect, useMemo, useState } from 'react'
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

interface CarouselSize {
  itemWidth: number
  viewportWidth: number
}

const SIZE_BREAKPOINTS: { minWidth: number; size: CarouselSize }[] = [
  { minWidth: 768, size: { itemWidth: 208, viewportWidth: 460 } },
  { minWidth: 640, size: { itemWidth: 176, viewportWidth: 340 } },
  { minWidth: 400, size: { itemWidth: 140, viewportWidth: 232 } },
  { minWidth: 0, size: { itemWidth: 116, viewportWidth: 188 } },
]

function getCarouselSize(width: number): CarouselSize {
  return SIZE_BREAKPOINTS.find((bp) => width >= bp.minWidth)!.size
}

function useCarouselSize() {
  const [size, setSize] = useState(() => getCarouselSize(window.innerWidth))

  useEffect(() => {
    const onResize = () => setSize(getCarouselSize(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

interface MenuProps {
  currentPage: PageKey
  onPageChange: (page: PageKey) => void
}

function Menu({ currentPage, onPageChange }: MenuProps) {
  const { itemWidth, viewportWidth } = useCarouselSize()

  const activeIndex = useMemo(
    () => MENU_ITEMS.findIndex((item) => item.key === currentPage),
    [currentPage],
  )

  const trackX = viewportWidth / 2 - itemWidth / 2 - activeIndex * itemWidth

  const goTo = (direction: 1 | -1) => {
    const nextIndex =
      (activeIndex + direction + MENU_ITEMS.length) % MENU_ITEMS.length
    onPageChange(MENU_ITEMS[nextIndex].key)
  }

  return (
    <header className="flex flex-col items-center px-2 pt-3 sm:pt-4 md:pt-6">
      <div className="mb-2 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/40 sm:mb-3 sm:gap-2 sm:text-[10px] sm:tracking-[0.28em] md:mb-4 md:text-[11px] md:tracking-[0.35em]">
        <span className="text-white/70">TiahM Heranto</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          _
        </motion.span>
        <span className="hidden sm:inline">SYSTEM LAUNCHER</span>
      </div>

      <div className="scanlines flex items-center gap-1.5 overflow-hidden rounded-md border border-white/15 bg-black/90 px-1.5 py-2 shadow-[0_0_25px_rgba(0,0,0,0.6)] sm:gap-3 sm:px-3 sm:py-4">
        <ArrowButton direction="left" onClick={() => goTo(-1)} />

        <div
          className="relative flex h-11 items-center overflow-hidden sm:h-14 md:h-16"
          style={{ width: viewportWidth }}
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
                  style={{ width: itemWidth }}
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
                          ? 'text-xs font-bold text-white sm:text-base md:text-lg'
                          : 'text-[10px] font-medium text-white/50 sm:text-xs md:text-sm'
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
                          className="mt-1 font-mono text-xs text-white/70"
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
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-white/20 bg-white/5 text-white/50 transition-colors hover:border-white/50 hover:text-white sm:h-8 sm:w-8 md:h-9 md:w-9"
      aria-label={direction === 'left' ? 'Previous section' : 'Next section'}
    >
      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
    </motion.button>
  )
}

export default Menu