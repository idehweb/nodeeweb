import mongoose, { Document, Model, Types } from 'mongoose';
import { MultiLang } from './_base.schema';

export interface IPage {
  active: boolean;
  data: any;
  description: any;
  excerpt: any;
  views: any[];
  slug?: string;
  title: any;
  elements: any;
  access: string;
  kind: string;
  classes: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  path?: string;
  maxWidth: string;
  status: string;
  photos: any[];
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
    slug: { type: String, require: true },
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
    metatitle: MultiLang,
    metadescription: MultiLang,
  },
  { timestamps: true }
);

// schema.index(
//   { slug: 1 },
//   {
//     name: 'slug',
//     unique: true,
//     partialFilterExpression: { active: true },
//   }
// );

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
