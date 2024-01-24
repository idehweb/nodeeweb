import { MiddleWare, Req } from '@nodeeweb/core/types/global';
import { PluginStatus } from '../../schema/plugin.schema';
import { EntityCreator } from '@nodeeweb/core';

export default class Service {
  async getParseFilter(req: Req) {
    const baseFilter = await new EntityCreator('').parseFilterQuery({}, req);
    return { ...baseFilter, status: PluginStatus.Active };
  }
  getProject() {
    return 'name description slug type version';
  }
}
