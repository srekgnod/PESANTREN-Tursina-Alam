import { motion } from 'framer-motion'
import { HiOutlineArrowRight, HiOutlineUserGroup, HiOutlineDocumentText, HiOutlineBookOpen, HiOutlineCheckBadge } from 'react-icons/hi2'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-canvas">
      {/* Subtle geometric background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl" />

        {/* Islamic geometric grid — very subtle */}
        <div className="absolute inset-0 islamic-pattern islamic-pattern-grid" />

        {/* Fine grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(to right, var(--color-ink) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-20 lg:pt-14 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-deep border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Pendaftaran Santri Baru 2026/2027 Dibuka
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base font-medium text-primary-deep mb-3 font-[Amiri] text-lg"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-display-xxl text-ink mb-6"
            >
              Pondok Pesantren{' '}
              <span className="text-primary">Tursina Alam</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg leading-relaxed text-ink-mute mb-10 max-w-lg"
            >
              Membentuk generasi Qurani yang berakhlak mulia, berwawasan global,
              dan menguasai teknologi — pesantren modern berbasis sistem digital
              terintegrasi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Button size="lg" href="#">
                Login Sistem
                <HiOutlineArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="secondary" href="#">
                <HiOutlineUserGroup className="w-4 h-4" />
                Portal Wali
              </Button>
              <Button size="lg" variant="outline" href="#">
                <HiOutlineDocumentText className="w-4 h-4" />
                SPMB Online
              </Button>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-hairline"
            >
              {[
                { num: '1.250+', label: 'Santri Aktif' },
                { num: '30 Juz', label: 'Program Tahfidz' },
                { num: '99%', label: 'Lulusan Berkualitas' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-semibold text-ink tracking-tight">
                    {stat.num}
                  </div>
                  <div className="text-xs text-ink-mute mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Main card — composited UI mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-hairline shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
              <div className="bg-canvas-night p-6">
                {/* Mockup header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="ml-4 text-xs text-ink-faint font-mono">
                    dashboard.tursinaalam.sch.id
                  </span>
                </div>

                {/* Dashboard mockup content */}
                <div className="bg-canvas-night-soft rounded-lg p-5 space-y-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-on-dark text-sm font-medium">Dashboard Pesantren</div>
                      <div className="text-ink-mute-2 text-xs mt-0.5">Realtime Monitoring System</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-primary text-xs font-medium">Live</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Santri Hadir', value: '1.187', pct: '95%', color: 'text-primary' },
                      { label: 'Hafalan Hari Ini', value: '342', pct: '+12%', color: 'text-primary-soft' },
                      { label: 'SPP Lunas', value: '98.5%', pct: 'On Track', color: 'text-primary' },
                    ].map((item) => (
                      <div key={item.label} className="bg-canvas-night rounded-md p-3">
                        <div className="text-ink-mute-2 text-[10px] uppercase tracking-wider">{item.label}</div>
                        <div className={`text-lg font-semibold mt-1 ${item.color}`}>{item.value}</div>
                        <div className="text-ink-faint text-[10px] mt-0.5">{item.pct}</div>
                      </div>
                    ))}
                  </div>

                  {/* Activity bars */}
                  <div className="space-y-2">
                    <div className="text-ink-mute-2 text-[10px] uppercase tracking-wider">Aktivitas Mingguan</div>
                    <div className="flex items-end gap-1 h-12">
                      {[40, 65, 45, 80, 60, 95, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-primary/30 hover:bg-primary/50 transition-colors"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-ink-faint text-[9px]">
                      <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-8 top-1/4 glass-card rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HiOutlineBookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">Hafalan Selesai</div>
                  <div className="text-xs text-ink-mute">Juz 30 — Ahmad Fauzi</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-4 bottom-16 glass-card rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HiOutlineCheckBadge className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">Absensi QR</div>
                  <div className="text-xs text-primary-deep">Verified • 06:32 WIB</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
          <path
            d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
            fill="var(--color-canvas-soft)"
          />
        </svg>
      </div>
    </section>
  )
}
