// console.log('#model setting')
import bcrypt from 'bcrypt';
import global from '#root/global';

export const CUSTOMER_PROJECTION =
  'photos , nickname , firstName , lastName , email , password , tokens  , phoneNumber , address , authCustomerWithPassword , internationalCode';

export default (mongoose) => {
  const CustomerSchema = new mongoose.Schema(
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
      source: { type: String, default: 'WEBSITE' },
      bankData: {},
      data: {},
      type: {
        type: String,
        required: false,
        default: 'user',
      },
      contacts: [
        { _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' } },
      ],
      wishlist: [
        { _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } },
      ],
      customerGroup: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerGroup' },
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
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        },
      ],
      photos: [
        {
          name: String,
          url: String,
        },
      ],
      address: [],
      companyName: String,
    },
    { timestamps: true }
  );

  //authenticate input against database
  CustomerSchema.statics.authenticate = function (
    phoneNumber,
    password,
    callback
  ) {
    const Customer = mongoose.model('Customer', CustomerSchema);
    Customer.findOne({ phoneNumber: phoneNumber }, CUSTOMER_PROJECTION)
      .lean()
      .exec(function (err, user) {
        if (err) {
          return callback(err);
        } else if (!user) {
          let err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            delete user.password;
            // var token='';
            if (user.tokens && user.tokens.length) {
              user.token = user.tokens[user.tokens.length - 1].token;
            }
            if (!user.tokens || !user.tokens.length) {
              console.log('no token found', user.tokens);

              let Token = global.generateUnid();
              Customer.findByIdAndUpdate(
                user._id,
                {
                  $push: { tokens: { token: Token } },
                },
                function (err, post) {}
              );
              user.token = Token;
            }
            delete user.tokens;

            return callback(null, user);
          } else {
            return callback();
          }
        });
      });
  };

  return CustomerSchema;

  // return mongoose.model('Settings', SettingsSchema);
  // export default mongoose.model('User', UserSchema);

  // return User
};
