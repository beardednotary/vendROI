const steps = [
  {
    number: '1',
    title: 'Enter your numbers',
    description: 'Machine cost, monthly expenses, product prices, and location details. Takes less than 5 minutes.',
  },
  {
    number: '2',
    title: 'Get your verdict',
    description: 'Instant ROI, payback date, and a clear investment verdict. STRONG, SOLID, CAUTION, or HIGH RISK.',
  },
  {
    number: '3',
    title: 'Grow with confidence',
    description: 'Compare locations, track your portfolio, and project the return on every new machine before you invest.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-vr-surface border-t border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-vr-orange text-sm font-semibold uppercase tracking-widest mb-4">How It Works</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-vr-text">
            From first input to investment verdict
          </h2>
          <p className="text-lg text-vr-text-secondary max-w-2xl mx-auto">
            No spreadsheets. No guesswork. Just clear, data-driven decisions.
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
                <h3 className="text-xl font-bold text-vr-text mb-3">{step.title}</h3>
                <p className="text-vr-text-secondary leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <a href="#verdict-examples" className="text-vr-orange text-sm font-semibold hover:underline">
            See verdict examples →
          </a>
        </div>
      </div>
    </section>
  );
}
