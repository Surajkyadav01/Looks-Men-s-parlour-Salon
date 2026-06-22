import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  PhoneCall,
  Navigation
} from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { ContactMessage, AdminNotification } from '../types';

interface FooterProps {
  onContactSubmit: (message: ContactMessage, notif: AdminNotification) => void;
}

export default function Footer({ onContactSubmit }: FooterProps) {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  
  // Feedback states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!name.trim()) {
      setErrorText("Please state your name.");
      return;
    }
    if (!messageText.trim()) {
      setErrorText("Please write your message query.");
      return;
    }

    setSubmitting(true);

    // Simulate instant message trigger
    setTimeout(() => {
      const newMessage: ContactMessage = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.trim() || "customer@example.com",
        message: messageText.trim(),
        createdAt: new Date().toISOString()
      };

      const customTimestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();

      const newNotif: AdminNotification = {
        id: "notif_msg_" + Math.random().toString(36).substr(2, 9),
        type: 'contact',
        title: "New Customer Enquiry",
        message: `Query from ${newMessage.name}: "${newMessage.message.substring(0, 40)}..."`,
        timestamp: customTimestamp,
        read: false,
        meta: {
          customerName: newMessage.name,
          customerEmail: newMessage.email,
          details: newMessage.message
        }
      };

      // Call callback to inject into notification state log
      onContactSubmit(newMessage, newNotif);

      setSubmitting(false);
      setSuccess(true);
      
      // Clear inputs
      setName("");
      setEmail("");
      setMessageText("");

      // Clear success modal automatically after 4 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 4000);

    }, 1200);
  };

  // Safe Google Maps link targeted at Look's Men's Parlor & Salon exact coordinates (25.4596965, 82.4155819)
  const mapIframeUrl = "https://maps.google.com/maps?q=25.4596965,82.4155819+(Look's%20Men's%20Parlor%20%26%20Salon)&t=&z=16&ie=UTF8&iwloc=B&output=embed";

  return (
    <footer id="contact" className="bg-zinc-950 text-white border-t border-zinc-900 pt-24 pb-8 relative scroll-mt-12">
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900 via-zinc-950 to-zinc-950 opacity-90 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 space-y-16">
        
        {/* Main Footer Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMN 1: SIDEBAR DETAILS (4-COLUMNS) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">Look's Men's Parlor & Salon</h3>
              <p className="text-xs text-[#c59246] font-mono tracking-widest uppercase font-semibold">Premium Grooming & Styling</p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Transforming style, hair designs, royal beard grooms, and skin care therapies at Siyaram Complex, Suriyawan. Experience unmatched standards by certified style gurus.
              </p>
            </div>

            {/* Structured Contact Elements */}
            <div className="space-y-4 text-sm font-sans pt-2">
              
              {/* Address card */}
              <div className="flex gap-3">
                <MapPin className="text-[#d4af37] shrink-0 mt-0.5 animate-pulse" size={17} />
                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-bold block">Salon Address</span>
                  <p className="text-zinc-300 font-light leading-relaxed">
                    {SALON_INFO.address}
                  </p>
                </div>
              </div>

              {/* Phone Line 1 */}
              <div className="flex gap-3">
                <Phone className="text-[#c59246] shrink-0 mt-0.5" size={17} />
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-bold block">Direct Call Bookings</span>
                  <p className="text-zinc-300 font-mono tracking-wider flex flex-col gap-0.5">
                    <a href={`tel:${SALON_INFO.phone1}`} className="hover:text-amber-400 transition-colors">{SALON_INFO.phone1}</a>
                    {SALON_INFO.phone2 && (
                      <a href={`tel:${SALON_INFO.phone2}`} className="hover:text-amber-400 transition-colors">{SALON_INFO.phone2}</a>
                    )}
                  </p>
                </div>
              </div>

              {/* Email Client */}
              <div className="flex gap-3">
                <Mail className="text-[#d4af37] shrink-0 mt-0.5" size={17} />
                <div className="space-y-1">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-bold block">Manager Email</span>
                  <a href={`mailto:${SALON_INFO.email}`} className="text-zinc-300 hover:text-amber-400 font-mono transition-colors block">
                    {SALON_INFO.email}
                  </a>
                </div>
              </div>

              {/* Operational Timeline */}
              <div className="flex gap-3">
                <Clock className="text-[#d4af37] shrink-0 mt-0.5" size={17} />
                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-bold block">Operational Timeline</span>
                  <div className="text-zinc-300 font-light text-xs space-y-1 font-mono">
                    {SALON_INFO.workingHours.map((wh, idx) => (
                      <p key={idx} className="flex justify-between gap-4">
                        <span className="text-zinc-400">{wh.day}:</span>
                        <span className="text-amber-400/80 font-bold">{wh.hours}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMN 2: CUSTOM MESSAGING FORM (4-COLUMNS) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
              <span>Send Message</span>
              <span className="w-8 h-px bg-zinc-800" />
            </h4>
            <p className="text-xs text-zinc-400 font-light">
              Do you have specialized requests, bridal inquiries, or group booking questions? Drop us a line.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/80 focus:outline-none rounded px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 transition-colors"
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Your Email (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/80 focus:outline-none rounded px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <textarea
                  required
                  rows={3}
                  placeholder="Your Styling message query or special notes..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/80 focus:outline-none rounded px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 transition-colors resize-none"
                />
              </div>

              {/* Errors */}
              {errorText && (
                <div className="p-2.5 rounded bg-red-950/20 border border-red-500/20 text-xxs text-red-400 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Sending Query..." : "Send Message"}
                <Send size={12} />
              </button>
            </form>

            {/* Instant contact response box */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3.5 rounded bg-green-950/40 border border-green-500/30 text-xs text-green-400 flex items-start gap-2.5"
                >
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Message Dispatched!</p>
                    <p className="text-xxs text-zinc-400 mt-0.5">Admin has been notified with your enquiry. We will reach back shortly.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* COLUMN 3: GEO MAPS EMBED & ACCENT (4-COLUMNS) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                <span>Salon Geo-Location</span>
                <span className="w-8 h-px bg-zinc-800" />
              </h4>
              <a 
                href="https://www.google.com/maps/dir//%E0%A4%B2%E0%A5%81%E0%A4%95%27%E0%A4%B8+%E0%A4%AE%E0%A5%87%E0%A4%82%27%E0%A4%B8+%E0%A4%AA%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B2%E0%A4%B0+%26+%E0%A4%B8%E0%A4%BE%E0%A4%B2%E0%A5%8B%E0%A4%82,+Shop+No+A5+Siyaram+Complex+bypass+chauraha,+Suriyawan+-+Bhadohi+Rd,+Suriyawan,+Uttar+Pradesh+221404/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x398fe3d52030a0c5:0xaa77487707863748"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-xxs text-[#c59246] hover:underline flex items-center gap-1 font-mono"
              >
                <span>Google Maps</span>
                <ExternalLink size={10} />
              </a>
            </div>

            {/* Map Frame Container with gold double border */}
            <div className="relative aspect-video lg:aspect-square w-full rounded-xl overflow-hidden border border-zinc-800 ring-1 ring-amber-500/15 group shadow-lg">
              <iframe
                title="Google Maps Location suriyawan Uttar Pradesh"
                src={mapIframeUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="relative z-10 transition-transform duration-700 hover:scale-102"
              />
              
              {/* Floating Map Overlay Card representing the exact search location with Directions trigger */}
              <div className="absolute top-3 left-3 z-20 max-w-[280px] bg-white rounded shadow-lg p-3 flex items-start justify-between gap-3 select-none pointer-events-auto border border-zinc-200">
                <div className="text-left font-sans">
                  <h5 className="text-[12px] font-bold text-zinc-900 leading-tight">Look's Men's Parlor</h5>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Shop No A5 Siyaram Complex, bypass chauraha, Suriyawan</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5 font-medium">Bhadohi, Uttar Pradesh 221404</p>
                  <a 
                    href="https://www.google.com/maps/dir//%E0%A4%B2%E0%A5%81%E0%A4%95%27%E0%A4%B8+%E0%A4%AE%E0%A5%87%E0%A4%82%27%E0%A4%B8+%E0%A4%AA%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B2%E0%A4%B0+%26+%E0%A4%B8%E0%A4%BE%E0%A4%B2%E0%A5%8B%E0%A4%82,+Shop+No+A5+Siyaram+Complex+bypass+chauraha,+Suriyawan+-+Bhadohi+Rd,+Suriyawan,+Uttar+Pradesh+221404/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x398fe3d52030a0c5:0xaa77487707863748"
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="text-[10px] text-blue-600 hover:underline font-semibold mt-1.5 inline-flex items-center gap-1"
                  >
                    View larger map
                  </a>
                </div>
                <div className="flex flex-col items-center gap-1.5 justify-center shrink-0">
                  <a 
                    href="https://www.google.com/maps/dir//%E0%A4%B2%E0%A5%81%E0%A4%95%27%E0%A4%B8+%E0%A4%AE%E0%A5%87%E0%A4%82%27%E0%A4%B8+%E0%A4%AA%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B2%E0%A4%B0+%26+%E0%A4%B8%E0%A4%BE%E0%A4%B2%E0%A5%8B%E0%A4%82,+Shop+No+A5+Siyaram+Complex+bypass+chauraha,+Suriyawan+-+Bhadohi+Rd,+Suriyawan,+Uttar+Pradesh+221404/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x398fe3d52030a0c5:0xaa77487707863748"
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    title="Get Directions"
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform shrink-0"
                  >
                    <Navigation size={13} className="fill-white rotate-45 transform" />
                  </a>
                  <span className="text-[8px] text-blue-600 font-semibold tracking-tight uppercase leading-none mt-0.5">Directions</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-transparent pointer-events-none border border-amber-500/10 rounded-xl z-20" />
            </div>

            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg text-xxs text-zinc-400 font-light flex items-start gap-2 leading-relaxed">
              <MapPin size={12} className="text-[#c59246] shrink-0 mt-0.5" />
              <span>Shop No A5 Siyaram Complex bypass chauraha, Suriyawan. Safe access & convenient customer parking.</span>
            </div>
          </div>

        </div>

        {/* Brand Separator */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} Look's Men's Parlor & Salon. All Rights Reserved. Engineered with premium standards.</p>
          <div className="flex gap-4">
            <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
            <a href="#booking" className="hover:text-amber-400 transition-colors">Booking Desk</a>
            <a href="#gallery" className="hover:text-amber-400 transition-colors">Our Gallery</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
