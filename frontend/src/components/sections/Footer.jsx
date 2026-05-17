import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2'
import { FOOTER_LINKS } from '../../constants/data'

export default function Footer() {
  return (
    <footer id="kontak" className="bg-canvas border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand column — spans 2 */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-on-primary font-bold text-lg">TA</span>
              </div>
              <div>
                <span className="text-ink font-semibold text-base tracking-tight block">Tursina Alam</span>
                <span className="text-[11px] text-ink-mute tracking-wide">PONDOK PESANTREN</span>
              </div>
            </div>
            <p className="text-sm text-ink-mute leading-relaxed mb-6 max-w-xs">
              Pesantren modern berbasis teknologi digital — membentuk generasi Qurani yang berakhlak mulia dan berwawasan global.
            </p>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2.5 text-sm text-ink-mute hover:text-ink transition-colors">
                <HiOutlineMapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Jl. Pesantren No. 1, Kota, Provinsi</span>
              </a>
              <a href="tel:+6281234567890" className="flex items-center gap-2.5 text-sm text-ink-mute hover:text-ink transition-colors">
                <HiOutlinePhone className="w-4 h-4 text-primary shrink-0" />
                <span>+62 812-3456-7890</span>
              </a>
              <a href="mailto:info@tursinaalam.sch.id" className="flex items-center gap-2.5 text-sm text-ink-mute hover:text-ink transition-colors">
                <HiOutlineEnvelope className="w-4 h-4 text-primary shrink-0" />
                <span>info@tursinaalam.sch.id</span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-ink-mute hover:text-ink transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-mute">
            © {new Date().getFullYear()} Pondok Pesantren Tursina Alam. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Instagram', 'YouTube', 'Facebook', 'WhatsApp'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-ink-mute hover:text-primary-deep transition-colors font-medium"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
