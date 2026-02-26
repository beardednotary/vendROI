import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support - VendROI',
  description: 'Get help with VendROI — FAQ, contact, and troubleshooting.',
};

const faqs = [
  {
    question: 'How do I reset my data and start fresh?',
    answer:
      'Go to your device Settings, find VendROI (or Expo Go if testing), and clear the app data/cache. This will reset all your investment data and show the onboarding again.',
  },
  {
    question: 'My investment verdict says HIGH RISK — what should I do?',
    answer:
      'HIGH RISK means the app detected that your investment is not currently profitable based on the numbers you entered. Double-check your inputs (monthly revenue, expenses, machine cost) and consider adjusting your product mix or finding a higher-traffic location.',
  },
  {
    question: 'How is the break-even date calculated?',
    answer:
      'Break-even is calculated by dividing your total initial investment by your monthly net profit. The payback date is the calendar month when you\'ll have recouped your full investment at current profit levels.',
  },
  {
    question: 'Can I track multiple machines?',
    answer:
      'Yes! With VendROI Pro, you can add unlimited locations and track your complete vending portfolio. The Portfolio at a Glance view gives you a summary across all machines.',
  },
  {
    question: 'How do I restore my Pro purchase on a new device?',
    answer:
      'Open VendROI on your new device, go to the upgrade screen, and tap "Restore Purchases." Your Pro status will be restored through the App Store or Play Store.',
  },
  {
    question: 'Is my data backed up?',
    answer:
      'Currently, VendROI stores data locally on your device. If you delete the app, your data will be lost. Cloud backup is on our roadmap for a future update.',
  },
];

export default function Support() {
  return (
    <div className="pt-28 pb-20 bg-vr-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-vr-text mb-2">Support</h1>
        <p className="text-vr-text-secondary mb-10">
          Need help? Find answers below or reach out directly.
        </p>

        {/* Contact card */}
        <div className="bg-vr-surface rounded-2xl p-6 border border-vr-border mb-12">
          <h2 className="text-lg font-bold text-vr-text mb-3">Contact Us</h2>
          <p className="text-vr-text-secondary text-sm mb-4">
            Have a question, bug report, or feature request? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:support@vendroi.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vr-orange text-white text-sm font-semibold hover:brightness-110 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            support@vendroi.com
          </a>
          <p className="text-vr-muted text-xs mt-3">
            We typically respond within 24 hours.
          </p>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-vr-text mb-6">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-vr-surface rounded-xl p-5 border border-vr-border">
              <h3 className="text-vr-text font-semibold mb-2">{faq.question}</h3>
              <p className="text-vr-text-secondary text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* App Store links */}
        <div className="mt-12 bg-vr-surface rounded-2xl p-6 border border-vr-border text-center">
          <h2 className="text-lg font-bold text-vr-text mb-2">Rate VendROI</h2>
          <p className="text-vr-text-secondary text-sm mb-4">
            Enjoying the app? A review helps other vending operators find us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-vr-bg border border-vr-border text-vr-text text-sm font-semibold hover:border-vr-orange/30 transition-all"
            >
              Rate on App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-vr-bg border border-vr-border text-vr-text text-sm font-semibold hover:border-vr-orange/30 transition-all"
            >
              Rate on Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
