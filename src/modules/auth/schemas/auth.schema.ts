import { ApiProperty } from '@nestjs/swagger'

export class AuthSchemaSwagger {
  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'User email',
    format: 'email',
    required: true,
  })
  email: string

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
    required: true,
  })
  password: string
}
