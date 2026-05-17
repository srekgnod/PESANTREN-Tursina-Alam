import { motion } from 'framer-motion'
import DataTable from '../components/DataTable'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import StatsCard from '../components/StatsCard'

const data = [
  { id: '1', nip: 'P001', full_name: 'Ust. Ahmad Fauzi', position: 'Wakil Kepala', phone: '081200000003', is_active: true },
  { id: '2', nip: 'P002', full_name: 'Ust. Muhammad Rizki', position: 'Pengajar Tahfidz', phone: '081200000004', is_active: true },
  { id: '3', nip: 'P003', full_name: 'Ustdzh. Siti Aminah', position: 'Pengajar Bahasa Arab', phone: '081200000010', is_active: true },
  { id: '4', nip: 'P004', full_name: 'Ust. Farhan Hakim', position: 'Pembina Asrama', phone: '081200000011', is_active: true },
  { id: '5', nip: 'P005', full_name: 'Ust. Bilal Ramadhan', position: 'Kepala Pondok', phone: '081200000012', is_active: true },
]

const columns = [
  { key: 'nip', label: 'NIP', sortable: true },
  { key: 'full_name', label: 'Nama Lengkap', sortable: true, render: (v) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-bold">{v.charAt(0)}</span>
      </div>
      <span className="font-medium">{v}</span>
    </div>
  )},
  { key: 'position', label: 'Jabatan', sortable: true },
  { key: 'phone', label: 'Telepon' },
  { key: 'is_active', label: 'Status', render: (v) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700'}`}>{v ? 'Aktif' : 'Nonaktif'}</span> },
]

export default function PengurusPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Manajemen Pengurus</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Data ustadz dan tenaga pengajar pondok</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Total Pengurus" value="38" icon={HiOutlineUserGroup} color="violet" index={0} />
        <StatsCard label="Ustadz Aktif" value="30" icon={HiOutlineUserGroup} color="emerald" index={1} />
        <StatsCard label="Tenaga Admin" value="8" icon={HiOutlineUserGroup} color="blue" index={2} />
      </div>
      <DataTable columns={columns} data={data} page={1} totalPages={1} />
    </div>
  )
}
