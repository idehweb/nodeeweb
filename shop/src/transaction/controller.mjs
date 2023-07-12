// import Transaction from "#models/transaction";
// import Order from "#models/order";
// import Customer from "#models/customer";
// import Link from "#models/link";
// //const rp from "request-promise";
// import request from "#root/request";
//
// import global from "#root/global";
// import CONFIG from "#c/config";
import stringMath from 'string-math';
import crypto from 'crypto';

var self = ({
    all: function (req, res, next) {
        let LIMIT=1000000000

        let Transaction = req.mongoose.model('Transaction');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.query.order) {
            search['order'] = req.query.order
        }
        if (req.query.customer) {
            search['order'] = req.query.customer
        }
        Transaction.find(search, function (err, transactions) {
            if (err || !transactions) {
                console.log('err', err);
                res.json([]);
                return 0;
            }
            // let thelength = orders.length, p = 0;
            // console.log('orders', orders);
            // delete search['$or'];
            Transaction.countDocuments(search, function (err, count) {
                console.log('countDocuments', count, err);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    'X-Total-Count',
                    count,
                );
                return res.json(transactions);


            });

        }).populate("order", "_id orderNumber").skip(offset).sort({
            createdAt: -1,
            updatedAt: -1,
            _id: -1,

        }).limit(parseInt(req.params.limit));
    },
    allWTransactions: function (req, res, next) {
        let Transaction = req.mongoose.model('Transaction');

        // console.log('allWOrders');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search['customer'] = req.headers._id;
        // search['status']='published';
        console.log('get trabnsactions search', search)
        Transaction.find(search,  function (err, transactions) {
            if (err || !transactions) {
                res.json([]);
                return 0;
            }

            Transaction.countDocuments(search, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    'X-Total-Count',
                    count,
                );


                // transactions.map(resource => ({ ...resource, id: resource._id }))
                res.json(transactions);
                return 0;


            });

        }).populate('customer', 'nickname photos').populate('order', 'orderNumber _id amount').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit)).lean();
    },

    myTransaction: function (req, res, next) {
        let Transaction = req.mongoose.model('Transaction');

        // console.log('hgfgh');
        let obj = {
            _id: req.params.id,
            customer: req.headers._id.toString(),
        }
        // console.log('obj', obj)
        Transaction.findOne(obj,
            function (err, order) {
                if (err || !order) {
                    res.json({
                        success: false,
                        message: 'error!',
                    });
                    return 0;
                }

                return res.json(order);

            }).populate('customer', 'nickname phoneNumber firstName lastName').populate('transaction', 'Authority amount statusCode status');
    },

    buy: function (req, res, next) {
        let LIMIT=1000000000

        let Order = req.mongoose.model('Order');
        let Product = req.mongoose.model('Product');
        let Transaction = req.mongoose.model('Transaction');
        let Gateway = req.mongoose.model('Gateway');
        let Settings = req.mongoose.model('Settings');
        let Customer = req.mongoose.model('Customer');

        console.log("buy...", req.params._id, req.params._price);
        if (req.params._price && (req.params._price == null || req.params._price == "null"))
            return res.json({
                success: false,
                message: "req.params._price"
            });
        Settings.findOne({},"currency", function (err, setting) {
// let currency
            if (req.body.method)
                Gateway.findOne({slug: req.body.method}, function (err, gateway) {
                    if (!gateway || !gateway.request) {
                        return res.json({
                            success: false,
                            slug: req.body.method,
                            // gateway: gateway,
                            message: "gateway request not found"
                        })
                    }


                    Order.findById(req.params._id, "sum , orderNumber , amount , discount , customer",
                        function (err, order) {
                            if (err || !order) {
                                res.json({
                                    success: false,
                                    message: "error!"
                                });
                                return 0;
                            }

                            // obj[]=;
// console.log(order.amount/);
//                 return;
                            let mn=1;
                            if(setting.currency){
                                if(setting.currency=='toman'){
                                    mn=10
                                }
                            }
                            let amount = parseInt(order.amount) * mn;
                            if (req.params._price) {
                                amount = parseInt(req.params._price) * mn;
                            }
                            if (order.discount) {
                                amount = amount - (order.discount * mn);
                            }
                            if (amount < 0) {
                                amount = 0;
                            }
                            if (amount > 500000000) {
                                return res.json({
                                    success: false,
                                    message: "price is more than 50,000,000T"
                                });
                            }
                            //check if we have method or not,
                            // for both we have to create transaction
                            //    if we have method, submit method too
                            console.log('order.orderNumber', order.orderNumber)
                            gateway.request = gateway.request.replaceAll("%domain%", process.env.BASE_URL);


                            gateway.request = gateway.request.replaceAll("%amount%", order.amount);


                            gateway.request = gateway.request.split("%orderNumber%").join(order.orderNumber);
                            // gateway.request = gateway.request.replace("%orderNumber%", order.orderNumber);
                            gateway.request = gateway.request.replaceAll("%orderId%", order._id);
                            console.log('gateway.request', gateway.request);
                            if (!JSON.parse(gateway.request))
                                return res.json({
                                    success: false,
                                    gateway: JSON.parse(gateway.request),
                                    message: "gateway request not found"
                                })
                            // let sendrequest=
                            var theReq = JSON.parse(gateway.request);
                            console.log('theReq[\'amount\']', theReq['data'])

                            if (theReq['data'] && theReq['data']['Amount'])
                                theReq['data']['Amount'] = stringMath(theReq['data']['Amount'].toString())

                            if (theReq['data'] && theReq['data']['amount'])
                                theReq['data']['amount'] = stringMath(theReq['data']['amount'].toString())

                            if (theReq['body'] && theReq['body']['Amount'])
                                theReq['body']['Amount'] = stringMath(theReq['body']['Amount'].toString())

                            if (theReq['body'] && theReq['body']['amount'])
                                theReq['body']['amount'] = stringMath(theReq['body']['amount'].toString())
                            console.log('gateway.request', theReq)

                            // return;
                            req.httpRequest(theReq).then(function (parsedBody) {
                                if(setting.currency){
                                    if(setting.currency=='toman'){
                                        mn=10
                                    }
                                }
                                let obj = {
                                    "amount": parseInt(amount/mn),
                                    "method": req.body.method,
                                    "order": req.params._id,
                                    "gatewayResponse": JSON.stringify(parsedBody["data"]),
                                    "Authority": parsedBody["data"]["trackId"] || parsedBody["data"]["Authority"]
                                };
                                if (req.headers && req.headers.customer && req.headers.customer._id) {
                                    obj["customer"] = req.headers.customer._id;
                                }
                                // return res.json({
                                //     ...obj, gateway: JSON.parse(gateway.request),
                                // });
                                let notif = "paying ";
                                if (order.amount) {
                                    notif += order.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                notif += "\nfor order: " + order.orderNumber;
                                if (order.customer.phoneNumber)
                                    notif += "\nphoneNumber:" + order.customer.phoneNumber;
                                if (order.customer.firstName)
                                    notif += "\nname:" + order.customer.firstName;
                                if (order.customer.lastName)
                                    notif += " " + order.customer.lastName + "\n";

                                // console.log('notif',notif);
                                // req.publishToTelegram(notif)
                                // return;
                                if(req.headers.token){
                                    console.log('token found',req.headers.token);

                                    Customer.findOne({
                                        "tokens.token":req.headers.token
                                    },'_id',function(err,customer){
                                        console.log('customer',customer)
                                        console.log('err',err)
                                        if(err){
                                            console.log('customer is not logged in')
                                            createTransaction()
                                        }

                                        if(customer && customer._id){
                                            console.log('customer is logged in')

                                            console.log('customer._id',customer._id)
                                            obj['customer']=customer._id
                                            createTransaction()
                                        }
                                    })
                                }else{
                                    console.log('token not found');

                                    createTransaction()

                                }
                                function createTransaction(){
                                    Transaction.create(obj, function (err, transaction) {
                                        if (err || !transaction) {
                                            return res.json({
                                                success: false,
                                                message: "transaction could not be created",
                                                err: err
                                            })
                                        }
                                        req.fireEvent('create-transaction-by-customer', transaction);

                                        Order.findByIdAndUpdate(req.params._id, {
                                            $push: {
                                                transaction: transaction._id
                                            }
                                        }, function (order_err, updated_order) {
                                            console.log('end of buy...');
                                            if (parsedBody['data'] && parsedBody['data']['url']) {
                                                return res.json({
                                                    success: true,
                                                    url: parsedBody['data']['url']
                                                });
                                            }
                                            if (parsedBody['data'] && parsedBody['data'].trackId) {

                                                return res.json({
                                                    success: true,
                                                    // data: parsedBody['data'],
                                                    // request: JSON.parse(gateway.request),
                                                    url: "https://gateway.zibal.ir/start/" + parsedBody['data'].trackId
                                                });
                                            } else {
                                                return res.json({
                                                    success: false,
                                                    // data: parsedBody['data'],
                                                    // request: JSON.parse(gateway.request),
                                                    parsedBody: parsedBody['data']
                                                });
                                            }
                                        });
                                    });

                                }

                            }).catch(e => {
                                // req.publishToTelegram('error creating transaction! please check...' + "\nfor order:" + order.orderNumber + "\namount:" + order.amount)

                                res.json({e, requ: theReq})

                            })


                        }).populate("customer", "_id phoneNumber firstName lastName");
                })
            else {
                return res.json({
                    success: false,
                    message: "you have no gateway"
                })
            }
        });
        // req.global.getSetting("ZIBAL_TOKEN").then((merchant) => {
        //     console.log('merchant', merchant)

        // }).catch(e => res.json(e))
    },
    create: function (req, res, next) {
        let LIMIT=1000000000

        console.log('creating transaction by admin...');
        // req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);

        let Order = req.mongoose.model('Order');
        let Product = req.mongoose.model('Product');
        let Transaction = req.mongoose.model('Transaction');
        let Gateway = req.mongoose.model('Gateway');
        let Settings = req.mongoose.model('Settings');

        console.log("buy...", req.params._id, req.body.amount);
        if (req.body.amount && (req.body.amount == null || req.body.amount == "null"))
            return res.json({
                success: false,
                message: "req.body.amount"
            });
        if (req.body.method)
            Gateway.findOne({slug: req.body.method}, function (err, gateway) {
                if (!gateway || !gateway.request) {
                    return res.json({
                        success: false,
                        slug: req.body.method,
                        // gateway: gateway,
                        message: "gateway request not found"
                    })
                }
                req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);

                let obj = {
                    order_id: crypto.randomBytes(64).toString('hex'),
                    amount: req.body.amount ? req.body.amount : amount,
                    total: req.body.amount ? req.body.amount : amount,
                    orderNumber: req.body.orderNumber,
                    sum: req.body.amount ? req.body.amount : amount,
                    status: req.body.status || 'checkout'
                }
                Order.create(obj,
                    function (err, order) {
                        if (err || !order) {
                            res.json({
                                success: false,
                                message: "error!"
                            });
                            return 0;
                        }

                        // obj[]=;
// console.log(order.amount/);
//                 return;
                        let amount = parseInt(order.amount) * 10;
                        if (req.body.amount) {
                            amount = parseInt(req.body.amount) * 10;
                        }
                        if (order.discount) {
                            amount = amount - (order.discount * 10);
                        }
                        if (amount < 0) {
                            amount = 0;
                        }
                        if (amount > LIMIT) {
                            return res.json({
                                success: false,
                                message: "price is more than 50,000,000T"
                            });
                        }
                        //check if we have method or not,
                        // for both we have to create transaction
                        //    if we have method, submit method too
                        console.log('order.orderNumber', order.orderNumber)
                        gateway.request = gateway.request.replaceAll("%domain%", process.env.BASE_URL);


                        gateway.request = gateway.request.replaceAll("%amount%", order.amount);


                        gateway.request = gateway.request.split("%orderNumber%").join(order.orderNumber);
                        // gateway.request = gateway.request.replace("%orderNumber%", order.orderNumber);
                        gateway.request = gateway.request.replaceAll("%orderId%", order._id);
                        console.log('gateway.request', gateway.request);
                        if (!JSON.parse(gateway.request))
                            return res.json({
                                success: false,
                                gateway: JSON.parse(gateway.request),
                                message: "gateway request not found"
                            })
                        // let sendrequest=
                        var theReq = JSON.parse(gateway.request);
                        console.log('theReq[\'amount\']', theReq['data'])

                        if (theReq['data'] && theReq['data']['Amount'])
                            theReq['data']['Amount'] = stringMath(theReq['data']['Amount'].toString())

                        if (theReq['data'] && theReq['data']['amount'])
                            theReq['data']['amount'] = stringMath(theReq['data']['amount'].toString())

                        if (theReq['body'] && theReq['body']['Amount'])
                            theReq['body']['Amount'] = stringMath(theReq['body']['Amount'].toString())

                        if (theReq['body'] && theReq['body']['amount'])
                            theReq['body']['amount'] = stringMath(theReq['body']['amount'].toString())
                        console.log('gateway.request', theReq)

                        // return;
                        req.httpRequest(theReq).then(function (parsedBody) {

                            let obj = {
                                "amount": amount,
                                "method": req.body.method,
                                "order": order._id,
                                "gatewayResponse": JSON.stringify(parsedBody["data"]),
                                "Authority": parsedBody["data"]["trackId"]
                            };
                            if (req.headers && req.headers.customer && req.headers.customer._id) {
                                obj["customer"] = req.headers.customer._id;
                            }
                            // return res.json({
                            //     ...obj, gateway: JSON.parse(gateway.request),
                            // });
                            Transaction.create(obj, function (err, transaction) {
                                if (err || !transaction) {
                                    return res.json({
                                        success: false,
                                        message: "transaction could not be created",
                                        err: err
                                    })
                                }
                                Order.findByIdAndUpdate(req.params._id, {
                                    $push: {
                                        transaction: transaction._id
                                    }
                                }, function (order_err, updated_order) {
                                    console.log('end of buy...');
                                    if (parsedBody['data'] && parsedBody['data']['url']) {
                                        return res.json({
                                            success: true,
                                            url: parsedBody['data']['url']
                                        });
                                    }
                                    if (parsedBody['data'] && parsedBody['data'].trackId) {

                                        return res.json({
                                            success: true,
                                            // data: parsedBody['data'],
                                            // request: JSON.parse(gateway.request),
                                            url: "https://gateway.zibal.ir/start/" + parsedBody['data'].trackId
                                        });
                                    } else {
                                        return res.json({
                                            success: false,
                                            // data: parsedBody['data'],
                                            // request: JSON.parse(gateway.request),
                                            parsedBody: parsedBody['data']
                                        });
                                    }
                                });
                            });

                        }).catch(e => res.json({e, requ: theReq}))


                    });
            })
        else {
            return res.json({
                success: false,
                message: "you have no gateway"
            })
        }

    },
    status: function (req, res, next) {
        let Order = req.mongoose.model('Order');
        let Product = req.mongoose.model('Product');
        let Transaction = req.mongoose.model('Transaction');
        // return new Promise(function (resolve) {
        // console.log("\n\n\n\n\n Srtatus DDDD");
        if (!req.body.Authority) {
            return res.json({
                success: false,
                message: "error!",

                trackId: null
            });
            return 0;

        }
        req.global.getSetting("ZIBAL_TOKEN").then((merchant) => {

            Transaction.findOne({Authority: req.body.Authority}, function (
                err,
                transaction
            ) {
                if (err || !transaction) {
                    return res.json({
                        success: false,
                        message: "error!",
                        err: err,
                        trackId: req.body.Authority
                    });
                    return 0;

                }
                // console.log('transaction',transaction);
                if (transaction == null || !transaction.amount) {
                    return res.json({
                        success: false,
                        message: "error!",
                        amount: null
                    });
                    return 0;
                }
                let options = {
                    method: "POST",
                    url:
                        "https://gateway.zibal.ir/v1/verify",
                    body: {
                        merchant: merchant,
                        trackId: req.body.Authority
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                // console.log(options);
                // rp(options)
                //     .then(function (parsedBody) {
                request(options, function (error, response, parsedBody) {

                        console.log("gateway.zibal:", parsedBody);

                        if (parsedBody.result == 100) {

                            Transaction.findByIdAndUpdate(
                                transaction._id,
                                {
                                    RefID: parsedBody.refNumber,
                                    statusCode: parsedBody.result,
                                    status: true,
                                    updatedAt: new Date()
                                },
                                {new: true},
                                function (err, transaction) {
                                    if (err || !transaction) {
                                        // console.log('rfv', err);
                                        return res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    let qc = 0;
                                    let obj = {}, ovj = {};
                                    ovj["paymentStatus"] = "paid";
                                    ovj["updatedAt"] = new Date();

                                    // console.log('ovj', ovj, o._id);

                                    Order.findByIdAndUpdate(
                                        transaction.order,
                                        ovj,
                                        {new: true},
                                        function (err, order) {
                                            if (err || !order) {
                                                return res.json({
                                                    success: false,
                                                    message: "error!",
                                                    err: err
                                                });
                                            }
                                            console.log('order', order);
                                            let $text = "";
                                            if (order) {
                                                $text = "customer payed: " + order.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Toman" + "\n" + "order number: # " + order.orderNumber + "\n" + process.env.ADMIN_URL + "/#/order/" + order._id + "\n";
                                                $text += "customer phone number: " + order.customer.phoneNumber;
                                            }
                                            // req.global.sendSms('9120539945', $text,'300088103373');
                                            let ttt = "";
                                            if (order && order.customer && (order.customer.firstName && order.customer.lastName)) {
                                                ttt = order.customer.firstName + " " + order.customer.lastName;
                                            }

                                            // req.global.sendSms("9024252801", $text, "300088103373");
                                            let objd = {};
                                            let $tz = $text + "\n";
                                            objd.message = $tz;


                                            //let $text_c = ttt + " عزیز" + "\n" + "سفارش شما با موفقیت ثبت شد و در دست بررسی است، شماره سفارش:" + order.orderNumber + "\n" + "لینک سفارشات:" + "\n" + "http://localhost:3001/my-account/" + "\n" + "آروند، یک گارانتی دوست داشتنی!";
                                            if (order)
                                                req.global.sendSms(order.customer.phoneNumber, [
                                                    {
                                                        key: "customer",
                                                        value: ttt
                                                    },
                                                    {
                                                        key: "orderNumber",
                                                        value: order.orderNumber
                                                    },
                                                    {
                                                        key: "myOrdersLink",
                                                        value: process.env.SHOP_URL + "/my-account/"
                                                    }], "300088103373", null, "98", "sms_submitOrderSuccessPaying");
                                            req.fireEvent('create-transaction-by-customer', order);

                                            // req.publishToTelegram(objd);

                                            // console.log('order.deliveryDay', order.deliveryDay);
                                            if (order.deliveryDay && order.deliveryDay.theid == "chapar") {
                                                let sumTitles = "", theTotal = 0;
                                                order.package.map((car) => {
                                                    sumTitles += car.product_name + " ,";
                                                    theTotal += car.total_price;
                                                });
                                                let ddd = new Date();

                                                let string = "{\"user\": {\"username\": \"" + process.env.CHAPAR_USERNAME + "\",\"password\": \"" + process.env.CHAPAR_USERNAME + "\"},\"bulk\": [{\"cn\": {\"reference\": " + order.orderNumber + ",\"date\": \"" + ddd.getUTCFullYear() + "-" + ddd.getMonth() + "-" + ddd.getUTCDate() + "\",\"assinged_pieces\": \"" + order.card.length + "\",\"service\": \"1\",\"value\": \"" + theTotal + "\",\"payment_term\": 0,\"weight\": \"1\",\"content\":\"" + sumTitles + "\",\"change_state_url\":\"\"},\"sender\": {\"person\": \"حسین محمدی\",\"company\": \"شرکت گارانتی آروند\",\"city_no\": \"10866\",\"telephone\": \"+982142528000\",\"mobile\": \"989024252802\",\"email\": \"info@localhost:3001\",\"address\": \"تهران، کاووسیه، بلوار میرداماد، پلاک ۴۹۶، مجتمع پایتخت، بلوک A، طبقه ۹، واحد ۹۰۱\",\"postcode\": \"1969763743\"},\"receiver\": {\"person\": \"" + (order.customer.firstName + " " + order.customer.lastName) + "\",\"company\": \"\",\"city_no\": \"" + order.billingAddress.City_no + "\",\"telephone\": \"" + order.billingAddress.PhoneNumber + "\",\"mobile\": \"" + order.customer.phoneNumber + "\",\"email\": \"test@test.com\",\"address\": \"" + (order.billingAddress.State + " " + order.billingAddress.City + " " + order.billingAddress.StreetAddress) + "\",\"postcode\": \"" + order.billingAddress.PostalCode + "\"}}]}";

                                                var options = {
                                                    method: "POST",
                                                    url: "https://app.krch.ir/v1/bulk_import",
                                                    headers: {"content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"},
                                                    //   formData: {input: '{\n\t"user": {\n\t\t"username": "vira.tejarat",\n\t\t"password": "42528000"\n\t},\n\t"bulk": [{\n\t\t"cn": {\n\t\t\t"reference": '+order.orderNumber+',\n\t\t\t"date": "'+new Date()+'",\n\t\t\t"assinged_pieces": "'+order.card.length+'",\n\t\t\t"service": "1",\n\t\t\t"value": "'+theTotal+'",\n\t\t\t"payment_term": 0,\n\t\t\t"weight": "1",\n                       "content":"'+sumTitles+'",\n                       "change_state_url":"'+"http://localhost:3001/customer/order/peyk/" + order._id+'"\n\t\t},\n\t\t"sender": {\n\t\t\t"person": "حسین محمدی",\n\t\t\t"company": "شرکت گارانتی آروند",\n\t\t\t"city_no": "10866",\n\t\t\t"telephone": "+982142528000",\n\t\t\t"mobile": "989024252802",\n\t\t\t"email": "info@localhost:3001",\n\t\t\t"address": "تهران، کاووسیه، بلوار میرداماد، پلاک ۴۹۶، مجتمع پایتخت، بلوک A، طبقه ۹، واحد ۹۰۱",\n\t\t\t"postcode": "1969763743"\n\t\t},\n\t\t"receiver": {\n\t\t\t"person": "'+(order.customer.firstName + ' ' + order.customer.lastName)+'",\n\t\t\t"company": "",\n\t\t\t"city_no": "'+order.billingAddress.City_no+'",\n\t\t\t"telephone": "'+order.billingAddress.PhoneNumber+'",\n\t\t\t"mobile": "'+order.customer.phoneNumber+'",\n\t\t\t"email": "test@test.com",\n\t\t\t"address": "'+(order.billingAddress.State + ' ' + order.billingAddress.City + ' ' + order.billingAddress.StreetAddress)+'",\n\t\t\t"postcode": "'+order.billingAddress.PostalCode+'"\n\t\t}\n\t}]\n}'}
                                                    formData: {input: string}
                                                };

                                                request(options, function (error, response, body) {
                                                    if (error) throw new Error(error);
                                                    console.log("chaparBody:", body);
                                                    if (body && body.result && body.objects && body.objects.result && body.objects.result[0]) {

                                                    }

                                                    // res.json(body);
                                                });

                                            }
                                            return res.json({
                                                success: true,
                                                transaction: transaction,
                                                order: order
                                            });

                                        }).populate("customer", "_id firstName lastName phoneNumber");
                                });
                        }
                        else {
                            Transaction.findByIdAndUpdate(
                                transaction._id,
                                {
                                    statusCode: req.body.Status,
                                    status: (req.body.Status == 1 || req.body.Status == 2) ? true : false,
                                    updatedAt: new Date()
                                },
                                function (err, transaction) {
                                    if (err || !transaction) {
                                        // console.log('rfv', err);
                                        return res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                        return 0;
                                    }

                                });
                            Order.findByIdAndUpdate(
                                transaction.order,
                                {
                                    // statusCode: parsedBody.Status,
                                    paymentStatus: "unsuccessful",
                                    updatedAt: new Date()
                                },
                                {new: true},
                                function (err, order) {
                                    if (err || !order) {
                                        return res.json({
                                            success: false,
                                            message: "error!",
                                            err: err
                                        });
                                    }
                                    return res.json({
                                        success: false,
                                        err: err,
                                        parsedBody: parsedBody,
                                        status: req.body.status,
                                        "transaction.order": transaction.order,
                                        "transaction._id": transaction._id,
                                        "parsedBody.success": req.body.Status

                                    });
                                });

                        }
                        return;
                    }
                )
                    .catch(function (err) {
                        // console.log("err:", err);
                        res.json({
                            success: true,
                            message: "مشکل در  verify"
                        });
                        return;
                    });

            });
        });
    },

    verify: function (req, res, next) {
        let Order = req.mongoose.model('Order');
        let Product = req.mongoose.model('Product');
        let Transaction = req.mongoose.model('Transaction');
        let Customer = req.mongoose.model('Customer');
        Transaction.findOne({Authority: req.params.bank_token}, function (
            err,
            transaction
        ) {

            if (err || !transaction) {
                res.json({
                    success: false,
                    message: "error!",
                    err: err,
                    Authority: req.body.token
                });
                return;
            }

            Transaction.findByIdAndUpdate(
                transaction._id,
                {
                    RefID: req.body.RefNo,
                    statusCode: req.body.ResCod,
                    updatedAt: new Date()
                },
                {new: true},
                function (err, transaction) {
                    if (err || !transaction) {
                        res.json({
                            success: false,
                            message: "error!",
                            err: err
                        });
                    }
                    let qc = 0;
                    let obj = {};

                    if (transaction.order_obj) {
                        if (transaction.order_obj.questionCount) {
                            qc = transaction.order_obj.questionCount;
                        }
                        if (
                            transaction.order_obj.goldScore ||
                            transaction.order_obj.silverScore
                        ) {
                            obj = transaction.order_obj;
                        }
                    }
                    Customer.findByIdAndUpdate(
                        transaction.customer_obj._id,
                        {
                            $inc: {question_credit: +qc},
                            $push: {pocket: obj},
                            updatedAt: new Date()
                        },
                        {new: true},
                        function (err, customer) {
                            if (err || !customer) {
                                res.json({
                                    success: false,
                                    err: err,
                                    message: "user updated wrong"
                                });
                                return;
                            }
                            tttl = "پرداخت موفق";
                            tttx = "پکیج به حساب شما اضافه شد.";

                            res.json({
                                success: true,
                                RefID: req.body.RefNo,
                                transaction: transaction._id,
                                Status: req.body.ResCod,
                                customer_obj: transaction.customer_obj,
                                order_obj: transaction.order_obj
                            });

                        }
                    );
                }
            );
        });
    }
});
export default self;