import React, {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Col, Row} from "shards-react";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";
import CreateForm from "#c/components/form/CreateForm";

import {getEntity, isClient, setStyles, submitForm} from "#c/functions/index";

import {withTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const getURIParts = (url) => {
  var loc = new URL(url)
  return loc
}
const Form = (props) => {
 
  let navigate = useNavigate();
  const [tracks, settracks] = useState([]);
  const [theformFields, setformFields] = useState([]);
  const [trackingCodeBlock, setTrackingCodeBlock] = React.useState(false);
  const [response, setResponse] = React.useState([]);
  const [counts, setcount] = useState(0);
  const [theload, settheload] = useState(false);
  let {match, location, history, t, url} = props;
  let {element = {}} = props;
  let {data = {}, settings = {}} = element;
  let {general = {}} = settings;
  let {fields = {}} = general;
  let {entity = 'form', _id = ''} = fields;
  let mainParams = useParams();
  let params = data;
  if (!params.offset) {
    params.offset = 0
  }
  if (!params.limit) {
    params.limit = 24
  }
  url = isClient ? new URL(window.location.href) : "";
  let theurl = getURIParts(url);
  const loadForm = async () => {
    getEntity('form', _id).then((resp) => {
      afterGetData(resp);
    });
  };

  //
  // useEffect(() => {
  //   console.log("params.offset");
  //   loadProductItems(0);
  // }, [params.offset]);

  useEffect(() => {
    // console.log("params._id");
    loadForm();
  }, []);
  //

  const returnVariable = (d) => {
    let {settings = {}, children} = d;
    let {general = {}} = settings;
    let {fields = []} = general;
    let {name, label, value = '', placeholder, classes, sm, lg} = fields;
    let lastObj = {
      type: ch.name || 'string',
      label: label || name,
      name: name,

      size: {
        sm: 6,
        lg: 6,
      },
      onChange: (text) => {
        // setFields([...fields,])
        // this.state.checkOutBillingAddress.add.data[d] = text;
      },
      className: 'rtl ' + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : ""),
      placeholder: placeholder,
      child: [],
      children: children || [],
      value: value,
    };
    if (typeof data[d] == 'object') {
      lastObj.type = 'object';

    }
    if (typeof data[d] == 'number') {
      lastObj.type = 'number';
    }
    if (typeof data[d] == 'string') {

    }
  }
  const afterGetData = (resp, tracks = []) => {
    
    if (resp) {
      let {elements} = resp;

      let formVals = [];
      let formFields = [];
      // items.forEach((item) => {
      //   trackss.push(item);
      // });
      elements.forEach((d) => {
        console.log('dd', d)
        // formFields.push()
        let {settings = {}, children} = d;
        let {general = {}} = settings;
        let {fields = []} = general;
       
        let {name, label, value = '', placeholder, classes, sm, lg,options,showStepsTitle,require} = fields;
        let stylee = setStyles(fields);
        formFields[name] = value;
        let theChildren = [];
        if (children) {
          children.forEach((ch) => {
            theChildren.push(lastObj)
          })
        }
        let lastObj = {
          type: d.name || 'string',
          label: label || name,
          name: name,
          showStepsTitle:showStepsTitle,
          require:require,
          size: {
            sm:sm?sm: 6,
            lg: lg?lg:6,
          },
          onChange: (text) => {
            // setFields([...fields,])
            // this.state.checkOutBillingAddress.add.data[d] = text;
          },
          style : stylee,
          className: 'rtl ' + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : ""),
          placeholder: placeholder,
          child: [],
          children: children || [],
          options: options || [],
          value: value,
        };
        if (typeof data[d] == 'object') {
          lastObj.type = 'object';

        }
        if (typeof data[d] == 'number') {
          lastObj.type = 'number';
        }
        if (typeof data[d] == 'string') {

        }
        // console.log('type of ',d,typeof data[d])
        formVals.push(lastObj)

      })
      setformFields({...formFields})
      settracks([...formVals]);
      // setcount(count);
      settheload(false)

      // if (resp && resp.length < 1) sethasMoreItems(false);
    } else {
      // sethasMoreItems(false);
      // setLoad(false);
      settheload(false)

    }
  };
  const loader = (
    <div className="loadNotFound loader " key={23}>
      {t("loading...")}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );
  return (<div className="main-content-container fghjkjhgf ">

      <Row className={"m-0"}>
        {theload && loader}
        {!theload && <Col
          className="main-content iuytfghj pb-5 "
          lg={{size: 12}}
          md={{size: 12}}
          sm="12"
          tag="main">
          <Row className={" p-3 productsmobile"}>

            {/*{JSON.stringify(tracks)}*/}
            {/*{JSON.stringify(theformFields)}*/}
            {(theformFields && tracks) && <CreateForm formFiledsDetail={fields}
              rules={{fields: tracks}}
              onSubmit={(e) => {
                
                submitForm(_id, e).then(d => {
                  setResponse(d)
                  
                  if (d.success && d.message)
                    toast(t(d.message), {
                      type: "success"
                    });
                    
                    if(d.trackingCode){
                      setTrackingCodeBlock(true)
                    }else{
                      setTrackingCodeBlock(false)
                    }
                })
                // .catch(err => {
                //   console.log('ddddddddddd',err);
                //   toast(t('sth wrong happened!'), {
                //     type: "error"
                //   });
                // })
              }}
              buttons={[]}
              theFields={tracks}
              fields={theformFields}/>}

          </Row>

        </Col>}
        <Dialog
        style={{direction:'rtl'}}
        open={trackingCodeBlock}
        onClose={()=>setTrackingCodeBlock(!trackingCodeBlock)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{
            fontSize: '1rem',
            fontWeight: '700',
            color:'#070935',
            width:'100%',
            borderBottom:'1px solid #e3e3ea',
            padding:'10px 5px'
          }}>
            <span
             style={{
              fontSize: '1rem',
              fontWeight: '700',
              color:'#070935',
              display:'block',
              width:'100%',
              padding:'0px 5px'
            }}
            >
             درخواست شما با موفقیت ثبت گردید
            </span>
          <span
          style={{
            fontSize: '12px',
            fontWeight: '400',
            color:'#777891',
            display:'block',
            width:'100%',
            padding:'5px 5px'
          }}
          >
          کد رهگیری شما در زیر آمده است , می توانید با کد رهگیری درخواست خود را پیگیری کنید
          </span>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              response &&  (
                <React.Fragment>
                  <div style={{width:'100%',textAlign:'center'}}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80 }}/>
                  </div>
                  <div style={{width:'100%',textAlign:'center',marginTop:'30px',fontSize:'20px',fontWeight:'bold'}}>
                   <span>کد رهگیری : </span><span>{response.trackingCode}</span>
                  </div>
                </React.Fragment>


              )
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className='d-flex w-100 p-3 gap-3'>
          <button onClick={()=>setTrackingCodeBlock(!trackingCodeBlock)} className='w-50  btn btn-warning rounded ' style={{fontSize:'15px'}}  autoFocus>
          با تشکر
          </button>
          </div>
        </DialogActions>
      </Dialog>
      </Row>
    </div>
  );
};
export const HomeServer = [];
export default withTranslation()(Form);
