import Link from 'next/link'
import { Users, Award, TrendingUp, Filter, Calendar } from 'lucide-react'

export default function SnapsPage() {
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
              <Link href="/snaps" className="text-brand-golden-yellow border-b-2 border-brand-golden-yellow pb-1">SNAPS</Link>
              <Link href="/resources" className="hover:text-brand-golden-yellow transition-colors">RESOURCES</Link>
              <Link href="/work" className="hover:text-brand-golden-yellow transition-colors">WORK</Link>
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
        {/* Header with Title and Add Button */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black text-brand-deep-maroon uppercase leading-[0.85] animate-slide-up">
            Snaps
          </h1>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-golden-yellow text-brand-deep-maroon font-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,192,67,0.3)] flex items-center gap-2">
            <span className="text-2xl">+</span>
            <span className="hidden sm:inline">Add Snap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
            <div className="bg-brand-pure-white text-brand-deep-maroon p-6 rounded-[2.5rem] border-4 border-brand-deep-maroon/10">
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-black mb-6 flex items-center gap-2 uppercase">
                <Filter className="w-5 h-5" />
                FILTERS
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-full bg-brand-golden-yellow text-brand-deep-maroon font-black hover:scale-105 transition-transform flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>All Snaps</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-full bg-transparent hover:bg-brand-warm-cream font-semibold transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Snaps About Me</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-full bg-transparent hover:bg-brand-warm-cream font-semibold transition-colors flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Snaps I Gave</span>
                </button>
              </div>

              {/* Time Filter */}
              <div className="mt-6 pt-6 border-t border-brand-deep-maroon/20">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4" />
                  <h4 className="font-bold text-sm">Time Filter</h4>
                </div>
                <select className="w-full px-4 py-3 rounded-full bg-brand-warm-beige text-brand-deep-maroon font-semibold outline-none border-2 border-brand-deep-maroon/10">
                  <option>All Time</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            <div className="bg-brand-bright-orange text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,107,53,0.4)]">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" />
                <p className="text-xs sm:text-sm font-black uppercase">THIS MONTH</p>
              </div>
              <p className="text-[clamp(3rem,10vw,5rem)] font-black mb-4 leading-[0.85]">247</p>
              <p className="text-base sm:text-lg font-black mb-6 uppercase">Total Snaps</p>
              <div className="bg-brand-deep-maroon/20 backdrop-blur-sm rounded-full p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5" />
                  <p className="font-bold text-sm">Snap Leader</p>
                </div>
                <p className="text-[clamp(1.25rem,4vw,2rem)] font-black">Sarah Johnson</p>
                <p className="text-sm opacity-90">42 snaps given</p>
              </div>
            </div>
          </div>

          {/* Snaps Feed */}
          <div className="lg:col-span-9 space-y-4 sm:space-y-6">
            <div className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.01] hover:border-brand-golden-yellow transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-brand-golden-yellow flex items-center justify-center shadow-[0_0_20px_rgba(255,192,67,0.5)]">
                  <Award className="w-6 h-6 text-brand-deep-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black">Alex Chen</span>
                    <span className="text-brand-golden-yellow">→</span>
                    <span className="font-black">Jamie Wilson</span>
                  </div>
                  <p className="text-sm text-brand-deep-maroon/60">2 hours ago</p>
                </div>
              </div>
              <p className="text-base sm:text-lg">
                Your presentation was absolutely phenomenal! The way you explained the complex concepts was so clear.
              </p>
            </div>

            <div className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.01] hover:border-brand-golden-yellow transition-all relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-brand-golden-yellow flex items-center justify-center shadow-[0_0_20px_rgba(255,192,67,0.5)]">
                  <Award className="w-6 h-6 text-brand-deep-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black">Anonymous</span>
                    <span className="text-brand-golden-yellow">→</span>
                    <span className="font-black">Sarah Miller</span>
                  </div>
                  <p className="text-sm text-brand-deep-maroon/60">5 hours ago</p>
                </div>
              </div>
              <p className="text-base sm:text-lg">
                Thanks for always being so helpful and patient with everyone!
              </p>
              <div className="absolute top-6 right-6 px-3 py-1 bg-brand-golden-yellow/20 rounded-full border-2 border-brand-golden-yellow">
                <p className="text-xs font-bold text-brand-deep-maroon flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Anonymous
                </p>
              </div>
            </div>

            <div className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.01] hover:border-brand-golden-yellow transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-brand-golden-yellow flex items-center justify-center shadow-[0_0_20px_rgba(255,192,67,0.5)]">
                  <Award className="w-6 h-6 text-brand-deep-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black">Mike Davis</span>
                    <span className="text-brand-golden-yellow">→</span>
                    <span className="font-black">Chris Taylor</span>
                  </div>
                  <p className="text-sm text-brand-deep-maroon/60">1 day ago</p>
                </div>
              </div>
              <p className="text-base sm:text-lg">
                That code review was super helpful. I learned a lot!
              </p>
            </div>

            <div className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10 hover:scale-[1.01] hover:border-brand-golden-yellow transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-brand-golden-yellow flex items-center justify-center shadow-[0_0_20px_rgba(255,192,67,0.5)]">
                  <Award className="w-6 h-6 text-brand-deep-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black">Taylor Brown</span>
                    <span className="text-brand-golden-yellow">→</span>
                    <span className="font-black">Alex Chen</span>
                  </div>
                  <p className="text-sm text-brand-deep-maroon/60">2 days ago</p>
                </div>
              </div>
              <p className="text-base sm:text-lg">
                Great job organizing the team event. Everyone had a blast!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
