// console.log('#model CustomerGroup')
export default (mongoose)=>{
    const CustomerGroupSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        type: {
            type: String,
            default: "normal"
        },
        data: {},
        values:[],
        parent:{type: mongoose.Schema.Types.ObjectId, ref: 'CustomerGroup'} //category_id
    });
    return CustomerGroupSchema

};
