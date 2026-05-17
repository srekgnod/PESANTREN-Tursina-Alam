import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../components/Modal'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineMegaphone } from 'react-icons/hi2'
import toast from 'react-hot-toast'

const announcements = [
  { id: '1', title: 'Pendaftaran Santri Baru T.A. 2026/2027', category: 'ppdb', is_public: true, created_at: '2026-06-01', author: 'Admin' },
  { id: '2', title: 'Jadwal Ujian Akhir Semester Genap', category: 'akademik', is_public: true, created_at: '2026-05-28', author: 'Admin' },
  { id: '3', title: 'Workshop Teknologi Digital', category: 'umum', is_public: true, created_at: '2026-05-25', author: 'Admin' },
  { id: '4', title: 'Pembayaran SPP Bulan Juni', category: 'keuangan', is_public: false, created_at: '2026-05-20', author: 'Admin' },
]

const catColors = { ppdb: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400', akademik: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', umum: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', keuangan: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' }

export default function PengumumanPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl font-bold text-[#171717] dark:text-white">Pengumuman</h1>
          <p className="text-sm text-[#9a9a9a] mt-0.5">Kelola pengumuman pondok pesantren</p>
        </motion.div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          <HiOutlinePlus className="w-4 h-4" /> Buat Pengumuman
        </button>
      </div>

      <div className="grid gap-4">
        {announcements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <HiOutlineMegaphone className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#171717] dark:text-white">{a.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${catColors[a.category]}`}>{a.category}</span>
                    <span className="text-xs text-[#b2b2b2]">{a.created_at}</span>
                    <span className="text-xs text-[#b2b2b2]">oleh {a.author}</span>
                    {!a.is_public && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5f5f5] dark:bg-[#2a2a2a] text-[#9a9a9a]">Internal</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-md hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#9a9a9a] hover:text-emerald-600 transition-colors"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                <button onClick={() => toast.error('Pengumuman dihapus')} className="p-1.5 rounded-md hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] text-[#9a9a9a] hover:text-rose-500 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Buat Pengumuman" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); toast.success('Pengumuman dipublikasikan'); }}>
          <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Judul</label><input className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
          <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Konten</label><textarea rows={5} className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none" /></div>
          <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Kategori</label><select className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none"><option value="umum">Umum</option><option value="akademik">Akademik</option><option value="keuangan">Keuangan</option><option value="ppdb">PPDB</option></select></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Publikasikan</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
