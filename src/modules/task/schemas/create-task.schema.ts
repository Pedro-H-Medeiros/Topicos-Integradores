import { z } from 'zod'

export const createTaskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
})

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>
