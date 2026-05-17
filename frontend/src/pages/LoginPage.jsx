import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiOutlineShieldCheck, HiOutlineUserGroup,
  HiOutlineAcademicCap, HiOutlineArrowRight,
  HiOutlineEye, HiOutlineEyeSlash,
} from 'react-icons/hi2'
import Button from '../components/ui/Button'

const portals = [
  {
    id: 'admin',
    icon: HiOutlineShieldCheck,
    title: 'Admin & Pengurus',
    desc: 'Dashboard manajemen pondok pesantren',
    color: 'bg-primary/10 text-primary-deep',
    url: '#',
  },
  {
    id: 'wali',
    icon: HiOutlineUserGroup,
    title: 'Wali Santri',
    desc: 'Portal monitoring anak dan pembayaran',
    color: 'bg-blue-50 text-blue-700',
    url: '#',
  },
  {
    id: 'santri',
    icon: HiOutlineAcademicCap,
    title: 'Santri',
    desc: 'Akses jadwal, nilai, dan hafalan',
    color: 'bg-amber-50 text-amber-700',
    url: '#',
  },
]

export default function LoginPage() {
  const [activePortal, setActivePortal] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Fitur login akan terhubung ke backend sistem pondok pesantren.')
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-[72px] bg-canvas-soft relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern islamic-pattern-grid" />
      <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-on-primary font-bold text-xl">TA</span>
            </div>
          </Link>
          <h1 className="text-display-lg text-ink mb-2">Login Portal Tursina Alam</h1>
          <p className="text-ink-mute">Pilih portal dan masukkan kredensial Anda</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-3xl mx-auto">
          {/* Portal Selector */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            {portals.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePortal(p.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  activePortal === p.id
                    ? 'bg-canvas border-2 border-primary shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
                    : 'bg-canvas border border-hairline hover:border-hairline-strong'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.color}`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">{p.title}</div>
                  <div className="text-xs text-ink-mute truncate">{p.desc}</div>
                </div>
                {activePortal === p.id && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-2xl border border-hairline bg-canvas"
          >
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const p = portals.find((x) => x.id === activePortal)
                return (
                  <>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.color}`}>
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-ink">{p.title}</div>
                      <div className="text-xs text-ink-mute">{p.desc}</div>
                    </div>
                  </>
                )
              })()}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">
                  {activePortal === 'santri' ? 'NIS / Username' : 'Email / Username'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  placeholder={activePortal === 'santri' ? 'Masukkan NIS' : 'Masukkan email'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-mute hover:text-ink transition-colors cursor-pointer"
                  >
                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-hairline text-primary focus:ring-primary/30 accent-primary" />
                  <span className="text-sm text-ink-mute">Ingat saya</span>
                </label>
                <a href="#" className="text-sm text-primary-deep hover:text-primary transition-colors font-medium">
                  Lupa password?
                </a>
              </div>

              <Button type="submit" size="lg" className="w-full justify-center">
                Masuk ke Portal
                <HiOutlineArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-hairline text-center">
              <p className="text-sm text-ink-mute">
                Belum memiliki akun?{' '}
                <Link to="/sistem-digital" className="text-primary-deep hover:text-primary font-medium transition-colors">
                  Daftar PPDB Online
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
