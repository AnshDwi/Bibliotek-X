export const Badge = ({ children, tone = "default" }) => {
  const tones = {
    default: "bg-white/10 text-[var(--text-primary)] border border-white/10",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20",
    alert: "bg-rose-500/15 text-rose-300 border border-rose-400/20",
    info: "bg-sky-500/15 text-sky-300 border border-sky-400/20"
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone] || tones.default}`}>
      {children}
    </span>
  );
};
