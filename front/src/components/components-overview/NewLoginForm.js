import React from 'react';

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
  Row,
} from 'shards-react';

import { withTranslation } from 'react-i18next';

import { Navigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import CircularProgress from '@mui/material/CircularProgress';

import { CameFromPost, goToProduct } from '#c/functions/index';

import Captcha from '#c/components/captcha';
import { fNum } from '#c/functions/utils';

import { otpHandler, passHandler } from '@/functions/auth';
import { SaveData } from '@/functions';

import styles from '@/assets/styles/Login.module.css';

import Loading from '../Loading';

import SSO from './SSO';
import Overlay from './Overlay';

const globalTimerSet = 120;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authStatus: 'detect',
      smsSendAt: null,
      captcha: false,
      phoneNumber: null,
      thePhoneNumber: null,
      activationCode: null,
      enterActivationCodeMode: false,
      firstName: null,
      lastName: null,
      username: null,
      CameFromPost: props.CameFromPost,
      goToProduct: props.goToProduct,
      goToCheckout: props.goToCheckout,
      goToChat: props.goToChat,
      timer: globalTimerSet,
      authenticatingProtocol: 'otp',
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

  afterAuth(user, token) {
    user.token = token;
    user.phoneNumber = user.phone;
    SaveData({ user, token });
  }

  afterSSO(res) {
    const { user, token } = res;
    this.afterAuth(user, token);
    return this.setState((s) => ({ ...s, authStatus: 'success' }));
  }

  async detect(phone, signup = false) {
    try {
      const data = await passHandler.detect(
        { phone },
        {
          login: true,
          signup,
        }
      );

      this.setState((state) => ({
        ...state,
        authenticatingProtocol: 'password',
      }));

      return {
        isOk: true,
        needLogin: data.userExists,
        needSignup: !data.userExists,
        sms_time: data?.leftTime?.seconds ?? 120,
      };
    } catch (err) {
      if (err.response?.status === 404 && !signup)
        return { isOk: true, needSignup: true };
      return {
        isOk: false,
        message: err.response?.data?.message || err.message,
        code: err.response?.status,
      };
    }
  }

  async login(phone, code, password) {
    console.log('hello im called');
    if (this.state.authenticatingProtocol === 'password') {
      try {
        const data = await passHandler.login({ phone, password });
        this.afterAuth(data.user, data.token);
        return { isOk: true };
      } catch (err) {
        return {
          isOk: false,
          message: err.response?.data?.message ?? err.message,
        };
      }
    } else
      try {
        const data = await otpHandler.login({ phone, code });
        this.afterAuth(data.user, data.token);
        return { isOk: true };
      } catch (err) {
        return {
          isOk: false,
          message: err.response?.data?.message ?? err.message,
        };
      }
  }

  async signup(user) {
    try {
      const data = await otpHandler.signup(user);
      this.afterAuth(data.user, data.token);
      return { isOk: true };
    } catch (err) {
      return {
        isOk: false,
        message: err.response?.data?.message ?? err.message,
      };
    }
  }

  handleCode = async (e) => {
    e.preventDefault();

    let {
      activationCode,
      countryCode,
      phoneNumber = '0',
      firstName,
      lastName,
      username,
      password,
    } = this.state;
    if (!countryCode) {
      countryCode = '98';
    }
    if (!activationCode) {
      alert('enter activation code!');
    }
    let req = {
      activationCode,
      phoneNumber: countryCode + fNum(phoneNumber),
    };

    const response = await (this.state.authStatus.includes('signup')
      ? this.signup({
          firstName,
          lastName,
          username,
          password,
          phone: req.phoneNumber,
          code: activationCode,
        })
      : this.login(req.phoneNumber, activationCode));
    if (!response.isOk) return toast.error(response.message);

    return this.setState((s) => ({ ...s, authStatus: 'success' }));
  };
  handleSignup = async (e) => {
    e.preventDefault();
    const {
      countryCode,
      phoneNumber,
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    } = this.state;
    const { t } = this.props;
    if (confirmPassword !== password) {
      toast.error(t('passwords-do-not-match'));
      return;
    }
    let fd = countryCode || '98';
    if (!firstName || firstName === '') {
      toast(t('fill everything!'), {
        type: 'error',
      });
      return;
    }

    if (!lastName || lastName === '') {
      toast(t('fill everything!'), {
        type: 'error',
      });
      return;
    }

    if (!username || username === '') {
      toast(t('fill everything!'), {
        type: 'error',
      });
      return;
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
      toast(t('Enter first name in persian!'), {
        type: 'error',
      });
      return;
    }
    if (!just_persian(lastName)) {
      toast(t('Enter last name in persian!'), {
        type: 'error',
      });
      return;
    }

    const response = await this.detect(fd + phoneNumber, true);
    if (!response.isOk) return toast.error(response.message);

    return this.setState((s) => ({
      ...s,
      authStatus: 'signup:active',
      timer: response.sms_time,
      smsSendAt: new Date(),
    }));
  };

  handleDetect = async (e) => {
    e.preventDefault();
    let fd = this.state.countryCode || '98';
    let number = this.state.phoneNumber || '0';
    let captcha = this.state.captcha;
    if (!number || number === '' || number === 0) {
      alert('enter phone number!');
      return;
    }
    if (!captcha || captcha === false || captcha === 'undefined') {
      alert('enter captcha');
      return;
    }
    number = number.substring(number.length - 10);

    this.setState((state) => ({
      ...state,
      thePhoneNumber: number,
      countryCode: fd,
      phoneNumber: number,
    }));
    let phoneNumber = fd + fNum(number);

    const detectRes = await this.detect(phoneNumber);

    if (!detectRes.isOk) return toast.error(detectRes.message);

    if (detectRes.needSignup) {
      return this.setState((state) => ({ ...state, authStatus: 'signup' }));
    }
    if (detectRes.needLogin) {
      return this.setState((state) => ({
        ...state,
        authStatus: 'login:active',
        timer: detectRes.sms_time,
        smsSendAt: new Date(),
      }));
    }
  };

  handleClearInterval = () => {
    clearInterval(this.myInterval);
    return 0;
  };

  componentDidUpdate(prevProp, prevState) {
    if (prevState.smsSendAt === this.state.smsSendAt) return;

    if (this.state.authStatus.includes('active'))
      this.myInterval = setInterval(() => {
        this.setState(({ timer }) => ({
          timer: timer > 0 ? timer - 1 : this.handleClearInterval(),
        }));
      }, 1000);
  }

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
      timer: globalTimerSet,
    });
  };

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }
  captchaAction(e) {
    if (e === true) {
      this.setState((state) => ({ ...state, captcha: true }));
    }
  }
  render() {
    const { firstName, lastName, username, timer, authStatus } = this.state;
    const { t } = this.props;
    if (authStatus === 'success') {
      return <Navigate to={this.props.redirectTo} replace />;
    }
    return (
      <div className={styles.container}>
        <ListGroup flush>
          {authStatus === 'detect' && (
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form onSubmit={this.handleDetect}>
                    <Row form>
                      <Col md="12" className="form-group ltr">
                        <label htmlFor="thepho">{t('phone number')}</label>

                        <InputGroup className="mb-3">
                          <InputGroupAddon type="prepend">
                            <FormSelect
                              onChange={(e) =>
                                this.setState((state) => ({
                                  ...state,
                                  countryCode: e.target.value,
                                }))
                              }>
                              <option value="98">+98</option>
                            </FormSelect>
                          </InputGroupAddon>
                          <FormInput
                            placeholder="**********"
                            id="thepho"
                            className={'iuygfghuji'}
                            type="tel"
                            dir="ltr"
                            onChange={(e) => {
                              this.setState((state) => ({
                                ...state,
                                phoneNumber: e.target.value,
                              }));
                            }}
                          />
                        </InputGroup>
                        <Captcha onActionSubmit={this.captchaAction} />
                      </Col>
                      <Button
                        block
                        type="submit"
                        className="center"
                        onClick={this.handleDetect}>
                        {t('get enter code')}
                      </Button>
                    </Row>
                    {/* <Row form></Row> */}
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
          {(authStatus === 'login:active' ||
            authStatus === 'signup:active') && (
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form
                    onSubmit={
                      this.state.authenticatingProtocol === 'password'
                        ? () => {}
                        : this.handleCode
                    }>
                    <button
                      onClick={() => {
                        if (this.state.authenticatingProtocol === 'password') {
                          this.setState((state) => ({
                            ...state,
                            authenticatingProtocol: 'otp',
                          }));
                        } else {
                          this.setState((state) => ({
                            ...state,
                            authenticatingProtocol: 'password',
                          }));
                        }
                      }}>
                      {t(this.state.authenticatingProtocol)}
                    </button>
                    <Row form>
                      <Col md="12" className="form-group">
                        <div
                          className={
                            'your-phone-number d-flex justify-content-sb'
                          }>
                          <div className={'flex-item '}>
                            {t('your phone number') + ':'}
                          </div>
                          <div className={'flex-item ltr'}>
                            {'+98' + this.state.phoneNumber}
                          </div>
                        </div>{' '}
                        {this.state.authenticatingProtocol === 'password' ? (
                          <InputGroup className="mb-3">
                            <FormInput
                              placeholder={'password'}
                              type="password"
                              className={'iuygfghuji'}
                              dir="ltr"
                              onChange={(e) => {
                                this.setState((state) => ({
                                  ...state,
                                  activationCode: e.target.value,
                                }));
                              }}
                            />
                          </InputGroup>
                        ) : (
                          <>
                            <>
                              <div className={'your-timer'}>
                                <div className={'flex-item '}>
                                  {Boolean(timer) && (
                                    <div
                                      className={'flex-item-relative center '}>
                                      <CircularProgress
                                        className={'red-progress'}
                                        thickness={2}
                                        size={60}
                                        variant="determinate"
                                        value={parseInt(
                                          (timer * 100) / globalTimerSet
                                        )}
                                      />
                                      <div className={'flex-item-absolute '}>
                                        {timer}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'start',
                                }}>
                                <label
                                  style={{ fontSize: 12 }}
                                  htmlFor="feEmailAddress">
                                  {t('enter sent code')}
                                </label>
                              </div>
                            </>
                            <InputGroup className="mb-3">
                              <FormInput
                                placeholder="_ _ _ _ _ _"
                                type="number"
                                className={'iuygfghuji'}
                                dir="ltr"
                                onChange={(e) => {
                                  this.setState((state) => ({
                                    ...state,
                                    activationCode: e.target.value,
                                  }));
                                }}
                              />
                            </InputGroup>
                          </>
                        )}
                      </Col>
                    </Row>
                    <Button
                      block={true}
                      type="submit"
                      className="center"
                      onClick={this.handleCode}>
                      {t('login')}
                    </Button>
                    {Boolean(!timer) && (
                      <div className={'flex-item-relative center '}>
                        <Button
                          outline={true}
                          type="button"
                          className="center btn-block outline the-less-important the-no-border"
                          onClick={(e) => {
                            if (this.state.authStatus.includes('signup'))
                              return this.handleSignup(e);
                            if (this.state.authStatus.includes('login'))
                              return this.handleDetect(e);
                          }}>
                          {t('Send code again?')}
                        </Button>
                      </div>
                    )}
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
          {authStatus === 'signup' && (
            <ListGroupItem
              className="p-3"
              style={{
                minHeight: '70vh',
                marginTop: '5rem',
                marginBottom: '5rem',
              }}>
              <Row>
                <Col>
                  <Form onSubmit={this.handleSignup}>
                    <Row form>
                      <Col md="12" className="form-group">
                        <label htmlFor="olfirstname">
                          {t('Your first name')}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder={t('First name (persian)')}
                            type="text"
                            id="olfirstname"
                            dir="rtl"
                            value={firstName}
                            onChange={(e) =>
                              this.setState((s) => ({
                                ...s,
                                firstName: e.target.value,
                              }))
                            }
                          />
                        </InputGroup>
                      </Col>

                      <Col md="12" className="form-group">
                        <label htmlFor="ollastname">
                          {t('Your last name')}
                        </label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder={t('Last name (persian)')}
                            type="text"
                            value={lastName}
                            id="ollastname"
                            dir="rtl"
                            onChange={(e) =>
                              this.setState((s) => ({
                                ...s,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </InputGroup>
                      </Col>

                      <Col md="12" className="form-group">
                        <label htmlFor="username">{t('Your username')}</label>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder={t('Username (persian)')}
                            type="text"
                            value={username}
                            id="username"
                            dir="rtl"
                            onChange={(e) =>
                              this.setState((s) => ({
                                ...s,
                                username: e.target.value,
                              }))
                            }
                          />
                        </InputGroup>
                      </Col>

                      <Col md="12" className="form-group ltr">
                        <label htmlFor="thepho">{t('phone number')}</label>

                        <InputGroup className="mb-3">
                          <InputGroupAddon type="prepend">
                            <FormSelect
                              disabled
                              onChange={(e) =>
                                this.setState((state) => ({
                                  ...state,
                                  countryCode: e.target.value,
                                }))
                              }>
                              <option value="98">+98</option>
                            </FormSelect>
                          </InputGroupAddon>
                          <FormInput
                            placeholder="**********"
                            disabled
                            id="thepho"
                            className={'iuygfghuji'}
                            type="tel"
                            dir="ltr"
                            value={this.state.phoneNumber}
                            onChange={(e) => {
                              this.setState((state) => ({
                                ...state,
                                phoneNumber: e.target.value,
                              }));
                            }}
                          />
                        </InputGroup>

                        <InputGroup className="mb-3">
                          <FormInput
                            placeholder={t('password')}
                            id="password"
                            dir="ltr"
                            type="password"
                            value={this.state.password}
                            onChange={(e) => {
                              this.setState((state) => ({
                                ...state,
                                password: e.target.value,
                              }));
                            }}
                          />
                          <FormInput
                            placeholder={t('confirm-password')}
                            id="confirm password"
                            dir="ltr"
                            type="password"
                            value={this.state.confirmPassword}
                            onChange={(e) => {
                              this.setState((state) => ({
                                ...state,
                                confirmPassword: e.target.value,
                              }));
                            }}
                          />
                        </InputGroup>

                        <Captcha onActionSubmit={this.captchaAction} />
                      </Col>
                    </Row>

                    <Row form>
                      <Col md="12" className="form-group"></Col>
                    </Row>
                    <Button
                      type="submit"
                      className="center btn-block"
                      onClick={this.handleSignup}>
                      {t('Register')}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          )}
          <SSO
            setLoading={(v) => this.setState((p) => ({ ...p, loading: v }))}
            onNext={this.afterSSO.bind(this)}
          />
        </ListGroup>
        {this.state.loading && (
          <Overlay>
            <Loading size={50} />
          </Overlay>
        )}
      </div>
    );
  }
}

export default withTranslation()(LoginForm);
