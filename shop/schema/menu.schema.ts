import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {},
    slug: {
      type: String,
      required: false,
      trim: true,
    },
    image: String,
    order: Number,
    kind: String,
    link: String,
    icon: String,
    data: {},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" }, //menu_id
  },
  { timestamps: true }
);

export default schema;
