import { z } from 'zod'

export const createGroupControllerSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export type CreateGroupControllerBody = z.infer<
  typeof createGroupControllerSchema
>
