import { registerPlugin } from '@nodeeweb/core/src/handlers/plugin.handler';
import bankGatewayPlugin from '../../plugins/bankGateway';
import postGatewayPlugin from '../../plugins/postGateway';

export function handlePlugins() {
  const bankP = bankGatewayPlugin();
  const postP = postGatewayPlugin();

  registerPlugin(
    { stack: bankP, name: '', slug: '', type: '' },
    { from: 'ShopPlugins' }
  );
  registerPlugin(
    { name: '', slug: '', type: '', stack: postP },
    { from: 'ShopPlugins' }
  );
}
