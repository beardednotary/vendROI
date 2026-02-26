export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-vr-bg" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-vr-text-secondary text-sm uppercase tracking-widest mb-6">
          Built for operators buying their first machine — and serious owners scaling their portfolio.
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vr-text mb-6 leading-tight">
          Your investment verdict{' '}
          <span className="text-vr-orange">in minutes</span>
        </h1>

        <p className="text-lg md:text-xl text-vr-text-secondary leading-relaxed mb-3 max-w-2xl mx-auto">
          Get ROI, payback date, and a clear verdict in minutes — before you spend thousands on your first machine.
        </p>

        <p className="text-vr-muted text-sm mb-10">
          Not a spreadsheet. Not a guess. A decision.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-vr-orange text-white font-semibold text-lg hover:brightness-110 transition-all"
          >
            App Store
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-vr-surface border border-vr-border text-vr-text font-semibold text-lg hover:border-vr-orange/50 transition-all"
          >
            Google Play
          </a>
        </div>

        <p className="text-vr-muted text-sm mb-14">
          Available on iOS &amp; Android
        </p>

        {/* Hero image placeholder */}
        <div className="w-full rounded-2xl bg-vr-surface border border-vr-border overflow-hidden" style={{ aspectRatio: '16/9' }}>
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
