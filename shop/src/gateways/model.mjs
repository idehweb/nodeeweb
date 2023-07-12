console.log('#model gateways')
export default (mongoose) => {
    const GatewaySchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        data: {},
        excerpt: {},
        description: {},
        request: "",
        verify: "",
        type:  {type: String, default: 'bank'},
        title: {},
        slug: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        thumbnail: String,

    });
    return GatewaySchema

};
