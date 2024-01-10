import mongoose, { Document, Model, Types } from 'mongoose';
import { MultiLang } from './_base.schema';

export interface IProductCategory {
  name: any;
  slug: string;
  type: string;
  image?: string;
  data?: any;
  metatitle?: any;
  metadescription?: any;
  description?: any;
  values?: any[];
  parent?: Types.ObjectId;
}
export type ProductCategoryDocument = Document<
  Types.ObjectId,
  {},
  IProductCategory
> &
  IProductCategory;
export type ProductCategoryModel = Model<IProductCategory>;

const schema = new mongoose.Schema(
  {
    name: {},
    slug: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      default: 'normal',
    },
    image: String,
    data: {},
    metatitle: MultiLang,
    metadescription: MultiLang,
    description: {},
    values: [],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'productCategory' }, //category_id
  },
  { timestamps: true }
);

export default schema;
