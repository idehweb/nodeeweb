import { combineReducers } from 'redux';

import themeReducer from './themeReducer';
import themeDataReducer from './themeDataReducer';

export default combineReducers({
  theme: themeReducer,
  themeData: themeDataReducer,
});
