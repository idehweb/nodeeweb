import { join } from 'path';
import * as fs from 'fs';

export function wait(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export function axiosError2String(error: any) {
  if (!error.isAxiosError) {
    return error;
  }
  return JSON.stringify(
    {
      name: error.name,
      code: error.code,
      message: error.message,
      url: error?.request?._url || error?.config?.url,
      method: error.config?.method,
      res_data: error?.response?.data,
      req_data: error.config.data || error?.request?.data,
      res_headers: error?.response?.headers,
      req_headers: error?.config.headers,
      stack: error.stack,
    },
    null,
    '  '
  );
}

export async function isExist(path: string) {
  try {
    await fs.promises.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

export function isExistsSync(path: string) {
  return fs.existsSync(path);
}

export function isAsync(fn: Function) {
  return fn['constructor'].name === 'AsyncFunction';
}
