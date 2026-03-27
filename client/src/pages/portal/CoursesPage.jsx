import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { CourseCard } from "../../components/common/CourseCard.jsx";
import { CourseDetailsModal } from "../../components/common/CourseDetailsModal.jsx";

export const CoursesPage = () => {
  const { courses, navigateToSection, upcomingAssignments } = useOutletContext();
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course._id} course={{ ...course, onOpen: () => setSelectedCourse(course) }} />
        ))}
      </div>
      <div className="glass-card rounded-3xl p-6">
        <p className="text-sm text-muted">Academic planner</p>
        <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Upcoming assignments and checkpoints</h3>
        <div className="mt-5 space-y-3">
          {upcomingAssignments.length ? (
            upcomingAssignments.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection("/courses")}
                className="subtle-card block w-full rounded-2xl p-4 text-left transition hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.courseTitle}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase text-cyan-200">
                    {item.type}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Due{" "}
                  {new Date(item.dueDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </button>
            ))
          ) : (
            <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
              No upcoming deadlines right now. You are caught up.
            </div>
          )}
        </div>
      </div>
      <CourseDetailsModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
};
