import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineXMark } from 'react-icons/hi2'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }[size]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizeClass} bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ededed] dark:border-[#2a2a2a]">
              <h2 className="text-base font-semibold text-[#171717] dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#9a9a9a] hover:text-[#171717] dark:hover:text-white transition-colors"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
