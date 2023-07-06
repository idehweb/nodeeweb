import mongoose from "mongoose";

const schema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  slug: String,
  model: {},
  routes: [],
  controller: {},
  rules: {},
});

export default schema;
