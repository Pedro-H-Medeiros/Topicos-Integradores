import { Env } from '@/env'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

const userPayload = z.object({
  sub: z.string(),
})

export type UserPayload = z.infer<typeof userPayload>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['HS256'],
      secretOrKey: config.get('JWT_SECRET_KEY'),
    })
  }

  async validate(payload: UserPayload) {
    return userPayload.parse(payload)
  }
}
