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
  data: {},
  values: [],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'customerGroup' }, //category_id
});

export default schema;
