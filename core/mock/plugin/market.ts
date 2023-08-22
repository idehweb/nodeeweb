import { Types } from 'mongoose';
import smsConfig from '../../plugin-market/sms/config.json';
import store from '../../store';
import { CORE_NODE_MODULE_PATH } from '../../utils/package';
import { join } from 'path';
export function getAllPluginMarket() {
  return [
    {
      _id: new Types.ObjectId(),
      name: smsConfig.name,
      icon: smsConfig.icon,
      author: smsConfig.author,
      type: smsConfig.type,
    },
  ];
}

export function getOne() {
  return smsConfig;
}

export function getPluginContentsUri(id: any) {
  return [
    { remote: 'add.dto.ts', local: '.' },
    { remote: 'edit.dto.ts', local: '.' },
    { remote: 'config.json', local: '.' },
    { remote: 'index.ts', local: '.' },
  ].map(({ local, remote }) => ({
    local,
    remote: join(CORE_NODE_MODULE_PATH, '..', 'mock', 'plugin', 'sms', remote),
  }));
}
