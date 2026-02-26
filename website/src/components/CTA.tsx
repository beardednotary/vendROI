export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-vr-surface">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vr-text mb-6">
          Start Making{' '}
          <span className="text-vr-orange">Smarter Investments</span>
        </h2>
        <p className="text-lg text-vr-text-secondary mb-10 max-w-2xl mx-auto">
          Join vending operators who use data — not guesswork — to build profitable portfolios.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-vr-orange text-white font-semibold text-lg hover:brightness-110 transition-all"
          >
            Download for iOS
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-vr-bg border border-vr-border text-vr-text font-semibold text-lg hover:border-vr-orange/50 transition-all"
          >
            Join Android Waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
