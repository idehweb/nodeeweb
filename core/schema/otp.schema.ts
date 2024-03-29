import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      expires: 120,
    },
  },
  { timestamps: true }
);

export default schema;
