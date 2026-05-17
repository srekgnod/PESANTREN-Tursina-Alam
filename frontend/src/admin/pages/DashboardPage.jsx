import { motion } from 'framer-motion'
import StatsCard, { StatsCardSkeleton } from '../components/StatsCard'
import {
  HiOutlineUsers, HiOutlineClipboardDocumentCheck, HiOutlineBanknotes,
  HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineClock,
} from 'react-icons/hi2'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useState } from 'react'

// Mock data
const stats = [
  { label: 'Total Santri', value: '487', icon: HiOutlineUsers, change: '+12 bulan ini', changeType: 'up', color: 'emerald' },
  { label: 'Hadir Hari Ini', value: '421', icon: HiOutlineClipboardDocumentCheck, change: '86.4% kehadiran', changeType: 'up', color: 'blue' },
  { label: 'Pendapatan Bulan Ini', value: 'Rp 245.5 Jt', icon: HiOutlineBanknotes, change: '+18.2% vs bulan lalu', changeType: 'up', color: 'amber' },
  { label: 'Pendaftar PPDB', value: '64', icon: HiOutlineAcademicCap, change: '23 menunggu review', changeType: 'up', color: 'violet' },
  { label: 'Total Pengurus', value: '38', icon: HiOutlineUserGroup, change: '5 ustadz baru', changeType: 'up', color: 'teal' },
  { label: 'Tagihan Tertunggak', value: '12', icon: HiOutlineClock, change: 'Rp 9 Jt', changeType: 'down', color: 'rose' },
]

const attendanceData = [
  { name: 'Sen', hadir: 420, izin: 15, sakit: 10, alpha: 42 },
  { name: 'Sel', hadir: 435, izin: 12, sakit: 8, alpha: 32 },
  { name: 'Rab', hadir: 410, izin: 20, sakit: 15, alpha: 42 },
  { name: 'Kam', hadir: 445, izin: 10, sakit: 7, alpha: 25 },
  { name: 'Jum', hadir: 400, izin: 18, sakit: 12, alpha: 57 },
  { name: 'Sab', hadir: 380, izin: 25, sakit: 20, alpha: 62 },
]

const revenueData = [
  { name: 'Jan', amount: 180 }, { name: 'Feb', amount: 195 }, { name: 'Mar', amount: 210 },
  { name: 'Apr', amount: 225 }, { name: 'Mei', amount: 245 }, { name: 'Jun', amount: 240 },
]

const classDistribution = [
  { name: 'Kelas 7', value: 165, color: '#3ecf8e' },
  { name: 'Kelas 8', value: 172, color: '#644fc1' },
  { name: 'Kelas 9', value: 150, color: '#054cff' },
]

const activities = [
  { id: 1, action: 'Pembayaran SPP dikonfirmasi', target: 'Muhammad Abdullah — Rp 750.000', time: '5 menit lalu', type: 'payment' },
  { id: 2, action: 'Santri baru ditambahkan', target: 'Aisyah Zahra — Kelas 7A', time: '32 menit lalu', type: 'santri' },
  { id: 3, action: 'Absensi dicatat via QR', target: '45 santri check-in', time: '1 jam lalu', type: 'attendance' },
  { id: 4, action: 'Pendaftaran PPDB baru', target: 'Umar Faruq — SMP N 3 Jakarta', time: '2 jam lalu', type: 'ppdb' },
  { id: 5, action: 'Pengumuman dipublikasikan', target: 'Jadwal Ujian Akhir Semester', time: '3 jam lalu', type: 'announcement' },
  { id: 6, action: 'Tagihan SPP dibuat', target: 'Kelas 8A — Periode Juni 2026', time: '4 jam lalu', type: 'payment' },
]

const typeColors = { payment: 'bg-amber-500', santri: 'bg-emerald-500', attendance: 'bg-blue-500', ppdb: 'bg-violet-500', announcement: 'bg-rose-500' }

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState('minggu')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-[#171717] dark:text-white"
        >
          Dashboard
        </motion.h1>
        <p className="text-sm text-[#9a9a9a] mt-1">Selamat datang kembali. Berikut ringkasan hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#171717] dark:text-white">Kehadiran Santri</h3>
            <div className="flex gap-1 bg-[#f5f5f5] dark:bg-[#1c1c1c] rounded-lg p-0.5">
              {['minggu', 'bulan'].map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    chartPeriod === p ? 'bg-white dark:bg-[#2a2a2a] text-[#171717] dark:text-white shadow-sm' : 'text-[#9a9a9a]'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendanceData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="hadir" fill="#3ecf8e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="izin" fill="#054cff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sakit" fill="#ffdb13" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alpha" fill="#ff2201" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, marginTop: 8 }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Class Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Distribusi Kelas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={classDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {classDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {classDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-[#707070] dark:text-[#9a9a9a]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Pendapatan (Juta Rupiah)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="amount" stroke="#3ecf8e" strokeWidth={2} fill="url(#emeraldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Aktivitas Terkini</h3>
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {activities.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${typeColors[a.type]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#171717] dark:text-[#e5e5e5] font-medium">{a.action}</p>
                  <p className="text-xs text-[#9a9a9a] truncate">{a.target}</p>
                  <p className="text-[11px] text-[#b2b2b2] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
