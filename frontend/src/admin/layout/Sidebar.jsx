import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineUserGroup, HiOutlineClipboardDocumentCheck,
  HiOutlineBanknotes, HiOutlineShieldCheck, HiOutlineMegaphone, HiOutlineAcademicCap,
  HiOutlineChartBarSquare, HiOutlineCog6Tooth, HiOutlineArrowLeftOnRectangle,
  HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi2'

const menuItems = [
  { label: 'Dashboard', icon: HiOutlineHome, path: '/admin' },
  { label: 'Santri', icon: HiOutlineUsers, path: '/admin/santri' },
  { label: 'Pengurus', icon: HiOutlineUserGroup, path: '/admin/pengurus' },
  { label: 'Absensi', icon: HiOutlineClipboardDocumentCheck, path: '/admin/absensi' },
  { label: 'Pembayaran', icon: HiOutlineBanknotes, path: '/admin/pembayaran' },
  { label: 'Perizinan', icon: HiOutlineShieldCheck, path: '/admin/perizinan' },
  { label: 'Pengumuman', icon: HiOutlineMegaphone, path: '/admin/pengumuman' },
  { label: 'PPDB', icon: HiOutlineAcademicCap, path: '/admin/ppdb' },
  { label: 'Laporan', icon: HiOutlineChartBarSquare, path: '/admin/laporan' },
  { label: 'Settings', icon: HiOutlineCog6Tooth, path: '/admin/settings' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-[#141414] border-r border-[#ededed] dark:border-[#2a2a2a] transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'w-[260px]' : 'w-[72px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-4 border-b border-[#ededed] dark:border-[#2a2a2a] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">TA</span>
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-3 overflow-hidden"
            >
              <p className="text-sm font-semibold text-[#171717] dark:text-white truncate">Tursina Alam</p>
              <p className="text-[11px] text-[#9a9a9a] truncate">Sistem Informasi</p>
            </motion.div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-[#707070] dark:text-[#9a9a9a] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] hover:text-[#171717] dark:hover:text-white'
                }`}
                title={item.label}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-500' : ''}`} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {isActive && sidebarOpen && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
                  />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Card */}
        {sidebarOpen && (
          <div className="p-3 border-t border-[#ededed] dark:border-[#2a2a2a] shrink-0">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-[#fafafa] dark:bg-[#1c1c1c]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#171717] dark:text-white truncate">{user?.full_name || 'Admin'}</p>
                <p className="text-[11px] text-[#9a9a9a] capitalize truncate">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
              </div>
              <button onClick={logout} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 text-[#9a9a9a] hover:text-red-500 transition-colors" title="Logout">
                <HiOutlineArrowLeftOnRectangle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] items-center justify-center text-[#9a9a9a] hover:text-[#171717] dark:hover:text-white hover:border-emerald-300 transition-colors shadow-sm"
        >
          {sidebarOpen ? <HiOutlineChevronLeft className="w-3 h-3" /> : <HiOutlineChevronRight className="w-3 h-3" />}
        </button>
      </aside>
    </>
  )
}
