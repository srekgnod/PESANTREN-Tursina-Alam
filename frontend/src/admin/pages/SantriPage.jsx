import { useState } from 'react'
import { motion } from 'framer-motion'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import {
  HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash,
  HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineQrCode, HiOutlineArrowDownTray,
} from 'react-icons/hi2'
import toast from 'react-hot-toast'

const dummySantri = [
  { id: '1', nis: '2026001', full_name: 'Muhammad Abdullah', gender: 'L', class: '7A', dormitory: 'Al-Fatih', status: 'active', parent_name: 'Bapak Hasan', parent_phone: '081200000005', entry_year: 2026 },
  { id: '2', nis: '2026002', full_name: 'Aisyah Zahra', gender: 'P', class: '7A', dormitory: 'Khadijah', status: 'active', parent_name: 'Ibu Fatimah', parent_phone: '081200000006', entry_year: 2026 },
  { id: '3', nis: '2026003', full_name: 'Umar Faruq', gender: 'L', class: '7B', dormitory: 'Al-Fatih', status: 'active', parent_name: 'Bapak Ibrahim', parent_phone: '081200000007', entry_year: 2026 },
  { id: '4', nis: '2025001', full_name: 'Khadijah Nur', gender: 'P', class: '8A', dormitory: 'Khadijah', status: 'active', parent_name: 'Ibu Siti', parent_phone: '081200000008', entry_year: 2025 },
  { id: '5', nis: '2025002', full_name: 'Ali Imran', gender: 'L', class: '8B', dormitory: 'Al-Fatih', status: 'active', parent_name: 'Bapak Yusuf', parent_phone: '081200000009', entry_year: 2025 },
]

const statusBadge = (status) => {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    alumni: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    dropped: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  }
  const label = { active: 'Aktif', alumni: 'Alumni', dropped: 'Keluar' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.active}`}>{label[status] || status}</span>
}

export default function SantriPage() {
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSantri, setSelectedSantri] = useState(null)

  const filteredData = dummySantri.filter((s) => {
    const matchSearch = !search || s.full_name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
    const matchClass = !filterClass || s.class === filterClass
    return matchSearch && matchClass
  })

  const columns = [
    { key: 'nis', label: 'NIS', sortable: true },
    { key: 'full_name', label: 'Nama Lengkap', sortable: true, render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">{val.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{val}</p>
          <p className="text-xs text-[#9a9a9a]">{row.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
        </div>
      </div>
    )},
    { key: 'class', label: 'Kelas', sortable: true },
    { key: 'dormitory', label: 'Asrama' },
    { key: 'parent_name', label: 'Wali' },
    { key: 'status', label: 'Status', render: (val) => statusBadge(val) },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => { setSelectedSantri(row); setModalOpen(true); }} className="p-1.5 rounded-md hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#9a9a9a] hover:text-emerald-600 transition-colors">
          <HiOutlinePencilSquare className="w-4 h-4" />
        </button>
        <button onClick={() => toast.success(`QR Code: ${row.nis}`)} className="p-1.5 rounded-md hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#9a9a9a] hover:text-blue-600 transition-colors">
          <HiOutlineQrCode className="w-4 h-4" />
        </button>
        <button onClick={() => toast.error('Santri dihapus (demo)')} className="p-1.5 rounded-md hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#9a9a9a] hover:text-rose-500 transition-colors">
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>
    )},
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl font-bold text-[#171717] dark:text-white">Manajemen Santri</h1>
          <p className="text-sm text-[#9a9a9a] mt-0.5">{filteredData.length} santri terdaftar</p>
        </motion.div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#707070] dark:text-[#9a9a9a] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors">
            <HiOutlineArrowDownTray className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => { setSelectedSantri(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> Tambah Santri
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIS..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white placeholder:text-[#b2b2b2] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
          />
        </div>
        <div className="relative">
          <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="pl-10 pr-8 py-2 text-sm bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">Semua Kelas</option>
            <option value="7A">Kelas 7A</option>
            <option value="7B">Kelas 7B</option>
            <option value="8A">Kelas 8A</option>
            <option value="8B">Kelas 8B</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} page={1} totalPages={1} />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedSantri ? 'Edit Santri' : 'Tambah Santri Baru'} size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); toast.success(selectedSantri ? 'Santri diupdate' : 'Santri ditambahkan'); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="NIS" defaultValue={selectedSantri?.nis} required />
            <FormField label="Nama Lengkap" defaultValue={selectedSantri?.full_name} required />
            <FormSelect label="Jenis Kelamin" defaultValue={selectedSantri?.gender} options={[{v:'L',l:'Laki-laki'},{v:'P',l:'Perempuan'}]} required />
            <FormField label="Tanggal Lahir" type="date" />
            <FormField label="Kelas" defaultValue={selectedSantri?.class} />
            <FormField label="Asrama" defaultValue={selectedSantri?.dormitory} />
            <FormField label="Nama Wali" defaultValue={selectedSantri?.parent_name} required />
            <FormField label="No. HP Wali" defaultValue={selectedSantri?.parent_phone} required />
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

function FormField({ label, type = 'text', defaultValue, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} required={required} className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
    </div>
  )
}

function FormSelect({ label, options, defaultValue, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">{label}</label>
      <select defaultValue={defaultValue} required={required} className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none">
        <option value="">Pilih...</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}
