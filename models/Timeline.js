import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Timeline || mongoose.model("Timeline", TimelineSchema);