import store from '../../store';
import { ErrorType, GeneralError } from '../../types/error';
import { MiddleWare, MiddleWareError } from '../../types/global';
import logger from '../handlers/log.handler';

export const errorHandler: MiddleWareError = (error, req, res, next) => {
  let code = 500,
    message = error.message,
    err = error,
    extraProps: any = {};
  if (Math.floor(code / 100) === 5) logger.error(error);
  if (error instanceof GeneralError) {
    code = error.code;
    extraProps.type = error.type;
    message = error.message;
    err = error;
  }

  return res
    .status(code)
    .json({ status: 'error', ...extraProps, message, error: err });
};

export const notFoundHandler: MiddleWare = (req, res, next) => {
  return res.status(404).json({ status: 'error', message: 'path not found' });
};

export function setErrorPackage() {
  store.errorPackage = { general: errorHandler, notFound: notFoundHandler };
}
