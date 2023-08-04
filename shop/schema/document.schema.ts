import mongoose from 'mongoose';

const schema = new mongoose.Schema({
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
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'file' }],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default schema;
