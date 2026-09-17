import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { services } from "./content/services";
import { team } from "./content/team";
import { portfolio } from "./content/portfolio";
import { blog } from "./content/blog";

// Image fields are paths relative to src/assets/img (resolved by ~/lib/images).
const img = z.string().regex(/\.(jpe?g|png|webp|svg)$/);

export const collections = {
  services: defineCollection({
    loader: () => services,
    schema: z.object({
      order: z.number(),
      title: z.string(),
      excerpt: z.string(),
      thumb: img,
      tagline: z.string(),
      heading: z.string(),
      intro: z.array(z.string()),
      summary: z.string(),
      benefitsTitle: z.string(),
      benefitsIntro: z.string(),
      benefits: z.array(z.array(z.string())).length(2),
      images: z.array(img).length(3),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })),
    }),
  }),
  team: defineCollection({
    loader: () => team,
    schema: z.object({
      order: z.number(),
      name: z.string(),
      role: z.string(),
      image: img,
      detailImage: img,
      bio: z.string(),
      quote: z.string(),
      email: z.email(),
      phone: z.string(),
      socials: z.record(z.string(), z.url()),
    }),
  }),
  portfolio: defineCollection({
    loader: () => portfolio,
    schema: z.object({
      order: z.number(),
      title: z.string(),
      image: img,
      featured: z.number().optional(),
      featuredImage: img.optional(),
      heroImage: img,
      gallery: z.array(img).length(3),
      overview: z.string(),
      challenge: z.string(),
      result: z.string(),
      info: z.object({ category: z.string(), software: z.string(), service: z.string(), client: z.string(), date: z.string() }),
      tags: z.array(z.string()),
      category: z.string(),
      subtitle: z.string(),
      year: z.string(),
    }),
  }),
  blog: defineCollection({
    loader: () => blog,
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string(),
      author: z.string(),
      listImage: img,
      cardImage: img,
      thumb: img,
      image: img,
      lead: z.string(),
      leadNote: z.string(),
      quote: z.object({ text: z.string(), author: z.string() }),
      paragraphs: z.array(z.string()),
      gallery: z.array(img).length(2),
      closing: z.array(z.string()),
      tags: z.array(z.string()),
    }),
  }),
};
