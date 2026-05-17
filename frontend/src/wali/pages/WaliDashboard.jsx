import { motion } from 'framer-motion'
import StatsCard from '../../admin/components/StatsCard'
import {
  HiOutlineUsers, HiOutlineClipboardDocumentCheck, HiOutlineBanknotes,
  HiOutlineAcademicCap, HiOutlineShieldCheck, HiOutlineClock,
} from 'react-icons/hi2'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const child = {
  nis: '2026001', full_name: 'Muhammad Abdullah', gender: 'L',
  class: '7A', dormitory: 'Al-Fatih', status: 'active', entry_year: 2026,
}

const attendanceData = [
  { week: 'Mg-1', hadir: 5, alpha: 0 }, { week: 'Mg-2', hadir: 4, alpha: 1 },
  { week: 'Mg-3', hadir: 5, alpha: 0 }, { week: 'Mg-4', hadir: 5, alpha: 0 },
]

const attendancePie = [
  { name: 'Hadir', value: 22, color: '#3ecf8e' },
  { name: 'Terlambat', value: 2, color: '#ffdb13' },
  { name: 'Izin', value: 1, color: '#054cff' },
  { name: 'Alpha', value: 1, color: '#ff2201' },
]

const recentNotes = [
  { type: 'prestasi', title: 'Juara 1 Lomba Tahfidz', date: '2026-06-10' },
  { type: 'catatan', title: 'Membantu kegiatan bersih-bersih', date: '2026-06-08' },
  { type: 'pelanggaran', title: 'Terlambat sholat subuh', date: '2026-06-05' },
]

const noteColors = { prestasi: 'bg-emerald-500', catatan: 'bg-blue-500', pelanggaran: 'bg-rose-500' }
const noteLabels = { prestasi: 'Prestasi', catatan: 'Catatan', pelanggaran: 'Pelanggaran' }

export default function WaliDashboard() {
  return (
    <div className="space-y-6">
      {/* Child Info Card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
            <span className="text-white text-2xl font-bold">{child.full_name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#171717] dark:text-white">{child.full_name}</h1>
            <p className="text-sm text-[#9a9a9a] mt-0.5">NIS: {child.nis} - Kelas {child.class} - Asrama {child.dormitory}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Aktif</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">Angkatan {child.entry_year}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Kehadiran" value="84.6%" icon={HiOutlineClipboardDocumentCheck} color="emerald" change="+2.1% dari bulan lalu" index={0} />
        <StatsCard label="Total Tagihan" value="Rp 1.5 Jt" icon={HiOutlineBanknotes} color="amber" change="2 tagihan aktif" index={1} />
        <StatsCard label="Izin Aktif" value="0" icon={HiOutlineShieldCheck} color="violet" index={2} />
        <StatsCard label="Hafalan" value="3 Juz" icon={HiOutlineAcademicCap} color="blue" change="+1 juz bulan ini" index={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Kehadiran Bulan Ini</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="waliGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="hadir" stroke="#3ecf8e" strokeWidth={2} fill="url(#waliGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Distribusi Kehadiran</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {attendancePie.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {attendancePie.map((i) => (
              <div key={i.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i.color }} />
                <span className="text-xs text-[#9a9a9a]">{i.name} ({i.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pending Payments + Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Tagihan Aktif</h3>
          <div className="space-y-3">
            {[
              { type: 'SPP', period: 'Juni 2026', amount: 'Rp 750.000', status: 'pending', due: '2026-06-15' },
              { type: 'SPP', period: 'Mei 2026', amount: 'Rp 750.000', status: 'overdue', due: '2026-05-15' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[#ededed] dark:border-[#2a2a2a] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-white">{p.type} — {p.period}</p>
                  <p className="text-xs text-[#9a9a9a] mt-0.5">Jatuh tempo: {p.due}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#171717] dark:text-white">{p.amount}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'overdue' ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {p.status === 'overdue' ? 'Tertunggak' : 'Menunggu'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Catatan Terkini</h3>
          <div className="space-y-3">
            {recentNotes.map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${noteColors[n.type]}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${n.type === 'prestasi' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : n.type === 'pelanggaran' ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'}`}>{noteLabels[n.type]}</span>
                  </div>
                  <p className="text-sm text-[#171717] dark:text-white mt-1">{n.title}</p>
                  <p className="text-[11px] text-[#b2b2b2] mt-0.5">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
