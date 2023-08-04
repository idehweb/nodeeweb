import mongoose from 'mongoose';

const schema = {
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  data: {},
  history: {},
  task: {},
  action: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'transaction' },
  settings: { type: mongoose.Schema.Types.ObjectId, ref: 'settings' },
  page: { type: mongoose.Schema.Types.ObjectId, ref: 'page' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'template' },
  sms: { type: mongoose.Schema.Types.ObjectId, ref: 'sms' },
};

export default schema;
