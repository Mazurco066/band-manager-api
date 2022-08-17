// Dependencies
import { Injectable, ExecutionContext, CanActivate, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

// Decorators
import { ROLES } from '../decorators'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Convert to GQL Conetext
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }

  // Validates role decorator
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES, [
      context.getHandler(),
      context.getClass()
    ])

    // Any role allowed
    if (!roles || !roles.length)  return true
    
    // Verify if public routes contains decorator
    const { user } = this.getRequest(context)
    if (roles && !user) throw new HttpException(
      'Requests where authentication is bypassed must not contain roles verification',
      HttpStatus.UNAUTHORIZED
    )

    // No elegible roles
    const hasRole = () => roles.indexOf(user.role) >= 0
    if (user && user.role && hasRole()) return true

    // Authentication error
    throw new HttpException(
      `Você não tem permissão como ${user.role} para acessar esse recurso!`,
      HttpStatus.UNAUTHORIZED
    )
  }
}