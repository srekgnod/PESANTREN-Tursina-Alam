import { motion } from 'framer-motion'

export default function StatsCard({ label, value, icon: Icon, change, changeType = 'up', color = 'emerald', index = 0 }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-500', ring: 'ring-emerald-500/20' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'text-blue-500', ring: 'ring-blue-500/20' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-500/10', icon: 'text-amber-500', ring: 'ring-amber-500/20' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-500/10', icon: 'text-rose-500', ring: 'ring-rose-500/20' },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-500/10', icon: 'text-violet-500', ring: 'ring-violet-500/20' },
    teal:    { bg: 'bg-teal-50 dark:bg-teal-500/10', icon: 'text-teal-500', ring: 'ring-teal-500/20' },
  }

  const c = colorMap[color] || colorMap.emerald

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#9a9a9a] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#171717] dark:text-white mt-1.5">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-2 ${changeType === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              {changeType === 'up' ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
        </div>
      </div>
    </motion.div>
  )
}

// Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-[#ededed] dark:bg-[#2a2a2a] rounded animate-pulse" />
          <div className="h-7 w-24 bg-[#ededed] dark:bg-[#2a2a2a] rounded animate-pulse" />
          <div className="h-3 w-14 bg-[#ededed] dark:bg-[#2a2a2a] rounded animate-pulse" />
        </div>
        <div className="w-10 h-10 bg-[#ededed] dark:bg-[#2a2a2a] rounded-xl animate-pulse" />
      </div>
    </div>
  )
}
