import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  HiOutlineBookOpen, HiOutlineGlobeAlt, HiOutlineAcademicCap,
  HiOutlineComputerDesktop, HiOutlineSparkles, HiOutlineMusicalNote,
  HiOutlineTrophy, HiOutlineClipboardDocumentList, HiOutlineClock,
} from 'react-icons/hi2'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'

const programs = [
  {
    icon: HiOutlineBookOpen,
    title: 'Tahfidz Al-Quran',
    tag: 'Unggulan',
    desc: 'Program menghafal Al-Quran 30 juz dengan metode modern dan bimbingan ustadz bersertifikat sanad muttashil. Target hafalan terstruktur per semester dengan evaluasi berkala.',
    details: ['Target 30 juz dalam 3 tahun', 'Metode Tikrar & Muroja\'ah', 'Sertifikat sanad resmi', 'Musabaqah internal & eksternal'],
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Bahasa Arab & Inggris',
    tag: 'Bilingual',
    desc: 'Penguasaan bahasa Arab dan Inggris aktif melalui immersion environment, daily conversation, dan sertifikasi TOEFL/TOAFL.',
    details: ['English & Arabic Day', 'Native speaker session', 'Sertifikasi TOEFL/TOAFL', 'Muhadharah (pidato) rutin'],
  },
  {
    icon: HiOutlineAcademicCap,
    title: 'Kitab Kuning',
    tag: null,
    desc: 'Pengkajian kitab-kitab klasik dengan metode sorogan dan bandongan. Fiqih, Aqidah, Tasawuf, Nahwu, Sharaf, dan Balaghah.',
    details: ['Metode Sorogan & Bandongan', 'Fiqih 4 Madzhab', 'Nahwu Sharaf terstruktur', 'Bahtsul Masail rutin'],
  },
  {
    icon: HiOutlineComputerDesktop,
    title: 'Pendidikan Formal',
    tag: 'Kurikulum Merdeka',
    desc: 'Kurikulum Merdeka terintegrasi kurikulum pesantren. Program MTs dan MA dengan akreditasi nasional.',
    details: ['Akreditasi A nasional', 'Kurikulum Merdeka Belajar', 'STEM & Literasi Digital', 'Persiapan SNBP/SNBT'],
  },
  {
    icon: HiOutlineSparkles,
    title: 'Pengembangan Diri',
    tag: null,
    desc: 'Program leadership, public speaking, entrepreneurship, dan keterampilan abad 21 untuk membentuk karakter pemimpin umat.',
    details: ['Leadership Camp', 'Public Speaking & Debat', 'Entrepreneurship Program', 'Community Service'],
  },
  {
    icon: HiOutlineMusicalNote,
    title: 'Ekstrakurikuler',
    tag: null,
    desc: 'Beragam kegiatan pengembangan bakat: hadrah, kaligrafi, futsal, panahan, robotik, jurnalistik, dan lainnya.',
    details: ['Seni Hadrah & Marawis', 'Kaligrafi & Desain Grafis', 'Panahan & Futsal', 'Robotik & Coding'],
  },
]

const schedule = [
  { time: '04:00', activity: 'Bangun & Shalat Tahajud' },
  { time: '04:30', activity: 'Shalat Subuh Berjamaah' },
  { time: '05:00', activity: 'Tahfidz / Muroja\'ah' },
  { time: '06:30', activity: 'Sarapan & Persiapan' },
  { time: '07:00', activity: 'Pendidikan Formal' },
  { time: '12:00', activity: 'Shalat Dzuhur & Makan Siang' },
  { time: '13:00', activity: 'Kajian Kitab Kuning' },
  { time: '15:30', activity: 'Shalat Ashar & Olahraga' },
  { time: '17:00', activity: 'Mandi & Persiapan Maghrib' },
  { time: '18:00', activity: 'Shalat Maghrib & Tahfidz' },
  { time: '19:15', activity: 'Shalat Isya & Makan Malam' },
  { time: '20:00', activity: 'Belajar Mandiri / Muhadharah' },
  { time: '22:00', activity: 'Istirahat' },
]

export default function ProgramPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [schedRef, schedInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      <PageHero
        label="Program Pendidikan"
        title="Kurikulum Terpadu untuk Generasi Unggul"
        description="Program pendidikan kami dirancang untuk membekali santri dengan keilmuan Islam mendalam, penguasaan bahasa internasional, dan keterampilan abad 21."
      />

      {/* Programs Grid */}
      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={ref} className="space-y-8">
            {programs.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="grid lg:grid-cols-[1fr_1.5fr] gap-8 p-8 rounded-2xl border border-hairline bg-canvas hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-primary/20 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <p.icon className="w-6 h-6 text-primary-deep" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{p.title}</h3>
                      {p.tag && (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary text-on-primary uppercase tracking-wider">
                          {p.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-ink-mute leading-relaxed">{p.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {p.details.map((d) => (
                    <div key={d} className="flex items-start gap-2 p-3 rounded-lg bg-canvas-soft">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-sm text-ink-secondary">{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-24 lg:py-32 bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Jadwal Harian"
            title="Aktivitas Santri Sehari-hari"
            description="Kegiatan terstruktur yang memadukan ibadah, akademik, dan pengembangan diri."
          />

          <div ref={schedRef} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-hairline" />
              {schedule.map((s, i) => (
                <motion.div
                  key={s.time}
                  initial={{ opacity: 0, x: -16 }}
                  animate={schedInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-4 py-3 group"
                >
                  <span className="w-[44px] text-right text-sm font-mono font-medium text-primary-deep shrink-0">
                    {s.time}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline group-hover:bg-primary transition-colors shrink-0 z-10" />
                  <span className="text-sm text-ink group-hover:text-primary-deep transition-colors">{s.activity}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
