import mongoose, { Document, Model, Types } from 'mongoose';

export enum ActivityFrom {
  EntityCrud = 'entity-crud',
  Activity = 'activity',
}

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
};

export interface IActivity {
  doer: ActivityUser;
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
  from: ActivityFrom;
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
    from: { type: String, required: true },
  },
  { timestamps: true }
);

export default schema;
