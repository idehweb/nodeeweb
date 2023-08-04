import React, {useState} from "react";
import {Card, Col, Container, Row} from "shards-react";
import {withTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

import PageTitle from "#c/components/common/PageTitle";
import LoginForm from "#c/components/components-overview/LoginForm";
import {defaultImg} from "#c/assets/index";
import {savePost} from "#c/functions/index";

const Login = ({t}) => {
  console.clear()
  let params = useParams();

  if (params._state === 'goToCheckout') {
    savePost({goToCheckout: true})
  }
  if (params._state === 'goToChat') {
    savePost({goToChat: true})
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

            <LoginForm goToCheckout={params._state === 'goToCheckout'}/>
          </Card>
        </Col>
      </div>
    </Container>
  );
};

export default withTranslation()(Login);
