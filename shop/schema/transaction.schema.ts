import mongoose, { Document, Model, Types } from 'mongoose';
import { Currency } from '../dto/config';

export enum TransactionStatus {
  NeedToPay = 'need-to-pay',
  Canceled = 'canceled',
  Failed = 'failed',
  Paid = 'paid',
}

export enum TransactionProvider {
  Manual = 'manual',
}

export enum TransactionCreator {
  Admin = 'admin',
  Customer_Order = 'customer-order',
  Customer_Credit = 'Customer-credit',
}

export interface ITransaction {
  provider: string | TransactionProvider;
  creator_category: TransactionCreator;
  creator?: Types.ObjectId;
  consumer?: { _id: Types.ObjectId; type: 'admin' | 'customer' };
  order?: Types.ObjectId;
  payment_link?: string;
  authority: string;
  amount: number;
  status: TransactionStatus;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  paidAt: Date;
  message?: string;
  active: boolean;
}
export interface ITransactionGrid {
  _id: Types.ObjectId;
  provider: string | TransactionProvider;
  payment_link?: string;
  amount: number;
  createdAt: Date;
  expiredAt: Date;
}
export type TransactionDocument = Document<Types.ObjectId, {}, ITransaction> &
  ITransaction;
export type TransactionModel = Model<ITransaction>;

export const TransactionGridSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  provider: { type: String, default: TransactionProvider.Manual },
  payment_link: String,
  amount: { type: Number, required: true },
  expiredAt: { type: Date },
});

const schema = new mongoose.Schema(
  {
    creator_category: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId },
    consumer: {
      type: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, required: true },
      },
      required: false,
    },
    order: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, default: TransactionProvider.Manual },
    payment_link: String,
    authority: { type: String, unique: true, sparse: true },
    status: { type: String, default: TransactionStatus.NeedToPay },
    active: { type: Boolean, default: true },
    //   15min expr by default
    expiredAt: { type: Date, default: () => Date.now() + 15 * 60 * 1_000 },
    paidAt: { type: Date },
    message: String,
  },
  { timestamps: true }
);

export default schema;
