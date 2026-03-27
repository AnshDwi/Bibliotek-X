import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import { ROLES } from "../constants/roles.js";
import { Assignment } from "../models/Assignment.js";
import { Announcement } from "../models/Announcement.js";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { Course } from "../models/Course.js";
import { Content } from "../models/Content.js";
import { Enrollment } from "../models/Enrollment.js";
import { ExamSchedule } from "../models/ExamSchedule.js";
import { FeeRecord } from "../models/FeeRecord.js";
import { FocusSession } from "../models/FocusSession.js";
import { LeaveApplication } from "../models/LeaveApplication.js";
import { LiveSession } from "../models/LiveSession.js";
import { Notification } from "../models/Notification.js";
import { ParentMessage } from "../models/ParentMessage.js";
import { GuardianMeeting } from "../models/GuardianMeeting.js";
import { DocumentRequest } from "../models/DocumentRequest.js";
import { HostelPass } from "../models/HostelPass.js";
import { InternshipRecord } from "../models/InternshipRecord.js";
import { LibraryRecord } from "../models/LibraryRecord.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { PlacementRecord } from "../models/PlacementRecord.js";
import { TimetableSlot } from "../models/TimetableSlot.js";
import { TransportPass } from "../models/TransportPass.js";
import { User } from "../models/User.js";
import { Message } from "../models/Message.js";

const run = async () => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    QuizAttempt.deleteMany({}),
    FocusSession.deleteMany({}),
    Notification.deleteMany({}),
    AttendanceRecord.deleteMany({}),
    Assignment.deleteMany({}),
    ParentMessage.deleteMany({}),
    LiveSession.deleteMany({}),
    Content.deleteMany({}),
    Announcement.deleteMany({}),
    TimetableSlot.deleteMany({}),
    Message.deleteMany({}),
    ExamSchedule.deleteMany({}),
    FeeRecord.deleteMany({}),
    LeaveApplication.deleteMany({}),
    GuardianMeeting.deleteMany({}),
    DocumentRequest.deleteMany({}),
    HostelPass.deleteMany({}),
    TransportPass.deleteMany({}),
    PlacementRecord.deleteMany({}),
    InternshipRecord.deleteMany({}),
    LibraryRecord.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [admin, teacher, student, studentTwo, studentThree] = await User.create([
    {
      name: "Aarya Admin",
      email: "admin@bibliotekx.ai",
      passwordHash,
      role: ROLES.ADMIN,
      department: "Administration",
      program: "Campus Operations",
      academicYear: "2025-26",
      rollNumber: "BX-ADM-001",
      xp: 1200,
      badges: [{ label: "System Architect" }]
    },
    {
      name: "Tara Teacher",
      email: "teacher@bibliotekx.ai",
      passwordHash,
      role: ROLES.TEACHER,
      department: "Computer Engineering",
      program: "Faculty",
      academicYear: "2025-26",
      rollNumber: "BX-FAC-014",
      xp: 860,
      badges: [{ label: "Mentor Prime" }]
    },
    {
      name: "Sid Student",
      email: "student@bibliotekx.ai",
      passwordHash,
      role: ROLES.STUDENT,
      department: "Computer Engineering",
      program: "B.Tech AI & DS",
      academicYear: "Second Year",
      rollNumber: "CE-AI-24-017",
      xp: 540,
      streak: 12,
      badges: [{ label: "Focus Streak" }],
      parentContact: {
        name: "Riya Sharma",
        email: "parent.sid@bibliotekx.ai"
      }
    },
    {
      name: "Mia Student",
      email: "mia@bibliotekx.ai",
      passwordHash,
      role: ROLES.STUDENT,
      department: "Computer Engineering",
      program: "B.Tech AI & DS",
      academicYear: "Second Year",
      rollNumber: "CE-AI-24-022",
      xp: 490,
      streak: 7,
      parentContact: {
        name: "Rohan Mehta",
        email: "parent.mia@bibliotekx.ai"
      }
    },
    {
      name: "Noah Student",
      email: "noah@bibliotekx.ai",
      passwordHash,
      role: ROLES.STUDENT,
      department: "Computer Engineering",
      program: "B.Tech AI & DS",
      academicYear: "Second Year",
      rollNumber: "CE-AI-24-031",
      xp: 310,
      streak: 4,
      parentContact: {
        name: "Anita Rao",
        email: "parent.noah@bibliotekx.ai"
      }
    }
  ]);

  const [course, courseTwo] = await Course.create([
    {
      title: "Applied Generative AI Systems",
      slug: "applied-generative-ai-systems",
      description: "Build, evaluate, and deploy modern AI products with retrieval, agents, and analytics.",
      category: "AI Engineering",
      level: "Advanced",
      semester: "Semester 4",
      credits: 5,
      teacher: teacher._id,
      tags: ["AI", "MERN", "LLM Ops"],
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      modules: [
        {
          title: "Foundation Models",
          description: "Architectural principles behind transformers and finetuning.",
          durationMinutes: 80,
          topics: ["Transformers", "Attention", "Embeddings"]
        },
        {
          title: "Retrieval Systems",
          description: "Knowledge graphs, indexing, and adaptive learning paths.",
          durationMinutes: 70,
          topics: ["Vector Search", "Knowledge Graph", "Chunking"]
        }
      ],
      knowledgeGraph: {
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
      },
      enrollmentCount: 3
    },
    {
      title: "Data Structures for Intelligent Systems",
      slug: "data-structures-for-intelligent-systems",
      description: "Learn the data structures and problem-solving patterns used in scalable software and AI systems.",
      category: "Computer Science",
      level: "Intermediate",
      semester: "Semester 4",
      credits: 4,
      teacher: teacher._id,
      tags: ["DSA", "Algorithms", "Systems"],
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      modules: [
        {
          title: "Linear Structures",
          description: "Arrays, strings, stacks, queues, and complexity analysis.",
          durationMinutes: 60,
          topics: ["Arrays", "Stacks", "Queues"]
        },
        {
          title: "Trees and Graphs",
          description: "Traversal patterns, recursion, and graph reasoning.",
          durationMinutes: 75,
          topics: ["Trees", "DFS", "BFS", "Graphs"]
        }
      ],
      knowledgeGraph: {
        nodes: [
          { id: "d1", label: "Arrays", mastery: 78 },
          { id: "d2", label: "Stacks", mastery: 70 },
          { id: "d3", label: "Trees", mastery: 54 },
          { id: "d4", label: "Graphs", mastery: 47 }
        ],
        edges: [
          { source: "d1", target: "d2", relationship: "prerequisite" },
          { source: "d2", target: "d3", relationship: "dependency" },
          { source: "d3", target: "d4", relationship: "prerequisite" }
        ]
      },
      enrollmentCount: 2
    }
  ]);

  const [courseThree, courseFour, courseFive, courseSix] = await Course.create([
    {
      title: "Cloud Computing for Developers",
      slug: "cloud-computing-for-developers",
      description: "Deploy scalable web platforms with containers, cloud services, and DevOps workflows.",
      category: "Cloud Engineering",
      level: "Intermediate",
      semester: "Semester 4",
      credits: 3,
      teacher: teacher._id,
      tags: ["Cloud", "DevOps", "Deployment"],
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      modules: [
        { title: "Cloud Foundations", description: "IaaS, PaaS, regions, and services.", durationMinutes: 65, topics: ["IaaS", "PaaS", "Regions"] },
        { title: "Containers and CI/CD", description: "Docker workflows and deployment pipelines.", durationMinutes: 70, topics: ["Docker", "CI/CD", "Containers"] }
      ],
      knowledgeGraph: {
        nodes: [
          { id: "c1", label: "Cloud Basics", mastery: 66 },
          { id: "c2", label: "Docker", mastery: 61 },
          { id: "c3", label: "CI/CD", mastery: 52 },
          { id: "c4", label: "Monitoring", mastery: 45 }
        ],
        edges: [
          { source: "c1", target: "c2", relationship: "prerequisite" },
          { source: "c2", target: "c3", relationship: "dependency" },
          { source: "c3", target: "c4", relationship: "prerequisite" }
        ]
      },
      enrollmentCount: 2
    },
    {
      title: "Applied Statistics for AI",
      slug: "applied-statistics-for-ai",
      description: "Learn probability, inference, and evaluation metrics for intelligent systems.",
      category: "Mathematics",
      level: "Intermediate",
      semester: "Semester 4",
      credits: 4,
      teacher: teacher._id,
      tags: ["Statistics", "Probability", "AI"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      modules: [
        { title: "Probability Models", description: "Random variables and distributions.", durationMinutes: 60, topics: ["Probability", "Distributions", "Expectation"] },
        { title: "Evaluation Metrics", description: "Precision, recall, confidence, and testing.", durationMinutes: 68, topics: ["Precision", "Recall", "Hypothesis Testing"] }
      ],
      knowledgeGraph: {
        nodes: [
          { id: "s1", label: "Probability", mastery: 72 },
          { id: "s2", label: "Distributions", mastery: 64 },
          { id: "s3", label: "Inference", mastery: 53 },
          { id: "s4", label: "Metrics", mastery: 49 }
        ],
        edges: [
          { source: "s1", target: "s2", relationship: "prerequisite" },
          { source: "s2", target: "s3", relationship: "dependency" },
          { source: "s3", target: "s4", relationship: "prerequisite" }
        ]
      },
      enrollmentCount: 2
    },
    {
      title: "UI Systems Design Studio",
      slug: "ui-systems-design-studio",
      description: "Build scalable design systems, accessible interfaces, and responsive frontend architecture.",
      category: "Frontend Design",
      level: "Advanced",
      semester: "Semester 4",
      credits: 3,
      teacher: teacher._id,
      tags: ["UI", "Design Systems", "Accessibility"],
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      modules: [
        { title: "Design Tokens", description: "Scales, systems, and reusable UI primitives.", durationMinutes: 58, topics: ["Tokens", "Components", "Consistency"] },
        { title: "Responsive Patterns", description: "Adaptive layouts and motion systems.", durationMinutes: 72, topics: ["Responsive UI", "Motion", "Accessibility"] }
      ],
      knowledgeGraph: {
        nodes: [
          { id: "u1", label: "Design Tokens", mastery: 73 },
          { id: "u2", label: "Components", mastery: 67 },
          { id: "u3", label: "Accessibility", mastery: 58 },
          { id: "u4", label: "Responsive Layout", mastery: 54 }
        ],
        edges: [
          { source: "u1", target: "u2", relationship: "prerequisite" },
          { source: "u2", target: "u3", relationship: "dependency" },
          { source: "u3", target: "u4", relationship: "prerequisite" }
        ]
      },
      enrollmentCount: 2
    },
    {
      title: "Database Engineering Lab",
      slug: "database-engineering-lab",
      description: "Model, optimize, and operate relational and document databases in production systems.",
      category: "Backend Systems",
      level: "Intermediate",
      semester: "Semester 4",
      credits: 4,
      teacher: teacher._id,
      tags: ["Databases", "SQL", "MongoDB"],
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
      modules: [
        { title: "Schema Design", description: "Entity relationships, indexing, and consistency.", durationMinutes: 63, topics: ["Schema", "Indexes", "Consistency"] },
        { title: "Query Performance", description: "Optimizations for reads, writes, and scale.", durationMinutes: 69, topics: ["Queries", "Aggregation", "Optimization"] }
      ],
      knowledgeGraph: {
        nodes: [
          { id: "db1", label: "Schema Design", mastery: 71 },
          { id: "db2", label: "Indexes", mastery: 65 },
          { id: "db3", label: "Queries", mastery: 57 },
          { id: "db4", label: "Aggregation", mastery: 46 }
        ],
        edges: [
          { source: "db1", target: "db2", relationship: "prerequisite" },
          { source: "db2", target: "db3", relationship: "dependency" },
          { source: "db3", target: "db4", relationship: "prerequisite" }
        ]
      },
      enrollmentCount: 2
    }
  ]);

  await Enrollment.create([
    {
      user: student._id,
      course: course._id,
      progress: 48,
      completedTopics: ["Transformers", "Embeddings"]
    },
    {
      user: studentTwo._id,
      course: course._id,
      progress: 66,
      completedTopics: ["Transformers", "Embeddings", "Knowledge Graph"]
    },
    {
      user: studentThree._id,
      course: course._id,
      progress: 32,
      completedTopics: ["Transformers"]
    },
    {
      user: student._id,
      course: courseTwo._id,
      progress: 58,
      completedTopics: ["Arrays", "Stacks"]
    },
    {
      user: studentTwo._id,
      course: courseTwo._id,
      progress: 41,
      completedTopics: ["Arrays"]
    },
    {
      user: student._id,
      course: courseThree._id,
      progress: 52,
      completedTopics: ["Cloud Basics"]
    },
    {
      user: studentTwo._id,
      course: courseFour._id,
      progress: 44,
      completedTopics: ["Probability"]
    },
    {
      user: student._id,
      course: courseFive._id,
      progress: 61,
      completedTopics: ["Design Tokens", "Components"]
    },
    {
      user: studentThree._id,
      course: courseSix._id,
      progress: 38,
      completedTopics: ["Schema Design"]
    }
  ]);

  await QuizAttempt.create([
    {
      user: student._id,
      course: course._id,
      score: 74,
      difficulty: 2,
      durationSeconds: 155,
      answers: [
        {
          prompt: "Neural Networks",
          selectedOption: "Activation function",
          correctOption: "Activation function",
          isCorrect: true,
          difficulty: 1
        }
      ]
    },
    {
      user: studentTwo._id,
      course: course._id,
      score: 88,
      difficulty: 3,
      durationSeconds: 141,
      answers: [
        {
          prompt: "Transformers",
          selectedOption: "Self-attention",
          correctOption: "Self-attention",
          isCorrect: true,
          difficulty: 2
        }
      ]
    },
    {
      user: studentThree._id,
      course: course._id,
      score: 52,
      difficulty: 1,
      durationSeconds: 201,
      answers: [
        {
          prompt: "Knowledge Graph",
          selectedOption: "Database backups",
          correctOption: "Topic relationships",
          isCorrect: false,
          difficulty: 2
        }
      ]
    },
    {
      user: student._id,
      course: courseTwo._id,
      score: 81,
      difficulty: 2,
      durationSeconds: 163,
      answers: [
        {
          prompt: "Trees",
          selectedOption: "Hierarchical data structure",
          correctOption: "Hierarchical data structure",
          isCorrect: true,
          difficulty: 2
        }
      ]
    }
  ]);

  await FocusSession.create([
    {
      user: student._id,
      course: course._id,
      durationMinutes: 52,
      inactivityEvents: 1,
      tabSwitches: 2,
      focusScore: 77,
      pomodoroCompleted: 2
    },
    {
      user: studentTwo._id,
      course: course._id,
      durationMinutes: 61,
      inactivityEvents: 0,
      tabSwitches: 1,
      focusScore: 84,
      pomodoroCompleted: 2
    },
    {
      user: studentThree._id,
      course: course._id,
      durationMinutes: 29,
      inactivityEvents: 4,
      tabSwitches: 5,
      focusScore: 46,
      pomodoroCompleted: 1
    },
    {
      user: student._id,
      course: courseTwo._id,
      durationMinutes: 47,
      inactivityEvents: 1,
      tabSwitches: 1,
      focusScore: 82,
      pomodoroCompleted: 2
    }
  ]);

  await AttendanceRecord.create([
    {
      course: course._id,
      teacher: teacher._id,
      date: new Date("2026-03-03T09:00:00.000Z"),
      entries: [
        { student: student._id, status: "present" },
        { student: studentTwo._id, status: "present" },
        { student: studentThree._id, status: "late" }
      ]
    },
    {
      course: course._id,
      teacher: teacher._id,
      date: new Date("2026-03-10T09:00:00.000Z"),
      entries: [
        { student: student._id, status: "present" },
        { student: studentTwo._id, status: "late" },
        { student: studentThree._id, status: "absent" }
      ]
    },
    {
      course: course._id,
      teacher: teacher._id,
      date: new Date("2026-03-17T09:00:00.000Z"),
      entries: [
        { student: student._id, status: "late" },
        { student: studentTwo._id, status: "present" },
        { student: studentThree._id, status: "absent" }
      ]
    },
    {
      course: course._id,
      teacher: teacher._id,
      date: new Date("2026-03-24T09:00:00.000Z"),
      entries: [
        { student: student._id, status: "present" },
        { student: studentTwo._id, status: "present" },
        { student: studentThree._id, status: "late" }
      ]
    },
    {
      course: course._id,
      teacher: teacher._id,
      date: new Date("2026-03-27T09:00:00.000Z"),
      entries: [
        { student: student._id, status: "present" },
        { student: studentTwo._id, status: "late" },
        { student: studentThree._id, status: "absent" }
      ]
    },
    {
      course: courseTwo._id,
      teacher: teacher._id,
      date: new Date("2026-03-05T11:00:00.000Z"),
      entries: [
        { student: student._id, status: "present" },
        { student: studentTwo._id, status: "present" }
      ]
    },
    {
      course: courseTwo._id,
      teacher: teacher._id,
      date: new Date("2026-03-19T11:00:00.000Z"),
      entries: [
        { student: student._id, status: "late" },
        { student: studentTwo._id, status: "present" }
      ]
    },
    {
      course: courseThree._id,
      teacher: teacher._id,
      date: new Date("2026-03-12T10:00:00.000Z"),
      entries: [{ student: student._id, status: "present" }]
    },
    {
      course: courseFour._id,
      teacher: teacher._id,
      date: new Date("2026-03-13T12:00:00.000Z"),
      entries: [{ student: studentTwo._id, status: "present" }]
    },
    {
      course: courseFive._id,
      teacher: teacher._id,
      date: new Date("2026-03-14T14:00:00.000Z"),
      entries: [{ student: student._id, status: "late" }]
    },
    {
      course: courseSix._id,
      teacher: teacher._id,
      date: new Date("2026-03-15T15:00:00.000Z"),
      entries: [{ student: studentThree._id, status: "present" }]
    }
  ]);

  await Content.create([
    {
      course: course._id,
      title: "Week 3 Retrieval Notes",
      type: "pdf",
      description: "Chunking strategies, graph links, and retrieval evaluation.",
      textContent: "Retrieval systems rely on chunking, embeddings, and graph-based topic relationships.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      extractedTopics: ["Retrieval", "Chunking", "Embeddings"],
      summary: "Retrieval systems rely on chunking, embeddings, and graph-based topic relationships.",
      uploadedBy: teacher._id
    },
    {
      course: course._id,
      title: "Live session recording",
      type: "video",
      description: "Transformer review and adaptive learning feedback.",
      textContent: "Transformers and adaptive learning feedback loops.",
      fileUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
      extractedTopics: ["Transformers", "Adaptive Learning"],
      summary: "Transformers and adaptive learning feedback loops.",
      uploadedBy: teacher._id
    },
    {
      course: courseTwo._id,
      title: "Week 2 Trees Notes",
      type: "note",
      description: "Recursive traversals, height, and balanced tree intuition.",
      textContent: "Trees organize hierarchical data and support traversal-based reasoning.",
      fileUrl: "https://github.com/TheAlgorithms/Java/blob/master/src/main/java/com/thealgorithms/datastructures/trees/BinaryTree.java",
      extractedTopics: ["Trees", "Traversal", "Recursion"],
      summary: "Trees organize hierarchical data and support traversal-based reasoning.",
      uploadedBy: teacher._id
    },
    {
      course: courseThree._id,
      title: "Container Deployment Notes",
      type: "video",
      description: "Containers, deployment flow, and pipeline health checks.",
      textContent: "Cloud deployment requires container packaging and stable CI/CD checks.",
      fileUrl: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      extractedTopics: ["Docker", "CI/CD", "Cloud"],
      summary: "Cloud deployment requires container packaging and stable CI/CD checks.",
      uploadedBy: teacher._id
    },
    {
      course: courseFour._id,
      title: "Probability Revision Sheet",
      type: "pdf",
      description: "Distributions, expectation, and confidence intervals.",
      textContent: "Probability distributions help model uncertainty and interpret outcomes.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      extractedTopics: ["Probability", "Distributions", "Inference"],
      summary: "Probability distributions help model uncertainty and interpret outcomes.",
      uploadedBy: teacher._id
    },
    {
      course: courseFive._id,
      title: "Responsive Layout Demo",
      type: "video",
      description: "Responsive systems, spacing, and accessibility review.",
      textContent: "Responsive UI depends on consistent systems and accessible interactions.",
      fileUrl: "https://www.youtube.com/watch?v=srvUrASNj0s",
      extractedTopics: ["Responsive UI", "Accessibility", "Components"],
      summary: "Responsive UI depends on consistent systems and accessible interactions.",
      uploadedBy: teacher._id
    },
    {
      course: courseSix._id,
      title: "Indexing and Aggregation Cheatsheet",
      type: "note",
      description: "Indexes, aggregation pipelines, and database optimization shortcuts.",
      textContent: "Indexes accelerate lookups while aggregation pipelines transform grouped datasets.",
      fileUrl: "https://www.mongodb.com/docs/manual/core/indexes/index-types/",
      extractedTopics: ["Indexes", "Aggregation", "Queries"],
      summary: "Indexes accelerate lookups while aggregation pipelines transform grouped datasets.",
      uploadedBy: teacher._id
    }
  ]);

  await Assignment.create([
    {
      course: course._id,
      teacher: teacher._id,
      title: "Knowledge Graph Mapping",
      type: "assignment",
      description: "Map dependencies between core AI concepts.",
      dueDate: new Date("2026-04-02T00:00:00.000Z"),
      questionsCount: 4,
      submissions: [
        { student: student._id, score: 78, feedback: "Strong structure, improve edge semantics.", plagiarismScore: 8, autoGraded: true },
        { student: studentTwo._id, score: 91, feedback: "Excellent topic dependency mapping.", plagiarismScore: 4, autoGraded: true }
      ]
    },
    {
      course: course._id,
      teacher: teacher._id,
      title: "Adaptive Quiz Sprint",
      type: "quiz",
      description: "MCQ checkpoint on transformers and retrieval.",
      dueDate: new Date("2026-03-30T00:00:00.000Z"),
      questionsCount: 10,
      submissions: [
        { student: student._id, score: 74, feedback: "Review knowledge graph navigation.", plagiarismScore: 0, autoGraded: true },
        { student: studentThree._id, score: 53, feedback: "Needs extra retrieval practice.", plagiarismScore: 0, autoGraded: true }
      ]
    },
    {
      course: courseTwo._id,
      teacher: teacher._id,
      title: "Graph Traversal Lab",
      type: "assignment",
      description: "Design DFS and BFS walkthroughs for a campus map problem.",
      dueDate: new Date("2026-04-05T00:00:00.000Z"),
      questionsCount: 3,
      submissions: [
        { student: student._id, score: 86, feedback: "Traversal logic is strong; improve edge-case handling.", plagiarismScore: 3, autoGraded: true }
      ]
    },
    {
      course: courseThree._id,
      teacher: teacher._id,
      title: "CI/CD Workflow Map",
      type: "assignment",
      description: "Design a deployment flow from local code to monitored production.",
      dueDate: new Date("2026-04-07T00:00:00.000Z"),
      questionsCount: 4,
      submissions: [
        { student: student._id, submissionUrl: "https://github.com/example/cloud-workflow", score: 82, feedback: "Good pipeline mapping with clear deployment stages.", plagiarismScore: 1, autoGraded: true }
      ]
    },
    {
      course: courseFour._id,
      teacher: teacher._id,
      title: "Inference Practice Set",
      type: "quiz",
      description: "Solve probability and inference checkpoints.",
      dueDate: new Date("2026-04-08T00:00:00.000Z"),
      questionsCount: 8,
      submissions: [
        { student: studentTwo._id, submissionUrl: "https://drive.google.com/file/d/1-example", score: 79, feedback: "Good start; review confidence intervals.", plagiarismScore: 0, autoGraded: true }
      ]
    },
    {
      course: courseFive._id,
      teacher: teacher._id,
      title: "Design System Audit",
      type: "assignment",
      description: "Audit an interface and propose a scalable component system.",
      dueDate: new Date("2026-04-09T00:00:00.000Z"),
      questionsCount: 3,
      submissions: [
        { student: student._id, submissionUrl: "https://www.figma.com/file/example/design-system", score: 88, feedback: "Strong hierarchy and reusable thinking.", plagiarismScore: 2, autoGraded: true }
      ]
    },
    {
      course: courseSix._id,
      teacher: teacher._id,
      title: "Database Query Optimization",
      type: "assignment",
      description: "Refactor slow queries and propose indexing improvements.",
      dueDate: new Date("2026-04-10T00:00:00.000Z"),
      questionsCount: 5,
      submissions: [
        { student: studentThree._id, submissionUrl: "https://github.com/example/db-optimisation", score: 76, feedback: "Good indexing ideas; improve aggregation pipeline explanation.", plagiarismScore: 3, autoGraded: true }
      ]
    }
  ]);

  await ParentMessage.create([
    {
      student: studentThree._id,
      teacher: teacher._id,
      parentEmail: "parent.noah@bibliotekx.ai",
      subject: "Weekly risk alert",
      body: "Noah is showing lower attendance and quiz performance this week.",
      type: "risk-alert",
      status: "sent"
    },
    {
      student: student._id,
      teacher: teacher._id,
      parentEmail: "parent.sid@bibliotekx.ai",
      subject: "Weekly progress report",
      body: "Sid is progressing steadily and should revise knowledge graphs next.",
      type: "weekly-report",
      status: "sent"
    }
  ]);

  await LiveSession.create([
    {
      course: course._id,
      teacher: teacher._id,
      title: "Retrieval Deep Dive",
      status: "completed",
      attendees: 24,
      recordingUrl: "https://example.com/recordings/retrieval",
      transcript: "Session transcript on retrieval, chunking, and topic links.",
      notes: "Students struggled most with chunk boundary selection.",
      startedAt: new Date("2026-03-25T10:00:00.000Z"),
      endedAt: new Date("2026-03-25T11:00:00.000Z")
    }
  ]);

  await Notification.create([
    {
      user: student._id,
      title: "New adaptive quiz unlocked",
      body: "Your next best topic is Knowledge Graph. Continue the path to keep your streak alive.",
      type: "success"
    },
    {
      user: teacher._id,
      title: "Low attendance alert",
      body: "Noah Student dropped below the attendance threshold this week.",
      type: "warning"
    }
  ]);

  await Announcement.create([
    {
      title: "Mid-sem revision window opens Monday",
      body: "Use the course workspace to access revision notes, videos, and adaptive quizzes before the checkpoint.",
      audience: "students",
      course: course._id,
      postedBy: teacher._id
    },
    {
      title: "Faculty review meeting",
      body: "Class health analytics and risk alerts will be reviewed Friday at 4 PM.",
      audience: "teachers",
      postedBy: admin._id
    },
    {
      title: "Campus LMS maintenance",
      body: "Bibliotek X will undergo a short maintenance window on Sunday from 6 AM to 7 AM.",
      audience: "all",
      postedBy: admin._id
    }
  ]);

  await TimetableSlot.create([
    {
      title: "Applied Generative AI Lecture",
      course: course._id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      room: "Lab A-204",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "AI Systems Tutorial",
      course: course._id,
      dayOfWeek: "Wednesday",
      startTime: "11:00",
      endTime: "12:00",
      room: "Seminar Hall 2",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "Data Structures Session",
      course: courseTwo._id,
      dayOfWeek: "Thursday",
      startTime: "14:00",
      endTime: "15:30",
      room: "CS Block 103",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "Cloud Engineering Lab",
      course: courseThree._id,
      dayOfWeek: "Tuesday",
      startTime: "13:00",
      endTime: "14:30",
      room: "Cloud Lab 1",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "Statistics Problem Solving",
      course: courseFour._id,
      dayOfWeek: "Wednesday",
      startTime: "15:00",
      endTime: "16:00",
      room: "Math Block 204",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "Design Studio Critique",
      course: courseFive._id,
      dayOfWeek: "Thursday",
      startTime: "10:00",
      endTime: "11:30",
      room: "Studio 5",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "Database Lab",
      course: courseSix._id,
      dayOfWeek: "Friday",
      startTime: "09:30",
      endTime: "11:00",
      room: "Systems Lab 4",
      teacher: teacher._id,
      audience: "students"
    },
    {
      title: "Faculty mentoring hour",
      dayOfWeek: "Friday",
      startTime: "16:00",
      endTime: "17:00",
      room: "Faculty Lounge",
      teacher: teacher._id,
      audience: "teachers"
    }
  ]);

  await ExamSchedule.create([
    {
      title: "Generative AI Mid-Sem",
      course: course._id,
      examDate: new Date("2026-04-18T09:00:00.000Z"),
      startTime: "09:00",
      endTime: "11:00",
      room: "Exam Hall 1",
      hallTicketCode: "BX-AI-401"
    },
    {
      title: "Data Structures Practical",
      course: courseTwo._id,
      examDate: new Date("2026-04-20T13:00:00.000Z"),
      startTime: "13:00",
      endTime: "15:00",
      room: "Lab B-12",
      hallTicketCode: "BX-DS-244"
    },
    {
      title: "Cloud Deployment Viva",
      course: courseThree._id,
      examDate: new Date("2026-04-22T10:00:00.000Z"),
      startTime: "10:00",
      endTime: "11:30",
      room: "Cloud Lab 1",
      hallTicketCode: "BX-CL-310"
    },
    {
      title: "Statistics Assessment",
      course: courseFour._id,
      examDate: new Date("2026-04-24T14:00:00.000Z"),
      startTime: "14:00",
      endTime: "16:00",
      room: "Math Block 204",
      hallTicketCode: "BX-ST-288"
    }
  ]);

  await FeeRecord.create([
    {
      user: student._id,
      term: "Semester 4 Tuition",
      totalAmount: 85000,
      paidAmount: 35000,
      dueDate: new Date("2026-04-15T00:00:00.000Z"),
      status: "partial",
      items: [
        { label: "Tuition", amount: 70000 },
        { label: "Library", amount: 5000 },
        { label: "Lab", amount: 10000 }
      ]
    },
    {
      user: studentTwo._id,
      term: "Semester 4 Tuition",
      totalAmount: 85000,
      paidAmount: 85000,
      dueDate: new Date("2026-04-15T00:00:00.000Z"),
      status: "paid",
      items: [
        { label: "Tuition", amount: 70000 },
        { label: "Library", amount: 5000 },
        { label: "Lab", amount: 10000 }
      ]
    },
    {
      user: studentThree._id,
      term: "Semester 4 Tuition",
      totalAmount: 85000,
      paidAmount: 0,
      dueDate: new Date("2026-04-15T00:00:00.000Z"),
      status: "pending",
      items: [
        { label: "Tuition", amount: 70000 },
        { label: "Library", amount: 5000 },
        { label: "Lab", amount: 10000 }
      ]
    }
  ]);

  await LeaveApplication.create([
    {
      user: student._id,
      title: "Medical leave request",
      reason: "Need two days of leave due to fever and doctor advised rest.",
      fromDate: new Date("2026-04-03T00:00:00.000Z"),
      toDate: new Date("2026-04-04T00:00:00.000Z"),
      status: "approved",
      reviewNote: "Approved. Submit medical note after returning.",
      reviewedBy: teacher._id,
      reviewedAt: new Date("2026-04-02T00:00:00.000Z")
    },
    {
      user: studentThree._id,
      title: "Family function leave",
      reason: "Travelling out of town for a family function.",
      fromDate: new Date("2026-04-10T00:00:00.000Z"),
      toDate: new Date("2026-04-11T00:00:00.000Z"),
      status: "pending"
    }
  ]);

  await GuardianMeeting.create([
    {
      teacher: teacher._id,
      student: student._id,
      guardianName: "Riya Sharma",
      guardianEmail: "parent.sid@bibliotekx.ai",
      meetingDate: new Date("2026-03-29T16:30:00.000Z"),
      mode: "video",
      status: "scheduled",
      summary: "Review mid-sem preparation and maintain current focus rhythm.",
      actionItems: ["Revise knowledge graph topics", "Complete adaptive quiz set 3"]
    },
    {
      teacher: teacher._id,
      student: studentThree._id,
      guardianName: "Anita Rao",
      guardianEmail: "parent.noah@bibliotekx.ai",
      meetingDate: new Date("2026-03-21T15:00:00.000Z"),
      mode: "call",
      status: "completed",
      summary: "Discussed attendance shortage and backlog support plan.",
      actionItems: ["Attend two guided lab sessions", "Submit pending quiz retry by Friday"]
    }
  ]);

  await DocumentRequest.create([
    {
      user: student._id,
      type: "bonafide",
      purpose: "Internship verification for summer program",
      status: "under-review",
      remarks: "Processing with academic office"
    },
    {
      user: studentTwo._id,
      type: "transcript",
      purpose: "Scholarship application submission",
      status: "approved",
      remarks: "Digitally signed copy available",
      approvedAt: new Date("2026-03-20T10:00:00.000Z")
    }
  ]);

  await HostelPass.create([
    {
      user: student._id,
      hostelName: "Aurum Residency",
      roomNumber: "B-204",
      wardenName: "Mrs. Nandini Joshi",
      status: "active",
      validUntil: new Date("2026-12-31T00:00:00.000Z")
    },
    {
      user: studentThree._id,
      hostelName: "Aurum Residency",
      roomNumber: "C-117",
      wardenName: "Mrs. Nandini Joshi",
      status: "pending",
      validUntil: new Date("2026-12-31T00:00:00.000Z")
    }
  ]);

  await TransportPass.create([
    {
      user: studentTwo._id,
      routeName: "Route 5 - West City",
      stopName: "Lake View Junction",
      vehicleNumber: "MH-14-BX-2211",
      status: "active",
      validUntil: new Date("2026-11-30T00:00:00.000Z")
    },
    {
      user: student._id,
      routeName: "Route 2 - Central Line",
      stopName: "Tech Park Gate",
      vehicleNumber: "MH-14-BX-2044",
      status: "active",
      validUntil: new Date("2026-11-30T00:00:00.000Z")
    }
  ]);

  await PlacementRecord.create([
    {
      user: student._id,
      companyName: "OpenGrid Labs",
      roleTitle: "AI Platform Intern PPO",
      packageLpa: 14,
      status: "shortlisted",
      driveDate: new Date("2026-04-12T00:00:00.000Z")
    },
    {
      user: studentTwo._id,
      companyName: "Nimbus Stack",
      roleTitle: "Frontend Engineer",
      packageLpa: 10,
      status: "placed",
      driveDate: new Date("2026-03-19T00:00:00.000Z")
    }
  ]);

  await InternshipRecord.create([
    {
      user: student._id,
      companyName: "DataSpring",
      domain: "ML Engineering",
      duration: "8 weeks",
      status: "active",
      mentorName: "Rahul Menon"
    },
    {
      user: studentThree._id,
      companyName: "CloudMesh",
      domain: "DevOps",
      duration: "6 weeks",
      status: "applied",
      mentorName: "Asha Iyer"
    }
  ]);

  await LibraryRecord.create([
    {
      user: student._id,
      bookTitle: "Designing Data-Intensive Applications",
      accessionCode: "LIB-BX-1042",
      issueDate: new Date("2026-03-05T00:00:00.000Z"),
      dueDate: new Date("2026-04-05T00:00:00.000Z"),
      status: "issued",
      fineAmount: 0
    },
    {
      user: studentTwo._id,
      bookTitle: "Introduction to Algorithms",
      accessionCode: "LIB-BX-2021",
      issueDate: new Date("2026-02-20T00:00:00.000Z"),
      dueDate: new Date("2026-03-20T00:00:00.000Z"),
      status: "overdue",
      fineAmount: 150
    },
    {
      user: studentThree._id,
      bookTitle: "Hands-On Machine Learning",
      accessionCode: "LIB-BX-3098",
      issueDate: new Date("2026-01-15T00:00:00.000Z"),
      dueDate: new Date("2026-02-15T00:00:00.000Z"),
      returnDate: new Date("2026-02-14T00:00:00.000Z"),
      status: "returned",
      fineAmount: 0
    }
  ]);

  await Message.create([
    {
      roomId: "student-hub",
      sender: teacher._id,
      text: "Use the course workspace to upload your assignment links before the deadline."
    },
    {
      roomId: "student-hub",
      sender: student._id,
      text: "I checked the new retrieval notes and the explain-this feature is helping a lot."
    },
    {
      roomId: "faculty-room",
      sender: admin._id,
      text: "Please review attendance trends and generate weekly reports for students below 75%."
    }
  ]);

  console.log("Bibliotek X seed completed");
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.connection.close();
  process.exit(1);
});
