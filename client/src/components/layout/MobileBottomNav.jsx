import { BrainCircuit, Building2, Flame, GraduationCap, LayoutDashboard, MessageSquare, Radar } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: GraduationCap, label: "Courses", path: "/courses" },
  { icon: BrainCircuit, label: "Graph", path: "/knowledge-graph" },
  { icon: Radar, label: "Stats", path: "/analytics" },
  { icon: Flame, label: "Focus", path: "/focus-mode" },
  { icon: MessageSquare, label: "Chat", path: "/collaboration" },
  { icon: Building2, label: "Campus", path: "/campus" }
];

export const MobileBottomNav = ({ activePath, onNavigate }) => (
  <div className="glass-card fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-3xl px-3 py-2 xl:hidden">
    {items.map((item) => {
      const Icon = item.icon;
      const isActive = activePath === item.path;
      return (
        <button
          key={item.path}
          type="button"
          onClick={() => onNavigate(item.path)}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${
            isActive ? "bg-white/10 text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="truncate">{item.label}</span>
        </button>
      );
    })}
  </div>
);
