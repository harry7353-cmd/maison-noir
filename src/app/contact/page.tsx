"use client";

import { useState } from "react";
import { MailIcon, MapPinIcon, ShieldIcon, CheckIcon } from "@/components/ui/Icons";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Acquisition Consultation");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-noir text-ivory min-h-screen">
      {/* ── Header ─── */}
      <div className="border-b border-border/20 py-16 lg:py-24 bg-surface/20">
        <div className="container-luxury text-center max-w-2xl space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <ShieldIcon className="w-3.5 h-3.5" /> Private Client Services
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Atelier Concierge
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            Our private advisors remain at your service for sizing consultations, bespoke orders, private showroom previews, and courier inquiries.
          </p>
        </div>
      </div>

      <div className="container-luxury py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ── Contact Form ─── */}
          <div className="lg:col-span-7 bg-surface/30 border border-border/20 p-8 sm:p-10 backdrop-blur-sm">
            <h2 className="font-serif text-2xl font-light text-ivory mb-2">
              Send an Inscription
            </h2>
            <p className="text-xs text-ivory/50 mb-8">
              Every message is routed directly to our chief client director. Expect a royal dispatch within 12 hours.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-4 border border-gold/40 bg-gold/5">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center mx-auto">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-ivory">Dispatch Received</h3>
                <p className="text-xs text-ivory/70 max-w-sm mx-auto leading-relaxed">
                  Thank you, {name}. Your inquiry regarding &ldquo;{subject}&rdquo; has been lodged with the Atelier Concierge. Our advisor will reach you at {email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 border border-border/30 text-xs uppercase tracking-widest text-ivory/70 hover:text-ivory"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-2 font-medium">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Julian Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-noir border border-border/30 px-4 py-3 text-ivory focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-2 font-medium">
                      Patron Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="patron@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-noir border border-border/30 px-4 py-3 text-ivory focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-2 font-medium">
                    Inquiry Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-noir border border-border/30 px-4 py-3 text-ivory focus:border-gold outline-none"
                  >
                    <option value="Acquisition Consultation">Acquisition & Styling Consultation</option>
                    <option value="Order Tracking & Logistics">Order Tracking & Courier Delivery</option>
                    <option value="Bespoke Sizing Request">Bespoke Sizing & Alteration Inquiries</option>
                    <option value="Press & Media Accreditation">Press & Editorial Inquiries</option>
                    <option value="Private Showroom Appointment">Private Salon Appointment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-2 font-medium">
                    Your Inscription / Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your request or order reference in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-noir border border-border/30 px-4 py-3 text-ivory focus:border-gold outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-md active:scale-95"
                >
                  Transmit to Concierge
                </button>
              </form>
            )}
          </div>

          {/* ── Global Showrooms & Hours ─── */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface/20 border border-border/20 p-6 space-y-4">
              <h3 className="font-serif text-lg text-ivory flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-gold" /> Direct Corridors
              </h3>
              <div className="space-y-2 text-xs text-ivory/70">
                <p>
                  <span className="text-ivory/40 uppercase tracking-wider block text-[10px]">Concierge Desk:</span>
                  <a href="mailto:concierge@maisonnoir.com" className="text-gold font-mono hover:underline">
                    concierge@maisonnoir.com
                  </a>
                </p>
                <p>
                  <span className="text-ivory/40 uppercase tracking-wider block text-[10px]">Private Client Advisory:</span>
                  <a href="tel:+919876543210" className="text-ivory font-mono hover:text-gold">
                    +91 (0) 22 8900 4420
                  </a>
                </p>
                <p>
                  <span className="text-ivory/40 uppercase tracking-wider block text-[10px]">Atelier Hours:</span>
                  <span>Monday — Saturday: 10:00 – 20:00 IST</span>
                </p>
              </div>
            </div>

            <div className="bg-surface/20 border border-border/20 p-6 space-y-6">
              <h3 className="font-serif text-lg text-ivory flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-gold" /> Global Salons
              </h3>

              <div className="space-y-4 text-xs divide-y divide-border/10">
                <div className="pt-2">
                  <p className="font-semibold text-ivory">Mumbai Flagship Chamber</p>
                  <p className="text-ivory/60 text-[11px] mt-0.5">Altamount Road, Cumballa Hill, Mumbai 400026</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gold">By Appointment Only</span>
                </div>
                <div className="pt-4">
                  <p className="font-semibold text-ivory">Paris Design Atelier</p>
                  <p className="text-ivory/60 text-[11px] mt-0.5">Place Vendôme, 1er Arrondissement, 75001 Paris</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gold">Couture Archives</span>
                </div>
                <div className="pt-4">
                  <p className="font-semibold text-ivory">Milan Bespoke Studio</p>
                  <p className="text-ivory/60 text-[11px] mt-0.5">Via Montenapoleone, 20121 Milano</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gold">Textile Selection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
