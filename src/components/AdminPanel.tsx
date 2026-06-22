import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings, 
  Trash2, 
  CheckCircle, 
  X, 
  Mail, 
  Phone, 
  Database, 
  Send, 
  Terminal, 
  Calendar,
  Layers,
  Sparkles,
  Wifi
} from 'lucide-react';
import { Booking, AdminNotification } from '../types';
import { SALON_INFO } from '../data/salonData';

interface AdminPanelProps {
  bookings: Booking[];
  notifications: AdminNotification[];
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onUpdateBookingStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  onDeleteBooking: (id: string) => void;
}

export default function AdminPanel({
  bookings,
  notifications,
  isOpen,
  onClose,
  onClearAll,
  onUpdateBookingStatus,
  onDeleteBooking
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'bookings' | 'payloads'>('alerts');
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  // Simulated Webhook Settings Form
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem("emailjs_webhook_url") || "https://api.emailjs.com/api/v1.0/email/send");
  const [serviceId, setServiceId] = useState(() => localStorage.getItem("emailjs_service_id") || "service_looks_salon");
  const [templateId, setTemplateId] = useState(() => localStorage.getItem("emailjs_template_id") || "template_looks_salon_2026");
  const [publicKey, setPublicKey] = useState(() => localStorage.getItem("emailjs_public_key") || "user_public_key_here");
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem("emailjs_admin_email") || "ksurajyadav93@gmail.com");
  const [copiedSetting, setCopiedSetting] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("emailjs_webhook_url", webhookUrl);
    localStorage.setItem("emailjs_service_id", serviceId);
    localStorage.setItem("emailjs_template_id", templateId);
    localStorage.setItem("emailjs_public_key", publicKey);
    localStorage.setItem("emailjs_admin_email", adminEmail);
    setCopiedSetting(true);
    setTimeout(() => setCopiedSetting(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-sans text-white">
          
          {/* Back click overlay close */}
          <div className="absolute inset-0 z-0" onClick={onClose} />

          {/* Sliding Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-lg md:max-w-xl h-full bg-zinc-950 border-l border-zinc-900 shadow-2xl flex flex-col"
          >
            {/* Top Header */}
            <div className="p-6 border-b border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Terminal size={18} />
                  </div>
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-950 animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-zinc-100 flex items-center gap-2">
                    Look's CRM
                  </h3>
                  <span className="text-xxs text-amber-400 font-mono tracking-widest uppercase flex items-center gap-1">
                    <Wifi size={10} className="text-green-500 animate-pulse" />
                    Live Notification Engine Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    title="Clear Log Feed"
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Inner Tabs Selector */}
            <div className="grid grid-cols-3 border-b border-zinc-900 text-xs font-mono">
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-3.5 text-center border-b-2 font-medium tracking-wide transition-all cursor-pointer ${
                  activeTab === 'alerts'
                    ? 'border-[#d4af37] text-white bg-zinc-900/30 font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Notification Feed ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3.5 text-center border-b-2 font-medium tracking-wide transition-all cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'border-[#d4af37] text-white bg-zinc-900/30 font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Bookings Grid ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('payloads')}
                className={`py-3.5 text-center border-b-2 font-medium tracking-wide transition-all cursor-pointer ${
                  activeTab === 'payloads'
                    ? 'border-[#d4af37] text-white bg-zinc-900/30 font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                EmailJS / Webhooks
              </button>
            </div>

            {/* Main scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 1: NOTIFICATION ALERTS */}
              {activeTab === 'alerts' && (
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <Bell size={28} className="mx-auto text-zinc-700" />
                      <p className="text-zinc-500 text-sm font-mono">No active alerts dispatched yet.</p>
                      <p className="text-xxs text-zinc-600 max-w-xs mx-auto">
                        Submit an appointment reservation or complete a Contact Message query to trigger instant simulated webhook notifications to the administrator.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const isBooking = notif.type === 'booking';
                      return (
                        <div 
                          key={notif.id}
                          className={`p-4 rounded-xl border transition-all text-xs space-y-3 ${
                            isBooking 
                              ? 'border-amber-500/15 bg-amber-500/5' 
                              : 'border-purple-500/15 bg-purple-500/5'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`px-2 py-0.5 rounded text-xxs font-mono font-bold uppercase tracking-wider ${
                              isBooking 
                                ? 'bg-[#d4af37]/20 text-amber-300' 
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {isBooking ? "Booking Dispatched" : "Enquiry Form"}
                            </span>
                            <span className="text-xxs text-zinc-500 font-mono">{notif.timestamp}</span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-serif font-bold text-sm text-zinc-100">{notif.title}</h4>
                            <p className="text-zinc-400 font-light leading-relaxed font-sans">{notif.message}</p>
                          </div>

                          {/* Interactive Payload values */}
                          <div className="bg-zinc-950 p-2.5 rounded font-mono text-[10px] text-zinc-400 space-y-1 border border-zinc-900 leading-normal">
                            <p className="text-zinc-500 uppercase font-bold text-[9px] tracking-widest border-b border-zinc-900 pb-1 mb-1">
                              Notification Payload (Meta JSON):
                            </p>
                            <p><span className="text-zinc-500">clientName:</span> {notif.meta.customerName}</p>
                            {notif.meta.customerPhone && (
                              <p><span className="text-zinc-500">clientPhone:</span> +91 {notif.meta.customerPhone}</p>
                            )}
                            {notif.meta.customerEmail && (
                              <p><span className="text-zinc-500">clientEmail:</span> {notif.meta.customerEmail}</p>
                            )}
                            <p><span className="text-zinc-500">clientQuery:</span> {notif.meta.details}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: BOOKINGS LIST */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <Calendar size={28} className="mx-auto text-zinc-700" />
                      <p className="text-zinc-500 text-sm font-mono">No active reservations recorded.</p>
                      <p className="text-xxs text-zinc-600 max-w-xs mx-auto">
                        Please try making your booking using our dynamic date, time and customer forms in the booking section above.
                      </p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-4 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-3 font-mono text-xs"
                      >
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <span className="text-[#d4af37] font-bold">Ref: {booking.id}</span>
                          
                          <div className="flex gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              booking.status === 'confirmed'
                                ? 'bg-green-500/20 text-green-400'
                                : booking.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-zinc-300">
                          <div>
                            <span className="text-zinc-500 block text-[10px]">CUSTOMER:</span>
                            <span className="font-semibold">{booking.customerName}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px]">PHONE:</span>
                            <span>+91 {booking.customerPhone}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-zinc-500 block text-[10px]">TREATMENT:</span>
                            <span className="font-semibold text-[#d4af37]">{booking.serviceName}</span>
                            <span className="text-zinc-500 text-[10px] block">({booking.serviceCategory})</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px]">DATE:</span>
                            <span>{booking.date}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px]">TIME SLOT:</span>
                            <span className="text-white font-bold">{booking.timeSlot}</span>
                          </div>
                        </div>

                        {/* Status controls */}
                        <div className="flex justify-end gap-2 border-t border-zinc-900 pt-2 text-[10px]">
                          {booking.status !== 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                              className="px-2.5 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/20 transition-all cursor-pointer"
                            >
                              Check In / Confirm
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => onUpdateBookingStatus(booking.id, 'cancelled')}
                              className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 hover:bg-amber-500/20 hover:text-amber-400 border border-red-500/20 transition-all cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteBooking(booking.id);
                            }}
                            className="px-2.5 py-1 rounded bg-red-650/15 text-red-500 hover:bg-red-650/30 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer font-bold"
                          >
                            Delete Permanent
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: PAYLOADS & TELEMETRY SETUP */}
              {activeTab === 'payloads' && (
                <div className="space-y-6">
                  
                  {/* Informational intro */}
                  <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 text-xs text-zinc-300 space-y-2 leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5 text-amber-400">
                      <Settings size={14} />
                      EmailJS & Webhook Settings
                    </p>
                    <p className="font-light">
                      To move from this fully working local simulator to production EmailJS triggers in your own domain: specify your private webhook config or EmailJS endpoint triggers here.
                    </p>
                  </div>

                  {/* Settings fields */}
                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400">EMAILJS API ENDPOINTURL:</label>
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-zinc-300 focus:outline-[#d4af37]"
                        placeholder="https://api.emailjs.com/api/v1.0/email/send"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-bold text-amber-500/90">SERVICE ID:</label>
                        <input
                          type="text"
                          value={serviceId}
                          onChange={(e) => setServiceId(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-zinc-300 focus:outline-[#d4af37]"
                          placeholder="service_looks_salon"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-bold text-amber-500/90">TEMPLATE ID:</label>
                        <input
                          type="text"
                          value={templateId}
                          onChange={(e) => setTemplateId(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-zinc-300 focus:outline-[#d4af37]"
                          placeholder="template_looks_salon_2026"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400">EMAILJS PUBLIC KEY (USER ID):</label>
                      <input
                        type="text"
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-zinc-300 focus:outline-[#d4af37]"
                        placeholder="user_public_key_here"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400">ADMIN NOTIFICATION RECIPIENT EMAIL:</label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-[#d4af37] focus:outline-[#d4af37]"
                        placeholder="ksurajyadav93@gmail.com"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase cursor-pointer transition-colors"
                    >
                      {copiedSetting ? "Production Config Saved!" : "Save Active Config"}
                    </button>
                  </form>

                  {/* Sample dispatch format snippet */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Email/Webhook JSON Payload Schema:</span>
                    <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 text-[10px] text-amber-500/90 overflow-x-auto leading-normal">
                      {`{
  "service_id": "${serviceId}",
  "template_id": "${templateId}",
  "user_id": "${publicKey}",
  "template_params": {
    "admin_email": "${adminEmail}",
    "customer_name": "Suraj Yadav",
    "customer_phone": "+91 9140488710",
    "customer_email": "customer@example.com",
    "service_name": "Premium Keratin Therapy",
    "date_time": "June 22, 2026 @ 11:00 AM",
    "price_payable": "₹3499",
    "sys_gateway_trigger": "SUCCESS_AUTO_NOTIFY"
  }
}`}
                    </pre>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom panel indicator */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950 text-center font-mono text-[10px] text-zinc-500">
              Look's Men's Parlour & Salon Multi-Channel Simulated Admin Terminal v2.1
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
