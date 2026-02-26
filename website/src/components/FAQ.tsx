'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What makes VendROI different from a spreadsheet?',
    answer:
      'VendROI turns your inputs into a clear verdict (STRONG, SOLID, CAUTION, HIGH RISK) with ROI + payback date + margin, and (Pro) location comparisons + portfolio view. Spreadsheets can do math — they don't tell you what to do next.',
  },
  {
    question: 'Is VendROI financial advice?',
    answer:
      'No. VendROI is an informational tool based on the data you enter. Always do your own due diligence before investing.',
  },
  {
    question: 'What does the Pro upgrade include?',
    answer:
      'Unlimited locations, side-by-side location scoring, Product Mix Optimizer, Growth Projections, Portfolio at a Glance, and priority support. One-time purchase — no subscriptions.',
  },
  {
    question: 'Can I restore my Pro purchase later?',
    answer:
      'Yes. You can restore purchases anytime on the same Apple ID / Google account you used to buy Pro.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. Your investment data stays on your device. We don't sell or share your data. If you ever opt into anonymous benchmarking, it's aggregated and de-identified.',
  },
  {
    question: 'Does VendROI work for all types of vending machines?',
    answer:
      'Yes — snack, beverage, combo, and specialty machines. The model adapts to your costs, prices, and sales estimates.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 bg-vr-surface border-t border-vr-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-vr-orange text-sm font-semibold uppercase tracking-widest mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-vr-text">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-vr-bg rounded-xl border border-vr-border overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className="text-vr-text font-medium text-sm">{faq.question}</span>
                <svg
                  className={`w-4 h-4 text-vr-muted flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-vr-text-secondary text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
