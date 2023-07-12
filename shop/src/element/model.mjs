// console.log('#model setting')
import bcrypt from 'bcrypt';

export default (mongoose)=>{
    const ElementSchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        firstCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        secondCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        thirdCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
        data: {},
        description: {},
        excerpt: {},
        views: [],
        slug: String,
        title: {},
        elements: {},
        kind: {type: String, default: 'post'},
        status: {type: String, default: 'processing'},
        photos: [],
        thumbnail: String,

    });
    return ElementSchema


};
