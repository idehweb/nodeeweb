import { Photo } from '@nodeeweb/core';
import mongoose, { Document, Model, Types } from 'mongoose';
import { MultiLang } from './_base.schema';

export interface IPost {
  active: boolean;
  category: Types.ObjectId[];
  data: any;
  description: any;
  excerpt: any;
  views: any[];
  slug: string;
  title: any;
  elements: any;
  kind: string;
  status: string;
  photos: Photo[];
  thumbnail: string;
  metatitle?: { [key: string]: string };
  metadescription?: { [key: string]: string };
}

export type PostDocument = IPost & Document<Types.ObjectId, {}, IPost>;
export type PostModel = Model<IPost>;

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
    data: {},
    description: {},
    excerpt: {},
    views: [],
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    title: {},
    elements: {},
    kind: { type: String, default: 'post' },
    status: { type: String, default: 'processing' },
    photos: [
      {
        type: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: 'file' },
          url: { type: String, required: true },
          alt: { type: String },
        },
        required: false,
      },
    ],
    thumbnail: String,
    metatitle: MultiLang,
    metadescription: MultiLang,
  },
  { timestamps: true }
);

schema.index(
  { slug: 1 },
  {
    name: 'slug',
    unique: true,
    partialFilterExpression: { active: true },
  }
);

export default schema;
