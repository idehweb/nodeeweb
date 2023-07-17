import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {},
    slug: {
      type: String,
      required: false,
      trim: true,
    },
    price: Number,
    percent: Number,
    customerLimit: Number,
    count: Number,
    customer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    excludeProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    excludeProductCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
    ],

    includeProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    includeProductCategory: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
    ],

    expire: { type: Date },
  },
  { timestamps: true }
);

export default schema;
