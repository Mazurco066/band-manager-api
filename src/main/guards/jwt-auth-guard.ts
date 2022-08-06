// Dependencies
import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

// Decorators
import { SKIP_AUTH } from '../decorators'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  // Convert to GQL Conetext
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }

  // Verify if auth is skipped
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass()
    ])

    // If auth is skiped
    if (skipAuth) return true

    // Verify if routes contains decorator
    const {
      headers: { authorization }
    } = this.getRequest(context)

    if (authorization?.split(' ')[0] !== 'Bearer')
      throw new HttpException(
        'Requests where authentication is bypassed must not contain token verification',
        HttpStatus.UNAUTHORIZED
      )

    // Validate token
    return super.canActivate(context)
  }
}
