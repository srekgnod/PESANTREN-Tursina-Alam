import { motion } from 'framer-motion'

export default function PageHero({ label, title, description }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-canvas-soft overflow-hidden">
      <div className="absolute inset-0 islamic-pattern islamic-pattern-grid" />
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {label && (
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-deep">
              {label}
            </span>
          )}
          <h1 className="text-display-xxl text-ink mb-4 max-w-3xl mx-auto">{title}</h1>
          {description && (
            <p className="text-lg text-ink-mute leading-relaxed max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" className="w-full h-auto">
          <path d="M0 48V24C360 4 720 4 1080 16C1260 24 1380 36 1440 40V48H0Z" fill="var(--color-canvas)" />
        </svg>
      </div>
    </section>
  )
}
