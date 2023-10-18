import crypto from 'crypto';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { MultiLang } from './_base.schema';
import { Currency } from '../dto/config';
import store from '../store';

export enum OrderStatus {
  Cart = 'cart',
  NeedToPay = 'need-to-pay',
  Paid = 'paid',
  Posting = 'posting',
  Completed = 'completed',
  Canceled = 'canceled',
  Expired = 'expired',
}

export enum TransactionProvider {
  Manual = 'manual',
}

export type AddressType = {
  state: string;
  city: string;
  street: string;
  postalCode: string;
  receiver: {
    firstName: string;
    lastName: string;
    username?: string;
    phone?: string;
    email?: string;
  };
};

export interface IOrder {
  _id: string;
  currency: Currency;
  customer: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username?: string;
    phone?: string;
    email?: string;
  };
  address?: AddressType;
  post?: {
    id: string;
    provider?: string;
    description?: string;
    logo?: string;
    link?: string;
    price?: number;
    tracking?: string;
    postedAt?: Date;
    deliveredAt?: Date;
    title?: string;
  };
  products: {
    _id: Types.ObjectId;
    title: { [key: string]: string };
    miniTitle: { [key: string]: string };
    image?: string;
    combinations: {
      _id: string;
      options?: { [key: string]: string };
      price: number;
      salePrice: number;
      quantity: number;
      weight: number;
    }[];
  }[];
  discount?: {
    code: string;
    amount?: number;
  };
  tax?: number;
  totalPrice: number;
  transaction?: {
    provider: string;
    payment_link: string;
    authority: string;
    createdAt: Date;
    expiredAt: Date;
  };
  checkout?: boolean;
  status: OrderStatus;
  statusChangedAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderModel = Model<IOrder>;
export type OrderDocument = Document<unknown, {}, IOrder> & IOrder;

export const AddressSchema = {
  type: {
    _id: false,
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    receiver: {
      firstName: String,
      lastName: String,
      username: String,
      phone: String,
      email: String,
    },
  },
  required: false,
};

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () =>
        new Array(8)
          .fill(0)
          .map(() => crypto.randomInt(0, 10))
          .join(''),
    },
    currency: { type: String, default: () => store.config.currency },
    customer: {
      type: {
        _id: Schema.Types.ObjectId,
        firstName: String,
        lastName: String,
        username: String,
        phone: String,
        email: String,
      },
      required: true,
    },
    address: AddressSchema,
    post: {
      type: {
        _id: false,
        id: { type: String, required: true },
        provider: String,
        description: String,
        logo: String,
        link: String,
        price: Number,
        tracking: String,
        postedAt: Date,
        deliveredAt: Date,
        title: String,
      },
      required: false,
    },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, required: true },
        title: { type: MultiLang, required: true },
        miniTitle: { type: MultiLang, required: false },
        image: String,
        combinations: [
          {
            _id: { type: String, required: true },
            options: {},
            price: { type: Number, required: true },
            salePrice: { type: Number, required: true },
            quantity: { type: Number, required: true },
            weight: { type: Number, required: true },
          },
        ],
      },
    ],
    discount: {
      type: {
        _id: false,
        code: { type: String, required: true },
        amount: { type: Number, required: true },
      },
      required: false,
    },
    tax: { type: Number, default: 0 },
    totalPrice: Number,
    transaction: {
      _id: false,
      provider: String,
      payment_link: String,
      authority: { type: String, unique: true, sparse: true },
      createdAt: Date,
      expiredAt: Date,
    },
    status: {
      type: String,
      default: OrderStatus.Cart,
    },
    checkout: { type: Boolean, default: false },
    statusChangedAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default schema;
