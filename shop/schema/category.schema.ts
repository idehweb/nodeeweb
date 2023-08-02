import mongoose from 'mongoose';

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
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'productCategory' }, //category_id
});

export default schema;
