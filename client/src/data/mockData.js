export const user = {
  id: "student-demo",
  name: "Sid Student",
  role: "student",
  email: "student@bibliotekx.ai",
  xp: 540,
  streak: 12,
  badges: [{ label: "Focus Streak" }],
  learningProfile: {
    accuracy: 74,
    focusScore: 77,
    dropoutRisk: "medium",
    weakAreas: ["Knowledge Graph", "Adaptive Learning"],
    nextBestTopics: ["Knowledge Graph", "Prompt Chaining", "Evaluation Loops"]
  }
};

export const courses = [
  {
    _id: "course-1",
    title: "Applied Generative AI Systems",
    description: "Build, ship, and evaluate AI products with adaptive learning loops.",
    category: "AI Engineering",
    level: "Advanced",
    tags: ["AI", "MERN", "LLM Ops"],
    enrollmentCount: 1280,
    progress: 48
  },
  {
    _id: "course-2",
    title: "Productive Deep Work Studio",
    description: "Master focus systems, analytics, and sustainable output habits.",
    category: "Peak Performance",
    level: "Intermediate",
    tags: ["Focus", "Analytics"],
    enrollmentCount: 920,
    progress: 72
  }
];

export const graph = {
  nodes: [
    { id: "n1", label: "Transformers", mastery: 72 },
    { id: "n2", label: "Embeddings", mastery: 68 },
    { id: "n3", label: "Knowledge Graph", mastery: 49 },
    { id: "n4", label: "Adaptive Learning", mastery: 55 }
  ],
  edges: [
    { source: "n1", target: "n2", relationship: "prerequisite" },
    { source: "n2", target: "n3", relationship: "dependency" },
    { source: "n3", target: "n4", relationship: "prerequisite" }
  ]
};

export const analytics = {
  efficiencyScore: 76,
  burnoutIndicator: "watch",
  recentQuizScores: [
    { date: "Mon", value: 62 },
    { date: "Tue", value: 70 },
    { date: "Wed", value: 74 },
    { date: "Thu", value: 81 },
    { date: "Fri", value: 77 }
  ],
  recentFocusScores: [
    { date: "Mon", value: 58 },
    { date: "Tue", value: 72 },
    { date: "Wed", value: 77 },
    { date: "Thu", value: 79 },
    { date: "Fri", value: 74 }
  ]
};

export const notifications = [
  {
    id: 1,
    title: "Adaptive quiz ready",
    body: "Knowledge Graph is your next best topic based on recent quiz patterns."
  },
  {
    id: 2,
    title: "Teacher feedback",
    body: "Tara left collaborative notes on your retrieval architecture draft."
  }
];

export const leaderboard = [
  { name: "Aarav", xp: 1840 },
  { name: "Sid", xp: 540 },
  { name: "Naina", xp: 510 }
];

