// Dependencies
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

// Payload
import { TokenPayload } from '@/data/protocols'

// Envs
import { options } from '@/main/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: options.SECRET
    })
  }

  async validate(payload: TokenPayload) {
    return { ...payload }
  }
}