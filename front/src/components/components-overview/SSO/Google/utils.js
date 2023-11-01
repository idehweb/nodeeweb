import { SaveData } from '@/functions';
import API from '@/functions/API';
import store from '@/functions/store';

export function getGoogleClientId(from) {
  return (from || store.getState().store.google)?.client_id;
}

export function isGoogleReady(from) {
  return Boolean(getGoogleClientId(from));
}

export async function makeGoogleReady() {
  const {
    data: {
      data: { config },
    },
  } = await API({ method: 'get', url: '/config/website' });

  if (!isGoogleReady(config?.auth?.google || {})) return false;

  SaveData({ google: config.auth.google });
  return true;
}
