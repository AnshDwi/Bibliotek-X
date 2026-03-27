const unique = (items) => [...new Set(items.filter(Boolean))];

export const extractTopics = (text = "") => {
  const words = text
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 4);

  return unique(words).slice(0, 12);
};

export const buildKnowledgeGraph = (topics = []) => {
  const nodes = topics.map((topic, index) => ({
    id: `topic-${index + 1}`,
    label: topic,
    mastery: Math.max(35, 90 - index * 5)
  }));

  const edges = nodes.slice(1).map((node, index) => ({
    source: nodes[Math.max(index - 1, 0)].id,
    target: node.id,
    relationship: index % 2 === 0 ? "prerequisite" : "dependency"
  }));

  return { nodes, edges };
};

