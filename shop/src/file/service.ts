import fs from 'fs';
import {
  BadRequestError,
  CRUD,
  CRUD_DEFAULT_REQ_KEY,
  MiddleWare,
  NotFound,
  Req,
} from '@nodeeweb/core';
import { FileDocument, IFile } from '../../schema/file.schema';
import { getFilesPath, getPublicDir } from '@nodeeweb/core/utils/path';
import { FilterQuery, Query, UpdateQuery } from 'mongoose';
import { join } from 'path';
import store from '../../store';
import { PostModel } from '../../schema/post.schema';
import { ProductModel } from '../../schema/product.schema';
import { PageModel } from '../../schema/page.schema';
import { CustomerModel } from '../../schema/customer.schema';
import { AdminModel } from '../../schema/admin.schema';
import { configService } from '@nodeeweb/core/src/config/service';
import { getEntityEventName } from '@nodeeweb/core/src/handlers/entity.handler';

export class Service {
  get postModel(): PostModel {
    return store.db.model('post');
  }
  get productModel(): ProductModel {
    return store.db.model('product');
  }
  get pageModel(): PageModel {
    return store.db.model('page');
  }
  get customerModel(): CustomerModel {
    return store.db.model('customer');
  }
  get adminModel(): AdminModel {
    return store.db.model('admin');
  }

  private async updateEmbedded(file: FileDocument | IFile) {
    const filter: FilterQuery<any> = { 'photos._id': file._id };
    const update: UpdateQuery<any> = { 'photos.$': file };
    const models = [
      this.postModel,
      this.pageModel,
      this.productModel,
      this.customerModel,
      this.adminModel,
    ];

    const queries: any[] = [];

    // model queries
    queries.push(...models.map((m) => m.updateOne(filter, update)));

    // config query
    queries.push(
      (async () => {
        // favicon
        const favicon = store.config.favicons?.find((f) =>
          file._id.equals(f.id)
        );
        if (!favicon) return;
        // update config
        await configService.updateConf(
          { config: { favicon_id: file._id }, restart: false },
          true
        );
      })()
    );

    try {
      // execute queries
      await Promise.all(queries);
    } catch (err) {
      store.systemLogger.error('[FileService] error in updateEmbedded:\n', err);
    }
  }

  createBodyParser(req: Req) {
    if (!req.file_path)
      throw new BadRequestError('not found any file, you must upload file');

    const files_path = getPublicDir('files', true)[0];
    const path = req.file_path.replace(files_path, '');
    const [type, format] = req.file?.mimetype?.split('/') ?? [
      'unknown',
      'unknown',
    ];
    const file: IFile = {
      title: req.body.title,
      type,
      format,
      url: path.replace(/\\/g, '/'),
      alt: req.body.alt,
    };

    return file;
  }
  updateBodyParser(req: Req) {
    const files_path = getFilesPath();
    const url = req.file_path
      ? req.file_path.replace(files_path, '').replace(/\\/g, '/')
      : undefined;
    return {
      url,
      title: req.body.title,
      type: req.file?.mimetype?.split('/')?.[0] ?? undefined,
      alt: req.body.alt,
    };
  }
  updateAfter: MiddleWare = async (req, res) => {
    const query = req[CRUD_DEFAULT_REQ_KEY] as Query<FileDocument, IFile>;
    query.setOptions({ new: false });
    const u = Object.fromEntries(Object.entries(query.getUpdate()));

    const oldDoc = await query.exec();
    if (!oldDoc) throw new NotFound('file not found');

    const newDoc: IFile = { ...oldDoc.toObject(), ...u };
    const oldPath = join(getPublicDir('files')[0], oldDoc.url);
    if (!req.file_path) return res.status(200).json({ data: newDoc });

    try {
      await fs.promises.rm(oldPath);
    } catch (err) {}

    // update embedded
    this.updateEmbedded(newDoc);

    // call event
    store.event.emit(
      getEntityEventName('file', { post: true, type: CRUD.UPDATE_ONE }),
      newDoc,
      { type: CRUD.UPDATE_ONE, model: 'file' },
      req
    );

    return res.status(200).json({ data: newDoc });
  };

  deleteAfter: MiddleWare = async (req, res) => {
    const oldPath = join(
      getPublicDir('files')[0],
      req[CRUD_DEFAULT_REQ_KEY].url
    );
    try {
      await fs.promises.rm(oldPath);
    } catch (err) {}

    // call event
    store.event.emit(
      getEntityEventName('file', { post: true, type: CRUD.DELETE_ONE }),
      req.crud,
      { type: CRUD.DELETE_ONE, model: 'file' },
      req
    );

    return res.status(204).send();
  };
}

const service = new Service();
export default service;
