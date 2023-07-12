// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const NotificationSchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        message: String,
        title: String,
        status:{type:String,default:'unsend'},
        phoneNumber: String,
        limit: Number,
        offset: Number,
        to: [],
        from: String,
        source: String,
        customerGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'CustomerGroup'},
        type: String,
        customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'} //category_id
    });
    return NotificationSchema
// module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('Settings', SettingsSchema);
    // export default mongoose.model('User', UserSchema);

    // return User

};
