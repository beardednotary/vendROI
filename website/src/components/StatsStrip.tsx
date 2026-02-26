const stats = [
  { label: 'Machine cost modeled', value: '$2k – $8k' },
  { label: 'COGS range assumed', value: '55 – 70%' },
  { label: 'Verdict factors', value: 'ROI + Payback + Margin' },
  { label: 'Time to first verdict', value: '< 5 min' },
];

export function StatsStrip() {
  return (
    <div className="border-y border-vr-border bg-vr-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-vr-border">
          {stats.map((stat, i) => (
            <div key={i} className="text-center lg:px-8">
              <p className="text-vr-text font-bold text-lg md:text-xl">{stat.value}</p>
              <p className="text-vr-muted text-xs uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
