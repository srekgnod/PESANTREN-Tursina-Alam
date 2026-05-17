import { motion } from 'framer-motion'
import DataTable from '../components/DataTable'
import StatsCard from '../components/StatsCard'
import { HiOutlineShieldCheck, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'

const stats = [
  { label: 'Total Perizinan', value: '24', icon: HiOutlineShieldCheck, color: 'violet', index: 0 },
  { label: 'Menunggu', value: '8', icon: HiOutlineClock, color: 'amber', index: 1 },
  { label: 'Disetujui', value: '14', icon: HiOutlineCheckCircle, color: 'emerald', index: 2 },
  { label: 'Ditolak', value: '2', icon: HiOutlineXCircle, color: 'rose', index: 3 },
]

const data = [
  { id: '1', santri_name: 'Muhammad Abdullah', type: 'Pulang', date_from: '2026-06-10', date_to: '2026-06-12', reason: 'Acara keluarga', status: 'approved' },
  { id: '2', santri_name: 'Aisyah Zahra', type: 'Sakit', date_from: '2026-06-08', date_to: '2026-06-09', reason: 'Demam', status: 'approved' },
  { id: '3', santri_name: 'Umar Faruq', type: 'Pulang', date_from: '2026-06-15', date_to: '2026-06-16', reason: 'Pernikahan saudara', status: 'pending' },
  { id: '4', santri_name: 'Ali Imran', type: 'Lainnya', date_from: '2026-06-11', date_to: '2026-06-11', reason: 'Tes masuk SMA', status: 'pending' },
]

const statusBadge = (s) => {
  const m = { approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' }
  const l = { approved: 'Disetujui', pending: 'Menunggu', rejected: 'Ditolak' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[s]}`}>{l[s]}</span>
}

const columns = [
  { key: 'santri_name', label: 'Santri', sortable: true },
  { key: 'type', label: 'Jenis' },
  { key: 'date_from', label: 'Dari' },
  { key: 'date_to', label: 'Sampai' },
  { key: 'reason', label: 'Alasan' },
  { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
]

export default function PerizinanPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Perizinan Santri</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Kelola permohonan izin santri</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>
      <DataTable columns={columns} data={data} page={1} totalPages={1} />
    </div>
  )
}
