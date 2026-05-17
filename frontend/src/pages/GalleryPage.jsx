import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiOutlineXMark } from 'react-icons/hi2'
import PageHero from '../components/ui/PageHero'

const categories = ['Semua', 'Akademik', 'Ibadah', 'Ekstrakurikuler', 'Fasilitas', 'Acara']

const images = [
  { src: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop', alt: 'Kegiatan Tahfidz Al-Quran', cat: 'Akademik' },
  { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop', alt: 'Pembelajaran di Kelas', cat: 'Akademik' },
  { src: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=400&fit=crop', alt: 'Kegiatan Olahraga Santri', cat: 'Ekstrakurikuler' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop', alt: 'Wisuda Tahfidz 30 Juz', cat: 'Acara' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop', alt: 'Perpustakaan Pondok', cat: 'Fasilitas' },
  { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop', alt: 'Diskusi Kelompok Santri', cat: 'Akademik' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop', alt: 'Ruang Baca Santri', cat: 'Fasilitas' },
  { src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop', alt: 'Kegiatan Shalat Berjamaah', cat: 'Ibadah' },
  { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop', alt: 'Panahan Santri', cat: 'Ekstrakurikuler' },
  { src: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=600&h=400&fit=crop', alt: 'Kegiatan Upacara', cat: 'Acara' },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop', alt: 'Laboratorium Komputer', cat: 'Fasilitas' },
  { src: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&h=400&fit=crop', alt: 'Kegiatan Dzikir Bersama', cat: 'Ibadah' },
]

export default function GalleryPage() {
  const [active, setActive] = useState('Semua')
  const [selected, setSelected] = useState(null)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  const filtered = active === 'Semua' ? images : images.filter((img) => img.cat === active)

  return (
    <>
      <PageHero
        label="Galeri"
        title="Momen Berharga di Tursina Alam"
        description="Dokumentasi kegiatan ibadah, belajar mengajar, ekstrakurikuler, dan berbagai acara pondok pesantren."
      />

      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  active === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-canvas-soft text-ink-mute hover:text-ink hover:bg-hairline-cool'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          <div ref={ref} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelected(img)}
                  className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[4/3]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary text-on-primary uppercase tracking-wider mb-1">
                      {img.cat}
                    </span>
                    <p className="text-sm font-medium text-on-dark">{img.alt}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-6"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-canvas/10 hover:bg-canvas/20 flex items-center justify-center text-on-dark transition-colors cursor-pointer"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full"
            >
              <img src={selected.src} alt={selected.alt} className="w-full rounded-xl object-contain shadow-2xl" />
              <div className="text-center mt-4">
                <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary text-on-primary uppercase tracking-wider mr-2">
                  {selected.cat}
                </span>
                <span className="text-sm text-on-dark/80">{selected.alt}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
