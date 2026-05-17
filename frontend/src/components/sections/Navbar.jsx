import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2'
import { NAV_LINKS } from '../../constants/data'
import Button from '../ui/Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-canvas/90 backdrop-blur-xl border-b border-hairline shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-on-primary font-bold text-lg">TA</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-ink font-semibold text-base tracking-tight">
                  Tursina Alam
                </span>
                <span className="block text-[11px] text-ink-mute -mt-0.5 tracking-wide">
                  PONDOK PESANTREN
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-ink-mute hover:text-ink transition-colors duration-200 rounded-md hover:bg-canvas-soft"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="#"
                className="text-sm font-medium text-ink-mute hover:text-ink transition-colors duration-200"
              >
                Portal Wali
              </a>
              <Button size="sm" href="#">
                Login Sistem
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-ink hover:bg-canvas-soft transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <HiOutlineXMark className="w-6 h-6" />
              ) : (
                <HiOutlineBars3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-0 right-0 w-[300px] h-full bg-canvas shadow-xl border-l border-hairline"
            >
              <div className="pt-20 px-6">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-base font-medium text-ink-mute hover:text-ink hover:bg-canvas-soft rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-hairline flex flex-col gap-3">
                  <Button variant="secondary" href="#" className="w-full justify-center">
                    Portal Wali
                  </Button>
                  <Button href="#" className="w-full justify-center">
                    Login Sistem
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
