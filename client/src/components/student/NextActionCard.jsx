export const NextActionCard = ({ nextAction, onNavigate }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">What&apos;s next</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{nextAction?.title || "Continue your learning path"}</h3>
    <p className="mt-3 text-sm text-muted">
      {nextAction?.description || "Open your next course activity, review your weak areas, and keep momentum going."}
    </p>
    <button
      type="button"
      onClick={() =>
        onNavigate(
          nextAction?.routePath ||
            (nextAction?.sectionId === "dashboard-courses"
              ? "/courses"
              : nextAction?.sectionId === "dashboard-graph"
                ? "/knowledge-graph"
                : "/courses")
        )
      }
      className="gradient-button mt-5 rounded-2xl px-4 py-3 text-sm font-semibold"
    >
      {nextAction?.routePath === "/courses" || nextAction?.sectionId === "dashboard-courses"
        ? "Open course workspace"
        : "Open next learning step"}
    </button>
  </div>
);
