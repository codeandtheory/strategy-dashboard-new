import Link from 'next/link'
import { Users, TrendingUp, Award, CalendarIcon, Cake, Coffee, Palette, Rocket } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-brand-warm-cream">
      {/* Header */}
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
              <Link href="/work" className="hover:text-brand-golden-yellow transition-colors">WORK</Link>
              <Link href="/team" className="text-brand-golden-yellow border-b-2 border-brand-golden-yellow pb-1">TEAM</Link>
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
        {/* Page Title */}
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black text-brand-deep-maroon uppercase leading-[0.85] mb-6 sm:mb-8 lg:mb-12 animate-slide-up">
          Team
        </h1>

        {/* Team by Numbers */}
        <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black text-brand-deep-maroon mb-6 uppercase">Team by Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-brand-sky-blue text-brand-pure-white p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(74,155,255,0.4)] relative overflow-hidden">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 mb-4" />
            <p className="text-[clamp(2.5rem,8vw,4rem)] font-black mb-2 leading-[0.85]">24</p>
            <p className="text-lg sm:text-xl font-black uppercase">Team Members</p>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-pure-white/20 flex items-center justify-center text-xs font-black">
              +2
            </div>
          </div>

          <div className="bg-brand-soft-pink text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,181,216,0.4)] relative overflow-hidden">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 mb-4" />
            <p className="text-[clamp(2.5rem,8vw,4rem)] font-black mb-2 leading-[0.85]">12</p>
            <p className="text-lg sm:text-xl font-black uppercase">Active Projects</p>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-deep-maroon/20 flex items-center justify-center text-xs font-black">
              +3
            </div>
          </div>

          <div className="bg-brand-bright-orange text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,107,53,0.4)] relative overflow-hidden">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 mb-4" />
            <p className="text-[clamp(2.5rem,8vw,4rem)] font-black mb-2 leading-[0.85]">247</p>
            <p className="text-lg sm:text-xl font-black uppercase">Snaps This Month</p>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-deep-maroon/20 flex items-center justify-center text-xs font-black">
              +45
            </div>
          </div>

          <div className="bg-brand-lime-green text-brand-dark-olive p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(200,217,97,0.4)]">
            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 mb-4" />
            <p className="text-[clamp(2.5rem,8vw,4rem)] font-black mb-2 leading-[0.85]">8</p>
            <p className="text-lg sm:text-xl font-black uppercase">Upcoming Events</p>
          </div>
        </div>

        {/* Calendar & Events */}
        <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black text-brand-deep-maroon mb-6 uppercase">Calendar & Events</h2>
        <div className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 lg:p-12 rounded-[2.5rem] border-4 border-brand-deep-maroon/10">
          {/* Week Header */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="text-center">
              <p className="text-sm text-brand-deep-maroon/60 mb-2">Mon</p>
              <p className="text-2xl sm:text-3xl font-bold text-brand-bright-orange">10</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-brand-deep-maroon/60 mb-2">Tue</p>
              <p className="text-2xl sm:text-3xl font-bold">11</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-brand-deep-maroon/60 mb-2">Wed</p>
              <p className="text-2xl sm:text-3xl font-bold">12</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-brand-deep-maroon/60 mb-2">Thu</p>
              <p className="text-2xl sm:text-3xl font-bold">13</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-brand-deep-maroon/60 mb-2">Fri</p>
              <p className="text-2xl sm:text-3xl font-bold">14</p>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: Cake, name: "Sarah's Birthday", date: 'Mon, Feb 10', color: 'soft-pink' },
              { icon: Users, name: 'Team Standup', date: 'Mon, Feb 10', color: 'sky-blue' },
              { icon: Coffee, name: '1:1 with Mike', date: 'Tue, Feb 11', color: 'lime-green' },
              { icon: Palette, name: 'Design Review', date: 'Wed, Feb 12', color: 'bright-orange' },
              { icon: Rocket, name: 'Alex OOO', date: 'Thu, Feb 13', color: 'golden-yellow' },
              { icon: CalendarIcon, name: 'Friday Demo', date: 'Fri, Feb 14', color: 'lime-green' }
            ].map((event, i) => {
              const Icon = event.icon
              return (
                <div key={i} className={`flex items-center gap-4 p-4 bg-brand-warm-cream rounded-full border-2 border-brand-${event.color} hover:scale-[1.02] transition-transform`}>
                  <div className={`w-12 h-12 shrink-0 rounded-[1rem] bg-brand-${event.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-brand-deep-maroon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base">{event.name}</h4>
                    <p className="text-xs sm:text-sm text-brand-deep-maroon/60">{event.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
