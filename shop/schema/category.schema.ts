import mongoose from 'mongoose';
import { MultiLang } from './_base.schema';

const schema = new mongoose.Schema({
  name: {},
  slug: {
    type: String,
    required: false,
    trim: true,
  },
  type: {
    type: String,
    default: 'normal',
  },
  image: String,
  data: {},
  values: [],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'productCategory' },
  metatitle: MultiLang,
  metadescription: MultiLang,
});

export default schema;
