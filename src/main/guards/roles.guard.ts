// Dependencies
import { Injectable, ExecutionContext, CanActivate, PreconditionFailedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthenticationError } from 'apollo-server-express'

// Decorators
import { ROLES } from '../decorators'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Convert to GQL Conetext
  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req
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
    if (roles && !user) throw new PreconditionFailedException(
      'Requests where authentication is bypassed must not contain roles verification'
    )

    // No elegible roles
    const hasRole = () => roles.indexOf(user.role) >= 0
    if (user && user.role && hasRole()) return true

    // Authentication error
    throw new AuthenticationError(
      `Você não tem permissão como ${user.role} para acessar essa feature!`
    )
  }
}