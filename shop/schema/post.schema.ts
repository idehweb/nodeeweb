import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    data: {},
    description: {},
    excerpt: {},
    views: [],
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    title: {},
    elements: {},
    kind: { type: String, default: "post" },
    status: { type: String, default: "processing" },
    photos: [],
    thumbnail: String,
  },
  { timestamps: true }
);

export default schema;
