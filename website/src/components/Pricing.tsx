const freeFeatures = [
  'Investment Verdict',
  'Basic ROI calculator',
  'Single location tracking',
  'Break-even estimate',
];

const proFeatures = [
  'Everything in Free',
  'Unlimited locations',
  'Location Comparison scoring',
  'Product Mix Optimizer',
  'Growth Projections',
  'Portfolio at a Glance',
  'Operator IQ (coming soon)',
  'Priority support',
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-vr-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-vr-orange">One Price. Forever.</span>
          </h2>
          <p className="text-lg text-vr-text-secondary max-w-2xl mx-auto">
            No subscriptions. No hidden fees. Pay once, own it forever.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-vr-bg rounded-2xl p-8 border border-vr-border">
            <h3 className="text-lg font-semibold text-vr-text mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-vr-text">$0</span>
            </div>
            <p className="text-vr-text-secondary text-sm mb-8">
              Get started and evaluate your first investment.
            </p>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-vr-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-vr-text-secondary text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="block w-full text-center py-3 rounded-xl bg-vr-surface border border-vr-border text-vr-text font-semibold hover:border-vr-orange/30 transition-colors"
            >
              Download Free
            </a>
          </div>

          {/* Pro */}
          <div className="bg-vr-bg rounded-2xl p-8 border-2 border-vr-orange/40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-vr-text">Pro</h3>
              <span className="text-vr-orange text-xs font-semibold uppercase tracking-wider">Best Value</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-vr-orange">$39.99</span>
            </div>
            <p className="text-vr-muted text-xs mb-6">One-time purchase. No subscription.</p>
            <p className="text-vr-text-secondary text-sm mb-8">
              Unlock every tool. Make smarter investments across your entire portfolio.
            </p>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-vr-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-vr-text text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="block w-full text-center py-3 rounded-xl bg-vr-orange text-white font-semibold hover:brightness-110 transition-all"
            >
              Get Pro — $39.99
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
