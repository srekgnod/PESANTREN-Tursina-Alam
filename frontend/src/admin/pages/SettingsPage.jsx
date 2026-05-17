import { motion } from 'framer-motion'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { HiOutlineSun, HiOutlineMoon, HiOutlineKey, HiOutlineUser } from 'react-icons/hi2'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useUIStore()
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Settings</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Pengaturan akun dan preferensi</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <HiOutlineUser className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white">Profil</h3>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{user?.full_name?.charAt(0) || 'A'}</span>
          </div>
          <div>
            <p className="text-base font-semibold text-[#171717] dark:text-white">{user?.full_name || 'Administrator'}</p>
            <p className="text-sm text-[#9a9a9a]">{user?.email || 'admin@tursina.sch.id'}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize mt-1">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Nama Lengkap</label>
            <input defaultValue={user?.full_name || 'Administrator'} className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Email</label>
            <input defaultValue={user?.email || 'admin@tursina.sch.id'} className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => toast.success('Profil disimpan')} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Simpan Profil</button>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          {darkMode ? <HiOutlineMoon className="w-5 h-5 text-emerald-500" /> : <HiOutlineSun className="w-5 h-5 text-emerald-500" />}
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white">Tampilan</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#171717] dark:text-white">Dark Mode</p>
            <p className="text-xs text-[#9a9a9a] mt-0.5">Aktifkan tema gelap untuk kenyamanan mata</p>
          </div>
          <button onClick={toggleDarkMode} className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-[#d4d4d4]'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <HiOutlineKey className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white">Ubah Password</h3>
        </div>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Password Lama</label>
            <input type="password" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Password Baru</label>
            <input type="password" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Konfirmasi Password</label>
            <input type="password" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => toast.success('Password diubah')} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Ubah Password</button>
        </div>
      </motion.div>
    </div>
  )
}
