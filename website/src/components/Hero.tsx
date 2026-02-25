export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-vr-bg" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="text-vr-text-secondary text-sm uppercase tracking-widest mb-6">
              Vending Machine Investment Calculator
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vr-text mb-6 leading-tight">
              Know Before{' '}
              <span className="text-vr-orange">You Invest</span>
            </h1>

            <p className="text-lg md:text-xl text-vr-text-secondary leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Calculate ROI, compare locations, and get a clear investment verdict — all before buying your first vending machine.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
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

            <p className="text-vr-muted text-sm">
              Available on iOS &amp; Android
            </p>
          </div>

          {/* Phone mockup placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-[280px] h-[560px] rounded-[3rem] bg-vr-surface border border-vr-border flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-vr-muted text-sm">App Screenshot</p>
                <p className="text-vr-muted text-xs mt-1">Replace with real screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
