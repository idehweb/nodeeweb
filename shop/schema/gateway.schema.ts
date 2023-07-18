import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    data: {},
    excerpt: {},
    description: {},
    request: String,
    verify: String,
    type: { type: String, default: 'bank' },
    title: {},
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    thumbnail: String,
  },
  { timestamps: true }
);

export default schema;
