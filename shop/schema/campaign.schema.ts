import { Photo } from '@nodeeweb/core';
import mongoose, { Document, Model, Types } from 'mongoose';
import { MultiLang } from './_base.schema';

export interface IPost {

    message: String,
    createdAt: Date,
    updatedAt: Date,
    active: {type: Boolean, default: true},
    views: any[],
    title: {},
    slug: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    status: {type: String, default: "processing"},
    customers: any[],
    participantsCount:Number,
    offset:Number,
    limit:Number,
    phoneNumber:String,
    link:String,
    customerGroup:String,
    source:String,
    viewsCount:{type: Number, default: 0}
}

export type PostDocument = IPost & Document<Types.ObjectId, {}, IPost>;
export type PostModel = Model<IPost>;

const schema = new mongoose.Schema(
  {
      message: String,
      createdAt: {type: Date, default: Date.now},
      updatedAt: {type: Date, default: Date.now},
      active: {type: Boolean, default: true},
      views: [],
      title: {},
      slug: {
          type: String,
          unique: true,
          required: true,
          trim: true,
      },
      status: {type: String, default: "processing"},
      customers: [],
      participantsCount:Number,
      offset:Number,
      limit:Number,
      phoneNumber:String,
      link:String,
      customerGroup:String,
      source:String,
      viewsCount:{type: Number, default: 0}
  },
  { versionKey: false,
      timestamps: true }
);

schema.index(
  { slug: 1 },
  {
    name: 'slug',
    unique: true,
    partialFilterExpression: { active: true },
  }
);

export default schema;
