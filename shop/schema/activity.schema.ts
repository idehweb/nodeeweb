import mongoose, { Document, Model, Types } from 'mongoose';

export enum ActivityType {
  Update = 'update',
  Create = 'create',
  Delete = 'delete',
}

export enum ActivityStatus {
  Do = 'do',
  Undo = 'undo',
}

export interface IActivity {
  doer: {
    _id: Types.ObjectId;
    firstName?: string;
    lastName?: string;
  };
  undoer?: {
    _id: Types.ObjectId;
    firstName?: string;
    lastName?: string;
  };
  type: ActivityType;
  status: ActivityStatus;
  model: string;
  depend_on?: any;
  filter_query: mongoose.FilterQuery<any>;
  update_query?: mongoose.UpdateQuery<any>;
  target_before: any | null;
  target_after: any;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityDocument = Document<Types.ObjectId, {}, IActivity> &
  IActivity;

export type ActivityModel = Model<IActivity>;

const schema = new mongoose.Schema(
  {
    doer: {
      type: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        firstName: String,
        lastName: String,
      },
      required: true,
    },
    undoer: {
      type: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        firstName: String,
        lastName: String,
      },
      required: false,
    },
    type: { type: String, required: true },
    depend_on: { type: mongoose.Schema.Types.Mixed },
    model: { type: String, required: true },
    status: { type: String, required: true },
    filter_query: { type: {}, required: true },
    update_query: { type: {}, required: false },
    target_before: { type: {}, required: true },
    target_after: { type: {}, required: true },
  },
  { timestamps: true }
);

export default schema;
