"use client";

import React from "react";
import { Star, CheckCircle, Quote, ThumbsUp } from "lucide-react";
import { CUSTOMER_REVIEWS } from "@/lib/data/reviews";

interface ReviewsSectionProps {
  lang: "id" | "en";
}

export default function ReviewsSection({ lang }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-20 bg-[#0e1d24] border-t border-[#f3efe6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{lang === "id" ? "Ulasan Asli Wisatawan" : "Verified Guest Reviews"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#f3efe6] tracking-tight">
            {lang === "id" ? "Pengalaman Nyata Pelanggan Kami" : "What Travelers Say About BaliRide"}
          </h2>
          <p className="mt-2 text-[#93a39e] text-sm sm:text-base">
            {lang === "id"
              ? "Lebih dari 1.200 ulasan bintang 5 dari wisatawan domestik dan internasional yang telah merasakan kenyamanan layanan kami."
              : "Rated 4.9/5 across over 1,200 verified bookings for car rentals and island crossings."}
          </p>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[rgba(15,34,43,0.85)] rounded-2xl p-6 sm:p-7 border border-[#f3efe6]/10 shadow-xl shadow-black/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between backdrop-blur-xs"
            >
              <div>
                {/* Header: Stars & Trip type */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0b171c] border border-[#f3efe6]/10 text-[#93a39e]">
                    {rev.tripType}
                  </span>
                </div>

                {/* Comment quote */}
                <p className="text-[#c8d8d2] text-sm sm:text-base italic leading-relaxed mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author and Service meta */}
              <div className="pt-4 border-t border-[#f3efe6]/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-bold text-[#f3efe6]">{rev.name}</strong>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#14b8a6] bg-[#14b8a6]/10 px-1.5 py-0.5 rounded border border-[#14b8a6]/30">
                        <CheckCircle className="w-3 h-3 text-[#14b8a6]" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#93a39e]">{rev.origin} • {rev.date}</p>
                </div>

                <div className="text-right text-[11px] font-medium text-[#93a39e] max-w-[180px] truncate">
                  {rev.serviceUsed}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
