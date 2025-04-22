import { ApiProperty } from '@nestjs/swagger'

export class CreateTaskSchemaSwagger {
  @ApiProperty({
    description: 'The title of the task',
    type: String,
    required: true,
  })
  title: string

  @ApiProperty({
    description: 'The description of the task',
    type: String,
    required: true,
  })
  description: string

  @ApiProperty({
    description: 'The current status of the task',
    enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
    default: 'TODO',
  })
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
}
