import React, { useCallback, useEffect, useRef, useState } from 'react';
import store from '#c/functions/store';
import { Navigate } from 'react-router-dom';
// import { SamplePic } from "#img/others/sample.jpg"
import { sampleImg } from '#assets/index';
import {
  Button,
  Col,
  Form,
  FormInput,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Row,
  FormCheckbox,
  FormRadio,
} from 'shards-react';
import {
  active,
  authCustomerForgotPass,
  authCustomerWithPassword,
  CameFromPost,
  checkCodeMeli,
  goToProduct,
  loginAdmin,
  savePost,
  setPassWithPhoneNumber,
} from '#c/functions/index';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createInstance } from '#c/functions/instance-api';
import InstancePatterns from './Pattern';
import InstanceDomains from './Domains';

function InstanceDetailForm({ t }) {
  const [response, setResponse] = useState({ status: 'none' });
  const domainsRef = useRef(null);
  const patternsRef = useRef(null);
  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const domains = domainsRef.current.getAdd();
    const pattern = patternsRef.current.getChecked();
    setResponse({ status: 'loading' });
    const result = await createInstance({
      domains,
      pattern,
      replica: 1,
      expiredAt: '2023-06-31',
    });
    if (!result) return setResponse({ status: 'error' });
    setResponse({ status: 'success', data: result });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (response.status === 'error') {
      toast('Error', { type: 'error' });
    }
    if (response.status === 'success') {
      toast('Success', { type: 'success' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [response.status]);

  return (
    <ListGroup flush>
      <ListGroupItem className="p-3">
        <Row>
          <Col>
            <Form>
              <InstancePatterns patternsRef={patternsRef} />
              <InstanceDomains domainsRef={domainsRef} />
              {response.status === 'loading' && <p>Loading...</p>}
              <Button
                block
                type="submit"
                className="center"
                onClick={onSubmit}
                disabled={response.status === 'loading'}>
                {t('create')}
              </Button>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  );
  // return (
  //   <ListGroup flush>
  //     <ListGroupItem className="p-3">
  //       <Row>
  //         <Col>
  //           <Form onSubmit={onSubmit}>
  //             <Row form>
  //               <Col md="12" className="form-group ltr">
  //                 <label htmlFor="websitename">
  //                   {t('choose witch website do yo want')}
  //                 </label>

  //                 <InputGroup className="mb-3">
  //                   <FormCheckbox
  //                     className={'terms-and-conditions-checkbox '}
  //                     // checked={rules}
  //                     // onChange={e => handleRules(e)}
  //                   >
  //                     <span>{'CMS'}</span>
  //                   </FormCheckbox>
  //                   <FormCheckbox
  //                     className={'terms-and-conditions-checkbox '}
  //                     // checked={rules}
  //                     // onChange={e => handleRules(e)}
  //                   >
  //                     <span>{'Company'}</span>
  //                   </FormCheckbox>
  //                   <FormCheckbox
  //                     className={'terms-and-conditions-checkbox '}
  //                     checked="cms"
  //                     // checked={rules}
  //                     // onChange={e => handleRules(e)}
  //                   >
  //                     <span>{'Ecommerce'}</span>
  //                   </FormCheckbox>
  //                   {/* <FormCheckbox
  //                     className={'terms-and-conditions-checkbox '}
  //                     // checked={rules}
  //                     // onChange={e => handleRules(e)}
  //                   >
  //                     <span>{'select me'}</span>
  //                   </FormCheckbox> */}
  //                 </InputGroup>
  //               </Col>
  //             </Row>
  //             <Row>
  //               <InputGroup className="mb-3">
  //                 <Col className="form-group ltr">
  //                   <FormRadio
  //                     className="RadioCheck"
  //                     onChange={handleChangeRadio}
  //                     checked={selected === 'yes'}
  //                     name="chooseRadio">
  //                     <img src={sampleImg} />
  //                   </FormRadio>
  //                   <FormRadio
  //                     className="RadioCheck"
  //                     onChange={handleChangeRadio}
  //                     checked={selected === 'yes'}
  //                     name="chooseRadio">
  //                     {/* <img src={MainUrl  /> */}
  //                   </FormRadio>
  //                   <FormRadio
  //                     className="RadioCheck"
  //                     onChange={handleChangeRadio}
  //                     checked={selected === 'yes'}
  //                     name="chooseRadio">
  //                     <img src={sampleImg} />
  //                   </FormRadio>
  //                 </Col>
  //               </InputGroup>
  //             </Row>
  //             {response.status === 'loading' && <p>Loading...</p>}
  //             <Button block type="submit" className="center" onClick={onSubmit}>
  //               {t('create')}
  //             </Button>
  //           </Form>
  //         </Col>
  //       </Row>
  //     </ListGroupItem>
  //   </ListGroup>
  // );
}

export default withTranslation()(InstanceDetailForm);
