import React, { useCallback } from 'react';
// import {LinearProgress} from '@mui/material';
import Button from '@mui/material/Button';
import { NightsStay } from '@mui/icons-material';

import { useDispatch, useSelector, useStore } from 'react-redux';

import { CHANGE_THEME, changeTheme } from '@/functions';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {FileField,ImageField,ImageInput, FileInput, useInput} from 'react-admin';
// import API, {BASE_URL} from '@/functions/API';
// import {showFiles} from '@/components';
// import {useFormState} from 'react-final-form';
// API.defaults.headers.common['Content-Type'] = 'multipart/form-data';
// import { createSelector } from 'reselect'
// const selectTheme = createSelector(
//     (state) => state.theme,
//     (theme) => theme
// )

export default (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  // console.log('store', store);
  // console.clear();
  // console.log('props.photos',values.photos);
  // let {input} = useInput(props);
  let theme =
    useSelector((state) => {
      console.log('state', state);
      return state.theme;
    }) || 'dark';
  // let temTheme = theme;
  // if (temTheme === "light") {
  //   temTheme = "dark";
  // } else {
  //   temTheme = "light";
  // }
  localStorage.setItem('theme', theme);
  // useEffect(() => {
  //     console.log('dispatch');
  //     dispatch({ type: 'theme',data:!theme })
  //     // Safe to add dispatch to the dependencies array
  // }, [dispatch]);
  //
  const changeTheTheme = useCallback(() => {
    // console.log("changeTheme", (theme == "dark" ? "light" : "dark"));
    dispatch(changeTheme(theme == 'dark' ? 'light' : 'dark'));
  }, [dispatch]);

  // React.useEffect(() => {
  //     // console.log('React.useEffect UploaderField');
  //     // if (input.value) setV(input.value);
  //     setTheme
  // }, [theme]);
  console.log('theme', theme);
  return (
    <Button className={'darkModeB'} onClick={() => changeTheTheme()}>
      <NightsStay />
    </Button>
  );
};
