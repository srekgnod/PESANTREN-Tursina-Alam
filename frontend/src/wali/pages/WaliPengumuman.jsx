import { motion } from 'framer-motion'
import { HiOutlineMegaphone } from 'react-icons/hi2'

const announcements = [
  { id: '1', title: 'Pendaftaran Santri Baru T.A. 2026/2027', category: 'ppdb', date: '2026-06-01', content: 'Pendaftaran dibuka melalui portal PPDB online.' },
  { id: '2', title: 'Jadwal Ujian Akhir Semester Genap', category: 'akademik', date: '2026-05-28', content: 'Ujian dilaksanakan 1-12 Juni 2026.' },
  { id: '3', title: 'Pembayaran SPP Bulan Juni', category: 'keuangan', date: '2026-05-25', content: 'Mohon segera melunasi SPP sebelum jatuh tempo.' },
  { id: '4', title: 'Libur Hari Raya Idul Adha', category: 'umum', date: '2026-05-20', content: 'Santri dipulangkan tanggal 15-20 Juni 2026.' },
]

const catColors = { ppdb: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400', akademik: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', keuangan: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', umum: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' }

export default function WaliPengumuman() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Pengumuman</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Informasi terbaru dari pondok</p>
      </motion.div>
      <div className="space-y-3">
        {announcements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <HiOutlineMegaphone className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-white">{a.title}</h3>
                <p className="text-sm text-[#707070] dark:text-[#9a9a9a] mt-1">{a.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${catColors[a.category]}`}>{a.category}</span>
                  <span className="text-xs text-[#b2b2b2]">{a.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
