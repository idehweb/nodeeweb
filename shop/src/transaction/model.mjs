console.log('#model Transaction')
export default (mongoose) => {
    const TransactionSchema = new mongoose.Schema({
        order: {type: mongoose.Schema.Types.ObjectId, ref: "Order"}, //order_id
        orderNumber: Number,
        customer: {type: mongoose.Schema.Types.ObjectId, ref: "Customer"}, //customer_id
        Authority: String,
        gatewayResponse: String,
        gatewayVerifyResponse: String,
        time: Number,
        cardNumber: String,
        payme_tid: String,
        method: String,
        transaction: Number,
        create_time: Number,
        perform_time: {type: Number, default: 0},
        cancel_time: {type: Number, default: 0},
        reason: {type: String, default: null},
        state: {type: Number, default: 0},
        amount: Number,
        RefID: {type: String},
        statusCode: {type: String, default: "-1"},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        data: {},
        status: {type: Boolean, default: false},
        active: {type: Boolean, default: true}
    });
    return TransactionSchema;
};
