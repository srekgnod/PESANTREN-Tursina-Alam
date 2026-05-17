import { motion } from 'framer-motion'
import { HiOutlineArrowDownTray, HiOutlineDocumentText } from 'react-icons/hi2'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

const revenueMonthly = [
  { name: 'Jan', spp: 150, lain: 30 }, { name: 'Feb', spp: 155, lain: 40 },
  { name: 'Mar', spp: 160, lain: 50 }, { name: 'Apr', spp: 170, lain: 55 },
  { name: 'Mei', spp: 180, lain: 65 }, { name: 'Jun', spp: 185, lain: 60 },
]

const attendanceMonthly = [
  { name: 'Jan', rate: 92 }, { name: 'Feb', rate: 89 }, { name: 'Mar', rate: 91 },
  { name: 'Apr', rate: 93 }, { name: 'Mei', rate: 87 }, { name: 'Jun', rate: 86 },
]

const reportTypes = [
  { title: 'Laporan Keuangan', desc: 'Rekap pembayaran SPP & biaya lainnya', icon: HiOutlineDocumentText },
  { title: 'Laporan Absensi', desc: 'Rekap kehadiran per bulan/semester', icon: HiOutlineDocumentText },
  { title: 'Laporan Santri', desc: 'Data santri aktif, alumni, keluar', icon: HiOutlineDocumentText },
  { title: 'Laporan PPDB', desc: 'Statistik pendaftaran per tahun', icon: HiOutlineDocumentText },
]

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-[#171717] dark:text-white">Laporan & Analytics</h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">Ringkasan data dan export laporan</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Pendapatan Bulanan (Juta Rp)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="spp" fill="#3ecf8e" radius={[4, 4, 0, 0]} name="SPP" />
              <Bar dataKey="lain" fill="#644fc1" radius={[4, 4, 0, 0]} name="Lainnya" />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mb-4">Tingkat Kehadiran (%)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={attendanceMonthly}>
              <defs>
                <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#054cff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#054cff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ededed" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: '#9a9a9a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ededed', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="rate" stroke="#054cff" strokeWidth={2} fill="url(#attendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportTypes.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5 flex items-center justify-between hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <r.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#171717] dark:text-white">{r.title}</h4>
                <p className="text-xs text-[#9a9a9a] mt-0.5">{r.desc}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#ededed] dark:border-[#2a2a2a] rounded-lg text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] transition-colors">
              <HiOutlineArrowDownTray className="w-3.5 h-3.5" /> Export
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
