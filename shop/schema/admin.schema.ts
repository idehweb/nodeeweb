import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdminMethods {
  passwordVerify: (password: string) => Promise<boolean>;
}

export interface IAdmin {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordChangeAt?: Date;
}

export type AdminModel = Model<IAdmin, {}, IAdminMethods>;

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
    role: { type: String, default: 'admin' },
    active: { type: Boolean, default: true },
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
