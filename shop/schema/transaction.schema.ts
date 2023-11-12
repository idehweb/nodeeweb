import mongoose, { Document, Model, Types } from 'mongoose';

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
  consumer?: Types.ObjectId;
  order?: Types.ObjectId;
  payment_link?: string;
  authority: string;
  amount: number;
  status: TransactionStatus;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
}
export interface ITransactionGrid {
  _id: Types.ObjectId;
  provider: string | TransactionProvider;
  payment_link?: string;
  createdAt: Date;
  expiredAt: Date;
}
export type TransactionDocument = Document<Types.ObjectId, {}, ITransaction> &
  ITransaction;
export type TransactionModel = Model<ITransaction>;

export const TransactionGridSchema = new mongoose.Schema({
  provider: { type: String, default: TransactionProvider.Manual },
  payment_link: String,
  expiredAt: { type: Date },
});

const schema = new mongoose.Schema(
  {
    creator_category: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId },
    consumer: { type: mongoose.Schema.Types.ObjectId },
    order: { type: mongoose.Schema.Types.ObjectId },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, default: TransactionProvider.Manual },
    payment_link: String,
    authority: { type: String, unique: true, sparse: true },
    status: { type: String, default: TransactionStatus.NeedToPay },
    //   15min expr by default
    expiredAt: { type: Date, default: () => Date.now() + 15 * 60 * 1_000 },
  },
  { timestamps: true }
);

export default schema;
