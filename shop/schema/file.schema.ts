import mongoose, { Document, Model, Types } from 'mongoose';

export interface IFile {
  title?: string;
  url: string;
  type: string;
}

export type FileModel = Model<IFile, {}, unknown>;
export type FileDocument = Document<Types.ObjectId, {}, IFile> & IFile;

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
