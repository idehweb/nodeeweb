import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    data: {},
    description: {},
    excerpt: {},
    views: [],
    slug: String,
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
