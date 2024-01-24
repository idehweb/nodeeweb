import { SaveData } from '@/functions';

import { userInfoProps } from '.';

export function afterAuth({
  user,
  token,
}: {
  user: userInfoProps;
  token: string;
}) {
  console.log('im in save data ', user, token);
  // user.token = token;
  // user.user.phoneNumber = user.user.phone;
  if (!user) return;
  const userData = { ...user, token };
  SaveData({ user: userData, token });
  // return { isOk: true };
}
