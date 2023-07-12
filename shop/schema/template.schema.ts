import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    type: String,
    maxWidth: String,
    data: [],
    elements: [],
    classes: String,
    padding: String,
    backgroundColor: String,
    showInDesktop: Boolean,
    showInMobile: Boolean,
  },
  { timestamps: true }
);

export default schema;
