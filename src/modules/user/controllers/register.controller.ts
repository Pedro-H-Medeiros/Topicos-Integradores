import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterSchemaSwagger } from '../schemas/register.schema'

const registerControllerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type RegisterControllerSchema = z.infer<typeof registerControllerSchema>

@ApiTags('Users')
@Controller('/register')
export class RegisterController {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User with email already exists.' })
  @ApiBody({ type: RegisterSchemaSwagger })
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerControllerSchema))
  async register(@Body() body: RegisterControllerSchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.administrator.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with this email already exists.')
    }

    const passwordHash = await hash(password, 12)

    return await this.prisma.administrator.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })
  }
}
