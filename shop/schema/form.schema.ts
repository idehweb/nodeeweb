import mongoose from 'mongoose';
import { MultiLang } from './_base.schema';

const schema = new mongoose.Schema(
  {
    description: {},
    title: {},
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    button: {
      type: String,
      default: 'send',
    },
    active: { type: Boolean, default: true },
    elements: [],
    responses: [],
    status: { type: String, default: 'processing' },
    view: { type: Number, default: 1 },
    metatitle: MultiLang,
    metadescription: MultiLang,
  },
  { timestamps: true }
);

export default schema;
