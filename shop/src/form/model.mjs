console.log('#model product')
export default (mongoose)=>{
    const FormSchema = new mongoose.Schema({
        description: {},
        title: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        button: {
            type: String,
            default: "send",
        },
        createdAt: {type: Date, default: new Date()},
        updatedAt: {type: Date, default: new Date()},
        active: {type: Boolean, default: true},
        elements: [],
        responses:[],
        status: {type: String, default: 'processing'},
        view:{type: Number, default: 1},

    });
    return FormSchema

};
