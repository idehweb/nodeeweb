import React from "react";
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from "shards-react";

import store from "#c/functions/store";
import { dateFormat } from "#c/functions/utils";
import CreateForm from "#c/components/components-overview/CreateForm_old";
import { withTranslation } from "react-i18next";
import { getComments, getTheChaparPrice, getTheSettings, goToProduct, savePost, sendComment } from "#c/functions/index";
import { toast } from "react-toastify";
import FaceIcon from "@mui/icons-material/Face";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TextsmsIcon from "@mui/icons-material/Textsms";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";

class Comments extends React.Component {
  constructor(props) {
    super(props);

    const { t, id } = props;
    console.log("id", id);
    this.state = {
      lan: store.getState().store.lan || "fa",
      token: store.getState().store.user.token || "",
      user: store.getState().store.user || {},
      id: null,
      comments: [],
      commentForm: {
        add: {
          data: {
            Text: "",
            Rate: 5
          },
          fields: [
            {
              type: "selectOption",
              label: t("Rate"),
              size: {
                sm: 6,
                lg: 6
              },
              readValue: "no",
              returnEverything: true,
              onChange: (text) => {
                // console.clear();
                console.log("text", text);
                this.state.commentForm.add.data["Rate"] = text.name;
                this.state.commentForm.add.data["Rate"] = text.no;

              },
              selectOptionText: t("choose rate..."),
              className: "rtl",
              placeholder: t("Rate"),
              child: [],
              children: [
                { name: "1", no: 1 },
                { name: "2", no: 2 },
                { name: "3", no: 3 },
                { name: "4", no: 4 },
                { name: "5", no: 5 }
              ],
              value: ""
            },
            {
              type: "textarea",
              label: t("Comment"),

              size: {
                sm: 12,
                lg: 12
              },
              onChange: (text) => {
                this.state.commentForm.add.data["Text"] = text;
              },
              className: "rtl",
              placeholder: t("Your comment..."),
              child: [],
              id: "comment-box",
              value: ""
            },
            {
              type: "empty",
              size: {
                sm: 12,
                lg: 12
              },
              className: "height50",
              placeholder: "",
              child: []
            }
          ],
          buttons: [
            {
              type: "small",
              header: [],
              body: ["title", "text"],
              url: "/comment/",
              name: t("Send Comment"),
              className: "ml-auto  btn btn-accent ",
              parentClass: "pd-0",
              loader: true,
              size: {
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6
              },
              onClick: async (e) => {
                let ref = this;
                let { Rate, Text } = this.state.commentForm.add.data;
                let { lan } = this.state;

                if (!Rate) {
                  toast(t("Rate please!"), {
                    type: "error"
                  });
                  return;
                }
                if (!Text) {
                  toast(t("Enter your comment please!"), {
                    type: "error"
                  });
                  return;
                }
                let obj = {
                  rate: Rate,
                  text: {}
                };
                obj.text[lan] = Text;
                sendComment(id, obj).then((response) => {
                  // let len=
                  if (response) {
                    this.updateComments(id);
                    // this.setState({
                    //   address: response.customer.address,
                    //   modals: false
                    //
                    // });
                    // this.getSettings();
                  }
                });

              }
            }


          ]
        }
      }
    };
    // updateComments=(id);
    // this.getSettings();
    // onSetAddress(this.state.address[this.state.hover]);

  }

  updateComments = (id) => {
    getComments(id).then(res => this.setState({ comments: res, id: id }));

  };

  componentDidUpdate(props) {
    console.log("componentDidUpdate", props);
    let { id } = props;
    if (id != this.state.id)
      this.updateComments(id);
  }

  componentDidMount(props) {
    console.log("componentDidMount", props);


  }

  render() {
    const { t, _id } = this.props;
    let { commentForm, comments, lan } = this.state;

    return (
      [<Card className="mb-3 pd-1" key={0}>
        <CardHeader className={"pd-1"}>
          <div className="kjhghjk">
            <div
              className="d-inline-block item-icon-wrapper ytrerty"
              dangerouslySetInnerHTML={{ __html: t("Comments") }}
            />
            {/*<span><Button className={'floatR mt-2'}*/}
            {/*onClick={() => {*/}
            {/*this.onCloseModal()*/}
            {/*}}>{'+ ' + t('Add')}</Button></span>*/}
          </div>
        </CardHeader>
        <CardBody className={"pd-1"}>
          <Col lg="12">
            <Row className={"mt-4"}>
              <CreateForm
                buttons={commentForm.add.buttons}
                fields={commentForm.add.fields}/>

            </Row>
          </Col>
        </CardBody>
        <CardFooter className={"pd-1"}>
        </CardFooter>
      </Card>,
        comments.map((com, i) => <Card className="mb-3 p-3" key={i}>
          <CardHeader className={"pd-1"}>
            <Row>
              <Col lg={6} md={6} sm={6} xs={6} className={"text-right"}>
                <FaceIcon/>
                <span className={"ml-2 mr-2"}>{com.customer.firstName + " " + com.customer.lastName}</span>
              </Col>
              <Col lg={6} md={6} sm={6} xs={6} className={"text-left"}>

                <span className={"ml-2 mr-2"}>
                  <StarPurple500Icon/>
                <span className={"ml-2 mr-2"}>{(com.rate)}</span>
                  </span>
                |
                <span className={"ml-2 mr-2"}>
                  <AccessTimeIcon/>
                <span className={"ml-2 mr-2"}>{dateFormat(com.createdAt)}</span>
                  </span>
              </Col>
            </Row>
            <hr/>
          </CardHeader>
          <CardBody className={"pd-1"}>
            <Row>

              <Col lg="12" className={"p-4"}>
                <TextsmsIcon/>
                <span className={"ml-2 mr-2"}>{com.text[lan]}</span>
              </Col>
            </Row>
          </CardBody>
        </Card>)
      ]
    );
  }
}

export default withTranslation()(Comments);
