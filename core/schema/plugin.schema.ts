import mongoose, { Document, Model, Schema, SchemaType, Types } from 'mongoose';
import { MultiLang } from './_base.schema';

export interface IPlugin {
  name: string;
  version: string;
  description: {
    [key: string]: string;
  };
  slug: string;
  type: string;
  icon?: string;
  author: string;
  arg: { [key: string]: string };
}

export type PluginModel = Model<IPlugin>;

export type PluginDocument = Document<Types.ObjectId, {}, IPlugin> & IPlugin;

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: MultiLang, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    icon: { type: String },
    author: { type: String, required: true },
    arg: {
      _id: false,
    },
  },
  { timestamps: true }
);

export default schema;
