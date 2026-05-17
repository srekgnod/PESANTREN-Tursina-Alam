import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import {
  HiOutlineBars3, HiOutlineBell, HiOutlineMagnifyingGlass,
  HiOutlineSun, HiOutlineMoon,
} from 'react-icons/hi2'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Topbar() {
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore()
  const { user } = useAuthStore()
  const [showNotif, setShowNotif] = useState(false)

  const notifications = [
    { id: 1, title: 'Pembayaran SPP baru', desc: 'Muhammad Abdullah — Rp 750.000', time: '5 menit lalu', unread: true },
    { id: 2, title: 'Santri baru terdaftar PPDB', desc: 'Aisyah Zahra — Kelas 7A', time: '1 jam lalu', unread: true },
    { id: 3, title: 'Absensi selesai dicatat', desc: '45 santri hadir hari ini', time: '3 jam lalu', unread: false },
  ]

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-auto h-16 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-xl border-b border-[#ededed] dark:border-[#2a2a2a] z-30 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu toggle */}
      <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#707070]">
        <HiOutlineBars3 className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
          <input
            type="text"
            placeholder="Cari santri, pembayaran, pengumuman..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white placeholder:text-[#b2b2b2] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#b2b2b2] bg-[#ededed] dark:bg-[#2a2a2a] px-1.5 py-0.5 rounded font-mono">/</kbd>
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#707070] dark:text-[#9a9a9a] transition-colors"
        >
          {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#707070] dark:text-[#9a9a9a] transition-colors relative"
          >
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#ededed] dark:border-[#2a2a2a]">
                    <h3 className="text-sm font-semibold text-[#171717] dark:text-white">Notifikasi</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-[#ededed] dark:border-[#2a2a2a] last:border-0 hover:bg-[#fafafa] dark:hover:bg-[#202020] transition-colors cursor-pointer ${n.unread ? '' : 'opacity-60'}`}>
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                          <div className={n.unread ? '' : 'ml-4'}>
                            <p className="text-sm font-medium text-[#171717] dark:text-white">{n.title}</p>
                            <p className="text-xs text-[#9a9a9a] mt-0.5">{n.desc}</p>
                            <p className="text-[11px] text-[#b2b2b2] mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#ededed] dark:border-[#2a2a2a]">
                    <button className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline w-full text-center">Lihat Semua Notifikasi</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-[#ededed] dark:border-[#2a2a2a]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.full_name?.charAt(0) || 'A'}</span>
          </div>
          <div className="hidden xl:block">
            <p className="text-sm font-medium text-[#171717] dark:text-white">{user?.full_name || 'Admin'}</p>
            <p className="text-[11px] text-[#9a9a9a] capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
