import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from '../../admin/components/Modal'
import { HiOutlinePlus } from 'react-icons/hi2'
import toast from 'react-hot-toast'

const leaves = [
  { id: '1', type: 'Pulang', date_from: '2026-06-10', date_to: '2026-06-12', reason: 'Acara keluarga', status: 'approved' },
  { id: '2', type: 'Sakit', date_from: '2026-05-20', date_to: '2026-05-21', reason: 'Demam', status: 'completed' },
  { id: '3', type: 'Keperluan', date_from: '2026-04-15', date_to: '2026-04-15', reason: 'Tes masuk SMA', status: 'rejected' },
]

const statusStyle = { approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400', completed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' }
const statusLabel = { approved: 'Disetujui', pending: 'Menunggu', rejected: 'Ditolak', completed: 'Selesai' }

export default function WaliPerizinan() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-[#171717] dark:text-white">Perizinan</h1>
          <p className="text-sm text-[#9a9a9a] mt-0.5">Riwayat perizinan Muhammad Abdullah</p>
        </motion.div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> Ajukan Izin
        </button>
      </div>

      <div className="space-y-3">
        {leaves.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#171717] dark:text-white">{l.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[l.status]}`}>{statusLabel[l.status]}</span>
                </div>
                <p className="text-sm text-[#707070] dark:text-[#9a9a9a]">{l.reason}</p>
                <p className="text-xs text-[#b2b2b2] mt-1">{l.date_from} s/d {l.date_to}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Ajukan Perizinan">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); toast.success('Perizinan berhasil diajukan'); }}>
          <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Jenis Izin</label>
            <select className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 appearance-none">
              <option value="pulang">Pulang</option><option value="sakit">Sakit</option><option value="keperluan">Keperluan</option><option value="lainnya">Lainnya</option>
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Dari Tanggal</label><input type="date" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
            <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Sampai Tanggal</label><input type="date" className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
          </div>
          <div><label className="block text-xs font-medium text-[#707070] dark:text-[#9a9a9a] mb-1.5">Alasan</label><textarea rows={3} className="w-full px-3 py-2 text-sm bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#171717] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">Ajukan</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
