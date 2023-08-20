import { MiddleWare } from '../../types/global';

class MarketService {
  getAll: MiddleWare = async () => {};
  getOne: MiddleWare = () => {};
}

const marketService = new MarketService();

export default marketService;
