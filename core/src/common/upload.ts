import multer from "multer";
import { join } from "path";
import { getStaticDir } from "../../utils/path";
import { MiddleWare } from "../../types/global";
import sharp from "sharp";

export type UploadOptions = {
  file_key?: string;
  reduce?: {
    width?: number;
    height?: number;
    format?: keyof sharp.FormatEnum;
    quality?: number;
  };
  type: "image" | "video" | "audio" | "other";
  max_size_mb?: number;
  dir_path?: string;
  out_name?: string;
};

function getFileName(file: Express.Multer.File, custom_format?: string) {
  const format =
    custom_format ??
    file.originalname.split(".")?.pop() ??
    file.mimetype.split("/").pop() ??
    "file";

  const file_name = `${file.fieldname}-${Date.now()}.${format}`;
  return file_name;
}

function getDir(opt: UploadOptions) {
  return (
    opt.dir_path ?? join(getStaticDir("public_media", true)[0], "customer")
  );
}

export function uploadSingle(opt: UploadOptions) {
  const dir_path = getDir(opt);
  const upload = multer({
    limits: {
      fileSize: opt.max_size_mb
        ? opt.max_size_mb * 1024 ** 2
        : Number.POSITIVE_INFINITY,
    },
    fileFilter(req, file, cb) {
      if (opt.type === "other" || file.mimetype.startsWith(opt.type))
        return cb(null, true);

      return cb(
        new Error(
          `Mime Type not accept\received:${file.mimetype}\nexpected:${opt.type}\\*`
        )
      );
    },
    storage: opt.reduce
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: dir_path,
          filename(req: any, file, callback) {
            const fn = opt.out_name ?? getFileName(file);
            req.file_path = join(dir_path, fn);
            return callback(null, fn);
          },
        }),
  });
  const mw = [upload.single(opt.file_key ?? "file")];
  if (opt.reduce) mw.push(reduceSingle(opt));

  return mw;
}

function reduceSingle(opt: UploadOptions): MiddleWare {
  return async (req, res, next) => {
    const format = opt.reduce.format ?? "webp";
    const file_path = join(
      getDir(opt),
      opt.out_name ?? getFileName(req.file, format)
    );

    let s = sharp(req.file.buffer);

    if (opt.reduce.width || opt.reduce.height) {
      s = s.resize({
        fit: "cover",
        width: opt.reduce.width,
        height: opt.reduce.height,
      });
    }

    s = s.toFormat(format)[format]({
      quality: opt.reduce.quality ?? 80,
      force: true,
    });
    await s.toFile(file_path);

    req.file_path = file_path;

    next();
  };
}
