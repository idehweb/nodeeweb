import { toast } from 'react-toastify';

import { UserProps } from './index';

export async function detectUserState({ userState }: { userState: UserProps }) {
  if (!userState.captcha) {
    toast.error('Wrong Captcha!');
    return;
  } else {
    // update user state with the given values
    if (userState.phoneNumber.trim() === '' || userState.phoneNumber === '0') {
      toast.error('Phone Number Field is Empty');
      return;
    }
  }
}

export function captchaAction(e: boolean) {
  if (e) {
    //set user captcha pass to true
  }
}
