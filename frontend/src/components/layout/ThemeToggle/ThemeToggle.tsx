import { AnimatePresence, motion } from 'framer-motion'
import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi'
import { useTheme, type Theme } from '../../../context/ThemeContext'

const ICONS = {
  light: FiSun,
  dark: FiMoon,
  windows: FiMonitor,
} as const

const NEXT_LABEL: Record<Theme, string> = {
  light: 'Switch to dark theme',
  dark: 'Switch to Windows theme',
  windows: 'Switch to light theme',
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const Icon = ICONS[theme]
  const isWindows = theme === 'windows'

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{ borderColor: isWindows ? 'var(--accent)' : undefined }}
      className="flex h-6 w-6 items-center justify-center overflow-hidden rounded border border-[var(--border-strong)] bg-[var(--btn-bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--fg-strong)] sm:h-8 sm:w-8"
      aria-label={NEXT_LABEL[theme]}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex items-center justify-center"
          style={{ color: isWindows ? 'var(--accent)' : undefined }}
        >
          <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle