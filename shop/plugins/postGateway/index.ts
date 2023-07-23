import { Plugin } from '@nodeeweb/core/types/plugin';
import {
  PostGatewayCalcPrice,
  PostGatewayPluginContent,
  PostGatewaySendPostReq,
  PostProvider,
  ShopPluginType,
} from '../../types/plugin';

const submitPostReq: PostGatewaySendPostReq = async () => {
  return { price: 0, provider: PostProvider.Manual };
};

const calcPost: PostGatewayCalcPrice = async () => {
  return { price: 0, provider: PostProvider.Manual };
};

const postGatewayPlugin: Plugin = () => {
  const content: PostGatewayPluginContent = {
    name: 'shop-post-gateway',
    stack: [submitPostReq, calcPost],
  };
  return {
    type: ShopPluginType.POST_GATEWAY,
    content,
  };
};

export default postGatewayPlugin;
