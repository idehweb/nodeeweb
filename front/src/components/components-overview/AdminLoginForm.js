import React from "react";
import store from "#c/functions/store";
import { Navigate } from "react-router-dom";

import {Button, Col, Form, FormInput, InputGroup, ListGroup, ListGroupItem, Row} from "shards-react";
import {
  active,
  authCustomerForgotPass,
  authCustomerWithPassword,
  CameFromPost,
  checkCodeMeli,
  goToProduct,
  loginAdmin,
  savePost,
  setPassWithPhoneNumber
} from "#c/functions/index";
import {withTranslation} from "react-i18next";
import {toast} from "react-toastify";

import {fNum} from "#c/functions/utils";

const globalTimerSet = 60

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    let st = store.getState().store;
    console.log('st', st.admin)
    this.state = {
      username: null,
      password: null,
      redirect: null
    };
    window.scrollTo(0, 0);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  handleLogin = (e) => {
    e.preventDefault();
    console.log('==> handleLogin()')
    let {username, password} = this.state;
    let {t} = this.props;
    loginAdmin(username, password).then((r) => {
      if (!r.success) {
        console.log('error', r)

        toast(r.message, {
          type: "error"
        });
      }
      if (r.success) {
        console.log('error', r)
        this.setState({
          redirect: '/admin/dashboard'
        })
        toast(r.message, {
          type: "success"
        });
      }

    }).catch(e => {
      console.log(e)
      console.log('local', store.getState().store)

      toast(e.message, {
        type: "error"
      });
    });
  };

  render() {
    const {
      redirect
    } = this.state;
    const {t} = this.props;
    if (redirect) {
      return <Navigate to={redirect}/>;

    }
    return (
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form onSubmit={this.handleLogin}>
                <Row form>

                  <Col md="12" className="form-group ltr">
                    <label htmlFor="thepho">{t("username")}</label>

                    <InputGroup className="mb-3">

                      <FormInput
                        placeholder={t("username")}
                        id="thepho"
                        className={"iuygfghuji"}
                        type="text"
                        dir="ltr"
                        onChange={(e) =>

                          this.setState({username: e.target.value})
                        }
                      />
                    </InputGroup>

                    <label htmlFor="oiuytgpaswword">
                      {t("password")}
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

                <Button
                  block
                  type="submit"
                  className="center"
                  onClick={this.handleLogin}>
                  {t("get enter code")}
                </Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>

      </ListGroup>
    );

  }
}

export default withTranslation()(LoginForm);
