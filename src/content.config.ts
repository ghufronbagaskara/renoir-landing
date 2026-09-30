import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { services } from "./content/services";
import { portfolio, workServiceIds } from "./content/portfolio";

// Image fields are paths relative to src/assets/img (resolved by ~/lib/images).
const img = z.string().regex(/\.(jpe?g|png|webp|svg)$/);
const qa = z.object({ question: z.string(), answer: z.string() });

// SERP-friendly bounds (title 30–65, description 70–200) — see AGENTS.md "SEO".
const metaTitle = z.string().min(30).max(65);
const metaDescription = z.string().min(70).max(200);

const serviceCopy = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  metaTitle,
  metaDescription,
  excerpt: z.string(),
  tagline: z.string(),
  heading: z.string(),
  intro: z.array(z.string()).length(2),
  summary: z.string(),
  lists: z.array(z.array(z.string())).length(2),
  formTitle: z.string(),
  faq: z.array(qa),
});

const workCopy = z.object({
  title: z.string(),
  subtitle: z.string(),
  overview: z.string(),
  challenge: z.string(),
  approach: z.string(),
  role: z.string(),
  tags: z.array(z.string()).min(1),
});

const featureCopy = z.object({ title: z.string(), body: z.string(), caption: z.string() });

export const collections = {
  services: defineCollection({
    loader: () => services,
    schema: z.object({
      order: z.number(),
      build: z.enum(["marketing", "internal", "design", "both", "unsure"]),
      thumb: img,
      images: z.array(z.object({
        src: img,
        kind: z.enum(["editorial", "proof"]),
        alt: z.object({ en: z.string(), id: z.string() }),
        caption: z.object({ en: z.string(), id: z.string() }),
      })).min(1).max(3),
      en: serviceCopy,
      id_: serviceCopy,
    }),
  }),
  // Notes: src/content/notes/<locale>/<slug>.md. Entry id = "<locale>/<slug>".
  notes: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/notes" }),
    schema: z.object({
      title: metaTitle,
      description: metaDescription,
      date: z.coerce.date(),
      category: z.string(),
      translationKey: z.string(),
      image: img,
      listImage: img,
      cardImage: img,
      thumb: img,
    }),
  }),
  portfolio: defineCollection({
    loader: () => portfolio,
    schema: z.object({
      order: z.number(),
      primaryService: z.enum(workServiceIds),
      serviceIds: z.array(z.enum(workServiceIds)).min(1),
      featuredRank: z.number().int().positive().optional(),
        homeRank: z.number().int().positive().optional(),
      desktopImage: img,
      mobileImage: img,
      pairImage: img,
      features: z.array(z.object({ image: img.optional(), en: featureCopy, id_: featureCopy })).min(1),
      imageNote: z.object({ en: z.string(), id_: z.string() }).optional(),
      year: z.string().optional(),
      en: workCopy,
      id_: workCopy,
    }),
  }),
};
