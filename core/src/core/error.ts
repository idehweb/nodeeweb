import { join } from 'path';
import store from '../../store';
import { ErrorType, GeneralError } from '../../types/error';
import { MiddleWare, MiddleWareError } from '../../types/global';
import { errorDetector } from '../../utils/error';
import { getPublicDir } from '../../utils/path';
import logger from '../handlers/log.handler';
import { isExist } from '../../utils/helpers';

const notFoundHtml = new Map<string, string>();
async function getNotFoundHtmlPath(type: 'admin' | 'front') {
  // cached
  if (notFoundHtml.has(type)) return notFoundHtml.get(type);

  const rootPath = getPublicDir(type, true)[0];
  const possiblePaths = [
    join(rootPath, '404.html'),
    join(rootPath, 'index.html'),
  ];

  for (const pp of possiblePaths) {
    if (await isExist(pp)) {
      // save to cache
      notFoundHtml.set(type, pp);

      // serve
      return pp;
    }
  }

  return null;
}

export const errorHandler: MiddleWareError = (error, req, res, next) => {
  const ge = errorDetector(error);
  const isClosed = res.closed;
  if (Math.floor(ge.code / 100) === 5 || store.env.isLoc || isClosed)
    logger.error(ge);

  if (isClosed) return;

  return res.status(ge.code).json({
    status: 'error',
    message: ge.message,
    type: ge.type,
    error: store.env.isPro ? undefined : ge,
  });
};

const apiNotfound: MiddleWare = (req, res, next) => {
  return res.status(404).json({ status: 'error', message: 'path not found' });
};
const webNotfound: MiddleWare = async (req, res, next) => {
  const type = req.path.includes('/admin') ? 'admin' : 'front';
  res.setHeader('content-type', 'text/html');
  const filePath = await getNotFoundHtmlPath(type);
  if (!filePath) return res.status(404).send('not found');
  return res.status(404).sendFile(filePath);
};

export const notFoundHandler: MiddleWare = (req, res, next) => {
  const isApi = req.path.includes('/api');
  if (isApi) return apiNotfound(req, res, next);
  return webNotfound(req, res, next);
};

export function setErrorPackage() {
  store.globalMiddleware.error = {
    general: errorHandler,
    notFound: notFoundHandler,
  };
}
