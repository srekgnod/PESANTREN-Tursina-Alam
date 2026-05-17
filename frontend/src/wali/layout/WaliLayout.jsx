import { Outlet, NavLink } from 'react-router-dom'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import {
  HiOutlineHome, HiOutlineClipboardDocumentCheck, HiOutlineBanknotes,
  HiOutlineShieldCheck, HiOutlineMegaphone, HiOutlineBell, HiOutlineUser,
  HiOutlineArrowLeftOnRectangle, HiOutlineSun, HiOutlineMoon, HiOutlineBars3,
} from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const menuItems = [
  { label: 'Dashboard Anak', icon: HiOutlineHome, path: '/wali' },
  { label: 'Absensi', icon: HiOutlineClipboardDocumentCheck, path: '/wali/absensi' },
  { label: 'Pembayaran', icon: HiOutlineBanknotes, path: '/wali/pembayaran' },
  { label: 'Perizinan', icon: HiOutlineShieldCheck, path: '/wali/perizinan' },
  { label: 'Pengumuman', icon: HiOutlineMegaphone, path: '/wali/pengumuman' },
  { label: 'Notifikasi', icon: HiOutlineBell, path: '/wali/notifikasi' },
  { label: 'Profil', icon: HiOutlineUser, path: '/wali/profil' },
]

export default function WaliLayout() {
  const { darkMode, toggleDarkMode } = useUIStore()
  const { user, logout } = useAuthStore()
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{
        style: { background: darkMode ? '#1c1c1c' : '#fff', color: darkMode ? '#e5e5e5' : '#171717', border: `1px solid ${darkMode ? '#2a2a2a' : '#ededed'}` },
      }} />

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xl border-b border-[#ededed] dark:border-[#2a2a2a] z-50 flex items-center px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">TA</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#171717] dark:text-white">Portal Wali Santri</p>
            <p className="text-[11px] text-[#9a9a9a]">Tursina Alam</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/wali'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] hover:text-[#171717] dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden xl:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#707070]">
            {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#ededed] dark:border-[#2a2a2a]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.full_name?.charAt(0) || 'W'}</span>
            </div>
            <span className="text-sm font-medium text-[#171717] dark:text-white hidden xl:block">{user?.full_name || 'Wali'}</span>
          </div>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-[#9a9a9a] hover:text-red-500">
            <HiOutlineArrowLeftOnRectangle className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#707070]">
            <HiOutlineBars3 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileMenu(false)} />
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed top-16 left-0 right-0 bg-white dark:bg-[#141414] border-b border-[#ededed] dark:border-[#2a2a2a] z-40 p-3 lg:hidden">
              {menuItems.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.path === '/wali'} onClick={() => setMobileMenu(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'text-[#707070]'}`}>
                  <item.icon className="w-5 h-5" />{item.label}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-20 px-4 pb-4 lg:px-6 lg:pb-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
