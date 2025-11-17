import Link from 'next/link'
import { Users, Trophy, Music, Play, MessageCircle } from 'lucide-react'

export default function VibesPage() {
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
              <Link href="/work" className="hover:text-brand-golden-yellow transition-colors">WORK</Link>
              <Link href="/team" className="hover:text-brand-golden-yellow transition-colors">TEAM</Link>
              <Link href="/vibes" className="text-brand-golden-yellow border-b-2 border-brand-golden-yellow pb-1">VIBES</Link>
            </nav>
          </div>
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-soft-pink flex items-center justify-center text-brand-light-maroon hover:scale-110 transition-transform">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-[2000px] mx-auto">
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black text-brand-deep-maroon uppercase leading-[0.85] mb-8 sm:mb-12 animate-slide-up">
          Vibes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-brand-bright-orange text-brand-deep-maroon p-6 sm:p-8 lg:p-10 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,107,53,0.4)]">
            <p className="text-xs sm:text-sm font-black mb-4 uppercase">THIS WEEK'S</p>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-black mb-8 leading-[0.85] uppercase">
              BEAST<br />BABE
            </h2>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-golden-yellow flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,192,67,0.5)]">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-brand-deep-maroon" />
            </div>
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black mb-2">Sarah J.</h3>
            <p className="text-base sm:text-lg font-black uppercase">42 Snaps Received</p>
          </div>

          <div className="bg-brand-soft-pink text-brand-deep-maroon p-6 sm:p-8 lg:p-10 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,181,216,0.4)]">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5" />
              <p className="text-xs sm:text-sm font-black uppercase">Question of the Week</p>
            </div>
            <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-black mb-8">
              What's one thing you learned this week?
            </h2>
            <div className="space-y-3 mb-6">
              <div className="bg-brand-deep-maroon/20 backdrop-blur-sm rounded-full p-4 border-2 border-brand-deep-maroon/20">
                <p className="text-sm">"How to use CSS Grid effectively!" - Alex</p>
              </div>
              <div className="bg-brand-deep-maroon/20 backdrop-blur-sm rounded-full p-4 border-2 border-brand-deep-maroon/20">
                <p className="text-sm">"Better time management techniques" - Sarah</p>
              </div>
            </div>
            <button className="w-full py-3 sm:py-4 rounded-full bg-brand-deep-maroon text-brand-soft-pink font-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(74,24,24,0.3)]">
              Share Your Answer
            </button>
          </div>

          <div className="bg-brand-golden-yellow text-brand-deep-maroon p-6 sm:p-8 lg:p-10 rounded-[2.5rem] border-4 border-brand-bright-orange shadow-[0_0_40px_rgba(255,192,67,0.4)]">
            <p className="text-xs sm:text-sm font-black mb-4 uppercase">WEEKLY</p>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-black mb-8 leading-[0.85] uppercase">
              PLAYLIST
            </h2>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-deep-maroon flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(74,24,24,0.5)]">
              <Music className="w-10 h-10 sm:w-12 sm:h-12 text-brand-golden-yellow" />
            </div>
            <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-black mb-2">Coding Vibes</h3>
            <p className="text-sm sm:text-base mb-6 font-bold uppercase">Curated by Alex</p>
            <button className="w-full py-3 sm:py-4 rounded-full bg-brand-deep-maroon text-brand-golden-yellow font-black hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(74,24,24,0.3)]">
              <Play className="w-5 h-5" />
              Play on Spotify
            </button>
          </div>
        </div>

        {/* Archive */}
        <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black text-brand-deep-maroon mb-6 uppercase">Archive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Coding Vibes', author: 'By Alex', time: 'This Week' },
            { name: 'Focus Flow', author: 'By Sarah', time: 'Last Week' },
            { name: 'Creative Energy', author: 'By Mike', time: '2 Weeks Ago' },
            { name: 'Chill Beats', author: 'By Jamie', time: '3 Weeks Ago' },
          ].map((playlist, index) => (
            <div
              key={index}
              className="bg-brand-lime-green text-brand-dark-olive p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_30px_rgba(200,217,97,0.3)] hover:scale-[1.02] transition-transform"
            >
              <div className="aspect-square bg-brand-dark-olive/20 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center mb-4 border-2 border-brand-dark-olive/20">
                <Music className="w-12 h-12 sm:w-16 sm:h-16 text-brand-dark-olive" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-brand-dark-olive mb-1">{playlist.name}</h3>
              <p className="text-sm text-brand-dark-olive/80 mb-1 font-bold">{playlist.author}</p>
              <p className="text-xs text-brand-dark-olive/60 mb-4 font-semibold">{playlist.time}</p>
              <button className="w-full py-2 sm:py-3 rounded-full bg-brand-dark-olive text-brand-lime-green font-black hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(74,92,42,0.3)]">
                <Play className="w-4 h-4" />
                Play
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
