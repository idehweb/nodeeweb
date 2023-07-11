import { CHANGE_LOCALE, CHANGE_THEME, CHANGE_THEMEDATA, changeTheme } from "@/functions";
// import { useContext} from 'react';
// import store from 'store';
// import { ThemeName } from '../types';

// type State = ThemeName;
// type Action =
// | ReturnType<typeof changeTheme>
// | { type: 'OTHER_ACTION'; payload?: any };
let them = (localStorage.getItem("theme"));
// const themeReducer = (
//     previousState = them || 'light',
//     action
// ) => {
//     // const { store } = useContext(ReactReduxContext);
//     console.log('themeReducer...')
//     if (action.type === CHANGE_THEME) {
//         console.log('action',action);
//
//         console.log('action.payload',action.payload);
//         console.log('previousState', previousState, action);
//
//
//         return action.payload;
//     }
//
//     return previousState;
// };
// export default themeReducer;
export default function themeReducer(state = { theme: { them } }, action) {
  switch (action.type) {
    case CHANGE_THEME:
      // console.log("themeReducer",state, {theme: action.payload });
      return (action.payload=='dark' ? 'light' : 'dark');
    default: {
      console.log('here',state)
      return state;
    }
  }
  return state;
}
