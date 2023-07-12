// console.log('#model setting')

export default (mongoose)=>{
    const NoteSchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
        admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
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
    return NoteSchema

};
