export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00ff88] animate-pulse mx-auto mb-4"></div>
        <p className="text-white text-xl sm:text-2xl font-black uppercase">Loading Work...</p>
      </div>
    </div>
  )
}
