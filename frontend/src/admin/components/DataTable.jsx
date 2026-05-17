import { motion } from 'framer-motion'
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineChevronUpDown } from 'react-icons/hi2'

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSort,
  sortKey,
  sortOrder,
  emptyMessage = 'Belum ada data',
}) {
  if (loading) return <TableSkeleton columns={columns.length} />

  return (
    <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#ededed] dark:border-[#2a2a2a]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] dark:text-[#707070] ${col.sortable ? 'cursor-pointer hover:text-[#171717] dark:hover:text-white select-none' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <HiOutlineChevronUpDown className={`w-3.5 h-3.5 ${sortKey === col.key ? 'text-emerald-500' : ''}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ededed] dark:divide-[#2a2a2a]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-[#9a9a9a]">{emptyMessage}</td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#fafafa] dark:hover:bg-[#1c1c1c] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-[#171717] dark:text-[#e5e5e5] ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#ededed] dark:border-[#2a2a2a]">
          <p className="text-xs text-[#9a9a9a]">Halaman {page} dari {totalPages}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-md border border-[#ededed] dark:border-[#2a2a2a] text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md border border-[#ededed] dark:border-[#2a2a2a] text-[#707070] hover:bg-[#f5f5f5] dark:hover:bg-[#1c1c1c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TableSkeleton({ columns = 5 }) {
  return (
    <div className="bg-white dark:bg-[#141414] border border-[#ededed] dark:border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="border-b border-[#ededed] dark:border-[#2a2a2a] px-4 py-3 flex gap-8">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-3 bg-[#ededed] dark:bg-[#2a2a2a] rounded w-20 animate-pulse" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-4 py-4 flex gap-8 border-b border-[#ededed] dark:border-[#2a2a2a] last:border-0">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-3 bg-[#f5f5f5] dark:bg-[#1c1c1c] rounded animate-pulse" style={{ width: `${60 + Math.random() * 60}px` }} />
          ))}
        </div>
      ))}
    </div>
  )
}
