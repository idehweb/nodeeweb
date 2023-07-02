// import _ from 'lodash'
// Tip! Initialize this property in your payment service constructor method!

let json = {};
export { json };

export default (props) => {
  function getReport({ mongoose, global }, text = "") {
    console.log("getReport====>");

    return new Promise(function (resolve, reject) {
      const previousDay = new Date();
      previousDay.setDate(previousDay.getDate() - 1);
      // previousDay.setHours(0);
      // previousDay.setMinutes(0);
      let message = "";
      if (previousDay) text = text.replaceAll("%date%", previousDay);
      else text = text.replaceAll("%date%", "");

      message += "date:" + previousDay;
      let Customer = mongoose.model("Customer");
      let Order = mongoose.model("Order");
      let Post = mongoose.model("Post");
      let Product = mongoose.model("Product");
      let Action = mongoose.model("Action");
      let Notification = mongoose.model("Notification");
      let Settings = mongoose.model("Settings");
      let search = { createdAt: { $gte: previousDay } };
      search["status"] = {
        $nin: ["cart", "checkout", "trash", ""],
      };
      search["paymentStatus"] = "paid";
      // Order.find({ company:companyID }).exec()
      Order.find(
        search,
        "_id , orderNumber , customer , sum , amount , paymentStatus , status , createdAt",
        function (err, orders) {
          if (err || !orders) {
            message += "\norder count:" + 0;
            text = text.replaceAll("%orderCount%", 0);
          }
          // console.log('orders', orders)
          if (orders) {
            let amount = 0;
            orders.forEach((item) => {
              amount += item.amount;
            });

            message += "\norder count:" + orders.length;
            text = text.replaceAll("%orderCount%", orders.length);

            message += "\norder amount count:" + amount;
            let currency = "";

            text = text.replaceAll(
              "%orderAmount%",
              amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                " " +
                currency
            );
          }

          Customer.find(
            { createdAt: { $gte: previousDay } },
            "_id , createdAt",
            function (err, customers) {
              if (err || !customers) {
                message += "\ncustomer count:" + 0;
                text = text.replaceAll("%newCustomerCount%", 0);
              }
              if (customers) {
                message += "\ncustomer count:" + customers.length;
                text = text.replaceAll("%newCustomerCount%", customers.length);
              }
              Action.find(
                {
                  createdAt: { $gte: previousDay },
                  product: {
                    $ne: null,
                  },
                  title: {
                    $exists: true,
                    $regex: "edit product",
                    $options: "i",
                  },
                },
                "_id , createdAt",
                function (err, actions) {
                  if (err || !actions) {
                    message += "\nactions on products count:" + 0;

                    text = text.replaceAll("%productsEditCount%", 0);
                  }
                  if (actions) {
                    message += "\nactions on products count:" + actions.length;
                    text = text.replaceAll(
                      "%productsEditCount%",
                      actions.length
                    );
                  }
                  Notification.find(
                    { createdAt: { $gte: previousDay } },
                    "_id , createdAt",
                    function (err, notifications) {
                      if (err || !notifications) {
                        message += "\nnotifications count:" + 0;
                        text = text.replaceAll("%smsCount%", 0);
                      }
                      if (notifications) {
                        message +=
                          "\nnotifications count:" + notifications.length;
                        text = text.replaceAll(
                          "%smsCount%",
                          notifications.length
                        );
                      }
                      Post.find(
                        { createdAt: { $gte: previousDay } },
                        "_id , createdAt",
                        function (err, posts) {
                          if (err || !posts) {
                            message += "\nposts count:" + 0;
                            text = text.replaceAll("%newPostsCount%", 0);
                          }
                          if (posts) {
                            message += "\nposts count:" + posts.length;
                            text = text.replaceAll(
                              "%newPostsCount%",
                              posts.length
                            );
                          }
                          Product.find(
                            { createdAt: { $gte: previousDay } },
                            "_id , createdAt",
                            function (err, products) {
                              if (err || !products) {
                                message += "\nproducts count:" + 0;
                                text = text.replaceAll("%newProductsCount%", 0);
                              }
                              if (products) {
                                message +=
                                  "\nproducts count:" + products.length;
                                text = text.replaceAll(
                                  "%newProductsCount%",
                                  products.length
                                );
                              }
                              Action.find(
                                {
                                  createdAt: { $gte: previousDay },
                                  post: {
                                    $ne: null,
                                  },
                                  title: {
                                    $exists: true,
                                    $regex: "edit post",
                                    $options: "i",
                                  },
                                },
                                "_id , createdAt",
                                function (err, actions) {
                                  if (err || !actions) {
                                    message +=
                                      "\nedit actions on posts count:" + 0;

                                    text = text.replaceAll(
                                      "%postsEditCount%",
                                      0
                                    );
                                  }
                                  if (actions) {
                                    message +=
                                      "\nedit actions on posts count:" +
                                      actions.length;
                                    text = text.replaceAll(
                                      "%postsEditCount%",
                                      actions.length
                                    );
                                  }
                                  Settings.findOne(
                                    {},
                                    "siteActive",
                                    function (err, settings) {
                                      if (err || !settings) {
                                        message += "\nsite is disable!";

                                        text = text.replaceAll(
                                          "%siteActivation%",
                                          "deactive"
                                        );
                                      }
                                      if (!settings || !settings.siteActive) {
                                        message += "\nsite is disable!";

                                        text = text.replaceAll(
                                          "%siteActivation%",
                                          "Deactive"
                                        );
                                      }
                                      if (settings && settings.siteActive) {
                                        message += "\nsite is enable!";

                                        text = text.replaceAll(
                                          "%siteActivation%",
                                          "Active"
                                        );
                                      }
                                      console.log("text", text);
                                      resolve(text || message);
                                    }
                                  )
                                    .skip(0)
                                    .sort({
                                      createdAt: -1,
                                      updatedAt: -1,
                                      _id: -1,
                                    })
                                    .limit(1000)
                                    .lean();
                                }
                              )
                                .skip(0)
                                .sort({
                                  createdAt: -1,
                                  updatedAt: -1,
                                  _id: -1,
                                })
                                .limit(1000)
                                .lean();
                            }
                          )
                            .skip(0)
                            .sort({
                              createdAt: -1,
                              updatedAt: -1,
                              _id: -1,
                            })
                            .limit(1000)
                            .lean();
                        }
                      )
                        .skip(0)
                        .sort({
                          createdAt: -1,
                          updatedAt: -1,
                          _id: -1,
                        })
                        .limit(1000)
                        .lean();
                    }
                  )
                    .skip(0)
                    .sort({
                      createdAt: -1,
                      updatedAt: -1,
                      _id: -1,
                    })
                    .limit(1000)
                    .lean();
                }
              )
                .skip(0)
                .sort({
                  createdAt: -1,
                  updatedAt: -1,
                  _id: -1,
                })
                .limit(10000)
                .lean();
            }
          )
            .skip(0)
            .sort({
              createdAt: -1,
              updatedAt: -1,
              _id: -1,
            })
            .limit(1000)
            .lean();
        }
      )
        .skip(0)
        .sort({
          createdAt: -1,
          updatedAt: -1,
          _id: -1,
        })
        .limit(1000)
        .lean();
    });
  }

  function publishToSms(req, phoneNumber, message) {
    let Settings = req.mongoose.model("Settings");
    let Gateway = req.mongoose.model("Gateway");
    return new Promise(function (resolve, reject) {
      console.log("publishToSms====>", message);
      Settings.findOne({}, "defaultSmsGateway", function (err, settings) {
        if (err || !settings || (settings && !settings.defaultSmsGateway)) {
          //send with default gateway
          return;
        }

        if (settings && settings.defaultSmsGateway) {
          //send with custom gateway
          Gateway.findById(settings.defaultSmsGateway, function (err, gateway) {
            if (err || !gateway || (gateway && !gateway.request)) {
              //send with default gateway
              return res.json({
                err: err,
                success: false,
                gateway: gateway,
              });
            }
            // console.log('theReq', theReq)

            if (phoneNumber) {
              let m = gateway.request;
              if (message) m = m.replaceAll("%message%", message);
              if (phoneNumber) m = m.replaceAll("%phoneNumber%", phoneNumber);
              console.log("m:", m);

              let theReq = JSON.parse(m);

              req
                .httpRequest(theReq)
                .then(function (parsedBody) {
                  return res.json(notification);
                })
                .catch(() => {
                  console.log("hi");
                });
            }
          });
        } else {
          return res.json({
            success: false,
            message: "set default sms gateway!",
          });
        }
      });
    });
  }

  function sendToSms(req, status, params) {
    console.log("sendToSms1...", params);
    let phoneNumber = params.phoneNumber;
    return new Promise(function (resolve, reject) {
      let Settings = req.mongoose.model("Settings");

      Settings.findOne({}, "plugins currency", function (err, setting) {
        // console.log('setting:',setting)
        if (!setting.plugins) {
          return reject({});
        }
        if (!setting.plugins["sms-gateway"]) return reject({});

        let {
          onCreateOrderByCustomer,
          onUpdateTransactionByCustomer,
          onScheduleTask,
          onBackupComplete,
          onCustomerRegister,
          onCustomerSubmitFirstName,
        } = setting.plugins["sms-gateway"];

        if (!phoneNumber) {
          return reject({});
        }
        if (setting.currency) params.currency = setting.currency;
        if (
          onUpdateTransactionByCustomer &&
          status == "update-transaction-by-customer"
        ) {
          console.log("params", params);

          onUpdateTransactionByCustomer = washString(
            onUpdateTransactionByCustomer,
            params
          );
          publishToSms(req, phoneNumber, onUpdateTransactionByCustomer);
        }
        if (onCreateOrderByCustomer && status == "create-order-by-customer") {
          onCreateOrderByCustomer = washString(onCreateOrderByCustomer, params);
          publishToSms(req, phoneNumber, onCreateOrderByCustomer);
        }
        if (status == "send-schedule-message-by-system") {
          // onScheduleTask = washString(onScheduleTask, params);
          //get count of order for today
          getReport(req, onScheduleTask)
            .then((message) => {
              publishToSms(req, phoneNumber, message);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
        if (status == "backup-completion") {
          // onScheduleTask = washString(onScheduleTask, params);

          publishToSms(
            req,
            phoneNumber,
            onBackupComplete || "back up completed"
          );
        }
        if (status == "create-customer" && onCustomerRegister) {
          onCustomerRegister = washString(onCustomerRegister, {
            customer_data: params,
          });
          // console.log('customer register4...',params)
          publishToSms(
            req,
            phoneNumber,
            onCustomerRegister || "customer registered"
          );
        }
        if (
          status == "create-customer-first-name" &&
          onCustomerSubmitFirstName
        ) {
          onCustomerSubmitFirstName = washString(onCustomerSubmitFirstName, {
            customer_data: params,
          });
          console.log("create-customer-first-name", params);
          publishToSms(
            req,
            phoneNumber,
            onCustomerSubmitFirstName || "customer registered"
          );
        }
      });
    });
  }

  function washString(m, order) {
    console.log("order", order);
    let currency = "";
    if (order.currency) {
      currency = order.currency;
    }
    if (order.amount)
      m = m.replaceAll(
        "%amount%",
        order.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
          " " +
          currency
      );
    else m = m.replaceAll("%amount%", "");

    if (order.orderNumber) m = m.replaceAll("%orderNumber%", order.orderNumber);
    else m = m.replaceAll("%orderNumber%", "");

    if (order.customer_data && order.customer_data.phoneNumber)
      m = m.replaceAll("%phoneNumber%", order.customer_data.phoneNumber);
    else m = m.replaceAll("%phoneNumber%", "");

    if (order.customer_data && order.customer_data.phoneNumber)
      m = m.replaceAll("%phoneNumber%", order.customer_data.phoneNumber);
    else m = m.replaceAll("%phoneNumber%", "");

    if (
      order.customer_data &&
      order.customer_data.firstName &&
      order.customer_data.lastName
    )
      m = m.replaceAll(
        "%customerName%",
        order.customer_data.firstName + " " + order.customer_data.lastName
      );
    else m = m.replaceAll("%customerName%", "");

    if (order.customer_data && order.customer_data.firstName)
      m = m.replaceAll("%firstName%", order.customer_data.firstName);
    else m = m.replaceAll("%firstName%", "");

    if (order.customer_data && order.customer_data.lastName)
      m = m.replaceAll("%lastName%", order.customer_data.lastName);
    else m = m.replaceAll("%lastName%", "");

    if (order && order.method) m = m.replaceAll("%gateway%", order.method);
    else m = m.replaceAll("%gateway%", "");

    if (order && order.status == false)
      m = m.replaceAll("%transactionStatus%", "ناموفق");
    else if (order && order.status == true)
      m = m.replaceAll("%transactionStatus%", "موفق");
    else m = m.replaceAll("%transactionStatus%", "");

    if (order && order.package) {
      let s = "";
      order.package.forEach((idp, j) => {
        s += "   " + (j + 1) + ". " + idp.product_name + "\n";
      });
      m = m.replaceAll("%items%", s);
    }

    if (order._id)
      m = m.replaceAll(
        "%editLink%",
        `${process.env.SHOP_URL}admin/#/order/${order._id}`
      );

    return m;
  }

  if (props && props.entity)
    props.entity.map((item, i) => {
      if (item.name === "gateway") {
        if (!item.functions) {
          item.functions = [];
        }
        if (!item.hook) {
          item.hook = [];
        }
        item.functions.push({
          name: "send_to_sms",
          controller: (req, res, next) => {
            console.log("send_to_sms", req.body);
            return res.json({
              success: true,
            });
          },
        });

        item.hook.push({
          event: "create-order-by-customer",
          name: "send order to sms",
          func: (req, res, next, params) => {
            sendToSms(req, "create-order-by-customer", params);
          },
        });

        item.hook.push({
          event: "update-transaction-by-customer",
          name: "send transaction to sms",
          func: (req, res, next, params) => {
            sendToSms(req, "update-transaction-by-customer", params);
          },
        });

        item.hook.push({
          event: "send-schedule-message-by-system",
          name: "send message to sms",
          func: (req, res, next, params) => {
            sendToSms(req, "send-schedule-message-by-system", params);
          },
        });

        item.hook.push({
          event: "create-customer",
          name: "send message to sms after customer register",
          func: (req, res, next, params) => {
            // console.log('back up complete',req)
            sendToSms(req, "create-customer", params);
          },
        });
        item.hook.push({
          event: "create-customer-first-name",
          name: "send message to sms after customer register and add first name",
          func: (req, res, next, params) => {
            // console.log('back up complete',req)
            sendToSms(req, "create-customer-first-name", params);
          },
        });
      }
    });
  // console.log('props');
  props["plugin"]["sms-gateway"] = [
    {
      name: "onCreateOrderByCustomer",
      value: "",
      label: "onCreateOrderByCustomer",
      type: "textarea",
    },
    {
      name: "onScheduleTask",
      value: "",
      label: "onScheduleTask",
      type: "textarea",
    },
    {
      name: "onUpdateTransactionByCustomer",
      value: "",
      label: "onUpdateTransactionByCustomer",
      type: "textarea",
    },
    {
      name: "onCustomerRegister",
      value: "",
      label: "onCustomerRegister",
      type: "textarea",
    },
    {
      name: "onCustomerSubmitFirstName",
      value: "",
      label: "onCustomerSubmitFirstName",
      type: "textarea",
    },
  ];
  return props;
};
