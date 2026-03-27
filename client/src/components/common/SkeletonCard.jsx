export const SkeletonCard = ({ className = "" }) => (
  <div className={`glass-card animate-pulse rounded-3xl ${className}`}>
    <div className="space-y-4 p-6">
      <div className="h-4 w-24 rounded-full bg-[var(--skeleton)]" />
      <div className="h-8 w-32 rounded-full bg-[var(--skeleton)]" />
      <div className="h-24 rounded-2xl bg-[var(--skeleton)]" />
    </div>
  </div>
);

