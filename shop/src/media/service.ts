import { BadRequestError, Req } from '@nodeeweb/core';
import { IMedia } from '../../schema/media.schema';
import { getPublicDir } from '@nodeeweb/core/utils/path';

export class Service {
  createBodyParser(req: Req) {
    if (!req.file_path)
      throw new BadRequestError('not found any file, you must upload file');

    const public_media_path = getPublicDir('public_media', true)[0];
    const path = req.file_path.replace(public_media_path, '');

    const media: IMedia = {
      title: req.body.title,
      type: req.file?.mimetype?.split('/')?.[0] ?? 'unknown',
      url: path.replace(/\\/g, '/'),
    };

    return media;
  }
}

const service = new Service();
export default service;
