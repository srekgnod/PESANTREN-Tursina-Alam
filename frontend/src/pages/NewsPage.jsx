import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiOutlineCalendar, HiOutlineArrowRight, HiOutlineXMark } from 'react-icons/hi2'
import PageHero from '../components/ui/PageHero'

const categoryColors = {
  Pengumuman: 'bg-primary/10 text-primary-deep',
  Prestasi: 'bg-amber-50 text-amber-700',
  Kegiatan: 'bg-blue-50 text-blue-700',
  Akademik: 'bg-purple-50 text-purple-700',
  PPDB: 'bg-emerald-50 text-emerald-700',
}

const articles = [
  {
    id: 1, title: 'Pendaftaran Santri Baru T.A. 2026/2027 Dibuka',
    excerpt: 'Pondok Pesantren Tursina Alam membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Dapatkan informasi lengkap mengenai persyaratan, prosedur pendaftaran, dan beasiswa yang tersedia.',
    content: 'Bismillahirrahmanirrahim. Pondok Pesantren Tursina Alam dengan penuh rasa syukur membuka pendaftaran santri baru untuk tahun ajaran 2026/2027.\n\nProgram yang dibuka meliputi:\n- MTs (Madrasah Tsanawiyah) kelas 7\n- MA (Madrasah Aliyah) kelas 10\n- Program Tahfidz Intensif\n\nPendaftaran dibuka mulai 1 Juni 2026 melalui sistem PPDB Online yang dapat diakses melalui website resmi pondok pesantren. Tersedia beasiswa prestasi akademik dan tahfidz bagi calon santri yang memenuhi syarat.\n\nUntuk informasi lebih lanjut, silakan menghubungi panitia PPDB melalui WhatsApp di nomor yang tertera atau kunjungi halaman Sistem Digital di website kami.',
    date: '15 Mei 2026', category: 'PPDB',
  },
  {
    id: 2, title: 'Santri Tursina Alam Raih Juara 1 MTQ Nasional',
    excerpt: 'Alhamdulillah, santri kami Muhammad Fauzan berhasil meraih juara 1 dalam Musabaqah Tilawatil Quran tingkat nasional kategori Hifdzil Quran 30 Juz.',
    content: 'Alhamdulillah wa syukurillah. Dengan bangga kami sampaikan bahwa santri Pondok Pesantren Tursina Alam, Muhammad Fauzan kelas 12 MA, berhasil meraih Juara 1 dalam ajang Musabaqah Tilawatil Quran (MTQ) tingkat Nasional yang diselenggarakan di Jakarta pada 8-10 Mei 2026.\n\nMuhammad Fauzan bertanding di kategori Hifdzil Quran 30 Juz dengan peserta dari seluruh provinsi di Indonesia. Prestasi ini merupakan buah dari program tahfidz intensif yang diterapkan di pondok pesantren kami.\n\nKami mengucapkan tahniah kepada Muhammad Fauzan dan seluruh ustadz pembimbing yang telah mendampingi proses persiapan.',
    date: '10 Mei 2026', category: 'Prestasi',
  },
  {
    id: 3, title: 'Workshop Teknologi Digital untuk Tenaga Pengajar',
    excerpt: 'Dalam upaya meningkatkan kualitas pengajaran, pondok mengadakan workshop integrasi teknologi digital dalam proses belajar mengajar selama 3 hari.',
    content: 'Pondok Pesantren Tursina Alam menyelenggarakan Workshop Integrasi Teknologi Digital dalam Pengajaran pada tanggal 5-7 Mei 2026. Workshop ini diikuti oleh seluruh tenaga pengajar dan pengurus pondok.\n\nMateri yang dibahas meliputi:\n- Pemanfaatan platform e-learning\n- Pembuatan konten pembelajaran interaktif\n- Penggunaan dashboard monitoring akademik\n- Integrasi AI dalam evaluasi pembelajaran\n\nWorkshop ini merupakan bagian dari program Smart Pesantren yang bertujuan untuk meningkatkan kualitas pendidikan melalui pemanfaatan teknologi modern.',
    date: '5 Mei 2026', category: 'Kegiatan',
  },
  {
    id: 4, title: 'Pelaksanaan Ujian Akhir Semester Genap',
    excerpt: 'Ujian akhir semester genap akan dilaksanakan pada tanggal 1-12 Juni 2026 untuk seluruh jenjang pendidikan di pondok pesantren.',
    content: 'Diberitahukan kepada seluruh santri dan wali santri bahwa Ujian Akhir Semester (UAS) Genap Tahun Ajaran 2025/2026 akan dilaksanakan pada:\n\nTanggal: 1-12 Juni 2026\nWaktu: 07:30 - 11:30 WIB\nTempat: Ruang kelas masing-masing\n\nPersiapan yang perlu dilakukan:\n- Membawa alat tulis lengkap\n- Hadir 15 menit sebelum ujian dimulai\n- Mempersiapkan materi sesuai kisi-kisi yang telah dibagikan\n\nHasil ujian dapat dipantau melalui Portal Wali Santri setelah proses penilaian selesai.',
    date: '28 April 2026', category: 'Pengumuman',
  },
  {
    id: 5, title: 'Program Bahasa Arab Intensif Ramadhan 1447 H',
    excerpt: 'Pondok pesantren menyelenggarakan program bahasa Arab intensif selama bulan Ramadhan dengan target penguasaan muhadatsah yaumiyyah.',
    content: 'Menyambut bulan suci Ramadhan 1447 H, Pondok Pesantren Tursina Alam menyelenggarakan Program Bahasa Arab Intensif untuk seluruh santri.\n\nProgram ini bertujuan meningkatkan kemampuan berbahasa Arab aktif melalui:\n- Muhadatsah Yaumiyyah (percakapan harian)\n- Insya\' (menulis karangan Arab)\n- Qira\'ah (membaca teks Arab)\n- Istima\' (mendengarkan audio Arab)\n\nProgram berlangsung selama bulan Ramadhan dengan evaluasi akhir berupa ujian komprehensif.',
    date: '20 April 2026', category: 'Akademik',
  },
  {
    id: 6, title: 'Kunjungan Dinas Pendidikan ke Pondok Pesantren',
    excerpt: 'Dinas Pendidikan Provinsi melakukan kunjungan kerja ke Pondok Pesantren Tursina Alam untuk melihat implementasi sistem digital pesantren.',
    content: 'Pada hari Rabu, 15 April 2026, Pondok Pesantren Tursina Alam menerima kunjungan kerja dari Dinas Pendidikan Provinsi yang dipimpin oleh Kepala Bidang Pendidikan Non-Formal.\n\nKunjungan ini bertujuan untuk melihat secara langsung implementasi Sistem Digital Pesantren yang diterapkan di Tursina Alam, meliputi:\n- Sistem Absensi QR Code\n- Portal Wali Santri\n- Dashboard Monitoring Realtime\n- Pembayaran Digital\n\nTim Dinas Pendidikan menyatakan apresiasi atas inovasi digital yang diterapkan dan berencana menjadikan Tursina Alam sebagai percontohan Smart Pesantren di tingkat provinsi.',
    date: '15 April 2026', category: 'Kegiatan',
  },
]

export default function NewsPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [openArticle, setOpenArticle] = useState(null)

  return (
    <>
      <PageHero
        label="Berita & Pengumuman"
        title="Informasi Terkini dari Tursina Alam"
        description="Ikuti berita, pengumuman, dan agenda kegiatan terbaru dari pondok pesantren kami."
      />

      <section className="py-24 lg:py-32 bg-canvas">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <motion.article
                key={a.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-xl border border-hairline bg-canvas hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-1 bg-gradient-to-r from-primary to-primary-deep" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider ${categoryColors[a.category] || 'bg-canvas-soft text-ink-mute'}`}>
                      {a.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-mute">
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      {a.date}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-ink mb-3 leading-snug group-hover:text-primary-deep transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-ink-mute leading-relaxed mb-4 flex-1">{a.excerpt}</p>

                  <button
                    onClick={() => setOpenArticle(a)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep hover:text-primary transition-colors group/link cursor-pointer"
                  >
                    Baca Selengkapnya
                    <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Article Detail Modal */}
      {openArticle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 backdrop-blur-sm p-6 pt-24 overflow-y-auto"
        >
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-canvas rounded-2xl shadow-2xl max-w-2xl w-full relative"
          >
            <button
              onClick={() => setOpenArticle(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-canvas-soft hover:bg-hairline flex items-center justify-center text-ink-mute hover:text-ink transition-colors cursor-pointer"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <div className="h-1.5 bg-gradient-to-r from-primary to-primary-deep rounded-t-2xl" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider ${categoryColors[openArticle.category]}`}>
                  {openArticle.category}
                </span>
                <span className="text-xs text-ink-mute">{openArticle.date}</span>
              </div>
              <h2 className="text-display-md text-ink mb-6">{openArticle.title}</h2>
              <div className="prose prose-sm max-w-none text-ink-mute leading-relaxed">
                {openArticle.content.split('\n').map((p, i) => (
                  <p key={i} className={p.startsWith('-') ? 'ml-4' : 'mb-3'}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
