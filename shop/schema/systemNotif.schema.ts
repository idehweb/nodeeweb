import crypto from 'crypto';
import mongoose, { Document, Model, Types } from 'mongoose';
export interface ISystemNotif {
  message: string;
  type: string;
  from: string;
  viewers: { _id: Types.ObjectId; at: Date }[];
  createdAt: Date;
  provider_id: string;
}
export type SystemNotifModel = Model<ISystemNotif>;
export type SystemNotifDocument = Document<string, {}, ISystemNotif> &
  ISystemNotif;

const schema = new mongoose.Schema(
  {
    provider_id: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      required: true,
    },
    from: { type: String, required: true },
    viewers: {
      type: [
        {
          _id: { type: Types.ObjectId, ref: 'Admin' },
          at: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true }
);

export default schema;
