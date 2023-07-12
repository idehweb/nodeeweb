// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const ModelSchema = new mongoose.Schema({
        title: String,
        description: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        data: {},
        history: {},
        task: {},
        action:String,
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, 
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, 
        transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, 
        settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" }, 
        page: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
        template: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
        sms: { type: mongoose.Schema.Types.ObjectId, ref: "Sms" }

    });
    return ModelSchema


};
