'use client';

import { useState } from 'react';
import Image from 'next/image';

const slides = [
  { label: 'Investment Verdict', description: 'STRONG · ROI 119% · Payback 10.1 mo', src: '/images/Investment-Verdict.png' },
  { label: 'Location Comparison', description: 'Side-by-side scoring across locations', src: '/images/Location-Comparison.png' },
  { label: 'Payback Timeline', description: 'Month-by-month break-even projection', src: '/images/Payback-Timeline.png' },
  { label: 'Product Mix', description: 'Margin by product, optimized for return', src: '/images/Product-Mix.png' },
  { label: 'Portfolio Summary', description: 'Total invested, blended ROI, monthly profit', src: '/images/Portfolio-Summary.png' },
];

export function ScreenshotsCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <section className="py-20 md:py-28 bg-vr-surface border-t border-vr-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-vr-orange text-sm font-semibold uppercase tracking-widest mb-3">Inside the App</p>
          <h2 className="text-2xl md:text-3xl font-bold text-vr-text">
            Every screen built around a decision
          </h2>
        </div>

        <div className="flex flex-col items-center">
          {/* Phone frame */}
          <div className="relative w-[260px] sm:w-[300px]">
            {/* Prev */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-vr-bg border border-vr-border flex items-center justify-center text-vr-text hover:border-vr-orange/50 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Screenshot */}
            <div className="rounded-[2.25rem] border border-vr-border bg-vr-bg overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
              <div className="relative aspect-[9/19]">
                <Image
                  key={slides[current].src}
                  src={slides[current].src}
                  alt={slides[current].label}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            </div>

            {/* Next */}
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-vr-bg border border-vr-border flex items-center justify-center text-vr-text hover:border-vr-orange/50 transition-colors"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Label */}
          <div className="mt-6 text-center">
            <p className="text-vr-text font-semibold">{slides[current].label}</p>
            <p className="text-vr-muted text-sm mt-1">{slides[current].description}</p>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-vr-orange' : 'bg-vr-border'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
