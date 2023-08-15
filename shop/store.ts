import { store as coreStore } from '@nodeeweb/core';
import { Store } from '@nodeeweb/core/store';
import { ConfigType } from '@nodeeweb/core/types/config';
import { ShopConfigDto } from './dto/config';

export class ShopStore extends Store {
  config: ConfigType<ShopConfigDto>;
}

const store = coreStore as ShopStore;
export default store;
