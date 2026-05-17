import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GALLERY_IMAGES } from '../../constants/data'
import SectionHeading from '../ui/SectionHeading'

export default function Gallery() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [selected, setSelected] = useState(null)

  return (
    <section id="galeri" className="py-24 lg:py-32 bg-canvas-soft">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Galeri Kegiatan"
          title="Momen Berharga di Tursina Alam"
          description="Dokumentasi kegiatan belajar mengajar, ekstrakurikuler, dan acara pondok pesantren."
        />

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
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
                  {img.category}
                </span>
                <p className="text-sm font-medium text-on-dark">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-6 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selected.src}
              alt={selected.alt}
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
