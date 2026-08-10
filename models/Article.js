import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author:{
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    typeOfComponent: {
      type: String,
      enum: ["article", "book", "thesis", "report", "other"],
      default: "article",
    },
    dateOfPublication: {
      type: Date,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
 
);

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);