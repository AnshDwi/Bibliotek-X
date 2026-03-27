import { BarChart3, BrainCircuit, BriefcaseBusiness, Building2, BusFront, CreditCard, FileBadge2, Flame, GraduationCap, House, LayoutDashboard, LibraryBig, MessageSquare, Radar, Receipt, ScrollText, ShieldCheck, Waypoints } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: GraduationCap, label: "Courses", path: "/courses" },
  { icon: BrainCircuit, label: "Knowledge Graph", path: "/knowledge-graph" },
  { icon: Radar, label: "Analytics", path: "/analytics" },
  { icon: Flame, label: "Focus Mode", path: "/focus-mode" },
  { icon: MessageSquare, label: "Collaboration", path: "/collaboration" },
  { icon: ScrollText, label: "Exams", path: "/exams" },
  { icon: Receipt, label: "Fees", path: "/fees" },
  { icon: FileBadge2, label: "Documents", path: "/documents" },
  { icon: CreditCard, label: "ID Card", path: "/id-card" },
  { icon: House, label: "Hostel", path: "/hostel" },
  { icon: BusFront, label: "Transport", path: "/transport" },
  { icon: BriefcaseBusiness, label: "Placements", path: "/placements" },
  { icon: Waypoints, label: "Internships", path: "/internships" },
  { icon: LibraryBig, label: "Library", path: "/library" },
  { icon: ShieldCheck, label: "Leave", path: "/leave" },
  { icon: BarChart3, label: "Results", path: "/results" },
  { icon: Building2, label: "Admin Queue", path: "/admin-queue" },
  { icon: Building2, label: "Campus", path: "/campus" }
];

export const Sidebar = ({ activePath, onNavigate }) => (
  <aside className="glass-card relative hidden w-72 flex-col overflow-hidden rounded-3xl p-5 xl:flex">
    <div className="blob left-6 top-6 h-24 w-24 bg-sky-400/40" />
    <div className="blob bottom-12 right-0 h-28 w-28 bg-fuchsia-400/30" />
    <div className="mb-8">
      <div className="inline-flex rounded-2xl bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
        Bibliotek X
      </div>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Learning Operating System</h1>
      <p className="mt-3 text-sm text-muted">
        AI-first orchestration for adaptive learning, analytics, content intelligence, and collaboration.
      </p>
    </div>
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePath === item.path;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.path)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition duration-300 ease-in-out ${
              isActive
                ? "bg-gradient-to-r from-sky-500/20 via-fuchsia-500/20 to-cyan-400/20 text-[var(--text-primary)] shadow-[0_0_24px_rgba(96,165,250,0.18)]"
                : "text-[var(--text-secondary)] hover:bg-white/8 hover:text-[var(--text-primary)]"
            }`}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  </aside>
);
