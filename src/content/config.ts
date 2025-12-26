import { defineCollection, z } from 'astro:content'

// Define schema for dashboard data
const dashboardCollection = defineCollection({
  type: 'data',
  schema: z.object({
    timestamp: z.string(),
    data: z.record(z.unknown()),
  }),
})

export const collections = {
  dashboard: dashboardCollection,
}
