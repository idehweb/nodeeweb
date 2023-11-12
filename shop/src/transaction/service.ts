import { Req } from '@nodeeweb/core';

class Service {
  parseCountFilter(req: Req) {
    return {};
  }
  parseGetAllFilter(req: Req) {
    return {};
  }
  parseGetOneFilter(req: Req) {
    return {};
  }
  parseCreateBody(req: Req) {
    return req.body;
  }
  parseUpdateBody(req: Req) {
    return req.body;
  }
}

export default new Service();
