import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    message: String,
    title: String,
    status: { type: String, default: "unsend" },
    phoneNumber: String,
    limit: Number,
    offset: Number,
    to: [],
    from: String,
    source: String,
    customerGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerGroup",
    },
    type: String,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, //category_id
  },
  { timestamps: true }
);

export default schema;
