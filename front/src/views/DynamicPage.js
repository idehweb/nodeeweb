import React, { useEffect, useState } from 'react';
import { Container } from 'shards-react';
import { useParams } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

// import { dFormat, PriceFormat } from '#c/functions/utils';
import { useSelector } from 'react-redux';

import PageBuilder from '#c/components/page-builder/PageBuilder';
import {
  // addBookmark,
  // clearPost,
  // getPage,
  isClient,
  loadPost,
  // loveIt,
  // MainUrl,
  // savePost,
  getPageByPath,
} from '#c/functions/index';
// import { SnapChatIcon } from '#c/assets/index';
// import store from '../functions/store';

const DynamicPage = (props) => {
  // console.clear();
  let {
    // match,
    // location,
    // history,
    // t,
    // url,
    // elements,
    slug,
  } = props;
  console.log('props', props);
  const page = useSelector((st) => {
    return st.store.page || [];
  });
  const params = useParams();
  // let the_id = params._id;
  // const [mainId, setMainId] = useState(the_id);
  // const [tab, setTab] = useState('description');
  const [state, setState] = useState(isClient ? [] : page || []);
  // const [lan, setLan] = useState(store.getState().store.lan || 'fa');

  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {
      getPageByPath(_id).then((d = {}) => {
        if (d._id) {
          resolve({
            load: true,
            title: d.title,
            access: d.access,
            description: d.description,
            photos: d.photos,
            maxWidth: d.maxWidth,
            _id: d._id,
            updatedAt: d.updatedAt,
            kind: d.kind,
            classes: d.classes,
            elements: d.elements,
            thumbnail: d.thumbnail,
            excerpt: d.excerpt,
            views: d.views,
          });
        } else {
          reject({
            load: true,
            notfound: true,
          });
        }
      });
    });
  };

  useEffect(() => {
    if (!isClient) return;

    getThePost(slug)
      .then((items) => {
        setState(items);
        if (isClient) window.scrollTo(0, 0);
      })
      .catch((e) => {
        setState(e);
      });
  }, [slug]);
  // useEffect(() => {
  // }, []);
  let {
    // load,
    // title,
    // description,
    // photos,
    // redirect,
    // _id,
    // thumbnail,
    kind,
    // excerpt,
    maxWidth,
    // notfound,
    elements,
    // enableAdmin = false,
    // views = null,
  } = state;
  return (
    <Container
      className="main-content-container p-0 pb-4 kiuytyuioiu bg-white"
      key={0}>
      <div className={'the-body'} key={1}>
        <PageBuilder
          elements={elements}
          data={params}
          params={params}
          kind={kind}
          maxWidth={maxWidth}
        />
      </div>
    </Container>
  );
};
export const PageServer = [
  {
    func: loadPost,
    params: '6217502008d0e437d6b4ad97',
  },
];
export default withTranslation()(DynamicPage);
