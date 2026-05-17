import { PROGRAMS } from '../../constants/data'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'

export default function Programs() {
  return (
    <section id="program" className="py-24 lg:py-32 bg-canvas relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Program Pendidikan"
          title="Kurikulum Terpadu untuk Generasi Unggul"
          description="Program pendidikan kami dirancang untuk membekali santri dengan keilmuan Islam yang mendalam, penguasaan bahasa internasional, dan keterampilan abad 21."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((program, i) => (
            <Card key={program.title} delay={i * 0.08} className="group relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <program.icon className="w-6 h-6 text-primary-deep" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-ink">{program.title}</h3>
                    {program.tag && (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary text-on-primary uppercase tracking-wider">
                        {program.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-mute leading-relaxed">{program.description}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
