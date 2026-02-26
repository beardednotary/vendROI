const items = [
  {
    title: 'Local-first',
    desc: 'Your numbers stay on your device.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Clear verdict',
    desc: 'STRONG / SOLID / CAUTION / HIGH RISK.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'No subscriptions',
    desc: 'One-time Pro purchase.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-3.3-7" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 3v6h-6" />
      </svg>
    ),
  },
  {
    title: 'Fast setup',
    desc: 'Get a first verdict in under 5 minutes.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v5l3 2" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
  },
];

export function TrustBar() {
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="group rounded-2xl border border-vr-border bg-vr-surface/60 backdrop-blur p-5
                       shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
                       hover:border-vr-orange/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl
                           border border-vr-border bg-vr-bg text-vr-orange
                           group-hover:border-vr-orange/30 transition-colors"
              >
                {it.icon}
              </div>

              <div>
                <div className="text-vr-text font-semibold">{it.title}</div>
                <div className="text-vr-text-secondary text-sm mt-1 leading-relaxed">{it.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center sm:text-left text-vr-muted text-xs">
        Not financial advice. Estimates depend on your inputs and real-world sales.
      </p>
    </div>
  );
}