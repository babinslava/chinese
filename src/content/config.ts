import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    id: z.string(),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
});

export const collections = { lessons };
