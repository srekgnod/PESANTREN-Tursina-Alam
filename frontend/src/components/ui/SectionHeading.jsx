import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function SectionHeading({ label, title, description, center = true }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`max-w-2xl mb-16 ${center ? 'mx-auto text-center' : ''}`}
    >
      {label && (
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-deep">
          {label}
        </span>
      )}
      <h2 className="text-display-xl text-ink mb-4">{title}</h2>
      {description && (
        <p className="text-lg leading-relaxed text-ink-mute">{description}</p>
      )}
    </motion.div>
  )
}
