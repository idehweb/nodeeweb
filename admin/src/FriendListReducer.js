import {CHANGE_THEME, changeTheme,CHANGE_LOCALE} from '@/functions';

export default function FriendListReducer(state = {friends : []}, action) {
  switch (action.type) {
    case 'ADD_FRIEND':
      return [
        { friends : action.payload.friend }, ...state.friends
      ]
    default:
      return state;
  }
  return state;
}