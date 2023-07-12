import _ from 'lodash'

var self = ({
    create: function (req, res, next) {
        console.log('let create...')

        let Notification = req.mongoose.model('Notification');
        let Settings = req.mongoose.model('Settings');
        let Gateway = req.mongoose.model('Gateway');
        delete req.body._id
        if (!req.body.message) {
            return res.json({
                success: false,
                message: 'enter message!'
            });

        }
        let obj = {
            message: req.body.message
        }
        if (req.body.limit) {
            obj["limit"] = req.body.limit
        }
        if (req.body.customerGroup) {
            obj["customerGroup"] = req.body.customerGroup
        }
        if (req.body.source) {
            obj["source"] = req.body.source
        }
        if (req.body.offset) {
            obj["offset"] = req.body.offset
        }
        if (req.body.phoneNumber) {
            obj["phoneNumber"] = req.body.phoneNumber
        }
        Notification.create(obj, function (err, notification) {
            if (err || !notification) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            Settings.findOne({}, 'defaultSmsGateway', function (err, settings) {
                if (err || !settings || (settings && !settings.defaultSmsGateway)) {
                    //send with default gateway
                    return
                }

                if (settings && settings.defaultSmsGateway) {
                    //send with custom gateway
                    Gateway.findById(settings.defaultSmsGateway, function (err, gateway) {
                        if (err || !gateway || (gateway && !gateway.request)) {

                            //send with default gateway
                            return res.json({
                                err: err,
                                success: false,
                                gateway: gateway
                            })

                        }
                        // console.log('theReq', theReq)


                        if (req.body.phoneNumber && !req.body.source) {
                            let m = gateway.request;
                            if (req.body.message)
                                m = m.replaceAll("%message%", req.body.message);
                            if (req.body.phoneNumber)
                                m = m.replaceAll("%phoneNumber%", req.body.phoneNumber);
                            console.log('m:', m)

                            let theReq = JSON.parse(m);

                            req.httpRequest(theReq).then(function (parsedBody) {
                                // console.log('parsedBody', parsedBody)
                                // {
                                //     success: true,
                                //         data
                                // :
                                //     (parsedBody && parsedBody['data']) ? parsedBody['data'] : '',
                                // ...
                                // }
                                return res.json(
                                    notification
                                );

                            }).catch(e => res.json({e, requ: theReq}));
                        }
                        if (!req.body.phoneNumber && req.body.source) {
                            let Customer = req.mongoose.model('Customer');
                            // source: req.body.source
                            let d = 0
                            // console.log('req.body.offset',req.body.offset)
                            // return
                            console.log('from source:', req.body.source)
                            Customer.find({source: req.body.source}, function (err, customers) {
                                _.forEach(customers, function (customer, i) {
                                    let m = gateway.request;
                                    if (req.body.message)
                                        m = m.replaceAll("%message%", req.body.message);
                                    console.log('phoneNumber', customer.phoneNumber)
                                    if (customer.phoneNumber)
                                        m = m.replaceAll("%phoneNumber%", customer.phoneNumber);
                                    if (customer.firstName) {
                                        m = m.replaceAll("%firstName%", customer.firstName);
                                    }
                                    if (!customer.firstName) {
                                        m = m.replaceAll("%firstName%", "دوست");
                                    }

                                    console.log('m', m);
                                    let theReq = JSON.parse(m);

                                    req.httpRequest(theReq).then(function (parsedBody) {
                                        if (parsedBody && parsedBody['data'])
                                            console.log('parsedBody', parsedBody['data'])


                                    }).catch(e => {
                                        console.log('error', e)
                                        // res.json({e, requ: theReq})
                                    });
                                    // return res.json({
                                    //     success: true,
                                    //     // data: (parsedBody && parsedBody['data']) ? parsedBody['data'] : ''
                                    // });
                                })
                            }).skip(req.body.offset || 0).limit(req.body.limit || 1000)

                        }
                        if (!req.body.phoneNumber && !req.body.source) {
                            let Customer = req.mongoose.model('Customer');
                            // source: req.body.source
                            Customer.find({source: req.body.source}, function (err, customers) {
                                _.forEach(customers, function (customer, i) {
                                    let m = gateway.request;
                                    if (req.body.message)
                                        m = m.replaceAll("%message%", req.body.message);
                                    console.log('phoneNumber', customer.phoneNumber)
                                    if (customer.phoneNumber)
                                        m = m.replaceAll("%phoneNumber%", customer.phoneNumber);
                                    if (customer.firstName) {
                                        m = m.replaceAll("%firstName%", customer.firstName);
                                    }
                                    if (!customer.firstName) {
                                        m = m.replaceAll("%firstName%", "دوست");
                                    }

                                    console.log('m', m);
                                    // req.httpRequest(theReq).then(function (parsedBody) {
                                    //     console.log('parsedBody', parsedBody)
                                    //
                                    //     return res.json({
                                    //         success: true,
                                    //         data: (parsedBody && parsedBody['data']) ? parsedBody['data'] : ''
                                    //     });
                                    //
                                    // }).catch(e => res.json({e, requ: theReq}));
                                })
                            }).skip(0).limit(1000)

                        }


                    })
                } else {
                    return res.json({
                        success: false,
                        message: 'set default sms gateway!'
                    })
                }

            })
            // return 0;

        });
    },

});
export default self;