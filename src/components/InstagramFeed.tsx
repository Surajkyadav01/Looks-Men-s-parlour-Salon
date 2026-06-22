import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/salonData';

const SEARCH_TABS = ["All", "Shop", "Styling", "Grooming", "Equipment"];

export default function InstagramFeed() {
  const [activeTab, setActiveTab] = useState("All");

  // Keep track of user likes
  const [likesState, setLikesState] = useState<Record<number, { likes: number; liked: boolean }>>({
    0: { likes: 324, liked: false },
    1: { likes: 512, liked: false },
    2: { likes: 418, liked: false },
    3: { likes: 219, liked: false },
    4: { likes: 602, liked: false },
    5: { likes: 350, liked: false },
    6: { likes: 189, liked: false },
    7: { likes: 440, liked: false }
  });

  const handleLike = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesState(prev => {
      const current = prev[idx] || { likes: 100, liked: false };
      return {
        ...prev,
        [idx]: {
          likes: current.liked ? current.likes - 1 : current.likes + 1,
          liked: !current.liked
        }
      };
    });
  };

  // Filter images based on active tab selection
  const filteredImages = GALLERY_IMAGES.filter(img => 
    activeTab === "All" || img.category.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <section id="gallery" className="py-24 bg-zinc-950 text-white relative border-t border-zinc-900 scroll-mt-12">
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-[#d4af37]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Title and Badge */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono font-bold flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Visual Portfolio
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-zinc-100 font-bold transition-all">Our Gallery</h2>
          <p className="text-zinc-400 font-light text-sm">
            Step into the premium styling space of Look's Men's Parlour & Salon. Explore real unedited captures of our modern salon workspace, styling haircuts, and custom groom treatments.
          </p>
        </div>

        {/* Categories Tab Row (from Screenshot 3 & 4) */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
          {SEARCH_TABS.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#c59246] hover:bg-[#b07d35] font-bold text-zinc-950 border-[#c59246] shadow-lg'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => {
               const originalIdx = GALLERY_IMAGES.findIndex(g => g.url === img.url);
               const hasLiked = likesState[originalIdx]?.liked;
               const currentLikes = likesState[originalIdx]?.likes || 120;
               const commentsCount = [18, 34, 25, 12, 42, 19, 9, 31][originalIdx % 8];

               return (
                 <motion.div
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.4 }}
                   key={img.url}
                   className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 shadow-xl border-2 border-zinc-850 hover:border-[#c59246]/40 hover:scale-[1.01] transition-all duration-300"
                 >
                   {/* Photo - Bright and clearly visible */}
                   <img
                     src={img.url}
                     alt={img.title}
                     referrerPolicy="no-referrer"
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />

                   {/* Extremely subtle dark bottom overlay to read text/meta, keeping the image fully visible */}
                   <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                   {/* Top-right subtle overlay to keep info readable */}
                   <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

                   {/* Meta Contents */}
                   <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                     
                     {/* Category tag */}
                     <div className="flex justify-between items-center">
                       <span className="bg-[#c59246] text-black text-[9px] font-mono tracking-widest font-black uppercase py-0.5 px-2.5 rounded shadow-sm">
                         {img.category}
                       </span>
                       <ImageIcon size={14} className="text-amber-400 drop-shadow-md" />
                     </div>

                     {/* Metadata & Reactions */}
                     <div className="space-y-2">
                       <h4 className="text-sm font-serif font-bold text-zinc-100 drop-shadow-md line-clamp-2 leading-snug">
                         {img.title}
                       </h4>

                       <div className="flex items-center gap-4 text-xs font-mono text-zinc-300 pt-1">
                         {/* Likes */}
                         <button
                           onClick={(e) => handleLike(originalIdx, e)}
                           className="flex items-center gap-1 px-1 py-0.5 rounded hover:text-red-400 transition-all cursor-pointer z-20"
                           title="Like image"
                         >
                           <Heart 
                             size={14} 
                             fill={hasLiked ? "#f87171" : "none"} 
                             className={hasLiked ? "text-red-400 scale-110" : "text-zinc-300"} 
                           />
                           <span>{currentLikes}</span>
                         </button>

                         {/* Comments */}
                         <div className="flex items-center gap-1">
                           <MessageCircle size={14} />
                           <span>{commentsCount} comments</span>
                         </div>
                       </div>
                     </div>

                   </div>
                 </motion.div>
               );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
