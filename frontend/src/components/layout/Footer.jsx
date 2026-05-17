import { Link } from 'react-router-dom'
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2'

const FOOTER_LINKS = {
  'Tentang Kami': [
    { label: 'Sejarah', to: '/tentang' },
    { label: 'Visi & Misi', to: '/tentang' },
    { label: 'Struktur Organisasi', to: '/tentang' },
    { label: 'Tenaga Pengajar', to: '/tentang' },
  ],
  'Program': [
    { label: 'Tahfidz', to: '/program' },
    { label: 'Bahasa Arab & Inggris', to: '/program' },
    { label: 'Pendidikan Formal', to: '/program' },
    { label: 'Ekstrakurikuler', to: '/program' },
  ],
  'Layanan Digital': [
    { label: 'Portal Wali Santri', to: '/login' },
    { label: 'PPDB Online', to: '/sistem-digital' },
    { label: 'Pembayaran Online', to: '/sistem-digital' },
    { label: 'Login Sistem', to: '/login' },
  ],
  'Informasi': [
    { label: 'Berita & Pengumuman', to: '/berita' },
    { label: 'Galeri Kegiatan', to: '/galeri' },
    { label: 'FAQ', to: '/kontak' },
    { label: 'Hubungi Kami', to: '/kontak' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-canvas border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-on-primary font-bold text-lg">TA</span>
              </div>
              <div>
                <span className="text-ink font-semibold text-base tracking-tight block">Tursina Alam</span>
                <span className="text-[11px] text-ink-mute tracking-wide">PONDOK PESANTREN</span>
              </div>
            </Link>
            <p className="text-sm text-ink-mute leading-relaxed mb-6 max-w-xs">
              Pesantren modern berbasis teknologi digital — membentuk generasi Qurani yang berakhlak mulia dan berwawasan global.
            </p>
            <div className="space-y-3">
              <span className="flex items-center gap-2.5 text-sm text-ink-mute">
                <HiOutlineMapPin className="w-4 h-4 text-primary shrink-0" />
                Jl. Pesantren No. 1, Kota, Provinsi
              </span>
              <a href="tel:+6281234567890" className="flex items-center gap-2.5 text-sm text-ink-mute hover:text-ink transition-colors">
                <HiOutlinePhone className="w-4 h-4 text-primary shrink-0" />
                +62 812-3456-7890
              </a>
              <a href="mailto:info@tursinaalam.sch.id" className="flex items-center gap-2.5 text-sm text-ink-mute hover:text-ink transition-colors">
                <HiOutlineEnvelope className="w-4 h-4 text-primary shrink-0" />
                info@tursinaalam.sch.id
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-mute hover:text-ink transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-mute">
            &copy; {new Date().getFullYear()} Pondok Pesantren Tursina Alam. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Instagram', 'YouTube', 'Facebook', 'WhatsApp'].map((s) => (
              <a key={s} href="#" className="text-xs text-ink-mute hover:text-primary-deep transition-colors font-medium">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
