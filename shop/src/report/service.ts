import { MiddleWare } from '@nodeeweb/core';

class Service {
  getGeneral: MiddleWare = (req, res) => {};
  getOrder: MiddleWare = () => {};
}

export default new Service();
