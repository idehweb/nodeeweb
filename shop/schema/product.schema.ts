import crypto from 'crypto';
import mongoose, { Document, Model } from 'mongoose';
import { Types } from 'mongoose';
import { MultiLang, PublishStatus } from './_base.schema';

export enum PriceType {
  Normal = 'normal',
  Variable = 'variable',
}

export interface IProduct {
  title: { [key: string]: string };
  miniTitle?: { [key: string]: string };
  metatitle?: { [key: string]: string };
  metadescription?: { [key: string]: string };
  keywords?: any;
  slug: string;
  excerpt?: { [key: string]: string };
  description?: { [key: string]: string };
  thumbnail?: string;
  combinations: {
    _id: string;
    options?: { [key: string]: string };
    price?: number;
    salePrice?: number;
    weight: number;
    quantity: number;
    in_stock: boolean;
    sku?: string;
  }[];
  options: {
    _id: string;
    name: string;
    values: { name: string }[];
  }[];
  productCategory: Types.ObjectId[];
  attributes: { attribute: Types.ObjectId; values: string[] }[];
  labels: { title: string }[];
  data?: any;
  extra_attr: { title: string; des: string }[];
  price_type: PriceType;
  status: PublishStatus;
  relatedProducts: Types.ObjectId[];
  photos: { _id: Types.ObjectId; url: string }[];
  active: boolean;
  updatedAt: Date;
  createdAt: Date;
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
        values: { type: [String] },
        _id: false,
      },
    ],
    labels: [{ title: String, _id: false }],
    combinations: [
      {
        _id: { type: String, default: crypto.randomUUID },
        options: {},
        price: { type: Number, required: false },
        weight: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        salePrice: { type: Number, required: false },
        sku: String,
        in_stock: { type: Boolean, default: true },
      },
    ],
    data: {},
    miniTitle: MultiLang,
    excerpt: MultiLang,
    options: [
      {
        _id: String,
        name: String,
        values: [{ name: String, _id: false }],
      },
    ],
    extra_attr: [
      {
        title: { type: String, required: true },
        des: { type: String, required: true },
        _id: false,
      },
    ],
    like: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
        userIp: String,
        createdAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    price_type: { type: String, enum: PriceType, default: PriceType.Normal },
    description: MultiLang,
    views: [],
    title: MultiLang,
    metatitle: MultiLang,
    metadescription: MultiLang,
    keywords: {},
    slug: {
      type: String,
      // unique: true,
      required: true,
      trim: true,
    },
    thumbnail: String,
    status: {
      type: String,
      enum: PublishStatus,
      default: PublishStatus.Processing,
    },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    photos: [
      {
        type: {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: 'file' },
          url: { type: String, required: true },
        },
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default schema;
