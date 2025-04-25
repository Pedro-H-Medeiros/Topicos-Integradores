import { ApiProperty } from '@nestjs/swagger'

export class ActivityGroupSchemaSwagger {
  @ApiProperty({
    example: 'Activity Group Name',
    description: 'Activity Group name',
    required: true,
  })
  name: string

  @ApiProperty({
    example: 'Activity Group Description',
    description: 'Activity Group description',
    required: true,
  })
  description: string
}
