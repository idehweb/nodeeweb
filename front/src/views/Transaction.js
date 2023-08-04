import React, {useEffect, useState} from "react";
import {Button, Container} from "shards-react";
import {useTranslation, withTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {updateTransactionStatus} from "../functions/index";
// import Loading from "#c/components/Loading";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";

function Transaction(props) {

  const [Status, setStatus] = useState(false);
  const [orderNumber, setOrderNumber] = useState(0);
  const [theload, setTheLoad] = useState(false);
  console.log('theload', theload)
  const {t} = useTranslation();
  const theParams = useParams();
  // let url = new URL(window.location.href);
  // const urlParams = new URLSearchParams(url);
  // console.log('urlParams',url,urlParams)

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log('params', params, theParams)
  // let Status=false;
  // let Status = url.searchParams.get("Status") || url.searchParams.get("status") || "";
  // let Authority = url.searchParams.get("Authority") || url.searchParams.get("trackId") || "";
  // if (Status == '1' || Status == 1) {
  //
  //   Status = 'OK';
  // }
  // if (Status == '2' || Status == 2) {
  //
  //   Status = 'OK';
  // }
  // this.state = {
  //   Status: Status,
  //   Authority: Authority
  // };
  useEffect(() => {
    if (params)
      updateTransactionStatus(theParams.method, params).then((theres) => {
        console.log('theres', theres)
        if (theres && theres.success) {
          setStatus('OK');
        }
        if (theres && theres.orderNumber) {
          setOrderNumber(theres.orderNumber);
        }
        setTheLoad(true)
      });
  }, [])


  // const {Status} = this.state;
  // const {t} = this.props;
  let tel = {};
  if (Status) {
    tel['title'] = t('Transaction was successful!');
    // tel['description']=t('Transaction was successful!');
  } else {
    tel['title'] = t('Transaction was unsuccessful!');
    // tel['description']=t('Transaction was successful! Please contact the admin!');
  }
  const Loading = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  // return Loading;
  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/*<Loading/>*/}
      {/*{Loading}*/}
      <div className="error">
        <div className="error__content">
          {!theload && <>{Loading}</>}
          {theload && <div>
            <h2>{t('order number') + ":" + orderNumber}</h2>
            <h3>{(Status ? t('Transaction was successful!') : t('Transaction was unsuccessful!'))}</h3>
            <p></p>
            {/*<p>{tel['description']}</p>*/}
            <Link to={"/"}><Button pill>&larr; {t('Go Back')}</Button></Link>
          </div>}
        </div>
      </div>
    </Container>
  );
}

export default withTranslation()(Transaction);
