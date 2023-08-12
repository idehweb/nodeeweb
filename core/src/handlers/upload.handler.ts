import multer from 'multer';
import { join } from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { getPublicDir } from '../../utils/path';
import { MiddleWare, Req } from '../../types/global';
import { isExist } from '../../utils/helpers';
import { BadRequestError } from '../../types/error';

export type UploadOptions = {
  file_key?: string;
  reduce?: {
    width?: number;
    height?: number;
    format?: keyof sharp.FormatEnum;
    quality?: number;
  };
  type: 'image' | 'video' | 'audio' | 'other' | 'all';
  max_size_mb?: number;
  dir_path?: string;
  out_name?: string;
};

const IMAGE_FORMATS = [];

function isReducibleFormat(format = '') {
  return ['jpeg', 'jp2', 'jxl', 'png', 'webp', 'avif', 'tiff', 'jpg'].includes(
    format.toLowerCase()
  );
}

function convertToSharpFormat(format = '') {
  format = format.toLowerCase();
  if (format === 'jpg') format = 'jpeg';
  return isReducibleFormat(format) ? format : 'webp';
}

function getFormat(name = '') {
  return name.split('.')?.pop();
}

function getFileName(file: Express.Multer.File, custom_format?: string) {
  const format =
    custom_format ??
    getFormat(file.originalname) ??
    file.mimetype.split('/').pop() ??
    'file';

  const file_name = `${file.fieldname}-${Date.now()}.${format}`;
  return file_name;
}

function getDir(opt: UploadOptions) {
  return opt.dir_path ?? join(getPublicDir('files', true)[0], 'customer');
}

export function uploadSingle(opt: UploadOptions) {
  const dir_path = getDir(opt);
  const saveToMemory = opt.reduce && opt.type === 'image';

  const upload = multer({
    limits: {
      fileSize: opt.max_size_mb
        ? opt.max_size_mb * 1024 ** 2
        : Number.POSITIVE_INFINITY,
    },
    fileFilter(req, file, cb) {
      if (
        opt.type === 'other' ||
        opt.type === 'all' ||
        file.mimetype.startsWith(opt.type)
      )
        return cb(null, true);

      return cb(
        new BadRequestError(
          `Mime Type not accept\received:${file.mimetype}\nexpected:${opt.type}\\*`
        )
      );
    },
    storage: saveToMemory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: dir_path,
          filename(req: any, file, callback) {
            if (!file) return;
            const fn = opt.out_name ?? getFileName(file);
            req.file_path = join(dir_path, fn);
            return callback(null, fn);
          },
        }),
  });
  const mw: MiddleWare[] = [upload.single(opt.file_key ?? 'file')];
  if (opt.reduce) mw.push(reduceSingle(opt));

  return mw;
}

async function getFileBuffer(req: Req) {
  if (req.file?.buffer) return req.file.buffer;

  // read from local
  const buffer = await fs.promises.readFile(req.file_path);
  return buffer;
}

async function removeTempFile(req: Req) {
  if (
    req.old_file_path &&
    req.file_path !== req.old_file_path &&
    (await isExist(req.old_file_path))
  )
    await fs.promises.rm(req.old_file_path);
}

function reduceSingle(opt: UploadOptions): MiddleWare {
  return async (req, res, next) => {
    // there is not any file
    if (!req.file_path && !req.file) return next();

    // file saved before and format is not reducible
    if (req.file_path && !isReducibleFormat(getFormat(req.file_path)))
      return next();

    let format: any = convertToSharpFormat(
      opt.reduce.format ??
        getFormat(req.file_path ?? req.file?.originalname) ??
        'webp'
    );
    const file_path = join(
      getDir(opt),
      opt.out_name ?? getFileName(req.file, format)
    );

    let s = sharp(await getFileBuffer(req));
    if (opt.reduce.width || opt.reduce.height) {
      s = s.resize({
        fit: 'cover',
        width: opt.reduce.width,
        height: opt.reduce.height,
      });
    }

    s = s.toFormat(format)[format]({
      quality: opt.reduce.quality ?? 80,
      force: true,
    });
    await s.toFile(file_path);

    req.old_file_path = req.file_path;
    req.file_path = file_path;

    await removeTempFile(req);

    next();
  };
}
