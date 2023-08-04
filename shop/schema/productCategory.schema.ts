import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
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
    metatitle: {},
    metadescription: {},
    description: {},
    values: [],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'productCategory' }, //category_id
  },
  { timestamps: true }
);

export default schema;
