export const FocusModeCard = ({ analytics }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">Focus mode engine</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Adaptive Pomodoro + session analytics</h3>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <div className="subtle-card rounded-2xl p-4">
        <p className="text-sm text-muted">Efficiency</p>
        <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{analytics.efficiencyScore}%</p>
      </div>
      <div className="subtle-card rounded-2xl p-4">
        <p className="text-sm text-muted">Burnout</p>
        <p className="mt-2 text-2xl font-bold text-cyan-300">{analytics.burnoutIndicator}</p>
      </div>
      <div className="subtle-card rounded-2xl p-4">
        <p className="text-sm text-muted">Adaptive timer</p>
        <p className="mt-2 text-2xl font-bold text-fuchsia-300">24:12</p>
      </div>
    </div>
    <p className="mt-4 text-sm text-muted">
      The frontend can emit inactivity and visibility-change events to the focus session API to continuously score attention quality.
    </p>
  </div>
);
