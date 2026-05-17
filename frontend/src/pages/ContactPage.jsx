import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope,
  HiOutlineClock, HiOutlineChevronDown,
} from 'react-icons/hi2'
import PageHero from '../components/ui/PageHero'
import Button from '../components/ui/Button'

const contactInfo = [
  { icon: HiOutlineMapPin, label: 'Alamat', value: 'Jl. Pesantren No. 1, Kecamatan, Kota, Provinsi 12345' },
  { icon: HiOutlinePhone, label: 'Telepon', value: '+62 812-3456-7890', href: 'tel:+6281234567890' },
  { icon: HiOutlineEnvelope, label: 'Email', value: 'info@tursinaalam.sch.id', href: 'mailto:info@tursinaalam.sch.id' },
  { icon: HiOutlineClock, label: 'Jam Operasional', value: 'Senin - Sabtu, 08:00 - 16:00 WIB' },
]

const faqs = [
  { q: 'Bagaimana cara mendaftar sebagai santri baru?', a: 'Pendaftaran santri baru dilakukan melalui sistem PPDB Online di website kami. Kunjungi halaman Sistem Digital untuk mengakses formulir pendaftaran, upload berkas, dan tracking status pendaftaran Anda.' },
  { q: 'Apa saja program pendidikan yang tersedia?', a: 'Kami menyediakan program Tahfidz Al-Quran 30 Juz, Bahasa Arab & Inggris, Kajian Kitab Kuning, Pendidikan Formal (MTs & MA) dengan Kurikulum Merdeka, serta berbagai kegiatan ekstrakurikuler.' },
  { q: 'Bagaimana cara mengakses Portal Wali Santri?', a: 'Portal Wali Santri dapat diakses melalui halaman Login di website kami. Akun akan diberikan saat santri resmi diterima. Melalui portal ini, wali dapat memantau nilai, hafalan, absensi, dan pembayaran.' },
  { q: 'Apakah tersedia beasiswa?', a: 'Ya, kami menyediakan beasiswa prestasi akademik, beasiswa tahfidz, dan beasiswa dhuafa. Informasi lebih lanjut dapat dilihat saat proses pendaftaran PPDB Online.' },
  { q: 'Bagaimana sistem pembayaran SPP?', a: 'Pembayaran SPP dilakukan secara digital melalui sistem kami dengan berbagai metode: transfer bank, virtual account, dan e-wallet. Status pembayaran dapat dipantau melalui Portal Wali Santri.' },
]

export default function ContactPage() {
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.')
  }

  return (
    <>
      <PageHero
        label="Hubungi Kami"
        title="Kami Siap Membantu Anda"
        description="Jangan ragu untuk menghubungi kami. Tim kami siap menjawab pertanyaan dan memberikan informasi yang Anda butuhkan."
      />

      {/* Contact Info + Form */}
      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={formRef} className="grid lg:grid-cols-[1fr_1.5fr] gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-display-md text-ink mb-6">Informasi Kontak</h2>
              <div className="space-y-6 mb-8">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5 text-primary-deep" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-ink-mute uppercase tracking-wider mb-1">{c.label}</div>
                      {c.href ? (
                        <a href={c.href} className="text-sm text-ink hover:text-primary-deep transition-colors">{c.value}</a>
                      ) : (
                        <p className="text-sm text-ink">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Ikuti Kami</h3>
                <div className="flex gap-2">
                  {['Instagram', 'YouTube', 'Facebook', 'WhatsApp'].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-canvas-soft text-ink-mute hover:bg-primary/10 hover:text-primary-deep transition-colors"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="p-8 rounded-2xl border border-hairline bg-canvas">
                <h2 className="text-display-md text-ink mb-2">Kirim Pesan</h2>
                <p className="text-sm text-ink-mute mb-8">Isi formulir di bawah dan kami akan menghubungi Anda.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">Nama Lengkap</label>
                      <input type="text" required className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="Masukkan nama" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">No. WhatsApp</label>
                      <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="08xx-xxxx-xxxx" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">Email</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="email@contoh.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">Subjek</label>
                    <select required className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors">
                      <option value="">Pilih subjek</option>
                      <option>Informasi Pendaftaran</option>
                      <option>Program Pendidikan</option>
                      <option>Sistem Digital</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-mute uppercase tracking-wider mb-2">Pesan</label>
                    <textarea required rows={4} className="w-full px-4 py-3 rounded-lg border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none" placeholder="Tulis pesan Anda..." />
                  </div>
                  <Button type="submit" size="lg" className="w-full justify-center">
                    Kirim Pesan
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="rounded-2xl overflow-hidden border border-hairline h-[400px]">
            <iframe
              title="Lokasi Pondok Pesantren Tursina Alam"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6665!2d106.8272!3d-6.1751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTAnMzAuNCJTIDEwNsKwNDknMzcuOSJF!5e0!3m2!1sid!2sid!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary-deep">FAQ</span>
            <h2 className="text-display-xl text-ink">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div ref={faqRef} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border border-hairline overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-canvas-soft transition-colors"
                >
                  <span className="text-sm font-medium text-ink pr-4">{faq.q}</span>
                  <HiOutlineChevronDown className={`w-5 h-5 text-ink-mute shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-ink-mute leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
