import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Card({
  children,
  className = '',
  delay = 0,
  dark = false,
  hover = true,
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const bg = dark
    ? 'bg-canvas-night text-on-dark border-canvas-night-soft'
    : 'bg-canvas text-ink border-hairline'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
      className={`rounded-xl border p-8 transition-all duration-300 ${bg} ${className}`}
    >
      {children}
    </motion.div>
  )
}
