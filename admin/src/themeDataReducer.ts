import { CHANGE_THEMEDATA } from '@/functions';

const DefaultState = {
  themeData: {},
};

export default function ThemeDataReducer(state = DefaultState, action) {
  switch (action.type) {
    case CHANGE_THEMEDATA:
      return action.payload;
    default:
      return state;
  }
}
