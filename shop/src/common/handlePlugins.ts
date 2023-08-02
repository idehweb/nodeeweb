import { registerPlugin } from '@nodeeweb/core/src/handlers/plugin.handler';
import bankGatewayPlugin from '../../plugins/bankGateway';
import postGatewayPlugin from '../../plugins/postGateway';

export function handlePlugins() {
  const bankP = bankGatewayPlugin();
  const postP = postGatewayPlugin();

  registerPlugin(bankP.type, bankP.content, { from: 'ShopPlugins' });
  registerPlugin(postP.type, postP.content, { from: 'ShopPlugins' });
}
