import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    theKey: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default schema;
