import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { z } from 'zod'
import { AuthService } from './auth.service'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthSchemaSwagger } from './schemas/auth.schema'
import { Public } from './decorators/public.decorator'
import { Response } from 'express'

const authControllerPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthControllerPayload = z.infer<typeof authControllerPayloadSchema>

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate User' })
  @ApiResponse({
    status: 201,
    description: 'User is successfully authenticated.',
  })
  @ApiResponse({
    status: 409,
    description: 'User credential does not match.',
  })
  @ApiBody({ type: AuthSchemaSwagger })
  @Public()
  @Post('/sign-in')
  @HttpCode(201)
  signIn(
    @Body() body: AuthControllerPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.validateUser(body, response)
  }
}
