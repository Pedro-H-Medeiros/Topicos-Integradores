import { ApiProperty } from '@nestjs/swagger'

export class UpdateTaskStatusSwagger {
  @ApiProperty({
    description: 'The current status of the task',
    enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
    default: 'TODO',
  })
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
}
