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

export type ActivityUser = {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  at: Date;
};

export interface IActivity {
  doers: ActivityUser[];
  undoers: ActivityUser[];
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
    doers: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, required: true },
          firstName: String,
          lastName: String,
          at: Date,
        },
      ],
      required: true,
    },
    undoers: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, required: true },
          firstName: String,
          lastName: String,
          at: Date,
        },
      ],
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
