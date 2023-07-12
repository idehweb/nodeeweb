import React, { useState } from 'react';
// import {changeTheme} from './actions';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useLocale, useSetLocale, useTranslate } from 'react-admin';

// import {AppState} from '../types';
import LanguageIcon from '@mui/icons-material/Language';

import { DollarPrice } from '@/components';
import { changeLocale } from '@/functions';
//
// const useStyles = makeStyles({
//     label: {width: '10em', display: 'inline-block'},
//     button: {margin: '1em'},
// });

const Configuration = () => {
  const translate = useTranslate();
  const locale = useLocale();
  const setLocale = useSetLocale();

  // const classes = useStyles();
  const theLocale = useSelector((state) => {
    console.log('state', state, locale);
  });

  // const [variant, setVariant] = useState("contained");

  // const [theLocale, setTheLocale] = useStore('locale','fa');
  // const [theLocale, setTheLocale] = useStore('locale','fa');
  console.log('theLocale', theLocale, locale);
  const dispatch = useDispatch();
  // contained
  // outlined
  return (
    <Card>
      {/*<Title title={translate('pos.configuration')}/>*/}
      <CardContent>
        {/*<div className={classes.label}>{translate('pos.language')}</div>*/}
        <Button
          variant={locale === 'en' ? 'contained' : 'outlined'}
          className={'lang-button'}
          // color={locale === 'en' ? 'primary' : 'default'}
          onClick={() => {
            setLocale('en');
            dispatch(changeLocale('en'));
            console.log('setLocale', 'en');
          }}>
          en
        </Button>
        <Button
          variant={locale === 'fa' ? 'contained' : 'outlined'}
          className={'lang-button'}
          // color={locale === 'fa' ? 'primary' : 'default'}
          onClick={() => {
            setLocale('fa');
            dispatch(changeLocale('fa'));
            console.log('setLocale', 'fa');
          }}>
          fa
        </Button>
        <LanguageIcon />

        <DollarPrice />
      </CardContent>
    </Card>
  );
};

export default Configuration;
