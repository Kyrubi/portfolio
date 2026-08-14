import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		year: z.number(),
		tags: z.array(z.string()),
		summary: z.string(),
		coverImage: z.string().optional(),
		externalLink: z.url().optional(),
		featured: z.boolean().default(false)
	})
});

export const collections = { projects };
