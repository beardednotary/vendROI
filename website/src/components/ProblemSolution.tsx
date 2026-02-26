export function ProblemSolution() {
  return (
    <section className="py-20 md:py-32 bg-vr-bg border-t border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Problem */}
          <div>
            <p className="text-vr-risk text-sm font-semibold uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-2xl md:text-3xl font-bold text-vr-text mb-4">
              Stop guessing with your capital
            </h2>
            <p className="text-vr-text-secondary mb-8">
              Most operators commit thousands of dollars based on gut instinct, seller projections, and YouTube advice. By the time the numbers don't add up, the capital is already deployed.
            </p>

            <ul className="space-y-3">
              {[
                "Seller numbers don't match reality",
                'Busy location ≠ profitable location',
                "You don't know payback until it's too late",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-vr-text-secondary text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-vr-risk flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div>
            <p className="text-vr-green text-sm font-semibold uppercase tracking-widest mb-4">The Solution</p>
            <h2 className="text-2xl md:text-3xl font-bold text-vr-text mb-4">
              One app. A clear verdict.
            </h2>
            <p className="text-vr-text-secondary mb-8">
              VendROI models your investment before you make it. Enter your numbers and get a verdict — ROI, payback date, and a clear risk rating — so every decision is grounded in data.
            </p>

            <div className="space-y-4">
              {[
                {
                  label: 'Investment Verdict',
                  text: 'STRONG, SOLID, CAUTION, or HIGH RISK — based on your actual numbers',
                },
                {
                  label: 'Payback Date',
                  text: 'Know the exact month your capital returns to you',
                },
                {
                  label: 'Location Scoring',
                  text: 'Objective data to compare profitable locations vs. risky ones',
                },
                {
                  label: 'Product Mix Analysis',
                  text: 'Maximize return by stocking what actually sells at margin',
                },
              ].map((item, i) => (
                <div key={i} className="bg-vr-surface rounded-xl p-4 border border-vr-border">
                  <span className="text-vr-text font-semibold text-sm block mb-1">{item.label}</span>
                  <span className="text-vr-text-secondary text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="#how-it-works" className="text-vr-orange text-sm font-semibold hover:underline">
            See how it works →
          </a>
        </div>
      </div>
    </section>
  );
}
