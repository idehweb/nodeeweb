import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    nickname: {
      type: String,
    },
    firstName: String,
    expire: Date,
    lastName: String,
    birth_day: String,
    birth_month: String,
    birthday: String,
    birthdate: { type: Date },
    internationalCode: String,
    sex: String,
    extra: { type: String },
    source: { type: String, default: "WEBSITE" },
    bankData: {},
    data: {},
    type: {
      type: String,
      required: false,
      default: "user",
    },
    contacts: [
      { _id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" } },
    ],
    wishlist: [
      { _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } },
    ],
    customerGroup: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CustomerGroup" },
    ],
    password: String,
    age: { type: Number },
    whatsapp: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    activationCode: Number,
    tokens: [{ token: String, os: String }],
    notificationTokens: [
      { token: String, updatedAt: { type: Date, default: Date.now } },
    ],
    credit: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    invitationCode: Number,
    invitation_list: [
      {
        customer_id: String,
      },
    ],
    status: [
      {
        createdAt: { type: Date, default: Date.now },
        description: String,
        status: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      },
    ],
    photos: [
      {
        name: String,
        url: String,
      },
    ],
    role: { type: String, default: "user" },
    address: [],
    companyName: String,
  },
  { timestamps: true }
);
schema.pre("save", async function (next) {
  const user = this;
  if (!user.password) return next();

  user.password = await bcrypt.hash(user.password, 12);
  return next();
});

schema.index({ _id: 1, active: 1 }, { name: "auth" });

export default schema;
