import { JwtAuthGuard } from './jwt-auth-guard'
import { RolesGuard } from './roles.guard'
import { APP_GUARD } from '@nestjs/core'

export * from './jwt-auth-guard'
export * from './roles.guard'

const GqlJwtAuthGuardProvider = {
  provide: APP_GUARD,
  useClass: JwtAuthGuard
}

const RolesGuardProvider = {
  provide: APP_GUARD,
  useClass: RolesGuard
}

export const GuardsResolvers = [
  GqlJwtAuthGuardProvider,
  RolesGuardProvider
]
