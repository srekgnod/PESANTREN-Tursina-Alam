import { motion } from 'framer-motion'
import DataTable from '../components/DataTable'
import StatsCard from '../components/StatsCard'
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'
import toast from 'react-hot-toast'

const stats = [
  { label: 'Total Pendaftar', value: '64', icon: HiOutlineAcademicCap, color: 'violet' },
  { label: 'Menunggu Review', value: '23', icon: HiOutlineClock, color: 'amber' },
  { label: 'Diterima', value: '35', icon: HiOutlineCheckCircle, color: 'emerald' },
  { label: 'Ditolak', value: '6', icon: HiOutlineXCircle, color: 'rose' },
]

const data = [
  { id: '1', registration_number: 'PPDB-2026-a1b2c3d4', full_name: 'Ahmad Ridwan', gender: 'L', previous_school: 'SDN 1 Jakarta', parent_name: 'Bapak Ridwan', parent_phone: '081211111111', status: 'registered', academic_year: '2026/2027' },
  { id: '2', registration_number: 'PPDB-2026-e5f6g7h8', full_name: 'Fatimah Azzahra', gender: 'P', previous_school: 'SDIT Al-Falah', parent_name: 'Ibu Zahra', parent_phone: '081222222222', status: 'accepted', academic_year: '2026/2027' },
  { id: '3', registration_number: 'PPDB-2026-i9j0k1l2', full_name: 'Hasan Basri', gender: 'L', previous_school: 'SDN 5 Bandung', parent_name: 'Bapak Basri', parent_phone: '081233333333', status: 'reviewing', academic_year: '2026/2027' },
  { id: '4', registration_number: 'PPDB-2026-m3n4o5p6', full_name: 'Zainab Putri', gender: 'P', previous_school: 'MI Nurul Huda', parent_name: 'Ibu Putri', parent_phone: '081244444444', status: 'rejected', academic_year: '2026/2027' },
]

const statusBadge = (s) => {
  const m = { registered: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', reviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', accepted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' }
  const l = { registered: 'Terdaftar', reviewing: 'Review', accepted: 'Diterima', rejected: 'Ditolak' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[s]}`}>{l[s]}</span>
}

const columns = [
  { key: 'registration_number', label: 'No. Pendaftaran', render: (v) => <span className="font-mono text-xs">{v}</span> },
  { key: 'full_name', label: 'Nama', sortable: true },
  { key: 'gender', label: 'JK', render: (v) => v === 'L' ? 'Laki-laki' : 'Perempuan' },
  { key: 'previous_school', label: 'Asal Sekolah' },
  { key: 'parent_name', label: 'Wali' },
  { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
  { key: 'actions', label: '', render: (_, row) => row.status === 'registered' || row.status === 'reviewing' ? (
    <div className="flex gap-1">
      <button onClick={() => toast.success('Pendaftar diterima')} className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors">Terima</button>
      <button onClick={() => toast.error('Pendaftar ditolak')} className="px-2.5 py-1 text-xs border border-rose-200 dark:border-rose-800 text-rose-600 rounded-md font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">Tolak</button>
    </div>
  ) : null },
]

export default function PPDBPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">PPDB Online</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Penerimaan Peserta Didik Baru T.A. 2026/2027</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatsCard key={s.label} {...s} index={i} />)}
      </div>
      <DataTable columns={columns} data={data} page={1} totalPages={1} />
    </div>
  )
}
