import { rename, writeFile } from "node:fs/promises";

// Replace completed assets atomically so Windows readers cannot lock a partial write.
export async function writeImage(destination: string, image: Buffer) {
  const temporary = `${destination}.${process.pid}.tmp`;
  await writeFile(temporary, image);
  await rename(temporary, destination);
}
