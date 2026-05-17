import { motion } from 'framer-motion'
import DataTable from '../../admin/components/DataTable'
import StatsCard from '../../admin/components/StatsCard'
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle } from 'react-icons/hi2'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const stats = [
  { label: 'Total Hadir', value: '22', icon: HiOutlineCheckCircle, color: 'emerald' },
  { label: 'Terlambat', value: '2', icon: HiOutlineClock, color: 'amber' },
  { label: 'Alpha', value: '1', icon: HiOutlineXCircle, color: 'rose' },
]

const monthlyData = [
  { month: 'Jan', hadir: 22, alpha: 1 }, { month: 'Feb', hadir: 20, alpha: 2 },
  { month: 'Mar', hadir: 23, alpha: 0 }, { month: 'Apr', hadir: 21, alpha: 2 },
  { month: 'Mei', hadir: 19, alpha: 4 }, { month: 'Jun', hadir: 22, alpha: 1 },
]

const records = [
  { id: '1', date: '2026-06-10', status: 'present', check_in: '06:45', method: 'QR' },
  { id: '2', date: '2026-06-09', status: 'present', check_in: '06:50', method: 'QR' },
  { id: '3', date: '2026-06-08', status: 'late', check_in: '07:15', method: 'QR' },
  { id: '4', date: '2026-06-07', status: 'sick', check_in: '-', method: 'Manual' },
  { id: '5', date: '2026-06-06', status: 'present', check_in: '06:40', method: 'QR' },
]

const statusBadge = (s) => {
  const m = { present: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', late: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', sick: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', absent: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' }
  const l = { present: 'Hadir', late: 'Terlambat', sick: 'Sakit', absent: 'Alpha' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[s]}`}>{l[s]}</span>
}

const columns = [
  { key: 'date', label: 'Tanggal', sortable: true },
  { key: 'check_in', label: 'Check-in' },
  { key: 'method', label: 'Metode' },
  { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
]

export default function WaliAbsensi() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Monitoring Absensi</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Riwayat kehadiran Muhammad Abdullah — Kelas 7A</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => <StatsCard key={s.label} {...s} index={i} />)}
      </div>
      <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Kehadiran Bulanan</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="hadir" fill="#3ecf8e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="alpha" fill="#ff2201" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable columns={columns} data={records} page={1} totalPages={1} />
    </div>
  )
}
