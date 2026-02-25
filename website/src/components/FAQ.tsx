'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What makes VendROI different from a spreadsheet?',
    answer:
      'VendROI gives you an instant investment verdict (STRONG, SOLID, CAUTION, or HIGH RISK) based on proven ROI and break-even analysis. It also calculates your exact payback date, scores and compares locations, and tracks your full portfolio — all things that are error-prone and tedious in a spreadsheet.',
  },
  {
    question: 'Is VendROI financial advice?',
    answer:
      'No. VendROI is an informational tool that helps you analyze vending machine investments using the data you provide. It is not a substitute for professional financial advice. Always do your own due diligence before making investment decisions.',
  },
  {
    question: 'What does the Pro upgrade include?',
    answer:
      'Pro unlocks unlimited location comparisons, the Product Mix Optimizer, Growth Projections, Portfolio at a Glance, and priority support. It\'s a one-time purchase of $39.99 — no subscriptions, no hidden fees.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. All your investment data is stored locally on your device. We do not sell or share your data. If you opt in to anonymous benchmarking, only aggregated, de-identified data is used to help the vending community.',
  },
  {
    question: 'Does VendROI work for all types of vending machines?',
    answer:
      'Yes. Whether you\'re running snack machines, beverage machines, combo units, or specialty vending, VendROI\'s ROI calculations work with any machine type. Just enter your specific costs and product details.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 bg-vr-bg">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-vr-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-vr-text-secondary">
            Everything you need to know about VendROI.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-vr-surface rounded-xl border border-vr-border overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-vr-text font-medium pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-vr-muted flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
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
