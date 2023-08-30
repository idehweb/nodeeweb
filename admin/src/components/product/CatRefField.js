import React from 'react';
import { useInput, useRecordContext } from 'react-admin';

import Select from 'react-select';

import API from '@/functions/API';
// import { useRecordContext } from "react-admin";

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
let ckjhg = {};
let hasTriggered = false;

export default (props) => {
  // console.log('props',props);
  // console.log('CatRefField...',props);

  const record = useRecordContext();

  const { field } = useInput(props);
  const [v, setV] = React.useState([]);
  const [defaultV, setDefaultV] = React.useState(
    record && record.firstCategory && record.firstCategory.name
      ? {
          value: record.firstCategory._id,
          label: record.firstCategory.name.fa,
        }
      : {}
  );
  const [g, setG] = React.useState([]);
  const [defaultG, setDefaultG] = React.useState(
    record && record.secondCategory && record.secondCategory.name
      ? {
          value: record.secondCategory._id,
          label: record.secondCategory.name.fa,
        }
      : {}
  );
  const [d, setD] = React.useState([]);
  const [defaultD, setDefaultD] = React.useState(
    record && record.thirdCategory && record.thirdCategory.name
      ? {
          value: record.thirdCategory._id,
          label: record.thirdCategory.name.fa,
        }
      : {}
  );
  const [selectS, setSelectS] = React.useState([true, true, true]);
  const ResetCats = () => {
    // console.log('ResetCats');
    props.returnToHome({ secondCategory: null, thirdCategory: null });
    setDefaultG(null);
    setDefaultD(null);
    // console.log('props.returnCatsValues',props.returnCatsValues());
  };
  const getData = () => {
    API.get('' + props.url, {}).then(({ data: { data = [] } }) => {
      var cds = [];
      data = data.data;
      data.forEach((uf, s) => {
        cds.push({
          value: uf._id,
          label: uf.name,
          key: s,
        });
      });
      setV(cds);
      setSelectS([false, true, true]);
      changeSecondInput(defaultV);
    });
  };
  // const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    getData();
    // if (field.value) setV(field.value);
  }, []);

  // const returnToHome = (t) => {
  //     let uytfd = t.target.options.selectedIndex - 1;
  //     console.log('returnToHome...', uytfd, g[uytfd]);
  //     if (g[uytfd]) {
  //         let _id = g[uytfd]._id;
  //         ckjhg['secondCategory'] = _id;
  //         props.returnToHome(ckjhg);
  //     }
  //
  // }
  const chooseThirdCat = (t) => {
    let uytfd = t.value;
    // console.log('returnToHome...', uytfd);
    if (uytfd) {
      let _id = uytfd;
      ckjhg['thirdCategory'] = _id;
      props.returnToHome(ckjhg);
    }
  };
  const triggerSecondInput = (t) => {
    if (!hasTriggered) {
      ckjhg['firstCategory'] = t;

      API.get('' + props.surl + '/' + t, {}, {}).then(({ data = [] }) => {
        // console.log('data', data);
        data = data.data;
        var cds = [];
        hasTriggered = true;
        setG(data);
      });
    }
  };
  const triggerThirdInput = (t) => {
    // console.log('triggerThirdInput', hasTriggered);
    if (!hasTriggered) {
      ckjhg['secondCategory'] = t;

      API.get('' + props.surl + '/' + t, {}, {})
        .then(({ data = [] }) => {
          // console.log('data', data);
          var cds = [];
          data = data.data;
          hasTriggered = true;
          setD(data);
        })
        .catch((err) => {
          console.log('error', err);
          // setProgress(0);
        });
    }
  };
  const changeSecondInput = (t, x = false) => {
    // console.log('changeSecondInput', t);
    // setG([]);
    // setDefaultG({});
    //
    // setD([]);
    // setDefaultD({});

    // console.log(t.target.options.selectedIndex,v[t.target.options.selectedIndex]);
    // if (t.target.options.selectedIndex) {
    if (t.value) {
      // console.log(v);
      let _id = t.value;
      // let _id = v[t.target.options.selectedIndex - 1]._id;
      ckjhg['firstCategory'] = _id;
      props.returnToHome(ckjhg);
      API.get('' + props.surl + '/' + _id, {}, {}).then(({ data = [] }) => {
        // console.log('data', data);
        data = data.data;
        let cds = [],
          catTemp = false;
        if (data && data[0]) {
          data.forEach((uf, s) => {
            cds.push({
              value: uf._id,
              label: uf.name,
              key: s,
            });
            if (defaultG && defaultG.value === uf._id) catTemp = true;
          });
          setG(cds);
          setD([]);
          setSelectS([false, false, true]);

          if (!catTemp) {
            setDefaultG({});
            changeThirdInput({});
          } else {
            // console.clear();
            // console.log('defaultG',defaultG,catTemp);
            changeThirdInput(defaultG);
          }
          // ResetCats();
        }
      });
    }
  };
  const changeThirdInput = (t) => {
    // console.log('changeThirdInput', t);

    // console.log(t.target.options.selectedIndex,v[t.target.options.selectedIndex]);
    if (t && t.value) {
      // console.log(g);
      // let _id = g[t.target.options.selectedIndex - 1]._id;
      let _id = t.value;
      ckjhg['secondCategory'] = _id;
      props.returnToHome(ckjhg);
      API.get('' + props.surl + '/' + _id, {}, {}).then(({ data = [] }) => {
        // console.log('data', data);
        var cds = [],
          catTemp = false;
        data = data.data = data.forEach((uf, s) => {
          cds.push({
            value: uf._id,
            label: uf.name,
            key: s,
          });
          if (defaultD && defaultD.value === uf._id) catTemp = true;
        });
        if (!catTemp) setDefaultD({});

        setD(cds);
        setSelectS([false, false, false]);
      });
    } else {
      setSelectS([false, false, false]);
    }
  };

  // React.useEffect(() => {
  //     console.log('v changged', v);
  //     // setV(v);
  //     // changeSecondInput(v);
  // }, [v]);
  // React.useEffect(() => {
  //     console.log('g changged', g);
  // }, [g]);
  // console.log('v', v);
  // console.log('g', g);
  // console.log('d', d);
  if (v)
    return (
      <>
        <div className={'row mb-20'}>
          <div className={'col-md-4'}>
            <Select
              isRtl={true}
              isLoading={selectS[0]}
              isDisabled={selectS[0]}
              className={'zindexhigh'}
              defaultValue={defaultV}
              onChange={changeSecondInput}
              options={v}
            />
          </div>
          <div className={'col-md-4'}>
            {g.length > 0 && (
              <Select
                isRtl={true}
                isLoading={selectS[1]}
                isDisabled={selectS[1]}
                className={'zindexhigh'}
                defaultValue={defaultG}
                onChange={changeThirdInput}
                options={g}
              />
            )}
          </div>
          <div className={'col-md-4'}>
            {d.length > 0 && (
              <Select
                isRtl={true}
                isLoading={selectS[2]}
                isDisabled={selectS[2]}
                className={'zindexhigh'}
                defaultValue={defaultD}
                onChange={chooseThirdCat}
                options={d}
              />
            )}
          </div>
        </div>
        {/*<select placeholder={'first category'} onChange={changeSecondInput}>*/}
        {/*<option id={0}>{'choose first category'}</option>*/}
        {/*{v && v.map((item, i) => {*/}
        {/*let t = false;*/}
        {/*console.log(record.firstCategory, item._id);*/}
        {/*if ((record && record.firstCategory && record.firstCategory._id) && record.firstCategory._id == item._id) {*/}
        {/*console.log('ji');*/}
        {/*t = true;*/}
        {/*triggerSecondInput(record.firstCategory._id);*/}
        {/*}*/}
        {/*// var t=*/}
        {/*return <option id={item._id} key={i} selected={t}>{item.name}</option>*/}
        {/*})}*/}
        {/*</select>*/}
        {/*<div></div>*/}
        {/*<select placeholder={'second category'} onChange={changeThirdInput}>*/}
        {/*<option id={0}>{'choose second category'}</option>*/}
        {/*{(g && g[0]) && g.map((item, i) => {*/}
        {/*let t1 = false;*/}

        {/*if ((record && record.secondCategory && record.secondCategory._id) && record.secondCategory._id == item._id) {*/}
        {/*t1 = true;*/}
        {/*triggerThirdInput(record.secondCategory._id);*/}

        {/*}*/}
        {/*return <option id={item._id} key={i} selected={t1}>{item.name}</option>*/}
        {/*})}*/}
        {/*</select>*/}
        {/*<div></div>*/}
        {/*<select placeholder={'third category'} onChange={chooseThirdCat}>*/}
        {/*<option id={0}>{'choose third category'}</option>*/}
        {/*{d && d.map((item, i) => {*/}
        {/*let t1 = false;*/}

        {/*if ((record && record.thirdCategory && record.thirdCategory._id) && record.thirdCategory._id == item._id) {*/}
        {/*t1 = true;*/}
        {/*}*/}
        {/*return <option id={item._id} key={i} selected={t1}>{item.name}</option>*/}
        {/*})}*/}
        {/*</select>*/}
      </>
    );
  else return <></>;
};
