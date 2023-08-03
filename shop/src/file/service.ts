import fs from 'fs';
import {
  BadRequestError,
  CRUD_DEFAULT_REQ_KEY,
  MiddleWare,
  NotFound,
  Req,
} from '@nodeeweb/core';
import { FileDocument, IFile } from '../../schema/file.schema';
import { getPublicDir } from '@nodeeweb/core/utils/path';
import { Query } from 'mongoose';
import { join } from 'path';

export class Service {
  createBodyParser(req: Req) {
    if (!req.file_path)
      throw new BadRequestError('not found any file, you must upload file');

    const files_path = getPublicDir('files', true)[0];
    const path = req.file_path.replace(files_path, '');

    const file: IFile = {
      title: req.body.title,
      type: req.file?.mimetype?.split('/')?.[0] ?? 'unknown',
      url: path.replace(/\\/g, '/'),
    };

    return file;
  }
  updateBodyParser(req: Req) {
    const files_path = getPublicDir('files', true)[0];
    const url = req.file_path
      ? req.file_path.replace(files_path, '').replace(/\\/g, '/')
      : undefined;
    return {
      url,
      title: req.body.title,
      type: req.file?.mimetype?.split('/')?.[0] ?? undefined,
    };
  }
  updateAfter: MiddleWare = async (req, res) => {
    const query = req[CRUD_DEFAULT_REQ_KEY] as Query<FileDocument, IFile>;
    query.setOptions({ new: false });
    const u = Object.fromEntries(Object.entries(query.getUpdate()));

    const oldDoc = await query.exec();
    if (!oldDoc) throw new NotFound('file not found');

    const newDoc = { ...oldDoc.toObject(), ...u };
    const oldPath = join(getPublicDir('files')[0], oldDoc.url);
    if (!req.file_path) return res.status(200).json({ data: newDoc });

    try {
      await fs.promises.rm(oldPath);
    } catch (err) {}

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

    return res.status(204).send();
  };
}

const service = new Service();
export default service;
