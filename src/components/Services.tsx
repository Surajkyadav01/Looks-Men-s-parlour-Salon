import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Sparkles, 
  Sparkle, 
  Heart, 
  Hand, 
  UserCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Search,
  Palette,
  Plus,
  Minus,
  Focus
} from 'lucide-react';
import { SERVICES_DATA } from '../data/salonData';
import { ServiceCategory, ServiceItem } from '../types';

const CategoryIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  switch (iconName) {
    case 'Scissors':
      return <Scissors className={className} size={26} strokeWidth={1.5} />;
    case 'Sparkles':
      return <Sparkles className={className} size={26} strokeWidth={1.5} />;
    case 'Focus':
      return <Focus className={className} size={26} strokeWidth={1.5} />;
    case 'Palette':
      return <Palette className={className} size={26} strokeWidth={1.5} />;
    case 'Hand':
      return <Hand className={className} size={26} strokeWidth={1.5} />;
    case 'UserCheck':
      return <UserCheck className={className} size={25} strokeWidth={1.5} />;
    default:
      return <Sparkles className={className} size={26} strokeWidth={1.5} />;
  }
};

const TREATMENT_COUNTS: Record<string, string> = {
  "hair-care": "12 treatments",
  "facial-skin": "20 treatments",
  "hair-removal": "20 treatments",
  "beauty-makeup": "6 treatments",
  "nail-care": "5 treatments",
  "personal-grooming": "3 treatments"
};

interface ServicesProps {
  onSelectServiceForBooking: (categoryName: string, service: ServiceItem) => void;
  highlightedCategory?: string;
}

export default function Services({ onSelectServiceForBooking, highlightedCategory }: ServicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    SERVICES_DATA.forEach(c => {
      all[c.id] = true;
    });
    setExpandedCategories(all);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Perform client-side filter matching both on Category Names and individual Service Titles
  const filteredCategories = SERVICES_DATA.map(category => {
    const matchedItems = category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isCategoryMatched = category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              category.description.toLowerCase().includes(searchQuery.toLowerCase());

    const finalItems = isCategoryMatched ? category.items : matchedItems;

    return {
      ...category,
      items: finalItems,
      hasMatches: finalItems.length > 0
    };
  }).filter(c => c.hasMatches);

  // Ordered Category IDs to mimic Screenshot 3 exact layout sequence
  const ORDERED_IDS = [
    "facial-skin",
    "hair-removal",
    "hair-care",
    "beauty-makeup",
    "nail-care",
    "personal-grooming"
  ];

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const idxA = ORDERED_IDS.indexOf(a.id);
    const idxB = ORDERED_IDS.indexOf(b.id);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  return (
    <section id="services" className="py-24 bg-zinc-950 text-white scroll-mt-12 relative border-t border-zinc-900">
      <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-widest text-[#c59246] font-mono font-bold block"
          >
            Look's Exquisite Menu
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-serif text-zinc-100 font-bold tracking-tight"
          >
            Our Services
          </motion.h2>
          <p className="text-zinc-400 font-light text-sm max-w-lg mx-auto">
            Explore our curated luxury menu for haircuts, deep facials, skin care, bridal packages, and hair transformations.
          </p>
        </div>

        {/* Search & Collapse Control Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-[#111112] p-4 rounded-2xl border border-zinc-900 backdrop-blur-md">
          {/* Brand Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search services (e.g., haircut, facial, Rica wax)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] text-zinc-200 pl-10 pr-4 py-2 rounded-xl border border-zinc-850 focus:border-[#c59246] focus:outline-none focus:ring-1 focus:ring-[#c59246]/40 placeholder-zinc-500 transition-all font-sans text-xs"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={expandAll}
              className="px-4 py-2 text-xxs tracking-wider uppercase font-mono text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg border border-zinc-855 hover:border-zinc-700 transition-all cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 text-xxs tracking-wider uppercase font-mono text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg border border-zinc-855 hover:border-zinc-700 transition-all cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Categories Grid - 3-column layout precisely replicating the structure under Screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 items-start">
          {sortedCategories.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 bg-zinc-900/20 rounded-2xl border border-zinc-900 col-span-full">
              <Sparkles size={36} className="mx-auto text-zinc-700 mb-3" />
              <p className="font-semibold text-lg text-zinc-300">No services found</p>
              <p className="text-xs text-zinc-650 mt-1">Try typing another treatment name or clearing your search.</p>
            </div>
          ) : (
            sortedCategories.map((category) => {
              const isOpen = !!expandedCategories[category.id];
              // Map the standard icon to the requested ones for Look's Salon
              let resolvedIconName = category.iconName;
              if (category.id === 'hair-removal') resolvedIconName = 'Focus';
              if (category.id === 'beauty-makeup') resolvedIconName = 'Palette';

              return (
                <div 
                  key={category.id}
                  id={`cat-card-${category.id}`}
                  className="w-full flex flex-col transition-all duration-300 animate-fade-in"
                >
                  {/* Category Header Row - Borderless minimalist card like Screenshot 3 */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between py-5 text-left cursor-pointer select-none group border-b border-zinc-900 hover:border-[#c59246]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      {/* Premium Gold Silhouette Icon */}
                      <div className="text-[#c59246] group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <CategoryIcon iconName={resolvedIconName} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-[17px] font-serif font-bold text-zinc-100 group-hover:text-[#c59246] transition-colors leading-snug">
                          {category.name}
                        </h3>
                        <p className="text-xs font-sans text-zinc-500 mt-1 font-medium leading-none">
                          {TREATMENT_COUNTS[category.id] || "10 treatments"}
                        </p>
                      </div>
                    </div>

                    <div className="text-[#c59246]/85 group-hover:text-white transition-colors p-1 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                      {isOpen ? <Minus size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
                    </div>
                  </button>

                  {/* Collapsible Treatment List */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="py-2 bg-zinc-900/15 border-b border-zinc-900/30 rounded-b-xl px-2">
                          <div className="divide-y divide-zinc-900/60">
                            {category.items.map((service) => (
                              <div 
                                key={service.id} 
                                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/item hover:bg-zinc-900/10 px-2 rounded-lg"
                              >
                                {/* Left details */}
                                <div className="space-y-1 max-w-[80%]">
                                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                                    <h4 className="text-xs sm:text-xs font-bold text-zinc-200 group-hover/item:text-white transition-colors">
                                      {service.name}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 bg-zinc-950 text-zinc-500 text-[9px] font-mono px-1.5 py-0.5 rounded border border-zinc-900">
                                      <Clock size={8} />
                                      {service.duration}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                                    {service.description}
                                  </p>
                                </div>

                                {/* Right booking actionable */}
                                <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-1.5 sm:pt-0 shrink-0">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-[#c59246] font-sans">
                                      ₹{service.price}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => onSelectServiceForBooking(category.name, service)}
                                    className="px-2.5 py-1 rounded-full bg-transparent hover:bg-[#c59246] border border-[#c59246] hover:border-[#c59246] text-white hover:text-black text-[9px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
                                  >
                                    Book
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Feature Banner: Pure luxury callout */}
        <div className="mt-16 bg-[#111112] max-w-4xl mx-auto p-6 rounded-2xl border border-zinc-900 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#c59246]/40 to-transparent" />
          <p className="text-[#c59246] font-mono text-xxs tracking-widest uppercase font-black mb-1 p-0.5">Exclusive Salon Perks Included</p>
          <p className="text-zinc-400 text-[13px] font-light max-w-3xl mx-auto leading-relaxed">
            All premium treatments include our Signature herbal tea/coffee, scalp health check, personalized after-care consult, and strictly sanitized styling sheets.
          </p>
        </div>

        {/* AVAILABLE FOR Section from Screenshot 3 */}
        <div className="mt-20 pt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-[32px] font-serif text-white font-bold tracking-tight">
              Available For
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            <div className="px-6 py-2.5 rounded-full bg-[#111112] border border-zinc-900 hover:border-[#c59246]/10 text-zinc-300 font-serif text-sm tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-default select-none group">
              <span className="text-[#c59246] text-xs">👑</span>
              <span>Women</span>
            </div>
            <div className="px-6 py-2.5 rounded-full bg-[#111112] border border-zinc-900 hover:border-[#c59246]/10 text-zinc-300 font-serif text-sm tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-default select-none group">
              <span className="text-[#c59246] text-xs">💎</span>
              <span>Men</span>
            </div>
            <div className="px-6 py-2.5 rounded-full bg-[#111112] border border-zinc-900 hover:border-[#c59246]/10 text-zinc-300 font-serif text-sm tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-default select-none group">
              <span className="text-[#c59246] text-xs">🤎</span>
              <span>Unisex Services</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
