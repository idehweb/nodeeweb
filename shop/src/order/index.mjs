import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "order",
    "model": model,
    "modelName": 'Order',
    "routes": routes,
    "access":"admin",
    "admin": {
        "list": {
            "header":[
                {"name":"orderNumber","type":"number"},
                {"name":"customer_data","type":"object","keys":["firstName","lastName","phoneNumber"]},
                {"name":"sum","type":"price"},
                {"name":"amount","type":"price"},
                {"name":"status","type":"number"},
                {"name":"paymentStatus","type":"number"},
                {"name":"createdAt","type":"date"},
                {"name":"updatedAt","type":"date"},
                {"name":"actions","type":"actions","edit":true},

            ]
        },
        "create": {
            "fields":[{"name":"title"},]
        },

    },
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "events": [{
        "name": "create-order-by-customer"
    }],

}