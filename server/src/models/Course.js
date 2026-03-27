import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 },
    topics: { type: [String], default: [] }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, default: "General" },
    level: { type: String, default: "Intermediate" },
    semester: { type: String, default: "Semester 4" },
    credits: { type: Number, default: 4 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    thumbnail: { type: String, default: "" },
    status: { type: String, default: "published" },
    modules: { type: [moduleSchema], default: [] },
    knowledgeGraph: {
      nodes: { type: [Object], default: [] },
      edges: { type: [Object], default: [] }
    },
    enrollmentCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
