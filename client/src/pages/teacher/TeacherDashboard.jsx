import { SectionHeader } from "../../components/common/SectionHeader.jsx";

export const TeacherDashboard = () => (
  <div className="glass rounded-3xl p-6">
    <SectionHeader
      eyebrow="Teacher Hub"
      title="Course orchestration, live cohorts, and content intelligence"
      description="Teachers can publish courses, upload PDF/video/note content, collaborate live, and monitor weak-area clusters across the cohort."
    />
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">Published courses</p>
        <p className="mt-2 text-3xl font-semibold text-white">12</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">At-risk learners</p>
        <p className="mt-2 text-3xl font-semibold text-rose-300">28</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">Realtime rooms</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-300">5</p>
      </div>
    </div>
  </div>
);

