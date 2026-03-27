import { Bell, LaptopMinimal, LogOut, MoonStar, Search, SunMedium } from "lucide-react";
import { useMemo, useState } from "react";

const buildSearchItems = ({ courses = [], graph = { nodes: [] }, notifications = [], user, teacher }) => {
  const items = [
    {
      id: "route-exams",
      title: "Exams",
      subtitle: "Exam schedule and hall tickets",
      routePath: "/exams",
      kind: "Page"
    },
    {
      id: "route-fees",
      title: "Fees",
      subtitle: "Fee status and payment page",
      routePath: "/fees",
      kind: "Page"
    },
    {
      id: "route-documents",
      title: "Documents",
      subtitle: "Bonafide, transcript, and admin requests",
      routePath: "/documents",
      kind: "Page"
    },
    {
      id: "route-id-card",
      title: "ID Card",
      subtitle: "Digital campus identity card",
      routePath: "/id-card",
      kind: "Page"
    },
    {
      id: "route-hostel",
      title: "Hostel",
      subtitle: "Residency pass and room details",
      routePath: "/hostel",
      kind: "Page"
    },
    {
      id: "route-transport",
      title: "Transport",
      subtitle: "Bus pass and route details",
      routePath: "/transport",
      kind: "Page"
    },
    {
      id: "route-placements",
      title: "Placements",
      subtitle: "Placement cell tracker",
      routePath: "/placements",
      kind: "Page"
    },
    {
      id: "route-internships",
      title: "Internships",
      subtitle: "Internship and training tracker",
      routePath: "/internships",
      kind: "Page"
    },
    {
      id: "route-admin-queue",
      title: "Admin Queue",
      subtitle: "Operations and approvals queue",
      routePath: "/admin-queue",
      kind: "Page"
    },
    {
      id: "route-library",
      title: "Library",
      subtitle: "Issued books, due dates, and fines",
      routePath: "/library",
      kind: "Page"
    },
    {
      id: "route-leave",
      title: "Leave",
      subtitle: "Leave application workflow",
      routePath: "/leave",
      kind: "Page"
    },
    {
      id: "route-results",
      title: "Results",
      subtitle: "Published assessment results",
      routePath: "/results",
      kind: "Page"
    },
    ...courses.map((course) => ({
      id: `course-${course._id}`,
      title: course.title,
      subtitle: course.category,
      routePath: "/courses",
      kind: "Course"
    })),
    ...(graph.nodes || []).map((node) => ({
      id: `topic-${node.id}`,
      title: node.label,
      subtitle: "Knowledge graph topic",
      routePath: "/knowledge-graph",
      kind: "Topic"
    })),
    ...notifications.map((item) => ({
      id: `notification-${item.id}`,
      title: item.title,
      subtitle: item.body,
      routePath: item.title.toLowerCase().includes("attendance") ? "/campus" : "/analytics",
      kind: "Notification"
    }))
  ];

  if (user?.role === "teacher") {
    items.push(
      ...((teacher?.students || []).map((student) => ({
        id: `student-${student.id}`,
        title: student.name,
        subtitle: `${student.averageScore}% avg | ${student.attendanceRate}% attendance`,
        routePath: "/analytics",
        kind: "Student"
      })))
    );
  }

  return items;
};

export const Topbar = ({
  theme,
  setTheme,
  toggleTheme,
  notifications = [],
  user,
  teacher,
  courses,
  graph,
  onLogout,
  onNavigate,
  onMarkNotificationRead
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchItems = useMemo(
    () => buildSearchItems({ courses, graph, notifications, user, teacher }),
    [courses, graph, notifications, teacher, user]
  );
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchItems.slice(0, 6);
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    return searchItems
      .filter((item) =>
        `${item.title} ${item.subtitle} ${item.kind}`.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8);
  }, [searchItems, searchQuery]);
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="glass-card relative z-[70] flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Adaptive Intelligence</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Next best learning path, generated live</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--text-secondary)]">
            <Search className="h-4 w-4" />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              placeholder="Search knowledge, content, courses, or students"
              className="w-56 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
            />
          </div>
          {showSearch ? (
            <div className="absolute right-0 z-[90] mt-3 w-[22rem] rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Search results</p>
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="text-xs text-muted transition hover:text-[var(--text-primary)]"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {filteredResults.length ? (
                  filteredResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                        onNavigate(item.routePath);
                        setShowSearch(false);
                      }}
                      className="subtle-card block w-full rounded-2xl p-3 text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">{item.kind}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">{item.subtitle}</p>
                    </button>
                  ))
                ) : (
                  <div className="subtle-card rounded-2xl p-3 text-sm text-muted">
                    No matching results. Try searching for a course, topic, or student name.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 md:flex">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`rounded-xl p-2 transition ${theme === "light" ? "bg-white/15 text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
          >
            <SunMedium className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`rounded-xl p-2 transition ${theme === "dark" ? "bg-white/15 text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
          >
            <MoonStar className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`rounded-xl p-2 transition ${theme === "system" ? "bg-white/15 text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
          >
            <LaptopMinimal className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] md:hidden"
        >
          {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((current) => !current)}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
              {unreadCount}
            </span>
          </button>
          {showNotifications ? (
            <div className="absolute right-0 z-[90] mt-3 w-96 rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Notifications</p>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-muted transition hover:text-[var(--text-primary)]"
                >
                  Close
                </button>
              </div>
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {notifications.length ? (
                  notifications.map((item) => (
                    <div key={item.id || item.title} className={`rounded-2xl border p-3 ${item.read ? "border-white/10 bg-white/5" : "border-cyan-400/20 bg-cyan-500/10"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
                          <p className="mt-1 text-sm text-muted">{item.body}</p>
                        </div>
                        {!item.read ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" /> : null}
                      </div>
                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!item.read) {
                              onMarkNotificationRead(item.id);
                            }
                            onNavigate(item.title.toLowerCase().includes("attendance") ? "/campus" : "/analytics");
                            setShowNotifications(false);
                          }}
                          className="text-xs font-medium text-sky-300 transition hover:text-sky-200"
                        >
                          Open
                        </button>
                        {!item.read ? (
                          <button
                            type="button"
                            onClick={() => onMarkNotificationRead(item.id)}
                            className="text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
                          >
                            Mark as read
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="subtle-card rounded-2xl p-3 text-sm text-muted">
                    You have no notifications right now.
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {user ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-muted">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("/grades")}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Grades
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/results")}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Results
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/profile")}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-white/10 p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
