console.log('#model discount')
export default (mongoose) => {
    const DiscountSchema = new mongoose.Schema({
        name: {},
        slug: {
            type: String,
            required: false,
            trim: true
        },
        price: Number,
        percent: Number,
        customerLimit: Number,
        count: Number,
        customer: [{type: mongoose.Schema.Types.ObjectId, ref: "Customer"}],
        excludeProduct: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
        excludeProductCategory: [{type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory"}],

        includeProduct: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
        includeProductCategory: [{type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory"}],

        expire: {type: Date},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
    });
    return DiscountSchema;
};
