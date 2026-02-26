export function TrustBar() {
  const items = [
    {
      title: 'Local-first',
      desc: 'Your numbers stay on your device.',
    },
    {
      title: 'Clear verdict',
      desc: 'STRONG / SOLID / CAUTION / HIGH RISK.',
    },
    {
      title: 'No subscriptions',
      desc: 'One-time Pro purchase.',
    },
    {
      title: 'Fast setup',
      desc: 'Get a first verdict in under 5 minutes.',
    },
  ];

  return (
    <section className="bg-vr-bg border-b border-vr-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-vr-border bg-vr-surface p-5"
            >
              <p className="text-vr-text font-semibold text-sm">{it.title}</p>
              <p className="text-vr-text-secondary text-sm mt-1 leading-relaxed">
                {it.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-vr-muted text-xs">
            Not financial advice. Estimates depend on your inputs and real-world sales.
          </p>
        </div>
      </div>
    </section>
  );
}