import React, {useEffect, useState,useRef} from "react";

import {Col, Row,Container,Button} from "shards-react";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";
import IRANSansWeb_font_eot from "#c/assets/styles/fonts/eot/IRANSansWeb.eot";
import IRANSansWeb_font_woff2 from "#c/assets/styles/fonts/woff2/IRANSansWeb.woff2";
import IRANSansWeb_font_woff from "#c/assets/styles/fonts/woff/IRANSansWeb.woff";
import IRANSansWeb_font_ttf from "#c/assets/styles/fonts/ttf/IRANSansWeb.ttf";
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

const Packinginvc = (props) => {
  console.log('CalCulation...', props)
  const [thecalc, setthecalc] = useState(false);
  const [theload, settheload] = useState(false);
  const [tracks, settracks] = useState([]);
  const divRef = useRef();

  const [text, setText] = useState('');
  const [nerkh, setNerkh] = useState(null);
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
    console.log('v',v)
setAns({...ans,...v})
    // setDis('d-block')
    setTimeout(()=>{
      handleClick();

    },1000)
  }
  const handleClick = () => {

    var mywindow = window.open("", "PRINT", "height=400,width=600");

    mywindow.document.write("<html><head><title>" + document.title + "</title>");
    mywindow.document.write(" <style>\n" +
      "        @font-face {\n" +
      "            font-family: IRANSans;\n" +
      "            font-style: normal;\n" +
      "            src: url(" + IRANSansWeb_font_eot + ");\n" +
      "            src: url(" + IRANSansWeb_font_eot + "?#iefix) format(\"embedded-opentype\")," +
      " url(" + IRANSansWeb_font_woff2 + ") format(\"woff2\")," +
      " url(" + IRANSansWeb_font_woff + ") format(\"woff\")," +
      " url(" + IRANSansWeb_font_ttf + ") format(\"truetype\")\n" +
      "        }\n" +
      "\n" +
      "\n" +
      "        .order-details td.product {\n" +
      "            text-align: right;\n" +
      "        }\n" +
      "\n" +
      "        th, td {\n" +
      "            vertical-align: top;\n" +
      "            text-align: right;\n" +
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
      "            direction: rtl;\n" +
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
      "            text-align: right;\n" +
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
      "            text-align: right;\n" +
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
let {s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16,s17,s18,s19,s20}=ans
  return (<div className="main-content-container fghjkjhgf ">

      <Row className={"m-0"}>
        {theload && loader}
        {(!theload && tracks) && <Col
          className="main-content iuytfghj pb-5 "
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
                I:0
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
                        <label htmlFor={'A'}>{'ارزش کالا'}</label>
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
                        <label htmlFor={'B'}>{'نرخ ارز'}</label>
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
              initialValues={{

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
                        className={'MGD '}
                      lg={6} sm={12} md={12}>
                        <label htmlFor={'s0'}>{'صادرکننده'}</label>
                        <Field
                          name={'s0'}
                          component="input"
                          placeholder={'صادرکننده'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s1'}>{'اظهارکننده'}</label>
                        <Field
                          name={'s1'}
                          component="input"
                          placeholder={'اظهارکننده'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{'گمرک ورودی'}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={'گمرک ورودی'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s3'}>{'برگه'}</label>
                        <Field
                          name={'s3'}
                          component="input"
                          placeholder={'برگه'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s4'}>{'فهرست'}</label>
                        <Field
                          name={'s4'}
                          component="input"
                          placeholder={'فهرست'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s5'}>{'کد گمرک'}</label>
                        <Field
                          name={'s5'}
                          component="input"
                          placeholder={'کد گمرک'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{'شماره ثبت(کوتاژ)'}</label>
                        <Field
                          name={'s6'}
                          component="input"
                          placeholder={'شماره ثبت'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s7'}>{'تاریخ'}</label>
                        <Field
                          name={'s7'}
                          component="input"
                          placeholder={'تاریخ'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s8'}>{'اقلام'}</label>
                        <Field
                          name={'s8'}
                          component="input"
                          placeholder={'اقلام'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s9'}>{'تداد بسته'}</label>
                        <Field
                          name={'s9'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s10'}>{'عطف'}</label>
                        <Field
                          name={'s10'}
                          component="input"
                          placeholder={'عطف'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s11'}>{'شماره بایگانی'}</label>
                        <Field
                          name={'s11'}
                          component="input"
                          placeholder={'شماره بایگانی'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s12'}>{'مانیفست'}</label>
                        <Field
                          name={'s12'}
                          component="input"
                          placeholder={'مانیفست'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s13'}>{'تاریخ مانیفست'}</label>
                        <Field
                          name={'s13'}
                          component="input"
                          placeholder={'تاریخ مانیفست'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>
                      <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s14'}>{'گیرنده'}</label>
                        <Field
                          name={'s14'}
                          component="input"
                          placeholder={'گیرنده'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s15'}>{'مسئول تسویه مالی(صاحب کالا)'}</label>
                        <Field
                          name={'s15'}
                          component="input"
                          placeholder={'مسئول تسویه مالی(صاحب کالا)'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s16'}>{'اجزا ارزش'}</label>
                        <Field
                          name={'s16'}
                          component="input"
                          placeholder={'اجزا ارزش'}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
                          className="mb-2 form-control ltr"
                        />

                      </Col>  <Col
                        lg={6} sm={12} md={12}
                        className={'MGD '}>
                        <label htmlFor={'s2'}>{''}</label>
                        <Field
                          name={'s2'}
                          component="input"
                          placeholder={''}
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
            <table className={'table'}
                   style={{direction: 'rtl', margin: 'auto', maxWidth: '100%', verticalAlign: 'baseline'}}>
              <tr style={trStyle}>
                <td rowSpan={'18'}></td>
                <td rowSpan={'7'} style={{borderWidth: '1px', verticalAlign: 'baseline'}} colSpan={'4'}>
                  <span>۱. صادر کننده:</span>
                  <span>ش:</span>
                  <div>{s0}</div>
                </td>
                <td colSpan={"2"} style={{borderWidth: '1px'}}>
                  <span>۱.اظهار نامه</span>
                  <div>{s1}</div>

                </td>
                <td style={{borderWidth: '1px'}}>
                  <span>الف:گمرک ورودی</span>

                </td>
                <td>
                  <span>{s2}</span>

                </td>
              </tr>

              <tr style={trStyle}>

                <td>
                  <span>۳.برگه</span>

                </td>
                <td rowSpan={'3'} style={{borderWidth: '1px', verticalAlign: 'baseline'}}>
                  <span>۴.فهرست</span>
<div>{s4}</div>
                </td>
                <td style={{borderWidth: '1px'}}>
                  <span>کد گمرک</span>

                </td>
                <td>
                  <span>{s5}</span>

                </td>
              </tr>
              <tr style={trStyle}>

                <td rowSpan={'2'}>
                  {s3}

                </td>
                <td style={{borderWidth: '1px'}}>
                  <span>شماره ثبت (کوتاژ)</span>

                </td>


                <td>
                  <span>{s6}</span>

                </td>

              </tr>
              <tr style={trStyle}>
                <td style={{borderWidth: '1px'}}>
                  <span>تاریخ</span>

                </td>


                <td>
                  <span>{s7}</span>

                </td>
              </tr>
              <tr style={trStyle}>

                <td style={{borderWidth: '1px'}}>
                  <span>۵.اقلام</span>

                </td>
                <td style={{borderWidth: '1px'}}>
                  <span>۶.ت بسته</span>

                </td>
                <td rowSpan={'2'} style={{borderWidth: '1px'}}>
                  <span>۷.عطف #</span>
                  {s10}
                </td>
                <td rowSpan={'2'}>
                  <span>ش بایگانی:</span>
                  {s11}
                </td>
              </tr>

              <tr style={trStyle}>

                <td rowSpan={'2'}>
                  <span>{s8}</span>

                </td>
                <td rowSpan={'2'} style={{borderWidth: '1px', verticalAlign: 'baseline'}}>
                  <span>{s9}</span>

                </td>

              </tr>
              <tr style={trStyle}>

                <td style={{borderWidth: '1px'}} rowSpan={'1'}>
                  <span>مانیفست:</span>
<span>{s12}</span>
                </td>


                <td>
                  <span>تاریخ:</span>
                  <span>{s13}</span>

                </td>

              </tr>
              <tr style={trStyle}>

                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'2'}>
                  <span>۸.گیرنده:</span>
                  <div>{s14}</div>

                </td>


                <td colSpan={'4'}>
                  <span>مسول تسویه مالی(صاحب کالا)</span>
                  <span>{s15}</span>

                </td>

              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۱۰.اجزا ارزش</span>
                  <span>{s16}</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۱۱.کد اجزا ارزش</span>

                </td>

              </tr>


              <tr style={trStyle}>

                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'2'}>
                  <span>۱۴.نماینده اظهار کننده:</span>

                </td>


                <td colSpan={'2'} style={{borderWidth: '1px'}}>
                  <span>۱۶.کشور مبدا CN</span>

                </td>
                <td colSpan={'2'} style={{borderWidth: '1px'}}>
                  <span>۱۵.کشور صادر کننده AE</span>

                </td>

              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۱۷.کشور طرف معامله TR</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۱۲.ش بارنامه:</span>

                </td>

              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'3'}>
                  <span>۱۸.هویت و ملیت وسیله حمل در ورود:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۱۹.ک:IR</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۲۰.شرایط تحویل FOB</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span></span>

                </td>

              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'4'}>
                  <span>۲۱.هویت و ملیت وسیله حمل در عبور از مرز:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۲۲.ارز و مبلغ کل فاکتور:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۲۳.نرخ ارز</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۲۴.نوع معامله</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'3'}>
                  <span>ایرانی</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>IR</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>TRL</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>4,700,877</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>444444</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>اعتبار اسنادی</span>

                </td>


              </tr>

              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۲۵.نوع حمل:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۲۶.کد حمل:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۲۲.محل تخلیه کد/استان:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'4'}>
                  <div>۲۸.اطلاعات مالی و بانکی،کد بانک:</div>
                  <div>شرایط پرداخت:</div>
                  <div>نام بانک: بانک انصار</div>
                  <div>شعبه: میدان فاطمی، شماره اعتباری اسنادی: ۹۷۸۶۵۴۳۲</div>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>دریایی</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span></span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۲۹.گمرک خروجی</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۳۰.محل ارزیابی کالا</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>منطقه ویژه اقتصادی بوشهر</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>sssss</span>

                </td>


              </tr>


              <tr style={trStyle}>
                <td rowSpan={'4'}>
                  ۲۹.بسته ها و شرح کالا
                </td>

                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={'4'}>
                  <div>کد ثبت سفارش:</div>
                  <div>نوع برند:</div>
                  <div>تعداد بسته:</div>
                  <div>ش قبض انبار:</div>
                  <div>ش پیگیری انبار:</div>
                  <div>شرح کالا:</div>
                  <div>شرح تجاری کالا:</div>

                </td>
                <td rowSpan={'4'} colSpan={'1'}>
                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۳۲.ش ق ۱:</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۳۳.کد کالا ۴۵۶۷۶۵</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۳۴.کشور سازنده CN</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۳۵.وزن ناخالص ۴۴۴۴۴۴۴۴۴۴</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۳۶.ماخذ ۵</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <div>بیمه: ۳۶۶۸۸۸۸</div>
                  <div>کرایه: ۳۶۶۸۸۸۸</div>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۳۸.وزن خالص ۵۶۷۵۶</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>۳۹.ص</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <div>۴۱.تعداد واحد کالا</div>
                  <div>wdcwdwedwed</div>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <div>۴۲.ارزش قلم کالا</div>
                  <div>wdcwdwedwed</div>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <div>۴۳.ک .</div>
                  <div>wdcwdwedwed</div>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'} rowSpan={'2'}>
                  ۴۴.اضافه اسناد:
                </td>
                <td style={{borderWidth: '1px'}} colSpan={'3'}>
                  <span>درصد تخفیف</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'3'}>
                  <span>نرخ حقوق</span>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۴۵. تعدیل</span>

                </td>


              </tr>
              <tr style={trStyle}>

                <td style={{borderWidth: '1px'}} colSpan={'3'}>
                  <span>نرخ سود</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'3'}>
                  <span>اسناد ضمیمه</span>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>۴۶.ارزش گمرکی قلم کالا</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} rowSpan={'11'}>
                  محاسبه حقوق
                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>نوع</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>مبنای محاسبه</span>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>ماخذ</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>مبلغ</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span>پ.ن</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>کد حساب اعتباری</span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'2'}>
                  <span>اطلاعات انبار</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'4'}>
                  <span>شرح حسابداری</span>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'4'} rowSpan={"8"}>
                  <div>نحوه پرداخت:</div>
                  <div>شماره ارزیابی:</div>
                  <div>شماره رسید:</div>
                  <div>مبلغ تضمین:</div>
                  <div>جمع هزینه های متفرقه:</div>
                  <div>جمع عوارض دریافتی:</div>

                </td>


              </tr>
              <tr style={trStyle}>


                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>

                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <span></span>

                </td>


              </tr>

            </table>
            <table className={'table'}
                   style={{direction: 'rtl', margin: 'auto', maxWidth: '100%', verticalAlign: 'baseline'}}>
              <tr style={trStyle}>
                <td style={{borderWidth: '1px', width: '33%'}} colSpan={'1'}>
                  <div>نتیجه رسیدگی گمرک:</div>
                  <div>نام و امضا ارزیاب:</div>
                </td>
                <td style={{borderWidth: '1px', width: '33%'}} colSpan={'1'}>
                  <div>نام و امضا کارشناس ارزیابی:</div>
                  <div>تاریخ و مهر سرویس ارزیابی:</div>

                </td>
                <td style={{borderWidth: '1px'}} colSpan={'1'}>
                  <div style={{textAlign: 'justify', direction: 'rtl'}}>
                    این اظهار نامه را با رعایت کلیه قوانین و مقررات موبوطه و با قبول کلیه تکالیف و مسئولیت های موضوع
                    تبصره ۲ ماده ۲۹ قانون ق.ا.گ و ماده ۶۴ آ.ا.ق.ا.گ تنظیم نمودم. تصریح مینمایم کلیه اسناد ضمیمه اظهار
                    نامه با اسناد بارگذاری شده در سامانه جامع امور گمرکی(پنجره واحد تجارت فرامرزی) از هر جهت مطابقت دارد
                    نام و امضای اظهار کننده/نماینده:
                  </div>
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
export default withTranslation()(Packinginvc);
