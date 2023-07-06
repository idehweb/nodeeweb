import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, //order_id
    trackingCode: Number,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, //order_id
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, //order_id
    form: { type: mongoose.Schema.Types.ObjectId, ref: "Form" }, //order_id
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
