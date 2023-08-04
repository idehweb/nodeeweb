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
  setPassWithPhoneNumber,
  clearAdminState
} from "#c/functions/index";
import {withTranslation} from "react-i18next";
import {toast} from "react-toastify";

import {fNum} from "#c/functions/utils";

const globalTimerSet = 60

class LogoutForm extends React.Component {
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

  handleLogout = (e) => {
    e.preventDefault();
    clearAdminState();
        this.setState({
          redirect: '/admin/login'
        })

  };
  handleCancel = (e) => {
    e.preventDefault();
        this.setState({
          redirect: '/admin/dashboard'
        })

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
              <Form onSubmit={this.handleLogout}>
                <Row form>

                  <Col md="12" className="form-group ltr">
                    <label htmlFor="thepho">{t("Are you sure to logout?")}</label>

                  </Col>

                </Row>

                <Button
                  block
                  type="submit"
                  className="center"
                  onClick={this.handleLogout}>
                  {t("Logout")}
                </Button>
                <Button
                  block
                  type="submit"
                  className="center"
                  onClick={this.handleCancel}>
                  {t("Cancel")}
                </Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>

      </ListGroup>
    );

  }
}

export default withTranslation()(LogoutForm);
