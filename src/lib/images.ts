import type { ImageMetadata } from "astro";

// Final editorial assets, founder project screenshots, and the remaining small template icons live here.
// Older .jpg/.png references resolve to their pre-optimised WebP equivalents.
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
