import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import {
  HiOutlineQrCode, HiOutlineChartBar, HiOutlineCreditCard,
  HiOutlineUserGroup, HiOutlineClipboardDocumentCheck,
  HiOutlineBellAlert, HiOutlineShieldCheck, HiOutlineArrowRight,
  HiOutlineDevicePhoneMobile, HiOutlineDocumentText,
} from 'react-icons/hi2'
import PageHero from '../components/ui/PageHero'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

const features = [
  {
    icon: HiOutlineQrCode, title: 'Absensi QR Code',
    desc: 'Sistem absensi digital dengan QR code untuk pencatatan kehadiran santri secara real-time dan akurat. Terintegrasi dengan notifikasi otomatis ke wali santri.',
    highlight: true,
  },
  {
    icon: HiOutlineChartBar, title: 'Dashboard Realtime',
    desc: 'Dashboard komprehensif untuk monitoring perkembangan akademik, hafalan, absensi, dan keuangan pondok secara realtime.',
    highlight: true,
  },
  {
    icon: HiOutlineCreditCard, title: 'Pembayaran Digital',
    desc: 'Sistem pembayaran SPP dan biaya lainnya secara online melalui berbagai metode — transfer bank, e-wallet, dan virtual account.',
    highlight: false,
  },
  {
    icon: HiOutlineUserGroup, title: 'Portal Wali Santri',
    desc: 'Akses informasi perkembangan anak secara real-time — nilai, hafalan, absensi, laporan akhlak, dan riwayat pembayaran.',
    highlight: true,
  },
  {
    icon: HiOutlineClipboardDocumentCheck, title: 'Perizinan Online',
    desc: 'Pengajuan izin keluar, pulang, dan sakit secara digital. Approval multi-level dengan notifikasi otomatis ke wali santri.',
    highlight: false,
  },
  {
    icon: HiOutlineBellAlert, title: 'WhatsApp Notification',
    desc: 'Notifikasi otomatis ke wali santri via WhatsApp — absensi, hafalan, pembayaran, dan informasi penting pondok.',
    highlight: false,
  },
  {
    icon: HiOutlineDocumentText, title: 'PPDB Online',
    desc: 'Sistem penerimaan peserta didik baru secara online — formulir pendaftaran, upload berkas, dan tracking status.',
    highlight: true,
  },
  {
    icon: HiOutlineShieldCheck, title: 'Keamanan Data',
    desc: 'Sistem keamanan berlapis untuk melindungi data santri dan pondok pesantren. Enkripsi end-to-end dan backup otomatis.',
    highlight: false,
  },
]

export default function DigitalSystemPage() {
  const [featRef, featInView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [mockupRef, mockupInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      <PageHero
        label="Sistem Digital"
        title="Pesantren Berbasis Teknologi Digital"
        description="Sistem informasi terintegrasi untuk manajemen pesantren yang efisien, transparan, dan real-time."
      />

      {/* Features Grid */}
      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={featRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={featInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`p-6 rounded-xl border transition-all duration-300 group ${
                  f.highlight
                    ? 'bg-canvas-night border-canvas-night-soft hover:border-primary/30 text-on-dark'
                    : 'bg-canvas border-hairline hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                }`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  f.highlight ? 'bg-primary/15 group-hover:bg-primary/25' : 'bg-primary/10 group-hover:bg-primary/20'
                }`}>
                  <f.icon className={`w-5 h-5 ${f.highlight ? 'text-primary' : 'text-primary-deep'}`} />
                </div>
                <h3 className={`text-base font-semibold mb-2 ${f.highlight ? 'text-on-dark' : 'text-ink'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${f.highlight ? 'text-ink-mute-2' : 'text-ink-mute'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section className="py-24 lg:py-32 bg-canvas-night relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={mockupRef} className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={mockupInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/15 text-primary">
                Smart Pesantren
              </span>
              <h2 className="text-display-xl text-on-dark mb-6">
                Semua Terintegrasi dalam Satu Sistem
              </h2>
              <p className="text-ink-mute-2 leading-relaxed mb-8">
                Sistem digital pondok pesantren yang menghubungkan pengurus, ustadz, santri,
                dan wali santri dalam satu platform terintegrasi. Monitoring real-time,
                pembayaran online, dan komunikasi langsung via WhatsApp.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: HiOutlineDevicePhoneMobile, text: 'Akses dari perangkat apapun — desktop, tablet, dan mobile' },
                  { icon: HiOutlineShieldCheck, text: 'Data terenkripsi dan backup otomatis setiap hari' },
                  { icon: HiOutlineBellAlert, text: 'Notifikasi real-time via WhatsApp dan push notification' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-ink-mute-2 leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>

              <Button as={Link} to="/login" size="lg">
                Akses Portal
                <HiOutlineArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={mockupInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
            >
              <div className="bg-canvas-night-soft p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="ml-4 text-xs text-ink-faint font-mono">sistem.tursinaalam.sch.id</span>
                </div>
                <div className="bg-canvas-night rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-on-dark text-sm font-medium">Dashboard Pengurus</div>
                      <div className="text-ink-mute-2 text-xs mt-0.5">Monitoring Real-time</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-primary text-xs font-medium">Live</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Hadir', val: '1.187', c: 'text-primary' },
                      { label: 'Izin', val: '42', c: 'text-amber-400' },
                      { label: 'Sakit', val: '21', c: 'text-red-400' },
                      { label: 'SPP Lunas', val: '98.5%', c: 'text-primary' },
                    ].map((s) => (
                      <div key={s.label} className="bg-canvas-night-soft rounded-md p-3 text-center">
                        <div className="text-ink-mute-2 text-[9px] uppercase tracking-wider">{s.label}</div>
                        <div className={`text-lg font-semibold mt-1 ${s.c}`}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[35, 55, 40, 70, 50, 85, 65, 90, 55, 75, 60, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-primary/25 hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
