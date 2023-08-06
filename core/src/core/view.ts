import { join } from 'path';
import store from '../../store';
import { getPublicDir } from '../../utils/path';
import logger from '../handlers/log.handler';
import { color } from '../../utils/color';
import { MiddleWare } from '../../types/global';

export function getViewHandler(): [string, MiddleWare] {
  const allPathExceptApi = '/:start(?!api):path(*)';
  return [
    allPathExceptApi,
    (_, res) => {
      res.sendFile(join(getPublicDir('front', true)[0], 'index.html'));
    },
  ];
}
