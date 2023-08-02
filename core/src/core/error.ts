import store from '../../store';
import { ErrorType, GeneralError } from '../../types/error';
import { MiddleWare, MiddleWareError } from '../../types/global';
import { errorDetector } from '../../utils/error';
import logger from '../handlers/log.handler';

export const errorHandler: MiddleWareError = (error, req, res, next) => {
  console.log('code is here');
  const ge = errorDetector(error);
  if (Math.floor(ge.code / 100) === 5 || store.env.isLoc) logger.error(ge);

  return res.status(ge.code).json({
    status: 'error',
    message: ge.message,
    type: ge.type,
    error: store.env.isPro ? undefined : ge,
  });
};

export const notFoundHandler: MiddleWare = (req, res, next) => {
  return res.status(404).json({ status: 'error', message: 'path not found' });
};

export function setErrorPackage() {
  store.globalMiddleware.error = {
    general: errorHandler,
    notFound: notFoundHandler,
  };
}
