import persianJs from 'persianjs';
import global from '../../../global.mjs';
import bcrypt from 'bcrypt';

var self = {
  authCustomer: function (req, res, next) {
    let Customer = req.mongoose.model('Customer');
    console.log('\n\n\n\n\n =====> try login/register user:');
    // let self=this;
    let p_number = req.body.phoneNumber.toString();
    let fd = req.body.countryCode.toString();
    if (p_number) {
      p_number = p_number.replace(/\s/g, '');
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      req.body.phoneNumber = p_number;
      if (p_number.toString().length < 12) {
        // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
        if (p_number.toString().length === 10) {
          p_number = '98' + p_number.toString();
        }
      }
      console.log(p_number);

      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: 'error!',
          err: 'something wrong in creating customer : customer!',
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: 'error!',
        err: 'something wrong in creating customer : phoneNumber is not entered!',
      });
      return;
    }
    let NUMBER = parseInt(p_number).toString();

    console.log('phone number:', NUMBER);
    Customer.findOne({ phoneNumber: NUMBER }, function (err, response) {
      if (err) {
        res.json({
          success: false,
          message: 'error!',
          err: err,
        });
        return 0;
        // reject(err);
      }
      if (response) {
        let obj = {
          success: response.success,
          _id: response._id,
        };
        console.log('user was in db before...');
        self.updateActivationCode(obj, res, req, true);
      } else {
        console.log('user was not in db before...');

        //we should create customer
        let objs = req.body;
        objs.phoneNumber = NUMBER;
        Customer.create(
          {
            phoneNumber: NUMBER,
            invitation_code: req.body.invitation_code,
          },
          function (err, response) {
            if (err) {
              if (parseInt(err.code) == 11000) {
                Customer.findOne(
                  { phoneNumber: NUMBER },
                  function (err3, response) {
                    if (err3) {
                      res.json({
                        success: false,
                        message: 'error!',
                        err: err,
                      });
                    }
                    // console.log('registering user...')
                    self.updateActivationCode(response, res, req);
                  }
                );
              } else {
                res.json({
                  success: false,
                  message: 'error!',
                  err: err,
                });
              }
            } else {
              // console.log('==> sending sms');
              let $text;
              $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
              // console.log($text);
              // if (req.body.invitation_code) {
              //     self.addToInvitaitionList(response._id, req.body.invitation_code);
              // }

              // global.sendSms('9120539945', $text, '300088103373', null, '98').then(function (uid) {
              //     // console.log('==> sending sms to admin ...');
              //     let objd = {};
              //     objd.message = $text;
              //     global.notifateToTelegram(objd).then(function (f) {
              //         // console.log('f', f);
              //     });
              // }).catch(function () {
              //     return res.json({
              //         success: true,
              //         message: 'Sth wrong happened!'
              //     });
              // });
              self.updateActivationCode(response, res, req);
            }
          }
        );
      }
    });
  },
  updateActivationCode: function (
    response,
    res,
    req,
    userWasInDbBefore = false
  ) {
    console.log('\n\n\n\n\n =====> updateActivationCode');
    let Customer = req.mongoose.model('Customer');

    // console.log('==> updateActivationCode');
    // console.log(response);

    let code = Math.floor(100000 + Math.random() * 900000);
    let date = new Date();
    Customer.findByIdAndUpdate(
      response._id,
      {
        activationCode: code,
        updatedAt: date,
      },
      { new: true },
      function (err, post) {
        if (err) {
          res.json({
            success: false,
            message: 'error!',
          });
        } else {
          let shallWeSetPass = true;
          if (post.password) {
            shallWeSetPass = false;
          }
          res.json({
            success: true,
            message: 'Code has been set!',
            userWasInDbBefore: userWasInDbBefore,
            shallWeSetPass: shallWeSetPass,
          });
          console.log('==> sending sms');
          let $text;
          $text = 'فروشگاه آنلاین آروند' + ' : ' + post.activationCode;
          console.log('req.body.method', req.body.method);
          console.log('activation code is:', post.activationCode);

          if (!shallWeSetPass && userWasInDbBefore) {
            console.log(
              'shallWeSetPass && userWasInDbBefore:',
              shallWeSetPass,
              userWasInDbBefore
            );

            return;
          }
          if (req.body.method == 'whatsapp') {
            Customer.findByIdAndUpdate(
              response._id,
              {
                whatsapp: true,
              },
              { new: true },
              function (err, cus) {
                return;
              }
            );
          } else {
            let key = 'sms_welcome';
            if (userWasInDbBefore) {
              key = 'sms_register';
            }
            console.log('...global.sendSms');
            global
              .sendSms(
                req.body.phoneNumber,
                [
                  {
                    key: 'activationCode',
                    value: post.activationCode,
                  },
                ],
                '300088103373',
                response._id,
                req.body.countryCode,
                key
              )
              .then(function (uid) {
                console.log(
                  'activation code sent via sms to customer:',
                  req.body.phoneNumber
                );
                return;
              })
              .catch(function (e) {
                console.log('sth is wrong', e);
                return;
              });
          }
        }
      }
    );
  },
  activateCustomer: function (req, res, next) {
    let Customer = req.mongoose.model('Customer');

    console.log('activateCustomer...');
    let p_number = req.body.phoneNumber;
    if (p_number) {
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      if (p_number.toString().length < 12) {
        // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
        if (p_number.toString().length === 10) {
          p_number = '98' + p_number.toString();
        }
      }
      // console.log('==> addCustomer() 1.15');
      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: 'something wrong in creating customer : customer!',
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message:
          'something wrong in creating customer : phoneNumber is not entered!',
      });
      return;
    }
    req.body.phoneNumber = p_number.toString();
    // console.log('customer phone number is:', p_number.toString());

    p_number = req.body.activationCode;
    if (p_number) {
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: 'something wrong in creating customer : customer!',
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message:
          'something wrong in creating customer : activationCode is not entered!',
      });
      return;
    }
    req.body.activationCode = p_number.toString();
    // console.log('activationCode is:', p_number.toString());
    // parseInt(p_number).toString()

    Customer.findOne(
      { phoneNumber: req.body.phoneNumber },
      '_id activationCode internationalCode address firstName lastName invitation_code',
      function (err, user) {
        if (err) return next(err);
        // console.log('user is:', user);
        if (user) {
          // console.log('==> check db.activationCode with req.body.activationCode');
          // console.log(user.activationCode, req.body.activationCode);
          if (user.activationCode == req.body.activationCode) {
            let Token = global.generateUnid();
            let invitation_code;
            if (!user.invitation_code) {
              invitation_code = Math.floor(100000 + Math.random() * 900000);
            } else {
              invitation_code = user.invitation_code;
            }
            console.log('Token generated:', Token);
            Customer.findByIdAndUpdate(
              user._id,
              {
                activationCode: null,
                invitation_code: invitation_code,
                $push: { tokens: { token: Token, os: req.body.os } },
              },
              {
                returnNewDocument: true,
                projection: {
                  password: true,
                  // internationalCode:true,
                  // address:true,
                  // firstName:true,
                  // lastName:true
                },
              },
              function (err, post) {
                if (err) return next(err);
                // console.log('user activated successfully...');
                // if (post.tokens)
                // console.log('user tokens count is:', post.tokens.length);
                let shallWeSetPass = true;
                if (post.password) {
                  shallWeSetPass = false;
                }
                return res.json({
                  success: true,
                  token: Token,
                  address: user.address,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  internationalCode: user.internationalCode,
                  shallWeSetPass: shallWeSetPass,
                  invitation_code: invitation_code,
                  _id: user._id,
                  message: 'Your user account activated successfully!',
                });
              }
            );
          } else {
            return res.json({
              success: false,
              message: 'The code is wrong!',
            });
          }
        } else {
          return res.json({
            success: false,
            message: 'This user was not found!',
          });
        }
      }
    );
  },
  authCustomerWithPassword: function (req, res, next) {
    // console.log('\n\n\n\n\n =====> try login/register user:');
    // let self=this;
    let Customer = req.mongoose.model('Customer');

    let p_number = req.body.phoneNumber.toString();
    if (p_number) {
      p_number = p_number.replace(/\s/g, '');
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      req.body.phoneNumber = p_number;
      if (p_number.toString().length < 12) {
        // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
        if (p_number.toString().length === 10) {
          p_number = '98' + p_number.toString();
        }
      }
      // console.log(p_number);

      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: 'error!',
          err: 'something wrong in creating customer : customer!',
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: 'error!',
        err: 'something wrong in creating customer : phoneNumber is not entered!',
      });
      return;
    }
    let NUMBER = parseInt(p_number).toString();

    // console.log('this is phone number:', NUMBER);
    Customer.authenticate(NUMBER, req.body.password, function (error, cus) {
      if (error || !cus) {
        let err = new Error('Wrong phoneNumber or password.');
        err.status = 401;
        res.status(401);
        return res.json({
          success: false,
          message: 'شماره موبایل یا رمز عبور اشتباه!',
        });
      } else {
        // req.session.userId = user._id;

        return res.json({
          success: true,
          message: 'در حال ریدایرکت...',
          customer: cus,
        });
      }
    });
  },
  authCustomerForgotPass: function (req, res, next) {
    let Customer = req.mongoose.model('Customer');

    console.log('\n\n\n\n\n =====> Customer Forgot Password:');
    // let self=this;
    let p_number = req.body.phoneNumber.toString();
    if (p_number) {
      p_number = p_number.replace(/\s/g, '');
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      req.body.phoneNumber = p_number;
      // if (p_number.toString().length < 12) {
      //     console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
      //     if (p_number.toString().length === 10) {
      //         p_number = "98" + p_number.toString();
      //     }
      // }
      // console.log(p_number);

      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: 'error!',
          err: 'something wrong in creating customer : customer!',
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: 'error!',
        err: 'something wrong in creating customer : phoneNumber is not entered!',
      });
      return;
    }
    let NUMBER = parseInt(p_number).toString();

    console.log('this phone number:', NUMBER);
    Customer.findOne({ phoneNumber: NUMBER }, function (err, response) {
      if (err) {
        res.json({
          success: false,
          message: 'error!',
          err: err,
        });
        return 0;
        // reject(err);
      }
      if (response) {
        let obj = {
          success: response.success,
          _id: response._id,
        };
        // console.log('user was in db before...');
        Customer.findOneAndUpdate(
          { phoneNumber: NUMBER },
          { password: '' },
          function (err, response) {
            self.updateActivationCode(obj, res, req, true);
          }
        );
      } else {
        //we should create customer
        let objs = req.body;
        objs.phoneNumber = NUMBER;
        Customer.create(
          {
            phoneNumber: NUMBER,
            invitation_code: req.body.invitation_code,
          },
          function (err, response) {
            if (err) {
              if (parseInt(err.code) == 11000) {
                Customer.findOne(
                  { phoneNumber: NUMBER },
                  function (err3, response) {
                    if (err3) {
                      res.json({
                        success: false,
                        message: 'error!',
                        err: err,
                      });
                    }
                    // console.log('registering user...')
                    self.updateActivationCode(response, res, req);
                  }
                );
              } else {
                res.json({
                  success: false,
                  message: 'error!',
                  err: err,
                });
              }
            } else {
              // console.log('==> sending sms');
              let $text;
              $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
              // console.log($text);
              if (req.body.invitation_code) {
                self.addToInvitaitionList(
                  response._id,
                  req.body.invitation_code
                );
              }

              // global.sendSms('9120539945', $text).then(function (uid) {
              //     // console.log('==> sending sms to admin ...');
              //     let objd = {};
              //     objd.message = $text;
              //     global.notifateToTelegram(objd).then(function (f) {
              //         console.log('f', f);
              //     });
              // }).catch(function () {
              //     return res.json({
              //         success: true,
              //         message: 'Sth wrong happened!'
              //     });
              // });
              self.updateActivationCode(response, res, req);
            }
          }
        );
      }
    });
  },
  setPassword: function (req, res, next) {
    let Customer = req.mongoose.model('Customer');

    // console.log('\n\n\n\n\n =====> try to set password:');
    console.log('before hash');
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      // console.log('after hash');
      req.body.password = hash;
      let obj = {
        password: req.body.password,
      };
      if (req.body.email) {
        obj['email'] = req.body.email;
      }
      if (req.body.nickname) {
        obj['nickname'] = req.body.nickname;
      }
      if (req.body.firstName) {
        obj['firstName'] = req.body.firstName;
      }
      if (req.body.lastName) {
        obj['lastName'] = req.body.lastName;
      }
      if (req.body.internationalCode) {
        obj['internationalCode'] = req.body.internationalCode;
      }
      console.log('obj', obj);
      Customer.findOneAndUpdate(
        {
          _id: req.headers._id,
        },
        obj,

        {
          new: true,
          projection: {
            _id: 1,
            email: 1,
            nickname: 1,
            firstName: 1,
            lastName: 1,
            internationalCode: 1,
            address: 1,
          },
        },
        function (err, customer) {
          // console.log('==> pushSalonPhotos() got response');

          if (err || !customer) {
            // console.log('==> pushSalonPhotos() got response err');

            return res.json({
              err: err,
              success: false,
              message: 'error',
            });
          }

          return res.json({
            success: true,
            customer: customer,
          });
        }
      );
    });
  },
  setPasswordWithPhoneNumber: function (req, res, next) {
    let Customer = req.mongoose.model('Customer');

    // console.log('\n\n\n\n\n =====> try to set password with phone number:');
    // console.log('before hash');
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      // console.log('after hash');
      req.body.password = hash;
      let obj = {
        password: req.body.password,
      };
      if (req.body.email) {
        obj['email'] = req.body.email;
      }
      if (req.body.nickname) {
        obj['nickname'] = req.body.nickname;
      } else {
        if (req.body.firstName && req.body.lastName) {
          obj['nickname'] = req.body.firstName + ' ' + req.body.lastName;
        }
      }
      if (req.body.firstName) {
        obj['firstName'] = req.body.firstName;
      }
      if (req.body.lastname) {
        obj['lastName'] = req.body.lastName;
      }
      let p_number = req.body.phoneNumber.toString();
      if (p_number) {
        p_number = p_number.replace(/\s/g, '');
        // console.log('==> addCustomer() 1.11');
        p_number = persianJs(p_number).arabicNumber().toString().trim();
        p_number = persianJs(p_number).persianNumber().toString().trim();
        p_number = parseInt(p_number);
        // console.log('==> addCustomer() 1.15');
        req.body.phoneNumber = p_number;
        if (p_number.toString().length < 12) {
          // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
          if (p_number.toString().length === 10) {
            p_number = '98' + p_number.toString();
          }
        }
        // console.log(p_number);

        if (isNaN(p_number)) {
          res.json({
            success: false,
            message: 'error!',
            err: 'something wrong in creating customer : customer!',
          });
          return;
        }
      } else {
        res.json({
          success: false,
          message: 'error!',
          err: 'something wrong in creating customer : phoneNumber is not entered!',
        });
        return;
      }
      let NUMBER = parseInt(p_number).toString();

      // console.log('this is phone number:', NUMBER);
      Customer.findOneAndUpdate(
        {
          phoneNumber: NUMBER,
        },
        obj,
        {
          new: true,
          projection: {
            _id: 1,
            email: 1,
            nickname: 1,
            firstName: 1,
            lastName: 1,
            tokens: 1,
            address: 1,
            internationalCode: 1,
          },
        },
        function (err, customer) {
          // console.log('==> pushSalonPhotos() got response');

          if (err || !customer) {
            // console.log('==> pushSalonPhotos() got response err');

            res.json({
              err: err,
              success: false,
              message: 'error',
            });
          } else {
            self.getToken(customer, res);

            // res.json({
            //     success: true,
            //     customer: customer
            //
            // })
          }
        }
      );
    });
  },
  updateAddress: function (req, res, next) {
    let Customer = req.mongoose.model('Customer');

    console.log('\n\n\n\n\n =====> editing updateAddress:');
    let search = {
      $or: [
        { email: { $regex: req.body.email, $options: 'i' } },
        { phoneNumber: { $regex: req.body.phoneNumber, $options: 'i' } },
      ],
    };
    Customer.findOne(
      { _id: req.headers._id },
      '_id , phoneNumber , email , address',
      function (err, respo) {
        if (err) {
          res.json({
            success: false,
            err: err,
            message: 'خطا در ثبت اطلاعات!',
          });
          return;
        }
        // console.log('respo:', respo);
        let c = false;
        if (!respo) {
          c = true;
        } else {
          if (respo._id.toString() === req.headers._id.toString()) {
            c = true;
          } else {
            res.json({
              success: false,
              message: 'ایمیل یا نام کاربری از قبل وجود دارد!',
            });
            return;
          }
        }
        if (c) {
          Customer.findByIdAndUpdate(
            req.headers._id,
            {
              address: req.body.address,
              updatedAt: new Date(),
            },
            {
              new: true,
              projection: {
                _id: 1,
                address: 1,
              },
            },
            function (err, post) {
              if (err || !post) {
                res.json({
                  err: err,
                  address: req.body.address,
                  success: false,
                  message: 'findByIdAndUpdate update error!',
                });
                return;
              }
              // console.log('customer updated successfully!');
              res.json({
                success: true,
                customer: post,
              });
              return;
            }
          );
        }
      }
    );
  },
};

export default self;
