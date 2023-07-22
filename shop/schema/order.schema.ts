import crypto from 'crypto';
import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export enum OrderStatus {
  Cart = 'cart',
  NeedToPay = 'need-to-pay',
  Packing = 'packing',
  Posting = 'posting',
  Completed = 'completed',
  Canceled = 'canceled',
  Expired = 'expired',
}

export enum TransactionProvider {
  Manual = 'manual',
}

export interface IOrder {
  _id: string;
  customer: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username?: string;
    phone?: string;
    email?: string;
  };
  address?: {
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
  post?: {
    provider?: string;
    description?: string;
    logo?: string;
    link?: string;
    price?: number;
    tracking?: string;
    postedAt?: Date;
    deliveredAt?: Date;
  };
  products: {
    _id: Types.ObjectId;
    name: string;
    image?: string;
    price: number;
    salePrice: number;
    quantity: number;
    weight: number;
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
  status: OrderStatus;
  statusChangedAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderModel = Model<IOrder>;
export type OrderDocument = Document<unknown, {}, IOrder> & IOrder;

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
    address: {
      type: {
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
    },
    post: {
      provider: String,
      description: String,
      logo: String,
      link: String,
      price: Number,
      tracking: String,
      postedAt: Date,
      deliveredAt: Date,
    },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        image: String,
        price: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
    discount: {
      code: { type: String, required: true },
      amount: { type: Number, required: true },
    },
    tax: { type: Number, default: 0 },
    totalPrice: Number,
    transaction: {
      provider: String,
      payment_link: String,
      authority: String,
      createdAt: Date,
      expiredAt: Date,
    },
    status: {
      type: String,
      default: OrderStatus.Cart,
    },
    statusChangedAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default schema;
