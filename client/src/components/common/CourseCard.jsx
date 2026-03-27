import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "./Badge.jsx";

export const CourseCard = ({ course }) => (
  <motion.div whileHover={{ y: -6, scale: 1.01 }} className="glass-card hover-lift rounded-3xl p-5">
    <div className="mb-5 overflow-hidden rounded-3xl border border-white/10">
      {course.thumbnail ? (
        <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-[linear-gradient(135deg,rgba(59,130,246,0.45),rgba(147,51,234,0.25),rgba(34,211,238,0.25))]" />
      )}
    </div>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-muted">{course.category}</p>
        <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{course.title}</h3>
        <p className="mt-3 text-sm text-muted">{course.description}</p>
      </div>
      <button
        type="button"
        onClick={course.onOpen}
        className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      {(course.tags || []).map((tag) => (
        <Badge key={tag}>{tag}</Badge>
      ))}
    </div>
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <span>Progress</span>
        <span>{course.progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[var(--button-gradient)] transition-all duration-500"
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-primary)]">
        Attendance {course.attendanceRate ?? 0}%
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-primary)]">
        Modules {(course.modules || []).length}
      </div>
    </div>
    <button
      type="button"
      onClick={course.onOpen}
      className="gradient-button mt-5 rounded-2xl px-4 py-3 text-sm font-semibold"
    >
      Open workspace
    </button>
  </motion.div>
);
