import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiOutlineCalendar, HiOutlineArrowRight } from 'react-icons/hi2'
import { NEWS } from '../../constants/data'
import SectionHeading from '../ui/SectionHeading'

const categoryColors = {
  Pengumuman: 'bg-primary/10 text-primary-deep',
  Prestasi: 'bg-amber-50 text-amber-700',
  Kegiatan: 'bg-blue-50 text-blue-700',
}

export default function News() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="berita" className="py-24 lg:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Berita & Pengumuman"
          title="Informasi Terkini dari Tursina Alam"
          description="Ikuti berita, pengumuman, dan agenda kegiatan terbaru dari pondok pesantren kami."
        />

        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {NEWS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-hairline bg-canvas hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient top bar */}
              <div className="h-1 bg-gradient-to-r from-primary to-primary-deep" />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider ${categoryColors[item.category] || 'bg-canvas-soft text-ink-mute'}`}>
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ink-mute">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-ink mb-3 leading-snug group-hover:text-primary-deep transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-mute leading-relaxed mb-4">{item.excerpt}</p>

                <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep hover:text-primary transition-colors group/link">
                  Baca Selengkapnya
                  <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
