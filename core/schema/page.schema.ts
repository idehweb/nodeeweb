import mongoose from 'mongoose';

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
    access: { type: String, default: 'public' },
    kind: { type: String, default: 'page' },
    classes: { type: String, default: '' },
    backgroundColor: String,
    padding: String,
    margin: String,
    path: String,
    maxWidth: { type: String, default: '100%' },
    status: { type: String, default: 'processing' },
    photos: [],
    thumbnail: String,
  },
  { timestamps: true }
);

export default schema;
