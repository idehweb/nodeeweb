import mongoose, { Document, Model } from 'mongoose';
import { Types } from 'mongoose';

export interface IProduct {
  title: { [key: string]: string };
  image?: string;
  price: number;
  salePrice: number;
  weight?: number;
  quantity: number;
}

export type ProductModel = Model<IProduct>;
export type ProductDocument = Document<Types.ObjectId, {}, IProduct> & IProduct;

const schema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    productCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'productCategory' },
    ],
    attributes: [
      {
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: 'attributes' },
        values: [],
      },
    ],
    sources: [],
    labels: [],
    in_stock: { type: Boolean, default: false },
    story: { type: Boolean, default: false },
    price: { type: Number, required: true },
    weight: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    salePrice: { type: Number, required: true },
    data: {},
    sku: String,
    extra_button: String,
    miniTitle: {},
    excerpt: {},
    options: [],
    extra_attr: [],
    combinations: [],
    sections: [],
    countries: [],
    like: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
        userIp: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    type: { type: String, default: 'normal' },
    description: {},
    requireWarranty: {},

    views: [],
    addToCard: [],
    title: {},
    metatitle: {},
    metadescription: {},
    keywords: {},
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    thumbnail: String,
    status: { type: String, default: 'processing' },
    transaction: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaction' }],
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    photos: [],
    postNumber: String,
  },
  { timestamps: true }
);

export default schema;

schema.pre('save', function (next) {
  if (this.salePrice == undefined) this.salePrice = this.price;
  return next();
});
