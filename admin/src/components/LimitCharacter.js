import React from 'react';
import { useState } from 'react';
import { TextInput, useTranslate } from 'react-admin';

export default () => {
  const [charLeft, setCharLeft] = useState({
    metatitle: 0,
    metadescription: 0,
  });
  const { metatitle, metadescription } = charLeft;
  const charLimit = { metatitle: 100, metadescription: 250 };
  const helperTextHandler = (e) => {
    if (e.target.name.includes('metatitle')) {
      setCharLeft({
        ...charLeft,
        metatitle: e.target.value.length,
      });
    }
    if (e.target.name.includes('metadescription')) {
      setCharLeft({
        ...charLeft,
        metadescription: e.target.value.length,
      });
    }
  };

  const translate = useTranslate();
  return (
    <>
      <TextInput
        fullWidth
        source={'metatitle.' + translate('lan')}
        label={translate('resources.product.metatitle')}
        inputProps={{ maxLength: 100 }}
        onChange={helperTextHandler}
        helperText={`${metatitle}/${charLimit.metatitle}`}
      />
      <TextInput
        multiline
        fullWidth
        source={'metadescription.' + translate('lan')}
        label={translate('resources.product.metadescription')}
        inputProps={{ maxLength: 250 }}
        onChange={helperTextHandler}
        helperText={`${metadescription}/${charLimit.metadescription}`}
      />
    </>
  );
};
