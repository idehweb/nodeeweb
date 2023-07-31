import React from "react";
import store from "#c/functions/store";

import {
  Button,
  Col,
  Form,
  FormInput,
  FormSelect,
  InputGroup,
  InputGroupAddon,
  ListGroup,
  ListGroupItem,
  Row
} from "shards-react";
import {
  active,
  authCustomerForgotPass,
  authCustomerWithPassword,
  CameFromPost,
  checkCodeMeli,
  goToProduct,
  Logout,
  register,
  savePost,
  setPassWithPhoneNumber
} from "#c/functions/index";
import {withTranslation} from "react-i18next";
import {Navigate} from "react-router-dom";
import {toast} from "react-toastify";
import Captcha from '#c/components/captcha'
import {fNum} from "#c/functions/utils";

import CircularProgress from "@mui/material/CircularProgress";

const globalTimerSet = 60

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    let st = store.getState().store;
    let shallweshowsubmitpass = false;
    if (st.user.token && (!st.user.firstName || !st.user.lastName || !st.user.internationalCode)) {
      shallweshowsubmitpass = true;
    }
    console.log(props);

    this.state = {
      captcha: false,
      phoneNumber: null,
      thePhoneNumber: null,
      activationCode: null,
      enterActivationCodeMode: false,
      showSecondForm: false,
      isDisplay: !shallweshowsubmitpass,
      setPassword: shallweshowsubmitpass,
      countryCode: st.countryCode,
      getPassword: false,
      firstName: st.user.firstName,
      lastName: st.user.lastName,
      internationalCodeClass: (checkCodeMeli(st.user.internationalCode)) ? "true" : null,
      internationalCode: st.user.internationalCode,
      email: "",
      goToProfile: false,
      loginMethod: "sms",
      token: st.user.token,
      CameFromPost: st.CameFromPost,
      goToProduct: st.goToProduct,
      goToCheckout: st.goToCheckout,
      goToChat: st.goToChat,
      timer: globalTimerSet
    };
    window.scrollTo(0, 0);
    this.captchaAction = this.captchaAction.bind(this);
  }

  fd(d) {
    CameFromPost(d);
  }

  fc(d) {
    goToProduct(d);
  }

  handleSendCodeAgain = (e) => {
    console.log('==> handleSendCodeAgain()')
    this.handleRegister = (e)
  }
  handleRegister = (e) => {
    e.preventDefault();
    console.log('==> handleRegister()')

    let fd = this.state.countryCode || "98";
    let number = this.state.phoneNumber || "0";
    let captcha = this.state.captcha;
    if (!number || number == "" || number == 0) {
      alert("enter phone number!");
      return;
    }
    if (!captcha || captcha == false || captcha == "undefined") {
      alert("enter captcha");
      return;
    }
    number = number.substring(number.length - 10);
    
    this.setState({
      thePhoneNumber: number,
      countryCode: fd,
      phoneNumber: number
    });
    let phoneNumber = fd + fNum(number);





    register(phoneNumber, fd, this.state.loginMethod).then((r) => {
      // new user
      if (r.shallWeSetPass) {
        this.state.timer = globalTimerSet;
        this.myInterval = setInterval(() => {
          this.setState(({timer}) => ({
            timer: timer > 0 ? timer - 1 : (this.handleClearInterval())
          }));
        }, 1000);
        this.setState({
          enterActivationCodeMode: true,
          activationCode: null,
          isDisplay: false
        });
      } else if (!r.shallWeSetPass && r.userWasInDbBefore) {
        this.setState({
          isDisplay: false,
          getPassword: true
        });
      }
    });
  };
  handleClearInterval = () => {
    clearInterval(this.myInterval);
    return 0;
  };
  handlePassword = (e) => {
    e.preventDefault();

    console.log('this.props',this.props)
    // return;
    let fd = this.state.countryCode || "98";
    let ph = fd + this.state.phoneNumber;
    authCustomerWithPassword({
      phoneNumber: ph,
      password: this.state.password
    })
      .then((res) => {
        console.log('store.getState().store',res);
        if (res.success) {
          if(this.props && this.props.goToCheckout){
            console.log('this.props.goToCheckout',this.props.goToCheckout)
            this.setState({
              token: res.customer.token,
              firstName: (res.customer && res.customer.firstName) ? res.customer.firstName : null,
              lastName: (res.customer && res.customer.lastName) ? res.customer.lastName : null,
              internationalCode: (res.customer && res.customer.internationalCode) ? res.customer.internationalCode : null,
              goToCheckout: true
            });
          }else {
            this.setState({
              token: res.customer.token,
              goToProfile: true
            });
          }
        } else {
          if (res.message) alert(res.message);
        }
      })
      .catch((e) => {
        console.log("eee", e);
        toast(this.props.t(e.message), {
          type: "error"
        });
        // return;
      });
  };
  handleForgotPass = (e) => {
    e.preventDefault();
    let fd = this.state.countryCode || "98";
    let number = this.state.phoneNumber || "0";

    let phoneNumber = fd + fNum(number);

    authCustomerForgotPass(phoneNumber, fd, this.state.loginMethod).then((r) => {
      // new user
      // if (r.shallWeSetPass) {
      this.setState({
        enterActivationCodeMode: true,
        isDisplay: false,
        getPassword: false,
        firstName: r.firstName,
        lastName: r.lastName

      });
      this.state.timer = globalTimerSet;
      this.myInterval = setInterval(() => {
        this.setState(({timer}) => ({
          timer: timer > 0 ? timer - 1 : (this.handleClearInterval())
        }));
      }, 1000);
      // } else if (!r.shallWeSetPass && r.userWasInDbBefore) {
      //   this.setState({
      //     isDisplay: false,
      //     getPassword: true,
      //   });
      // }
    });
  };
  handleWrongPhoneNumber = (e) => {
    this.handleClearInterval();
    e.preventDefault();
    this.setState({
      phoneNumber: null,
      activationCode: null,
      enterActivationCodeMode: false,
      showSecondForm: false,
      isDisplay: true,
      setPassword: false,
      getPassword: false,
      goToProfile: false,
      timer: globalTimerSet
    });
  };
  savePasswordAndData = (e) => {
    e.preventDefault();

    const {
      countryCode,
      phoneNumber,
      firstName,
      lastName,
      email,
      password,
      internationalCode,
      internationalCodeClass,
      address
    } = this.state;
    const {t} = this.props;
    let fd = countryCode || "98";
    console.log(firstName, !firstName);
    console.log(lastName, !lastName);
    console.log(password, !password);
    console.log(internationalCode, !internationalCode);
    console.log(internationalCodeClass, internationalCodeClass != true);
    if (!firstName || firstName == "") {
      console.log("firstName", firstName, !firstName);
      toast(t("fill everything!"), {
        type: "error"
      });
      return;
    }
    console.log(lastName, !lastName);

    if (!lastName || lastName == "") {
      console.log("lastName", lastName, !lastName);
      toast(t("fill everything!"), {
        type: "error"
      });
      return;
    }
    if (!password || password == undefined || password == "") {
      console.log("password", password, !password);

      toast(t("fill everything!"), {
        type: "error"
      });
      return;
    }
    if (!internationalCode || internationalCode == undefined || internationalCode == "") {
      console.log("internationalCode", internationalCode, !internationalCode);

      toast(t("fill everything!"), {
        type: "error"
      });
      return;
    }
    if (!internationalCodeClass || internationalCodeClass == undefined || internationalCodeClass == "") {
      console.log("internationalCodeClass", internationalCodeClass, !internationalCodeClass);
      if (internationalCode) {
        if (checkCodeMeli(internationalCode)) {

        } else {
          toast(t("fill everything!"), {
            type: "error"
          });
          return;
        }
      } else {
        toast(t("fill everything!"), {
          type: "error"
        });
        return;
      }
    }

    function just_persian(str) {
      let p = /^[\u0600-\u06FF\s]+$/;

      if (!p.test(str)) {
        return false;
      } else {
        return true;
      }
    }

    if (!just_persian(firstName)) {
      toast(t("Enter first name in persian!"), {
        type: "error"
      });
      return;
    }
    if (!just_persian(lastName)) {
      toast(t("Enter last name in persian!"), {
        type: "error"
      });
      return;
    }
    console.log('setPassWithPhoneNumber...')
    setPassWithPhoneNumber({
      phoneNumber: fd + phoneNumber,
      firstName,
      lastName,
      address,
      email,
      internationalCode,
      password
    }).then((res) => {
      console.log('store.getState().store', store.getState().store.user.token, res);
      if (res.success || (res.firstName && res.lastName && res.internationalCode)) {
        this.setState({
          // token: res.token,
          setPassword: false,
          goToProfile: true
        });
      }
    });
  };

  checkResponse(res) {
    this.setState({loginMethod: res});
  }

  handleActivation = (e) => {
    e.preventDefault();

    let {
      activationCode,
      countryCode,
      phoneNumber = "0"
    } = this.state;
    let {
      t
    } = this.props;
    if (!countryCode) {
      countryCode = "98";
    }
    if (!activationCode) {
      alert("enter activation code!");
    }
    let req = {
      activationCode,
      phoneNumber: countryCode + fNum(phoneNumber)
    };
    active(req).then((res = {}) => {
      console.log("==> activate account()", res);
      if (!res.success) return toast.error(t(res.message));

      if (res.shallWeSetPass) {
        // savePost({user: false});
        let th = {
          token: res.token,
          enterActivationCodeMode: false,
          setPassword: true,
          firstName: res.firstName,
          lastName: res.lastName,
          internationalCode: res.internationalCode
        };
        if (res.internationalCode) {
          th["internationalCodeClass"] = checkCodeMeli(res.internationalCode);
        }
        this.setState(th);
      } else this.setState({token: res.token});
    });
  };

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }
  captchaValue(cVal){
    // console.log('parentReCaptchaaaaaa',cVal);
  }
  captchaAction(e){
    if(e === true){
          this.setState({
              captcha: true
            });
    }
  }
  render() {
    // console.clear()
    const {
      isDisplay,
      goToProfile,
      token,
      firstName,
      lastName,
      CameFromPost,
      goToProduct,
      setPassword,
      getPassword,
      internationalCode,
      enterActivationCodeMode,
      internationalCodeClass,
      goToCheckout,
      goToChat,
      loginMethod,
      timer
    } = this.state;
    const {t} = this.props;
    if (token && !firstName && !lastName && !internationalCode) {
      // this.setState({setPassword: true});
      // return <Navigate to={'/login/'} />;
    }
    if (token && goToProduct) {
      this.fc(false);

      return <Navigate to={"/submit-order/" + goToProduct}/>;
    }
    if (token && goToCheckout && firstName && lastName && internationalCode && !setPassword) {
      savePost({goToCheckout: false});

      return <Navigate to={"/checkout/"}/>;
    }
    // if (token && goToChat && firstName && lastName && internationalCode && !setPassword) {
    if (token && goToChat) {
      savePost({goToChat: false});

      return <Navigate to={"/chat/"}/>;
    }
    if (token && CameFromPost && !setPassword) {
      this.fd(false);
      return <Navigate to="/add-new-post/publish"/>;
    } else if ((token && !CameFromPost && !setPassword && firstName && lastName && internationalCode) || goToProfile) {
      // window.location.replace('/my-posts');
      console.log("go to profile...", token, CameFromPost, setPassword);
      return <Navigate to="/profile"/>;
      // window.location.reload();
    } else {
      return (
        <ListGroup flush>
          {isDisplay && (
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form onSubmit={this.handleRegister}>
                    <Row form>

                      <Col md="12" className="form-group ltr">
                        <label htmlFor="thepho">{t("phone number")}</label>

                        <InputGroup className="mb-3">
                          <InputGroupAddon type="prepend">
                            <FormSelect
                              onChange={(e) =>
                                this.setState({countryCode: e.target.value})
                              }>

                              <option value="98">+98</option>

                            </FormSelect>
                          </InputGroupAddon>
                          <FormInput
                            placeholder="**********"
                            id="thepho"
                            className={"iuygfghuji"}
                            type="tel"
                            dir="ltr"
                            onChange={(e) =>

                              this.setState({phoneNumber: e.target.value})
                            }
                          />
                        </InputGroup>
                        <Captcha onActionValue={this.captchaValue} onActionSubmit={this.captchaAction}/>
                      </Col>

                    </Row>
                    <Row form>
                      {/*<Col md="12" className="form-group">*/}
                      {/*<p className={"mb-0"}>{"ارسال کد یکبار مصرف از طریق:"}</p>*/}

                      {/*<RadioGroup className={"jhgfghhhh"}>*/}

                      {/*<FormControlLabel*/}
                      {/*className={"jhgfgh"}*/}
                      {/*value={"whatsapp"}*/}
                      {/*label={t("WhatsApp")}*/}
                      {/*control={<Radio/>}*/}
                      {/*// checked={ans === idx2}*/}
                      {/*checked={loginMethod === "whatsapp"}*/}
                      {/*onChange={() => {*/}
                      {/*this.checkResponse("whatsapp");*/}
                      {/*}}*/}
                      {/*/>*/}
                      {/*<FormControlLabel*/}
                      {/*className={"jhgfgh"}*/}
                      {/*value={"sms"}*/}
                      {/*label={t("SMS")}*/}
                      {/*control={<Radio/>}*/}
                      {/*// checked={ans === idx2}*/}
                      {/*checked={loginMethod === "sms"}*/}
                      {/*onChange={() => {*/}
                      {/*this.checkResponse("sms");*/}

                      {/*}}*/}
                      {/*/>*/}


                      {/*</RadioGroup>*/}
                      {/*</Col>*/}
                    </Row>
                    <Button
                      block
                      type="submit"
                      className="center"
                      onClick={this.handleRegister}>
                      {t("get enter code")}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
          {enterActivationCodeMode && (
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form onSubmit={this.handleActivation}>
                    <Row form>
                      <Col md="12" className="form-group">
                        <div className={"your-phone-number d-flex justify-content-sb"}>
                          <div className={"flex-item "}>
                            {t("your phone number") + ":"}
                          </div>
                          <div className={"flex-item ltr"}>
                            {"+" + this.state.countryCode + this.state.thePhoneNumber}

                          </div>
                        </div>
                        <div className={"your-timer"}>
                          <div className={"flex-item "}>
                            {Boolean(timer) && <div className={"flex-item-relative center "}>
                              <CircularProgress className={'red-progress'} thickness={2} size={60} variant="determinate"
                                                value={parseInt((timer * 100) / globalTimerSet)}/>
                              <div className={"flex-item-absolute "}>
                                {timer}
                              </div>
                            </div>}

                          </div>

                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start"
                          }}>

                          {/*<label htmlFor="feEmailAddress">*/}
                          {/*{t("get enter code")}*/}
                          {/*</label>*/}
                          <label
                            style={{fontSize: 12}}
                            htmlFor="feEmailAddress">
                            {t("enter sent code")}
                          </label>
                        </div>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder="_ _ _ _ _ _"
                            type="number"
                            className={"iuygfghuji"}
                            dir="ltr"
                            onChange={(e) => {

                              this.setState({activationCode: e.target.value});
                            }}
                          />
                        </InputGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md="12" className="form-group"></Col>
                    </Row>

                    <Button
                      block={true}
                      type="submit"
                      className="center"
                      onClick={this.handleActivation}>
                      {t("login")}
                    </Button>
                    <Button
                      outline={true}
                      type="button"
                      className="center btn-block outline the-less-important"
                      onClick={this.handleWrongPhoneNumber}>
                      {t("Change phone number?")}
                    </Button>
                    {Boolean(!timer) && <div className={"flex-item-relative center "}>
                      <Button
                        outline={true}
                        type="button"
                        className="center btn-block outline the-less-important the-no-border"
                        onClick={(e) => this.handleRegister(e)}>
                        {t("Send code again?")}
                      </Button>
                    </div>}
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
          {setPassword && (
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form onSubmit={this.savePasswordAndData}>
                    <Row form>
                      <Col md="12" className="form-group">
                        <label htmlFor="olfirstname">
                          {t("Your first name")}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder={t("First name (persian)")}
                            type="text"
                            id="olfirstname"
                            dir="rtl"
                            value={firstName}
                            onChange={(e) =>
                              this.setState({firstName: e.target.value})
                            }
                          />
                        </InputGroup>
                      </Col>

                      <Col md="12" className="form-group">
                        <label htmlFor="ollastname">
                          {t("Your last name")}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder={t("Last name (persian)")}
                            type="text"
                            value={lastName}
                            id="ollastname"
                            dir="rtl"
                            onChange={(e) =>
                              this.setState({lastName: e.target.value})
                            }
                          />
                        </InputGroup>
                      </Col>
                      <Col md="12" className={"form-group " + internationalCodeClass}>
                        <label htmlFor="internationalCode">
                          {t("International Code")}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            className={"iuygfghuji "}
                            placeholder={t("xxxxxxxxxx")}
                            type="number"
                            value={internationalCode}
                            id="internationalCode"
                            dir="ltr"
                            onChange={(e) => {
                              // console.log(checkCodeMeli(e.target.value));
                              this.setState({
                                internationalCode: e.target.value,
                                internationalCodeClass: checkCodeMeli(e.target.value)
                              });
                            }}
                          />
                        </InputGroup>
                      </Col>

                      <Col md="12" className="form-group">
                        <label htmlFor="oiuytpaswword">
                          {t("set new password")}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder="******"
                            type="password"
                            id="oiuytpaswword"
                            dir="ltr"
                            onChange={(e) =>
                              this.setState({password: e.target.value})
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md="12" className="form-group"></Col>
                    </Row>
                    <Button
                      type="submit"
                      className="center btn-block"
                      onClick={this.savePasswordAndData}>
                      {t("Register")}
                    </Button>
                    <Button
                      type="submit"
                      className="center btn-block"
                      onClick={Logout}>
                      {t("Logout")}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
          {getPassword && (
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form onSubmit={this.handlePassword}>
                    <Row form>
                      <Col md="12" className="form-group">
                        <div className={"your-phone-number d-flex justify-content-sb"}>
                          <div className={"mb-2 flex-item"}>
                            {t("You registered before, please enter your password.")}
                          </div>

                        </div>
                        <div className={"your-phone-number d-flex justify-content-sb"}>
                          <div className={"flex-item "}>
                            {t("your phone number") + ":"}
                          </div>
                          <div className={"flex-item ltr"}>
                            {"+" + this.state.countryCode + this.state.thePhoneNumber}
                          </div>
                        </div>
                        <label htmlFor="oiuytgpaswword">
                          {t("Enter password")}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder="******"
                            type="password"
                            id="oiuytgpaswword"
                            dir="ltr"
                            onChange={(e) =>
                              this.setState({password: e.target.value})
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md="12" className="form-group"></Col>
                    </Row>
                    <Button
                      block={true}
                      type="submit"
                      className="center"
                      onClick={this.handlePassword}>
                      {t("Login")}
                    </Button>
                    <Button
                      type="button"
                      className="center btn-block"
                      onClick={this.handleForgotPass}>
                      {t("Forgot Password")}
                    </Button>
                    <Button
                      outline={true}
                      type="button"
                      className="center btn-block outline the-less-important"
                      onClick={this.handleWrongPhoneNumber}>
                      {t("Wrong phone number?")}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
        </ListGroup>
      );
    }
  }
}

export default withTranslation()(LoginForm);
