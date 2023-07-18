import crypto from 'crypto';
import mongoose, { Schema, Types } from 'mongoose';

export enum OrderStatus {
  Cart = 'cart',
  NeedToPay = 'need-to-pay',
  Packing = 'packing',
  Posting = 'posting',
  Completed = 'completed',
}
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
        quantity: { type: Number, required: true },
      },
    ],
    discount: {
      code: String,
      amount: Number,
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
      type: OrderStatus,
      default: OrderStatus.Cart,
    },
    statusChangedAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default schema;
