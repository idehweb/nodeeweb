import {CHANGE_THEME, changeTheme,CHANGE_LOCALE} from '@/functions';
// import { useContext} from 'react';

import { useStore } from 'react-redux'
// import store from 'store';
// import { ThemeName } from '../types';

// type State = ThemeName;
// type Action =
// | ReturnType<typeof changeTheme>
// | { type: 'OTHER_ACTION'; payload?: any };
let them=(localStorage.getItem('lan'));
const themeReducer = (
    previousState = them || 'en',
    action
) => {
    // const { store } = useContext(ReactReduxContext);
console.log("fff");
    if (action.type === CHANGE_LOCALE) {
        console.log('action',action);

        console.log('action.payload',action.payload);
        console.log('previousState', previousState, action);


        // return action.payload;
    }
    return previousState;
};

export default themeReducer;