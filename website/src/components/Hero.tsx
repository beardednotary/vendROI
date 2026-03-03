import Image from 'next/image';
import { TrustBar } from '@/components/TrustBar';

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-vr-bg" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy + CTAs */}
          <div className="text-center lg:text-left">
            <p className="text-vr-text-secondary text-xs sm:text-sm uppercase tracking-widest mb-5">
              Vending Machine Investment Calculator
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vr-text mb-5 leading-tight">
              Know before{' '}
              <span className="text-vr-orange">you invest</span>
            </h1>

            <p className="text-lg md:text-xl text-vr-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Calculate ROI, payback date, and get a clear investment verdict — all before you buy your first vending machine.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl
                           bg-vr-orange text-white font-semibold text-base sm:text-lg
                           hover:brightness-110 transition-all"
              >
                Download on iOS
              </a>

              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl
                           bg-vr-surface border border-vr-border text-vr-text font-semibold text-base sm:text-lg
                           hover:border-vr-orange/50 transition-all"
              >
                Android Waitlist
              </a>
            </div>

            <p className="mt-3 text-vr-muted text-sm">
              iOS now • Android waitlist
            </p>

            <p className="mt-3 text-vr-muted text-xs">
              One-time purchase • No login • Works offline • Data stays on your device
            </p>

            {/* Trust bar (the punchy part you circled) */}
            <TrustBar />
          </div>

          {/* Right: phone frame instead of 16:9 slab */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[290px] sm:w-[320px]">
              <div
                className="rounded-[2.25rem] border border-vr-border bg-vr-surface/70 backdrop-blur
                           shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]
                           overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-vr-border/70">
                  <p className="text-vr-text font-semibold">App preview</p>
                  <p className="text-vr-muted text-xs mt-1">Investment Summary screen</p>
                </div>

                <div className="aspect-[9/19] relative">
                  <Image
                    src="/images/vendroi-app-summary-screen.jpg"
                    alt="VendROI app Investment Summary screen showing ROI, monthly profit, and payback metrics"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 290px, 320px"
                    priority
                  />
                </div>
              </div>

              {/* subtle glow */}
              <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.18),transparent_55%)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
