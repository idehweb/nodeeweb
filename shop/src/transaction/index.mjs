
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "transaction",
    "model": model,
    "modelName": "Transaction",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "Authority", "type": "string"},
                {"name": "RefID","type": "string"},
                {"name": "amount","type":"price"},
                {"name": "order","type":"object","keys":["orderNumber"]},
                {"name": "statusCode","type":"string"},
                {"name": "createdAt","type":"date"},
                {"name": "updatedAt","type":"date"}
            ]
        },
        "create": {
            "fields": [{"name": "title", "type": "string"},]
        },
        "edit": {
            "fields": [
                {"name": "statusCode", "type": "string"},
                {"name": "amount", "type": "string"},
                {"name": "Authority", "type": "string"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
            ]
        },
    },
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "events": [{
        "name": "update-transaction-by-customer"
    }],
    "req": {
        "updateTransaction": (req, res, next,transactionObject,orderObject={},transactionFind={"Authority": req.body.iN + req.body.iD}) => {
            console.log('let us update_transaction req');
            let Transaction = req.mongoose.model('Transaction');
            let Order = req.mongoose.model('Order');
            let Product = req.mongoose.model('Product');
            console.log('transactionObject', transactionObject);
            Transaction.findOneAndUpdate(transactionFind, {
                $set: transactionObject

            },{new:true}, function (err, transaction) {
                if (err || !transaction) {
                    return res.json({
                        success: false,
                        message: "transaction could not be found",
                        err: err
                    })
                }

                console.log('orderObject', orderObject, transaction.order)
                Order.findByIdAndUpdate(transaction.order, {
                    $set: orderObject
                }, function (order_err, updated_order) {
                    if (order_err || !updated_order) {
                        return res.json({
                            order_err: order_err,
                            updated_order: updated_order,
                            success: false
                        })
                    }
                    if(updated_order.productsAfterThisOrder){
                        let productsAfterThisOrder = updated_order.productsAfterThisOrder;
                        // tempProducts.forEach()
                        productsAfterThisOrder.forEach((tempProduct) => {
                            // console.log('\ntempProduct', {
                            //     in_stock: tempProduct.in_stock,
                            //     quantity: tempProduct.quantity,
                            //     combinations: tempProduct.combinations,
                            // })

                            Product.findByIdAndUpdate(tempProduct._id, {
                                $set: {
                                    in_stock: tempProduct.in_stock,
                                    quantity: tempProduct.quantity,
                                    combinations: tempProduct.combinations,
                                }
                            }, function (err, resp) {
                                console.log('resp', resp._id)
                            })
                        })

                    }
                    console.log('end of buy...');

                    req.fireEvent('update-transaction-by-customer', {...transaction,orderNumber: updated_order.orderNumber,customer_data: updated_order.customer_data});

                    let respon = {
                        success: transactionObject['status'],
                        orderNumber: updated_order.orderNumber
                    }

                    return res.json(respon);
                })
            }).lean();
        }
    },

}