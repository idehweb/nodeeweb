import React from 'react';

import {withTranslation} from 'react-i18next';

const Style = (props) => {
  console.log('props', props)
  let {css} = props;
  // let {styles} = props,styleString='';
  // styles.forEach(e => {
  //   let {selectors, style} = e,selec=[];
  //   selectors.forEach(selector => {
  //     let {name} = selector;
  //     selec.push(name);
  //   })
  //   console.log('push',selec);
  //   styleString+="."+selec.join(',.')+"{";
  //   Object.keys(style).forEach(st => {
  //     styleString+=st+":"+style[st]+";";
  //   })
  //   styleString+="}\n\n";
  // })
  return (
    <style>
      {css}
    </style>
  );
};

export default withTranslation()(Style);
