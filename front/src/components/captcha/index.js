import React, { useEffect, useState, useRef } from 'react';
import useCaptcha from 'use-offline-captcha';
import Grid from '@mui/material/Grid';

const Captcha = ({ onActionSubmit, onActionValue = undefined,t }) => {
  const captchaRef = useRef();
  const [value, setValue] = useState();
  const userOpt = {
    type: 'numeric', // "mixed"(default) | "numeric" | "alpha"
    length: 6, // 4 to 8 number. default is 5
    sensitive: false, // Case sensitivity. default is false
    width: 110, // Canvas width. default is 200
    height: 35, // Canvas height. default is 50
    fontColor: '#000',
    background: 'rgba(255, 255, 255, .2)',
    borderColor: '#ddd',
  };
  const { gen, validate } = useCaptcha(captchaRef, userOpt);

  useEffect(() => {
    if (gen) gen();
  }, [gen]);

  return (
    <div className={'captcha-wrapper rtl'}>
      <label>{t('enter captcha')}</label>
      <div  className={'captcha-area'}>
        <div className={'captcha-image'}>
          <div ref={captchaRef}/>
        </div>
        <div className={'captcha-input'}>
          <input

            onChange={(e) => {
              setValue(e.target.value);
              onActionSubmit(validate(e.target.value));
              if (onActionValue) onActionValue(e.target.value);
            }}
            className={'ltr'}
            value={value}
          />
        </div>

      </div>
      {/* <button onClick={handleValidate}>Validate</button> */}
      {/* <button onClick={handleRefresh}>Refresh</button> */}
    </div>
  );
};

export default React.memo(Captcha);

