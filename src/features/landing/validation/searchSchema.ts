import * as z from 'zod'

export const searchSchema = z.object({
  keyword: z.string().max(100, "Maksimal 100 karakter"),
  city: z.string(),
});

export type SearchSchema = z.infer<typeof searchSchema>