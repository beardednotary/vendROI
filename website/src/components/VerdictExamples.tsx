const examples = [
  {
    verdict: 'STRONG',
    color: 'text-vr-green',
    border: 'border-vr-green/30',
    bg: 'bg-vr-green/5',
    roi: '52%',
    payback: '8 mo',
    margin: '38%',
    net: '$525/mo',
    detail: 'High-traffic office park, solid sales estimate, strong margins.',
  },
  {
    verdict: 'CAUTION',
    color: 'text-vr-orange',
    border: 'border-vr-orange/30',
    bg: 'bg-vr-orange/5',
    roi: '18%',
    payback: '20 mo',
    margin: '22%',
    net: '$165/mo',
    detail: 'Moderate traffic. Profitable, but payback is slow unless optimized.',
  },
  {
    verdict: 'HIGH RISK',
    color: 'text-vr-risk',
    border: 'border-vr-risk/30',
    bg: 'bg-vr-risk/5',
    roi: '6%',
    payback: '44 mo',
    margin: '11%',
    net: '$45/mo',
    detail: 'Low sales estimate ties up capital for years. Probably pass.',
  },
];

export function VerdictExamples() {
  return (
    <section className="py-20 md:py-32 bg-vr-bg border-t border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-vr-orange text-sm font-semibold uppercase tracking-widest mb-4">
            Verdict Examples
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-vr-text mb-4">
            Know the answer{' '}
            <span className="text-vr-orange">before you commit capital</span>
          </h2>
          <p className="text-vr-text-secondary max-w-xl mx-auto">
            The verdict is designed to be obvious — even if you hate spreadsheets.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((ex, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${ex.border} ${ex.bg}`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${ex.color}`}>
                {ex.verdict}
              </span>

              <div className="mt-4 grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="text-vr-muted text-xs uppercase tracking-wider mb-1">ROI</p>
                  <p className={`text-2xl font-bold ${ex.color}`}>{ex.roi}</p>
                </div>
                <div>
                  <p className="text-vr-muted text-xs uppercase tracking-wider mb-1">Net / mo</p>
                  <p className="text-2xl font-bold text-vr-text">{ex.net}</p>
                </div>
                <div>
                  <p className="text-vr-muted text-xs uppercase tracking-wider mb-1">Payback</p>
                  <p className="text-2xl font-bold text-vr-text">{ex.payback}</p>
                </div>
                <div>
                  <p className="text-vr-muted text-xs uppercase tracking-wider mb-1">Margin</p>
                  <p className="text-2xl font-bold text-vr-text">{ex.margin}</p>
                </div>
              </div>

              <p className="text-vr-text-secondary text-sm leading-relaxed border-t border-vr-border pt-4">
                {ex.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#pricing" className="text-vr-orange text-sm font-semibold hover:underline">
            See pricing →
          </a>
        </div>
      </div>
    </section>
  );
}