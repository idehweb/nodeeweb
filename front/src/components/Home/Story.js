import React, {useEffect, useState} from 'react';
import Swiper from '#c/components/swiper';
import {getStoryList, MainUrl} from '#c/functions/index';
import StoryCard from '#c/components/Home/StoryCard';
import {withTranslation} from 'react-i18next'
import {Link} from 'react-router-dom';
import {blueImg,topsaleImg} from '#c/assets/index';
import {Col, Container, Row} from 'shards-react';

const Story = ({cat_id, delay = 2500, include,className='slider', t}) => {
  const [tracks, settracks] = useState([]);


  const loadProductItems = async () => {
    // if (cat_id)
    getStoryList(0, 12).then((resp) => {
      settracks(resp);
    });
    // else
    //   getPosts(0, 20, '').then((resp) => {
    //     // setLoadingMoreItems(false);
    //     // afterGetData(resp);
    //     settracks(resp);
    //
    //   });

    // }
  };
  useEffect(() => {
    loadProductItems();
  }, []);

  // console.clear();

  return (
    <div className={'ltr stories swiper-container swiper-related-products'}>
      {className=='slider' && <Swiper perPage={12} breakpoints={{
        1300: {
          perPage: 10,
        },
        1024: {
          perPage: 9,
        },
        768: {
          perPage: 7,
        },
        640: {
          perPage: 3,
        },
        320: {
          perPage: 3,
        }
      }}>
        {/*<div className={'swiper-slide'}>*/}
          {/*<div*/}
            {/*className="mb-4 ad-card-col nbghjk ">*/}
            {/*<div*/}
              {/*className="ad-card-main-di"*/}
            {/*><div*/}
              {/*className="card-post__image"*/}
            {/*><Link to={'/best'}>*/}
              {/*<img style={{maxWidth: 170}} src={topsaleImg} alt="sale-on-arvand"/>*/}

            {/*</Link>*/}
            {/*</div>*/}

            {/*</div>*/}
            {/*<div className={'item-miniTitle mt-2'}>{'پرفروش ترین ها'}</div>*/}

          {/*</div>*/}
        {/*</div>*/}

        {(tracks && tracks.length>0) && tracks.map((i, idx) => (
          <div className={'swiper-slide'} key={idx}><StoryCard item={i}/></div>
        ))}
        {/*<div className={'swiper-slide'}>*/}
          {/*<div*/}
            {/*className="mb-4 ad-card-col nbghjk ">*/}
            {/*<div*/}
              {/*className="ad-card-main-div rounded-circle nobor"*/}
            {/*><div*/}
              {/*className="card-post__image "*/}
            {/*><Link to={'/bests'}>*/}

            {/*</Link>*/}
            {/*</div>*/}

            {/*</div>*/}
            {/*<div className={'item-miniTitle mt-2'}></div>*/}

          {/*</div>*/}
        {/*</div>*/}

      </Swiper>}
      {/*{className!='slider' && <Row>*/}
        {/*{(tracks && tracks.length>0) && tracks.map((i, idx) => (*/}
          {/*<Col md={2} xs={6} className={'uytr mb-5'} key={idx}><StoryCard item={i}/></Col>*/}
        {/*))}*/}
      {/*</Row>}*/}

    </div>
  );
};

export default withTranslation()(Story);
