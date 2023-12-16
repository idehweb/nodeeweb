import { Req } from '../../types/global';

class Service {
  parseUpdateBody(req: Req) {
    return req.body;
  }

  parseFilter(req: Req) {
    return {};
  }
}

export default new Service();
