import store from '@nodeeweb/core/store';
import { Req, Res } from '@nodeeweb/core/types/global';

export function serviceOnError(name: string) {
  return (methodName: string, err: any, req: Req, res: Res) => {
    store.systemLogger.log(
      `${name} Service ${methodName} Error: ${err.toString()}`
    );
    res.status(500).json({ message: err.toString(), error: err });
  };
}
