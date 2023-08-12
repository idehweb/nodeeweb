import React from 'react';


import {withTranslation} from 'react-i18next';

const _404 = ({_x}) => {

  return (
    <div>
    <div>404</div>
    <div>{_x}</div>
    </div>
  );
};

export default withTranslation()(_404);
