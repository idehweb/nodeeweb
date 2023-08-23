import { useEffect, useState } from 'react';
import { Container } from 'shards-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MainContent from '@/components/MainContent';
import { getPage, isClient, loadPost } from '@/functions';

import Loading from '@/components/Loading';
import store from '@/functions/store';

export default function Page(props) {
  const page = useSelector((st) => {
    return st.store.page || [];
  });
  const { firstName, lastName, internationalCode, token } =
    store.getState().store.user;
  const navigate = useNavigate();

  const params = useParams();
  const the_id = params._id;

  const [state, setState] = useState(isClient ? [] : page || []);

  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {
      getPage(_id).then((d = {}) => {
        if (d.success == false && d.access && d.access == 'private') {
          let redirect_url = '/login/';
          navigate(redirect_url);
          // }
        }
        if (d._id) {
          // savePost({
          //   mainList: d.mainList,
          //   catChoosed: d.catChoosed,
          //   countryChoosed: d.countryChoosed,
          //   categories: d.categories,
          //   maxWidth: d.maxWidth,
          //   elements: d.elements,
          //   kind: d.kind,
          //   mainCategory: d.mainCategory
          // });
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

    getThePost(the_id)
      .then((items) => {
        setState(items);
        if (isClient) window.scrollTo(0, 0);
        // }
      })
      .catch((e) => {
        setState(e);
      });
    // return () => mounted = false;
  }, [the_id]);

  let {
    load,
    title,
    description,
    photos,
    redirect,
    _id,
    thumbnail,
    kind,
    classes,
    excerpt,
    maxWidth,
    backgroundColor,
    notfound,
    enableAdmin = false,
    views = null,
    elements = null,
  } = state;
  if (redirect && isClient) return <Navigate to={redirect} />;
  if (!load && isClient) return <Loading />;
  if (load && notfound && isClient) return <div>not found</div>;

  return (
    <Container
      className={
        'main-content-container p-0 pb-4 kiuytyuioiu bg-white ' + classes
      }>
      <MainContent
        elements={elements}
        kind={kind}
        maxWidth={maxWidth}
        backgroundColor={backgroundColor}
      />
    </Container>
  );
}
export const PageServer = [
  {
    func: loadPost,
    params: '6217502008d0e437d6b4ad97',
  },
];
