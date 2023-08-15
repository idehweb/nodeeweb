import { MiddleWare, Req } from '@nodeeweb/core/types/global';
import { serviceOnError } from '../common/service';
import { classCatchBuilder } from '@nodeeweb/core/utils/catchAsync';
import store from '@nodeeweb/core/store';
import {
  checkSiteStatus,
  fireEvent,
  submitAction,
} from '../common/mustImplement';
import mongoose from 'mongoose';
import crypto from 'crypto';
import stringMath from 'string-math';
import axios from 'axios';
import moment from 'moment';
import persianJs from 'persianjs';

export default class Service {
  static createByCustomer: MiddleWare = async (req, res) => {
    const Product = store.db.model('product');
    const Order = store.db.model('order');
    const Settings = store.db.model('settings');

    let len = 0,
      ii = 0;
    if (req.body.card && req.body.card.length) len = req.body.card.length;

    for (const pack of req.body.card as any[]) {
      let main_id = pack._id.split('DDD');
      let id = main_id[0];
      if (!id) {
        id = pack._id;
      }

      const tempProducts = [];
      const ps = await Product.findOne(
        { _id: id },
        '_id combinations type price salePrice title quantity in_stock'
      );

      if (!ps) {
        return res.status(404).json({
          success: false,
          message: 'product not found!',
        });
      }
      ii++;
      if (ps.type != 'normal') {
        if (ps.combinations) {
          for (const [inde, comb] of (ps.combinations as any[]).entries()) {
            if (inde == main_id[1] || comb.id == main_id[1]) {
              if (pack.salePrice) {
                if (pack.salePrice != comb.salePrice) {
                  return res.status(400).json({
                    success: false,
                    message: 'مغایرت در قیمت ها!',
                    'pack.salePrice': pack.salePrice,
                    'comb.salePrice': comb.salePrice,
                    'ps.type': ps.type,
                    'ps.title': ps.title,
                    err: 1,
                  });
                }
              } else if (pack.price) {
                if (pack.price != comb.price) {
                  return res.status(400).json({
                    success: false,
                    message: 'مغایرت در قیمت ها!',
                    'pack.price': pack.price,
                    'comb.price': comb.price,
                    'ps.type': ps.type,
                    'ps.title': ps.title,
                    err: 2,
                  });
                }
              }

              if (ps.combinations[inde].quantity == 0) {
                ps.combinations[inde].in_stock = false;
                comb.in_stock = false;
              }
              if (ps.combinations[inde].quantity) {
                ps.combinations[inde].quantity--;
              }
              if (comb.in_stock == false) {
                return res.status(400).json({
                  success: false,
                  message: 'مغایرت در موجودی!',
                  'comb.in_stock': comb.in_stock,
                  'ps.type': ps.type,
                  'ps.title': ps.title,
                });
              }
            }
          }
        }
      }
      if (ps.type == 'normal') {
        if (pack.salePrice) {
          if (pack.salePrice != ps.salePrice) {
            return res.status(400).json({
              success: false,
              message: 'مغایرت در قیمت ها!',
              'pack.salePrice': pack.salePrice,
              'ps.salePrice': ps.salePrice,
              'ps.type': ps.type,
              'ps.title': ps.title,
            });
          }
        } else if (pack.price)
          if (pack.price != ps.price) {
            return res.status(400).json({
              success: false,
              message: 'مغایرت در قیمت ها!',
              'pack.price': pack.price,
              'ps.price': ps.price,
              'ps.type': ps.type,
              'ps.title': ps.title,
            });
          }

        if (ps.quantity == 0) {
          ps.in_stock = false;
        }
        if (ps.quantity) {
          ps.quantity--;
        }
        if (ps.in_stock == false) {
          return res.status(400).json({
            success: false,
            message: 'مغایرت در موجودی!',
            'ps.in_stock': ps.in_stock,
            'ps.type': ps.type,
            'ps.title': ps.title,
          });
        }
      }

      tempProducts.push(ps);
      req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
      req.body.customer = req.user._id;

      if (ii == len) {
        if (!(await checkSiteStatus()))
          return res.status(500).json({
            success: false,
            message: 'site is deactive!',
          });

        const setting = await Settings.findOne({}, 'tax taxAmount');
        const taxAmount = +(setting.taxAmount || 0);
        if (taxAmount) {
          const theTaxAmount = Math.floor(+req.body.sum * (taxAmount / 100));
          req.body.amount = theTaxAmount + req.body.sum;
          req.body.taxAmount = taxAmount;
        }
        if (req.body.deliveryPrice) {
          const deliveryPrice = parseInt(req.body.deliveryPrice);
          req.body.amount = deliveryPrice + req.body.amount;
        }
        const lastObject = {
          billingAddress: req.body.billingAddress,
          amount: req.body.amount,
          card: req.body.card,
          customer: req.body.customer,
          customer_data: req.body.customer_data,
          discount: req.body.discount,
          discountAmount: req.body.discountAmount,
          discountCode: req.body.discountCode,
          deliveryDay: req.body.deliveryDay,
          deliveryPrice: req.body.deliveryPrice,
          status: 'processing',
          package: req.body.package,
          total: req.body.discount
            ? req.body.amount - req.body.discount
            : req.body.amount,
          sum: req.body.sum,
          ship: req.body.ship || false,
          shipAmount: req.body.shipAmount || 0,
          tax: setting.tax || false,
          taxAmount: req.body.taxAmount || 0,
          productsAfterThisOrder: tempProducts,
        };

        if (req.body.discountCode) {
          const Discount = store.db.model('Discount');
          const discount = await Discount.findOne({
            slug: req.body.discountCode,
          });

          if (!discount) {
            return res.status(404).json({
              success: false,
              message: 'did not find any discount!',
            });
          }
          if (discount.count < 1) {
            return res.status(400).json({
              success: false,
              message: 'discount is done!',
            });
          }
          if (!discount.customer) {
            discount.customer = [];
          }

          if (discount.customer && discount.customer.length > 0) {
            const isInArray = (
              discount.customer as mongoose.Types.ObjectId[]
            ).some(function (cus) {
              return cus.equals(req.user._id);
            });
            if (isInArray) {
              if (discount.customerLimit)
                return res.status(400).json({
                  success: false,
                  message: 'you have used this discount once!',
                });
              continueDiscount();
            } else {
              continueDiscount();
            }
          } else {
            continueDiscount();
          }

          async function continueDiscount() {
            discount.customer.push(req.user._id);
            let theDiscount = 0;
            if (discount.price) {
              theDiscount = discount.price;
            }
            if (discount.percent) {
              theDiscount = Math.floor(req.body.sum * discount.percent) / 100;
            }
            if (theDiscount < 0) {
              theDiscount = 0;
            }
            await Discount.findOneAndUpdate(
              { slug: req.body.discountCode },
              {
                $set: {
                  count: discount.count - 1,
                  customer: discount.customer,
                  order: req.body.order_id || null,
                },
              }
            );

            lastObject['discountAmount'] = theDiscount;
            req.body.amount = req.body.amount - theDiscount;
            lastObject['amount'] = req.body.amount;
            await update_order();
          }
        } else {
          await update_order();
        }

        async function update_order() {
          if (req.body.order_id) {
            let order = await Order.findOneAndUpdate(
              { order_id: req.body.order_id },
              {
                $set: { ...lastObject, updatedAt: new Date() },
                $push: {
                  statusArray: { status: 'processing' },
                },
              }
            );

            if (!order) {
              order = await Order.create({
                ...lastObject,
                order_id: req.body.order_id,
                status: 'processing',
                orderNumber: req.body.orderNumber,
              });
            }
            change_products_quantities();
            fireEvent('create-order-by-customer', order);
            return res.status(201).json({ success: true, order });
          } else {
            const order = await Order.create({
              billingAddress: req.body.billingAddress,
              amount: req.body.amount,
              card: req.body.card,
              customer: req.body.customer,
              customer_data: req.body.customer_data,
              deliveryDay: req.body.deliveryDay,
              deliveryPrice: req.body.deliveryPrice,
              order_id: crypto.randomBytes(64).toString('hex'),
              package: req.body.package,
              total: req.body.total,
              orderNumber: req.body.orderNumber,
              sum: req.body.sum,
              ...lastObject,
            });

            change_products_quantities();
            fireEvent('create-order-by-customer', order);
            return res.status(201).json({ success: true, order: order });
          }
        }

        function change_products_quantities() {
          console.log('****** change_products_quantities ******');
          // _.forEach(tempProducts, function (tempProduct) {
          //     console.log('\ntempProduct',{
          //         in_stock:tempProduct.in_stock,
          //         quantity:tempProduct.quantity,
          //         combinations:tempProduct.combinations,
          //     })
          //
          //     Product.findByIdAndUpdate(tempProduct._id,{
          //         $set:{
          //             in_stock:tempProduct.in_stock,
          //             quantity:tempProduct.quantity,
          //             combinations:tempProduct.combinations,
          //         }
          //     },function(err,resp){
          //         console.log('resp',resp._id)
          //     })
          // })
        }
      }
    }
  };
  static createAdmin: MiddleWare = async (req, res) => {
    const Customer = store.db.model('Customer');
    const Order = store.db.model('Order');
    req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
    let pack = [],
      amount = 0;
    const obj = {
      order_id: crypto.randomBytes(64).toString('hex'),
      amount: req.body.amount ? req.body.amount : amount,
      total: req.body.amount ? req.body.amount : amount,
      orderNumber: req.body.orderNumber,
      sum: req.body.amount ? req.body.amount : amount,
      status: req.body.status || 'checkout',
    };
    if (req.body.card) {
      obj['card'] = req.body.card;

      for (const item of req.body.card) {
        amount += (item.salePrice || item.price) * item.count;
        pack.push({
          product_name: item.title,
          product_id: item.product_id,
          price: item.salePrice || item.price,
          total_price: (item.salePrice || item.price) * item.count,
          quantity: item.count,
        });
      }

      obj['package'] = pack;
      obj['amount'] = req.body.amount ? req.body.amount : amount;
    }
    if (req.body.customer) {
      const customer = await Customer.findById(
        req.body.customer,
        '_id firstName lastName countryCode internationalCode address phone'
      );

      if (!customer)
        return res.status(404).json({
          success: false,
          message: 'error!',
        });

      obj['customer'] = req.body.customer;
      obj['customer_data'] = customer;
      obj['billingAddress'] =
        customer.address && customer.address[0] ? customer.address[0] : {};
    }
    const order = await Order.create(obj);
    return res.status(201).json(order);
  };

  static importFromWordpress: MiddleWare = async (req, res) => {
    let url = '';
    if (req.query.url) {
      url = req.query.url as string;
    }
    if (req.query.consumer_secret) {
      url += '?consumer_secret=' + req.query.consumer_secret;
    }
    if (req.query.consumer_key) {
      url += '&consumer_key=' + req.query.consumer_key;
    }

    if (req.query.per_page) {
      url += '&per_page=' + 1;
    }
    let i = Math.floor(+req.query.page);
    await Service._sendReq(req, url, i);
    res.send('Send result!!!');
  };

  static rewriteOrders: MiddleWare = async (req, res) => {
    return res.status(500).send('not implement yet!');
  };

  static createCart: MiddleWare = async (req, res) => {
    const obj: any = {
      billingAddress: req.body.billingAddress,
      amount: req.body.amount,
      card: req.body.card,
      customer: req.body.customer,
      customer_data: req.body.customer_data?._id,
      deliveryDay: req.body.deliveryDay,
      deliveryPrice: req.body.deliveryPrice,
      package: req.body.package,
      total: req.body.total,
      sum: req.body.sum,
      orderNumber:
        req.body.orderNumber ?? Math.floor(10000 + Math.random() * 90000),
      status: req.body.status == 'checkout' ? 'checkout' : 'cart',
    };
    const Order = store.db.model('Order');
    if (req.params.id) {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: obj,
          $push: { statusArray: { status: obj.status } },
        },
        { new: true }
      );

      if (!order) return res.status(404).json({ message: 'order not found' });
      return res.status(200).json(order);
    } else {
      obj.order_id =
        req.body.order_id ?? crypto.randomBytes(64).toString('hex');
      const order = await Order.create(obj);
      return res.status(201).json(order);
    }
  };
  static createPaymentLink: MiddleWare = async (req, res) => {
    const Gateway = store.db.model('Gateway');
    const Order = store.db.model('Order');
    const Transaction = store.db.model('Transaction');

    if (
      req.body.amount &&
      (req.body.amount == null || req.body.amount == 'null')
    )
      return res.status(400).json({
        success: false,
        message: 'req.body.amount',
      });
    if (req.body.method) {
      const gateway = await Gateway.findOne({ slug: req.body.method });

      if (!gateway || !gateway.request) {
        return res.status(404).json({
          success: false,
          slug: req.body.method,
          message: 'gateway request not found',
        });
      }
      req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);

      const obj = {
        order_id: crypto.randomBytes(64).toString('hex'),
        amount: req.body.amount,
        total: req.body.amount,
        orderNumber: req.body.orderNumber,
        sum: req.body.amount,
        status: req.body.status || 'checkout',
      };

      const order = await Order.create(obj);
      let amount = parseInt(order.amount) * 10;
      if (req.body.amount) {
        amount = parseInt(req.body.amount) * 10;
      }
      if (order.discount) {
        amount = amount - order.discount * 10;
      }
      if (amount < 0) {
        amount = 0;
      }
      const LIMIT = 1000000000;
      if (amount > LIMIT) {
        return res.status(400).json({
          success: false,
          message: 'price is more than 50,000,000T',
        });
      }
      gateway.request = gateway.request.replace(
        /%domain%/g,
        process.env.BASE_URL
      );

      gateway.request = gateway.request.replace(/%amount%/g, order.amount);
      gateway.request = gateway.request
        .split('%orderNumber%')
        .join(order.orderNumber);
      gateway.request = gateway.request.replace(/%orderId%/g, order._id);
      if (!JSON.parse(gateway.request))
        return res.status(400).json({
          success: false,
          gateway: JSON.parse(gateway.request),
          message: 'gateway request not found',
        });
      let theReq = JSON.parse(gateway.request);

      if (theReq['data'] && theReq['data']['Amount'])
        theReq['data']['Amount'] = stringMath(
          theReq['data']['Amount'].toString()
        );

      if (theReq['data'] && theReq['data']['amount'])
        theReq['data']['amount'] = stringMath(
          theReq['data']['amount'].toString()
        );

      if (theReq['body'] && theReq['body']['Amount'])
        theReq['body']['Amount'] = stringMath(
          theReq['body']['Amount'].toString()
        );

      if (theReq['body'] && theReq['body']['amount'])
        theReq['body']['amount'] = stringMath(
          theReq['body']['amount'].toString()
        );

      try {
        const { data } = await axios(theReq);

        const obj = {
          amount: amount,
          method: req.body.method,
          order: req.params._id,
          gatewayResponse: JSON.stringify(data),
          Authority: data['trackId'],
        };
        if (req.headers && req.user && req.user._id) {
          obj['customer'] = req.user._id;
        }
        const transaction = await Transaction.create(obj);
        await Order.findByIdAndUpdate(req.params._id, {
          $push: {
            transaction: transaction._id,
          },
        });

        if (data && data['url']) {
          return res.status(201).json({
            success: true,
            url: data['url'],
          });
        }
        if (data && data.trackId) {
          return res.status(201).json({
            success: true,
            url: 'https://gateway.zibal.ir/start/' + data.trackId,
          });
        } else {
          return res.status(201).json({
            success: false,
            parsedBody: data,
          });
        }
      } catch (e) {
        return res.status(500).json({ e, requ: theReq });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'you have no gateway',
      });
    }
  };
  static myOrder: MiddleWare = async (req, res) => {
    const Order = store.db.model('Order');
    const obj = {
      _id: req.params.id,
      customer: req.user._id.toString(),
    };
    const order = await Order.findOne(obj)
      .populate('customer', 'nickname phone firstName lastName')
      .populate('transaction', 'Authority amount statusCode status');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'error!',
      });
    }
    return res.status(201).json(order);
  };
  static allWOrders: MiddleWare = async (req, res) => {
    const Order = store.db.model('Order');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    const search = {};
    search['customer'] = req.user._id;
    const orders = await Order.find(
      search,
      '_id updatedAt createdAt card sum amount deliveryPrice orderNumber status paymentStatus deliveryDay customer_data billingAddress transaction'
    )
      .populate('customer', 'nickname photos address')
      .skip(offset)
      .sort({ _id: -1 })
      .limit(parseInt(req.params.limit))
      .lean();

    if (!orders.length) {
      return res.json([]);
    }

    const count = await Order.countDocuments(search);
    res.setHeader('X-Total-Count', count);
    return res.json(orders);
  };
  static destroy: MiddleWare = async (req, res) => {
    const Order = store.db.model('Order');
    const order = await Order.findByIdAndUpdate(req.params.id, {
      $set: {
        status: 'trash',
      },
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'error!',
      });
    }
    if (req.user._id) {
      const action = {
        user: req.user._id,
        title: 'deconste order ' + order._id,
        history: order,
        order: order._id,
      };
      submitAction(action);
    }
    return res.status(204).json({
      success: true,
      message: 'Deconsted!',
    });
  };
  static async _sendReq(req: Req, theUrl: any, page: any) {
    page = parseInt(page + '');
    let url = theUrl;
    url += '&page=' + page;
    try {
      const { data } = await axios({
        method: 'get',
        url: url,
      });
      const Order = store.db.model('Order');
      for (const dat of data) {
        const obj = {};
        if (dat.total) {
          obj['amount'] = dat.total;
        }
        if (dat.id) {
          obj['orderNumber'] = dat.id;
        }
        obj['data'] = dat;
        if (dat && dat.date_created) {
          obj['createdAt'] = moment(dat.date_created).format();
          obj['created_at'] = moment(dat.date_created).format();
        }
        if (dat && dat.date_modified) {
          obj['updatedAt'] = moment(dat.date_modified).format();
        }

        const order = await Order.create(obj);
        const y = page + 1;
        await Service._checkOrder(req, order);
        await Service._sendReq(req, theUrl, y);
      }
    } catch (err) {
      const y = page;
      await Service._sendReq(req, theUrl, y);
    }
  }
  static async _checkOrder(req: Req, item: any, k = -1) {
    const Customer = store.db.model('Customer');
    const Order = store.db.model('Order');
    const obj = {};
    if (item.data && item.data.date_created) {
      obj['createdAt'] = moment(item.data.date_created).format();
      obj['created_at'] = moment(item.data.date_created).format();
    }
    if (item.data && item.data.date_modified) {
      obj['updatedAt'] = moment(item.data.date_modified).format();
    }
    if (item.data && item.data.coupon_lines) {
      item.data.coupon_lines.forEach((coupon_lines: any) => {
        const dcode = coupon_lines.code;
        const discountAmount = coupon_lines.discount;
        if (dcode) {
          obj['discountCode'] = dcode;
        }
        if (discountAmount) {
          obj['discountAmount'] = discountAmount;
        }
        if (coupon_lines.meta_data && coupon_lines.meta_data[0]) {
          const discount = coupon_lines.meta_data[0].display_value.amount;

          if (discount) {
            obj['discount'] = discount;
          }
        }
      });
    }
    if (item.data && item.data.discount_total && item.data.discount_tax) {
      obj['discountAmount'] =
        parseInt(item.data.discount_total) + parseInt(item.data.discount_tax);
    }
    if (item.data && item.data.line_items) {
      const theCart = [],
        thePackage = [];
      item.data.line_items.forEach((cart_data: any) => {
        theCart.push({
          _id: cart_data.id,
          sku: cart_data.sku,
          price: parseInt(cart_data.subtotal) || cart_data.price,
          salePrice: null,
          count: cart_data.quantity,
          title: {
            fa: cart_data.name,
          },
        });
        thePackage.push({
          product_name: cart_data.name,
          product_id: cart_data.id,
          price: parseInt(cart_data.subtotal) || cart_data.price,
          total_price: cart_data.total,
          quantity: cart_data.quantity,
        });
      });

      obj['card'] = theCart;
      obj['package'] = thePackage;
    }
    if (item.data && item.data.status) {
      obj['status'] = item.data.status;
      if (item.data.status == 'processing') {
        obj['status'] = 'indoing';
        obj['paymentStatus'] = 'paid';
        obj['paid'] = 'true';
      }
      if (item.data.status == 'compconsted') {
        obj['status'] = 'compconste';
        obj['paymentStatus'] = 'paid';
        obj['paid'] = 'true';
      }
      if (item.data.status == 'pws-ready-to-ship') {
        obj['status'] = 'makingready';
        obj['paymentStatus'] = 'paid';
        obj['paid'] = 'true';
      }
      if (item.data.status == 'pws-shipping') {
        obj['status'] = 'makingready';
        obj['paymentStatus'] = 'paid';
        obj['paid'] = 'true';
      }
      if (item.data.status == 'pws-packaged') {
        obj['status'] = 'makingready';
        obj['paymentStatus'] = 'paid';
        obj['paid'] = 'true';
      }
      if (item.data.status == 'cancelled') {
        obj['status'] = 'cancel';
      }
      if (item.data.status == 'pending') {
        obj['status'] = 'processing';
      }

      if (item.data.status == 'on-hold') {
        obj['status'] = 'processing';
      }
    }
    if (item.data && item.data.total) {
      obj['amount'] = item.data.total;
      obj['total'] = item.data.total;
      obj['sum'] = item.data.total;
    }
    if (item.data && item.data.cart_tax) {
      obj['taxAmount'] = parseInt(item.data.cart_tax);
    }
    let internationalCode = null,
      sex = null,
      birthday = null,
      monthday = null;
    if (item.data && item.data.meta_data && item.data.meta_data[0]) {
      item.data.meta_data.forEach((j: any) => {
        if (j.key == '_billing_national_id') {
          internationalCode = j.value;
        }
        if (j.key == '_billing_sex') {
          sex = j.value;
        }
        if (j.key == 'birthday') {
          birthday = j.value;
        }
        if (j.key == 'monthday') {
          monthday = j.value;
        }
      });
    }

    if (item.data && item.data.billing && item.data.billing.phone) {
      const custObj = {};
      if (item.data.billing && item.data.billing.email) {
        custObj['email'] = item.data.billing.email;
      }
      if (internationalCode) {
        custObj['internationalCode'] = internationalCode;
      }
      if (sex) {
        custObj['sex'] = sex;
      }
      if (birthday && monthday) {
      }
      let phone = item.data.billing.phone.slice(-12);
      phone = phone.replace(/\s/g, '');
      phone = persianJs(phone).arabicNumber().toString().trim();
      phone = persianJs(phone).persianNumber().toString().trim();
      phone = parseInt(phone).toString();

      if (phone.length < 12) {
        if (phone.toString().length === 10) {
          phone = '98' + phone.toString();
        }
      }
      custObj['address'] = [
        {
          type: '',
          State: item.data.billing.state,
          City: item.data.billing.city,
          StreetAddress: item.data.billing.address_1,
          PostalCode: item.data.billing.postcode,
        },
      ];
      if (phone.length == 12) {
        const customer = await Customer.findOneAndUpdate(
          { phone: phone },
          custObj,
          { new: true }
        );

        if (!customer) {
          custObj['firstName'] = item.data.billing.first_name;
          custObj['lastName'] = item.data.billing.last_name;
          const tcustomer = await Customer.create({
            phone: phone,
            ...custObj,
          });
          if (tcustomer) {
            obj['customer'] = tcustomer._id;
            obj['customer_data'] = {
              firstName: item.data.billing.first_name,
              lastName: item.data.billing.last_name,
            };
            obj['billingAddress'] = {
              type: '',
              State: item.data.billing.state,
              City: item.data.billing.city,
              StreetAddress: item.data.billing.address_1,
              PostalCode: item.data.billing.postcode,
            };
            await Order.findByIdAndUpdate(item._id, obj);
          }
        }
        if (customer) {
          obj['customer_data'] = {
            phone: phone,
            firstName: customer.firstName || item.data.billing.first_name,
            lastName: customer.lastName || item.data.billing.last_name,
            email: item.data.billing.email,
          };
          if (custObj['internationalCode']) {
            obj['customer_data']['internationalCode'] =
              custObj['internationalCode'];
          }
          obj['customer'] = customer._id;

          obj['billingAddress'] = {
            type: '',
            State: item.data.billing.state,
            City: item.data.billing.city,
            StreetAddress: item.data.billing.address_1,
            PostalCode: item.data.billing.postcode,
          };
          if (!customer.firstName) {
            custObj['firstName'] = item.data.billing.first_name;
          }
          if (!customer.lastName) {
            custObj['lastName'] = item.data.billing.last_name;
          }
          await Customer.findByIdAndUpdate(customer._id, custObj, {
            new: true,
          });
          await Order.findByIdAndUpdate(item._id, obj, { new: true });
        }
      }
    } else {
      await Order.findByIdAndUpdate(item._id, obj, { new: true });
    }
  }
  static onError = serviceOnError('Order');
}

classCatchBuilder(Service);
