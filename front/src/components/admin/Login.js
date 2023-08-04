import React,{useState} from "react";
import { Card, Col, Container, Row } from "shards-react";
import { withTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import PageTitle from "#c/components/common/PageTitle";
import AdminLoginForm from "#c/components/components-overview/AdminLoginForm";
import { defaultImg } from "#c/assets/index";
import { savePost } from "#c/functions/index";

// class Login extends React.PureComponent {
const Login = ({ t }) => {

  // constructor(props) {
  //   super(props);
  let params = useParams();

  console.log("params", params);
  if(params._state=='goToCheckout'){
    savePost({goToCheckout: true})
  }
  const [state, setState] = useState({
    customer: {
      phoneNumber: ""
    },
    noImage: defaultImg
  });


  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={t("login / register")}
          subtitle={t("user account")}
          className="text-sm-left"
        />
      </Row>

      <div className="w-100">
        <Col lg="4" className="mx-auto mb-4">
          <Card small>

            <AdminLoginForm/>
          </Card>
        </Col>
      </div>
    </Container>
  );
};

export default withTranslation()(Login);
