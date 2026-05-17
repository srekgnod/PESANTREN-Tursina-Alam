import { motion } from 'framer-motion'
import DataTable from '../../admin/components/DataTable'
import StatsCard from '../../admin/components/StatsCard'
import { HiOutlineBanknotes, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle, HiOutlineArrowDownTray } from 'react-icons/hi2'

const stats = [
  { label: 'Total Tagihan', value: 'Rp 9 Jt', icon: HiOutlineBanknotes, color: 'emerald' },
  { label: 'Lunas', value: 'Rp 7.5 Jt', icon: HiOutlineCheckCircle, color: 'blue' },
  { label: 'Menunggu', value: 'Rp 750 Rb', icon: HiOutlineClock, color: 'amber' },
  { label: 'Tertunggak', value: 'Rp 750 Rb', icon: HiOutlineExclamationTriangle, color: 'rose' },
]

const payments = [
  { id: '1', invoice: 'INV-20260601-a1b2', type: 'SPP', period: 'Jun 2026', amount: 750000, status: 'pending', due: '2026-06-15' },
  { id: '2', invoice: 'INV-20260501-c3d4', type: 'SPP', period: 'Mei 2026', amount: 750000, status: 'overdue', due: '2026-05-15' },
  { id: '3', invoice: 'INV-20260401-e5f6', type: 'SPP', period: 'Apr 2026', amount: 750000, status: 'paid', due: '2026-04-15' },
  { id: '4', invoice: 'INV-20260301-g7h8', type: 'SPP', period: 'Mar 2026', amount: 750000, status: 'paid', due: '2026-03-15' },
]

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const statusBadge = (s) => {
  const m = { paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' }
  const l = { paid: 'Lunas', pending: 'Menunggu', overdue: 'Tertunggak' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[s]}`}>{l[s]}</span>
}

const columns = [
  { key: 'invoice', label: 'Invoice', render: (v) => <span className="font-mono text-xs">{v}</span> },
  { key: 'type', label: 'Jenis' },
  { key: 'period', label: 'Periode' },
  { key: 'amount', label: 'Jumlah', render: (v) => <span className="font-medium">{fmt(v)}</span> },
  { key: 'due', label: 'Jatuh Tempo' },
  { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
]

export default function WaliPembayaran() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Pembayaran</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Riwayat pembayaran Muhammad Abdullah</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatsCard key={s.label} {...s} index={i} />)}
      </div>
      <DataTable columns={columns} data={payments} page={1} totalPages={1} />
    </div>
  )
}
