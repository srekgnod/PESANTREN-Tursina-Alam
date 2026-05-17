import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineMusicalNote,
  HiOutlineComputerDesktop,
} from 'react-icons/hi2'

import {
  HiOutlineQrCode,
  HiOutlineChartBar,
  HiOutlineCreditCard,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineBellAlert,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'

export const NAV_LINKS = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Program', href: '#program' },
  { label: 'Sistem Digital', href: '#sistem-digital' },
  { label: 'Galeri', href: '#galeri' },
  { label: 'Berita', href: '#berita' },
  { label: 'Kontak', href: '#kontak' },
]

export const PROGRAMS = [
  {
    icon: HiOutlineBookOpen,
    title: 'Tahfidz Al-Quran',
    description:
      'Program menghafal Al-Quran 30 juz dengan metode modern dan bimbingan ustadz bersertifikat sanad muttashil.',
    tag: 'Unggulan',
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Bahasa Arab & Inggris',
    description:
      'Penguasaan dua bahasa internasional sebagai bekal dakwah global dan akses ilmu pengetahuan dunia.',
    tag: null,
  },
  {
    icon: HiOutlineAcademicCap,
    title: 'Kitab Kuning',
    description:
      'Pengkajian kitab-kitab klasik dengan metode sorogan dan bandongan untuk pemahaman keislaman yang mendalam.',
    tag: null,
  },
  {
    icon: HiOutlineComputerDesktop,
    title: 'Pendidikan Formal',
    description:
      'Kurikulum Merdeka terintegrasi dengan kurikulum pesantren — mempersiapkan santri menghadapi era digital.',
    tag: 'Kurikulum Merdeka',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Pengembangan Diri',
    description:
      'Program leadership, public speaking, entrepreneurship, dan soft skills untuk membentuk karakter pemimpin.',
    tag: null,
  },
  {
    icon: HiOutlineMusicalNote,
    title: 'Ekstrakurikuler',
    description:
      'Seni hadrah, kaligrafi, futsal, panahan, robotik, dan berbagai kegiatan pengembangan bakat santri.',
    tag: null,
  },
]

export const DIGITAL_FEATURES = [
  {
    icon: HiOutlineQrCode,
    title: 'Absensi QR Code',
    description:
      'Sistem absensi digital dengan QR code — pencatatan kehadiran santri secara real-time dan akurat.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Monitoring Santri',
    description:
      'Dashboard monitoring perkembangan akademik, hafalan, dan akhlak santri secara komprehensif.',
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Pembayaran Digital',
    description:
      'Sistem pembayaran SPP dan biaya lainnya secara online — transparan, aman, dan otomatis.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Portal Wali Santri',
    description:
      'Akses informasi anak secara real-time — nilai, hafalan, absensi, dan laporan perkembangan.',
  },
  {
    icon: HiOutlineClipboardDocumentCheck,
    title: 'Perizinan Online',
    description:
      'Pengajuan izin keluar, pulang, dan sakit secara digital dengan notifikasi otomatis ke wali.',
  },
  {
    icon: HiOutlineBellAlert,
    title: 'WhatsApp Notification',
    description:
      'Notifikasi otomatis ke wali santri via WhatsApp — informasi penting langsung di genggaman.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Dashboard Realtime',
    description:
      'Dashboard pengurus dengan data real-time — statistik, laporan, dan analitik pondok pesantren.',
  },
]

export const STATS = [
  { value: 1250, label: 'Total Santri', suffix: '+' },
  { value: 85, label: 'Tenaga Pengajar', suffix: '+' },
  { value: 12, label: 'Program Pendidikan', suffix: '' },
  { value: 150, label: 'Prestasi', suffix: '+' },
]

export const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop', alt: 'Kegiatan Tahfidz', category: 'Akademik' },
  { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop', alt: 'Pembelajaran di Kelas', category: 'Akademik' },
  { src: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=400&fit=crop', alt: 'Kegiatan Olahraga', category: 'Ekstrakurikuler' },
  { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop', alt: 'Upacara Wisuda', category: 'Acara' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop', alt: 'Perpustakaan', category: 'Fasilitas' },
  { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop', alt: 'Diskusi Kelompok', category: 'Akademik' },
]

export const NEWS = [
  {
    title: 'Pendaftaran Santri Baru T.A. 2026/2027 Dibuka',
    excerpt:
      'Pondok Pesantren Tursina Alam membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Dapatkan informasi lengkap mengenai persyaratan dan prosedur pendaftaran.',
    date: '15 Mei 2026',
    category: 'Pengumuman',
  },
  {
    title: 'Santri Tursina Alam Raih Juara 1 MTQ Nasional',
    excerpt:
      'Alhamdulillah, santri kami berhasil meraih juara 1 dalam Musabaqah Tilawatil Quran tingkat nasional kategori Hifdzil Quran 30 Juz.',
    date: '10 Mei 2026',
    category: 'Prestasi',
  },
  {
    title: 'Workshop Teknologi Digital untuk Pengajar',
    excerpt:
      'Dalam upaya meningkatkan kualitas pengajaran, pondok mengadakan workshop integrasi teknologi digital dalam proses belajar mengajar.',
    date: '5 Mei 2026',
    category: 'Kegiatan',
  },
]

export const FOOTER_LINKS = {
  'Tentang Kami': [
    { label: 'Sejarah', href: '#tentang' },
    { label: 'Visi & Misi', href: '#tentang' },
    { label: 'Struktur Organisasi', href: '#' },
    { label: 'Tenaga Pengajar', href: '#' },
  ],
  'Program': [
    { label: 'Tahfidz', href: '#program' },
    { label: 'Bahasa Arab & Inggris', href: '#program' },
    { label: 'Pendidikan Formal', href: '#program' },
    { label: 'Ekstrakurikuler', href: '#program' },
  ],
  'Layanan Digital': [
    { label: 'Portal Wali Santri', href: '#' },
    { label: 'SPMB Online', href: '#' },
    { label: 'Pembayaran Online', href: '#' },
    { label: 'Login Sistem', href: '#' },
  ],
  'Informasi': [
    { label: 'Berita & Pengumuman', href: '#berita' },
    { label: 'Galeri Kegiatan', href: '#galeri' },
    { label: 'FAQ', href: '#' },
    { label: 'Hubungi Kami', href: '#kontak' },
  ],
}
