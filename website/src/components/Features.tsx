const features = [
  {
    title: 'Investment Verdict',
    description:
      'Get an instant, color-coded verdict on any vending machine investment — STRONG, SOLID, CAUTION, or HIGH RISK — based on ROI and break-even analysis.',
  },
  {
    title: 'Location Comparison',
    description:
      'Score and compare potential vending locations side by side. See estimated daily sales, monthly profit, and overall location score out of 100.',
  },
  {
    title: 'Product Mix Optimizer',
    description:
      'Dial in your product selection. Track margins per item, see which products drive profit, and optimize your inventory mix.',
  },
  {
    title: 'Growth Projections',
    description:
      'See where your vending portfolio is headed. Project revenue, profit, and ROI over 6, 12, and 24 months.',
  },
  {
    title: 'Portfolio at a Glance',
    description:
      'Your complete vending portfolio in one view. Total invested, annual revenue, ROI, monthly profit, break-even status — always one tap away.',
  },
  {
    title: 'Operator IQ',
    description:
      'A personalized score that measures your vending investment skill — based on ROI performance, diversification, and decision quality.',
    comingSoon: true,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-vr-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="text-vr-orange">Invest Smarter</span>
          </h2>
          <p className="text-lg text-vr-text-secondary max-w-2xl mx-auto">
            Six tools designed specifically for vending machine operators and investors.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative bg-vr-surface rounded-2xl p-6 border border-vr-border hover:border-vr-orange/30 transition-colors"
            >
              {feature.comingSoon && (
                <span className="absolute top-4 right-4 text-vr-muted text-xs font-medium uppercase tracking-wider">
                  Coming Soon
                </span>
              )}

              <h3 className="text-lg font-bold text-vr-text mb-2">{feature.title}</h3>
              <p className="text-vr-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
