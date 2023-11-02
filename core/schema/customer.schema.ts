import mongoose, { Document, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';

export enum CustomerSource {
  Web = 'WEBSITE',
  Panel = 'CRM',
}

export interface ICustomerMethods {
  passwordVerify: (password: string) => Promise<boolean>;
}

export interface ICustomer extends IUser {
  customerGroup: Types.ObjectId[];
  source: CustomerSource;
}

export type CustomerModel = Model<ICustomer, {}, ICustomerMethods>;
export type CustomerDocument = Document<Types.ObjectId, {}, ICustomer> &
  ICustomer &
  ICustomerMethods;

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false,
    },
    passwordChangeAt: {
      type: Date,
      select: false,
    },
    credentialChangeAt: {
      type: Date,
      default: () => Date.now() - 1000,
      select: false,
    },
    expire: Date,
    birth_day: String,
    birth_month: String,
    birthday: Date,
    birthdate: { type: Date },
    internationalCode: String,
    sex: String,
    extra: { type: String },
    source: { type: String, enum: CustomerSource, default: CustomerSource.Web },
    bankData: {},
    data: { type: {}, default: {}, select: false },
    type: {
      type: String,
      required: false,
      default: 'customer',
    },
    contacts: [
      { _id: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' } },
    ],
    wishlist: [
      { _id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' } },
    ],
    customerGroup: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'customerGroup' },
    ],
    age: { type: Number },
    whatsapp: { type: Boolean, default: false },
    activationCode: Number,
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
      },
    ],
    photos: [
      {
        name: String,
        url: String,
      },
    ],
    role: { type: String, default: 'customer' },
    active: { type: Boolean, default: true },
    companyName: String,
    companyTelNumber: String,
  },
  { timestamps: true }
);

schema.index({ _id: 1, active: 1 }, { name: 'auth' });

schema.pre('save', async function (next) {
  const user = this;
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
    user.passwordChangeAt = new Date();
  }
  user.credentialChangeAt = user.passwordChangeAt ?? new Date();

  return next();
});

schema.post('save', function (doc, next) {
  doc.credentialChangeAt = undefined;
  doc.passwordChangeAt = undefined;
  next();
});

schema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (Array.isArray(update)) {
    // aggregation pipeline
    const addFields: any = update.find((pipe) => pipe['$addFields']);
    if (!addFields || !addFields.password) return next();

    // hash pass
    addFields.password = await bcrypt.hash(addFields.password, 12);
    // update change at
    addFields.passwordChangeAt = new Date();
    addFields.credentialChangeAt = addFields.passwordChangeAt;
  } else {
    const password = update.$set?.password ?? update.password;
    if (!password) return next();

    // delete password
    delete update.password;

    // hash pass
    update.$set.password = await bcrypt.hash(password, 12);
    // update change at
    update.$set.passwordChangeAt = new Date();
    update.$set.credentialChangeAt = update.$set.passwordChangeAt;
  }

  return next();
});

schema.method('passwordVerify', function (password: string) {
  return bcrypt.compare(password, this.password);
});

export default schema;
