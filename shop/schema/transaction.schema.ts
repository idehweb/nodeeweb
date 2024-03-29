import mongoose, { Document, Model, Types } from 'mongoose';
import { Currency } from '../dto/config';

export enum TransactionStatus {
  NeedToPay = 'need-to-pay',
  Canceled = 'canceled',
  Failed = 'failed',
  Expired = 'expired',
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
  payer?: { _id: Types.ObjectId; type: 'admin' | 'customer' };
  order?: string;
  payment_link?: string;
  payment_method?: string;
  payment_headers?: { [key: string]: string };
  payment_body?: { [key: string]: any };
  payment_message?: string;
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
  payment_method?: string;
  payment_headers?: { [key: string]: string };
  payment_body?: { [key: string]: any };
  payment_message?: string;
  status: TransactionStatus;
  amount: number;
  createdAt: Date;
  expiredAt: Date;
}
export type TransactionDocument = Document<Types.ObjectId, {}, ITransaction> &
  ITransaction;
export type TransactionModel = Model<ITransaction>;

export const TransactionGridSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    sparse: true,
  },
  provider: { type: String, default: TransactionProvider.Manual },
  payment_link: String,
  payment_method: String,
  payment_headers: {},
  payment_body: {},
  payment_message: String,
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  expiredAt: { type: Date },
});

const schema = new mongoose.Schema(
  {
    creator_category: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    payer: {
      type: new mongoose.Schema({
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, required: true },
      }),
      required: false,
    },
    order: { type: String, ref: 'order' },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, default: TransactionProvider.Manual },
    payment_link: String,
    payment_method: String,
    payment_headers: {},
    payment_body: {},
    payment_message: String,
    authority: { type: String, unique: true, sparse: true },
    status: { type: String, default: TransactionStatus.NeedToPay },
    active: { type: Boolean, default: true },
    expiredAt: { type: Date },
    paidAt: { type: Date },
    message: String,
  },
  { timestamps: true }
);

export default schema;
