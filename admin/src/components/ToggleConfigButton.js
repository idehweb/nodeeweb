import React from 'react';
// import {LinearProgress} from '@mui/material';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

import {BooleanInput, useLogin, useNotify, useTranslate} from 'react-admin';
import {NightsStay} from '@mui/icons-material';
import {CHANGE_THEME, changeTheme} from '@/functions';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {FileField,ImageField,ImageInput, FileInput, useInput} from 'react-admin';
// import API, {BASE_URL} from '@/functions/API';
// import {showFiles} from '@/components';
// import {useFormState} from 'react-final-form';
// API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
// import { createSelector } from 'reselect'
import {useDispatch, useSelector, useStore} from 'react-redux'
// const selectTheme = createSelector(
//     (state) => state.theme,
//     (theme) => theme
// )

export default (props) => {

    return (
      <Link to={'/configuration'}><Button className={"darkModeB"} onClick={()=>{

        }}>
          <SettingsIcon/>
      </Button></Link>
    );
};
