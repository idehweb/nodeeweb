import * as fs from 'fs';

import { CoreConfigBody, Favicon } from '../../dto/config';
import { FileDocument, FileModel } from '../../schema/file.schema';
import store from '../../store';
import { BadRequestError, GeneralError } from '../../types/error';
import { MiddleWare } from '../../types/global';
import { getPublicDir } from '../../utils/path';
import { join } from 'path';

class ConfigService {
  protected get fileModel(): FileModel {
    return store.db.model('file');
  }

  get: MiddleWare = async (req, res) => {
    return res.json({ data: store.config });
  };

  async handleFavicon(newFile: FileDocument) {
    const filesPath = getPublicDir('files', true)[0];
    const sourcePath = join(filesPath, newFile.url);
    const sourceFormat = sourcePath.split('.').pop() ?? 'ico';
    const distName = `favicon.${sourceFormat}`;
    const distPath = join(filesPath, distName);

    // copy and overwritten
    await fs.promises.copyFile(sourcePath, distPath);

    return {
      id: newFile._id.toString(),
      source: newFile.url,
      dist: `/${distName}`,
    } as Favicon;
  }

  async updateConf(body: CoreConfigBody, emit = true) {
    if (!store.config) throw new GeneralError('config not resister yet!', 500);

    if (body.config.favicon_id) {
      const file = await this.fileModel.findById(body.config.favicon_id);
      if (!file) throw new BadRequestError('favicon not found in files');

      const favicon = await this.handleFavicon(file);
      body.config.favicons = [favicon];
      delete body.config.favicon_id;
    }

    await store.config.change(body.config, {
      merge: true,
      restart: body.restart ?? false,
      external_wait: true,
      internal_wait: false,
    });

    if (emit) {
      store.event.emit('config-update', body);
    }
  }

  update: MiddleWare = async (req, res) => {
    const body: CoreConfigBody = req.body;

    await this.updateConf(body);

    return res.status(200).json({ data: store.config });
  };

  getWebConf: MiddleWare = (req, res) => {
    const config = store.config.getPublic();
    const templates = store.templates;
    const routes = store.routes;

    return res.status(200).json({ data: { config, templates, routes } });
  };
  getAdminDashConf: MiddleWare = (req, res) => {
    return res.status(200).json({ data: store.adminViews });
  };
}

export const configService = new ConfigService();
