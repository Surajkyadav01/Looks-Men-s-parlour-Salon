import { motion } from 'motion/react';
import { Star, Users, Award, ChevronDown, Scissors } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface HeroProps {
  onBookClick: () => void;
  onServicesClick: () => void;
}

export default function Hero({ onBookClick, onServicesClick }: HeroProps) {
  // A gorgeous professional dark luxurious salon image with beautiful lighting & premium chairs
  const bgUrl = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1800";

  return (
    <div id="home" className="relative min-h-[95vh] flex items-center justify-start overflow-hidden bg-black text-white px-4 md:px-12 lg:px-24 pt-20">
      {/* Dynamic Gold Radial Glow Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_left_center,rgba(197,146,70,0.15),transparent_70%)] opacity-95" />

      {/* Styled background image with zoom transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 z-0 scale-100 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/80 z-0 pointer-events-none" />

      {/* Content wrapper - LEFT ALIGNED to match Screenshot 1 */}
      <div className="relative z-10 max-w-3xl text-left space-y-8 w-full mt-10 md:mt-16">
        
        {/* Animated Brand Badge - Matches Screenshot Subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#c59246]"
        >
          <Scissors size={14} className="text-[#c59246] rotate-90" />
          <span>TOP BEAUTY PARLOUR IN SURIYAWAN</span>
        </motion.div>

        {/* Title & Catchy Typography - Matches style and golden "Salon" text of Screenshot 1 */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold font-serif tracking-tight leading-[1.05] text-white"
          >
            Look's <br />
            <span className="text-[#c59246] font-serif font-bold">
              Men's Parlour & Salon
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-zinc-300 max-w-xl text-base sm:text-lg md:text-xl font-light tracking-wide leading-relaxed"
          >
            {SALON_INFO.tagline}
          </motion.p>
        </div>

        {/* Action CTAs - Align side-by-side matching Screenshot 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          <button
            onClick={onBookClick}
            className="px-8 py-3.5 rounded-full bg-[#c59246] hover:bg-[#b07d35] text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-500/10 transition-all duration-300 active:scale-95 transform cursor-pointer text-center"
          >
            Book Appointment
          </button>
          
          <button
            onClick={onServicesClick}
            className="px-8 py-3.5 rounded-full bg-transparent hover:bg-[#c59246]/10 text-white font-medium text-sm tracking-wide border border-[#c59246] transition-all duration-300 active:scale-95 transform cursor-pointer text-center"
          >
            View Services
          </button>
        </motion.div>

        {/* Trust Badges & Metrics - Matches Screenshot 2 Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-3 md:gap-6 bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 md:p-6 backdrop-blur-md max-w-2xl border-t-2 border-t-[#c59246]/40"
        >
          {/* Badge 1: Customer Rating */}
          <div className="flex items-center gap-3 pr-2 border-r border-zinc-800/80">
            <div className="p-2.5 rounded-xl bg-amber-500/5 text-[#c59246] shrink-0 hidden sm:block">
              <Star size={20} fill="#c59246" className="text-[#c59246]" />
            </div>
            <div>
              <span className="font-serif font-black text-sm sm:text-lg md:text-xl text-zinc-100 block tracking-tight">4.9/5</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-medium block">Rating</span>
            </div>
          </div>

          {/* Badge 2: Happy Clients */}
          <div className="flex items-center gap-3 px-1 md:px-2 pr-2 border-r border-zinc-800/80">
            <div className="p-2.5 rounded-xl bg-amber-500/5 text-[#c59246] shrink-0 hidden sm:block">
              <Users size={20} className="text-[#c59246]" />
            </div>
            <div>
              <span className="font-serif font-black text-sm sm:text-lg md:text-xl text-zinc-100 block tracking-tight">10,000+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-medium block">Clients</span>
            </div>
          </div>

          {/* Badge 3: Years Experience */}
          <div className="flex items-center gap-3 pl-1 md:pl-2">
            <div className="p-2.5 rounded-xl bg-amber-500/5 text-[#c59246] shrink-0 hidden sm:block">
              <Award size={20} className="text-[#c59246]" />
            </div>
            <div>
              <span className="font-serif font-black text-sm sm:text-lg md:text-xl text-zinc-100 block tracking-tight">15+ Years</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-medium block">Experience</span>
            </div>
          </div>
        </motion.div>

        {/* Decorative Down Arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="pt-4 flex text-zinc-500 pointer-events-none justify-start"
        >
          <ChevronDown size={22} className="text-[#c59246]/50" />
        </motion.div>

      </div>
    </div>
  );
}
