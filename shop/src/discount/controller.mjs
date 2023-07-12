let self = ({
    setDiscount: function (req, res, next) {

        let Discount = req.mongoose.model('Discount');
        let Order = req.mongoose.model('Order');

        console.log('...setDiscount()', req.headers._id)
        let obj = {};
        obj["slug"] = req.params.id;
        Discount.findOne(obj,
            function (err, discount) {
                if (err || !discount) {
                    console.log('ddd', {
                        success: false,
                        err: err,
                        discount: discount,
                        obj: obj,
                        message: 'did not find any discount!'
                    })
                    return res.json({
                        success: false,
                        err: err,
                        obj: obj,
                        message: 'did not find any discount!'
                    });

                }
                if (discount.count < 1) {
                    return res.json({
                        success: false,
                        message: 'discount is done!'
                    });
                }
                if (!discount.customer) {
                    discount.customer = [];
                }

                if (discount.customer && discount.customer.length > 0) {

                    var isInArray = discount.customer.some(function (cus) {
                        return cus.equals(req.headers._id);
                    });
                    // || discount.customerLimit !== 0
                    if (isInArray) {

                        console.log('found it', req.headers._id)
                        // if (!discount.customerLimit || discount.customerLimit !== 0)
                        if (discount.customerLimit)
                            return res.json({
                                success: false,
                                message: 'you have used this discount once!'
                            });
                        // continueDiscount();
                        continueNotification();
                    } else {
                        // continueDiscount();
                        continueNotification();
                    }

                } else {
                    // continueDiscount();
                    continueNotification();
                }

                function continueNotification() {
                    return res.json(discount);

                }
                function continueDiscount() {

                    discount.customer.push(req.headers._id);
                    Order.findById(req.params.order_id, function (err, order) {
                        if (err || !order) {
                            return res.json({
                                success: false,
                                message: 'could not find order!',
                                err: err
                            });
                        }
                        let theDiscount = 0;
                        // return res.json(order);
                        if (discount.price) {
                            theDiscount = discount.price;

                        }
                        if (discount.percent) {
                            let x = (order.amount * 100) / discount.percent
                            theDiscount = x;

                        }
                        if (theDiscount < 0) {
                            theDiscount = 0;
                        }
                        Discount.findOneAndUpdate(obj, {
                                $set: {
                                    count: (discount.count - 1),
                                    customer: discount.customer

                                }
                            },
                            function (err, discount) {
                                if (err || !discount) {
                                    return res.json({
                                        success: false,
                                        message: 'could not update discount!'
                                    });
                                }
                                return res.json(discount);

                            });
                        // Order.findByIdAndUpdate(req.params.order_id, {
                        //         $set: {
                        //             discount: theDiscount,
                        //             discountCode: discount.slug,
                        //         }
                        //     },
                        //     function (err, order) {
                        //         if (err || !order) {
                        //             return res.json({
                        //                 success: false,
                        //                 message: 'could not update order!',
                        //                 err: err
                        //             });
                        //         }
                        //
                        //     });
                    });
                }
            });
    },

});
export default self;
//5022291079245120
//mehrabi
//22812142
//shayan behnam sani