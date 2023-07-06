console.log('#model order')
import crypto from 'crypto';

export default (mongoose) => {

    const lineItemSchema = new mongoose.Schema({
        product_name: {
            type: 'string',
            required: true
        },
        product_id: {
            type: 'string',
            required: true
        },
        price: {
            type: 'number',
            required: true
        },
        total_price: {
            type: 'number',
            required: true
        },
        quantity: {
            type: 'number',
            required: true
        }
    });

    const OrderSchema = new mongoose.Schema({
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        card: [{
            _id: String,
            seller: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
            price: Number,
            salePrice: Number,
            count: Number,
            title: {}
        }],
        deliveryDay: {},
        customer_data: {},
        data: {},
        billingAddress: {},
        statusArray: [],
        productsAfterThisOrder: [],
        sum: Number,
        tax: Boolean,
        taxAmount: Number,
        discount: Number,
        discountAmount: Number,
        discountCode: String,
        description: String,
        agentIncome: Number,
        sellerIncome: Number,
        orderNumber: Number,
        state: {type: Number, default: 0},
        deliveryPrice: {type: Number, default: 0},
        link: String,
        status: {type: String, default: 'processing'},
        paymentStatus: {type: String, default: 'notpaid'},

        // kind: {type: String, default: 'post'},
        transaction: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
        customer: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
        agent: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},


        refunded: {
            type: 'Boolean',
            default: false
        },
        order_id: {
            type: 'string',
            default: crypto.randomBytes(64).toString('hex'),
            // unique: true
        },
        amount: {
            type: 'number',
            required: [true, 'Amount must be specified']
        },
        currency: {
            type: 'string',
            default: 'UZS'
        },
        created_at: {
            type: 'string',
            default: Date.now()
        },
        package: {
            type: [lineItemSchema],
            required: [true, 'Order must have a content']
        },
        paid: {
            type: 'boolean',
            default: false
        },
        payment_id: {
            type: 'string',
            default: crypto.randomBytes(64).toString('hex')
        },
        cancelled: {
            type: 'boolean',
            default: false
        }
    });
    return OrderSchema;
};
