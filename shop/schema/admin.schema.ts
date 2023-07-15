import mongoose, { Model, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdminMethods {
  passwordVerify: (password: string) => Promise<boolean>;
}

export interface IAdmin {
  email: string;
  username: string;
  nickname: string;
  password: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminModel = Model<IAdmin, {}, IAdminMethods>;

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: { type: String, default: 'user' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.index({ _id: 1, active: 1 }, { name: 'auth' });

schema.pre('save', async function (next) {
  const user = this;
  if (!user.password) return next();

  user.password = await bcrypt.hash(user.password, 12);
  return next();
});

schema.method('passwordVerify', function (password: string) {
  return bcrypt.compare(password, this.password);
});

export default schema;
