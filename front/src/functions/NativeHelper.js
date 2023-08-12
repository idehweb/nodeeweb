import copy from 'copy-to-clipboard';
import { Plugins } from '@capacitor/core';
const { Clipboard, Share ,Browser} = Plugins;

export const CopyToClipboard = (txt, type = 'string') => {
  Clipboard.write({
    [type]: txt,
  });
  copy(txt);
};

export const CallPhoneNumber = async (url) => {
  console.log('url',url);
  await Browser.open({ url: url });
};

export const ShareAPI = (text = '') => {
  Share.share({
    text,
    title: 'TM-KSA',
    dialogTitle: 'Share Link',
  });
};
