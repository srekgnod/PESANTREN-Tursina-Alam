import Navbar from '../components/sections/Navbar'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Programs from '../components/sections/Programs'
import DigitalSystem from '../components/sections/DigitalSystem'
import Stats from '../components/sections/Stats'
import Gallery from '../components/sections/Gallery'
import News from '../components/sections/News'
import CTA from '../components/sections/CTA'
import Footer from '../components/sections/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <DigitalSystem />
        <Stats />
        <Gallery />
        <News />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
