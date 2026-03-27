import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

const getNodeColor = (mastery = 0) => {
  if (mastery >= 75) {
    return "rgba(52, 211, 153, 0.9)";
  }
  if (mastery >= 55) {
    return "rgba(56, 189, 248, 0.9)";
  }
  return "rgba(244, 114, 182, 0.9)";
};

export const KnowledgeGraph = ({ graph = { nodes: [], edges: [] } }) => {
  const ref = useRef(null);
  const [selectedNodeId, setSelectedNodeId] = useState(graph.nodes?.[0]?.id || null);

  useEffect(() => {
    setSelectedNodeId(graph.nodes?.[0]?.id || null);
  }, [graph.nodes]);

  const selectedNode = useMemo(
    () => graph.nodes?.find((node) => node.id === selectedNodeId) || null,
    [graph.nodes, selectedNodeId]
  );
  const relatedTopics = useMemo(() => {
    if (!selectedNodeId) {
      return [];
    }

    return (graph.edges || [])
      .filter((edge) => edge.source === selectedNodeId || edge.target === selectedNodeId)
      .map((edge) => {
        const relatedId = edge.source === selectedNodeId ? edge.target : edge.source;
        const node = graph.nodes?.find((item) => item.id === relatedId);
        return {
          id: relatedId,
          label: node?.label || relatedId,
          relationship: edge.relationship || "connected"
        };
      });
  }, [graph.edges, graph.nodes, selectedNodeId]);

  useEffect(() => {
    if (!ref.current || !graph.nodes?.length) {
      return undefined;
    }

    const width = 520;
    const height = 320;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const nodesData = graph.nodes.map((node) => ({ ...node }));
    const linksData = graph.edges.map((edge) => ({ ...edge }));
    const simulation = d3
      .forceSimulation(nodesData)
      .force(
        "link",
        d3
          .forceLink(linksData)
          .id((d) => d.id)
          .distance(110)
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const links = svg
      .append("g")
      .selectAll("line")
      .data(linksData)
      .enter()
      .append("line")
      .attr("stroke", "rgba(148, 163, 184, 0.35)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "6 6");

    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(nodesData)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedNodeId(d.id))
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) {
              simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
          })
      );

    nodes
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => getNodeColor(d.mastery))
      .attr("stroke", (d) => (d.id === selectedNodeId ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"))
      .attr("stroke-width", (d) => (d.id === selectedNodeId ? 3 : 1.5));

    nodes.selectAll("circle").transition().duration(700).attr("r", 20);

    nodes
      .append("text")
      .attr("fill", "currentColor")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .text((d) => d.label.slice(0, 12));

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      nodes
        .selectAll("circle")
        .attr("stroke", (d) => (d.id === selectedNodeId ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"))
        .attr("stroke-width", (d) => (d.id === selectedNodeId ? 3 : 1.5));
    });

    return () => simulation.stop();
  }, [graph, selectedNodeId]);

  if (!graph.nodes?.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/10 p-6 text-sm text-muted">
        Knowledge graph data will appear here once courses include extracted topic relationships.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
      <svg ref={ref} className="h-[320px] w-full rounded-3xl bg-black/10 text-[var(--text-primary)]" />
      <div className="space-y-4">
        <div className="subtle-card rounded-3xl p-4">
          <p className="text-sm text-muted">Selected topic</p>
          <h4 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            {selectedNode?.label || "Choose a node"}
          </h4>
          <p className="mt-2 text-sm text-muted">
            Mastery: {selectedNode?.mastery ?? 0}%. Click nodes to inspect dependencies and next learning links.
          </p>
        </div>
        <div className="subtle-card rounded-3xl p-4">
          <p className="text-sm text-muted">Connected topics</p>
          <div className="mt-3 space-y-2">
            {relatedTopics.length ? (
              relatedTopics.map((item) => (
                <button
                  key={`${item.id}-${item.relationship}`}
                  type="button"
                  onClick={() => setSelectedNodeId(item.id)}
                  className="block w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:bg-white/10"
                >
                  <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cyan-200">{item.relationship}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted">No linked topics for this node yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
