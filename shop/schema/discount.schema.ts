import mongoose, { Model, Types } from 'mongoose';
import { Document } from 'mongoose';

export interface IDiscount {
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
    code: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    consumers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    amount: Number,
    maxAmount: { type: Number, default: Number.MAX_SAFE_INTEGER },
    percentage: Number,
    expiredAt: Date,
    usageLimit: { type: Number, default: 1 },
    description: String,
    active: { type: Boolean, default: true },
    excludeDiscount: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
    ],
    excludeDiscountCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'DiscountCategory' },
    ],

    includeDiscount: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
    ],
    includeDiscountCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'DiscountCategory' },
    ],

    expire: { type: Date },
  },
  { timestamps: true }
);

export default schema;
