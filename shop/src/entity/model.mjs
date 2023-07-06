// console.log('#model setting')

export default (mongoose)=>{
    const EntitySchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true},
        slug: String,
        model: {},
        routes: [],
        controller: {},
        rules: {},

    });
    return EntitySchema

};
