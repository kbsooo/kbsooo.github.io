import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/posts" }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).optional().default([]),
      description: z.string().optional().default(""),
      draft: z.boolean().optional().default(false),
      translationKey: z.string().optional(),
      author: z.union([z.string(), z.array(z.string())]).optional(),
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { posts };
