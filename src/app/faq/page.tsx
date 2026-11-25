"use client";

import { useState } from "react";
import Link from "next/link";
import { SparklesIcon, ChevronDownIcon, MailIcon } from "@/components/ui/Icons";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Acquisitions & Orders",
    question: "How are Maison Noir garments produced?",
    answer:
      "All garments are crafted in strictly limited micro-batches in our ateliers. We source structured Italian wools, Japanese raw selvedge denim, and mulberry silks. Each piece is hand-inspected across three quality checkpoints before being sealed in our signature presentation packaging.",
  },
  {
    category: "Acquisitions & Orders",
    question: "Can I cancel or modify an acquisition after placing it?",
    answer:
      "Due to our rapid white-glove fulfillment process, orders enter atelier inspection within two hours. If you wish to amend your order or delivery residence, please reach the Atelier Concierge immediately at concierge@maisonnoir.com.",
  },
  {
    category: "Logistics & Delivery",
    question: "What is the white-glove delivery experience?",
    answer:
      "Every acquisition is enclosed in a matte black rigid presentation box with magnetic closure, wrapped in acid-free tissue, and stamped with our gold wax seal. Deliveries are dispatched through priority courier lines (Delhivery Express, BlueDart Apex, DHL Imperial) and require a secure signature upon handover.",
  },
  {
    category: "Logistics & Delivery",
    question: "How long does courier dispatch take?",
    answer:
      "Domestic deliveries across metropolitan India arrive within 2 to 4 business days. Regional and international dispatches take 4 to 7 business days. You can track your courier progress in real-time on our Track Order page.",
  },
  {
    category: "Sizing & Fit",
    question: "How do I choose the correct silhouette size?",
    answer:
      "Our ready-to-wear pieces feature an architectural, sovereign drape. We recommend consulting our comprehensive Haute Couture Size Guide for precise chest, shoulder, and waist measurements. If in doubt, our Concierge advisors are available for bespoke sizing recommendations.",
  },
  {
    category: "Returns & Exchanges",
    question: "What is the Maison Noir return charter?",
    answer:
      "We offer a 14-day complimentary return and exchange window from the date of handover. Garments must remain unworn, unaltered, and with all sovereign tags and fabric seals intact.",
  },
  {
    category: "Payment & Security",
    question: "Which payment methods are accepted?",
    answer:
      "We accept all major sovereign credit/debit cards (Visa, Mastercard, American Express), UPI, Net Banking via Razorpay and Stripe gateways, and Cash on Delivery for select domestic residences up to ₹25,000.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Acquisitions & Orders", "Logistics & Delivery", "Sizing & Fit", "Returns & Exchanges", "Payment & Security"];

  const filteredFaqs = faqs.filter(
    (item) => selectedCategory === "ALL" || item.category === selectedCategory
  );

  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> Patron Knowledge Base
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            Answers to common inquiries regarding atelier craftsmanship, white-glove courier logistics, and sovereign client services.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? "bg-gold text-noir font-semibold border-gold"
                  : "bg-surface/30 text-ivory/60 border-border/20 hover:text-ivory hover:border-gold/30"
              }`}
            >
              {cat === "ALL" ? "All Inquiries" : cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-surface/30 border border-border/20 transition-colors hover:border-gold/30"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-ivory font-light">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-ivory/70 leading-relaxed border-t border-border/10">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="border border-border/20 bg-surface/20 p-8 sm:p-10 text-center space-y-4">
          <MailIcon className="w-6 h-6 text-gold mx-auto" />
          <h2 className="font-serif text-2xl text-ivory font-light">
            Require Further Clarification?
          </h2>
          <p className="text-xs text-ivory/60 max-w-md mx-auto leading-relaxed">
            Our private client advisors are available 6 days a week to assist with bespoke orders, styling consultations, or tracking assistance.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
