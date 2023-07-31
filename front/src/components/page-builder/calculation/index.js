import React, {useEffect, useState} from "react";

import {Button, Col, Container, Row} from "shards-react";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";
import {Field, Form} from 'react-final-form'

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

const getURIParts = (url) => {
  var loc = new URL(url)
  return loc
}

const CalCulation = (props) => {
  console.log('CalCulation...', props)
  const [theload, settheload] = useState(false);
  const [tracks, settracks] = useState([]);

  const [text, setText] = useState('');
  const [nerkh, setNerkh] = useState(null);
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
    let {A, B, D, E,I} = v;
    // let c=A*B;

    B = returnNormalPrice(B);
    E = returnNormalPrice(E);
    A=parseInt(A)
    B=parseInt(B)
    E=parseInt(E)
    D=parseInt(D)
    console.log("A", A)
    console.log("B", B)
    console.log("D", D)
    console.log("E", E)
    // return
    setNerkh(B);
    let the_c = A * B,
      the_f = parseInt(D) * parseInt(E),
      the_g = (the_c + the_f) * 0.005,
      the_h = the_c + the_f + the_g,
      the_j = parseInt((I/100)*the_h),
      the_k = parseInt(0.01*the_j),
      the_l = parseInt(0.06*(the_j+the_h)),
      the_m = parseInt(0.03*(the_j+the_h)),
      the_z =(the_j+the_k+the_l+the_m)
    ;

    setC(the_c)

    setF(the_f)
    setG(the_g)
    setH(the_h)
    setJ(the_j)
    setL(the_l)
    setK(the_k)
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
            <Form
              onSubmit={onSubmit}
              initialValues={{
                A:'',
                B: (tracks && tracks[1] && tracks[1].price) ? returnNormalPrice(tracks[1].price) : 0,
                D: '',
                E: '',
                I:''
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
                          <option value={0}>
                            {'انتخاب کنید'}
                          </option>
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
                          <option value={0}>
                            {'انتخاب کنید'}
                          </option>
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
                      {/*<Col*/}
                        {/*className={'MGD '}>*/}
                        {/*<label htmlFor={'takhfif'}>{'تخفیف'}</label>*/}
                        {/*<Field*/}
                          {/*name={'takhfif'}*/}
                          {/*component="input"*/}
                          {/*placeholder={'تخفیف'}*/}
                          {/*type={"number"}*/}

                          {/*className="mb-2 form-control ltr"*/}
                        {/*/>*/}

                      {/*</Col>*/}
                      <div className="buttons">
                        <Button type="submit">
                          {'محاسبه کن'}
                        </Button>
                      </div>
                    </Row>
                  </Container>
                </form>)}
            />
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
            <span>ماخذ:</span>
            <span>{j.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>}
          {k && <div>
            <span>هلال احمر:</span>
            <span>{k.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>}
          {l && <div>
            <span>۶٪ مالیات:</span>
            <span>{l.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>}
          {m && <div>
            <span>۳٪ عوارض:</span>
            <span>{m.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>}
          {z && <div>
            <span>جمع کل:</span>
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
export default withTranslation()(CalCulation);
