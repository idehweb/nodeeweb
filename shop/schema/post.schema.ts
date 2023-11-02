import mongoose, { Document, Model, Types } from 'mongoose';

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
  photos: any[];
  thumbnail: string;
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
    photos: [],
    thumbnail: String,
  },
  { timestamps: true }
);

export default schema;
