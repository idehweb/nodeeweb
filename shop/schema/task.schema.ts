import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    data: {},
    description: {},
    excerpt: {},
    views: [],
    slug: String,
    title: {},
    elements: {},
    kind: { type: String, default: "post" },
    status: { type: String, default: "processing" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

    photos: [],
    thumbnail: String,
  },
  { timestamps: true }
);

export default schema;
