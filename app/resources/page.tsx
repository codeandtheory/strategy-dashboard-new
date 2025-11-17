import Link from 'next/link'
import { Users, Search, BookOpen, ExternalLink } from 'lucide-react'

export default function ResourcesPage() {
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
              <Link href="/resources" className="text-brand-golden-yellow border-b-2 border-brand-golden-yellow pb-1">RESOURCES</Link>
              <Link href="/work" className="hover:text-brand-golden-yellow transition-colors">WORK</Link>
              <Link href="/team" className="hover:text-brand-golden-yellow transition-colors">TEAM</Link>
              <Link href="/vibes" className="hover:text-brand-golden-yellow transition-colors">VIBES</Link>
              <Link href="#" className="hover:text-brand-golden-yellow transition-colors">BRAND</Link>
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
          Resources
        </h1>

        {/* Search Bar */}
        <div className="bg-brand-pure-white rounded-full p-2 sm:p-3 border-4 border-brand-deep-maroon/10 mb-6 sm:mb-8 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search resources..."
            className="flex-1 bg-transparent px-4 py-3 sm:py-4 text-base sm:text-lg outline-none text-brand-deep-maroon placeholder:text-brand-deep-maroon/40"
          />
          <button className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-brand-golden-yellow flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,192,67,0.4)]">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-brand-deep-maroon" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-golden-yellow text-brand-deep-maroon font-black text-sm sm:text-base hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,192,67,0.3)]">
            All
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-semibold text-sm sm:text-base hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Communication
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-semibold text-sm sm:text-base hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Creative
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-semibold text-sm sm:text-base hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Learning
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-semibold text-sm sm:text-base hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Research
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-semibold text-sm sm:text-base hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Strategy
          </button>
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-brand-pure-white text-brand-deep-maroon border-2 border-brand-deep-maroon/10 font-semibold text-sm sm:text-base hover:scale-105 hover:border-brand-golden-yellow transition-all">
            Tools
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Resources Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Resource Card 1 */}
            {[
              { title: 'Brand Guidelines 2024', desc: 'Complete guide to our visual identity and brand standards', tags: ['Creative', 'Strategy'] },
              { title: 'Client Communication Templates', desc: 'Email templates for common client scenarios', tags: ['Communication', 'Tools'] },
              { title: 'UX Research Methods', desc: 'Comprehensive guide to user research techniques', tags: ['Research', 'Learning'] },
              { title: 'Design System Documentation', desc: 'Component library and usage guidelines', tags: ['Creative', 'Tools'] },
              { title: 'Project Kickoff Checklist', desc: 'Everything you need to start a new project', tags: ['Strategy', 'Tools'] },
              { title: 'Figma Tips & Tricks', desc: 'Advanced techniques for efficient design work', tags: ['Creative', 'Learning'] }
            ].map((resource, i) => (
              <div key={i} className="bg-brand-sky-blue text-brand-pure-white p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-pure-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-brand-sky-blue" />
                </div>
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-black mb-2 text-brand-pure-white">{resource.title}</h3>
                <p className="text-sm sm:text-base text-brand-pure-white/90 mb-6">{resource.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1 bg-brand-pure-white/20 rounded-full text-xs font-black border border-brand-pure-white/40 text-brand-pure-white">{tag}</span>
                  ))}
                </div>
                <button className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-brand-pure-white flex items-center justify-center hover:scale-110 transition-transform">
                  <ExternalLink className="w-4 h-4 text-brand-sky-blue" />
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            {/* Recently Viewed */}
            <div className="bg-brand-pure-white text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-deep-maroon/10">
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-black mb-6 uppercase">Recently Viewed</h3>
              <div className="space-y-3">
                <div className="text-sm sm:text-base hover:text-brand-golden-yellow transition-colors cursor-pointer">Brand Guidelines 2024</div>
                <div className="text-sm sm:text-base hover:text-brand-golden-yellow transition-colors cursor-pointer">Client Communication Templates</div>
                <div className="text-sm sm:text-base hover:text-brand-golden-yellow transition-colors cursor-pointer">UX Research Methods</div>
              </div>
            </div>

            {/* Most Used */}
            <div className="bg-brand-soft-pink text-brand-deep-maroon p-6 sm:p-8 rounded-[2.5rem] border-4 border-brand-golden-yellow shadow-[0_0_40px_rgba(255,181,216,0.3)]">
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-black mb-6 uppercase">Most Used</h3>
              <div className="bg-brand-deep-maroon/20 backdrop-blur-sm rounded-full p-4 mb-4">
                <h4 className="font-bold mb-1">Brand Guidelines</h4>
                <p className="text-sm opacity-90">124 views this month</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
