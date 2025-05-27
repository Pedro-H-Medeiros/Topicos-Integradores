import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthControllerPayload } from './auth.controller'
import { PrismaService } from '@/prisma/prisma.service'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser(body: AuthControllerPayload, response: Response) {
    const { email, password } = body

    const user = await this.prisma.administrator.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials does not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials does not match.')
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id })

    response.cookie('sessionId', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
    })

    return {
      access_token: accessToken,
    }
  }

  async logout(res: Response) {
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    return { message: 'Logout realizado com sucesso.' }
  }
}
