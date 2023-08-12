import React, {useState} from "react";
// import {Navigate} from "react-router-dom";
import PageTitle from "#c/components/common/PageTitle";
import {useNavigate} from 'react-router-dom';
import {Button, Card, Col, Container, Form, ListGroup, ListGroupItem, Row} from "shards-react";

import {deleteModel, isClient, loadPostItems, MainUrl} from "#c/functions/index";
import {withTranslation} from "react-i18next";
import {toast} from "react-toastify";

const Delete = ({model, _id, rules, t}) => {
  // console.log("\nPostSlider==================>");


  const [redirect, setredirect] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();
    console.log(model)
    console.log(_id)
    deleteModel(model, _id).then((s) => {
      if (s.success) {
        navigate(-1)
        toast(s.message, {
          type: "success"
        });
      }else{
        toast(s.message, {
          type: "error"
        });
      }

    });

  };
  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1)
  };
  if (redirect) {
    // return <Navigate to={redirect}/>;

  }
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={t("Delete")}
          className="text-sm-left"
        />
      </Row>

      <div className="w-100">
        <Col lg="4" className="mx-auto mb-4">
          <Card small>
            <ListGroup flush>
              <ListGroupItem className="p-3">
                <Row>
                  <Col>
                    <Form onSubmit={handleDelete}>
                      <Row form>

                        <Col md="12" className="form-group ltr">
                          <label htmlFor="thepho">{t("Are you sure to delete?")}</label>

                        </Col>

                      </Row>

                      <Button
                        block
                        type="submit"
                        className="center"
                        onClick={handleDelete}>
                        {t("Yes")}
                      </Button>
                      <Button
                        block
                        type="submit"
                        className="center"
                        onClick={handleCancel}>
                        {t("Cancel")}
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </ListGroupItem>

            </ListGroup>
          </Card>
        </Col>
      </div>
    </Container>
  );

};

export default withTranslation()(Delete);
