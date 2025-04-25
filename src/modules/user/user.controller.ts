import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterSchemaSwagger } from './schemas/register-swagger.schema'
import { UserService } from './services/user.service'
import {
  RegisterUserBody,
  registerUserBodySchema,
} from './schemas/register.schema'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { UserPayload } from '../auth/strategies/jwt.strategy'

@ApiTags('Users')
@Controller('/person')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with email already exists.',
  })
  @ApiBody({ type: RegisterSchemaSwagger })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async register(@Body() body: RegisterUserBody) {
    return await this.userService.createUser(body)
  }

  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns current user data.',
  })
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: UserPayload) {
    await this.userService.getUserName(user)
  }
}
