import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'order' }, //order_id
    trackingCode: Number,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' }, //order_id
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }, //order_id
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'form' }, //order_id
    description: String,
    active: { type: Boolean, default: true },
    data: {},
    status: { type: Boolean },
    activities: [
      {
        user: String,
        status: String,
        userStatus: String,
        description: String,
        createdAt: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default schema;
