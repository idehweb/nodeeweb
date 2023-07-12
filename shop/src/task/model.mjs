// console.log('#model setting')

export default (mongoose)=>{
    const TaskSchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        data: {},
        description: {},
        excerpt: {},
        views: [],
        slug: String,
        title: {},
        elements: {},
        kind: {type: String, default: 'post'},
        status: {type: String, default: 'processing'},
        customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
        admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},

        photos: [],
        thumbnail: String,

    });
    return TaskSchema

};
