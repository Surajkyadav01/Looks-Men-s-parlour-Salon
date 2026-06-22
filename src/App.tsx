import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Menu, 
  X, 
  Phone, 
  Bell, 
  Star, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  PhoneCall,
  Clock,
  ArrowUpRight,
  Database,
  Award,
  BookOpen
} from 'lucide-react';

import { SERVICES_DATA, SALON_INFO, REVIEWS } from './data/salonData';
import { Booking, ServiceItem, AdminNotification, ContactMessage } from './types';

// Importing Custom Sub-components
import Hero from './components/Hero';
import Services from './components/Services';
import BookingFlow from './components/BookingFlow';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Mobile responsive menu trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to sticky header change state
  const [scrolled, setScrolled] = useState(false);

  // Service selected in the Menu to prefill booking
  const [selectedPreloadService, setSelectedPreloadService] = useState<{
    categoryName: string;
    service: ServiceItem;
  } | null>(null);

  // Admin Logs Core State (with realistic seed data)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const cached = localStorage.getItem('looks_bookings');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) { }
    }
    return [
      {
        id: "LM_824103",
        customerName: "Ankit Baghel",
        customerPhone: "9140488710",
        serviceCategory: "Hair Care & Styling",
        serviceName: "Signature Hair Spa (L'Oreal)",
        servicePrice: 899,
        date: "June 22, 2026",
        timeSlot: "11:00 AM",
        status: "confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "LM_503719",
        customerName: "Karan Yadav",
        customerPhone: "8896847120",
        serviceCategory: "Personal Grooming",
        serviceName: "Royal Groom Combo (Men)",
        servicePrice: 1199,
        date: "June 24, 2026",
        timeSlot: "04:00 PM",
        status: "confirmed",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const cached = localStorage.getItem('looks_notifications');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
    return [
      {
        id: "notif_seed_1",
        type: "booking",
        title: "Welcome to Look's Men's Parlour & Salon CRM",
        message: "Your premium automated alert channel is active. Future styling requests populate here in real-time.",
        timestamp: "10:00 AM " + new Date().toLocaleDateString(),
        read: false,
        meta: {
          customerName: "System Administrator",
          details: "Gateway Server Online"
        }
      }
    ];
  });

  // Reviews state with localStorage persist
  const [reviews, setReviews] = useState(() => {
    const cached = localStorage.getItem('looks_reviews');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
    return REVIEWS;
  });

  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Admin drawer state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const hasParam = typeof window !== 'undefined' && 
      (window.location.search.includes('admin=true') || window.location.hash.includes('admin'));
    if (hasParam) {
      localStorage.setItem('looks_admin_unlocked', 'true');
      return true;
    }
    return localStorage.getItem('looks_admin_unlocked') === 'true';
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = adminPasswordInput.trim();
    if (trimmed === 'looks2026' || trimmed === 'looks93' || trimmed === 'admin') {
      localStorage.setItem('looks_admin_unlocked', 'true');
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setAdminPasswordInput("");
      setPasswordError("");
      handleOpenAdminPanel();
    } else {
      setPasswordError("Incorrect password! Please try 'looks2026'.");
    }
  };

  const handleAdminClick = () => {
    setShowPasswordModal(true);
  };

  useEffect(() => {
    const checkAdmin = () => {
      const hasParam = window.location.search.includes('admin=true') || window.location.hash.includes('admin');
      if (hasParam) {
        localStorage.setItem('looks_admin_unlocked', 'true');
        setIsAdminMode(true);
      }
    };
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, []);

  // Active toast element for instant visual admin alert notification
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
    type: 'booking' | 'contact';
  } | null>(null);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('looks_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('looks_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('looks_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Listener to track sticky header bg effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When a user selects a service on the Services List
  const handleSelectServiceForBooking = (categoryName: string, service: ServiceItem) => {
    setSelectedPreloadService({ categoryName, service });
    
    // Smooth scroll down to the date picker instantly
    const targetElement = document.getElementById('booking');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Callback when a booking completes successfully
  const handleBookingSuccess = (newBooking: Booking, newNotifications: AdminNotification[]) => {
    setBookings(prev => [newBooking, ...prev]);
    setNotifications(prev => [...newNotifications, ...prev]);

    // Show beautiful toast notification representation
    setActiveToast({
      title: "🛎️ Automated Admin Alert",
      message: `${newBooking.customerName}'s reservation for ${newBooking.serviceName} dispatched to manager desk.`,
      type: 'booking'
    });

    // Auto dismiss toast after 5 seconds
    setTimeout(() => {
      setActiveToast(null);
    }, 5500);
  };

  // Callback when a user dispatches contact messages
  const handleContactSubmit = (message: ContactMessage, notif: AdminNotification) => {
    setNotifications(prev => [notif, ...prev]);

    // Show toast for contact message
    setActiveToast({
      title: "🛎️ Automated Admin Enquiry",
      message: `${message.name} dispatched a message query.`,
      type: 'contact'
    });

    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  // Callback when a user submits a review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    setIsReviewSubmitting(true);
    
    setTimeout(() => {
      const addedReview = {
        name: newReviewAuthor.trim(),
        rating: newReviewRating,
        text: newReviewText.trim(),
        ref: "Verified Client"
      };

      setReviews(prev => [addedReview, ...prev]);

      // Dynamic Admin Notification dispatch
      const timestampStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();
      const notif: AdminNotification = {
        id: "notif_rev_" + Math.random().toString(36).substr(2, 9),
        type: 'contact', // log in message center
        title: `New ${newReviewRating}★ Review Received`,
        message: `${newReviewAuthor.trim()} submitted feedback: "${newReviewText.trim().substring(0, 45)}${newReviewText.trim().length > 45 ? '...' : ''}"`,
        timestamp: timestampStr,
        read: false,
        meta: {
          customerName: newReviewAuthor.trim(),
          details: `Client rating: ${newReviewRating} / 5 Stars`
        }
      };

      setNotifications(prev => [notif, ...prev]);

      // Trigger visual alert
      setActiveToast({
        title: "🛎️ Automated Review Dispatched",
        message: `${newReviewAuthor.trim()} shared a ${newReviewRating}-star experience.`,
        type: 'contact'
      });

      // Reset states
      setIsReviewSubmitting(false);
      setReviewSuccess(true);
      setNewReviewAuthor("");
      setNewReviewText("");
      setNewReviewRating(0);

      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewForm(false);
        setActiveToast(null);
      }, 3000);

    }, 1200);
  };

  // Admin status manager actions
  const handleUpdateBookingStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const hasUnreadAlerts = notifications.some(n => !n.read);

  // Mark all as read when opening pane
  const handleOpenAdminPanel = () => {
    setIsAdminOpen(true);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden relative">
      
      {/* LUXURY BACKGROUND DESIGN DETAILS */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[#d4af37]/5 via-zinc-950/20 to-black pointer-events-none z-0" />

      {/* STICKY LUXURY HEADER */}
      <header 
        id="header"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-md py-3.5 border-zinc-900' 
            : 'bg-transparent py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo Brand with custom "Look's Men's Parlour & Salon" style info */}
          <a href="#home" className="flex items-center gap-2.5 group select-none">
            <motion.div 
              className="relative"
              animate={{
                y: [0, -2, 0],
              }}
              whileHover={{ 
                scale: 1.05,
                y: -3,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 2.8,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full bg-zinc-950 border border-[#c59246]/45 flex items-center justify-center text-[#c59246] transition-colors duration-300"
                animate={{
                  borderColor: ["rgba(197, 146, 70, 0.35)", "rgba(197, 146, 70, 0.75)", "rgba(197, 146, 70, 0.35)"],
                  boxShadow: [
                    "0 0 0px rgba(197, 146, 70, 0)",
                    "0 0 8px rgba(197, 146, 70, 0.35)",
                    "0 0 0px rgba(197, 146, 70, 0)"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="rotate-90 text-[#c59246] flex items-center justify-center"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 0px rgba(197, 146, 70, 0))",
                      "drop-shadow(0 0 4px rgba(197, 146, 70, 0.75))",
                      "drop-shadow(0 0 0px rgba(197, 146, 70, 0))"
                    ],
                    scale: [1, 1.04, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    ease: "easeInOut"
                  }}
                >
                  <Scissors size={18} />
                </motion.div>
              </motion.div>
            </motion.div>
            <div>
              <span className="font-serif font-black text-base md:text-lg uppercase tracking-wider text-white block">
                Look's <span className="text-[#c59246]">Men's</span>
              </span>
              <span className="text-[9px] text-zinc-500 tracking-widest font-mono uppercase block font-semibold -mt-0.5">
                Parlour & Salon
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link options - Sleek standard font */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-sans font-medium tracking-wide text-zinc-300">
            <a href="#home" className="hover:text-[#c59246] transition-colors">Home</a>
            <a href="#services" className="hover:text-[#c59246] transition-colors">Services</a>
            <a href="#gallery" className="hover:text-[#c59246] transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-[#c59246] transition-colors">Contact</a>
          </nav>

          {/* Right Header Controls (Admin Gateway, Phones, Booking Callout) */}
          <div className="flex items-center gap-4">
            
            {/* Phone direct line */}
            <a 
              href={`tel:${SALON_INFO.phone1}`} 
              className="hidden lg:flex items-center gap-1.5 text-[13px] font-sans font-bold text-white hover:text-[#c59246] transition-colors shrink-0"
            >
              <PhoneCall size={14} className="text-[#c59246] fill-[#c59246]/10" />
              <span>{SALON_INFO.phone1}</span>
            </a>

            {/* Quick Live CRM Alert System - Always visible, prompts for password */}
            <button
              onClick={handleAdminClick}
              className="relative p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-[#c59246] transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Admin Panel Gateway - Booked Appointments"
            >
              <Bell size={15} className={bookings.length > 0 ? "text-amber-400 animate-pulse" : "text-zinc-400"} />
              {bookings.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-zinc-950 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                  {bookings.length}
                </span>
              )}
            </button>

            {/* Book an Appointment Solid CTA Button */}
            <a
              href="#booking"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#c59246] hover:bg-[#b07d35] text-white font-bold text-xs tracking-wide transition-all duration-300 shadow-md uppercase shrink-0"
            >
              Book appointment
            </a>

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* RESPONSIVE MOBILE EXPAND DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-zinc-950 border-b border-zinc-900 px-4 py-4 space-y-3 relative z-50 text-center font-mono text-xs uppercase"
            >
              <a 
                href="#home" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-zinc-300 hover:text-amber-400"
              >
                Home
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-zinc-300 hover:text-amber-400"
              >
                Services Menu
              </a>
              <a 
                href="#booking" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-zinc-300 hover:text-amber-400"
              >
                Reserve Appointment
              </a>
              <a 
                href="#gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-zinc-300 hover:text-amber-400"
              >
                Our Gallery
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-zinc-300 hover:text-amber-400"
              >
                Location & Footer
              </a>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="w-full text-center block py-2 text-amber-500 font-bold hover:text-amber-400 cursor-pointer"
              >
                🗝️ Admin Panel
              </button>
              <div className="pt-2 border-t border-zinc-900 flex justify-center gap-4">
                <a 
                  href={`tel:${SALON_INFO.phone1}`} 
                  className="flex items-center gap-1.5 text-amber-400 py-1"
                >
                  <Phone size={12} />
                  {SALON_INFO.phone1}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE COMPONENT SECTIONS */}
      <main className="relative z-10">
        
        {/* HERO */}
        <Hero 
          onBookClick={() => {
            const targetElement = document.getElementById('booking');
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onServicesClick={() => {
            const targetElement = document.getElementById('services');
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* COMPREHENSIVE BRAND KEYWORDS CALLOUT ROW */}
        <div className="bg-zinc-950 border-t border-b border-zinc-900/60 py-6">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto whitespace-nowrap text-xs font-mono uppercase text-zinc-400 tracking-widest flex items-center justify-between gap-8 no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>Premium Hair Stylists</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>Airbrush HD Makeup Experts</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>O3+ Facial skin therapies</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>Sanitized Grooming Combos</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span>Family Centered Space</span>
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <Services 
          onSelectServiceForBooking={handleSelectServiceForBooking}
        />

        {/* BOOKING SYSTEM FLOW */}
        <BookingFlow 
          selectedPreloadService={selectedPreloadService}
          onBookingSuccess={handleBookingSuccess}
        />

        {/* DYNAMIC GOOGLE MAP MAPS & REVIEWS SECTION */}
        <section className="py-24 bg-zinc-900/40 border-t border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            
            <div className="text-center max-w-lg mx-auto mb-12 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono block">Client Testimonials</span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-200">The Suriyawan Vibe</h2>
                <p className="text-xs text-zinc-500 font-mono mt-1">Real reviews left by our clients directly in Suriyawan, UP</p>
              </div>

              {/* Add Feedback button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-amber-500/30 text-[#d4af37] font-semibold text-[11px] tracking-wider uppercase transition-all flex items-center gap-2 mx-auto hover:border-amber-500 hover:scale-103 cursor-pointer shadow-lg"
                >
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {showReviewForm ? "Close Form" : "Share Your Experience / Rate us"}
                </button>
              </div>
            </div>

            {/* Expandable Review submission form panel */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-12"
                >
                  <div className="max-w-md mx-auto bg-[#0b0b0c] border border-amber-500/15 p-4 sm:p-5 rounded-2xl shadow-2xl space-y-4 relative text-left">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-serif font-semibold text-zinc-100 flex items-center gap-2">
                        <Sparkles size={13} className="text-amber-400" />
                        Write a Verified Review
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono">Feedback is published instantly onto our live community wall.</p>
                    </div>

                    {reviewSuccess ? (
                      <div className="py-6 text-center space-y-3">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-100">Submitted Successfully!</h4>
                        <p className="text-[11px] text-zinc-400">Thank you for rating our salon. Your support is cherished.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                        {/* Interactive Star Giver Widget */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono block">Satisfied star rating <span className="text-amber-500 font-bold">*</span></label>
                          <div className="flex gap-2 items-center bg-zinc-950/80 px-3 py-2 rounded-lg border border-zinc-900 inline-flex">
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((starValue) => {
                                const isFilled = starValue <= (hoverRating ?? newReviewRating);
                                return (
                                  <button
                                    key={starValue}
                                    type="button"
                                    onClick={() => setNewReviewRating(starValue)}
                                    onMouseEnter={() => setHoverRating(starValue)}
                                    onMouseLeave={() => setHoverRating(null)}
                                    className="focus:outline-none transition-all hover:scale-125 cursor-pointer p-0.5 bg-transparent border-none"
                                    title={`Rate ${starValue} Stars`}
                                  >
                                    <Star 
                                      size={18} 
                                      className={`transition-all duration-100 ${
                                        isFilled 
                                          ? 'text-amber-400' 
                                          : 'text-zinc-800'
                                      }`}
                                      fill={isFilled ? "#D4AF37" : "none"}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-[10px] font-mono text-amber-500 font-bold ml-2">
                              {newReviewRating > 0 ? (
                                <span>
                                  {newReviewRating}.0 (
                                  {newReviewRating === 1 && "Poor"}
                                  {newReviewRating === 2 && "Fair"}
                                  {newReviewRating === 3 && "Good"}
                                  {newReviewRating === 4 && "Very Good"}
                                  {newReviewRating === 5 && "Excellent!"}
                                  )
                                </span>
                              ) : (
                                <span className="text-zinc-500 font-medium italic">Click to Rate</span>
                              )}
                            </span>
                          </div>
                          {newReviewRating === 0 && (
                            <span className="text-[9px] text-amber-500/80 font-mono block mt-1">Please tap/click a star above to rate your stay.</span>
                          )}
                        </div>

                        {/* Name input */}
                        <div className="space-y-1">
                          <label className="text-xxs text-zinc-400 uppercase tracking-wider font-mono block">Your Name <span className="text-amber-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Suraj Yadav"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            className="w-full bg-zinc-950 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-850 focus:border-amber-550 focus:outline-none placeholder-zinc-700 text-xs transition-all"
                          />
                        </div>

                        {/* Text comment */}
                        <div className="space-y-1">
                          <label className="text-xxs text-zinc-400 uppercase tracking-wider font-mono block">Review Comments <span className="text-amber-500">*</span></label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Share some words on your grooming style & service experience..."
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            className="w-full bg-zinc-950 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-850 focus:border-amber-550 focus:outline-none placeholder-zinc-700 text-xs transition-all resize-none font-sans"
                          />
                        </div>

                        {/* Submit Button handles */}
                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-3.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-semibold cursor-pointer transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isReviewSubmitting || !newReviewAuthor.trim() || !newReviewText.trim() || newReviewRating === 0}
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-amber-500 hover:scale-[1.02] text-zinc-950 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isReviewSubmitting ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev, index) => (
                <div 
                  key={index}
                  className="bg-[#0b0b0c]/80 p-4 rounded-xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between hover:border-amber-500/20 transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    {/* Star row */}
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="#D4AF37" className="text-amber-500" />
                      ))}
                    </div>

                    <p className="text-[11.5px] leading-relaxed text-zinc-350 italic font-sans">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-zinc-900/60 mt-3.5 flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-zinc-350">{rev.name}</span>
                    <span className="text-zinc-[500] font-mono text-[9px] bg-zinc-950 py-0.5 px-1.5 rounded border border-zinc-900">{rev.ref}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Seals badge footer */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center border-t border-zinc-850 pt-10">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={28} className="text-amber-500" />
                <h4 className="text-sm font-bold font-serif text-zinc-200">Hydrated & Sanitized</h4>
                <p className="text-xs text-zinc-500">All tools underwent UV sterilization cycles after single use.</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Crown size={28} className="text-amber-500" />
                <h4 className="text-sm font-bold font-serif text-zinc-200">Exclusive Luxury Brands</h4>
                <p className="text-xs text-zinc-500">Only L&apos;Oreal, Rica, O3+, and Lotus salon series handled on clients.</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Award size={28} className="text-amber-500" />
                <h4 className="text-sm font-bold font-serif text-zinc-200">Certified Stylists</h4>
                <p className="text-xs text-zinc-500">Experts trained periodically under modern Indian beauty conventions.</p>
              </div>
            </div>

          </div>
        </section>

        {/* INSTAGRAM PHOTO WORK COLLAGE */}
        <InstagramFeed />

        {/* FOOTER & ADDRESS (Includes contact query triggering notifications) */}
        <Footer 
          onContactSubmit={handleContactSubmit}
        />

      </main>

      {/* FLOATING ADMIN DISPATCH TRIGGER NOTIFICATION (Toast alerts) */}
      <AnimatePresence>
        {isAdminMode && activeToast && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-zinc-950 border-2 border-[#d4af37] p-4 rounded-xl shadow-2xl flex items-start gap-3.5 cursor-pointer"
            onClick={handleAdminClick}
          >
            {/* Quick animated circular light */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bell size={18} className="animate-bounce" />
              </div>
              <span className="absolute -top-1 -right-0.5 w-3 h-3 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
            </div>

            <div className="space-y-1 text-left">
              <h4 className="text-xs font-bold font-mono uppercase text-[#d4af37] tracking-wider">
                {activeToast.title}
              </h4>
              <p className="text-xs text-zinc-200 font-light leading-snug">
                {activeToast.message}
              </p>
              <span className="text-[9px] text-zinc-500 font-mono inline-block underline pt-1">
                Click to inspect full JSON payload details &rarr;
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* PASSWORD PROTECTION DIALOG/MODAL FOR ADMIN GATEWAY */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordModal(false);
                setAdminPasswordInput("");
                setPasswordError("");
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              id="admin-password-backdrop"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#121213] border border-[#c59246]/40 p-6 md:p-8 rounded-2xl shadow-2xl z-10 text-center font-sans space-y-5"
              id="admin-password-container"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-[#c59246]/50 flex items-center justify-center text-[#c59246]">
                <Database size={20} />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-serif text-lg md:text-xl font-bold uppercase tracking-wider text-white">
                  Admin Gateway Portal
                </h3>
                <p className="text-zinc-500 text-xs">
                  Enter Salon management credentials to access active bookings list, modify schedules & configure automated notifications.
                </p>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                    Access Code:
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter admin password..."
                    className="w-full bg-zinc-950 text-zinc-100 px-4 py-3 rounded-lg border border-zinc-800 focus:border-amber-500 focus:outline-[#c59246] text-sm transition-all focus:ring-1 focus:ring-amber-500"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1">
                      ⚠️ {passwordError}
                    </p>
                  )}
                  <p className="text-[10px] text-zinc-500 font-mono italic mt-2 block">
                    Hint: Use password <span className="text-[#c59246] font-bold">looks2026</span> to unlock this portal.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setAdminPasswordInput("");
                      setPasswordError("");
                    }}
                    className="flex-1 py-2.5 rounded-lg border border-zinc-850 hover:bg-zinc-900 text-zinc-300 transition-all font-bold text-xs uppercase cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-[#c59246] hover:bg-[#b07d35] text-white transition-all font-bold text-xs uppercase shadow-md cursor-pointer text-center"
                  >
                    Verify & Enter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN CONTROLLER LOG PANEL DRAWER */}
      <AdminPanel 
        bookings={bookings}
        notifications={notifications}
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setIsAdminMode(false);
          localStorage.removeItem('looks_admin_unlocked');
        }}
        onClearAll={handleClearNotifications}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onDeleteBooking={handleDeleteBooking}
      />

    </div>
  );
}
