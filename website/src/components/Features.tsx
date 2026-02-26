const features = [
  {
    title: 'Is this investment worth the risk?',
    description:
      'Get an instant verdict — STRONG, SOLID, CAUTION, or HIGH RISK — based on ROI, payback timeline, and margin. No ambiguity.',
  },
  {
    title: 'Which location makes money faster?',
    description:
      'Score and compare locations side by side. See estimated daily sales, monthly profit, and a 0–100 location score before you commit.',
  },
  {
    title: 'What should I stock to maximize return?',
    description:
      'Track margin per product, see what\'s dragging profitability, and optimize your inventory mix for maximum capital efficiency.',
  },
  {
    title: 'If I add 1 machine per quarter, what happens?',
    description:
      'Project total revenue, profit, and ROI across 6, 12, and 24 months. See how each new machine changes your portfolio\'s return.',
  },
  {
    title: 'How is my whole portfolio performing?',
    description:
      'Total invested, annual revenue, blended ROI, monthly profit, and break-even status — your entire operation in one view.',
  },
  {
    title: 'Am I making better decisions over time?',
    description:
      'A personalized score measuring your investment quality — based on ROI performance, diversification, and decision history.',
    comingSoon: true,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-vr-surface border-t border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-vr-orange text-sm font-semibold uppercase tracking-widest mb-4">Decisions, Not Features</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Every answer an operator{' '}
            <span className="text-vr-orange">actually needs</span>
          </h2>
          <p className="text-lg text-vr-text-secondary max-w-2xl mx-auto">
            Built around the decisions that determine whether your capital works for you — or against you.
          </p>
        </div>

        {/* Decision grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative bg-vr-bg rounded-2xl p-6 border border-vr-border hover:border-vr-orange/30 transition-colors"
            >
              {feature.comingSoon && (
                <span className="absolute top-4 right-4 text-vr-muted text-xs font-medium uppercase tracking-wider">
                  Coming Soon
                </span>
              )}

              <h3 className="text-base font-bold text-vr-text mb-2 leading-snug pr-16">{feature.title}</h3>
              <p className="text-vr-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#pricing" className="text-vr-orange text-sm font-semibold hover:underline">
            See pricing →
          </a>
        </div>
      </div>
    </section>
  );
}
