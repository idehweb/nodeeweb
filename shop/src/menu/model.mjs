// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const MenuSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        image: String,
        order: Number,
        kind: String,
        link: String,
        icon: String,
        data: {},
        parent:{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'} //menu_id
    });
    return MenuSchema
// module.exports = mongoose.model('User', UserSchema);

    // return mongoose.model('Settings', SettingsSchema);
    // export default mongoose.model('User', UserSchema);

    // return User

};
