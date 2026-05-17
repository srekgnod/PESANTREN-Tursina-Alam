import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineHeart, HiOutlineGlobeAlt } from 'react-icons/hi2'
import SectionHeading from '../ui/SectionHeading'

const pillars = [
  {
    icon: HiOutlineHeart,
    title: 'Akhlaqul Karimah',
    description: 'Pembinaan akhlak dan karakter islami melalui keteladanan dan pembiasaan sehari-hari.',
  },
  {
    icon: HiOutlineAcademicCap,
    title: 'Keilmuan Mendalam',
    description: 'Penguasaan ilmu agama dan ilmu umum secara seimbang untuk bekal kehidupan yang komprehensif.',
  },
  {
    icon: HiOutlineLightBulb,
    title: 'Inovasi & Teknologi',
    description: 'Integrasi teknologi digital dalam proses pendidikan untuk mempersiapkan generasi masa depan.',
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Wawasan Global',
    description: 'Penguasaan bahasa internasional dan pemahaman isu global untuk dakwah yang lebih luas.',
  },
]

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="tentang" className="py-24 lg:py-32 bg-canvas-soft relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Tentang Kami"
          title="Mencetak Generasi Qurani yang Siap Menghadapi Tantangan Zaman"
          description="Pondok Pesantren Tursina Alam hadir sebagai lembaga pendidikan Islam modern yang memadukan tradisi keilmuan pesantren dengan pendekatan teknologi terkini."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left — story */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-display-md text-ink mb-6">
              Tradisi Keilmuan Pesantren, Pendekatan Pendidikan Modern
            </h3>
            <div className="space-y-4 text-ink-mute leading-relaxed">
              <p>
                Didirikan dengan semangat memadukan khazanah keilmuan Islam klasik dengan
                inovasi pendidikan modern, Pondok Pesantren Tursina Alam berkomitmen untuk
                membentuk santri yang tidak hanya menguasai ilmu agama, tetapi juga siap
                berkontribusi dalam era digital.
              </p>
              <p>
                Dengan kurikulum terintegrasi yang mencakup tahfidz Al-Quran, kajian kitab
                kuning, pendidikan formal Kurikulum Merdeka, serta penguasaan teknologi,
                kami menyiapkan lulusan yang memiliki kedalaman spiritual dan kesiapan
                menghadapi tantangan global.
              </p>
            </div>

            {/* Visi Misi compact */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-canvas border border-hairline">
                <div className="text-xs font-medium text-primary-deep uppercase tracking-wider mb-2">Visi</div>
                <p className="text-sm text-ink leading-relaxed">
                  Menjadi pondok pesantren unggul yang menghasilkan generasi Qurani,
                  berakhlak mulia, berwawasan global, dan menguasai teknologi.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-canvas border border-hairline">
                <div className="text-xs font-medium text-primary-deep uppercase tracking-wider mb-2">Misi</div>
                <p className="text-sm text-ink leading-relaxed">
                  Menyelenggarakan pendidikan Islam terpadu berbasis teknologi dengan
                  standar mutu tinggi dan semangat inovasi berkelanjutan.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — pillars grid */}
          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-canvas border border-hairline hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="w-5 h-5 text-primary-deep" />
                </div>
                <h4 className="text-sm font-semibold text-ink mb-2">{pillar.title}</h4>
                <p className="text-xs text-ink-mute leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
