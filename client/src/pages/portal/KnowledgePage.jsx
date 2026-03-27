import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { ContentIntelligenceCard } from "../../components/common/ContentIntelligenceCard.jsx";
import { VoiceAssistantCard } from "../../components/common/VoiceAssistantCard.jsx";
import { KnowledgeGraph } from "../../components/graph/KnowledgeGraph.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { AdaptiveQuizCard } from "../../components/quiz/AdaptiveQuizCard.jsx";

export const KnowledgePage = () => {
  const { courses, user: activeUser } = useOutletContext();
  const graphCourses = useMemo(
    () => courses.filter((course) => course.knowledgeGraph?.nodes?.length),
    [courses]
  );
  const [selectedCourseId, setSelectedCourseId] = useState(graphCourses[0]?._id || "");
  const selectedCourse =
    graphCourses.find((course) => course._id === selectedCourseId) || graphCourses[0] || null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge Maps"
        title="Explore course topic graphs"
        description="Switch between course-level knowledge graphs, inspect topic relationships, and adapt your quiz path based on the selected learning map."
        breadcrumbs={["Portal", "Knowledge Graph"]}
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr,1.15fr,0.9fr]">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Graph library</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Available course graphs</h3>
          <div className="mt-5 space-y-3">
            {graphCourses.map((course) => (
              <button
                key={course._id}
                type="button"
                onClick={() => setSelectedCourseId(course._id)}
                className={`block w-full rounded-2xl border p-4 text-left transition ${
                  selectedCourse?._id === course._id
                    ? "border-cyan-400/25 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <p className="font-semibold text-[var(--text-primary)]">{course.title}</p>
                <p className="mt-1 text-sm text-muted">{course.category}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-200">
                  {course.knowledgeGraph?.nodes?.length || 0} topics
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Selected graph</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            {selectedCourse?.title || "No graph selected"}
          </h3>
          <div className="mt-6">
            <KnowledgeGraph graph={selectedCourse?.knowledgeGraph || { nodes: [], edges: [] }} />
          </div>
        </div>

        <AdaptiveQuizCard nextTopics={activeUser.learningProfile.nextBestTopics || []} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ContentIntelligenceCard />
        <VoiceAssistantCard />
      </section>
    </div>
  );
};
