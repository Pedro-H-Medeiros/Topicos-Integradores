import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterSchemaSwagger } from './schemas/register-swagger.schema'
import { UserService } from './services/user.service'
import {
  RegisterUserBody,
  registerUserBodySchema,
} from './schemas/register.schema'

@ApiTags('Users')
@Controller('/person')
export class UserController {
  constructor(private uesrService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User with email already exists.' })
  @ApiBody({ type: RegisterSchemaSwagger })
  @Post('/create')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async register(@Body() body: RegisterUserBody) {
    return await this.uesrService.createUser(body)
  }
}
