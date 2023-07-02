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

  function publishToTelegram(req, telegramLink, telegramChatID, message) {
    console.log("publishToTelegram====>", message);

    return new Promise(function (resolve, reject) {
      console.log("telegramChatID", telegramChatID);

      let url = encodeURI(telegramLink);
      console.log("url", url);

      req
        .httpRequest({
          method: "post",
          url: url,
          data: { message, chatId: telegramChatID },
          json: true,
        })
        .then(function (parsedBody) {
          resolve({
            success: true,
            // body:parsedBody
          });
        })
        .catch(function (err) {
          reject({
            success: false,
            err,
          });
        });
    });
  }

  function sendToTelegram(req, status, params) {
    console.log("sendToTelegram...");
    return new Promise(function (resolve, reject) {
      let Settings = req.mongoose.model("Settings");

      Settings.findOne({}, "plugins currency", function (err, setting) {
        // console.log('setting:',setting)
        if (!setting.plugins) {
          return reject({});
        }
        if (!setting.plugins["telegram-gateway"]) return reject({});

        let {
          onCreateOrderByCustomer,
          onUpdateTransactionByCustomer,
          onScheduleTask,
          telegramLink,
          telegramChatID,
          onBackupComplete,
          onCustomerRegister,
        } = setting.plugins["telegram-gateway"];

        if (!telegramLink || !telegramChatID) {
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
          publishToTelegram(
            req,
            telegramLink,
            telegramChatID,
            onUpdateTransactionByCustomer
          );
        }
        if (onCreateOrderByCustomer && status == "create-order-by-customer") {
          onCreateOrderByCustomer = washString(onCreateOrderByCustomer, params);
          publishToTelegram(
            req,
            telegramLink,
            telegramChatID,
            onCreateOrderByCustomer
          );
        }
        if (status == "send-schedule-message-by-system") {
          // onScheduleTask = washString(onScheduleTask, params);
          //get count of order for today
          getReport(req, onScheduleTask)
            .then((message) => {
              publishToTelegram(req, telegramLink, telegramChatID, message);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
        if (status == "backup-completion") {
          // onScheduleTask = washString(onScheduleTask, params);

          publishToTelegram(
            req,
            telegramLink,
            telegramChatID,
            onBackupComplete || "back up completed"
          );
        }
        if (status == "create-customer") {
          onCustomerRegister = washString(onCustomerRegister, {
            customer_data: params,
          });
          // console.log('customer register4...',params)
          publishToTelegram(
            req,
            telegramLink,
            telegramChatID,
            onCustomerRegister || "customer registered"
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
      if (item.name === "settings") {
        if (item.routes)
          item.routes.push({
            path: "/reports/getReport/",
            method: "get",
            access: "customer_all",
            controller: (req, res, next) => {
              let Settings = req.mongoose.model("Settings");

              Settings.findOne({}, "plugins currency", function (err, setting) {
                console.log("setting:", setting);
                if (
                  !setting ||
                  !setting.plugins ||
                  !setting.plugins["telegram-gateway"]
                ) {
                  return res.json({});
                }
                let { onScheduleTask, telegramLink, telegramChatID } =
                  setting.plugins["telegram-gateway"];
                getReport(req, onScheduleTask)
                  .then((message) => {
                    console.log("then:", message);
                    publishToTelegram(
                      req,
                      telegramLink,
                      telegramChatID,
                      message
                    );
                    return res.json({
                      success: true,
                    });
                  })
                  .catch((err) => {
                    console.log("err", err);
                    return res.json({
                      success: false,
                    });
                  });
              });
            },
          });
      }
      if (item.name === "gateway") {
        if (!item.functions) {
          item.functions = [];
        }
        if (!item.hook) {
          item.hook = [];
        }

        // item.hook['update-transaction-by-customer'] = (props) => {
        //     console.log('update-transaction-by-customer...',props)
        //
        // }
        item.functions.push({
          name: "send_to_telegram",
          controller: (req, res, next) => {
            console.log("send_to_telegram", req.body);
            return res.json({
              success: true,
            });
          },
        });

        item.hook.push({
          event: "create-order-by-customer",
          name: "send order to telegram",
          func: (req, res, next, params) => {
            sendToTelegram(req, "create-order-by-customer", params);
          },
        });

        item.hook.push({
          event: "update-transaction-by-customer",
          name: "send transaction to telegram",
          func: (req, res, next, params) => {
            sendToTelegram(req, "update-transaction-by-customer", params);
          },
        });

        item.hook.push({
          event: "send-schedule-message-by-system",
          name: "send message to telegram",
          func: (req, res, next, params) => {
            sendToTelegram(req, "send-schedule-message-by-system", params);
          },
        });

        item.hook.push({
          event: "backup-completion",
          name: "send message to telegram after backup",
          func: (req, res, next, params) => {
            // console.log('back up complete',req)
            sendToTelegram(req, "backup-completion", params);
          },
        });
        item.hook.push({
          event: "create-customer",
          name: "send message to telegram after customer register",
          func: (req, res, next, params) => {
            // console.log('back up complete',req)
            sendToTelegram(req, "create-customer", params);
          },
        });
      }
    });
  // console.log('props');
  props["plugin"]["telegram-gateway"] = [
    { name: "telegramLink", value: "", label: "telegramLink" },
    { name: "telegramChatID", value: "", label: "telegramChatID" },
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
      name: "onBackupComplete",
      value: "",
      label: "onBackupComplete",
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
  ];
  return props;
};
