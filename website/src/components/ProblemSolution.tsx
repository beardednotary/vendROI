export function ProblemSolution() {
  return (
    <section className="py-20 md:py-32 bg-vr-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Problem */}
          <div>
            <p className="text-vr-risk text-sm font-semibold uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-2xl md:text-3xl font-bold text-vr-text mb-4">
              Stop Guessing With Your Money
            </h2>
            <p className="text-vr-text-secondary mb-8">
              Most vending operators make investment decisions based on gut feelings, scattered spreadsheets, and YouTube advice. The result? Overpaying for machines, picking bad locations, and waiting years to break even.
            </p>

            <ul className="space-y-3">
              {[
                'Scattered spreadsheets with no clear verdict',
                'No way to objectively compare locations',
                'No idea when you\'ll actually break even',
                'Gut-feel decisions on product mix',
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
              One App. Complete Visibility.
            </h2>
            <p className="text-vr-text-secondary mb-8">
              VendROI gives you a clear investment verdict, an actual payback date, location scoring, and product mix analysis — all in one place.
            </p>

            <div className="space-y-4">
              {[
                {
                  label: 'Investment Verdict',
                  text: 'STRONG, SOLID, CAUTION, or HIGH RISK — instantly',
                },
                {
                  label: 'Payback Date',
                  text: 'Know the exact month you\'ll break even',
                },
                {
                  label: 'Location Scoring',
                  text: 'Compare locations with objective data',
                },
                {
                  label: 'Product Mix Analysis',
                  text: 'Optimize what you stock for max profit',
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
      </div>
    </section>
  );
}
