// Dependencies
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

// Domain Protocols
import { RoleEnum } from '@/domain/protocols'
import { JwtAuthGuard, RolesGuard } from '../guards'

export const ROLES = 'ROLES'
export const Role = RoleEnum
export const Roles = (...roles: string[]) =>
  applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
