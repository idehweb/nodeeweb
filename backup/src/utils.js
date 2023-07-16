import * as fs from "fs";
import path from "path";

export function getFileName(path, def = "backup.tar.gz") {
  return path.split("/").pop() ?? def;
}

export async function dirSize(directory) {
  const files = await fs.promises.readdir(directory);
  const stats = files.map((file) =>
    fs.promises.stat(path.join(directory, file))
  );

  const byteSize = (await Promise.all(stats)).reduce(
    (accumulator, { size }) => accumulator + size,
    0
  );
  return byteSize / 1024 ** 2;
}
