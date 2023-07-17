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
  useInFilter: {
    type: Boolean,
    default: true,
  },
  data: {},
  metatitle: {},
  metadescription: {},
  description: {},
  values: [],
});

export default schema;
