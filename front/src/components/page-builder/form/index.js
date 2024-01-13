import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Col, Row } from 'shards-react';

import { withTranslation } from 'react-i18next';

import { toast } from 'react-toastify';

import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import CreateForm from '#c/components/form/CreateForm';

import { getEntity, setStyles, submitForm } from '#c/functions/index';

/**
 * Represents a form component.
 * @param {Object} props - The props for the form component.
 * @returns {JSX.Element} - The rendered form component.
 */
const Form = (props) => {
  const [tracks, settracks] = useState([]);
  const [theformFields, setformFields] = useState([]);
  const [trackingCodeBlock, setTrackingCodeBlock] = React.useState(false);
  const [response, setResponse] = React.useState([]);
  const [theload, settheload] = useState(false);
  let { element = {} } = props;
  let { data = {}, settings = {} } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { _id = '' } = fields;
  let params = data;
  if (!params.offset) {
    params.offset = 0;
  }
  if (!params.limit) {
    params.limit = 24;
  }
  const loadForm = async () => {
    getEntity('form', _id).then((resp) => {
      console.log('on line 49 ' + resp);
      afterGetData(resp);
    });
  };

  useEffect(() => {
    loadForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //

  const afterGetData = (resp, tracks = []) => {
    if (resp) {
      let formVals = [];
      let formFields = [];
      resp.data.elements.forEach((d) => {
        console.log('dd', d);
        let { settings = {}, children } = d;
        let { general = {} } = settings;
        let { fields = [] } = general;

        let {
          name,
          label,
          value = '',
          placeholder,
          classes,
          sm,
          lg,
          options,
          showStepsTitle,
          require,
        } = fields;
        let stylee = setStyles(fields);
        formFields[name] = value;
        let theChildren = [];
        if (children) {
          children.forEach(() => {
            theChildren.push(lastObj);
          });
        }
        let lastObj = {
          type: d.name || 'string',
          label: label || name,
          name: name,
          showStepsTitle: showStepsTitle,
          require: require,
          size: {
            sm: sm ? sm : 6,
            lg: lg ? lg : 6,
          },
          onChange: () => {
            // setFields([...fields,])
            // this.state.checkOutBillingAddress.add.data[d] = text;
          },
          style: stylee,
          className:
            'rtl ' +
            (classes
              ? classes.map((ob) => (ob.name ? ob.name : ob)).join(' ')
              : ''),
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
        formVals.push(lastObj);
      });
      setformFields({ ...formFields });
      settracks([...formVals]);
      settheload(false);
    } else {
      settheload(false);
    }
  };
  const loader = (
    <div className="loadNotFound loader " key={23}>
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070" />
    </div>
  );
  return (
    <div className="main-content-container fghjkjhgf ">
      <Row className={'m-0'}>
        {theload && loader}
        {!theload && (
          <Col
            className="main-content iuytfghj pb-5 "
            lg={{ size: 12 }}
            md={{ size: 12 }}
            sm="12"
            tag="main">
            <Row className={' p-3 productsmobile'}>
              {/*{JSON.stringify(tracks)}*/}
              {/*{JSON.stringify(theformFields)}*/}
              {theformFields && tracks && (
                <CreateForm
                  formFiledsDetail={fields}
                  rules={{ fields: tracks }}
                  onSubmit={async (e) => {
                    try {
                      const submitionResponse = await submitForm(_id, e);
                      setResponse(submitionResponse.data);
                      toast('اطلاعات با موفقیت ثبت شد', {
                        type: 'success',
                      });
                      if (submitionResponse.data.trackingCode) {
                        setTrackingCodeBlock(true);
                        setformFields([]);
                      }
                    } catch (err) {
                      toast('خطا', {
                        type: 'error',
                      });
                    }
                  }}
                  buttons={[]}
                  theFields={tracks}
                  fields={theformFields}
                />
              )}
            </Row>
          </Col>
        )}
        <Dialog
          style={{ direction: 'rtl' }}
          open={trackingCodeBlock}
          onClose={() => setTrackingCodeBlock(!trackingCodeBlock)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            <div
              style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#070935',
                width: '100%',
                borderBottom: '1px solid #e3e3ea',
                padding: '10px 5px',
              }}>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#070935',
                  display: 'block',
                  width: '100%',
                  padding: '0px 5px',
                }}>
                درخواست شما با موفقیت ثبت گردید
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '400',
                  color: '#777891',
                  display: 'block',
                  width: '100%',
                  padding: '5px 5px',
                }}>
                کد رهگیری شما در زیر آمده است , می توانید با کد رهگیری درخواست
                خود را پیگیری کنید
              </span>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {response && (
                <React.Fragment>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <CheckCircleOutlineIcon
                      color="success"
                      sx={{ fontSize: 80 }}
                    />
                  </div>
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '30px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}>
                    <span>کد رهگیری : </span>
                    <span>{response.trackingCode}</span>
                  </div>
                </React.Fragment>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="d-flex w-100 p-3 gap-3">
              <button
                onClick={() => setTrackingCodeBlock(!trackingCodeBlock)}
                className="w-50  btn btn-warning rounded "
                style={{ fontSize: '15px' }}
                autoFocus>
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
