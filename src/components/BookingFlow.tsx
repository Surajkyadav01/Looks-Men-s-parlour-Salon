import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  Send, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Scissors,
  Mail
} from 'lucide-react';
import { SERVICES_DATA, SALON_INFO } from '../data/salonData';
import { Booking, ServiceItem, AdminNotification } from '../types';

interface BookingFlowProps {
  selectedPreloadService?: { categoryName: string; service: ServiceItem } | null;
  onBookingSuccess: (booking: Booking, notifications: AdminNotification[]) => void;
}

// 6 standard selectable services from screenshot
const BRAND_SERVICES = [
  { id: "h1", name: "Haircut & Styling", duration: "45 min", price: 299, category: "Hair Care & Styling" },
  { id: "h4", name: "Hair Color", duration: "120 min", price: 2199, category: "Hair Care & Styling" },
  { id: "p2", name: "Bridal Package", duration: "180 min", price: 3999, category: "Beauty & Makeup" },
  { id: "h2", name: "Hair Treatment", duration: "60 min", price: 899, category: "Hair Care & Styling" },
  { id: "f2", name: "Facial", duration: "45 min", price: 699, category: "Facial & Skin Care" },
  { id: "n1", name: "Manicure & Pedicure", duration: "120 min", price: 799, category: "Nail Care" }
];

// Fixed time slots shown in step 2 screenshot
const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:05 PM", "05:00 PM", 
  "06:00 PM", "07:00 PM"
];

export default function BookingFlow({ selectedPreloadService, onBookingSuccess }: BookingFlowProps) {
  // Wizard state: Step 1, 2 or 3
  const [step, setStep] = useState(1);

  // Core selections
  const [activeService, setActiveService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-22");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Client info fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Error block
  const [formError, setFormError] = useState("");
  
  // submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);

  // Sync service preloads when selected from other areas of the website
  useEffect(() => {
    if (selectedPreloadService) {
      const item = selectedPreloadService.service;
      const mapped = {
        id: item.id,
        name: item.name,
        duration: item.duration || "45 min",
        price: item.price,
        category: selectedPreloadService.categoryName
      };
      setActiveService(mapped);
      // Auto-advance directly to Date & Time selection if preloaded
      setStep(2);
      
      // Auto-scroll slightly to the booking section
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedPreloadService]);

  // Combine selectable list to include custom picked preloads too
  const servicesToDisplay = [...BRAND_SERVICES];
  if (activeService && !BRAND_SERVICES.some(s => s.id === activeService.id)) {
    servicesToDisplay.push(activeService);
  }

  // Create notifications payload
  const triggerAdminNotification = async (booking: Booking): Promise<AdminNotification[]> => {
    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();
    
    const notification: AdminNotification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      type: 'booking',
      title: "New Premium Appointment Reserved",
      message: `${booking.customerName} booked "${booking.serviceName}" (₹${booking.servicePrice}) for ${booking.date} at ${booking.timeSlot}.`,
      timestamp: timestampStr,
      read: false,
      meta: {
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: customerEmail.trim() || undefined,
        details: `${booking.serviceCategory} — ${booking.serviceName} | ₹${booking.servicePrice}${additionalNotes ? ` | Notes: ${additionalNotes}` : ''}`,
      }
    };

    // --- Active Outbound EmailJS Live Dispatch ---
    const emailjsWebhookUrl = localStorage.getItem("emailjs_webhook_url") || "https://api.emailjs.com/api/v1.0/email/send";
    const emailjsServiceId = localStorage.getItem("emailjs_service_id") || "service_looks_salon";
    const emailjsTemplateId = localStorage.getItem("emailjs_template_id") || "template_looks_salon_2026";
    const emailjsPublicKey = localStorage.getItem("emailjs_public_key") || "user_public_key_here";
    const emailjsAdminEmail = localStorage.getItem("emailjs_admin_email") || "ksurajyadav93@gmail.com";

    // 1. Dispatch via EmailJS (if configured with custom keys)
    if (emailjsPublicKey !== "user_public_key_here") {
      try {
        await fetch(emailjsWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            service_id: emailjsServiceId,
            template_id: emailjsTemplateId,
            user_id: emailjsPublicKey,
            template_params: {
              admin_email: emailjsAdminEmail,
              customer_name: booking.customerName,
              customer_phone: booking.customerPhone,
              customer_email: customerEmail.trim() || "no-provided-email@example.com",
              service_name: booking.serviceName,
              date_time: `${booking.date} @ ${booking.timeSlot}`,
              price_payable: `₹${booking.servicePrice}`,
              notes: additionalNotes.trim() || "None",
              sys_gateway_trigger: "SUCCESS_AUTO_NOTIFY"
            }
          })
        });
      } catch (err) {
        console.warn("Outbound EmailJS warning:", err);
      }
    }

    // 2. Dispatch via FormSubmit.co (Direct, free, keyless production-ready email fallback to make sure they get their email alerts instantly!)
    try {
      const recipientEmail = emailjsAdminEmail.trim() || "ksurajyadav93@gmail.com";
      await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "_subject": `🛎️ Look's Men's Parlor - New Booking: ${booking.customerName}`,
          "--- APPOINTMENT DETAILS ---": "--------------------------------------------------",
          "Customer Name": booking.customerName,
          "Customer Phone": `+91 ${booking.customerPhone}`,
          "Customer Email": customerEmail.trim() || "Not provided",
          "Service Requested": booking.serviceName,
          "Service Category": booking.serviceCategory,
          "Appointment Schedule": `${booking.date} at ${booking.timeSlot}`,
          "Price Payable": `₹${booking.servicePrice}`,
          "Additional Instructions / Notes": additionalNotes.trim() || "None",
          "-------------------------": "--------------------------------------------------",
          "_honey": "", // spam honeypot
          "_template": "box" // clean box-layout format
        })
      });
      console.log("FormSubmit booking email alert sent to admin:", recipientEmail);
    } catch (fsErr) {
      console.warn("FormSubmit fallback error:", fsErr);
    }

    return [notification];
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!activeService) {
      setFormError("Please select a service.");
      setStep(1);
      return;
    }
    if (!selectedDate) {
      setFormError("Please choose a reservation date.");
      setStep(2);
      return;
    }
    if (!selectedTime) {
      setFormError("Please pick a time slot.");
      setStep(2);
      return;
    }
    if (!customerName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!customerEmail.trim()) {
      setFormError("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API response / notification trigger
    setTimeout(async () => {
      // Format Date nicely
      const dateObj = new Date(selectedDate);
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const formattedDate = isNaN(dateObj.getTime()) 
        ? selectedDate 
        : `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

      const newBooking: Booking = {
        id: "SD_" + Math.floor(100000 + Math.random() * 900000),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        serviceCategory: activeService.category || "General Care",
        serviceName: activeService.name,
        servicePrice: activeService.price,
        date: formattedDate,
        timeSlot: selectedTime,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      try {
        const adminNotifications = await triggerAdminNotification(newBooking);
        
        setLastCreatedBooking(newBooking);
        setIsSubmitting(false);
        setShowSuccessModal(true);

        // Update global state through callback
        onBookingSuccess(newBooking, adminNotifications);

        // Reset details
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setAdditionalNotes("");
        setSelectedTime(null);
        setStep(1); // Revert back
      } catch (error) {
        setFormError("Simulated API Dispatch failure. Please try again.");
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <section id="booking" className="py-20 bg-black text-white relative scroll-mt-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(191,148,48,0.05),transparent_50% preview)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title Details Header */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-serif text-zinc-100 font-bold">Book an Appointment</h2>
        </div>

        {/* Dynamic Connected Stepper Component from screenshot */}
        <div className="relative flex items-center justify-between w-full max-w-lg mx-auto mb-10">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-amber-500/70 -translate-y-1/2 z-0 transition-all duration-300" 
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />

          {[1, 2, 3].map((s) => {
            const isActive = step >= s;
            const isCurrent = step === s;
            return (
              <div key={s} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-amber-500 text-zinc-950 ring-4 ring-amber-500/20' 
                      : isActive 
                        ? 'bg-amber-600 text-zinc-950' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {s}
                </div>
              </div>
            );
          })}
        </div>

        {/* The Action Panel Card Component */}
        <div className="bg-[#0b0b0c] rounded-2xl border border-zinc-850 p-6 md:p-8 shadow-2xl space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-zinc-850 pb-3">
                  <h3 className="text-xl font-serif font-semibold text-zinc-100">Select a Service</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servicesToDisplay.map((srv) => {
                    const isSelected = activeService?.id === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setActiveService(srv);
                          setFormError("");
                        }}
                        className={`group relative p-5 rounded-xl border flex flex-col justify-between text-left transition-all h-[120px] cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5'
                            : 'bg-[#151516] sm:bg-zinc-900/30 hover:bg-zinc-800/40 border-zinc-800/80 text-zinc-350'
                        }`}
                      >
                        {/* Top rows */}
                        <div className="flex justify-between items-start w-full">
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                            <Scissors size={14} className="text-amber-500 fill-amber-500/10" />
                          </div>
                          <span className="text-[10px] font-mono text-amber-500 font-semibold uppercase tracking-wider bg-zinc-950 py-0.5 px-2 rounded-full border border-zinc-850">
                            {srv.duration}
                          </span>
                        </div>

                        {/* Centered label */}
                        <div className="mt-2 w-full text-center">
                          <span className={`text-[14px] font-bold block ${
                            isSelected ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'
                          }`}>
                            {srv.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 font-medium">₹{srv.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Continue Actions */}
                <div className="pt-4 border-t border-zinc-900/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeService) {
                        setFormError("Please select a service to proceed.");
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:scale-[1.01] text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Date & Time</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-zinc-850 pb-3">
                  <h3 className="text-xl font-serif font-semibold text-zinc-100">Select Date & Time</h3>
                </div>

                {/* Date Input Box */}
                <div className="space-y-1 text-left max-w-xl">
                  <label className="text-xs text-zinc-400 font-mono tracking-wider font-semibold block uppercase">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setFormError("");
                      }}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {
                          // Fallback for older browsers
                        }
                      }}
                      className="w-full bg-[#151516] text-zinc-100 pl-11 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all focus:ring-1 focus:ring-amber-500 font-sans cursor-pointer placeholder-zinc-500 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:transition-all [&::-webkit-calendar-picker-indicator]:hover:scale-135"
                    />
                  </div>
                </div>

                {/* Time slot lists styled like screenshot */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs text-zinc-400 font-mono tracking-wider font-semibold block uppercase">Time</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {TIME_SLOTS.map((slot, idx) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setFormError("");
                          }}
                          className={`relative p-4 rounded-lg flex flex-col items-center justify-center transition-all border text-center cursor-pointer h-20 ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-zinc-100 shadow-md ring-1 ring-amber-500/30'
                              : 'bg-[#151516] sm:bg-zinc-900/30 hover:bg-zinc-800/40 border-zinc-800/80 text-zinc-300'
                          }`}
                        >
                          <Clock size={16} className="text-amber-500 mb-2 shrink-0 animate-none" />
                          <span className="text-[11px] font-bold font-mono tracking-tight">{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Footer buttons with Back & Continue */}
                <div className="pt-6 border-t border-zinc-900/60 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedTime) {
                        setFormError("Please select a time slot to proceed.");
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-10 py-3 bg-[#b58d3c] hover:bg-[#c29a4a] text-white font-bold rounded-lg tracking-wide transition-all uppercase text-xs cursor-pointer shadow-lg hover:scale-[1.01]"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormError("");
                    }}
                    className="text-[#d4af37]/80 hover:text-[#d4af37] text-xs font-semibold cursor-pointer underline flex items-center gap-1.5 bg-transparent border-none mt-2"
                  >
                    &larr; Back to previous step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-zinc-850 pb-3">
                  <h3 className="text-xl font-serif font-semibold text-zinc-100">Your Information</h3>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 font-mono space-y-2 mb-2 max-w-xl">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">SELECTED SERVICE:</span>
                    <span className="text-zinc-200 font-bold uppercase">{activeService?.name} (₹{activeService?.price})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">DATE & TIME SLOT:</span>
                    <span className="text-amber-500 font-bold">{selectedDate} @ {selectedTime}</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 max-w-xl">
                  {/* Name field */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs text-zinc-450 font-mono tracking-wider font-semibold block uppercase">Name <span className="text-amber-500 font-bold">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-amber-500 text-amber-500" size={16} />
                      <input 
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-[#151516] text-zinc-100 pl-11 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all placeholder-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs text-zinc-450 font-mono tracking-wider font-semibold block uppercase">Email <span className="text-amber-500 font-bold">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-amber-500 text-amber-500" size={16} />
                      <input 
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-[#151516] text-zinc-100 pl-11 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all placeholder-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs text-zinc-455 font-mono tracking-wider font-semibold block uppercase">Phone <span className="text-amber-500 font-bold">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-amber-500 text-amber-500" size={16} />
                      <input 
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter your phone number"
                        className="w-full bg-[#151516] text-zinc-100 pl-11 pr-4 py-3 rounded-lg border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all placeholder-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Additional Notes optional field */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs text-zinc-450 font-mono tracking-wider font-semibold block uppercase">Additional Notes (Optional)</label>
                    <textarea 
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Enter optional notes..."
                      className="w-full bg-[#151516] text-zinc-100 px-4 py-3 rounded-lg border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all resize-none placeholder-zinc-705"
                    />
                  </div>

                  {formError && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Submit block handles */}
                  <div className="pt-6 border-t border-zinc-900/60 flex flex-col items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-10 py-3 bg-[#b58d3c] hover:bg-[#c29a4a] text-white font-bold rounded-lg tracking-wide transition-all uppercase text-xs cursor-pointer shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin text-zinc-105 shrink-0" />
                          <span>Processing Reserve...</span>
                        </>
                      ) : (
                        <span>Confirm Booking</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(2);
                        setFormError("");
                      }}
                      className="text-[#d4af37]/80 hover:text-[#d4af37] text-xs font-semibold cursor-pointer underline flex items-center gap-1.5 bg-transparent border-none mt-2"
                    >
                      &larr; Back to previous step
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* COMPLETED BOOKING RECEIPT ACCENTS */}
      <AnimatePresence>
        {showSuccessModal && lastCreatedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative max-w-lg w-full bg-zinc-900 border-2 border-amber-500/30 rounded-2xl p-6 md:p-8 text-center text-white shadow-2xl shadow-amber-500/5"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-[#d4af37] animate-bounce" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-zinc-105 mb-1">Booking Confirmed!</h3>
              <p className="text-xs text-amber-500 font-mono tracking-widest uppercase mb-4">Management Alert Gateway Active</p>
              
              <p className="text-sm text-zinc-300 font-light mb-6">
                Thank you, dear <strong className="text-zinc-100">{lastCreatedBooking.customerName}</strong>! Your reservation is confirmed. The store manager in Suriyawan, UP has been notified.
              </p>

              {/* Receipt styled docket panel */}
              <div className="bg-zinc-950 p-4 rounded-xl text-left text-xs font-mono border border-zinc-850 space-y-2 mb-6">
                <div className="flex justify-between text-zinc-500 border-b border-zinc-900 pb-1.5">
                  <span>RECEIPT ID:</span>
                  <span className="text-zinc-350 font-bold">{lastCreatedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLIENT NAME:</span>
                  <span className="text-zinc-200">{lastCreatedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>PHONE NUMBER:</span>
                  <span className="text-zinc-200">+91 {lastCreatedBooking.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>TREATMENT:</span>
                  <span className="text-zinc-100 font-semibold">{lastCreatedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE & TIME:</span>
                  <span className="text-amber-400 font-bold">{lastCreatedBooking.date} @ {lastCreatedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-zinc-900 pt-1.5 font-bold">
                  <span>PAYMENT AMOUNT:</span>
                  <span className="text-sm text-[#d4af37]">₹{lastCreatedBooking.servicePrice}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 rounded-lg bg-[#d4af37] hover:bg-amber-400 text-zinc-950 font-bold tracking-wider transition-all uppercase text-xs cursor-pointer"
                >
                  Return to Salon Menu
                </button>
                <p className="text-xxs text-zinc-500 mt-2 font-light">
                  Please show this receipt to the stylist during your visit. Settlement can be done post-service.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
