import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
      unique: true,
      sparse: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    passwordChangeAt: {
      type: Date,
      select: false,
    },
    expire: Date,
    birth_day: String,
    birth_month: String,
    birthday: String,
    birthdate: { type: Date },
    internationalCode: String,
    sex: String,
    extra: { type: String },
    source: { type: String, default: 'WEBSITE' },
    bankData: {},
    data: {},
    type: {
      type: String,
      required: false,
      default: 'user',
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
    active: { type: Boolean, default: true },
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
    role: { type: String, default: 'user' },
    address: [],
    companyName: String,
  },
  { timestamps: true }
);

schema.index({ _id: 1, active: 1 }, { name: 'auth' });

schema.pre('save', async function (next) {
  const user = this;
  if (!user.password) return next();

  user.password = await bcrypt.hash(user.password, 12);
  user.passwordChangeAt = new Date();

  return next();
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
  } else {
    const password = update.$set?.password ?? update.password;
    if (!password) return next();

    // delete password
    delete update.password;

    // hash pass
    update.$set.password = await bcrypt.hash(password, 12);
    // update change at
    update.$set.passwordChangeAt = new Date();
  }

  return next();
});

schema.method('passwordVerify', function (password: string) {
  return bcrypt.compare(password, this.password);
});

export default schema;
