import React, {useEffect, useRef, useState} from "react";

import {Button, Col, Container, Row} from "shards-react";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";
import AddIcon from '@mui/icons-material/Add';
import {
  enableAdmin,
  enableAgent,
  enableSell,
  fetchCats,
  getEntities,
  getEntitiesWithCount,
  getEntity,
  getPath,
  getPosts,
  getPostsByCat,
  isClient,
  loadPosts,
  loadProducts,
  SaveData,
  setCountry
} from "#c/functions/index";
import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
import {withTranslation} from "react-i18next";
import {Field, Form} from 'react-final-form'

const getURIParts = (url) => {
  var loc = new URL(url)
  return loc
}

const Invc = (props) => {
  const [thecalc, setthecalc] = useState(false);
  const [theload, settheload] = useState(false);
  const [tracks, settracks] = useState([]);
  const divRef = useRef();

  const [text, setText] = useState('');
  const [nerkh, setNerkh] = useState(null);
  const [items, setItems] = useState([{item: '', description: '', qty: '', amountusd: '', unitprice: ''}]);
  const [dis, setDis] = useState('d-none');
  const [ans, setAns] = useState({});
  const [c, setC] = useState(null);
  const [f, setF] = useState(null);
  const [g, setG] = useState(null);
  const [h, setH] = useState(null);
  const [j, setJ] = useState(null);
  const [k, setK] = useState(null);
  const [l, setL] = useState(null);
  const [m, setM] = useState(null);
  const [z, setZ] = useState(null);
  const [o, setO] = useState(null);
  const [n, setN] = useState(null);
  const [p, setP] = useState(null);
  // const [C, settheload] = useState(false);
  let {element = {}, params = {}, t} = props;

  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  const onSubmit = async v => {
    console.log('onSubmit', v)
    // if (props.onSubmit) {
    let {A, B, D, E, I} = v;
    // let c=A*B;
    console.log("A", A)
    console.log("B", B)
    B = returnNormalPrice(B);
    // return
    setNerkh(B);
    let the_c = A * B,
      the_f = D * E,
      the_g = (the_c + the_f) * 0.005,
      the_h = the_c + the_f + the_g,
      the_j = (I / 100) * the_h,
      the_k = 0.01 * the_j,
      the_l = 0.06 * (the_j + the_h),
      the_m = 0.03 * (the_j + the_h),
      the_z = (the_j + the_k + the_l + the_m)
    ;

    setC(the_c)

    setF(the_f)
    setG(the_g)
    setH(the_h)
    setJ(the_j)
    setL(the_l)
    setM(the_m)
    setZ(the_z)
    // console.log('c',c)
    // }
  }
  const afterGetData = (resp, tracks = []) => {
    console.log('afterGetData', resp, tracks)
    console.log('set data:', resp)
    settracks(resp);
    // setcount(count);
    settheload(false)

  };
  // console.log('general', general)
  // console.log('params', params)
  // const params = useParams();
  const returnNormalPrice = (price) => {
    // console.log('price',price)
    // return
    if (price) {

      price = price.toString().trim();
      let p = price.split(/\s+/)
      p = parseInt(p.toString().replace(/,/g, ""))
      // console.log('p', p)
      return p
    }
  }
  const loadProductItems = async (page, filter = {}) => {
    settracks([])
    settheload(true)
    let query = {};

    // let newOffset = (await offset) + 24;
    getEntity('settings', 'get-exchange-rate').then((resp) => {
      // setLoadingMoreItems(false);
      afterGetData(resp);
    });
  };


  useEffect(() => {
    console.log("params._id");
    loadProductItems(0);
  }, []);
  //
  let trStyle = {
    borderWidth: '1px'
  }
  const handleTheClick = (v) => {
    console.log('v', v)

    let unitprice = 0
    let totalCount = 0
    if (v && v.items)
      v.items.forEach((itemv, j) => {
        v.items[j]['total'] = parseInt(itemv.unitprice) * parseInt(itemv.qty)
        unitprice += v.items[j]['total']
        // totalCount+=parseInt(itemv.qty)
      });
    let TOT = unitprice + parseInt(v.foc)
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(v.currency);
    v.currency=matches[1]
    setAns({...ans, ...v, TOT: TOT, unitprice: unitprice, totalCount: totalCount})
    // setDis('d-block')
    setTimeout(() => {
      handleClick();

    }, 1000)
  }
  const addMore = () => {
    items.push({item: '', description: '', qty: '', amountusd: '', unitprice: ''})
    console.log('addMore...')

    setItems([...items])

  }
  const handleClick = () => {

    var mywindow = window.open("", "PRINT", "height=400,width=600");

    mywindow.document.write("<html><head><title>" + document.title + "</title>");
    mywindow.document.write(" <style>\n" +
      "        .order-details td.product {\n" +
      "            text-align: left;\n" +
      "        }\n" +
      "\n" +
      "        th, td {\n" +
      "            vertical-align: top;\n" +
      "            text-align: left;\n" +
      "            font-size: 11px;\n" +
      "            padding: 0px 1px;\n" +
      "            border: 1px solid;\n" +
      "            border-collapse: collapse;\n" +
      "        }\n" +
      "        tr {\n" +
      "            border: 1px;\n" +
      "            border-collapse: collapse;\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        table {\n" +
      "            width: 100%;\n" +
      "            text-align: center;\n" +
      "            caption-side: bottom;\n" +
      "            border-collapse: collapse;\n" +
      "        }\n" +
      "\n" +
      "        body {\n" +
      "            padding: 10px;\n" +
      "            font-family: IRANSans;\n" +
      "            direction: ltr;\n" +
      "            line-height: 20px;\n" +
      "        }\n" +
      "\n" +
      "        p {\n" +
      "            display: inline-block;\n" +
      "        }\n" +
      "\n" +
      "        .order-details th {\n" +
      "            text-align: center;\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        .shop-name {\n" +
      "            margin-bottom: 0;\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        .shop-name h3 {\n" +
      "            margin-bottom: 0;\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        .document-type-label {\n" +
      "            margin-top: 0;\n" +
      "            margin-bottom: 0;\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        .textAlignR {\n" +
      "            text-align: left;\n" +
      "        }\n" +
      "\n" +
      "        .quantity {\n" +
      "            width: 60px;\n" +
      "        }\n" +
      "\n" +
      "        .order-data-addresses td {\n" +
      "            vertical-align: middle;\n" +
      "            padding: 10px;\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        .order-data-addresses tr td:nth-child(2) {\n" +
      "            text-align: left;\n" +
      "        }\n" +
      "\n" +
      "        table.order-data-addresses,\n" +
      "        table.order-data-addresses th,\n" +
      "        table.order-data-addresses td,\n" +
      "        table.order-details,\n" +
      "        table.order-details th,\n" +
      "        table.order-details td {\n" +
      "            vertical-align: middle;\n" +
      "            border: 1px solid black;\n" +
      "            border-collapse: collapse;\n" +
      "            font-size: 11px;\n" +
      "            line-height: 19px;\n" +
      "            padding: 2px 5px;\n" +
      "            background-color: #fff;\n" +
      "            color: #000;\n" +
      "        }\n" +
      "\n" +
      "        table.order-details {\n" +
      "\n" +
      "        }\n" +
      "\n" +
      "        .order-data-addresses, .order-details {\n" +
      "            margin-bottom: 0 !important;\n" +
      "        }\n" +
      "\n" +
      "        .order-data-addresses.totals {\n" +
      "            margin-bottom: 0 !important;\n" +
      "            margin-top: 0 !important;\n" +
      "\n" +
      "        }\n" +
      "\n" +

      "\n" +
      "\n" +
      "        table.order-details td.price,table.order-details th.price{\n" +
      "        width:120px !important;" +
      "        }" +
      "        .textAlignR input{\n" +
      "        width:100px !important;" +
      "        }" +
      "        #theprint textarea{\n" +

      "    float: left;\n" +

      "    line-height: 15px;" +
      "       }\n" +
      "        .width80,.textAlignR input.width80{\n" +
      "            width: 80px !important;\n" +
      "        }\n" +
      "        .price input,.quantity input{\n" +
      "            text-align: center !important;\n" +
      "        }\n" +
      "        #theprint input,#theprint textarea{\n" +
      "            border: none;\n" +
      "            width: 100%;\n" +
      "            font-family: IRANSans;\n" +
      "            display: inline-block;\n" +
      "        }\n" +
      "        .d-inline-block{\n" +
      "            display: inline-block !important;\n" +
      "            width: auto !important;" +
      "        }\n" +
      "        #theprint .item-name input{\n" +
      "            width: calc(100vw - 930px) !important;\n" +
      "            min-width: 500px;\n" +
      "        }\n" +
      "        .total_taxionf{\n" +
      "            width: 160px !important;\n" +
      "        }\n" +
      "\n" +
      "        #theprint .address{\n" +
      "            width: calc(100% - 50px) !important;\n" +
      "        }\n" +

      "        .minWidth250px{\n" +
      "            min-width: 200px !important;\n" +
      "            display: block;\n" +
      "        }\n" +
      "\n" +
      "        .kjhgf img {\n" +
      "            width: 65px !important;\n" +
      "        }\n" +

      "        .item-name input {\n" +
      "            width: 100% !important;\n" +
      "        }\n" +
      "        .width300 {\n" +
      "            width: 300px;\n" +
      "\n" +
      "        }\n" +
      "       .text-c,.text-c td{" +
      "text-align: center;" +
      "}" +
      "        .width100 , input.width100,#theprint input.width100{\n" +
      "            width: 100px !important;\n" +
      "\n" +
      "        }\n" +
      "        @media print {\n" +
      "        .no-print {\n" +
      "            display: none !important;\n" +
      "        }\n" +
      "        }\n" +
      "    </style>");
    mywindow.document.write("</head><body >");
    // mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write(divRef.current.outerHTML);
    mywindow.document.write("</body></html>");
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function () {


      mywindow.print();
      // mywindo//w.close();

      return true;
    }, 2000);
    // })


  };
  let {s0, s1, s2, s3, total, currency, TOT, hscode, transportby, amountusd, foc, unitprice, exporter, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20} = ans
  return (<div className="main-content-container fghjkjhgf ">

      <Row className={"m-0"}>
        {theload && loader}
        {(!theload && tracks) && <Col
          className="main-content iuytfghj pb-5"
          lg={{size: 12}}
          md={{size: 12}}
          sm="12"
          tag="main">

          <div className="fields pt-2">
            {thecalc && <Form
              onSubmit={onSubmit}
              initialValues={{
                A: 0,
                B: (tracks && tracks[1] && tracks[1].price) ? returnNormalPrice(tracks[1].price) : 0,
                D: 0,
                E: 0,
                I: 0
              }}
              mutators={{
                setValue: ([field, value], state, {changeValue}) => {
                  changeValue(state, field, () => value)
                },
              }}
              render={({
                         handleSubmit, form, submitting, pristine, values
                       }) => (
                <form onSubmit={handleSubmit}>
                  <Container>
                    <Row>

                      <Col
                        className={'MGD '}>
                        <label htmlFor={'A'}>{'TO:'}</label>
                        <Field
                          name={'A'}
                          component="input"
                          placeholder={'A'}
                          type={"number"}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        className={'MGD '}>
                        <label htmlFor={'B'}>{'INVOICE NO:'}</label>
                        <Field
                          name={'B'}
                          component="select"
                          placeholder={'B'}
                          type={"select"}

                          className="mb-2 form-control ltr"
                        >
                          {tracks && tracks.map((ch, c) => {
                            if (c)
                              return <option key={c} value={ch.price}>
                                {ch.currency}
                              </option>
                          })}
                        </Field>
                      </Col>
                      <Col
                        className={'MGD '}>
                        <label htmlFor={'D'}>{'کرایه'}</label>
                        <Field
                          name={'D'}
                          placeholder={'D'}
                          component="input"
                          type="number"
                          allowNull={true}
                          className="mb-2 form-control ltr"
                        />

                      </Col>

                      <Col
                        className={'MGD '}>
                        <label htmlFor={'E'}>{'نرخ ارز کرایه'}</label>
                        <Field
                          name={'E'}
                          component="select"
                          placeholder={'E'}
                          type={"select"}

                          className="mb-2 form-control ltr"
                        >
                          {tracks && tracks.map((ch, c) => {
                            if (c)
                              return <option key={c} value={ch.price}>
                                {ch.currency}
                              </option>
                          })}
                        </Field>

                      </Col>
                      <Col
                        className={'MGD '}>
                        <label htmlFor={'I'}>{'ماخذ'}</label>
                        <Field
                          name={'I'}
                          component="input"
                          placeholder={'I'}
                          type={"number"}

                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <div className="buttons">
                        <Button type="submit">
                          {'محاسبه کن'}
                        </Button>
                      </div>
                    </Row>
                  </Container>
                </form>)}
            />}
            <Form
              onSubmit={handleTheClick}
              initialValues={{}}
              mutators={{
                setValue: ([field, value], state, {changeValue}) => {
                  changeValue(state, field, () => value)
                },
              }}
              render={({
                         handleSubmit, form, submitting, pristine, values
                       }) => (
                <form onSubmit={handleSubmit}>
                  <Container>
                    <Row>
                      <Col
                        className={'MGD '}
                        lg={6} sm={12} md={12}>
                        <label htmlFor={'hscode'}>{'HS CODE'}</label>
                        <Field
                          name={'hscode'}
                          component="input"
                          placeholder={'HS CODE'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        className={'MGD '}>
                        <label htmlFor={'currency'}>{'CURRENCY:'}</label>
                        <Field
                          name={'currency'}
                          component="select"
                          placeholder={'CURRENCY'}
                          type={"select"}

                          className="mb-2 form-control ltr"
                        >
                          <option value={''}>{'انتخاب کنید'}</option>

                          {tracks && tracks.map((ch, c) => {
                            if (c)
                              return <option key={c} value={ch.currency}>
                                {ch.currency}
                              </option>
                          })}
                        </Field>
                      </Col>

                      <Col
                        className={'MGD '}
                        lg={6} sm={12} md={12}>
                        <label htmlFor={'exporter'}>{'EXPORTER'}</label>
                        <Field
                          name={'exporter'}
                          component="input"
                          placeholder={'از'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        className={'MGD '}
                        lg={6} sm={12} md={12}>
                        <label htmlFor={'s0'}>{'TO'}</label>
                        <Field
                          name={'s0'}
                          component="input"
                          placeholder={'به'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s1'}>{'INVOICE NO'}</label>
                        <Field
                          name={'s1'}
                          component="input"
                          placeholder={'شماره فاکتور'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{'DATE'}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={'تاریخ'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'transportby'}>{'TRANSPORT BY'}</label>
                        <Field
                          name={'transportby'}
                          component="select"
                          type={"select"}

                          placeholder={'حمل و نقل توسط'}
                          className="mb-2 form-control ltr"
                        >
                          <option value={""}>
                            {"انتخاب کنید"}
                          </option>
                          <option value={"air"}>
                            {"AIR"}
                          </option>
                          <option value={"land"}>
                            {"LAND"}
                          </option>
                          <option value={"sea"}>
                            {"SEA"}
                          </option>
                        </Field>

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s3'}>{'COUNTRY OF ORIGIN:'}</label>
                        <Field
                          name={'s3'}
                          component="input"
                          placeholder={'کشور'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={12} sm={12} md={12}
                        className={'MGD '}>
                        <div className={'add-array'}>
                          {items && items.map((item, i) => {
                            return <div className={'row'}>
                              <Col
                                lg={4} sm={12} md={12}
                                className={'MGD '}>
                                <label
                                  htmlFor={'items[' + i + ']["description"]'}>{'DESCRIPTION AND QUALITIES OF GOODS'}</label>
                                <Field
                                  name={'items[' + i + ']["description"]'}
                                  component="input"
                                  placeholder={'شرح کالا'}
                                  className="mb-2 form-control ltr"
                                />

                              </Col>
                              <Col
                                lg={4} sm={12} md={12}
                                className={'MGD '}>
                                <label htmlFor={'items[' + i + ']["qty"]'}>{'QUANTITY'}</label>
                                <Field
                                  name={'items[' + i + ']["qty"]'}
                                  component="input"
                                  placeholder={'تعداد'}
                                  className="mb-2 form-control ltr"
                                />

                              </Col>
                              <Col
                                lg={4} sm={12} md={12}
                                className={'MGD '}>
                                <label htmlFor={'items[' + i + ']["unitprice"]'}>{'UNIT PRICE'}{currency}</label>
                                <Field
                                  name={'items[' + i + ']["unitprice"]'}
                                  component="input"
                                  placeholder={'قیمت واحد'}
                                  className="mb-2 form-control ltr"
                                />

                              </Col>


                            </div>
                          })}
                          <Button type="button" className={'add-button'} onClick={() => addMore()}>
                            <AddIcon/>
                          </Button>
                        </div>
                      </Col>

                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'foc'}>{'FREIGHT OF CHARGE'}</label>
                        <Field
                          name={'foc'}
                          component="input"
                          placeholder={'FREIGHT OF CHARGE:'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>


                    </Row>
                    <Row>

                    </Row>
                    <Row>
                      <div className="buttons">
                        <Button type="submit">
                          {'پرینت'}
                        </Button>
                      </div>
                    </Row>
                  </Container>
                </form>)}
            />
          </div>
          {/*<Button onClick={handleClick} className={"no-print"}>پرینت invoice</Button>*/}

          <div id={"theprint"} ref={divRef} className={dis}>
            <div>
              <h1 style={{textAlign: 'center'}}>
                INVOICE
              </h1>
            </div>
            <table className={'table'}
                   style={{direction: 'ltr', margin: 'auto', maxWidth: '100%', verticalAlign: 'baseline'}}>
              <tr style={trStyle}>
                <td colSpan={'2'}>
                  <div><span>TO:</span><span>{s0}</span></div>
                </td>
                <td colSpan={'2'} style={{borderWidth: '1px', verticalAlign: 'baseline'}}>
                  <div><span>EXPORTER:</span><span>{exporter}</span></div>

                </td>
                <td colSpan={"1"} style={{borderWidth: '1px'}}>
                  <div><span>INVOICE NO:</span><span>{s1}</span></div>
                  <div><span>DATE:</span><span>{s2}</span></div>

                </td>

              </tr>

              <tr style={trStyle}>

                <td colSpan={'2'}>
                  <div><span>COUNTRY OF ORIGIN:</span><span>{s3}</span></div>

                </td>

                <td colSpan={'2'}>
                  <div><span>HS CODE:</span><span>{hscode}</span></div>

                </td>
                <td colSpan={'1'}>
                  <div><span>TRANSPORT BY:</span><span>{transportby}</span></div>

                </td>

              </tr>

              <tr style={trStyle} className={'text-c'}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>ITEM</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>DESCRIPTION AND QUALITIES OF GOODS</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>QTY</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <div>UNIT PRICE</div>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>AMOUNT ({currency})</span>

                </td>


              </tr>

              {ans.items && ans.items.map((item, i) => {
                return <tr style={trStyle} className={'text-c'}>
                  <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                    <span>{(i + 1)}</span>

                  </td>
                  <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                    <span>{item.description}</span>

                  </td>
                  <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                    <span>{item.qty}</span>

                  </td>
                  <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                    <span>{item.unitprice}</span>

                  </td>
                  <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                    <span>{item.total}</span>

                  </td>

                </tr>

              })}
              <tr style={trStyle} className={'text-c'}>
                <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                  <span>AMOUNT ({currency}):</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'1'}>
                  <span>{unitprice}</span>

                </td>

              </tr>
              <tr style={trStyle} className={'text-c'}>
                <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                  <span>FREIGHT OF CHARGE:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'1'}>
                  <span>{foc}</span>

                </td>

              </tr>
              <tr style={trStyle} className={'text-c'}>
                <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'1'}>
                  <span>TOTAL AMOUNT:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'1'}>
                  <span>{TOT}</span>

                </td>

              </tr>
            </table>
          </div>

          <div className={'response-flex'}>
            {nerkh && <div>
              <span>نرخ ارز:</span>
              <span>{nerkh.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {c && <div>
              <span>ارزش ریالی:</span>
              <span>{c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {f && <div>
              <span>کرایه ریالی:</span>
              <span>{f.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {g && <div>
              <span>بیمه:</span>
              <span>{g.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {h && <div>
              <span>سیف:</span>
              <span>{h.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {j && <div>
              <span>ماخذ x سیف:</span>
              <span>{j.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {k && <div>
              <span>هلال احمر:</span>
              <span>{k.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {l && <div>
              <span>(HxJ)x0.06:</span>
              <span>{l.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {m && <div>
              <span>(HxJ)x0.03:</span>
              <span>{m.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
            {z && <div>
              <span>j+k+l+m:</span>
              <span>{z.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>}
          </div>
        </Col>}

      </Row>
      {text}
      {/*{cats && JSON.stringify(cats)}*/}
    </div>
  );
};
export const HomeServer = [];
export default withTranslation()(Invc);
