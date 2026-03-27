export const LeaderboardCard = ({ leaderboard }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">Gamification</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">XP leaderboard</h3>
    <div className="mt-5 space-y-3">
      {leaderboard.map((entry, index) => (
        <div key={entry.name} className="subtle-card flex items-center justify-between rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-[var(--text-primary)]">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{entry.name}</span>
          </div>
          <span className="text-sm text-emerald-300">{entry.xp} XP</span>
        </div>
      ))}
    </div>
  </div>
);
