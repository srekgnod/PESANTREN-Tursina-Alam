import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Profile pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProgramPage from './pages/ProgramPage'
import GalleryPage from './pages/GalleryPage'
import NewsPage from './pages/NewsPage'
import DigitalSystemPage from './pages/DigitalSystemPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'

// Admin pages (lazy loaded)
const DashboardLayout = lazy(() => import('./admin/layout/DashboardLayout'))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'))
const SantriPage = lazy(() => import('./admin/pages/SantriPage'))
const PengurusPage = lazy(() => import('./admin/pages/PengurusPage'))
const AbsensiPage = lazy(() => import('./admin/pages/AbsensiPage'))
const PembayaranPage = lazy(() => import('./admin/pages/PembayaranPage'))
const PerizinanPage = lazy(() => import('./admin/pages/PerizinanPage'))
const PengumumanPage = lazy(() => import('./admin/pages/PengumumanPage'))
const PPDBPage = lazy(() => import('./admin/pages/PPDBPage'))
const LaporanPage = lazy(() => import('./admin/pages/LaporanPage'))
const SettingsPage = lazy(() => import('./admin/pages/SettingsPage'))

// Wali Portal pages (lazy loaded)
const WaliLayout = lazy(() => import('./wali/layout/WaliLayout'))
const WaliDashboard = lazy(() => import('./wali/pages/WaliDashboard'))
const WaliAbsensi = lazy(() => import('./wali/pages/WaliAbsensi'))
const WaliPembayaran = lazy(() => import('./wali/pages/WaliPembayaran'))
const WaliPerizinan = lazy(() => import('./wali/pages/WaliPerizinan'))
const WaliPengumuman = lazy(() => import('./wali/pages/WaliPengumuman'))
const WaliNotifikasi = lazy(() => import('./wali/pages/WaliNotifikasi'))
const WaliProfil = lazy(() => import('./wali/pages/WaliProfil'))

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0f0f0f]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 animate-pulse" />
        <p className="text-sm text-[#9a9a9a]">Loading...</p>
      </div>
    </div>
  )
}

const S = ({ children }) => <Suspense fallback={<Loader />}>{children}</Suspense>

export default function App() {
  return (
    <Routes>
      {/* Public Profile Website */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/sistem-digital" element={<DigitalSystemPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={<S><DashboardLayout /></S>}>
        <Route index element={<S><DashboardPage /></S>} />
        <Route path="santri" element={<S><SantriPage /></S>} />
        <Route path="pengurus" element={<S><PengurusPage /></S>} />
        <Route path="absensi" element={<S><AbsensiPage /></S>} />
        <Route path="pembayaran" element={<S><PembayaranPage /></S>} />
        <Route path="perizinan" element={<S><PerizinanPage /></S>} />
        <Route path="pengumuman" element={<S><PengumumanPage /></S>} />
        <Route path="ppdb" element={<S><PPDBPage /></S>} />
        <Route path="laporan" element={<S><LaporanPage /></S>} />
        <Route path="settings" element={<S><SettingsPage /></S>} />
      </Route>

      {/* Wali Santri Portal */}
      <Route path="/wali" element={<S><WaliLayout /></S>}>
        <Route index element={<S><WaliDashboard /></S>} />
        <Route path="absensi" element={<S><WaliAbsensi /></S>} />
        <Route path="pembayaran" element={<S><WaliPembayaran /></S>} />
        <Route path="perizinan" element={<S><WaliPerizinan /></S>} />
        <Route path="pengumuman" element={<S><WaliPengumuman /></S>} />
        <Route path="notifikasi" element={<S><WaliNotifikasi /></S>} />
        <Route path="profil" element={<S><WaliProfil /></S>} />
      </Route>
    </Routes>
  )
}
