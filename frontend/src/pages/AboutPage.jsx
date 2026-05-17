import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  HiOutlineHeart, HiOutlineLightBulb, HiOutlineAcademicCap,
  HiOutlineGlobeAlt, HiOutlineBookOpen, HiOutlineSparkles,
  HiOutlineComputerDesktop, HiOutlineUserGroup,
} from 'react-icons/hi2'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'

const timeline = [
  { year: '2015', title: 'Pendirian Pondok', desc: 'Pondok Pesantren Tursina Alam didirikan dengan visi memadukan keilmuan Islam klasik dan pendidikan modern.' },
  { year: '2017', title: 'Akreditasi Formal', desc: 'Memperoleh akreditasi untuk program pendidikan formal tingkat MTs dan MA dari Kementerian Agama.' },
  { year: '2019', title: 'Digitalisasi Sistem', desc: 'Implementasi sistem informasi digital untuk manajemen pondok pesantren secara terintegrasi.' },
  { year: '2021', title: 'Ekspansi Program', desc: 'Pembukaan program Tahfidz intensif 30 juz dan program bahasa internasional.' },
  { year: '2024', title: 'Smart Pesantren', desc: 'Penerapan teknologi QR attendance, portal wali santri, dan dashboard monitoring realtime.' },
]

const values = [
  { icon: HiOutlineHeart, title: 'Akhlaqul Karimah', desc: 'Pembinaan karakter Islami melalui keteladanan dan pembiasaan dalam kehidupan sehari-hari di lingkungan pondok.' },
  { icon: HiOutlineBookOpen, title: 'Keilmuan Mendalam', desc: 'Penguasaan ilmu agama dan ilmu umum secara seimbang melalui kurikulum terpadu dan metode pengajaran modern.' },
  { icon: HiOutlineLightBulb, title: 'Inovasi Berkelanjutan', desc: 'Integrasi teknologi dalam proses pendidikan untuk mempersiapkan santri menghadapi era digital global.' },
  { icon: HiOutlineGlobeAlt, title: 'Wawasan Global', desc: 'Penguasaan bahasa internasional dan pemahaman isu-isu kontemporer untuk dakwah yang lebih luas.' },
  { icon: HiOutlineSparkles, title: 'Kemandirian', desc: 'Membentuk santri yang mandiri, bertanggung jawab, dan memiliki jiwa kepemimpinan yang kuat.' },
  { icon: HiOutlineUserGroup, title: 'Ukhuwah Islamiyah', desc: 'Membangun persaudaraan yang kokoh antar santri dari berbagai latar belakang daerah dan budaya.' },
]

export default function AboutPage() {
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [philosophyRef, philosophyInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      <PageHero
        label="Tentang Kami"
        title="Mencetak Generasi Qurani Berwawasan Global"
        description="Pondok Pesantren Tursina Alam hadir sebagai lembaga pendidikan Islam modern yang memadukan tradisi keilmuan pesantren dengan pendekatan teknologi terkini."
      />

      {/* Sejarah Timeline */}
      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Sejarah"
            title="Perjalanan Pondok Pesantren Tursina Alam"
            description="Dari pendirian hingga menjadi pesantren berbasis teknologi digital yang diakui secara nasional."
          />

          <div ref={timelineRef} className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-hairline lg:-translate-x-px" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full bg-primary border-4 border-canvas -translate-x-1.5 lg:-translate-x-1.5 mt-1.5 z-10" />
                <div className={`ml-12 lg:ml-0 lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary text-on-primary uppercase tracking-wider mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-semibold text-ink mb-1">{item.title}</h3>
                  <p className="text-sm text-ink-mute leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-24 lg:py-32 bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading label="Visi & Misi" title="Arah dan Tujuan Pondok Pesantren" />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-deep" />
              <div className="pt-2">
                <span className="text-xs font-semibold text-primary-deep uppercase tracking-wider">Visi</span>
                <h3 className="text-display-md text-ink mt-3 mb-4">Pesantren Unggul Berteknologi</h3>
                <p className="text-ink-mute leading-relaxed">
                  Menjadi pondok pesantren unggul yang menghasilkan generasi Qurani, berakhlak mulia,
                  berwawasan global, menguasai ilmu pengetahuan dan teknologi, serta mampu menjadi
                  pemimpin umat yang membawa rahmat bagi seluruh alam.
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-deep" />
              <div className="pt-2">
                <span className="text-xs font-semibold text-primary-deep uppercase tracking-wider">Misi</span>
                <h3 className="text-display-md text-ink mt-3 mb-4">Pendidikan Terpadu Modern</h3>
                <ul className="space-y-3 text-ink-mute">
                  {[
                    'Menyelenggarakan pendidikan Islam terpadu berbasis teknologi',
                    'Mencetak hafidz/hafidzah Quran dengan sanad muttashil',
                    'Mengembangkan kemampuan bahasa Arab dan Inggris secara aktif',
                    'Menerapkan sistem manajemen pesantren digital terintegrasi',
                    'Membina akhlak mulia melalui keteladanan dan pembiasaan',
                  ].map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Nilai Pendidikan */}
      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Nilai Pendidikan"
            title="Pilar Utama Pendidikan Tursina Alam"
            description="Enam pilar fundamental yang menjadi landasan seluruh program pendidikan kami."
          />

          <div ref={valuesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-xl border border-hairline bg-canvas hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-6 h-6 text-primary-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-ink-mute leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofi & Transformasi */}
      <section className="py-24 lg:py-32 bg-canvas-night relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={philosophyRef} className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={philosophyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/15 text-primary">
                Filosofi
              </span>
              <h2 className="text-display-xl text-on-dark mb-6">
                Tradisi Keilmuan Islam, Inovasi Pendidikan Modern
              </h2>
              <div className="space-y-4 text-ink-mute-2 leading-relaxed">
                <p>
                  Kami percaya bahwa pendidikan pesantren tidak harus meninggalkan tradisi untuk bisa modern.
                  Tursina Alam memadukan kedalaman spiritual dengan kesiapan digital — menghasilkan lulusan yang
                  mampu membaca kitab kuning sekaligus menguasai teknologi.
                </p>
                <p>
                  Transformasi digital pesantren bukan sekadar digitalisasi proses, tetapi perubahan paradigma
                  dalam cara kita mendidik, memantau, dan mengembangkan potensi setiap santri secara holistik.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={philosophyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: HiOutlineAcademicCap, num: '100%', label: 'Kurikulum Terintegrasi' },
                { icon: HiOutlineComputerDesktop, num: '7+', label: 'Sistem Digital Aktif' },
                { icon: HiOutlineBookOpen, num: '30 Juz', label: 'Program Tahfidz' },
                { icon: HiOutlineGlobeAlt, num: '3', label: 'Bahasa Aktif' },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-xl bg-canvas-night-soft border border-white/5">
                  <s.icon className="w-6 h-6 text-primary mb-3" />
                  <div className="text-2xl font-semibold text-on-dark">{s.num}</div>
                  <div className="text-xs text-ink-mute-2 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
