import type { ImageMetadata } from "astro";

// Every template image lives under src/assets/img (mirrored from the demo, pre-converted to WebP by
// scripts/optimize-images.ts). Components reference them by the template's own file name,
// e.g. "banner/banner-1.jpg"; raster names resolve to the .webp file.
const modules = import.meta.glob<{ default: ImageMetadata }>("/src/assets/img/**/*.{webp,svg,gif}", { eager: true });

export function imageMeta(path: string): ImageMetadata {
  const file = path.replace(/\.(jpe?g|png)$/i, ".webp");
  const mod = modules[`/src/assets/img/${file}`];
  if (!mod) throw new Error(`Missing image: src/assets/img/${file}`);
  return mod.default;
}

/** Hashed URL for CSS backgrounds and links. */
export const imageUrl = (path: string) => imageMeta(path).src;

export const imageUrls = (paths: string[]) => Object.fromEntries(paths.map((p) => [p, imageUrl(p)]));
