export default (props) => {
  // _.forEach()
  if (props && props.entity)
    props.entity.map((item, i) => {
      if (item.name === "transaction") {
        if (item.routes)
          item.routes.push({
            path: "/status/zibal/",
            method: "post",
            access: "customer_all",
            controller: (req, res, next) => {
              let data = {},
                transactionObject = {},
                orderObject = {};
              if (req.body.success == 0 || req.body.success == "0") {
                if (req.body.status && req.body.status == 3) {
                  transactionObject["statusCode"] = 3;
                }
              }
              if (req.body.success == 1 || req.body.success == "1") {
                let Gateway = req.mongoose.model("Gateway");

                Gateway.findOne({ slug: "zibal" }, function (err, items) {
                  if (err || !item) {
                    return res.json({
                      success: false,
                    });
                  }
                  if (!items.verify)
                    return res.json({
                      success: false,
                    });
                  // console.log('verify', items.verify)

                  let verify = JSON.parse(items.verify);
                  // console.log('verify', verify)

                  console.log("orderId: ", req.body.orderId);
                  verify["data"]["trackId"] = parseInt(req.body.trackId);
                  // console.log('verify', verify)
                  req
                    .httpRequest(verify)
                    .then(function (parsedBody) {
                      console.log('parsedBody["data"]', parsedBody["data"]);
                      if (!parsedBody["data"]) {
                        return res.json({
                          success: false,
                          message: "",
                        });
                      }
                      data = parsedBody["data"];
                      console.log("data", data);
                      transactionObject["status"] = !!(
                        data && data.result === 100
                      );
                      transactionObject["statusCode"] =
                        data && data.result === 100 ? "1" : "-1";
                      if (data.cardNumber)
                        transactionObject["cardNumber"] = data.cardNumber;

                      if (data.refNumber)
                        transactionObject["RefID"] = data.refNumber;
                      orderObject["paymentStatus"] =
                        data && data.result === 100 ? "paid" : "notpaid";
                      if (data && data.result == 100) {
                        update_customer(req.body.orderId, req.body.trackId);
                      }
                      if (data && data.result == 201) {
                        return res.json({
                          message: "you did it before",
                          success: false,
                        });
                      } else if (data && data.result == 202) {
                        return res.json({
                          message: "you did noy pay",
                          success: false,
                        });
                      } else if (data && data.result == 102) {
                        return res.json({
                          message: "you did not enter merchant",
                          success: false,
                        });
                      } else if (data && data.result == 103) {
                        return res.json({
                          message: "merchant is deactive",
                          success: false,
                        });
                      } else if (data && data.result == 104) {
                        return res.json({
                          message: "merchant is unknown",
                          success: false,
                        });
                      } else if (data && data.result == 203) {
                        return res.json({
                          message: "trackId is unknown",
                          success: false,
                        });
                      } else {
                        update_transaction();
                      }
                    })
                    .catch((e) => res.json({ e, requ: verify }));

                  // return;
                });
              } else {
                update_transaction();
              }

              function update_transaction() {
                req.updateTransaction(
                  req,
                  res,
                  next,
                  transactionObject,
                  orderObject,
                  { Authority: req.body.trackId }
                );
              }

              function update_customer(orderId, trackId) {
                console.log("orderId,trackId:", orderId, trackId);
                let Customer = req.mongoose.model("Customer");
                let Order = req.mongoose.model("Order");
                let Product = req.mongoose.model("Product");
                console.log("update customer expire date");
                Order.findOne(
                  {
                    orderNumber: orderId,
                    Authority: trackId,
                  },
                  "_id customer customer_data card",
                  function (err, order) {
                    console.log("order inside order:", order);
                    if (order && order.customer) {
                      Customer.findById(
                        order.customer,
                        "_id data",
                        function (err, customer) {
                          if (
                            customer &&
                            customer.data &&
                            customer.data.expireDate
                          ) {
                            if (
                              order.card &&
                              order.card[0] &&
                              order.card[0]._id
                            )
                              Product.findById(
                                order.card[0]._id,
                                "slug",
                                function (err, product) {
                                  console.log(
                                    "customer expireDate inside order:",
                                    customer.data.expireDate
                                  );
                                  let expireDate = new Date(
                                    customer.data.expireDate
                                  );
                                  console.log(
                                    "expireDate",
                                    expireDate,
                                    product.slug
                                  );
                                  let number = 0;
                                  if (product.slug == "one-year-charge") {
                                    number = 12;
                                  }
                                  if (product.slug == "six-month-charge") {
                                    number = 6;
                                  }
                                  if (product.slug == "one-month-charge") {
                                    number = 1;
                                  }
                                  expireDate.setMonth(
                                    expireDate.getMonth() + number
                                  );
                                  let theData = {
                                    ...customer.data,
                                    expireDate,
                                  };
                                  console.log("new theData", theData);

                                  Customer.findByIdAndUpdate(
                                    order.customer,
                                    {
                                      $set: {
                                        data: theData,
                                      },
                                    },
                                    function (err, customer) {
                                      console.log(
                                        "customer expire date updated"
                                      );
                                    }
                                  );
                                }
                              );
                          }
                        }
                      ).lean();
                    }
                  }
                );
              }
            },
          });
      }
    });
  props["plugin"]["zibal-gateway"] = [
    { name: "merchant", value: "", label: "merchant code" },
  ];
  return props;
};
