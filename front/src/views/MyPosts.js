import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'shards-react';
import { withTranslation } from 'react-i18next';

import PageTitle from '#c/components/common/PageTitle';
import Table from '#c/components/table/DataTable';
import { getMyPosts, deletePost } from '#c/functions/index';
import { dateFormat } from '#c/functions/utils';

class MyPosts extends React.Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      data: [],
      redirect: false,
      newText: 'You did not created a post until now! please create one...',
      buttonText: 'add new post',
      headCells: [
        {
          id: 'title',
          numeric: false,
          disablePadding: true,
          label: t('title'),
        },
        {
          id: 'status',
          numeric: false,
          disablePadding: true,
          label: t('status'),
        },
        // {id: 'views', numeric: false, disablePadding: true, label: t('Views count')},
        // {id: 'getContactData', numeric: false, disablePadding: true, label: t('click count')},
        // {id: 'createdAt', numeric: false, disablePadding: true, label: t('created at')},
        {
          id: 'updatedAt',
          numeric: false,
          disablePadding: true,
          label: t('updated at'),
        },
        {
          id: 'actions',
          numeric: false,
          disablePadding: true,
          label: t('actions'),
          edit: true,
          editAction: (_id) => {
            this.props.history.push('/edit-new-post/' + _id);
          },
          delete: true,
          deleteAction: (_id) => {
            deletePost(_id).then(() => {
              this.setState({ redirect: '/my-posts' });
            });
          },
        },
      ],
    };
    this.getMyPostsF();
  }

  getMyPostsF() {
    const { t } = this.props;
    getMyPosts().then((data = []) => {
      let newData = data.map((post = {}) => {
        if (post.createdAt) post.createdAt = dateFormat(post.createdAt);

        if (post.updatedAt) post.updatedAt = dateFormat(post.updatedAt);
        let title = '';
        let des = '';
        if (post['status']) {
          switch (post['status']) {
            case 'processing':
              title = t('waiting to review');
              des = 'bg-warning text-white text-center rounded p-3 iii';
              break;
            case 'published':
              title = t('confirmed');
              des = 'bg-success text-white text-center rounded p-3 iii';
              break;
            case 'canceled':
              title = t('canceled');
              des = 'bg-error text-white text-center rounded p-3 iii';
              break;
            case 'deleted':
              title = t('deleted');
              title = 'bg-error text-white text-center rounded p-3 iii';
              break;
            default:
              break;
          }
        }
        post.status = title;
        post.status_cl = des;
        return post;
      });

      this.setState({ data: newData });
    });
  }

  render() {
    let { t } = this.props;
    let { data, headCells, newText, buttonText } = this.state;
    // if (redirect) {
    //   return <Navigate to='/add-new-post'/>;
    // } else {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="12"
            title={t('my posts')}
            subtitle={t('user account')}
            className="text-sm-left"
          />
        </Row>

        <Row>
          <Col>
            <Card small className="mb-4">
              <CardBody className="p-0 pb-3">
                <Table
                  data={data}
                  headCells={headCells}
                  newText={newText}
                  buttonText={buttonText}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withTranslation()(MyPosts);
