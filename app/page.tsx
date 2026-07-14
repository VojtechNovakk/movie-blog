export default function Home() {
  return (
    <>
      <div className="film-grain"></div>

      <header className="w-full pt-10 flex justify-center relative z-10 shrink-0">
        <div className="flex flex-col items-center gap-5 w-full max-w-[400px]">
          <div className="text-sm font-bold tracking-[8px] uppercase text-black">
            FilmFilm
          </div>
          <div className="w-full px-5">
            <input
              type="text"
              className="w-full bg-[#f5f5f5]/80 backdrop-blur-md border border-[#cccccc] rounded-full py-3 px-6 font-sans text-base text-black outline-none transition-all duration-300 text-center appearance-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:border-[#999999] focus:bg-white focus:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:scale-[1.02] placeholder:text-[#888888] placeholder:tracking-[0.5px]"
              placeholder="Search a masterpiece..."
            />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative z-0 flex flex-col justify-center items-center pb-[5vh] sm:pb-[10vh]">
        <div className="relative w-full max-w-[1200px] flex flex-col sm:flex-row items-center sm:items-stretch gap-8 sm:gap-12 px-6">
          <div className="w-[60vw] max-w-[280px] sm:w-[35%] sm:max-w-[400px] flex-shrink-0 perspective-[1000px]">
            <img
              src="/movie_poster.jpg"
              alt="Vibrant Movie Poster"
              className="w-full h-auto aspect-[2/3] object-cover rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.25)] transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
          
          <div className="w-full sm:w-[50%] flex flex-col justify-center gap-6 sm:gap-8 pt-4 sm:pt-0">
            <div className="text-[#ff3b3b] text-3xl sm:text-4xl tracking-[4px]">
              ★★★★<span className="text-[#e0e0e0]">☆</span>
            </div>
            
            <div className="font-mono text-xs sm:text-sm tracking-[1px] uppercase text-[#666666]">
              Directed by Example Director • 120 min • 2026
            </div>
            
            <div className="font-sans font-light text-base sm:text-lg sm:leading-relaxed text-[#222222] max-w-[600px]">
              This is a fantastic static placeholder review text for our first mockup movie. Later we will load the real review from the database.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
