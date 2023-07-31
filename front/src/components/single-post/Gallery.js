import React, {useEffect, useRef} from 'react';
import Swiper from '#c/components/swiper';
import {MainUrl} from '#c/functions/index';
import { defaultImg } from "#c/assets/index";

function moveArrayItemToNewIndex(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};
const Gallery = (params) => {
  let photos = params.photos;
  let thumbnail = params.thumbnail;



  // let index=photos.find((element,index) => (params.thumbnail === element)? index : -1);
  let index=photos ? photos.indexOf(params.thumbnail) : -1;
  // console.log('galgal',index,params.thumbnail);
  if(index>-1){
    photos=moveArrayItemToNewIndex(photos,index,0);
  }

  return (
    <div className={'ltr mt-3'}>
      {(photos && photos.length>0) && <Swiper perPage={1}
              breakpoints={{}}
              pagination={true}
              arrows={true}
      >
        {photos.map((item, idx) => {
          return (<div className={''} key={idx}><img src={MainUrl + '/' + item}/></div>);
        })}

      </Swiper>}
      {((!photos || photos && photos.length===0) && thumbnail) && <div className={''}><img src={MainUrl + '/' + thumbnail}/></div>}
      {((!photos || photos && photos.length===0) && !thumbnail) && <div className={'the-defaultImg'}> <img src={defaultImg}/></div>}
    </div>
  );
};

export default Gallery;
