import { ApiProperty } from '@nestjs/swagger'

export class RegisterSchemaSwagger {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: true,
  })
  name: string

  @ApiProperty({
    example: 'john.doe@email.com',
    description: 'User email',
    format: 'email',
    required: true,
  })
  email: string

  @ApiProperty({
    example: 'strongPassword@123',
    description: 'User password',
    required: true,
  })
  password: string
}
