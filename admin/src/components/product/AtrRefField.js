import React from "react";
// import { useRecordContext } from "react-admin/dist/index";
import {
  ArrayInput,
  FormDataConsumer,
  CheckboxGroupInput,

  SelectInput,
  SimpleFormIterator,
  useInput,
  useRecordContext,
  useTranslate
} from "react-admin";
import API from "@/functions/API";

API.defaults.headers.common["Content-Type"] = "multipart/form-data";
let ckjhg = {};
let hasTriggered = false;

export default (props) => {
  // console.log('props',props);
  // console.log('CatRefField...',props);
  let { scopedFormData, getSource, source } = props;
  const translate = useTranslate();
  const record = useRecordContext();

  const { field } = useInput(props);
  const [v, setV] = React.useState([]);
  const [defaultV, setDefaultV] = React.useState((record && record.firstCategory && record.firstCategory.name) ? {
    value: record.firstCategory._id,
    label: record.firstCategory.name.fa
  } : {});
  const [g, setG] = React.useState([]);
  const [defaultG, setDefaultG] = React.useState((record && record.secondCategory && record.secondCategory.name) ? {
    value: record.secondCategory._id,
    label: record.secondCategory.name.fa
  } : {});
  const [d, setD] = React.useState([]);
  const [defaultD, setDefaultD] = React.useState((record && record.thirdCategory && record.thirdCategory.name) ? {
    value: record.thirdCategory._id,
    label: record.thirdCategory.name.fa
  } : {});
  const [selectS, setSelectS] = React.useState([true, true, true]);
  const ResetCats = () => {
    // console.log('ResetCats');
    props.returnToHome({ "secondCategory": null, "thirdCategory": null });
    setDefaultG(null);
    setDefaultD(null);
    // console.log('props.returnCatsValues',props.returnCatsValues());
  };
  const getData = () => {

    API.get("" + props.url, {}, {})
      .then(({ data = [] }) => {
        var cds = [];
        data.forEach((uf, s) => {
          cds.push({
            values: uf.values,
            value: uf._id,
            label: (uf.name && uf.name.fa) ? uf.name.fa : uf.name,
            key: s
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
      ckjhg["thirdCategory"] = _id;
      props.returnToHome(ckjhg);
    }

  };
  const triggerSecondInput = (t) => {
    if (!hasTriggered) {
      ckjhg["firstCategory"] = t;

      API.get("" + props.surl + "/" + t, {}, {})
        .then(({ data = [] }) => {
          // console.log('data', data);
          var cds = [];
          hasTriggered = true;
          if (data || data.values)
            setG(data.values);

        });
    }
  };
  const triggerThirdInput = (t) => {
    // console.log('triggerThirdInput', hasTriggered);
    if (!hasTriggered) {
      ckjhg["secondCategory"] = t;

      API.get("" + props.surl + "/" + t, {}, {})
        .then(({ data = [] }) => {
          // console.log('data', data);
          var cds = [];
          hasTriggered = true;
          setD(data);

        })
        .catch((err) => {
          console.log("error", err);
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
      ckjhg["firstCategory"] = _id;
      // props.returnToHome(ckjhg);
      API.get("" + props.surl + "/" + _id, {}, {})
        .then(({ data = [] }) => {
          console.log("data", data);
          let cds = [], catTemp = false;
          if (data && data.values && data.values[0]) {
            data.values.forEach((uf, s) => {
              cds.push({
                _id: uf._id,
                slug: uf.slug,
                name: (uf.name && uf.name.fa) ? uf.name.fa : uf.name,
                key: s
              });
              if (defaultG && defaultG.value === uf._id)
                catTemp = true;


            });
            console.log("setG", cds);

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
  const returnChoices = (attribute) => {
    let ddd=[]
    v.forEach((f)=>{
      if(f.value==attribute) {
              console.log('f',f)
               ddd=f.values
      }
    })
    console.log('ddd',ddd);
    return ddd;

  };
  const changeThirdInput = (t) => {
    // console.log('changeThirdInput', t);

    // console.log(t.target.options.selectedIndex,v[t.target.options.selectedIndex]);
    if (t && t.value) {
      // console.log(g);
      // let _id = g[t.target.options.selectedIndex - 1]._id;
      let _id = t.value;
      ckjhg["secondCategory"] = _id;
      props.returnToHome(ckjhg);

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
  console.log("g", g);
  // console.log('d', d);
  if (v)
    return (
      <>
        <ArrayInput source={source} label={translate("resources.product.attributes")}>
          <SimpleFormIterator {...props}>
            <FormDataConsumer>
              {({ scopedFormData, getSource, ...rest }) => {
                return <div className={"row mb-20"}>
                  <div className={"col-md-4"}>

                    {/*<Select*/}
                    {/*source={getSource("attribute")}*/}
                    {/*isRtl={true}*/}
                    {/*isLoading={selectS[0]}*/}
                    {/*isDisabled={selectS[0]}*/}
                    {/*className={"zindexhigh"}*/}
                    {/*defaultValue={defaultV}*/}
                    {/*onChange={changeSecondInput}*/}
                    {/*options={v}*/}
                    {/*/>*/}
                    <SelectInput

                      fullWidth
                      className={"mb-20"}
                      source={getSource("attribute")}

                      choices={v}
                      optionValue="value"
                      optionText="label"
                    />
                  </div>
                  <div className={"col-md-4"}>


                    <CheckboxGroupInput source={getSource("values")}
                                        choices={scopedFormData ? returnChoices(scopedFormData.attribute) : []}
                                        onChange={(e) => {
                                          console.log("e", e);
                                        }}
                                        optionValue="slug"
                                        optionText={"name."+translate("lan")}
                    />


                  </div>

                </div>;
              }}
            </FormDataConsumer>
          </SimpleFormIterator>
        </ArrayInput>
      </>
    );
  else
    return (<></>);
};
