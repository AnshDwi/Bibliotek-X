export const PageHeader = ({ eyebrow, title, description, breadcrumbs = [] }) => (
  <div className="glass-card rounded-3xl p-6">
    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200">
      {breadcrumbs.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-2">
          {index ? <span className="text-muted">/</span> : null}
          <span>{item}</span>
        </span>
      ))}
    </div>
    <p className="mt-4 text-sm text-muted">{eyebrow}</p>
    <h2 className="mt-1 text-3xl font-bold text-[var(--text-primary)]">{title}</h2>
    <p className="mt-3 max-w-3xl text-sm text-muted">{description}</p>
  </div>
);
