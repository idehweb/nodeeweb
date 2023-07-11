import { CHANGE_THEMEDATA } from "@/functions";

export default function ThemeDataReducer(state = { themeData: {} }, action) {
  switch (action.type) {
    case CHANGE_THEMEDATA:
      console.log("ThemeDataReducer",{...state,themeData:action.payload});
      return action.payload;
    default:
      return state;
  }
  return state;
}