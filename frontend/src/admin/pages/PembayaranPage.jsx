import { useState } from 'react'
import { motion } from 'framer-motion'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import StatsCard from '../components/StatsCard'
import { HiOutlineBanknotes, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle, HiOutlinePlus } from 'react-icons/hi2'
import toast from 'react-hot-toast'

const stats = [
  { label: 'Total Pendapatan', value: 'Rp 245.5 Jt', icon: HiOutlineBanknotes, color: 'emerald', change: '+18.2%' },
  { label: 'Lunas', value: '435', icon: HiOutlineCheckCircle, color: 'blue' },
  { label: 'Menunggu', value: '40', icon: HiOutlineClock, color: 'amber' },
  { label: 'Tertunggak', value: '12', icon: HiOutlineExclamationTriangle, color: 'rose' },
]

const payments = [
  { id: '1', invoice_number: 'INV-20260601-a1b2', santri_name: 'Muhammad Abdullah', type: 'SPP', amount: 750000, status: 'paid', period: '2026-06', paid_at: '2026-06-05' },
  { id: '2', invoice_number: 'INV-20260601-c3d4', santri_name: 'Aisyah Zahra', type: 'SPP', amount: 750000, status: 'pending', period: '2026-06', paid_at: null },
  { id: '3', invoice_number: 'INV-20260601-e5f6', santri_name: 'Umar Faruq', type: 'SPP', amount: 750000, status: 'overdue', period: '2026-05', paid_at: null },
  { id: '4', invoice_number: 'INV-20260601-g7h8', santri_name: 'Khadijah Nur', type: 'Seragam', amount: 350000, status: 'paid', period: '2026-06', paid_at: '2026-06-02' },
  { id: '5', invoice_number: 'INV-20260601-i9j0', santri_name: 'Ali Imran', type: 'Kitab', amount: 150000, status: 'pending', period: '2026-06', paid_at: null },
]

const statusBadge = (s) => {
  const m = { paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' }
  const l = { paid: 'Lunas', pending: 'Menunggu', overdue: 'Tertunggak' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m[s]}`}>{l[s]}</span>
}

const formatCurrency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export default function PembayaranPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const columns = [
    { key: 'invoice_number', label: 'Invoice', sortable: true, render: (v) => <span className="font-mono text-xs">{v}</span> },
    { key: 'santri_name', label: 'Santri', sortable: true },
    { key: 'type', label: 'Jenis', sortable: true },
    { key: 'amount', label: 'Jumlah', sortable: true, render: (v) => <span className="font-medium">{formatCurrency(v)}</span> },
    { key: 'period', label: 'Periode' },
    { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
    { key: 'actions', label: '', render: (_, row) => row.status !== 'paid' ? (
      <button onClick={() => toast.success('Pembayaran dikonfirmasi')} className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors">Konfirmasi</button>
    ) : <span className="text-xs text-[#b2b2b2]">{row.paid_at}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl font-bold text-[#171717] dark:text-white">Pembayaran</h1>
          <p className="text-sm text-[#9a9a9a] mt-0.5">Kelola tagihan dan konfirmasi pembayaran</p>
        </motion.div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          <HiOutlinePlus className="w-4 h-4" /> Buat Tagihan
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatsCard key={s.label} {...s} index={i} />)}
      </div>
      <DataTable columns={columns} data={payments} page={1} totalPages={1} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Buat Tagihan Baru">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); toast.success('Tagihan dibuat'); }}>
          <div className="space-y-3">
            <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Santri</label><select className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none"><option>Muhammad Abdullah</option><option>Aisyah Zahra</option></select></div>
            <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Jenis</label><select className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none"><option>SPP</option><option>Seragam</option><option>Kitab</option><option>Pendaftaran</option></select></div>
            <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Jumlah (Rp)</label><input type="number" placeholder="750000" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
            <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Jatuh Tempo</label><input type="date" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Simpan</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
