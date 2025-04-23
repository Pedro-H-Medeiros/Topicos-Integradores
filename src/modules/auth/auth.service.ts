import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthControllerPayload } from './auth.controller'
import { PrismaService } from '@/prisma/prisma.service'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser({ email, password }: AuthControllerPayload) {
    const user = await this.prisma.administrator.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials does not exists.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials does not exists.')
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id })

    return {
      access_token: accessToken,
    }
  }
}
