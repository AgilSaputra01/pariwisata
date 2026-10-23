"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FAQ_LIST } from "@/lib/data/faqs";

interface FAQSectionProps {
  lang: "id" | "en";
}

export default function FAQSection({ lang }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#0e1d24] border-t border-[#f3efe6]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#14b8a6]" />
            <span>{lang === "id" ? "Pertanyaan Umum" : "Frequently Asked Questions"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
            {lang === "id" ? "Semua yang Perlu Anda Ketahui" : "Got Questions? We Have Answers"}
          </h2>
          <p className="mt-2 text-[#93a39e] text-sm sm:text-base">
            {lang === "id"
              ? "Informasi seputar cara pesan, tiket fastboat, refund/reschedule, dan sewa mobil di Bali."
              : "Clear answers to your fastboat, luggage, delay policy, and car rental inquiries."}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[rgba(15,34,43,0.85)] rounded-2xl border border-[#f3efe6]/10 shadow-xl shadow-black/40 overflow-hidden backdrop-blur-xs transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold font-display text-[#f3efe6]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-[#14b8a6] text-[#0b171c] rotate-180" : "bg-[#0b171c] text-[#93a39e] border border-[#f3efe6]/10"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-0 text-[#c8d8d2] text-xs sm:text-sm leading-relaxed border-t border-[#f3efe6]/10 animate-in fade-in duration-200">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
