import mongoose, { Document, Model, Types } from 'mongoose';

export interface IMedia {
  title?: string;
  url: string;
  type: string;
}

export type MediaModel = Model<IMedia, {}, unknown>;
export type MediaDocument = Document<Types.ObjectId, {}, IMedia> & IMedia;

const schema = new mongoose.Schema(
  {
    title: String,
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default schema;
