console.log('#model transfer')
export default (mongoose) => {
    const TransferSchema = new mongoose.Schema({

        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        data: {},
        excerpt: {},
        description: {},
        title: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        thumbnail: String,

    });
    return TransferSchema

};
