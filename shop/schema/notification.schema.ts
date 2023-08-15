import { SmsSendStatus } from '@nodeeweb/core/types/plugin';
import mongoose, { Document, Model, Types } from 'mongoose';
import { CustomerSource } from './customer.schema';

export interface INotification {
  title: string;
  message: string;
  status: SmsSendStatus;
  response?: { message?: string; at: Date };
  phone?: string;
  source?: CustomerSource;
  customerGroup?: Types.ObjectId;
  from?: string;
}
export type NotificationModel = Model<INotification>;
export type NotificationDocument = Document<Types.ObjectId, {}, INotification> &
  INotification;

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: SmsSendStatus,
      default: SmsSendStatus.Send_Processing,
    },
    response: {
      type: {
        _id: false,
        message: String,
        at: { type: Date, required: true },
      },
      required: false,
    },
    phone: String,
    source: String,
    customerGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customerGroup',
    },
    from: String,
  },
  { timestamps: true }
);

export default schema;
