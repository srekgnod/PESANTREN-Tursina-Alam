import { motion } from 'framer-motion'

const notifs = [
  { id: 1, title: 'Pembayaran SPP Juni menunggu', type: 'payment', time: '2 jam lalu', unread: true },
  { id: 2, title: 'Anak Anda hadir tepat waktu hari ini', type: 'attendance', time: '5 jam lalu', unread: true },
  { id: 3, title: 'Pengumuman: Jadwal Ujian Akhir Semester', type: 'announcement', time: '1 hari lalu', unread: false },
  { id: 4, title: 'Perizinan sakit telah disetujui', type: 'permission', time: '3 hari lalu', unread: false },
  { id: 5, title: 'Pembayaran SPP Mei tertunggak', type: 'payment', time: '1 minggu lalu', unread: false },
]

const typeColors = { payment: 'bg-amber-500', attendance: 'bg-emerald-500', announcement: 'bg-blue-500', permission: 'bg-violet-500' }

export default function WaliNotifikasi() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Notifikasi</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Pusat notifikasi</p>
      </motion.div>
      <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl overflow-hidden">
        {notifs.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className={`flex items-start gap-3 px-5 py-4 border-b border-[#ededed] dark:border-[#2a2a2a] last:border-0 hover:bg-[#fafafa] dark:hover:bg-[#1c1c1c] transition-colors ${n.unread ? '' : 'opacity-60'}`}>
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${typeColors[n.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#171717] dark:text-white">{n.title}</p>
              <p className="text-xs text-[#b2b2b2] mt-0.5">{n.time}</p>
            </div>
            {n.unread && <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
