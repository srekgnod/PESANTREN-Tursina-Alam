import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { STATS } from '../../constants/data'
import AnimatedCounter from '../ui/AnimatedCounter'

export default function Stats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section className="py-20 bg-canvas relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 rounded-xl bg-canvas-soft border border-hairline hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div className="text-display-xl text-ink mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-ink-mute font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
