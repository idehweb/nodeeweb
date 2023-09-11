import * as fs from 'fs';
import { MiddleWare } from '../../types/global';
import { join } from 'path';
import { getPluginMarketPath } from '../../utils/path';
import { isExist } from '../../utils/helpers';
import { NotFound } from '../../types/error';
import { plugin } from 'mongoose';

class MarketService {
  async resolve(slug: string) {
    const pluginConfPath = getPluginMarketPath(slug, 'config.json');

    if (!(await isExist(pluginConfPath)))
      throw new NotFound(`${slug} not found in plugin market`);

    // resolve
    return await import(pluginConfPath);
  }

  getAll: MiddleWare = async (req, res) => {
    // path
    const pluginsConfigPath = (
      await fs.promises.readdir(getPluginMarketPath())
    ).map((slug) => getPluginMarketPath(slug, 'config.json'));

    // resolve
    const configs = await Promise.all(
      pluginsConfigPath.map((path) => import(path))
    );

    // present
    return res.json({
      data: configs.map((conf) => ({
        name: conf.name,
        description: conf.description,
        author: conf.author,
        version: conf.version,
        slug: conf.slug,
        icon: conf.icon,
        type: conf.type,
      })),
    });
  };
  getOne: MiddleWare = async (req, res) => {
    // resolve
    const conf = await this.resolve(req.params.slug);

    // present
    return res.json({
      data: {
        name: conf.name,
        description: conf.description,
        author: conf.author,
        version: conf.version,
        slug: conf.slug,
        icon: conf.icon,
        type: conf.type,
        config: { inputs: conf.config.inputs },
      },
    });
  };
}

const marketService = new MarketService();

export default marketService;
