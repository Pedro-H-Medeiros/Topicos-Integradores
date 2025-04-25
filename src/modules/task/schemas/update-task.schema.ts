import { z } from 'zod'

export const updateTaskStatusBodySchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
})

export type UpdateTaskStatusBody = z.infer<typeof updateTaskStatusBodySchema>
