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
  depend_on?: any;
  query: {
    filter?: mongoose.FilterQuery<any>;
    update?: mongoose.UpdateQuery<any>;
    create?: any;
  };
  target: {
    model: string;
    before?: any;
    after?: any;
  };
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
    status: { type: String, required: true },
    query: {
      filter: { type: {} },
      update: { type: {} },
      create: { type: {} },
    },
    target: {
      model: { type: String, required: true },
      before: { type: {} },
      after: { type: {} },
    },
  },
  { timestamps: true }
);

export default schema;
