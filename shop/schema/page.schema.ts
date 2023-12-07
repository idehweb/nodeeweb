import mongoose, { Document, Model, Types } from 'mongoose';
import { MultiLang } from './_base.schema';
import { Photo } from '@nodeeweb/core';

export interface IPage {
  active: boolean;
  data: any;
  description: any;
  excerpt: any;
  views: any[];
  slug?: string;
  title: any;
  elements: any[];
  mobileElements: any[];
  desktopElements: any[];
  access: string;
  kind: string;
  classes: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  path?: string;
  maxWidth: string;
  status: string;
  photos: Photo[];
  thumbnail?: string;
  metatitle?: { [key: string]: string };
  metadescription?: { [key: string]: string };
}

export type PageDocument = Document<Types.ObjectId, {}, IPage> & IPage;

export type PageModel = Model<IPage, {}>;

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    data: {},
    description: {},
    excerpt: {},
    views: [],
    slug: { type: String, required: true },
    title: {},
    elements: { type: [] },
    mobileElements: { type: [] },
    desktopElements: { type: [] },
    access: { type: String, default: 'public' },
    kind: { type: String, default: 'page' },
    classes: { type: String, default: '' },
    backgroundColor: String,
    padding: String,
    margin: String,
    path: String,
    maxWidth: { type: String, default: '100%' },
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
schema.index(
  { path: 1 },
  {
    name: 'path',
    unique: true,
    partialFilterExpression: { active: true },
  }
);

schema.pre('save', function (next) {
  this.slug = this.slug?.replace(/\s+/g, '-').toLowerCase();
  next();
});

schema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (Array.isArray(update)) {
    // aggregate
    const addFields = update.find((p) => p['$addFields']);
    if (addFields && addFields['slug']) {
      addFields['slug'] = addFields['slug'].replace(/\s+/g, '-').toLowerCase();
    }
  } else {
    // update query
    if (update.$set?.slug)
      this.setUpdate({
        $set: { slug: update.$set.slug.replace(/\s+/g, '-').toLowerCase() },
      });
  }
  next();
});

export default schema;
