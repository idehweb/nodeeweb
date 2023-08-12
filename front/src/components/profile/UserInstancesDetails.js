import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Form,
  CardTitle,
} from 'shards-react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { withTranslation } from 'react-i18next';
import PageTitle from '#c/components/common/PageTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InstanceDetailForm from '#c/components/components-overview/Instance/Form';
import { dateFormat } from '#c/functions/utils';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { getAllInstances } from '#c/functions/instance-api';
import { toast } from 'react-toastify';
import 'react-tagsinput/react-tagsinput.css';
import { deleteInstance } from '#c/functions/instance-api';
import InstanceEditForm from '../components-overview/Instance/EditForm';

const UserInstancesDetails = ({ t }) => {
  const [response, setResponse] = useState({ state: 'none' });
  const [formOpen, setFormOpen] = useState(false);
  const [EditOpen, setEditOpen] = useState(false);
  const [deleteState, setDelete] = useState({ state: 'none' });

  const getInstances = useCallback(async () => {
    const result = await getAllInstances();
    if (!result) return setResponse({ state: 'error' });
    setResponse({ state: 'success', data: result.instances });
  }, []);
  const toggleEdit = () => {
    setEditOpen(!EditOpen);
    console.log('toggleEdit');
  };
  const onDelete = useCallback(async (ins) => {
    setDelete({ state: 'loading' });
    const res = await deleteInstance(ins._id);
    if (!res) {
      toast('Error', { type: 'error' });
      setDelete({ state: 'none' });
      return;
    }
    setDelete({ state: 'none' });
    toast('Success', { type: 'success' });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  const toggleForm = (e) => {
    e?.preventDefault();
    // console.log('toggleForm');
    setFormOpen(!formOpen);
    console.log(formOpen);
  };
  useEffect(() => {
    getInstances();
  }, []);

  useEffect(() => {
    if (response.state === 'error')
      toast(t('somethings_wrong'), { type: 'error' });
  }, [response.state]);

  const columns = [
    { field: 'id', headerName: t('ID'), hide: true },
    { field: 'title', headerName: t('title'), flex: 1, sortable: false },
    { field: 'count', headerName: t('count'), sortable: false, width: 80 },
    { field: 'price', headerName: t('price'), sortable: false, width: 120 },
    {
      field: 'salePrice',
      headerName: t('salePrice'),
      sortable: false,
      width: 120,
    },
  ];

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <Col>
          <PageTitle
            sm="12"
            title={t('My instances details')}
            subtitle={t('user instances')}
            className=""
          />
        </Col>
        <Col>
          <Button onClick={toggleForm}>
            <AddCircleOutlineIcon />
          </Button>
        </Col>
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-2 pb-3">
              <Row>
                {response.state === 'success' &&
                  response.data.map((ins, i) => {
                    return (
                      <Col lg={12} md={12} sm={12} xs={12} key={i}>
                        <div className={'the-order mb-3'}>
                          <div className={'the-order-purple p-4'}>
                            <div className={'the-order-title'}>
                              <div className={'the-order-number'}>
                                <div>{t('status') + ': ' + t(ins.status)}</div>
                                <div className={'mb-2'}>
                                  {' '}
                                  {t('createdAt')}:{dateFormat(ins.createdAt)}
                                </div>
                                <div className={'mb-2'}>
                                  {' '}
                                  {t('expiredAt')}:{dateFormat(ins.expiredAt)}
                                </div>
                              </div>
                              <div className={'the-order-status '}>
                                <div>
                                  <span>{t('domains') + ':'}</span>
                                  <span>
                                    {ins.domains.map(
                                      ({ content, status, ns }, i) => (
                                        <div key={i + ''}>
                                          <a
                                            target="_blank"
                                            className={'gfdsdf'}
                                            href={`https://${content}`}>
                                            {content}
                                          </a>
                                          {ns && (
                                            <span className={'gfdsdf'}>
                                              ns : {ns.join(' , ')}
                                            </span>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <span>{t('memory') + ':'}</span>
                                  <span>
                                    <span className={'gfdsdf'}>
                                      {`${ins.memory}`}
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span>{t('replica') + ':'}</span>
                                  <span>
                                    <span className={'gfdsdf'}>
                                      {`${ins.replica}`}
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span>{t('CPU') + ':'}</span>
                                  <span>
                                    <span className={'gfdsdf'}>
                                      {`${ins.cpu}`}
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span>{t('disk') + ':'}</span>
                                  <span>
                                    <span className={'gfdsdf'}>
                                      {`${ins.disk}`}
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  {['up', 'down', 'error'].includes(
                                    ins.status,
                                  ) && (
                                    <Button
                                      onClick={() => onDelete(ins)}
                                      disabled={
                                        deleteState.state === 'loading'
                                      }>
                                      Delete
                                    </Button>
                                  )}
                                  <Button
                                    style={{
                                      padding: '5px !important',
                                      marginRight: '5px',
                                    }}
                                    onClick={toggleEdit}
                                    type="submit">
                                    <BorderColorIcon />
                                  </Button>
                                  {EditOpen && (
                                    <div className="popUp-edit">
                                      <div
                                        className="inside-pop-up-bg-edit"
                                        onClick={toggleEdit}></div>
                                      <div className="inside-pop-up-edit">
                                        <InstanceEditForm ins={ins} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {/* {`${ins.domains[1].content }`} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {formOpen && (
        <div className="popUp">
          <div className="inside-pop-up-bg" onClick={toggleForm}></div>
          <div className="inside-pop-up">
            <InstanceDetailForm />
          </div>
        </div>
      )}
    </Container>
  );
  // }
};

function TagsInput({ defaultTags }) {
  const [tags, setTags] = useState([]);
  const [val, setVal] = useState(null);
  console.log('this is', tags);
  // function handleKeyDown(e) {
  //   if (e.key !== 'Enter') return;
  //   const value = e.target.value;
  //   if (!value.trim()) return;
  //   setTags([...tags, value]);
  //   e.target.value = '';
  // }
  // function handleButtoni() {
  //   const value = e.target.value;
  //   if (!value.trim()) return;
  //   setTags([...tags, value]);
  //   e.target.value = '';
  // }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }
  return (
    <Card>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('call');

            setTags([...tags, val]);
            console.log(val);

            if (!val.trim()) return;
            setTags([...tags, val]);
            e.target.value = '';
          }}>
          {tags.map((tag, index, key) => (
            <div style={{ display: 'flex', gap: '5px' }}>
              <div className="tag-item" key={index}>
                <span className="text">{tag}</span>
                <span className="close" onClick={() => removeTag(index)}>
                  &times;
                </span>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex' }}>
            <input
              // onKeyDown={handleKeyDown}
              onChange={(e) => {
                setVal(e.target.value);
              }}
              type="text"
              className="tags-input"
              placeholder="Type somthing"
            />
            <Button
              // onClick={handleButtoni}
              style={{
                padding: '5px !important',
                marginRight: '5px',
              }}>
              <SaveAsIcon />
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}

export default withTranslation()(UserInstancesDetails);

// function is_domain(str)
// {
//  regexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;

//         if (regexp.test(str))
//           {
//             return true;
//           }
//         else
//           {
//             return false;
//           }
// }
