import { motion } from 'framer-motion'
import DataTable from '../components/DataTable'
import StatsCard from '../components/StatsCard'
import { HiOutlineClipboardDocumentCheck, HiOutlineQrCode, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const stats = [
  { label: 'Hadir Hari Ini', value: '421', icon: HiOutlineCheckCircle, color: 'emerald', change: '86.4%' },
  { label: 'Izin / Sakit', value: '27', icon: HiOutlineClipboardDocumentCheck, color: 'blue', change: '5.5%' },
  { label: 'Alpha', value: '39', icon: HiOutlineXCircle, color: 'rose', change: '8.0%' },
  { label: 'Scan QR Hari Ini', value: '380', icon: HiOutlineQrCode, color: 'violet' },
]

const weeklyData = [
  { day: 'Sen', hadir: 420, alpha: 42 }, { day: 'Sel', hadir: 435, alpha: 32 },
  { day: 'Rab', hadir: 410, alpha: 42 }, { day: 'Kam', hadir: 445, alpha: 25 },
  { day: 'Jum', hadir: 400, alpha: 57 }, { day: 'Sab', hadir: 380, alpha: 62 },
]

const todayRecords = [
  { id: '1', santri_name: 'Muhammad Abdullah', class: '7A', check_in: '06:45', status: 'present', method: 'qr' },
  { id: '2', santri_name: 'Aisyah Zahra', class: '7A', check_in: '06:50', status: 'present', method: 'qr' },
  { id: '3', santri_name: 'Umar Faruq', class: '7B', check_in: '07:15', status: 'late', method: 'qr' },
  { id: '4', santri_name: 'Khadijah Nur', class: '8A', check_in: '-', status: 'sick', method: 'manual' },
  { id: '5', santri_name: 'Ali Imran', class: '8B', check_in: '-', status: 'absent', method: '-' },
]

const statusBadge = (s) => {
  const m = { present: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', late: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', sick: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', permission: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400', absent: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' }
  const l = { present: 'Hadir', late: 'Terlambat', sick: 'Sakit', permission: 'Izin', absent: 'Alpha' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[s]}`}>{l[s]}</span>
}

const columns = [
  { key: 'santri_name', label: 'Nama Santri', sortable: true },
  { key: 'class', label: 'Kelas', sortable: true },
  { key: 'check_in', label: 'Check-in' },
  { key: 'method', label: 'Metode', render: (v) => <span className="capitalize">{v}</span> },
  { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
]

export default function AbsensiPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Monitoring Absensi</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Data kehadiran santri hari ini</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatsCard key={s.label} {...s} index={i} />)}
      </div>
      <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Tren Kehadiran Minggu Ini</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="hadir" fill="#3ecf8e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="alpha" fill="#ff2201" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable columns={columns} data={todayRecords} page={1} totalPages={1} emptyMessage="Belum ada data absensi" />
    </div>
  )
}
