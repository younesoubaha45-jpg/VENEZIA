interface HeroProps {
  onExplore?: () => void;
}

export default function Hero({}: HeroProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#17120F] via-[#2A1F17] to-[#120F0D] text-white shadow-lg border border-amber-900/30">
        
        {/* Subtle decorative gold light glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-700/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 items-center relative z-10 min-h-[140px] sm:min-h-[170px] md:min-h-[190px]">
          
          {/* Main Hero Branding - Ultra Clean with Large VENEZIA Shoes */}
          <div className="p-6 sm:p-8 md:p-10 md:col-span-7 z-10 flex flex-col justify-center items-start">
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.14em] sm:tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8EE] via-[#F6D88B] to-[#D4A346] drop-shadow-md leading-none select-none dir-ltr">
              VENEZIA Shoes
            </h1>
          </div>

          {/* Boutique Showcase Image Representing Site Goal */}
          <div className="md:col-span-5 h-44 sm:h-48 md:h-full relative overflow-hidden flex items-center justify-center">
            <img
              src="/src/assets/images/venezia_boutique_showcase_1790976242293.jpg"
              alt="معرض VENEZIA Shoes"
              referrerPolicy="no-referrer"
              className="w-full h-full min-h-[160px] md:min-h-[190px] object-cover object-center md:scale-105 hover:scale-110 transition-transform duration-700"
            />
            {/* Smooth overlay gradient blend */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#17120F] md:from-[#2A1F17]/90 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
}
