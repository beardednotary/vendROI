export function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-vr-bg" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-vr-text-secondary text-sm uppercase tracking-widest mb-6">
          Vending machine investment calculator
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vr-text mb-6 leading-tight">
          Know before{' '}
          <span className="text-vr-orange">you invest</span>
        </h1>

        <p className="text-lg md:text-xl text-vr-text-secondary leading-relaxed mb-6 max-w-2xl mx-auto">
          Calculate ROI, payback date, and get a clear investment verdict — all before you buy your first vending machine.
        </p>

        {/* quick promise bullets */}
        <div className="mx-auto max-w-2xl mb-10">
          <ul className="grid gap-3 text-left sm:grid-cols-3">
            <li className="bg-vr-surface/60 border border-vr-border rounded-xl p-4">
              <p className="text-vr-text font-semibold text-sm">Verdict</p>
              <p className="text-vr-text-secondary text-sm">STRONG / SOLID / CAUTION / HIGH RISK</p>
            </li>
            <li className="bg-vr-surface/60 border border-vr-border rounded-xl p-4">
              <p className="text-vr-text font-semibold text-sm">Payback date</p>
              <p className="text-vr-text-secondary text-sm">Know the exact break-even month</p>
            </li>
            <li className="bg-vr-surface/60 border border-vr-border rounded-xl p-4">
              <p className="text-vr-text font-semibold text-sm">Compare locations</p>
              <p className="text-vr-text-secondary text-sm">Score locations side-by-side (Pro)</p>
            </li>
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-3">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-vr-orange text-white font-semibold text-lg hover:brightness-110 transition-all"
          >
            Download on iOS
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-vr-surface border border-vr-border text-vr-text font-semibold text-lg hover:border-vr-orange/50 transition-all"
          >
            Android Waitlist
          </a>
        </div>

        <p className="text-vr-muted text-sm mb-2">
          iOS now • Android waitlist
        </p>

        <p className="text-vr-muted text-sm mb-10">
          One-time purchase • No login • Works offline • Data stays on your device
        </p>

        {/* Hero image placeholder */}
        <div
          className="w-full rounded-2xl bg-vr-surface border border-vr-border overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-vr-muted text-sm">App Screenshot</p>
              <p className="text-vr-muted text-xs mt-1">Replace with real screenshot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}