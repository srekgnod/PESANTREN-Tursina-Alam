import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiOutlineArrowRight, HiOutlineUserGroup } from 'react-icons/hi2'
import Button from '../ui/Button'

export default function CTA() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section className="py-24 lg:py-32 bg-canvas-soft relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 islamic-pattern islamic-pattern-grid opacity-[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-deep">
            Akses Sistem Digital
          </span>

          <h2 className="text-display-xl text-ink mb-6">
            Siap Bergabung dengan{' '}
            <span className="text-primary">Tursina Alam</span>?
          </h2>

          <p className="text-lg text-ink-mute leading-relaxed mb-10 max-w-2xl mx-auto">
            Akses portal digital pondok pesantren untuk memantau perkembangan santri, 
            informasi pembayaran, dan layanan administrasi secara online.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" href="#">
              Login Sistem
              <HiOutlineArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="secondary" href="#">
              <HiOutlineUserGroup className="w-4 h-4" />
              Portal Wali Santri
            </Button>
          </div>

          <p className="mt-8 text-sm text-ink-mute">
            Belum memiliki akun?{' '}
            <a href="#" className="text-primary-deep hover:text-primary font-medium transition-colors underline decoration-primary/30 hover:decoration-primary">
              Daftar SPMB Online
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
