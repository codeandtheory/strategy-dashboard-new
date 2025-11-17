import Link from 'next/link'
import { Users, Clock, TrendingUp, Calendar, Briefcase, Hammer } from 'lucide-react'

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-brand-warm-cream">
      <header className="bg-brand-pure-white border-b-4 border-brand-golden-yellow text-brand-deep-maroon px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-[2000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] bg-brand-golden-yellow flex items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-brand-deep-maroon">D</span>
              </div>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm lg:text-base font-black uppercase">
              <Link href="/" className="hover:text-brand-golden-yellow transition-colors">HOME</Link>
              <Link href="/snaps" className="hover:text-brand-golden-yellow transition-colors">SNAPS</Link>
              <Link href="/resources" className="hover:text-brand-golden-yellow transition-colors">RESOURCES</Link>
              <Link href="/work" className="text-brand-golden-yellow border-b-2 border-brand-golden-yellow pb-1">WORK</Link>
              <Link href="/team" className="hover:text-brand-golden-yellow transition-colors">TEAM</Link>
              <Link href="/vibes" className="hover:text-brand-golden-yellow transition-colors">VIBES</Link>
            </nav>
          </div>
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-soft-pink flex items-center justify-center text-brand-light-maroon hover:scale-110 transition-transform">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-[2000px] mx-auto">
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black text-brand-deep-maroon uppercase leading-[0.85] mb-6 sm:mb-8 lg:mb-12 animate-slide-up">
          Work
        </h1>

        {/* Tabs */}
        <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-12">
          <button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full bg-brand-golden-yellow text-brand-deep-maroon font-black text-sm sm:text-base lg:text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,192,67,0.3)]">
            Pipeline
          </button>
          <button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-black text-sm sm:text-base lg:text-lg hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Showcase
          </button>
        </div>

        {/* Pipeline Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="bg-brand-bright-orange text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,107,53,0.4)]">
              <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black mb-2 leading-[0.85] uppercase">
                New Business
              </h2>
              <p className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.85]">2</p>
            </div>

            {[
              { title: 'Acme Corp', subtitle: 'Website Redesign', team: 'Alex, Sarah', time: '2 weeks' },
              { title: 'Tech Startup', subtitle: 'Brand Identity', team: 'Mike', time: '1 month' }
            ].map((project, i) => (
              <div key={i} className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.02] hover:border-brand-bright-orange transition-all">
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-black mb-2">{project.title}</h3>
                <p className="text-brand-deep-maroon/60 mb-6">{project.subtitle}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{project.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{project.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="bg-brand-sky-blue text-brand-pure-white p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(74,155,255,0.4)]">
              <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black mb-2 leading-[0.85] uppercase">
                In Progress
              </h2>
              <p className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.85]">2</p>
            </div>

            {[
              { title: 'Fashion Brand', subtitle: 'E-commerce', team: 'Chris, Taylor', time: '3 weeks left' },
              { title: 'Food App', subtitle: 'Mobile App', team: 'Jamie', time: '1 week left' }
            ].map((project, i) => (
              <div key={i} className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.02] hover:border-brand-sky-blue transition-all">
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-black mb-2">{project.title}</h3>
                <p className="text-brand-deep-maroon/60 mb-6">{project.subtitle}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{project.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{project.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="bg-brand-lime-green text-brand-dark-olive p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(200,217,97,0.4)]">
              <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black mb-2 leading-[0.85] uppercase">
                Completed
              </h2>
              <p className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.85]">2</p>
            </div>

            {[
              { title: 'Finance Co', subtitle: 'Dashboard', team: 'Alex, Mike', time: 'Last week' },
              { title: 'Travel Site', subtitle: 'Booking Flow', team: 'Sarah', time: '2 weeks ago' }
            ].map((project, i) => (
              <div key={i} className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.02] hover:border-brand-lime-green transition-all">
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-black mb-2">{project.title}</h3>
                <p className="text-brand-deep-maroon/60 mb-6">{project.subtitle}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{project.team}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{project.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
