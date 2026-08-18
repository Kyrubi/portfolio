import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const galleryMediaItem = z.object({
	title: z.string(),
	src: z.string().optional(),
	gradientFallback: z.string().optional(),
	caption: z.string().optional(),
	badge: z.string().optional()
});

const metric = z.object({
	label: z.string(),
	value: z.string()
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		year: z.number(),
		tags: z.array(z.string()),
		summary: z.string(),
		coverImage: z.string().optional(),
		externalLink: z.url().optional(),
		category: z.string().optional(),
		role: z.string().optional(),
		client: z.string().optional(),
		teamSize: z.string().optional(),
		duration: z.string().optional(),
		stack: z.array(z.string()).optional(),
		gallery: z.array(galleryMediaItem).optional(),
		metrics: z.array(metric).optional()
	})
});

export const collections = { projects };
