const steps = [
  {
    number: '1',
    title: 'Input',
    description: 'Enter your machine costs, monthly expenses, product prices, and location details. Takes less than 5 minutes.',
  },
  {
    number: '2',
    title: 'Analyze',
    description: 'Get an instant investment verdict with ROI percentage, break-even timeline, and a clear payback date.',
  },
  {
    number: '3',
    title: 'Grow',
    description: 'Track performance across your portfolio, compare locations, and project growth over time.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-vr-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-vr-orange">How It Works</span>
          </h2>
          <p className="text-lg text-vr-text-secondary max-w-2xl mx-auto">
            From first input to full portfolio tracking in minutes
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[16%] right-[16%] h-px bg-vr-border" />

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center relative">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-vr-orange text-white text-xl font-bold mb-6 z-10">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-vr-text mb-3">{step.title}</h3>
                <p className="text-vr-text-secondary leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
