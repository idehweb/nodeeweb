import mongoose, { Model, Types } from 'mongoose';
import { Document } from 'mongoose';
import { MultiLang } from './_base.schema';

export interface IDiscount {
  name?: { [key: string]: string };
  code: string;
  description?: string;
  consumers: Types.ObjectId[];
  amount?: number;
  maxAmount: number;
  percentage?: number;
  usageLimit: number;
  expiredAt?: Date;
  active: boolean;
}

export type DiscountModel = Model<IDiscount>;
export type DiscountDocument = Document<Types.ObjectId, {}, IDiscount> &
  IDiscount;

const schema = new mongoose.Schema(
  {
    name: MultiLang,
    code: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    consumers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customer' }],
    amount: Number,
    maxAmount: { type: Number, default: Number.MAX_SAFE_INTEGER },
    percentage: Number,
    expiredAt: Date,
    usageLimit: { type: Number, default: 1 },
    description: String,
    active: { type: Boolean, default: true },
    excludeDiscount: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'discount' },
    ],
    excludeDiscountCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'discountCategory' },
    ],

    includeDiscount: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'discount' },
    ],
    includeDiscountCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'discountCategory' },
    ],

    expire: { type: Date },
  },
  { timestamps: true }
);

export default schema;
