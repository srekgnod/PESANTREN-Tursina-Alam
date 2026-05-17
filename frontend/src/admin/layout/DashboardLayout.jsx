import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useUIStore } from '../../stores/uiStore'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

export default function DashboardLayout() {
  const { darkMode, sidebarOpen } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className={`min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] transition-colors duration-300`}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          style: {
            background: darkMode ? '#1c1c1c' : '#fff',
            color: darkMode ? '#e5e5e5' : '#171717',
            border: `1px solid ${darkMode ? '#2a2a2a' : '#ededed'}`,
          },
        }}
      />
      <Sidebar />
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]'
        }`}
      >
        <Topbar />
        <main className="p-4 lg:p-6 mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
