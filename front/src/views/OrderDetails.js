import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "shards-react";
import { withTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import PageTitle from "#c/components/common/PageTitle";
import { getMyOrder } from "#c/functions/index";
import { store } from "#c/functions/store";

import { dateFormat } from "#c/functions/utils";

const OrderDetails = ({ t }) => {
  let params = useParams();
  let { _id } = params;
  let [dat, setDat] = useState({});
  let [card, setCard] = useState([]);
  let [lan, setLan] = useState(store.getState().store.lan || "fa");

  let [headCells, setHeadCells] = useState([
    {
      id: "title",
      numeric: false,
      disablePadding: true,
      label: t("title")
    },
    {
      id: "count",
      numeric: false,
      disablePadding: true,
      label: t("count")
    },
    {
      id: "price",
      numeric: false,
      disablePadding: true,
      label: t("price")
    }
  ]);
  const getMyOrdersF = (_id) => {
    getMyOrder(_id).then((post) => {
      if (post.createdAt) post.createdAt = dateFormat(post.createdAt);
      if (post.updatedAt) post.updatedAt = dateFormat(post.updatedAt);
      if (post && post["sum"]) {
        post["sum"] =
          post["sum"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t(" UZS");

        if (post && post["amount"]) {
          post["amount"] =
            post["amount"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t(" UZS");
        }
        if (post && post["deliveryPrice"]) {
          post["deliveryPrice"] =
            post["deliveryPrice"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t(" UZS");
        }
        // link['kind']=t('product');
      }
      if (post && post["status"]) {
        switch (post["status"]) {
          case "processing":
            post["status"] = t("waiting to review");
            post["status_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          case "published":
            post["status"] = t("confirmed");
            post["status_cl"] =
              "bg-success text-white text-center rounded p-3 iii";
            break;
          case "complete":
            post["status"] = t("complete");
            post["status_cl"] =
              "bg-success text-white text-center rounded p-3 iii";
            break;
          case "indoing":
            post["status"] = t("indoing");
            post["status_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          case "makingready":
            post["status"] = t("makingready");
            post["status_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          case "canceled":
            post["status"] = t("canceled");
            post["status_cl"] =
              "bg-error text-white text-center rounded p-3 iii";
            break;
          case "deleted":
            post["status"] = t("deleted");
            post["status_cl"] =
              "bg-error text-white text-center rounded p-3 iii";
            break;
          case "inpeyk":
            post["status"] = t("inpeyk");
            post["status_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          case "checkout":
            post["status"] = t("checkout");
            post["status_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          case "cart":
            post["status"] = t("cart");
            post["status_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          default:
            break;
        }
      }
      if (post && post["paymentStatus"]) {
        switch (post["paymentStatus"]) {
          case "paid":
            post["paymentStatus"] = t("successful");
            post["paymentStatus_cl"] =
              "bg-success text-white text-center rounded p-3 iii";
            break;
          case "notpaid":
            post["paymentStatus"] = t("not paid");
            post["paymentStatus_cl"] =
              "bg-warning text-white text-center rounded p-3 iii";
            break;
          case "unsuccessful":
            post["paymentStatus"] = t("unsuccessful");
            post["paymentStatus_cl"] =
              "bg-error text-white text-center rounded p-3 iii";
            break;
          default:
            break;
        }
      }
      post.card.forEach((item, key) => {
        post.card[key]["id"] = item._id;
        post.card[key]["title"] = item.title[lan];
        if (item.price)
          post.card[key]["price"] = item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t(' UZS');
        if (item.salePrice)
          post.card[key]["salePrice"] = item.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t(' UZS');
      });

      setCard(post.card);
      setDat({ ...dat, ...post });

      return 0;

    });
  };
  useEffect(() => {

    getMyOrdersF(_id);


  }, []);
  const columns = [
    { field: "id", headerName: t("ID"), hide: true },
    { field: "title", headerName: t("title"), flex: 1, sortable: false },
    { field: "count", headerName: t("count"), sortable: false, width: 80 },
    { field: "price", headerName: t("price"), sortable: false, width: 120 },
    { field: "salePrice", headerName: t("salePrice"), sortable: false, width: 120 }
  ];

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="12"
          title={t("My order details")}
          subtitle={t("user account")}
          className="text-sm-left"
        />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-2 pb-3">
              <Row>

                <Col lg={12} md={12} sm={12} xs={12}>
                  <div className={"the-order mb-3"}>
                    <div className={"the-order-purple p-4"}>
                      <div className={"the-order-title"}>
                        <div className={"the-order-number"}>
                          <div>{t("Order #") + dat.orderNumber}</div>
                          <div className={"mb-2"}>  {t("Order Date")}:{dat.updatedAt}</div>
                        </div>
                        <div className={"the-order-status "}>
                          <div className={"mb-2"}>
                            <span>{t("Order Status") + ":"}</span><span className={dat.status_cl}><span
                            className={"gfdsdf"}>{t(dat.status)}</span></span>
                          </div>
                          <div>
                            <span>{t("Payment Status") + ":"}</span><span className={dat.paymentStatus_cl}><span
                            className={"gfdsdf"}>{dat.paymentStatus}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className={"the-order-body-table"}>
                        <div style={{ display: "flex", height: "100%" }}>
                          <div style={{ flexGrow: 1 }}>
                            {Boolean(card && card.length > 0) &&
                            <DataGrid
                              rows={card}
                              disableColumnFilter={true}
                              disableColumnMenu={true}
                              columns={columns}
                              columnBuffer={8}
                              hideFooterPagination={true}
                              hideFooter={true}
                              disableVirtualization
                              autoHeight={true}
                            />}
                          </div>
                        </div>
                      </div>
                      <div className={"the-order-body"}>
                        <table className={'width100darsad'}>
                          <tbody>
                          <tr> <td>
                            <div className={"the-order-body-line"}>
                              {t("Card Price")}
                              :
                              {dat.sum}
                            </div>
                            <div className={"the-order-body-line"}>
                              {t("Delivery Price")}
                              :
                              {dat.deliveryPrice}
                            </div>
                            <div className={"the-order-body-line"}>
                              {t("Total Price")}
                              :
                              {dat.amount}
                            </div>
                          </td>
                            <td>
                              {dat.deliveryDay && dat.deliveryDay.description && <div className={"the-order-body-line"}>
                                {t("Delivery Time")}
                                :
                                {dat.deliveryDay.description}
                              </div>}
                              {dat.billingAddress && <div className={"the-order-body-line"}>
                                {t("Address")}
                                :
                                {dat.billingAddress.StreetAddress}
                              </div>}
                            </td>

                          </tr>
                          </tbody>
                        </table>
                        <div className={"the-order-number"}>


                        </div>
                        <div className={"the-order-status "}>

                        </div>

                        <div className={"clear"}></div>
                      </div>
                      <div className={"the-order-body-table"}>
                        <div style={{ display: "flex", height: "100%" }}>
                          <div style={{ flexGrow: 1 }}>
                            {Boolean(dat.transaction && dat.transaction.length > 0) &&
                            <div className={"mt-3"}>
                              <div className={"the-header bold mb-2"}>{t("transaction list") + ":"}</div>
                              <div className={"flex-box row border-bottom-1px"}>
                                <div className={"flex-item col-md-4 bold sz-14"}>{t("transaction authority")}</div>
                                <div className={"flex-item col-md-4 bold sz-14"}>{t("amount")}</div>
                                <div className={"flex-item col-md-4 bold sz-14"}>{t("status code")}</div>
                              </div>
                              {dat.transaction.map((tt, xx) => {
                                return <div className={"flex-box row border-bottom-1px"} key={xx}>
                                  <div className={"hidden d-none"}>{tt._id}</div>
                                  <div className={"flex-item col-md-4 sz-13"}>{tt.Authority}</div>
                                  <div
                                    className={"flex-item col-md-4 sz-13"}>{tt.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + t("Rial")}</div>
                                  <div className={"flex-item col-md-4 sz-13"}>{tt.statusCode}</div>
                                </div>;
                              })}
                            </div>
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </Col>

              </Row>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  // }

};

export default withTranslation()(OrderDetails);
