import { Search, Calendar, Music, FileText, MessageCircle, Trophy, TrendingUp, Users, Zap, Star, Clock, ArrowRight, Play, CheckCircle, Video, Sparkles, ChevronRight, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

export default function TeamDashboard() {
  return (
    <div className="min-h-screen bg-brand-warm-cream">
      <header className="border-b-4 border-brand-golden-yellow/20 px-4 md:px-6 lg:px-8 py-6 bg-brand-pure-white">
        <div className="max-w-[2000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-12">
            <Link href="/" className="w-14 h-14 md:w-16 md:h-16 bg-brand-golden-yellow rounded-3xl flex items-center justify-center font-black text-brand-deep-maroon text-2xl hover:scale-110 transition-transform">
              D
            </Link>
            <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-sm font-black">
              <Link href="/" className="text-brand-golden-yellow tracking-[0.15em] uppercase hover:text-brand-deep-maroon transition-colors relative pb-1 border-b-4 border-brand-golden-yellow">HOME</Link>
              <Link href="/snaps" className="text-brand-deep-maroon/60 hover:text-brand-golden-yellow transition-colors tracking-[0.15em] uppercase">SNAPS</Link>
              <Link href="/resources" className="text-brand-deep-maroon/60 hover:text-brand-golden-yellow transition-colors tracking-[0.15em] uppercase">RESOURCES</Link>
              <Link href="/work" className="text-brand-deep-maroon/60 hover:text-brand-golden-yellow transition-colors tracking-[0.15em] uppercase">WORK</Link>
              <Link href="/team" className="text-brand-deep-maroon/60 hover:text-brand-golden-yellow transition-colors tracking-[0.15em] uppercase">TEAM</Link>
              <Link href="/vibes" className="text-brand-deep-maroon/60 hover:text-brand-golden-yellow transition-colors tracking-[0.15em] uppercase">VIBES</Link>
            </nav>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-soft-pink to-brand-golden-yellow rounded-full border-4 border-brand-golden-yellow" />
        </div>
      </header>

      <main className="max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 space-y-8 md:space-y-12">
        <section className="relative overflow-hidden rounded-[40px] bg-brand-golden-yellow p-8 md:p-12 min-h-[500px] flex flex-col justify-between animate-slide-up">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-deep-maroon/10 rounded-[40px] transform translate-x-1/4 -rotate-12"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-brand-deep-maroon/10 px-4 md:px-6 py-2 md:py-3 rounded-full">
                <p className="text-brand-deep-maroon font-black text-xs md:text-sm tracking-[0.2em] uppercase">Quick Actions</p>
              </div>
            </div>
            <h1 className="text-[clamp(3rem,8vw+1rem,10rem)] leading-[0.85] font-black text-brand-deep-maroon mb-4 md:mb-6 uppercase">
              READY!
            </h1>
            <p className="text-[clamp(1.25rem,3vw+0.5rem,2.5rem)] font-bold text-brand-deep-maroon max-w-2xl leading-tight">
              Let's ship something amazing today
            </p>
            <p className="text-base md:text-lg lg:text-xl text-brand-deep-maroon/70 font-bold mt-4">Friday, November 14</p>
          </div>
          <div className="relative z-10 flex items-center gap-3 md:gap-4 flex-wrap">
            {['Give Snap', 'Need Help', 'Add Win'].map((label) => (
              <button key={label} className="bg-brand-deep-maroon text-brand-golden-yellow py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg font-black hover:scale-105 transition-all hover:shadow-2xl uppercase tracking-wider">
                {label} →
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-brand-soft-pink text-brand-light-maroon p-8 md:p-10 rounded-[40px] flex flex-col items-center justify-center text-center hover:scale-105 transition-all duration-300 animate-slide-up min-h-[400px]">
            <div className="w-24 h-24 bg-brand-lime-green rounded-full flex items-center justify-center mb-6 animate-float">
              <Zap className="w-12 h-12 text-brand-dark-olive" />
            </div>
            <p className="text-brand-light-maroon/90 font-black text-sm tracking-[0.2em] uppercase mb-4">Launch Pad</p>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] font-black text-brand-deep-maroon uppercase break-words">QUICK<br/>ACTIONS</h2>
          </div>

          <div className="bg-brand-soft-pink text-brand-deep-maroon p-8 md:p-10 rounded-[40px] hover:scale-105 transition-all duration-300 animate-slide-up min-h-[400px] flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <Sparkles className="w-5 h-5 shrink-0 text-brand-golden-yellow" />
              <span className="text-brand-deep-maroon/60 font-black text-xs tracking-[0.2em] uppercase">Totally Real</span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.9] font-black text-brand-deep-maroon mb-6 uppercase break-words overflow-hidden">YOUR<br/>HOROSCOPE</h2>
            <div className="bg-brand-warm-cream border-2 border-brand-golden-yellow rounded-3xl p-5 flex-1 overflow-hidden">
              <p className="text-xs md:text-sm font-black text-brand-golden-yellow mb-3 uppercase tracking-wider">CANCER</p>
              <p className="text-sm md:text-base text-brand-deep-maroon leading-relaxed font-medium break-words">Mars aligns with your keyboard. Expect typos. So many typos. Idk stars have speelin.</p>
            </div>
          </div>

          <div className="bg-brand-sky-blue text-brand-pure-white p-8 md:p-10 rounded-[40px] relative overflow-hidden hover:scale-105 transition-all duration-300 animate-slide-up min-h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <span className="text-brand-pure-white/80 font-black text-xs tracking-[0.2em] uppercase">Right Now</span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.9] font-black text-brand-pure-white mb-6 uppercase relative z-10 break-words overflow-hidden">WEATHER</h2>
            <div className="mb-6 relative z-10 flex-1 flex flex-col justify-center overflow-hidden">
              <p className="text-[clamp(3rem,10vw,6rem)] leading-[0.9] font-black text-brand-pure-white mb-2 break-words">72°</p>
              <p className="text-lg md:text-xl text-brand-pure-white font-bold break-words">Partly Cloudy</p>
              <p className="text-sm md:text-base text-brand-pure-white/70 font-medium mt-2 break-words">Your Location</p>
            </div>
            <div className="absolute top-12 right-12 text-brand-pure-white/20 text-7xl md:text-9xl pointer-events-none">☁️</div>
            <div className="absolute bottom-40 right-20 text-brand-pure-white text-7xl md:text-9xl pointer-events-none">☁️</div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10 shrink-0">
              {[{ label: 'Humidity', val: '65%' }, { label: 'Wind', val: '8 mph' }].map((stat, i) => (
                <div key={i} className="bg-brand-pure-white/20 backdrop-blur-md rounded-2xl p-4 md:p-5 border-2 border-brand-pure-white/20 overflow-hidden">
                  <p className="text-xs md:text-sm text-brand-pure-white/70 font-bold uppercase tracking-wider truncate">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-black text-brand-pure-white mt-1 break-words">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-deep-maroon text-brand-pure-white p-8 md:p-10 rounded-[40px] border-4 border-brand-golden-yellow hover:scale-105 transition-all duration-300 animate-slide-up min-h-[400px] flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-brand-golden-yellow rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-brand-deep-maroon" />
              </div>
              <span className="text-brand-golden-yellow font-black text-xs tracking-[0.2em] uppercase">Global Team</span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.9] font-black text-brand-pure-white mb-6 uppercase break-words overflow-hidden">TIME<br/>ZONES</h2>
            <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto">
              {[
                { emoji: '🌉', city: 'San Francisco', status: '🌙 Sleeping', time: '12:50 AM' },
                { emoji: '🗽', city: 'New York', status: '🌙 Sleeping', time: '03:50 AM' },
                { emoji: '🏰', city: 'London', status: '🌙 Sleeping', time: '08:50 AM' },
                { emoji: '🗼', city: 'Tokyo', status: '🌃 Evening', time: '05:50 PM' },
                { emoji: '🏖️', city: 'Sydney', status: '🌃 Evening', time: '07:50 PM' }
              ].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-brand-golden-yellow/20 rounded-3xl border-2 border-brand-golden-yellow/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-golden-yellow rounded-2xl flex items-center justify-center text-xl">{zone.emoji}</div>
                    <div>
                      <p className="text-brand-pure-white font-black text-base">{zone.city}</p>
                      <p className="text-brand-pure-white/60 text-xs font-medium">{zone.status}</p>
                    </div>
                  </div>
                  <span className="text-brand-pure-white font-black text-sm">{zone.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-2 bg-gradient-to-r from-brand-lime-green to-brand-golden-yellow rounded-full flex-1"></div>
          </div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-black text-brand-deep-maroon mb-8 uppercase tracking-tight">Work Updates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-2 bg-brand-bright-orange text-brand-deep-maroon p-8 md:p-10 rounded-[40px] hover:scale-105 transition-all duration-300 animate-slide-up border-4 border-brand-golden-yellow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-deep-maroon rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-bright-orange" />
                </div>
                <span className="text-brand-deep-maroon/80 font-black text-xs tracking-[0.2em] uppercase">Work</span>
              </div>
              <h3 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] font-black text-brand-deep-maroon mb-8 uppercase overflow-hidden">PIPELINE</h3>
              <div className="space-y-4">
                {[
                  { label: 'New Business', icon: FileText, num: '12' },
                  { label: 'In Progress', icon: Zap, num: '8' },
                  { label: 'Completed', icon: CheckCircle, num: '24' }
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="bg-brand-deep-maroon rounded-3xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-golden-yellow rounded-2xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-brand-deep-maroon" />
                        </div>
                        <span className="font-bold text-brand-pure-white">{item.label}</span>
                      </div>
                      <span className="text-2xl font-black text-brand-golden-yellow">{item.num}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-brand-sky-blue text-brand-pure-white p-8 md:p-10 rounded-[40px] hover:scale-105 transition-all duration-300 animate-slide-up border-4 border-brand-golden-yellow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-pure-white rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-sky-blue" />
                </div>
                <span className="text-brand-pure-white/90 font-black text-xs tracking-[0.2em] uppercase">Weekly Report</span>
              </div>
              <h3 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] font-black text-brand-pure-white mb-6 uppercase overflow-hidden">THE<br/>FRIDAY<br/>DROP</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[{ num: '5', label: 'NEW' }, { num: '8', label: 'SHIPPED' }, { num: '12', label: 'IN QA' }].map((stat, i) => (
                  <div key={i} className="bg-brand-pure-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-brand-pure-white/40">
                    <p className="text-3xl font-black text-brand-golden-yellow">{stat.num}</p>
                    <p className="text-xs font-bold text-brand-pure-white/90 uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-2 bg-gradient-to-r from-brand-soft-pink to-brand-golden-yellow rounded-full flex-1"></div>
          </div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-black text-brand-deep-maroon mb-8 uppercase tracking-tight">Recognition & Culture</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-brand-lime-green text-brand-dark-olive p-8 md:p-10 rounded-[40px] border-4 border-brand-golden-yellow hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-dark-olive rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-lime-green" />
                </div>
                <span className="text-brand-dark-olive/80 font-black text-xs tracking-[0.2em] uppercase">Recent Recognition</span>
              </div>
              <h3 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] font-black text-brand-dark-olive mb-6 uppercase overflow-hidden">SNAPS</h3>
              <div className="space-y-4 mb-6">
                {[
                  { from: 'Alex', to: 'Jamie', msg: 'Amazing presentation! The client loved it' },
                  { from: 'Sarah', to: 'Mike', msg: 'Thanks for the code review help today' },
                  { from: 'Chris', to: 'Taylor', msg: 'Great design work on the new landing page' }
                ].map((snap, i) => (
                  <div key={i} className="bg-brand-dark-olive/30 rounded-2xl p-4 border-2 border-brand-dark-olive/50">
                    <p className="font-black text-brand-dark-olive text-sm mb-1">{snap.from} → {snap.to}</p>
                    <p className="text-brand-dark-olive/80 text-xs font-medium">{snap.msg}</p>
                  </div>
                ))}
              </div>
              <button className="w-full bg-brand-dark-olive text-brand-lime-green py-4 rounded-full text-base font-black hover:scale-105 transition-all uppercase">
                + Give a Snap
              </button>
            </div>

            <div className="bg-brand-bright-orange text-brand-deep-maroon p-8 md:p-10 rounded-[40px] text-center hover:scale-105 transition-all duration-300 animate-slide-up border-4 border-brand-golden-yellow">
              <div className="bg-brand-deep-maroon px-4 py-2 rounded-full inline-block mb-4">
                <p className="text-brand-golden-yellow font-black text-xs tracking-[0.2em] uppercase">This Week's</p>
              </div>
              <h3 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] font-black text-brand-deep-maroon mb-6 uppercase overflow-hidden">BEAST<br/>BABE</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-brand-golden-yellow rounded-full flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-brand-deep-maroon" />
                </div>
              </div>
              <p className="text-[clamp(2rem,4vw,3rem)] leading-[0.85] font-black text-brand-deep-maroon uppercase mb-2">Sarah J.</p>
              <p className="text-lg font-bold text-brand-deep-maroon/90">42 Snaps Received</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-2 bg-gradient-to-r from-brand-sky-blue to-brand-soft-pink rounded-full flex-1"></div>
          </div>
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-black text-brand-deep-maroon mb-8 uppercase tracking-tight">More Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-brand-soft-pink text-brand-light-maroon p-8 md:p-10 rounded-[40px] hover:scale-105 transition-all duration-300 animate-slide-up border-4 border-brand-golden-yellow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-light-maroon rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-brand-soft-pink" />
                </div>
                <span className="text-brand-light-maroon/90 font-black text-xs tracking-[0.2em] uppercase">Community</span>
              </div>
              <h3 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.85] font-black text-brand-deep-maroon mb-6 uppercase overflow-hidden">ASK THE<br/>HIVE</h3>
              <div className="space-y-4 mb-6">
                {[
                  { q: 'Best prototyping tool?', answers: '5 answers' },
                  { q: 'Handle difficult client?', answers: '12 answers' }
                ].map((item, i) => (
                  <div key={i} className="bg-brand-warm-cream rounded-3xl p-5 hover:bg-brand-warm-beige transition-all cursor-pointer border-2 border-brand-golden-yellow/40">
                    <p className="font-black text-brand-deep-maroon text-base mb-1">{item.q}</p>
                    <p className="text-brand-golden-yellow text-sm font-medium">{item.answers}</p>
                  </div>
                ))}
              </div>
              <button className="w-full bg-brand-light-maroon text-brand-soft-pink py-4 rounded-full text-base font-black hover:scale-105 transition-all uppercase">
                Ask Question
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-deep-maroon border-t border-brand-pure-white/10 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-[2000px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-brand-pure-white font-black text-xl mb-4">Team Dashboard</h3>
            <p className="text-brand-pure-white/60 text-sm font-medium">Built with ❤️ and way too much coffee</p>
          </div>
          <div>
            <h4 className="text-brand-golden-yellow font-black text-sm mb-4 uppercase tracking-wider">Totally Real Stats</h4>
            <p className="text-brand-pure-white/60 text-sm font-medium">347 cups of coffee consumed</p>
          </div>
          <div>
            <h4 className="text-brand-golden-yellow font-black text-sm mb-4 uppercase tracking-wider">Fun Fact</h4>
            <p className="text-brand-pure-white/60 text-sm font-medium">We put the 'fun' in 'functional' and also in 'funnel', but that's unrelated.</p>
          </div>
          <div>
            <h4 className="text-brand-golden-yellow font-black text-sm mb-4 uppercase tracking-wider">Good Morning</h4>
            <p className="text-brand-pure-white/60 text-sm font-medium">Time to make today awesome! After coffee.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
